/**
 * Tests for src/workflows/parse.js
 *
 * Covers:
 *   - parseWorkflow: valid YAML workflow, missing fields, invalid syntax
 *   - parseWorkflowSteps: extracting and validating step blocks
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { parseWorkflow, parseWorkflowSteps } from '../../src/workflows/parse.js';

// ─── parseWorkflow ───────────────────────────────────────────────────────────

describe('parseWorkflow', () => {
  it('parses a minimal valid workflow YAML', () => {
    const src = `name: test-workflow
description: A test workflow
steps:
  - name: step-one
    command: echo hello
`;
    const result = parseWorkflow(src);
    assert.ok(result, 'Expected a workflow object');
    assert.equal(result.name, 'test-workflow');
    assert.equal(result.description, 'A test workflow');
    assert.ok(Array.isArray(result.steps), 'steps must be an array');
    assert.equal(result.steps.length, 1);
    assert.equal(result.steps[0].name, 'step-one');
    assert.equal(result.steps[0].command, 'echo hello');
  });

  it('returns null for empty input', () => {
    const result = parseWorkflow('');
    assert.equal(result, null);
  });

  it('extracts name and description fields', () => {
    const src = `name: my-workflow
description: My workflow description
steps: []`;
    const result = parseWorkflow(src);
    assert.equal(result.name, 'my-workflow');
    assert.equal(result.description, 'My workflow description');
  });

  it('returns null when name is missing', () => {
    const src = `description: No name
steps: []`;
    const result = parseWorkflow(src);
    assert.equal(result, null);
  });
});

// ─── parseWorkflowSteps ──────────────────────────────────────────────────────

describe('parseWorkflowSteps', () => {
  it('parses a single step with name and command', () => {
    const workflow = {
      name: 'test',
      description: 'test',
      steps: [
        {
          name: 'step-one',
          command: 'echo hello',
        },
      ],
    };
    const steps = parseWorkflowSteps(workflow.steps);
    assert.ok(Array.isArray(steps), 'steps must be an array');
    assert.equal(steps.length, 1);
    assert.equal(steps[0].name, 'step-one');
    assert.equal(steps[0].command, 'echo hello');
  });

  it('parses multiple steps', () => {
    const stepList = [
      { name: 'step-one', command: 'echo one' },
      { name: 'step-two', command: 'echo two' },
    ];
    const steps = parseWorkflowSteps(stepList);
    assert.equal(steps.length, 2);
    assert.equal(steps[0].name, 'step-one');
    assert.equal(steps[1].name, 'step-two');
  });

  it('returns empty array for null or undefined steps', () => {
    assert.deepEqual(parseWorkflowSteps(null), []);
    assert.deepEqual(parseWorkflowSteps(undefined), []);
  });

  it('preserves optional fields like description and condition', () => {
    const stepList = [
      {
        name: 'conditional-step',
        command: 'npm test',
        description: 'Run tests',
        condition: 'success',
      },
    ];
    const steps = parseWorkflowSteps(stepList);
    assert.equal(steps[0].description, 'Run tests');
    assert.equal(steps[0].condition, 'success');
  });
});
