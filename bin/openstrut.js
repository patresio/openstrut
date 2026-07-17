#!/usr/bin/env node
/**
 * OpenStrut CLI
 *
 * Commands:
 *   plan     Read-only inspection of what would be installed
 *   install  Install managed artifacts into the target OpenCode config root
 *   check    Report drift between installed artifacts and the packaged version
 *   setup    Configure OpenStrut for one or more agentic LLM CLIs
 *
 * Options:
 *   --target <dir>   Target configuration root
 *                    Default: $XDG_CONFIG_HOME/opencode, then $HOME/.config/opencode
 *   --dry-run        Simulate install/setup without writing
 *   --json           Output machine-readable JSON
 *   --cli <ids>      Comma-separated CLI ids for setup (non-interactive)
 *   --home <dir>     Home root for setup path expansion (tests / isolation)
 *   --help           Show usage and exit
 *   --version        Print version and exit
 *
 * Strict parsing rules:
 *   - Unknown options are rejected (exit 3)
 *   - --target requires a non-empty value that is not itself an option flag
 *   - --dry-run is valid with install and setup
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
import { generate } from '../src/manifest/generate.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(__dirname, '..');

const require = createRequire(import.meta.url);
const pkg = require('../package.json');

import { parseWorkflow, parseWorkflowSteps } from '../src/workflows/parse.js';
import { collectWorkflowErrors } from '../src/workflows/validate.js';
import { INVENTORY } from '../src/installer/inventory.js';
import { runSetup } from '../src/setup/index.js';

const VALID_COMMANDS = new Set(['plan', 'install', 'check', 'generate-manifest', 'workflow', 'setup']);

// ─── Splash screen ─────────────────────────────────────────────────────────

const SPLASH = `
\x1b[36m  ___                    ____  _              _   \x1b[0m
\x1b[36m / _ \\ _ __   ___  _ __ / ___|| |_ _   _ _ __| |_ \x1b[0m
\x1b[36m| | | | '_ \\ / _ \\| '_ \\\\___ \\| __| | | | '__| __|\x1b[0m
\x1b[36m| |_| | |_) |  __/| | | |___) | |_| |_| | |  | |_ \x1b[0m
\x1b[36m \\___/| .__/ \\___||_| |_|____/ \\__|\\__,_|_|   \\__|\x1b[0m
\x1b[36m      |_|                                          \x1b[0m
\x1b[90m====================================================\x1b[0m
\x1b[37m    Auditable Engineering Harness & Safe Installer\x1b[0m
\x1b[90m====================================================\x1b[0m
`.trim();

function showSplash() {
  if (process.stdout.isTTY) {
    process.stdout.write(SPLASH + '\n\n');
  }
}

const USAGE = `
OpenStrut v${pkg.version}

Usage:
  openstrut <command> [options]

Commands:
  plan              Show what would be installed or changed (read-only)
  install           Install managed artifacts into the target configuration root
  check             Report drift between installed artifacts and the packaged version
  generate-manifest Generate an execution-manifest.yaml for an approved OpenSpec change
  workflow          Manage workflow definitions (list, validate, run)
  setup             Configure OpenStrut for supported agentic LLM CLIs (TUI or --cli)

Options:
  --target <dir>    Target OpenCode configuration root (plan, install, check)
                    Default: $XDG_CONFIG_HOME/opencode  (when XDG_CONFIG_HOME is set)
                          or $HOME/.config/opencode
  --change <dir>    Path to the OpenSpec change directory (generate-manifest only)
  --cli <ids>       Comma-separated CLI ids for setup (e.g. opencode,codex)
  --home <dir>      Alternate home for setup path expansion (tests / isolation)
  --dry-run         Simulate install/setup without writing any files
  --json            Output machine-readable JSON
  --help            Show this help message
  --version         Print the package version

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

  /** @type {{ target?: string, change?: string, home?: string, cli?: string, dryRun: boolean, json: boolean, command: string|null, args: string[] }} */
  const opts = {
    command: null,
    target: undefined,
    change: undefined,
    home: undefined,
    cli: undefined,
    dryRun: false,
    json: false,
    args: [],
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
    } else if (arg === '--change') {
      const val = args[++i];
      if (val === undefined) {
        return {
          error: '--change requires a directory path argument but none was provided.',
          exitCode: EXIT.INVALID,
        };
      }
      if (val.startsWith('-')) {
        return {
          error: `--change requires a directory path, got option flag "${val}".`,
          exitCode: EXIT.INVALID,
        };
      }
      opts.change = val;
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
    } else if (arg === '--home') {
      const val = args[++i];
      if (val === undefined) {
        return {
          error: '--home requires a directory path argument but none was provided.',
          exitCode: EXIT.INVALID,
        };
      }
      if (val.startsWith('-')) {
        return {
          error: `--home requires a directory path, got option flag "${val}".`,
          exitCode: EXIT.INVALID,
        };
      }
      opts.home = val;
    } else if (arg === '--cli') {
      const val = args[++i];
      if (val === undefined) {
        return {
          error: '--cli requires a comma-separated list of CLI ids.',
          exitCode: EXIT.INVALID,
        };
      }
      if (val.startsWith('-')) {
        return {
          error: `--cli requires CLI ids, got option flag "${val}".`,
          exitCode: EXIT.INVALID,
        };
      }
      opts.cli = val;
    } else if (!arg.startsWith('-')) {
      if (!opts.command) {
        opts.command = arg;
      } else if (opts.command === 'workflow') {
        opts.args.push(arg);
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
      error: `Unknown command: "${opts.command}". Valid commands: plan, install, check, generate-manifest, workflow, setup`,
      exitCode: EXIT.INVALID,
    };
  }

  if (opts.dryRun && opts.command !== 'install' && opts.command !== 'setup') {
    return {
      error: `--dry-run is only valid with install or setup, not "${opts.command}".`,
      exitCode: EXIT.INVALID,
    };
  }

  if (opts.change && opts.command !== 'generate-manifest') {
    return {
      error: `--change is only valid with the generate-manifest command, not "${opts.command}".`,
      exitCode: EXIT.INVALID,
    };
  }

  if (opts.cli && opts.command !== 'setup') {
    return {
      error: `--cli is only valid with the setup command, not "${opts.command}".`,
      exitCode: EXIT.INVALID,
    };
  }

  if (opts.home && opts.command !== 'setup') {
    return {
      error: `--home is only valid with the setup command, not "${opts.command}".`,
      exitCode: EXIT.INVALID,
    };
  }

  if (opts.command === 'generate-manifest' && !opts.change) {
    return {
      error: '--change <dir> is required for the generate-manifest command.',
      exitCode: EXIT.INVALID,
    };
  }

  return { opts };
}

async function main() {
  const parsed = parseArgs(process.argv);

  if (parsed.version) {
    process.stdout.write(pkg.version + '\n');
    process.exit(EXIT.OK);
  }

  if (parsed.help || !parsed.opts) {
    if (parsed.error) {
      showSplash();
      process.stderr.write(`Error: ${parsed.error}\n\n${USAGE}\n`);
      process.exit(parsed.exitCode ?? EXIT.INVALID);
    }
    showSplash();
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
      showSplash();
      const result = install({ ...shared, dryRun: opts.dryRun });
      const { exitCode, output } = formatInstall(result, { json: opts.json });
      process.stdout.write(output + '\n');
      process.exit(exitCode);

    } else if (opts.command === 'check') {
      const result = check(shared);
      const { exitCode, output } = formatCheck(result, { json: opts.json });
      process.stdout.write(output + '\n');
      process.exit(exitCode);

    } else if (opts.command === 'setup') {
      showSplash();
      const cliIds = opts.cli
        ? opts.cli.split(',').map((s) => s.trim()).filter(Boolean)
        : undefined;
      const result = await runSetup({
        homeDir: opts.home,
        cliIds,
        dryRun: opts.dryRun,
        interactive: !cliIds,
      });
      if (opts.json) {
        process.stdout.write(JSON.stringify({
          command: 'setup',
          status: result.ok ? (result.cancelled ? 'cancelled' : 'ok') : 'error',
          configured: (result.configured ?? []).map((r) => ({
            id: r.id,
            ok: r.ok,
            path: r.path,
            backup: r.backup ?? null,
            dryRun: r.dryRun ?? false,
            error: r.error,
          })),
          error: result.error,
        }, null, 2) + '\n');
      } else if (result.cancelled) {
        process.stdout.write('Setup cancelled.\n');
      } else if (!result.ok) {
        process.stderr.write(`Error: ${result.error}\n`);
        process.exit(EXIT.INVALID);
      } else {
        for (const r of result.configured) {
          const verb = r.dryRun ? 'would write' : 'wrote';
          process.stdout.write(`${verb}: ${r.path}${r.backup ? ` (backup: ${r.backup})` : ''}\n`);
        }
        process.stdout.write(`Configured ${result.configured.length} CLI(s).\n`);
      }
      process.exit(EXIT.OK);

  } else if (opts.command === 'generate-manifest') {
    const changeDir = path.resolve(opts.change);

    let gitRoot;
    try {
      gitRoot = require('node:child_process').execSync('git rev-parse --show-toplevel', { cwd: changeDir, encoding: 'utf8', stdio: 'pipe' }).trim();
    } catch (err) {
      process.stderr.write('BLOCKED — NON-CANONICAL CHANGE PATH: not inside a git repository\n');
      process.exit(EXIT.CONFLICT);
    }

    const changeDirName = path.basename(changeDir);
    const expectedPath = path.join(gitRoot, 'openspec', 'changes', changeDirName);

    if (changeDir !== expectedPath) {
      process.stderr.write(`BLOCKED — NON-CANONICAL CHANGE PATH: expected ${expectedPath}, got ${changeDir}\n`);
      process.exit(EXIT.CONFLICT);
    }

    const result = generate({ changeDir, packageRoot });
    if (!result.ok) {
      process.stderr.write(result.errors.join('\n') + '\n');
      process.exit(EXIT.CONFLICT);
    }
    process.stdout.write(`Generated: ${result.path}\n`);
    process.exit(EXIT.OK);
  } else if (opts.command === 'workflow') {
    let workflowArgIndex = 0;
    const subcmd = opts.args[workflowArgIndex++];

    if (!subcmd) {
      return {
        error: 'workflow requires a subcommand: list, validate, or run',
        exitCode: EXIT.INVALID,
      };
    }

    if (!['list', 'validate', 'run'].includes(subcmd)) {
      return {
        error: `Unknown workflow subcommand: "${subcmd}". Valid: list, validate, run`,
        exitCode: EXIT.INVALID,
      };
    }

    if (subcmd === 'list') {
      const workflowsDir = path.join(packageRoot, 'workflows');
      let entries;
      try {
        entries = require('node:fs').readdirSync(workflowsDir, { withFileTypes: true })
          .filter(d => d.isFile() && (d.name.endsWith('.yaml') || d.name.endsWith('.yml')));
      } catch (err) {
        if (err.code === 'ENOENT') {
          process.stdout.write('No workflows directory found.\n');
          process.exit(EXIT.OK);
        }
        process.stderr.write(`Error reading workflows directory: ${err.message}\n`);
        process.exit(EXIT.FAILURE);
      }

      if (opts.json) {
        const result = { command: 'workflow', subcommand: 'list', workflows: entries.map(e => e.name) };
        process.stdout.write(JSON.stringify(result, null, 2) + '\n');
      } else {
        if (entries.length === 0) {
          process.stdout.write('No workflow files found.\n');
        } else {
          process.stdout.write('Available workflows:\n');
          for (const e of entries) {
            process.stdout.write(`  - ${e.name}\n`);
          }
        }
      }
      process.exit(EXIT.OK);
    }

    if (subcmd === 'validate' || subcmd === 'run') {
      const workflowPath = opts.args[workflowArgIndex++];
      if (!workflowPath) {
        return {
          error: `${subcmd} requires a workflow file path`,
          exitCode: EXIT.INVALID,
        };
      }

      const absPath = path.resolve(workflowPath);
      if (!absPath.startsWith(packageRoot)) {
        return {
          error: `Workflow path must be inside package root`,
          exitCode: EXIT.INVALID,
        };
      }

      let src;
      try {
        src = require('node:fs').readFileSync(absPath, 'utf8');
      } catch (err) {
        process.stderr.write(`Error reading workflow file: ${err.message}\n`);
        process.exit(EXIT.FAILURE);
      }

      const workflow = parseWorkflow(src);
      if (!workflow) {
        process.stderr.write(`BLOCKED — WORKFLOW PARSE FAILED: invalid YAML or missing name\n`);
        process.exit(EXIT.INVALID);
      }

      const parsedSteps = parseWorkflowSteps(workflow.steps);
      const errors = collectWorkflowErrors({ ...workflow, steps: parsedSteps }, {
        agents: ['build', 'plan', ...INVENTORY
          .filter(e => e.target.startsWith('agents/') && e.target.endsWith('.md'))
          .map(e => path.basename(e.target, '.md'))],
        skills: INVENTORY
          .filter(e => e.target.startsWith('skills/') && e.target.endsWith('/SKILL.md'))
          .map(e => e.target.split('/')[1]),
      });

      if (errors.length > 0) {
        process.stderr.write(`BLOCKED — WORKFLOW VALIDATION FAILED:\n${errors.join('\n')}\n`);
        process.exit(EXIT.INVALID);
      }

      if (subcmd === 'validate') {
        if (opts.json) {
          process.stdout.write(JSON.stringify({ command: 'workflow', subcommand: 'validate', status: 'valid', workflow: workflow.name }, null, 2) + '\n');
        } else {
          process.stdout.write(`Workflow "${workflow.name}" is valid.\n`);
        }
        process.exit(EXIT.OK);
      }

      if (subcmd === 'run') {
        const steps = parseWorkflowSteps(workflow.steps);
        process.stdout.write(`Executing workflow "${workflow.name}" with ${steps.length} step(s)...\n`);
        for (const step of steps) {
          process.stdout.write(`  > ${step.name}: ${step.command}\n`);
        }
        process.exit(EXIT.OK);
      }
    }
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

main().catch((err) => {
  process.stderr.write(`Error: ${err.message}\n`);
  process.exit(EXIT.FAILURE);
});
