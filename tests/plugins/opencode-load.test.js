/**
 * OpenCode plugin loader tests (HARNESS-052).
 *
 * Skills live in `global/skills/<name>/SKILL.md` subdirectories; the plugin
 * must discover them there instead of expecting flat `.md` files.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { loadSkills, loadAgents, loadContext, loadCommands, resolveContentDir } from '../../.opencode/plugins/opentrust.js';

describe('OpenCode plugin loaders', () => {
  it('loadSkills discovers skills from subdirectories', () => {
    const skills = loadSkills();
    const opentrustSkills = Object.keys(skills).filter((name) => name.startsWith('opentrust-'));
    assert.ok(
      opentrustSkills.length >= 11,
      `Expected at least 11 opentrust-* skills, got ${opentrustSkills.length}`,
    );
  });

  it('loadAgents discovers agents from global/agents/', () => {
    const agents = loadAgents();
    assert.ok(Object.keys(agents).length >= 40, `Expected at least 40 agents, got ${Object.keys(agents).length}`);
  });

  it('loadContext discovers contexts and bundles', () => {
    const context = loadContext();
    assert.ok(Object.keys(context.contexts).length >= 32, `Expected at least 32 contexts, got ${Object.keys(context.contexts).length}`);
    assert.ok(Object.keys(context.bundles).length >= 24, `Expected at least 24 bundles, got ${Object.keys(context.bundles).length}`);
  });

  it('loadCommands discovers commands from global/commands/', () => {
    const commands = loadCommands();
    assert.ok(Object.keys(commands).length >= 10, `Expected at least 10 commands, got ${Object.keys(commands).length}`);
  });
});

describe('OpenCode plugin content resolution', () => {
  it('prefers installed flat layout when present', () => {
    const tmp = mkdtempSync(join(tmpdir(), 'opentrust-installed-'));
    try {
      mkdirSync(join(tmp, 'agents'), { recursive: true });
      writeFileSync(join(tmp, 'agents', 'trust-lead.md'), '# trust-lead');
      assert.equal(resolveContentDir(tmp, 'agents'), join(tmp, 'agents'));
    } finally {
      rmSync(tmp, { recursive: true, force: true });
    }
  });

  it('falls back to repo global/ layout', () => {
    const tmp = mkdtempSync(join(tmpdir(), 'opentrust-repo-'));
    try {
      mkdirSync(join(tmp, 'global', 'agents'), { recursive: true });
      writeFileSync(join(tmp, 'global', 'agents', 'trust-lead.md'), '# trust-lead');
      assert.equal(resolveContentDir(tmp, 'agents'), join(tmp, 'global', 'agents'));
    } finally {
      rmSync(tmp, { recursive: true, force: true });
    }
  });
});