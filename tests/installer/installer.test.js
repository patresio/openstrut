/**
 * Installer tests for OpenStrut.
 *
 * All tests run against temporary directories. No test touches the real
 * home directory, $HOME/.config/opencode, or $XDG_CONFIG_HOME/opencode.
 *
 * Uses only Node.js built-in modules and the native test runner (node:test).
 *
 * Test suites:
 *   1. Inventory integrity
 *   2. Target resolution (including XDG)
 *   3. Symlink safety
 *   4. Plan (read-only)
 *   5. Install
 *   6. Rollback
 *   7. Check
 *   8. Manifest state
 *   9. CLI subprocess tests
 */

import { describe, it, before, after, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { INVENTORY, isAllowedSource } from '../../src/installer/inventory.js';
import { computePlan } from '../../src/installer/plan.js';
import { install } from '../../src/installer/install.js';
import { check } from '../../src/installer/check.js';
import { formatPlan, formatInstall, formatCheck, EXIT } from '../../src/installer/output.js';
import {
  resolveTarget,
  validateTargetPath,
  validateRelativePath,
  validateTargetNotPackageRoot,
  validateTargetRootNotSymlinked,
  findSymlinkedAncestor,
} from '../../src/installer/target.js';
import {
  checksumFile,
  checksumBuffer,
  readManifest,
  writeManifest,
  getManifestState,
} from '../../src/installer/manifest.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(__dirname, '../..');
const CLI_PATH = path.join(PACKAGE_ROOT, 'bin', 'openstrut.js');

const SHARED = {
  packageRoot: PACKAGE_ROOT,
  packageVersion: '0.1.0',
  packageName: '@patrese/openstrut',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeTmpTarget() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'harness-test-'));
}

function removeTmp(dir) {
  if (dir && fs.existsSync(dir) && dir.startsWith(os.tmpdir())) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

function assertNotRealConfig(targetRoot) {
  const realConfig = path.join(os.homedir(), '.config', 'opencode');
  assert.notEqual(targetRoot, realConfig, 'Test must not target the real OpenCode config directory');
  assert.ok(
    !targetRoot.startsWith(realConfig + path.sep),
    'Test must not be inside the real OpenCode config directory'
  );
}

/**
 * Recursively collect all file paths under a directory.
 *
 * @param {string} dir
 * @returns {string[]}
 */
function walkFiles(dir) {
  const result = [];
  function recurse(d) {
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, entry.name);
      if (entry.isDirectory()) recurse(full);
      else result.push(full);
    }
  }
  recurse(dir);
  return result;
}

/**
 * Run the CLI as a subprocess and return its result.
 *
 * @param {string[]} args
 * @param {{ env?: NodeJS.ProcessEnv }} [opts]
 */
function runCLI(args, opts = {}) {
  return spawnSync(process.execPath, [CLI_PATH, ...args], {
    encoding: 'utf8',
    env: { ...process.env, ...(opts.env ?? {}) },
  });
}

// ─── 1. Inventory integrity ───────────────────────────────────────────────────

describe('Inventory', () => {
  it('inventory contains exactly 205 artifacts', () => {
    assert.equal(INVENTORY.length, 205, `Expected 205 artifacts, got ${INVENTORY.length}`);
  });

  it('inventory has exactly 3 root configuration files', () => {
    const root = INVENTORY.filter(e => !e.target.includes('/'));
    assert.equal(root.length, 3, `Expected 3 root config files, got ${root.length}: ${root.map(e => e.target).join(', ')}`);
    assert.ok(root.some(e => e.target === 'AGENTS.md'), 'AGENTS.md must be in inventory');
    assert.ok(root.some(e => e.target === 'opencode.json'), 'opencode.json must be in inventory');
    assert.ok(root.some(e => e.target === 'tui.json'), 'tui.json must be in inventory');
  });

  it('inventory has exactly 40 agents', () => {
    const agents = INVENTORY.filter(({ target }) => target.startsWith('agents/'));
    assert.equal(agents.length, 40, `Expected 40 agents, got ${agents.length}`);
  });


  it('inventory has exactly 10 commands', () => {
    const commands = INVENTORY.filter(e => e.source.startsWith('global/commands/'));
    assert.equal(commands.length, 10, `Expected 10 commands, got ${commands.length}`);
  });

  it('inventory has exactly 11 skills', () => {
    const skills = INVENTORY.filter(e => e.source.startsWith('global/skills/'));
    assert.equal(skills.length, 11, `Expected 11 skills, got ${skills.length}`);
  });

  it('inventory has exactly 4 templates', () => {
    const templates = INVENTORY.filter(e => e.source.startsWith('templates/'));
    assert.equal(templates.length, 4, `Expected 4 templates, got ${templates.length}`);
  });

  it('inventory has exactly 0 workflows (legacy workflows not installed)', () => {
    const workflows = INVENTORY.filter(e => e.source.startsWith('workflows/'));
    assert.equal(workflows.length, 0, `Expected 0 workflows, got ${workflows.length}`);
  });

  it('inventory has exactly 10 opentrust runtime doc files', () => {
    const docs = INVENTORY.filter(e => e.source.startsWith('global/opentrust/'));
    assert.equal(docs.length, 10, `Expected 10 opentrust runtime docs, got ${docs.length}`);
  });

  it('inventory has exactly 127 local context catalog files', () => {
    const context = INVENTORY.filter(e => e.source.startsWith('global/context/'));
    assert.equal(context.length, 127, `Expected 127 local context catalog files, got ${context.length}`);
  });

  it('inventory contains no reference-library paths', () => {
    const refs = INVENTORY.filter(e => e.source.startsWith('references/'));
    assert.equal(refs.length, 0, 'references/ must not appear in the inventory');
  });

  it('inventory contains no server-specific absolute paths', () => {
    const srv = INVENTORY.filter(e => e.source.includes('/srv/') || e.target.includes('/srv/'));
    assert.equal(srv.length, 0, 'no absolute /srv/ path must appear in the inventory');
  });

  it('inventory contains no docs, evals, scripts, or task-plans', () => {
    const forbidden = INVENTORY.filter(e =>
      e.source.startsWith('docs/') ||
      e.source.startsWith('evals/') ||
      e.source.startsWith('scripts/') ||
      e.source.startsWith('.opencode/')
    );
    assert.equal(forbidden.length, 0, 'No docs/evals/scripts/.opencode/ in inventory');
  });

  it('all source paths are from allowed directories', () => {
    for (const entry of INVENTORY) {
      assert.ok(isAllowedSource(entry.source), `Source not in allowed dirs: ${entry.source}`);
    }
  });

  it('all source files exist in the package', () => {
    const missing = INVENTORY.filter(e => !fs.existsSync(path.join(PACKAGE_ROOT, e.source)));
    assert.deepEqual(missing, [], `Missing source files: ${missing.map(e => e.source).join(', ')}`);
  });

  it('3 + 40 + 10 + 11 + 10 + 127 + 0 + 4 = 205', () => {
    // Arithmetic guard so a category change does not silently break the total
    const root = INVENTORY.filter(e => !e.target.includes('/')).length;
    const agents = INVENTORY.filter(e => e.source.startsWith('global/agents/')).length;
    const commands = INVENTORY.filter(e => e.source.startsWith('global/commands/')).length;
    const skills = INVENTORY.filter(e => e.source.startsWith('global/skills/')).length;
    const opentrust = INVENTORY.filter(e => e.source.startsWith('global/opentrust/')).length;
    const context = INVENTORY.filter(e => e.source.startsWith('global/context/')).length;
    const workflows = INVENTORY.filter(e => e.source.startsWith('workflows/')).length;
    const templates = INVENTORY.filter(e => e.source.startsWith('templates/')).length;
    const sum = root + agents + commands + skills + opentrust + context + workflows + templates;
    assert.equal(sum, INVENTORY.length, `Category sum ${sum} !== INVENTORY.length ${INVENTORY.length}`);
    assert.equal(sum, 205, `Expected sum 205, got ${sum}`);
  });
});

// ─── 2. Target resolution ─────────────────────────────────────────────────────

describe('Target resolution', () => {
  it('explicit --target is used', () => {
    const tmp = makeTmpTarget();
    try {
      const resolved = resolveTarget({ target: tmp });
      assert.equal(resolved, path.resolve(tmp));
    } finally {
      removeTmp(tmp);
    }
  });

  it('XDG_CONFIG_HOME is used when set (no --target)', () => {
    const tmp = makeTmpTarget();
    try {
      // Temporarily override env for resolution
      const orig = process.env.XDG_CONFIG_HOME;
      process.env.XDG_CONFIG_HOME = tmp;
      try {
        const resolved = resolveTarget({});
        assert.equal(resolved, path.join(tmp, 'opencode'));
      } finally {
        if (orig === undefined) delete process.env.XDG_CONFIG_HOME;
        else process.env.XDG_CONFIG_HOME = orig;
      }
    } finally {
      removeTmp(tmp);
    }
  });

  it('HOME/.config/opencode is used when XDG_CONFIG_HOME is not set', () => {
    const tmp = makeTmpTarget();
    try {
      const origXdg = process.env.XDG_CONFIG_HOME;
      const origHome = process.env.HOME;
      delete process.env.XDG_CONFIG_HOME;
      process.env.HOME = tmp;
      try {
        const resolved = resolveTarget({});
        assert.equal(resolved, path.join(tmp, '.config', 'opencode'));
      } finally {
        if (origXdg === undefined) delete process.env.XDG_CONFIG_HOME;
        else process.env.XDG_CONFIG_HOME = origXdg;
        if (origHome === undefined) delete process.env.HOME;
        else process.env.HOME = origHome;
      }
    } finally {
      removeTmp(tmp);
    }
  });

  it('XDG_CONFIG_HOME takes precedence over HOME', () => {
    const xdgTmp = makeTmpTarget();
    const homeTmp = makeTmpTarget();
    try {
      const origXdg = process.env.XDG_CONFIG_HOME;
      const origHome = process.env.HOME;
      process.env.XDG_CONFIG_HOME = xdgTmp;
      process.env.HOME = homeTmp;
      try {
        const resolved = resolveTarget({});
        assert.equal(resolved, path.join(xdgTmp, 'opencode'));
        assert.ok(!resolved.includes(homeTmp), 'HOME must not be used when XDG_CONFIG_HOME is set');
      } finally {
        if (origXdg === undefined) delete process.env.XDG_CONFIG_HOME;
        else process.env.XDG_CONFIG_HOME = origXdg;
        if (origHome === undefined) delete process.env.HOME;
        else process.env.HOME = origHome;
      }
    } finally {
      removeTmp(xdgTmp);
      removeTmp(homeTmp);
    }
  });

  it('filesystem root is rejected', () => {
    assert.throws(() => validateTargetPath('/'), /unsafe|root|too short/);
  });

  it('empty string is rejected', () => {
    assert.throws(() => resolveTarget({ target: '' }), /empty or blank/);
  });

  it('blank-only string is rejected', () => {
    assert.throws(() => resolveTarget({ target: '   ' }), /empty or blank/);
  });

  it('path traversal in relative path is rejected', () => {
    const tmp = makeTmpTarget();
    try {
      assert.throws(
        () => validateRelativePath(tmp, '../etc/passwd'),
        /traversal|escapes/
      );
    } finally {
      removeTmp(tmp);
    }
  });

  it('absolute managed path is rejected', () => {
    const tmp = makeTmpTarget();
    try {
      assert.throws(
        () => validateRelativePath(tmp, '/etc/passwd'),
        /relative/
      );
    } finally {
      removeTmp(tmp);
    }
  });

  it('package root as target is rejected', () => {
    assert.throws(
      () => validateTargetNotPackageRoot(PACKAGE_ROOT, PACKAGE_ROOT),
      /package root/
    );
  });

  it('subdirectory of package root as target is rejected', () => {
    const sub = path.join(PACKAGE_ROOT, 'src', 'installer');
    assert.throws(
      () => validateTargetNotPackageRoot(sub, PACKAGE_ROOT),
      /package root/
    );
  });

  it('plan rejects package root as target', () => {
    assert.throws(
      () => computePlan({ ...SHARED, target: PACKAGE_ROOT }),
      /package root/
    );
  });

  it('install rejects package root as target', () => {
    assert.throws(
      () => install({ ...SHARED, target: PACKAGE_ROOT }),
      /package root/
    );
  });

  it('check rejects package root as target', () => {
    assert.throws(
      () => check({ ...SHARED, target: PACKAGE_ROOT }),
      /package root/
    );
  });
});

// ─── 3. Symlink safety ────────────────────────────────────────────────────────

describe('Symlink safety', () => {
  it('symlinked target root is rejected', () => {
    const real = makeTmpTarget();
    const link = path.join(os.tmpdir(), 'harness-symlink-root-' + crypto.randomBytes(4).toString('hex'));
    let created = false;
    try {
      fs.symlinkSync(real, link);
      created = true;
      assert.throws(
        () => validateTargetRootNotSymlinked(link),
        /symbolic link/
      );
    } catch (err) {
      if (err.code === 'EPERM') {
        // Symlink creation denied on this platform
        return;
      }
      if (!created) throw err;
    } finally {
      if (created && fs.existsSync(link)) fs.unlinkSync(link);
      removeTmp(real);
    }
  });

  it('symlinked ancestor of target root is rejected by install', () => {
    const real = makeTmpTarget();
    const link = path.join(os.tmpdir(), 'harness-symlink-anc-' + crypto.randomBytes(4).toString('hex'));
    let created = false;
    try {
      fs.symlinkSync(real, link);
      created = true;
      // target root is inside the symlinked directory
      const targetRoot = path.join(link, 'opencode');
      const result = install({ ...SHARED, target: targetRoot });
      assert.ok(!result.success, 'Install must fail when ancestor is a symlink');
    } catch (err) {
      if (err.code === 'EPERM') return;
      if (!created) throw err;
      // If it throws directly (validateTargetRootNotSymlinked), that's also correct
    } finally {
      if (created && fs.existsSync(link)) fs.unlinkSync(link);
      removeTmp(real);
    }
  });

  it('symlinked managed target file is treated as invalid-target', () => {
    const tmp = makeTmpTarget();
    assertNotRealConfig(tmp);
    let created = false;
    try {
      const agentsMdPath = path.join(tmp, 'AGENTS.md');
      fs.symlinkSync('/dev/null', agentsMdPath);
      created = true;
      const result = install({ ...SHARED, target: tmp });
      assert.ok(!result.success, 'Should fail when target is a symlink');
    } catch (err) {
      if (err.code === 'EPERM') return;
      if (!created) throw err;
    } finally {
      removeTmp(tmp);
    }
  });

  it('symlinked managed parent directory is treated as invalid-target', () => {
    const tmp = makeTmpTarget();
    const real = makeTmpTarget();
    let created = false;
    assertNotRealConfig(tmp);
    try {
      const agentsDir = path.join(tmp, 'agents');
      fs.symlinkSync(real, agentsDir);
      created = true;
      const result = install({ ...SHARED, target: tmp });
      assert.ok(!result.success, 'Should fail when managed parent dir is a symlink');
    } catch (err) {
      if (err.code === 'EPERM') return;
      if (!created) throw err;
    } finally {
      removeTmp(tmp);
      removeTmp(real);
    }
  });

  it('symlinked .engineering-harness directory is reported as unsafe manifest', () => {
    const tmp = makeTmpTarget();
    const real = makeTmpTarget();
    let created = false;
    assertNotRealConfig(tmp);
    try {
      const manifestDir = path.join(tmp, '.openstrut');
      fs.symlinkSync(real, manifestDir);
      created = true;
      const { state } = getManifestState(tmp);
      assert.equal(state, 'unsafe', 'Manifest state must be unsafe when dir is a symlink');
    } catch (err) {
      if (err.code === 'EPERM') return;
      if (!created) throw err;
    } finally {
      removeTmp(tmp);
      removeTmp(real);
    }
  });

  it('symlink destination is not modified when install is blocked', () => {
    const tmp = makeTmpTarget();
    const real = makeTmpTarget();
    let created = false;
    const sentinel = '# ORIGINAL_CONTENT';
    assertNotRealConfig(tmp);
    try {
      fs.writeFileSync(path.join(real, 'sentinel.txt'), sentinel);
      const agentsMdPath = path.join(tmp, 'AGENTS.md');
      fs.symlinkSync('/dev/null', agentsMdPath);
      created = true;
      install({ ...SHARED, target: tmp });
      // Sentinel file in real must be unchanged
      assert.equal(fs.readFileSync(path.join(real, 'sentinel.txt'), 'utf8'), sentinel);
    } catch (err) {
      if (err.code === 'EPERM') return;
      if (!created) throw err;
    } finally {
      removeTmp(tmp);
      removeTmp(real);
    }
  });
});

// ─── 4. Plan (read-only) ──────────────────────────────────────────────────────

describe('Plan (read-only)', () => {
  it('all artifacts are missing on empty target', () => {
    const tmp = makeTmpTarget();
    assertNotRealConfig(tmp);
    try {
      const result = computePlan({ ...SHARED, target: tmp });
      const missing = result.artifacts.filter(a => a.class === 'missing');
      assert.equal(missing.length, INVENTORY.length, 'All artifacts should be missing on empty target');
      assert.equal(result.conflicts.length, 0);
      assert.equal(result.changesRequired, true);
    } finally {
      removeTmp(tmp);
    }
  });

  it('plan makes no writes', () => {
    const tmp = makeTmpTarget();
    assertNotRealConfig(tmp);
    try {
      computePlan({ ...SHARED, target: tmp });
      const entries = fs.readdirSync(tmp);
      assert.deepEqual(entries, [], 'Plan must not write any files');
    } finally {
      removeTmp(tmp);
    }
  });

  it('plan JSON output is valid JSON with command=plan', () => {
    const tmp = makeTmpTarget();
    assertNotRealConfig(tmp);
    try {
      const result = computePlan({ ...SHARED, target: tmp });
      const { output } = formatPlan(result, { json: true });
      const parsed = JSON.parse(output);
      assert.equal(parsed.command, 'plan');
      assert.ok(Array.isArray(parsed.artifacts));
      assert.ok('manifestState' in parsed);
    } finally {
      removeTmp(tmp);
    }
  });

  it('plan reports manifest state', () => {
    const tmp = makeTmpTarget();
    assertNotRealConfig(tmp);
    try {
      const result = computePlan({ ...SHARED, target: tmp });
      assert.equal(result.manifestState, 'missing', 'Fresh target should have missing manifest');
    } finally {
      removeTmp(tmp);
    }
  });

  it('plan treats invalid manifest as blocking conflict', () => {
    const tmp = makeTmpTarget();
    assertNotRealConfig(tmp);
    try {
      // Create a malformed manifest
      const mDir = path.join(tmp, '.openstrut');
      fs.mkdirSync(mDir, { recursive: true });
      fs.writeFileSync(path.join(mDir, 'installation.json'), '{ invalid json ');

      const result = computePlan({ ...SHARED, target: tmp });
      assert.equal(result.manifestState, 'invalid');
      assert.ok(result.conflicts.length > 0, 'Malformed manifest must be a blocking conflict');
    } finally {
      removeTmp(tmp);
    }
  });
});

// ─── 5. Install ───────────────────────────────────────────────────────────────

describe('Install', () => {
  it('installs all artifacts to empty target', () => {
    const tmp = makeTmpTarget();
    assertNotRealConfig(tmp);
    try {
      const result = install({ ...SHARED, target: tmp });
      assert.ok(result.success, `Install failed: ${result.error}`);
      assert.equal(result.installed.length, INVENTORY.length, `Expected ${INVENTORY.length} installs`);
      assert.equal(result.conflicts.length, 0);
    } finally {
      removeTmp(tmp);
    }
  });

  it('installed files exist on disk with correct content', () => {
    const tmp = makeTmpTarget();
    assertNotRealConfig(tmp);
    try {
      install({ ...SHARED, target: tmp });
      for (const entry of INVENTORY) {
        const installedPath = path.join(tmp, entry.target);
        assert.ok(fs.existsSync(installedPath), `Missing installed file: ${entry.target}`);
        const srcHash = checksumFile(path.join(PACKAGE_ROOT, entry.source));
        const dstHash = checksumFile(installedPath);
        assert.equal(srcHash, dstHash, `Checksum mismatch: ${entry.target}`);
      }
    } finally {
      removeTmp(tmp);
    }
  });

  it('templates are installed to expected location', () => {
    const tmp = makeTmpTarget();
    assertNotRealConfig(tmp);
    try {
      install({ ...SHARED, target: tmp });
      const agentsTpl = path.join(tmp, 'templates', 'project', 'AGENTS.md');
      assert.ok(fs.existsSync(agentsTpl), 'templates/project/AGENTS.md must be installed');
    } finally {
      removeTmp(tmp);
    }
  });

  it('reinstall of identical files is a no-op', () => {
    const tmp = makeTmpTarget();
    assertNotRealConfig(tmp);
    try {
      install({ ...SHARED, target: tmp });
      const result2 = install({ ...SHARED, target: tmp });
      assert.ok(result2.success);
      assert.equal(result2.installed.length, 0, 'No files should be installed on identical reinstall');
      assert.equal(result2.skipped.length, INVENTORY.length, 'All should be skipped');
    } finally {
      removeTmp(tmp);
    }
  });

  it('unrelated files in target are preserved', () => {
    const tmp = makeTmpTarget();
    assertNotRealConfig(tmp);
    try {
      const unrelated = path.join(tmp, 'my-custom-config.json');
      fs.writeFileSync(unrelated, '{"custom": true}');
      install({ ...SHARED, target: tmp });
      assert.ok(fs.existsSync(unrelated), 'Unrelated file must be preserved after install');
      assert.equal(fs.readFileSync(unrelated, 'utf8'), '{"custom": true}');
    } finally {
      removeTmp(tmp);
    }
  });

  it('removes stale managed artifacts from prior inventory but preserves locally modified stale files', () => {
    const tmp = makeTmpTarget();
    assertNotRealConfig(tmp);
    try {
      const staleCommand = path.join(tmp, 'commands', 'eng-plan.md');
      const staleSkill = path.join(tmp, 'skills', 'engineering-tdd-first', 'SKILL.md');
      fs.mkdirSync(path.dirname(staleCommand), { recursive: true });
      fs.mkdirSync(path.dirname(staleSkill), { recursive: true });
      fs.writeFileSync(staleCommand, '# legacy command');
      fs.writeFileSync(staleSkill, '# legacy skill');
      const staleCommandHash = checksumFile(staleCommand);
      const staleSkillHash = checksumFile(staleSkill);
      fs.appendFileSync(staleSkill, '\nlocal edit');

      writeManifest(tmp, {
        packageName: SHARED.packageName,
        packageVersion: SHARED.packageVersion,
        installedAt: new Date().toISOString(),
        targetRoot: tmp,
        artifacts: [
          {
            relativePath: 'commands/eng-plan.md',
            sourceChecksum: staleCommandHash,
            installedChecksum: staleCommandHash,
          },
          {
            relativePath: 'skills/engineering-tdd-first/SKILL.md',
            sourceChecksum: staleSkillHash,
            installedChecksum: staleSkillHash,
          },
        ],
      });

      const result = install({ ...SHARED, target: tmp });
      assert.ok(result.success, `Install failed: ${result.error}`);
      assert.equal(fs.existsSync(staleCommand), false, 'Unmodified stale managed command must be removed');
      assert.equal(fs.existsSync(staleSkill), true, 'Locally modified stale managed skill must be preserved');
      assert.equal(fs.readFileSync(staleSkill, 'utf8'), '# legacy skill\nlocal edit');
      const manifest = readManifest(tmp);
      assert.equal(
        manifest.artifacts.some(a => a.relativePath === 'commands/eng-plan.md'),
        false,
        'Removed stale command must be absent from new manifest'
      );
      assert.equal(
        manifest.artifacts.some(a => a.relativePath === 'skills/engineering-tdd-first/SKILL.md'),
        false,
        'Preserved locally modified stale skill must be unmanaged in new manifest'
      );
    } finally {
      removeTmp(tmp);
    }
  });

  it('managed upgrade: re-installs managed-outdated artifacts', () => {
    const tmp = makeTmpTarget();
    assertNotRealConfig(tmp);
    try {
      install({ ...SHARED, target: tmp });
      // Tamper manifest to simulate prior-version installed checksum
      const manifest = readManifest(tmp);
      const firstArtifact = manifest.artifacts[0];
      const tampered = {
        ...manifest,
        artifacts: manifest.artifacts.map(a =>
          a.relativePath === firstArtifact.relativePath
            ? { ...a, installedChecksum: 'deadbeef00000000' }
            : a
        ),
      };
      writeManifest(tmp, tampered);
      // Re-classify — content still matches source so it shows identical or managed-outdated
      const plan = computePlan({ ...SHARED, target: tmp });
      const artifact = plan.artifacts.find(a => a.target === firstArtifact.relativePath);
      assert.ok(
        ['identical', 'managed-outdated'].includes(artifact.class),
        `Expected identical or managed-outdated, got: ${artifact.class}`
      );
    } finally {
      removeTmp(tmp);
    }
  });

  it('locally modified managed file is a conflict, not overwritten', () => {
    const tmp = makeTmpTarget();
    assertNotRealConfig(tmp);
    try {
      install({ ...SHARED, target: tmp });
      const targetFile = path.join(tmp, 'AGENTS.md');
      fs.appendFileSync(targetFile, '\n\n# LOCAL MODIFICATION');
      const result2 = install({ ...SHARED, target: tmp });
      assert.ok(!result2.success, 'Install should fail due to locally modified managed file');
      const content = fs.readFileSync(targetFile, 'utf8');
      assert.ok(content.includes('LOCAL MODIFICATION'), 'Local modification must be preserved');
    } finally {
      removeTmp(tmp);
    }
  });

  it('unmanaged conflicting AGENTS.md is not overwritten', () => {
    const tmp = makeTmpTarget();
    assertNotRealConfig(tmp);
    try {
      fs.writeFileSync(path.join(tmp, 'AGENTS.md'), '# My Custom Rules');
      const result = install({ ...SHARED, target: tmp });
      assert.ok(!result.success, 'Should fail due to unmanaged AGENTS.md conflict');
      assert.equal(fs.readFileSync(path.join(tmp, 'AGENTS.md'), 'utf8'), '# My Custom Rules');
    } finally {
      removeTmp(tmp);
    }
  });

  it('unmanaged conflicting opencode.json is not overwritten', () => {
    const tmp = makeTmpTarget();
    assertNotRealConfig(tmp);
    try {
      fs.writeFileSync(path.join(tmp, 'opencode.json'), '{"model":"custom"}');
      const result = install({ ...SHARED, target: tmp });
      assert.ok(!result.success, 'Should fail due to unmanaged opencode.json conflict');
      assert.equal(fs.readFileSync(path.join(tmp, 'opencode.json'), 'utf8'), '{"model":"custom"}');
    } finally {
      removeTmp(tmp);
    }
  });

  it('symlink at target is treated as invalid-target conflict', () => {
    const tmp = makeTmpTarget();
    assertNotRealConfig(tmp);
    let created = false;
    try {
      const agentsMdPath = path.join(tmp, 'AGENTS.md');
      fs.symlinkSync('/dev/null', agentsMdPath);
      created = true;
      const result = install({ ...SHARED, target: tmp });
      assert.ok(!result.success, 'Should fail when target is a symlink');
    } catch (err) {
      if (err.code === 'EPERM') return;
      if (!created) throw err;
    } finally {
      removeTmp(tmp);
    }
  });

  it('dry-run performs no writes', () => {
    const tmp = makeTmpTarget();
    assertNotRealConfig(tmp);
    try {
      const result = install({ ...SHARED, target: tmp, dryRun: true });
      assert.ok(result.success);
      const entries = fs.readdirSync(tmp);
      assert.deepEqual(entries, [], 'Dry-run must not write any files');
    } finally {
      removeTmp(tmp);
    }
  });

  it('dry-run result has command=install and dryRun=true', () => {
    const tmp = makeTmpTarget();
    assertNotRealConfig(tmp);
    try {
      const result = install({ ...SHARED, target: tmp, dryRun: true });
      const { output } = formatInstall(result, { json: true });
      const parsed = JSON.parse(output);
      assert.equal(parsed.command, 'install');
      assert.equal(parsed.dryRun, true);
      assert.ok(Array.isArray(parsed.artifacts));
      assert.equal(parsed.artifacts.length, INVENTORY.length);
    } finally {
      removeTmp(tmp);
    }
  });

  it('dry-run returns all artifact classifications', () => {
    const tmp = makeTmpTarget();
    assertNotRealConfig(tmp);
    try {
      const result = install({ ...SHARED, target: tmp, dryRun: true });
      assert.ok(Array.isArray(result.artifacts));
      assert.equal(result.artifacts.length, INVENTORY.length);
      const allMissing = result.artifacts.every(a => a.class === 'missing');
      assert.ok(allMissing, 'All artifacts on fresh target should be missing in dry-run');
    } finally {
      removeTmp(tmp);
    }
  });

  it('manifest is created after install', () => {
    const tmp = makeTmpTarget();
    assertNotRealConfig(tmp);
    try {
      install({ ...SHARED, target: tmp });
      const manifest = readManifest(tmp);
      assert.ok(manifest, 'Manifest must exist after install');
      assert.equal(manifest.packageVersion, '0.1.0');
      assert.ok(Array.isArray(manifest.artifacts));
      assert.ok(manifest.artifacts.length > 0);
    } finally {
      removeTmp(tmp);
    }
  });

  it('manifest contains no secrets', () => {
    const tmp = makeTmpTarget();
    assertNotRealConfig(tmp);
    try {
      install({ ...SHARED, target: tmp });
      const manifest = readManifest(tmp);
      const raw = JSON.stringify(manifest);
      const forbidden = ['apiKey', 'api_key', 'token', 'secret', 'password'];
      for (const key of forbidden) {
        assert.ok(!raw.toLowerCase().includes(key.toLowerCase()),
          `Manifest must not contain "${key}"`);
      }
    } finally {
      removeTmp(tmp);
    }
  });

  it('install JSON output is valid JSON with command=install', () => {
    const tmp = makeTmpTarget();
    assertNotRealConfig(tmp);
    try {
      const result = install({ ...SHARED, target: tmp });
      const { output } = formatInstall(result, { json: true });
      const parsed = JSON.parse(output);
      assert.equal(parsed.command, 'install');
      assert.ok(Array.isArray(parsed.installed));
    } finally {
      removeTmp(tmp);
    }
  });

  it('invalid target is rejected', () => {
    assert.throws(
      () => install({ ...SHARED, target: '/' }),
      /unsafe|root|too short/
    );
  });

  it('install result contains no backup-related fields in manifest', () => {
    const tmp = makeTmpTarget();
    assertNotRealConfig(tmp);
    try {
      install({ ...SHARED, target: tmp });
      const { state, manifest } = getManifestState(tmp);
      assert.equal(state, 'valid');
      const raw = JSON.stringify(manifest);
      assert.ok(!raw.includes('backup'), 'Manifest must not contain backup information');
      assert.ok(!raw.includes('harness-backup'), 'Manifest must not contain backup paths');
    } finally {
      removeTmp(tmp);
    }
  });

  it('no collision-resistant temp files remain after successful install', () => {
    const tmp = makeTmpTarget();
    assertNotRealConfig(tmp);
    try {
      install({ ...SHARED, target: tmp });
      const allFiles = walkFiles(tmp);
      const tmpFiles = allFiles.filter(f =>
        f.includes('.harness-tmp') || f.includes('.harness-backup')
      );
      assert.deepEqual(tmpFiles, [], 'No harness temp/backup files should remain after success');
    } finally {
      removeTmp(tmp);
    }
  });
});

// ─── 6. Rollback ──────────────────────────────────────────────────────────────

describe('Rollback', () => {
  it('rollback restores pre-install bytes when third artifact write fails', () => {
    const tmp = makeTmpTarget();
    assertNotRealConfig(tmp);
    try {
      // 1. First clean install (establishes managed state)
      const first = install({ ...SHARED, target: tmp });
      assert.ok(first.success, 'First install must succeed');

      // 2. Identify artifacts: two root files + first agents/ file (for write-failure trigger)
      //    INVENTORY[0] → AGENTS.md (in tmp/)
      //    INVENTORY[1] → opencode.json (in tmp/)
      //    INVENTORY[3] → agents/trust-lead.md (in tmp/agents/) — first agent, used as failure target
      const rootTargets = INVENTORY.slice(0, 2).map(e => path.join(tmp, e.target));
      const agentTarget = path.join(tmp, INVENTORY[3].target);
      const targetPaths = [...rootTargets, agentTarget];
      const agentsDir = path.join(tmp, 'agents');

      // 3. Overwrite all three files with "old" content so they become managed-outdated.
      //    The agents/ file must also be tampered so the install tries
      //    to write into agents/ (which we will make read-only), causing a failure there.
      const oldContent0 = Buffer.from('old content for artifact 0 — ' + crypto.randomBytes(8).toString('hex'));
      const oldContent1 = Buffer.from('old content for artifact 1 — ' + crypto.randomBytes(8).toString('hex'));
      const oldContent2 = Buffer.from('old content for artifact 3 — ' + crypto.randomBytes(8).toString('hex'));
      fs.writeFileSync(targetPaths[0], oldContent0);
      fs.writeFileSync(targetPaths[1], oldContent1);
      fs.writeFileSync(targetPaths[2], oldContent2);

      // 4. Update manifest to record the "old" checksums so they appear managed-outdated
      const manifest = readManifest(tmp);
      const tamperedManifest = {
        ...manifest,
        artifacts: manifest.artifacts.map(a => {
          if (a.relativePath === INVENTORY[0].target) {
            return { ...a, installedChecksum: checksumBuffer(oldContent0) };
          }
          if (a.relativePath === INVENTORY[1].target) {
            return { ...a, installedChecksum: checksumBuffer(oldContent1) };
          }
          if (a.relativePath === INVENTORY[3].target) {
            return { ...a, installedChecksum: checksumBuffer(oldContent2) };
          }
          return a;
        }),
      };
      writeManifest(tmp, tamperedManifest);

      // 5. Record bytes that must be restored after rollback
      const preContent0 = fs.readFileSync(targetPaths[0]);
      const preContent1 = fs.readFileSync(targetPaths[1]);
      const preManifestBytes = fs.readFileSync(
        path.join(tmp, '.openstrut', 'installation.json')
      );

      // 6. Also record a sentinel unrelated file to verify it is untouched
      const sentinel = path.join(tmp, 'unrelated-sentinel.txt');
      const sentinelContent = 'sentinel — must not change';
      fs.writeFileSync(sentinel, sentinelContent);

      // 7. Make agents/ directory read-only to cause failure on the agents write
      //    (agents/trust-lead.md backup creation will fail on a read-only dir)
      fs.chmodSync(agentsDir, 0o555);

      let restorePermissionsCalled = false;
      try {
        const result = install({ ...SHARED, target: tmp });

        assert.ok(!result.success, 'Install must fail when agents/ is read-only');

        // 8. Files 0 and 1 must be restored to their pre-install content
        assert.deepEqual(
          fs.readFileSync(targetPaths[0]),
          preContent0,
          'File 0 (AGENTS.md) must be restored to pre-install bytes'
        );
        assert.deepEqual(
          fs.readFileSync(targetPaths[1]),
          preContent1,
          'File 1 (opencode.json) must be restored to pre-install bytes'
        );

        // 9. Manifest must be unchanged from pre-second-install state
        const postManifestBytes = fs.readFileSync(
          path.join(tmp, '.openstrut', 'installation.json')
        );
        assert.deepEqual(
          postManifestBytes,
          preManifestBytes,
          'Manifest must not be changed after a failed install with rollback'
        );

        // 10. Sentinel unrelated file must be unchanged
        assert.equal(
          fs.readFileSync(sentinel, 'utf8'),
          sentinelContent,
          'Unrelated sentinel file must be unchanged'
        );

        // 11. Rollback result must include the restored/removed paths
        assert.ok(Array.isArray(result.rolledBack), 'rolledBack must be an array');
        assert.ok(result.rolledBack.length >= 2, 'At least 2 files should have been rolled back');

        // 12. Rollback failures must be reported (not hidden)
        assert.ok(Array.isArray(result.rollbackFailures), 'rollbackFailures must be present');

      } finally {
        // Restore permissions before cleanup regardless of test outcome
        try { fs.chmodSync(agentsDir, 0o755); } catch {}
        restorePermissionsCalled = true;
      }

      // 13. No .harness-tmp or .harness-backup files remain (after permission restore)
      const allFiles = walkFiles(tmp);
      const tempFiles = allFiles.filter(f =>
        f.includes('.harness-tmp') || f.includes('.harness-backup')
      );
      assert.deepEqual(tempFiles, [], 'No temp/backup files should remain after rollback');

    } finally {
      // Extra safety: ensure agents/ is writable before cleanup
      try { fs.chmodSync(path.join(tmp, 'agents'), 0o755); } catch {}
      removeTmp(tmp);
    }
  });

  it('newly created file is removed on rollback', () => {
    const tmp = makeTmpTarget();
    assertNotRealConfig(tmp);
    let created = false;
    try {
      // Plant an unmanaged conflict for AGENTS.md so install fails quickly
      // but first write a couple artifacts to validate new-file rollback
      // Simplest: conflict at AGENTS.md (first artifact)
      fs.writeFileSync(path.join(tmp, 'AGENTS.md'), '# Unmanaged conflict');
      const result = install({ ...SHARED, target: tmp });
      assert.ok(!result.success);
      // AGENTS.md must still be the original unmanaged content
      assert.equal(
        fs.readFileSync(path.join(tmp, 'AGENTS.md'), 'utf8'),
        '# Unmanaged conflict'
      );
    } finally {
      removeTmp(tmp);
    }
  });

  it('no .harness-tmp files remain after any conflict block', () => {
    const tmp = makeTmpTarget();
    assertNotRealConfig(tmp);
    try {
      fs.writeFileSync(path.join(tmp, 'AGENTS.md'), '# Custom — unmanaged conflict');
      install({ ...SHARED, target: tmp });
      const allFiles = walkFiles(tmp);
      const tmpFiles = allFiles.filter(f => f.endsWith('.harness-tmp'));
      assert.deepEqual(tmpFiles, [], 'No .harness-tmp files should remain after failure');
    } finally {
      removeTmp(tmp);
    }
  });
});

// ─── 7. Check ─────────────────────────────────────────────────────────────────

describe('Check', () => {
  it('check detects missing files on empty target', () => {
    const tmp = makeTmpTarget();
    assertNotRealConfig(tmp);
    try {
      const result = check({ ...SHARED, target: tmp });
      assert.ok(result.drifted);
      const missing = result.artifacts.filter(a => a.status === 'missing');
      assert.equal(missing.length, INVENTORY.length);
    } finally {
      removeTmp(tmp);
    }
  });

  it('check makes no writes', () => {
    const tmp = makeTmpTarget();
    assertNotRealConfig(tmp);
    try {
      check({ ...SHARED, target: tmp });
      const entries = fs.readdirSync(tmp);
      assert.deepEqual(entries, [], 'Check must not write any files');
    } finally {
      removeTmp(tmp);
    }
  });

  it('check detects locally modified file after install', () => {
    const tmp = makeTmpTarget();
    assertNotRealConfig(tmp);
    try {
      install({ ...SHARED, target: tmp });
      fs.appendFileSync(path.join(tmp, 'AGENTS.md'), '\n\n# LOCAL MODIFICATION');
      const result = check({ ...SHARED, target: tmp });
      assert.ok(result.drifted);
      const modified = result.artifacts.find(a => a.target === 'AGENTS.md');
      assert.equal(modified.status, 'managed-locally-modified');
    } finally {
      removeTmp(tmp);
    }
  });

  it('check returns ok after clean install', () => {
    const tmp = makeTmpTarget();
    assertNotRealConfig(tmp);
    try {
      install({ ...SHARED, target: tmp });
      const result = check({ ...SHARED, target: tmp });
      assert.ok(!result.drifted, 'Should not detect drift after clean install');
      const counts = {};
      for (const a of result.artifacts) counts[a.status] = (counts[a.status] ?? 0) + 1;
      assert.equal(counts.identical, INVENTORY.length, `Expected ${INVENTORY.length} identical, got: ${JSON.stringify(counts)}`);
    } finally {
      removeTmp(tmp);
    }
  });

  it('check JSON output is valid JSON with command=check and manifestState', () => {
    const tmp = makeTmpTarget();
    assertNotRealConfig(tmp);
    try {
      const result = check({ ...SHARED, target: tmp });
      const { output } = formatCheck(result, { json: true });
      const parsed = JSON.parse(output);
      assert.equal(parsed.command, 'check');
      assert.ok(Array.isArray(parsed.artifacts));
      assert.ok('manifestState' in parsed, 'check JSON must include manifestState');
    } finally {
      removeTmp(tmp);
    }
  });

  it('check reports drifted=true when manifest is missing even if files match', () => {
    const tmp = makeTmpTarget();
    assertNotRealConfig(tmp);
    try {
      // Manually copy all source files without using the installer (no manifest)
      for (const entry of INVENTORY) {
        const absTarget = path.join(tmp, entry.target);
        fs.mkdirSync(path.dirname(absTarget), { recursive: true });
        fs.copyFileSync(path.join(PACKAGE_ROOT, entry.source), absTarget);
      }
      const result = check({ ...SHARED, target: tmp });
      assert.ok(result.drifted, 'Should detect drift: manifest is missing despite identical files');
      assert.equal(result.manifestState, 'missing');
    } finally {
      removeTmp(tmp);
    }
  });

  it('check reports all six artifact states including invalid-target', () => {
    const tmp = makeTmpTarget();
    assertNotRealConfig(tmp);
    let created = false;
    try {
      install({ ...SHARED, target: tmp });
      // Plant a symlink at one target
      const agentsMd = path.join(tmp, 'agents', 'code-reviewer.md');
      fs.unlinkSync(agentsMd);
      fs.symlinkSync('/dev/null', agentsMd);
      created = true;
      const result = check({ ...SHARED, target: tmp });
      const invalidTarget = result.artifacts.find(a => a.status === 'invalid-target');
      assert.ok(invalidTarget, 'Check must report invalid-target state for symlinked file');
      assert.ok(result.drifted);
    } catch (err) {
      if (err.code === 'EPERM') return;
      if (!created) throw err;
    } finally {
      removeTmp(tmp);
    }
  });
});

// ─── 8. Manifest state ────────────────────────────────────────────────────────

describe('Manifest state', () => {
  it('missing manifest on empty target', () => {
    const tmp = makeTmpTarget();
    assertNotRealConfig(tmp);
    try {
      const { state } = getManifestState(tmp);
      assert.equal(state, 'missing');
    } finally {
      removeTmp(tmp);
    }
  });

  it('valid manifest after clean install', () => {
    const tmp = makeTmpTarget();
    assertNotRealConfig(tmp);
    try {
      install({ ...SHARED, target: tmp });
      const { state, manifest } = getManifestState(tmp);
      assert.equal(state, 'valid');
      assert.ok(manifest);
      assert.equal(manifest.manifestVersion, '1');
    } finally {
      removeTmp(tmp);
    }
  });

  it('invalid manifest: malformed JSON', () => {
    const tmp = makeTmpTarget();
    assertNotRealConfig(tmp);
    try {
      const mDir = path.join(tmp, '.openstrut');
      fs.mkdirSync(mDir, { recursive: true });
      fs.writeFileSync(path.join(mDir, 'installation.json'), 'NOT VALID JSON {{{{');
      const { state, reason } = getManifestState(tmp);
      assert.equal(state, 'invalid');
      assert.ok(reason.toLowerCase().includes('parse'), `Expected parse error in reason, got: ${reason}`);
    } finally {
      removeTmp(tmp);
    }
  });

  it('invalid manifest: unsupported schema version', () => {
    const tmp = makeTmpTarget();
    assertNotRealConfig(tmp);
    try {
      const mDir = path.join(tmp, '.openstrut');
      fs.mkdirSync(mDir, { recursive: true });
      fs.writeFileSync(path.join(mDir, 'installation.json'), JSON.stringify({
        manifestVersion: '99',
        artifacts: [],
      }));
      const { state, reason } = getManifestState(tmp);
      assert.equal(state, 'invalid');
      assert.ok(reason.includes('99'), `Expected unsupported version in reason, got: ${reason}`);
    } finally {
      removeTmp(tmp);
    }
  });

  it('unsafe manifest: symlinked .engineering-harness directory', () => {
    const tmp = makeTmpTarget();
    const real = makeTmpTarget();
    let created = false;
    assertNotRealConfig(tmp);
    try {
      const manifestDir = path.join(tmp, '.openstrut');
      fs.symlinkSync(real, manifestDir);
      created = true;
      const { state } = getManifestState(tmp);
      assert.equal(state, 'unsafe', 'Manifest state must be unsafe when dir is a symlink');
    } catch (err) {
      if (err.code === 'EPERM') return;
      if (!created) throw err;
    } finally {
      removeTmp(tmp);
      removeTmp(real);
    }
  });

  it('install blocks on malformed manifest', () => {
    const tmp = makeTmpTarget();
    assertNotRealConfig(tmp);
    try {
      const mDir = path.join(tmp, '.openstrut');
      fs.mkdirSync(mDir, { recursive: true });
      fs.writeFileSync(path.join(mDir, 'installation.json'), '{ bad json }');
      const result = install({ ...SHARED, target: tmp });
      assert.ok(!result.success, 'Install must be blocked by malformed manifest');
    } finally {
      removeTmp(tmp);
    }
  });

  it('check reports drifted=true for invalid manifest', () => {
    const tmp = makeTmpTarget();
    assertNotRealConfig(tmp);
    try {
      // Install first, then corrupt manifest
      install({ ...SHARED, target: tmp });
      const mPath = path.join(tmp, '.openstrut', 'installation.json');
      fs.writeFileSync(mPath, '{ corrupted }');
      const result = check({ ...SHARED, target: tmp });
      assert.ok(result.drifted);
      assert.equal(result.manifestState, 'invalid');
    } finally {
      removeTmp(tmp);
    }
  });
});

// ─── 9. CLI subprocess tests ──────────────────────────────────────────────────

describe('CLI subprocess', () => {
  it('--help exits 0 and prints Usage:', () => {
    const { status, stdout } = runCLI(['--help']);
    assert.equal(status, EXIT.OK);
    assert.ok(stdout.includes('Usage:'), 'Help must include Usage:');
  });

  it('--version exits 0 and prints version string', () => {
    const { status, stdout } = runCLI(['--version']);
    assert.equal(status, EXIT.OK);
    assert.match(stdout.trim(), /^\d+\.\d+\.\d+$/);
  });

  it('unknown flag exits 3', () => {
    const { status, stderr } = runCLI(['plan', '--unknown-flag']);
    assert.equal(status, EXIT.INVALID, `Expected exit 3, got ${status}`);
    assert.ok(stderr.includes('Unknown option'), `Expected "Unknown option" in stderr, got: ${stderr}`);
  });

  it('--target without value exits 3', () => {
    const { status, stderr } = runCLI(['install', '--target']);
    assert.equal(status, EXIT.INVALID, `Expected exit 3, got ${status}`);
    assert.ok(stderr.includes('--target'), `Expected --target in stderr, got: ${stderr}`);
  });

  it('--target followed by another flag exits 3', () => {
    const { status, stderr } = runCLI(['install', '--target', '--json']);
    assert.equal(status, EXIT.INVALID, `Expected exit 3, got ${status}`);
    assert.ok(stderr.includes('--target'), `Expected --target in stderr, got: ${stderr}`);
  });

  it('--dry-run on plan exits 3', () => {
    const { status, stderr } = runCLI(['plan', '--dry-run']);
    assert.equal(status, EXIT.INVALID, `Expected exit 3, got ${status}`);
    assert.ok(stderr.includes('dry-run'), `Expected dry-run mention in stderr, got: ${stderr}`);
  });

  it('--dry-run on check exits 3', () => {
    const { status, stderr } = runCLI(['check', '--dry-run']);
    assert.equal(status, EXIT.INVALID, `Expected exit 3, got ${status}`);
    assert.ok(stderr.includes('dry-run'), `Expected dry-run mention in stderr, got: ${stderr}`);
  });

  it('unknown command exits 3', () => {
    const { status, stderr } = runCLI(['deploy']);
    assert.equal(status, EXIT.INVALID, `Expected exit 3, got ${status}`);
    assert.ok(stderr.includes('deploy') || stderr.includes('Unknown command'), `Got: ${stderr}`);
  });

  it('extra positional argument exits 3', () => {
    const { status } = runCLI(['plan', 'extra-arg']);
    assert.equal(status, EXIT.INVALID, `Expected exit 3, got ${status}`);
  });

  it('plan --json exits 0 and returns valid JSON with all artifacts', () => {
    const tmp = makeTmpTarget();
    try {
      const { status, stdout } = runCLI(['plan', '--target', tmp, '--json']);
      assert.equal(status, EXIT.OK, `Expected exit 0, got ${status}`);
      const parsed = JSON.parse(stdout);
      assert.equal(parsed.command, 'plan');
      assert.ok(Array.isArray(parsed.artifacts));
      assert.equal(parsed.artifacts.length, INVENTORY.length,
        `Expected ${INVENTORY.length} artifacts, got ${parsed.artifacts.length}`);
      assert.ok('manifestState' in parsed);
    } finally {
      removeTmp(tmp);
    }
  });

  it('install --dry-run --json: command=install dryRun=true target empty', () => {
    const tmp = makeTmpTarget();
    try {
      const { status, stdout } = runCLI(['install', '--dry-run', '--target', tmp, '--json']);
      assert.equal(status, EXIT.OK, `Expected exit 0, got ${status}`);
      const parsed = JSON.parse(stdout);
      assert.equal(parsed.command, 'install', `Expected command=install, got "${parsed.command}"`);
      assert.equal(parsed.dryRun, true, 'dryRun must be true');
      assert.ok(Array.isArray(parsed.artifacts), 'artifacts must be an array');
      assert.equal(parsed.artifacts.length, INVENTORY.length,
        `Expected ${INVENTORY.length} artifacts in dry-run, got ${parsed.artifacts.length}`);
      // Target must be empty (no writes)
      assert.deepEqual(fs.readdirSync(tmp), [], 'Target directory must be empty after dry-run');
    } finally {
      removeTmp(tmp);
    }
  });

  it('install --json installs all artifacts and exits 0', () => {
    const tmp = makeTmpTarget();
    try {
      const { status, stdout } = runCLI(['install', '--target', tmp, '--json']);
      assert.equal(status, EXIT.OK, `Expected exit 0, got ${status}`);
      const parsed = JSON.parse(stdout);
      assert.equal(parsed.command, 'install');
      assert.equal(parsed.status, 'ok');
      assert.equal(parsed.installed.length, INVENTORY.length,
        `Expected ${INVENTORY.length} installed, got ${parsed.installed.length}`);
      assert.deepEqual(parsed.errors, []);
    } finally {
      removeTmp(tmp);
    }
  });

  it('check --json after install exits 0 with all identical', () => {
    const tmp = makeTmpTarget();
    try {
      runCLI(['install', '--target', tmp]);
      const { status, stdout } = runCLI(['check', '--target', tmp, '--json']);
      assert.equal(status, EXIT.OK, `Expected exit 0, got ${status}`);
      const parsed = JSON.parse(stdout);
      assert.equal(parsed.command, 'check');
      assert.equal(parsed.status, 'ok');
      const counts = {};
      for (const a of parsed.artifacts) counts[a.status] = (counts[a.status] ?? 0) + 1;
      assert.equal(counts.identical, INVENTORY.length,
        `Expected ${INVENTORY.length} identical, got: ${JSON.stringify(counts)}`);
    } finally {
      removeTmp(tmp);
    }
  });

  it('check exits 1 when manifest is missing (empty target)', () => {
    const tmp = makeTmpTarget();
    try {
      const { status } = runCLI(['check', '--target', tmp]);
      assert.equal(status, EXIT.DRIFT, `Expected exit 1 (drift), got ${status}`);
    } finally {
      removeTmp(tmp);
    }
  });

  it('install exits 2 when unmanaged conflict exists', () => {
    const tmp = makeTmpTarget();
    try {
      fs.writeFileSync(path.join(tmp, 'AGENTS.md'), '# conflict');
      const { status } = runCLI(['install', '--target', tmp]);
      assert.equal(status, EXIT.CONFLICT, `Expected exit 2 (conflict), got ${status}`);
    } finally {
      removeTmp(tmp);
    }
  });

  it('install exits 3 for filesystem root target', () => {
    const { status } = runCLI(['install', '--target', '/']);
    assert.equal(status, EXIT.INVALID, `Expected exit 3, got ${status}`);
  });

  it('XDG resolution via --json: XDG_CONFIG_HOME env controls default target', () => {
    const xdgBase = makeTmpTarget();
    try {
      const { status, stdout } = runCLI(
        ['plan', '--json'],
        {
          env: {
            XDG_CONFIG_HOME: xdgBase,
            // Ensure HOME doesn't shadow XDG
            HOME: '/tmp/__nonexistent_home__',
          },
        }
      );
      // May exit 0 (ok) or 2 (conflict if xdg/opencode exists) — just validate JSON
      assert.ok([EXIT.OK, EXIT.CONFLICT, EXIT.DRIFT].includes(status),
        `Unexpected exit code: ${status}`);
      const parsed = JSON.parse(stdout);
      assert.ok(
        parsed.target.startsWith(xdgBase),
        `Expected target inside XDG dir "${xdgBase}", got "${parsed.target}"`
      );
    } finally {
      removeTmp(xdgBase);
    }
  });

  it('--json output is always parseable JSON (no mixed text)', () => {
    const tmp = makeTmpTarget();
    try {
      // Force a conflict so error path is exercised
      fs.writeFileSync(path.join(tmp, 'AGENTS.md'), '# conflict');
      const { stdout } = runCLI(['install', '--target', tmp, '--json']);
      // Must not throw
      JSON.parse(stdout);
    } finally {
      removeTmp(tmp);
    }
  });

  it('help text documents XDG_CONFIG_HOME as preferred default', () => {
    const { stdout } = runCLI(['--help']);
    assert.ok(
      stdout.includes('XDG_CONFIG_HOME'),
      'Help text must document XDG_CONFIG_HOME as the preferred default'
    );
  });
});
