#!/usr/bin/env node
/**
 * OpenCode Engineering Harness CLI
 *
 * Commands:
 *   plan     Read-only inspection of what would be installed
 *   install  Install managed artifacts into the target OpenCode config root
 *   check    Report drift between installed artifacts and the packaged version
 *
 * Options:
 *   --target <dir>   Target configuration root
 *                    Default: $XDG_CONFIG_HOME/opencode, then $HOME/.config/opencode
 *   --dry-run        Simulate install without writing (valid only with install)
 *   --json           Output machine-readable JSON
 *   --help           Show usage and exit
 *   --version        Print version and exit
 *
 * Strict parsing rules:
 *   - Unknown options are rejected (exit 3)
 *   - --target requires a non-empty value that is not itself an option flag
 *   - --dry-run is valid only with install
 *   - --target, --json are valid with plan, install, and check
 *   - Multiple positional commands are rejected
 *   - Parsing errors never trigger default installation behavior
 */

import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { computePlan } from '../src/installer/plan.js';
import { install } from '../src/installer/install.js';
import { check } from '../src/installer/check.js';
import { formatPlan, formatInstall, formatCheck, EXIT } from '../src/installer/output.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(__dirname, '..');

const require = createRequire(import.meta.url);
const pkg = require('../package.json');

const VALID_COMMANDS = new Set(['plan', 'install', 'check']);

const USAGE = `
OpenCode Engineering Harness v${pkg.version}

Usage:
  opencode-engineering-harness <command> [options]

Commands:
  plan     Show what would be installed or changed (read-only)
  install  Install managed artifacts into the target configuration root
  check    Report drift between installed artifacts and the packaged version

Options:
  --target <dir>   Target OpenCode configuration root
                   Default: $XDG_CONFIG_HOME/opencode  (when XDG_CONFIG_HOME is set)
                         or $HOME/.config/opencode
  --dry-run        Simulate install without writing any files (install only)
  --json           Output machine-readable JSON
  --help           Show this help message
  --version        Print the package version

Exit codes:
  0  — OK: success, no conflicts
  1  — DRIFT: check detected drift or missing / invalid manifest
  2  — CONFLICT: plan or install blocked by a conflict
  3  — INVALID: unknown option, invalid invocation, or unsafe target
  4  — FAILURE: unexpected internal failure
`.trim();

/**
 * Parse and strictly validate CLI arguments.
 * Returns a result object with either opts or an error.
 *
 * @param {string[]} argv
 */
function parseArgs(argv) {
  const args = argv.slice(2);

  /** @type {{ target?: string, dryRun: boolean, json: boolean, command: string|null }} */
  const opts = {
    command: null,
    target: undefined,
    dryRun: false,
    json: false,
  };

  const unknownFlags = [];
  const extraCommands = [];
  let i = 0;

  while (i < args.length) {
    const arg = args[i];

    if (arg === '--help' || arg === '-h') {
      return { help: true };
    }

    if (arg === '--version' || arg === '-v') {
      return { version: true };
    }

    if (arg === '--dry-run') {
      opts.dryRun = true;
    } else if (arg === '--json') {
      opts.json = true;
    } else if (arg === '--target') {
      const val = args[++i];
      if (val === undefined) {
        return {
          error: '--target requires a directory path argument but none was provided.',
          exitCode: EXIT.INVALID,
        };
      }
      if (val.startsWith('-')) {
        return {
          error: `--target requires a directory path, got option flag "${val}".`,
          exitCode: EXIT.INVALID,
        };
      }
      opts.target = val;
    } else if (!arg.startsWith('-')) {
      if (!opts.command) {
        opts.command = arg;
      } else {
        extraCommands.push(arg);
      }
    } else {
      unknownFlags.push(arg);
    }

    i++;
  }

  if (unknownFlags.length > 0) {
    return {
      error: `Unknown option(s): ${unknownFlags.join(', ')}`,
      exitCode: EXIT.INVALID,
    };
  }

  if (extraCommands.length > 0) {
    return {
      error: `Unexpected additional argument(s): ${extraCommands.join(', ')}`,
      exitCode: EXIT.INVALID,
    };
  }

  if (!opts.command) {
    return { help: true };
  }

  if (!VALID_COMMANDS.has(opts.command)) {
    return {
      error: `Unknown command: "${opts.command}". Valid commands: plan, install, check`,
      exitCode: EXIT.INVALID,
    };
  }

  if (opts.dryRun && opts.command !== 'install') {
    return {
      error: `--dry-run is only valid with the install command, not "${opts.command}".`,
      exitCode: EXIT.INVALID,
    };
  }

  return { opts };
}

function main() {
  const parsed = parseArgs(process.argv);

  if (parsed.version) {
    process.stdout.write(pkg.version + '\n');
    process.exit(EXIT.OK);
  }

  if (parsed.help || !parsed.opts) {
    if (parsed.error) {
      process.stderr.write(`Error: ${parsed.error}\n\n${USAGE}\n`);
      process.exit(parsed.exitCode ?? EXIT.INVALID);
    }
    process.stdout.write(USAGE + '\n');
    process.exit(EXIT.OK);
  }

  const { opts } = parsed;

  const shared = {
    target: opts.target,
    packageRoot,
    packageVersion: pkg.version,
    packageName: pkg.name,
  };

  try {
    if (opts.command === 'plan') {
      const result = computePlan(shared);
      const { exitCode, output } = formatPlan(result, { json: opts.json });
      process.stdout.write(output + '\n');
      process.exit(exitCode);

    } else if (opts.command === 'install') {
      const result = install({ ...shared, dryRun: opts.dryRun });
      const { exitCode, output } = formatInstall(result, { json: opts.json });
      process.stdout.write(output + '\n');
      process.exit(exitCode);

    } else if (opts.command === 'check') {
      const result = check(shared);
      const { exitCode, output } = formatCheck(result, { json: opts.json });
      process.stdout.write(output + '\n');
      process.exit(exitCode);
    }

  } catch (err) {
    const isTargetError = err.message && (
      err.message.startsWith('Rejected') ||
      err.message.startsWith('Refused') ||
      err.message.startsWith('Cannot resolve') ||
      err.message.startsWith('--target') ||
      err.message.includes('too short') ||
      err.message.includes('traversal') ||
      err.message.includes('empty or blank')
    );

    const exitCode = isTargetError ? EXIT.INVALID : EXIT.FAILURE;

    if (opts.json) {
      const obj = {
        command: opts.command,
        status: 'error',
        // No stack traces in default output
        errors: [err.message],
      };
      process.stderr.write(JSON.stringify(obj, null, 2) + '\n');
    } else {
      process.stderr.write(`Error: ${err.message}\n`);
    }

    process.exit(exitCode);
  }
}

main();
