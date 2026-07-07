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

describe('SDD Barsa Retrieval Policy', () => {
  const content = fs.readFileSync(skillPath, 'utf8');

  it('the skill uses Barsa MCP as retrieval boundary', () => {
    assert.ok(content.includes('Barsa MCP'), 'Must use Barsa MCP');
  });

  it('the skill references logical routing keys', () => {
    assert.ok(content.includes('collection'), 'Must mention collection routing');
    assert.ok(content.includes('context'), 'Must mention context routing');
    assert.ok(content.includes('bundle'), 'Must mention bundle routing');
  });

  it('the skill does not depend on shared filesystem library paths', () => {
    assert.ok(!content.includes('$HOME/.local/share/openstrut/references/'), 'Must not depend on shared reference path');
    assert.ok(!content.includes('/srv/docs/biblioteca'), 'Must not reference local biblioteca path');
  });

  it('no /srv/... absolute project path is packaged', () => {
    assert.ok(!content.includes('/srv/projects/openstrut/'), 'Must not package server-specific absolute paths');
  });

  it('missing retrieval evidence must be disclosed', () => {
    assert.ok(content.toLowerCase().includes('report the gap') || content.toLowerCase().includes('unavailable'), 'Must disclose missing retrieval evidence');
  });

  it('only materially influential Barsa sources may be listed in a change', () => {
    assert.ok(content.includes('materially influenced'), 'Must only list materially influential sources');
    assert.ok(content.includes('Do not reference local filesystem library paths'), 'Must not use local filesystem paths');
  });
});

describe('SDD Agent and Skill Regression Verification', () => {
  const contentSkill = fs.readFileSync(skillPath, 'utf8');
  const contentAgent = fs.readFileSync(sddPath, 'utf8');
  const cmdPath = path.resolve(__dirname, '../../global/commands/eng-spec-change.md');
  const contentCmd = fs.readFileSync(cmdPath, 'utf8');

  describe('Skill Verification', () => {
    it('SKILL.md exists and frontmatter starts on first byte', () => {
      assert.ok(contentSkill.startsWith('---'), 'Frontmatter must start at the very first byte');
    });

    it('has valid name and description in frontmatter', () => {
      const match = contentSkill.match(/^---\n([\s\S]*?)\n---/);
      assert.ok(match, 'Must have YAML frontmatter');
      const yaml = match[1];
      assert.match(yaml, /^name:\s*engineering-sdd-change/m, 'Must have correct name in frontmatter');
      assert.match(yaml, /^description:\s*.+/m, 'Must have non-empty description');
    });

    it('name matches directory and regex ^[a-z0-9]+(-[a-z0-9]+)*$', () => {
      const dirName = path.basename(path.dirname(skillPath));
      assert.equal(dirName, 'engineering-sdd-change', 'Directory name must be correct');
      assert.match(dirName, /^[a-z0-9]+(-[a-z0-9]+)*$/, 'Must match regex pattern');
    });
  });

  describe('Agent Permissions Verification', () => {
    it('tool skill is available and specific allow beats catch-all deny', () => {
      const skillRules = parseOrderedPermissions(contentAgent, 'skill');
      assert.ok(skillRules.length >= 2, 'Should have skill rules');
      assert.equal(skillRules[0].pattern, '*', 'First rule must be catch-all');
      assert.equal(skillRules[0].action, 'deny', 'Catch-all must be deny');
      
      const allowed = skillRules.find(r => r.action === 'allow' && r.pattern === 'engineering-sdd-change');
      assert.ok(allowed, 'engineering-sdd-change must be explicitly allowed after the deny');
    });

    it('no unnecessary skills are allowed', () => {
      const skillRules = parseOrderedPermissions(contentAgent, 'skill');
      const allowedSkills = skillRules.filter(r => r.action === 'allow');
      assert.equal(allowedSkills.length, 1, 'Only one skill must be allowed for SDD');
    });
  });

  describe('Command Verification', () => {
    it('has agent: sdd in frontmatter', () => {
      assert.match(contentCmd, /^agent:\s*sdd/m, 'Command must target sdd agent');
    });

    it('has explicit reference to engineering-sdd-change', () => {
      assert.ok(contentCmd.includes('engineering-sdd-change'), 'Must explicitly load the skill');
    });

    it('includes $ARGUMENTS', () => {
      assert.ok(contentCmd.includes('$ARGUMENTS'), 'Must pass user arguments');
    });

    it('stops at Approval Gate and does not handoff to build', () => {
      assert.ok(contentCmd.includes('Approval Gate'), 'Must mention Approval Gate');
      assert.ok(contentCmd.includes('Do NOT invoke the `build` agent') || contentCmd.includes('Do NOT call `build`'), 'Must forbid handoff to build');
    });
  });
});
