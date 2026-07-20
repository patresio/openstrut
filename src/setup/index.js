/**
 * Multi-CLI setup orchestration (non-interactive + interactive).
 */

import { CLIS, getCLI } from './registry.js';
import { detectCLI } from './detect.js';
import { runMenu, parseSelection, renderMenu } from './menu.js';
import { configureCLI, configureMany } from './configure.js';
import { barsaMcpEntry } from './mcp.js';
import { installPlugin, getPlatforms as getPluginPlatforms } from '../plugins/plugin-installer.js';

/**
 * @param {{
 *   homeDir?: string,
 *   cliIds?: string[],
 *   platform?: string,
 *   dryRun?: boolean,
 *   interactive?: boolean,
 *   input?: NodeJS.ReadableStream,
 *   output?: NodeJS.WritableStream,
 * }} opts
 */
export async function runSetup(opts = {}) {
  const homeDir = opts.homeDir;
  const dryRun = opts.dryRun ?? false;

  // Handle plugin installation for specific platform
  if (opts.platform) {
    const platform = opts.platform;
    if (!getPluginPlatforms().includes(platform)) {
      return {
        ok: false,
        error: `Unsupported platform: "${platform}". Supported platforms: ${getPluginPlatforms().join(', ')}`,
        configured: [],
      };
    }

    const pluginResult = installPlugin(platform, {
      targetDir: homeDir || process.cwd(),
      dryRun,
    });

    return {
      ok: pluginResult.ok,
      configured: [pluginResult],
      error: pluginResult.error,
    };
  }

  let ids = opts.cliIds;
  if (!ids || ids.length === 0) {
    if (opts.interactive === false) {
      return {
        ok: false,
        error: 'No CLI selected. Pass --cli <id[,id...]> or run interactively.',
        configured: [],
      };
    }
    const status = CLIS.map((cli) => detectCLI(cli, { homeDir }));
    ids = await runMenu(CLIS, {
      status,
      input: opts.input,
      output: opts.output,
    });
    if (ids.length === 0) {
      return { ok: true, cancelled: true, configured: [] };
    }
  }

  const clis = [];
  for (const id of ids) {
    const cli = getCLI(id);
    if (!cli) {
      return { ok: false, error: `Unknown CLI id: "${id}"`, configured: [] };
    }
    clis.push(cli);
  }

  const configured = configureMany(clis, { homeDir, dryRun });
  const failed = configured.filter((r) => !r.ok);
  return {
    ok: failed.length === 0,
    configured,
    error: failed.length ? failed.map((f) => f.error).join('; ') : undefined,
  };
}

export {
  CLIS,
  getCLI,
  detectCLI,
  runMenu,
  parseSelection,
  renderMenu,
  configureCLI,
  configureMany,
  barsaMcpEntry,
  installPlugin,
  getPluginPlatforms,
};
