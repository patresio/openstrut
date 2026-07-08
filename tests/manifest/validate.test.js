/**
 * Tests for src/manifest/validate.js
 *
 * One test per blocking error code (16 total), plus a passing case.
 * All tests operate on plain JS objects — no file I/O.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  validateApprovalFrontmatter,
  validateTaskIds,
  validateTaskAgents,
  validateTaskSkills,
  validateDependencies,
  validateParallelGroups,
  collectErrors,
} from '../../src/manifest/validate.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(__dirname, '../..');

// ─── Helpers ─────────────────────────────────────────────────────────────────

function baseTask(overrides = {}) {
  return {
    id: 'T001',
    title: 'Stub task',
    heading: 'T001 — Stub task',
    agent: 'build',
    agentDeclared: true,
    skills: [],
    skillsDeclared: true,
    dependsOn: [],
    dependsOnDeclared: true,
    parallelGroup: null,
    parallelGroupDeclared: true,
    ...overrides,
  };
}

function validFrontmatter(overrides = {}) {
  return {
    change_id: 'my-change',
    status: 'approved',
    approved_by: 'patrese',
    approved_at: '2026-06-18T00:00:00Z',
    ...overrides,
  };
}

// ─── validateApprovalFrontmatter ─────────────────────────────────────────────

describe('validateApprovalFrontmatter', () => {
  it('returns no error for valid frontmatter', () => {
    const err = validateApprovalFrontmatter(validFrontmatter());
    assert.equal(err, null);
  });

  it('BLOCKED — CHANGE APPROVAL METADATA REQUIRED when frontmatter is null', () => {
    const err = validateApprovalFrontmatter(null);
    assert.ok(err, 'Expected a blocking error');
    assert.ok(err.includes('CHANGE APPROVAL METADATA REQUIRED'), `Got: ${err}`);
  });

  it('BLOCKED — CHANGE APPROVAL METADATA REQUIRED when change_id is missing', () => {
    const err = validateApprovalFrontmatter(validFrontmatter({ change_id: null }));
    assert.ok(err?.includes('CHANGE APPROVAL METADATA REQUIRED') || err?.includes('INVALID APPROVAL METADATA'), `Got: ${err}`);
  });

  it('BLOCKED — CHANGE APPROVAL METADATA REQUIRED when approved_by is empty', () => {
    const err = validateApprovalFrontmatter(validFrontmatter({ approved_by: '' }));
    assert.ok(err, 'Expected a blocking error');
    assert.ok(err.includes('CHANGE APPROVAL METADATA REQUIRED') || err.includes('INVALID APPROVAL METADATA'), `Got: ${err}`);
  });

  it('BLOCKED — CHANGE NOT APPROVED when status is not "approved"', () => {
    const err = validateApprovalFrontmatter(validFrontmatter({ status: 'draft' }));
    assert.ok(err?.includes('CHANGE NOT APPROVED'), `Got: ${err}`);
  });

  it('BLOCKED — INVALID APPROVAL METADATA when approved_at is not ISO 8601', () => {
    const err = validateApprovalFrontmatter(validFrontmatter({ approved_at: 'not-a-date' }));
    assert.ok(err?.includes('INVALID APPROVAL METADATA'), `Got: ${err}`);
  });
});

// ─── validateTaskIds ──────────────────────────────────────────────────────────

describe('validateTaskIds', () => {
  it('returns no errors for valid IDs', () => {
    const errors = validateTaskIds([baseTask({ id: 'T001' }), baseTask({ id: 'T002' })]);
    assert.deepEqual(errors, []);
  });

  it('BLOCKED — TASK ID REQUIRED when id is null', () => {
    const errors = validateTaskIds([baseTask({ id: null })]);
    assert.ok(errors.some(e => e.includes('TASK ID REQUIRED')), `Got: ${errors}`);
  });

  it('BLOCKED — INVALID TASK ID when id does not match ^T[0-9]{3,}$', () => {
    const errors = validateTaskIds([baseTask({ id: 'T1' })]);
    assert.ok(errors.some(e => e.includes('INVALID TASK ID')), `Got: ${errors}`);
  });

  it('BLOCKED — DUPLICATE TASK ID for repeated IDs', () => {
    const errors = validateTaskIds([baseTask({ id: 'T001' }), baseTask({ id: 'T001' })]);
    assert.ok(errors.some(e => e.includes('DUPLICATE TASK ID')), `Got: ${errors}`);
  });
});

// ─── validateTaskAgents ───────────────────────────────────────────────────────

describe('validateTaskAgents', () => {
  const AGENTS = ['build', 'code-reviewer', 'project-rules-auditor'];

  it('returns no errors for known agents', () => {
    const errors = validateTaskAgents([baseTask({ agent: 'build' })], AGENTS);
    assert.deepEqual(errors, []);
  });

  it('BLOCKED — TASK AGENT REQUIRED when agentDeclared=false', () => {
    const errors = validateTaskAgents([baseTask({ agent: null, agentDeclared: false })], AGENTS);
    assert.ok(errors.some(e => e.includes('TASK AGENT REQUIRED')), `Got: ${errors}`);
  });

  it('BLOCKED — UNKNOWN AGENT for agent not in inventory', () => {
    const errors = validateTaskAgents([baseTask({ agent: 'phantom-agent' })], AGENTS);
    assert.ok(errors.some(e => e.includes('UNKNOWN AGENT')), `Got: ${errors}`);
  });
});

// ─── validateTaskSkills ───────────────────────────────────────────────────────

describe('validateTaskSkills', () => {
  const SKILLS = ['opentrust-tdd', 'opentrust-spec-change'];

  it('returns no errors for known skills', () => {
    const errors = validateTaskSkills([baseTask({ skills: ['opentrust-tdd'], skillsDeclared: true })], SKILLS);
    assert.deepEqual(errors, []);
  });

  it('returns no errors when skills is empty (Skills: none)', () => {
    const errors = validateTaskSkills([baseTask({ skills: [], skillsDeclared: true })], SKILLS);
    assert.deepEqual(errors, []);
  });

  it('BLOCKED — TASK SKILLS DECLARATION REQUIRED when skillsDeclared=false', () => {
    const errors = validateTaskSkills([baseTask({ skillsDeclared: false })], SKILLS);
    assert.ok(errors.some(e => e.includes('TASK SKILLS DECLARATION REQUIRED')), `Got: ${errors}`);
  });

  it('BLOCKED — UNKNOWN SKILL for skill not in inventory', () => {
    const errors = validateTaskSkills([baseTask({ skills: ['phantom-skill'], skillsDeclared: true })], SKILLS);
    assert.ok(errors.some(e => e.includes('UNKNOWN SKILL')), `Got: ${errors}`);
  });
});

// ─── validateDependencies ─────────────────────────────────────────────────────

describe('validateDependencies', () => {
  it('returns no errors for explicit none (empty dependsOn)', () => {
    const errors = validateDependencies([baseTask()]);
    assert.deepEqual(errors, []);
  });

  it('returns no errors for valid dependency reference', () => {
    const tasks = [
      baseTask({ id: 'T001' }),
      baseTask({ id: 'T002', dependsOn: ['T001'], dependsOnDeclared: true }),
    ];
    const errors = validateDependencies(tasks);
    assert.deepEqual(errors, []);
  });

  it('BLOCKED — DEPENDENCY DECLARATION REQUIRED when dependsOnDeclared=false', () => {
    const errors = validateDependencies([baseTask({ dependsOnDeclared: false })]);
    assert.ok(errors.some(e => e.includes('DEPENDENCY DECLARATION REQUIRED')), `Got: ${errors}`);
  });

  it('BLOCKED — UNKNOWN TASK DEPENDENCY when referenced ID does not exist', () => {
    const errors = validateDependencies([baseTask({ id: 'T001', dependsOn: ['T999'], dependsOnDeclared: true })]);
    assert.ok(errors.some(e => e.includes('UNKNOWN TASK DEPENDENCY')), `Got: ${errors}`);
  });

  it('BLOCKED — CYCLIC DEPENDENCY for T001→T002→T001', () => {
    const tasks = [
      baseTask({ id: 'T001', dependsOn: ['T002'], dependsOnDeclared: true }),
      baseTask({ id: 'T002', dependsOn: ['T001'], dependsOnDeclared: true }),
    ];
    const errors = validateDependencies(tasks);
    assert.ok(errors.some(e => e.includes('CYCLIC DEPENDENCY')), `Got: ${errors}`);
  });

  it('BLOCKED — SELF DEPENDENCY when task depends on itself', () => {
    const errors = validateDependencies([baseTask({ id: 'T001', dependsOn: ['T001'], dependsOnDeclared: true })]);
    assert.ok(errors.some(e => e.includes('SELF DEPENDENCY')), `Got: ${errors}`);
  });
});

// ─── validateParallelGroups ───────────────────────────────────────────────────

describe('validateParallelGroups', () => {
  it('returns no errors when parallel group is null (none)', () => {
    const errors = validateParallelGroups([baseTask()]);
    assert.deepEqual(errors, []);
  });

  it('returns no errors for non-conflicting group members', () => {
    const tasks = [
      baseTask({ id: 'T001', parallelGroup: 'alpha', parallelGroupDeclared: true }),
      baseTask({ id: 'T002', parallelGroup: 'alpha', parallelGroupDeclared: true }),
    ];
    const errors = validateParallelGroups(tasks);
    assert.deepEqual(errors, []);
  });

  it('BLOCKED — PARALLEL GROUP DECLARATION REQUIRED when parallelGroupDeclared=false', () => {
    const errors = validateParallelGroups([baseTask({ parallelGroupDeclared: false })]);
    assert.ok(errors.some(e => e.includes('PARALLEL GROUP DECLARATION REQUIRED')), `Got: ${errors}`);
  });

  it('BLOCKED — INVALID PARALLEL GROUP when dependent tasks share a group', () => {
    const tasks = [
      baseTask({ id: 'T001', parallelGroup: 'alpha', parallelGroupDeclared: true, dependsOn: [], dependsOnDeclared: true }),
      baseTask({ id: 'T002', parallelGroup: 'alpha', parallelGroupDeclared: true, dependsOn: ['T001'], dependsOnDeclared: true }),
    ];
    const errors = validateParallelGroups(tasks);
    assert.ok(errors.some(e => e.includes('INVALID PARALLEL GROUP')), `Got: ${errors}`);
  });
});

// ─── collectErrors (integration of all validators) ───────────────────────────

describe('collectErrors', () => {
  it('returns empty array for a fully valid input', () => {
    const frontmatter = validFrontmatter();
    const tasks = [baseTask({ id: 'T001' })];
    const agentList = ['build', 'code-reviewer', 'project-rules-auditor'];
    const skillInventory = ['opentrust-tdd'];
    const errors = collectErrors({ frontmatter, tasks, agentList, skillInventory });
    assert.deepEqual(errors, []);
  });

  it('accumulates multiple errors', () => {
    const frontmatter = null;
    const tasks = [baseTask({ id: null, agentDeclared: false })];
    const agentList = ['build'];
    const skillInventory = [];
    const errors = collectErrors({ frontmatter, tasks, agentList, skillInventory });
    assert.ok(errors.length >= 2, `Expected at least 2 errors, got: ${errors.length}`);
  });
});
