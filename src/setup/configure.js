/**
 * Per-CLI OpenStrut config writer.
 * Always backups existing files. Supports dryRun and injectable homeDir.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { homedir } from 'node:os';
import { expandHome } from './detect.js';
import { applyMcpConfig, barsaMcpEntry, formatMcpSnippet } from './mcp.js';

function randomHex() {
  return crypto.randomBytes(8).toString('hex');
}

/**
 * Copy existing file to collision-resistant sibling backup.
 * @param {string} filePath
 * @returns {string|null}
 */
export function backupFile(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const backup = `${filePath}.${randomHex()}.openstrut-backup`;
  fs.copyFileSync(filePath, backup);
  return backup;
}

function openstrutMeta() {
  return {
    managed: true,
    tool: 'openstrut',
    configuredAt: new Date().toISOString(),
  };
}

/**
 * @param {string} filePath
 * @returns {Record<string, unknown>}
 */
function readJsonSafe(filePath) {
  if (!fs.existsSync(filePath)) return {};
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

/**
 * Build final file content for a CLI.
 * @param {object} cli
 * @param {string} configPath
 */
function buildContent(cli, configPath) {
  if (cli.format === 'toml' || cli.id === 'codex') {
    let existing = '';
    if (fs.existsSync(configPath)) {
      existing = fs.readFileSync(configPath, 'utf8');
      // Strip prior openstrut / barsa mcp blocks we manage
      existing = existing
        .replace(/\n?\[openstrut\][\s\S]*?(?=\n\[|$)/g, '')
        .replace(/\n?\[mcp_servers\.barsa\][\s\S]*?(?=\n\[|$)/g, '')
        .trimEnd();
    }
    const block = [
      '',
      '[openstrut]',
      'managed = true',
      'tool = "openstrut"',
      '',
      formatMcpSnippet(cli),
      '',
    ].join('\n');
    return (existing ? existing + '\n' : '') + block;
  }

  if (cli.format === 'yaml' || cli.id === 'hermes') {
    let existing = '';
    if (fs.existsSync(configPath)) {
      existing = fs.readFileSync(configPath, 'utf8');
      existing = existing
        .replace(/\n?openstrut:[\s\S]*?(?=\n\S|$)/g, '')
        .replace(/\n?mcp:\n(?: {2}.+\n)*/g, '')
        .trimEnd();
    }
    const block = [
      '',
      'openstrut:',
      '  managed: true',
      '  tool: openstrut',
      '',
      formatMcpSnippet(cli),
      '',
    ].join('\n');
    return (existing ? existing + '\n' : '') + block;
  }

  // JSON formats (opencode, pi, omp, antigravity)
  const base = readJsonSafe(configPath);
  const withMeta = { ...base, openstrut: openstrutMeta() };
  const withMcp = applyMcpConfig(cli, withMeta);
  return JSON.stringify(withMcp, null, 2) + '\n';
}

/**
 * Configure one CLI under homeDir (or real home).
 *
 * @param {object} cli
 * @param {{ homeDir?: string, dryRun?: boolean }} [opts]
 * @returns {{ ok: boolean, path: string, backup: string|null, dryRun?: boolean, written?: boolean, error?: string }}
 */
export function configureCLI(cli, opts = {}) {
  const home = opts.homeDir ?? homedir();
  const configDir = expandHome(cli.configDir, home);
  const configPath = path.join(configDir, cli.configFile);

  try {
    const content = buildContent(cli, configPath);

    if (opts.dryRun) {
      return { ok: true, path: configPath, backup: null, dryRun: true, written: false };
    }

    fs.mkdirSync(configDir, { recursive: true, mode: 0o755 });
    const backup = backupFile(configPath);
    fs.writeFileSync(configPath, content, { mode: 0o644 });

    return { ok: true, path: configPath, backup, written: true };
  } catch (err) {
    return {
      ok: false,
      path: configPath,
      backup: null,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

/**
 * Configure multiple CLIs.
 * @param {object[]} clis
 * @param {{ homeDir?: string, dryRun?: boolean }} [opts]
 */
export function configureMany(clis, opts = {}) {
  return clis.map((cli) => ({ id: cli.id, ...configureCLI(cli, opts) }));
}

// re-export for convenience
export { barsaMcpEntry };
