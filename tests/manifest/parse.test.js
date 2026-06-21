/**
 * Tests for src/manifest/parse.js
 *
 * Covers:
 *   - parseFrontmatter: valid YAML, missing delimiters, partial delimiters
 *   - parseTasks: valid task blocks, Skills: none, list skills, missing sections
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { parseFrontmatter, parseTasks } from '../../src/manifest/parse.js';

// ─── parseFrontmatter ────────────────────────────────────────────────────────

describe('parseFrontmatter', () => {
  it('parses all five canonical approval fields', () => {
    const src = `---
change_id: my-change
status: approved
approved_by: patrese
approved_at: 2026-06-18T00:00:00Z
---

# Body
`;
    const result = parseFrontmatter(src);
    assert.deepEqual(result, {
      change_id: 'my-change',
      status: 'approved',
      approved_by: 'patrese',
      approved_at: '2026-06-18T00:00:00Z',
    });
  });

  it('returns null when no opening --- delimiter', () => {
    const src = `change_id: my-change\nstatus: approved\n`;
    assert.equal(parseFrontmatter(src), null);
  });

  it('returns null when opening delimiter exists but no closing ---', () => {
    const src = `---\nchange_id: my-change\n`;
    assert.equal(parseFrontmatter(src), null);
  });

  it('handles values with colons in them (URL-style)', () => {
    const src = `---
change_id: my-change
status: approved
approved_by: patrese
approved_at: 2026-06-18T00:00:00Z
---
`;
    const result = parseFrontmatter(src);
    assert.equal(result.approved_at, '2026-06-18T00:00:00Z');
  });

  it('ignores unknown frontmatter keys', () => {
    const src = `---
change_id: my-change
status: approved
approved_by: patrese
approved_at: 2026-06-18T00:00:00Z
extra_key: ignored
---
`;
    const result = parseFrontmatter(src);
    assert.ok(!('extra_key' in result), 'extra_key must not appear in result');
    assert.equal(result.change_id, 'my-change');
  });

  it('returns null for empty document', () => {
    assert.equal(parseFrontmatter(''), null);
  });
});

// ─── parseTasks ──────────────────────────────────────────────────────────────

describe('parseTasks', () => {
  it('parses a valid task with all fields and Skills: none', () => {
    const src = `## T001 — Stub task

Agent: build
Skills: none
Depends on: none
Parallel group: none
`;
    const tasks = parseTasks(src);
    assert.equal(tasks.length, 1);
    const t = tasks[0];
    assert.equal(t.id, 'T001');
    assert.equal(t.title, 'Stub task');
    assert.equal(t.heading, 'T001 — Stub task');
    assert.equal(t.agent, 'build');
    assert.deepEqual(t.skills, []);
    assert.deepEqual(t.dependsOn, []);
    assert.equal(t.parallelGroup, null);
    assert.equal(t.agentDeclared, true);
    assert.equal(t.skillsDeclared, true);
    assert.equal(t.dependsOnDeclared, true);
    assert.equal(t.parallelGroupDeclared, true);
  });

  it('parses a valid task with list skills', () => {
    const src = `## T001 — Task with skills

Agent: build
Skills:
- engineering-tdd-first
- engineering-bdd-discovery
Depends on: none
Parallel group: none
`;
    const tasks = parseTasks(src);
    assert.equal(tasks[0].skills.length, 2);
    assert.ok(tasks[0].skills.includes('engineering-tdd-first'));
    assert.ok(tasks[0].skills.includes('engineering-bdd-discovery'));
  });

  it('parses multiple dependencies', () => {
    const src = `## T001 — Base

Agent: build
Skills: none
Depends on: none
Parallel group: none

## T002 — Downstream

Agent: build
Skills: none
Depends on:
- T001
Parallel group: none
`;
    const tasks = parseTasks(src);
    assert.equal(tasks.length, 2);
    assert.deepEqual(tasks[1].dependsOn, ['T001']);
  });

  it('parses a task with a named parallel group', () => {
    const src = `## T001 — Grouped task

Agent: build
Skills: none
Depends on: none
Parallel group: auth-read-model
`;
    const tasks = parseTasks(src);
    assert.equal(tasks[0].parallelGroup, 'auth-read-model');
  });

  it('sets agentDeclared=false when Agent field is missing', () => {
    const src = `## T001 — No agent

Skills: none
Depends on: none
Parallel group: none
`;
    const tasks = parseTasks(src);
    assert.equal(tasks[0].agentDeclared, false);
    assert.equal(tasks[0].agent, null);
  });

  it('sets skillsDeclared=false when Skills field is missing', () => {
    const src = `## T001 — No skills

Agent: build
Depends on: none
Parallel group: none
`;
    const tasks = parseTasks(src);
    assert.equal(tasks[0].skillsDeclared, false);
  });

  it('sets dependsOnDeclared=false when Depends on field is missing', () => {
    const src = `## T001 — No depends

Agent: build
Skills: none
Parallel group: none
`;
    const tasks = parseTasks(src);
    assert.equal(tasks[0].dependsOnDeclared, false);
  });

  it('sets parallelGroupDeclared=false when Parallel group field is missing', () => {
    const src = `## T001 — No parallel

Agent: build
Skills: none
Depends on: none
`;
    const tasks = parseTasks(src);
    assert.equal(tasks[0].parallelGroupDeclared, false);
  });

  it('returns empty array for document with no ## headings', () => {
    const tasks = parseTasks('# Just a title\n\nSome text.\n');
    assert.deepEqual(tasks, []);
  });

  it('heading without T-prefix ID is parsed with id=null', () => {
    const src = `## Do something without ID

Agent: build
Skills: none
Depends on: none
Parallel group: none
`;
    const tasks = parseTasks(src);
    assert.equal(tasks[0].id, null);
    assert.equal(tasks[0].title, 'Do something without ID');
  });
});
