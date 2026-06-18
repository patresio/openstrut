import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sddPath = path.resolve(__dirname, '../../global/agents/sdd.md');
const skillPath = path.resolve(__dirname, '../../global/skills/engineering-sdd-change/SKILL.md');

// Helper to extract the YAML frontmatter and parse the keys in order
function parseOrderedPermissions(content, section) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return [];
  const yaml = match[1];
  const lines = yaml.split('\n');
  const rules = [];
  let inSection = false;
  
  for (const line of lines) {
    if (line.startsWith(`  ${section}:`)) {
      inSection = true;
      continue;
    }
    if (inSection) {
      if (line.match(/^  [a-z_]+:/)) break; // reached next top-level block
      const ruleMatch = line.match(/^    "([^"]+)": (allow|deny|ask)/);
      if (ruleMatch) {
        rules.push({ pattern: ruleMatch[1], action: ruleMatch[2] });
      }
    }
  }
  return rules;
}

describe('SDD Agent Permissions', () => {
  const content = fs.readFileSync(sddPath, 'utf8');

  it('catch-all deny precedes edit allows', () => {
    const editRules = parseOrderedPermissions(content, 'edit');
    assert.ok(editRules.length > 0, 'Should have edit rules');
    assert.equal(editRules[0].pattern, '*', 'First rule must be catch-all');
    assert.equal(editRules[0].action, 'deny', 'Catch-all must be deny');
  });

  it('catch-all deny precedes Bash allows', () => {
    const bashRules = parseOrderedPermissions(content, 'bash');
    assert.ok(bashRules.length > 0, 'Should have bash rules');
    assert.equal(bashRules[0].pattern, '*', 'First rule must be catch-all');
    assert.equal(bashRules[0].action, 'deny', 'Catch-all must be deny');
  });

  it('mutating Git commands are not allowed', () => {
    const bashRules = parseOrderedPermissions(content, 'bash');
    const mutating = ['git add', 'git commit', 'git push'];
    for (const cmd of mutating) {
      const allowed = bashRules.find(r => r.action === 'allow' && (r.pattern === cmd || r.pattern.startsWith(cmd)));
      assert.ok(!allowed, `Command ${cmd} must not be explicitly allowed`);
    }
  });

  it('allowed documentation paths remain writable', () => {
    const editRules = parseOrderedPermissions(content, 'edit');
    const allowed = editRules.filter(r => r.action === 'allow').map(r => r.pattern);
    assert.ok(allowed.includes('openspec/changes/**'), 'openspec/changes/** must be writable');
    assert.ok(allowed.includes('specs/**'), 'specs/** must be writable');
    assert.ok(allowed.includes('docs/**'), 'docs/** must be writable');
  });

  it('source-code paths remain denied (implicitly via catch-all)', () => {
    const editRules = parseOrderedPermissions(content, 'edit');
    // Because the catch-all `*`: deny is first, and no `src/**` is explicitly allowed later,
    // it remains denied. We assert no source directories are explicitly allowed.
    const allowed = editRules.filter(r => r.action === 'allow').map(r => r.pattern);
    assert.ok(!allowed.includes('src/**'), 'src/** must not be allowed');
    assert.ok(!allowed.includes('app/**'), 'app/** must not be allowed');
  });
});

describe('SDD Reference Discovery Policy', () => {
  const content = fs.readFileSync(skillPath, 'utf8');

  it('the skill searches project-local reference/', () => {
    assert.ok(content.includes('<project-root>/reference/'), 'Must search reference/');
  });

  it('the skill searches project-local references/', () => {
    assert.ok(content.includes('<project-root>/references/'), 'Must search references/');
  });

  it('the skill knows the canonical shared-library location', () => {
    assert.ok(content.includes('$HOME/.local/share/opencode-engineering-harness/references/'), 'Must know canonical shared location');
  });

  it('no /srv/... absolute path is packaged', () => {
    assert.ok(!content.includes('/srv/projects/opencode-engineering-harness/'), 'Must not package server-specific absolute paths');
  });

  it('missing references must be disclosed', () => {
    assert.ok(content.toLowerCase().includes('report its absence') || content.toLowerCase().includes('disclosed'), 'Must disclose missing references');
  });

  it('only genuinely consulted references may be listed in a change', () => {
    assert.ok(content.includes('truly influenced') || content.includes('genuinely'), 'Must only list truly consulted references');
    assert.ok(content.includes('NEVER claim a reference was consulted when it was unavailable'), 'Must not hallucinate references');
  });
});
