/**
 * Tests for src/manifest/order.js
 *
 * Covers topological sort correctness and error conditions.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { topoSort } from '../../src/manifest/order.js';

function task(id, dependsOn = []) {
  return { id, dependsOn };
}

describe('topoSort', () => {
  it('returns single task unchanged', () => {
    const result = topoSort([task('T001')]);
    assert.deepEqual(result.map(t => t.id), ['T001']);
  });

  it('sorts two independent tasks by ID', () => {
    const result = topoSort([task('T002'), task('T001')]);
    assert.deepEqual(result.map(t => t.id), ['T001', 'T002']);
  });

  it('places dependency before dependent (T001 before T002)', () => {
    const tasks = [task('T002', ['T001']), task('T001')];
    const result = topoSort(tasks);
    const ids = result.map(t => t.id);
    assert.ok(ids.indexOf('T001') < ids.indexOf('T002'),
      `T001 must come before T002, got: ${ids}`);
  });

  it('sorts three tasks in linear chain correctly', () => {
    const tasks = [task('T003', ['T002']), task('T001'), task('T002', ['T001'])];
    const result = topoSort(tasks);
    const ids = result.map(t => t.id);
    assert.ok(ids.indexOf('T001') < ids.indexOf('T002'));
    assert.ok(ids.indexOf('T002') < ids.indexOf('T003'));
  });

  it('tasks at the same level are sorted alphabetically by ID', () => {
    const tasks = [task('T003'), task('T001'), task('T002')];
    const result = topoSort(tasks);
    assert.deepEqual(result.map(t => t.id), ['T001', 'T002', 'T003']);
  });

  it('tasks with same level and mixed IDs sorted by natural string order', () => {
    const tasks = [task('T010'), task('T002'), task('T001')];
    const result = topoSort(tasks);
    const ids = result.map(t => t.id);
    // T001 < T002 < T010 lexicographically
    assert.equal(ids[0], 'T001');
    assert.equal(ids[1], 'T002');
    assert.equal(ids[2], 'T010');
  });

  it('throws CYCLIC DEPENDENCY on T001→T002→T001', () => {
    const tasks = [task('T001', ['T002']), task('T002', ['T001'])];
    assert.throws(() => topoSort(tasks), /CYCLIC DEPENDENCY/);
  });

  it('throws SELF DEPENDENCY when task depends on itself', () => {
    const tasks = [task('T001', ['T001'])];
    assert.throws(() => topoSort(tasks), /SELF DEPENDENCY|CYCLIC DEPENDENCY/);
  });
});
