/**
 * Setup (ot-setup) tests — multi-CLI TUI configurator.
 * All file ops use os.tmpdir(). Never touch real ~/.config.
 */

import { describe, it, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { CLIS, getCLI } from '../../src/setup/registry.js';
import { detectCLI, expandHome } from '../../src/setup/detect.js';
import { renderMenu, parseSelection } from '../../src/setup/menu.js';
import { configureCLI, backupFile } from '../../src/setup/configure.js';
import { barsaMcpEntry, applyMcpConfig, formatMcpSnippet } from '../../src/setup/mcp.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(__dirname, '../..');
const CLI_PATH = path.join(PACKAGE_ROOT, 'bin', 'openstrut.js');

const temps = [];

function makeTmp() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'openstrut-setup-'));
  temps.push(dir);
  return dir;
}

afterEach(() => {
  while (temps.length) {
    const dir = temps.pop();
    if (dir && dir.startsWith(os.tmpdir()) && fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  }
});

// ─── Registry ────────────────────────────────────────────────────────────────

describe('registry', () => {
  it('exports 7 CLIs', () => {
    assert.equal(CLIS.length, 7);
  });

  it('each CLI has required fields', () => {
    for (const cli of CLIS) {
      assert.ok(cli.id, 'id');
      assert.ok(cli.name, 'name');
      assert.ok(cli.description, 'description');
      assert.ok(cli.configDir, 'configDir');
      assert.ok(cli.configFile, 'configFile');
      assert.ok(cli.installMethod, 'installMethod');
      assert.ok(cli.installCommand, 'installCommand');
      assert.ok(cli.mcpConfigKey, 'mcpConfigKey');
      assert.ok(cli.agentDefinitionMechanism, 'agentDefinitionMechanism');
    }
  });

  it('ids are unique and include known tools', () => {
    const ids = CLIS.map((c) => c.id);
    assert.deepEqual(ids, ['opencode', 'codex', 'hermes', 'pi', 'omp', 'antigravity', 'cursor']);
    assert.equal(new Set(ids).size, 7);
  });

  it('getCLI returns entry by id or undefined', () => {
    assert.equal(getCLI('opencode').name, 'OpenCode');
    assert.equal(getCLI('missing'), undefined);
  });
});

// ─── Detection ───────────────────────────────────────────────────────────────

describe('detect', () => {
  it('expandHome resolves ~ under given home', () => {
    const home = '/tmp/fake-home';
    assert.equal(expandHome('~/.config/opencode', home), path.join(home, '.config/opencode'));
    assert.equal(expandHome('/abs/path', home), '/abs/path');
  });

  it('detectCLI returns correct shape', () => {
    const home = makeTmp();
    const cli = getCLI('opencode');
    const result = detectCLI(cli, { homeDir: home, which: () => false });
    assert.equal(typeof result.installed, 'boolean');
    assert.equal(typeof result.configExists, 'boolean');
    assert.equal(typeof result.configPath, 'string');
    assert.equal(result.installed, false);
    assert.equal(result.configExists, false);
    assert.equal(
      result.configPath,
      path.join(home, '.config/opencode/opencode.json')
    );
  });

  it('detectCLI reports configExists when file present', () => {
    const home = makeTmp();
    const cli = getCLI('codex');
    const dir = path.join(home, '.codex');
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'config.toml'), '# empty\n');
    const result = detectCLI(cli, { homeDir: home, which: () => true });
    assert.equal(result.installed, true);
    assert.equal(result.configExists, true);
  });
});

// ─── Menu ────────────────────────────────────────────────────────────────────

describe('menu', () => {
  it('renderMenu lists numbered CLIs', () => {
    const text = renderMenu(CLIS);
    assert.match(text, /1\.\s+OpenCode/);
    assert.match(text, /6\.\s+Antigravity/);
    assert.match(text, /7\.\s+Cursor/);
    assert.match(text, /q.*quit/i);
  });

  it('parseSelection handles single, multi, all, quit', () => {
    assert.deepEqual(parseSelection('1', CLIS), ['opencode']);
    assert.deepEqual(parseSelection('1,3', CLIS), ['opencode', 'hermes']);
    assert.deepEqual(parseSelection(' 2 , 5 ', CLIS), ['codex', 'omp']);
    assert.deepEqual(parseSelection('all', CLIS), CLIS.map((c) => c.id));
    assert.deepEqual(parseSelection('q', CLIS), []);
    // Empty input defaults to OpenCode (first CLI)
    assert.deepEqual(parseSelection('', CLIS), ['opencode']);
  });

  it('parseSelection rejects out-of-range', () => {
    assert.throws(() => parseSelection('99', CLIS), /invalid/i);
    assert.throws(() => parseSelection('0', CLIS), /invalid/i);
    assert.throws(() => parseSelection('x', CLIS), /invalid/i);
  });
});

// ─── Configure ───────────────────────────────────────────────────────────────

describe('configure', () => {
  it('backupFile creates sibling backup and returns path', () => {
    const dir = makeTmp();
    const file = path.join(dir, 'config.json');
    fs.writeFileSync(file, '{"a":1}');
    const backup = backupFile(file);
    assert.ok(backup);
    assert.ok(fs.existsSync(backup));
    assert.equal(fs.readFileSync(backup, 'utf8'), '{"a":1}');
  });

  it('backupFile returns null when source missing', () => {
    assert.equal(backupFile(path.join(makeTmp(), 'nope.json')), null);
  });

  it('configureCLI writes opencode.json merge preserving keys', () => {
    const home = makeTmp();
    const cfgDir = path.join(home, '.config/opencode');
    fs.mkdirSync(cfgDir, { recursive: true });
    fs.writeFileSync(
      path.join(cfgDir, 'opencode.json'),
      JSON.stringify({ model: 'keep-me', mcp: { other: { type: 'local' } } }, null, 2)
    );

    const result = configureCLI(getCLI('opencode'), { homeDir: home });
    assert.equal(result.ok, true);
    assert.ok(result.path.endsWith('opencode.json'));
    assert.ok(result.backup);

    const written = JSON.parse(fs.readFileSync(result.path, 'utf8'));
    assert.equal(written.model, 'keep-me');
    // OpenCode rejects unknown keys — no openstrut metadata
    assert.equal(written.openstrut, undefined);
    assert.ok(written.mcp.other);
    assert.ok(written.mcp.barsa);
  });

  it('configureCLI writes codex config.toml with openstrut + mcp', () => {
    const home = makeTmp();
    const result = configureCLI(getCLI('codex'), { homeDir: home });
    assert.equal(result.ok, true);
    const text = fs.readFileSync(result.path, 'utf8');
    assert.match(text, /\[openstrut\]/);
    assert.match(text, /managed\s*=\s*true/);
    assert.match(text, /\[mcp_servers\.barsa\]/);
  });

  it('configureCLI writes hermes yaml', () => {
    const home = makeTmp();
    const result = configureCLI(getCLI('hermes'), { homeDir: home });
    assert.equal(result.ok, true);
    const text = fs.readFileSync(result.path, 'utf8');
    assert.match(text, /openstrut:/);
    assert.match(text, /managed:\s*true/);
    assert.match(text, /barsa:/);
  });

  it('configureCLI writes JSON for pi, omp, antigravity', () => {
    const home = makeTmp();
    for (const id of ['pi', 'omp', 'antigravity']) {
      const result = configureCLI(getCLI(id), { homeDir: home });
      assert.equal(result.ok, true, id);
      const written = JSON.parse(fs.readFileSync(result.path, 'utf8'));
      assert.equal(written.openstrut.managed, true, id);
      assert.ok(written[getCLI(id).mcpConfigKey].barsa, id);
    }
  });

  it('configureCLI dryRun does not write', () => {
    const home = makeTmp();
    const result = configureCLI(getCLI('pi'), { homeDir: home, dryRun: true });
    assert.equal(result.ok, true);
    assert.equal(result.dryRun, true);
    assert.equal(fs.existsSync(result.path), false);
  });
});

// ─── MCP ─────────────────────────────────────────────────────────────────────

describe('mcp', () => {
  it('barsaMcpEntry is stable remote shape', () => {
    const entry = barsaMcpEntry();
    assert.equal(entry.type, 'remote');
    assert.ok(entry.url.includes('BARSA'));
    assert.equal(entry.enabled, true);
  });

  it('applyMcpConfig merges barsa under mcpConfigKey', () => {
    const cli = getCLI('opencode');
    const out = applyMcpConfig(cli, { mcp: { other: 1 } });
    assert.equal(out.mcp.other, 1);
    assert.deepEqual(out.mcp.barsa, barsaMcpEntry());
  });

  it('formatMcpSnippet emits format-specific text', () => {
    assert.match(formatMcpSnippet(getCLI('codex')), /mcp_servers\.barsa/);
    assert.match(formatMcpSnippet(getCLI('hermes')), /barsa:/);
    assert.match(formatMcpSnippet(getCLI('opencode')), /"barsa"/);
  });
});

// ─── Integration ─────────────────────────────────────────────────────────────

describe('integration', () => {
  it('detect → select → configure → verify for selected CLIs', () => {
    const home = makeTmp();
    const selected = parseSelection('1,2,4', CLIS);
    assert.deepEqual(selected, ['opencode', 'codex', 'pi']);

    const results = [];
    for (const id of selected) {
      const cli = getCLI(id);
      const detection = detectCLI(cli, { homeDir: home, which: () => false });
      assert.equal(detection.configExists, false);
      const conf = configureCLI(cli, { homeDir: home });
      assert.equal(conf.ok, true);
      results.push(conf);
      assert.ok(fs.existsSync(conf.path));
      const redetect = detectCLI(cli, { homeDir: home, which: () => false });
      assert.equal(redetect.configExists, true);
    }
    assert.equal(results.length, 3);
  });

  it('CLI setup --cli non-interactive writes under --home', () => {
    const home = makeTmp();
    const r = spawnSync(
      process.execPath,
      [CLI_PATH, 'setup', '--home', home, '--cli', 'opencode,pi', '--json'],
      { encoding: 'utf8', cwd: PACKAGE_ROOT }
    );
    assert.equal(r.status, 0, r.stderr || r.stdout);
    const out = JSON.parse(r.stdout);
    assert.equal(out.command, 'setup');
    assert.equal(out.configured.length, 2);
    assert.ok(fs.existsSync(path.join(home, '.config/opencode/opencode.json')));
    assert.ok(fs.existsSync(path.join(home, '.pi/agent/settings.json')));
  });

  it('CLI rejects unknown setup options', () => {
    const r = spawnSync(
      process.execPath,
      [CLI_PATH, 'setup', '--bogus'],
      { encoding: 'utf8', cwd: PACKAGE_ROOT }
    );
    assert.equal(r.status, 3);
  });
});
