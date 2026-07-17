/**
 * CLI installation / config detection.
 * Injectable which() and homeDir for tests — never mutates real paths.
 */

import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

/**
 * Expand leading ~ to home directory.
 * @param {string} p
 * @param {string} [home]
 */
export function expandHome(p, home = homedir()) {
  if (p === '~') return home;
  if (p.startsWith('~/') || p.startsWith('~\\')) {
    return join(home, p.slice(2));
  }
  return p;
}

/**
 * Default PATH check via `command -v`.
 * @param {string} binary
 * @returns {boolean}
 */
function defaultWhich(binary) {
  try {
    execSync(`command -v ${JSON.stringify(binary)}`, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Detect whether a CLI binary and its config file exist.
 *
 * @param {{ id: string, configDir: string, configFile: string }} cli
 * @param {{ homeDir?: string, which?: (bin: string) => boolean }} [opts]
 * @returns {{ installed: boolean, configExists: boolean, configPath: string }}
 */
export function detectCLI(cli, opts = {}) {
  const home = opts.homeDir ?? homedir();
  const which = opts.which ?? defaultWhich;
  const configDir = expandHome(cli.configDir, home);
  const configPath = join(configDir, cli.configFile);

  return {
    installed: which(cli.id),
    configExists: existsSync(configPath),
    configPath,
  };
}
