/**
 * Tests for src/workflows/validate.js
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  validateWorkflowShape,
  validateWorkflowAgents,
  validateWorkflowSkills,
  collectWorkflowErrors,
} from '../../src/workflows/validate.js';

function baseWorkflow(overrides = {}) {
  return {
    name: 'test-workflow',
    description: 'test',
    steps: [
      {
        name: 'step-one',
        agent: 'sdd',
        skills: ['engineering-sdd-change'],
        command: 'echo hello',
      },
    ],
    ...overrides,
  };
}

describe('validateWorkflowShape', () => {
  it('returns no errors for valid workflow', () => {
    assert.deepEqual(validateWorkflowShape(baseWorkflow()), []);
  });

  it('requires workflow name', () => {
    const errors = validateWorkflowShape(baseWorkflow({ name: '' }));
    assert.ok(errors.some(e => e.includes('WORKFLOW NAME REQUIRED')));
  });

  it('requires at least one step', () => {
    const errors = validateWorkflowShape(baseWorkflow({ steps: [] }));
    assert.ok(errors.some(e => e.includes('WORKFLOW STEPS REQUIRED')));
  });

  it('requires unique step names', () => {
    const errors = validateWorkflowShape(baseWorkflow({
      steps: [
        { name: 'dup', command: 'echo 1' },
        { name: 'dup', command: 'echo 2' },
      ],
    }));
    assert.ok(errors.some(e => e.includes('DUPLICATE WORKFLOW STEP NAME')));
  });

  it('requires step command', () => {
    const errors = validateWorkflowShape(baseWorkflow({
      steps: [{ name: 'step-one', command: '' }],
    }));
    assert.ok(errors.some(e => e.includes('WORKFLOW STEP COMMAND OR AGENT REQUIRED')));
  });
});

describe('validateWorkflowAgents', () => {
  const AGENTS = ['sdd', 'code-reviewer', 'project-rules-auditor'];

  it('returns no errors for known agents', () => {
    assert.deepEqual(validateWorkflowAgents(baseWorkflow(), AGENTS), []);
  });

  it('requires agent declaration when present in workflow model', () => {
    const errors = validateWorkflowAgents(baseWorkflow({
      steps: [{ name: 'step-one', command: 'echo hi' }],
    }), AGENTS);
    assert.ok(errors.some(e => e.includes('WORKFLOW STEP AGENT REQUIRED')));
  });

  it('rejects unknown agent', () => {
    const errors = validateWorkflowAgents(baseWorkflow({
      steps: [{ name: 'step-one', command: 'echo hi', agent: 'ghost' }],
    }), AGENTS);
    assert.ok(errors.some(e => e.includes('UNKNOWN WORKFLOW AGENT')));
  });
});

describe('validateWorkflowSkills', () => {
  const SKILLS = ['engineering-sdd-change', 'engineering-task-plan'];

  it('returns no errors for known skills', () => {
    assert.deepEqual(validateWorkflowSkills(baseWorkflow(), SKILLS), []);
  });

  it('requires skills declaration', () => {
    const errors = validateWorkflowSkills(baseWorkflow({
      steps: [{ name: 'step-one', command: 'echo hi', agent: 'sdd' }],
    }), SKILLS);
    assert.ok(errors.some(e => e.includes('WORKFLOW STEP SKILLS DECLARATION REQUIRED')));
  });

  it('rejects unknown skill', () => {
    const errors = validateWorkflowSkills(baseWorkflow({
      steps: [{ name: 'step-one', command: 'echo hi', agent: 'sdd', skills: ['ghost-skill'] }],
    }), SKILLS);
    assert.ok(errors.some(e => e.includes('UNKNOWN WORKFLOW SKILL')));
  });
});

describe('collectWorkflowErrors', () => {
  const AGENTS = ['sdd'];
  const SKILLS = ['engineering-sdd-change'];

  it('collects all validation layers', () => {
    const errors = collectWorkflowErrors(
      {
        name: '',
        steps: [
          { name: 'step-one', command: '', agent: 'ghost', skills: ['ghost-skill'] },
          { name: 'step-two', command: '', skills: [] },
        ],
      },
      { agents: AGENTS, skills: SKILLS },
    );

    assert.ok(errors.some(e => e.includes('WORKFLOW NAME REQUIRED')));
    assert.ok(errors.some(e => e.includes('WORKFLOW STEP COMMAND OR AGENT REQUIRED')));
    assert.ok(errors.some(e => e.includes('UNKNOWN WORKFLOW AGENT')));
    assert.ok(errors.some(e => e.includes('UNKNOWN WORKFLOW SKILL')));
  });
});
