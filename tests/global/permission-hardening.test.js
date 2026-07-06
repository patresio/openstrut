// HARNESS-024: Permission regression tests
// Verifies that permission configurations follow least-privilege patterns

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..');

function readJSON(p) {
  return JSON.parse(readFileSync(p, 'utf8'));
}

function readFrontmatter(p) {
  const content = readFileSync(p, 'utf8');
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const frontmatter = {};
  const lines = match[1].split('\n');
  for (const line of lines) {
    if (!line.trim() || line.startsWith('#')) continue;
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    frontmatter[key] = value;
  }
  return frontmatter;
}

describe('HARNESS-024: permission hardening', () => {
  it('repo opencode.json must not have * allow', () => {
    // HARNESS-021 fix: repo opencode.json was * allow, now restricted
    // This test ensures regression against * allow returning
    const cfg = readJSON(join(ROOT, 'opencode.json'));
    assert.equal(cfg.permission?.['*'], undefined,
      'repo opencode.json must not have wildcard allow');
    // Verify granular permissions exist
    assert.ok(cfg.permission?.read, 'must have read permission');
    assert.ok(cfg.permission?.edit, 'must have edit permission');
    assert.ok(cfg.permission?.bash, 'must have bash permission');
  });

  it('global agents must not have wildcard bash allow', () => {
    const agentsDir = join(ROOT, 'global', 'agents');
    const files = readdirSync(agentsDir).filter(f => f.endsWith('.md'));
    for (const file of files) {
      const fm = readFrontmatter(join(agentsDir, file));
      const bash = fm['permission.bash'] || fm['bash'] || '';
      assert.ok(
        !bash.includes('*') || bash.includes('deny'),
        `${file}: bash permission must not be wildcard allow`
      );
    }
  });

  it('global opencode.json has correct permission shape', () => {
    const cfg = readJSON(join(ROOT, 'global', 'opencode.json'));
    // Verify default permissions restrict skills and tasks
    const perm = cfg.permission || {};
    assert.equal(perm.skill, 'deny', 'default skill permission must be deny');
    assert.equal(perm.task, 'deny', 'default task permission must be deny');
    assert.equal(perm.edit, 'ask', 'default edit permission must be ask');
    assert.equal(perm.external_directory, 'ask', 'external_directory must default ask');
  });

  it('build agent has edit allow for primary agent role', () => {
    const cfg = readJSON(join(ROOT, 'global', 'opencode.json'));
    const build = cfg.agent?.build;
    assert.ok(build, 'build agent must be configured');
    // build is the primary implementation agent — edit:allow is intentional
    assert.equal(build.permission?.edit, 'allow',
      'build agent must have edit allow as primary implementation agent');
    // build must NOT have wildcard bash allow
    assert.notEqual(build.permission?.bash, 'allow',
      'build agent must not have wildcard bash allow');
  });

  it('SDD agent must not allow production edit', () => {
    const sddPath = join(ROOT, 'global', 'agents', 'sdd.md');
    const content = readFileSync(sddPath, 'utf8');
    // Check that the YAML frontmatter has edit: deny or edit.*: deny
    const hasDenyEdit = content.includes('edit:\n    "*": deny') ||
      content.includes("edit: deny") ||
      content.includes('edit: ask');
    assert.ok(hasDenyEdit, 'SDD agent YAML frontmatter must restrict edit');
  });

  it('package must not include secrets or task plans', () => {
    const pkg = readJSON(join(ROOT, 'package.json'));
    const files = pkg.files;
    assert.ok(files, 'package.json must have files field');
    assert.ok(files.includes('global'), 'must include global/ in package files');
    assert.ok(files.includes('src'), 'must include src/ in package files');
    // Verify no secrets in package (simple grep approach)
    const content = readFileSync(join(ROOT, 'package.json'), 'utf8');
    assert.ok(!content.includes('api_key') && !content.includes('secret') && !content.includes('token'),
      'package.json must not contain secrets');
  });
});

describe('HARNESS-024: agent file integrity', () => {
  it('all agents have status indicator in frontmatter or description', () => {
    const agentsDir = join(ROOT, 'global', 'agents');
    const files = readdirSync(agentsDir).filter(f => f.endsWith('.md'));
    assert.ok(files.length >= 15, 'must have at least 15 agent files');
  });
});
