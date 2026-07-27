import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mergeJson, findMissingKeys } from '../../src/installer/merge.js';

describe('Installer Merge Utilities', () => {
  describe('mergeJson', () => {
    it('flat merge: source keys added, target keys preserved', () => {
      const source = { a: 1, b: 2 };
      const target = { b: 3, c: 4 };
      const result = mergeJson(source, target);
      assert.deepEqual(result, { a: 1, b: 3, c: 4 });
    });

    it('deep nested merge: nested objects merged recursively', () => {
      const source = { nested: { a: 1, b: 2 } };
      const target = { nested: { b: 3, c: 4 } };
      const result = mergeJson(source, target);
      assert.deepEqual(result, { nested: { a: 1, b: 3, c: 4 } });
    });

    it('arrays in source replace arrays in target (not merged)', () => {
      const source = { list: [1, 2] };
      const target = { list: [3, 4] };
      const result = mergeJson(source, target);
      assert.deepEqual(result, { list: [1, 2] });
    });

    it('preserves user custom keys not in source', () => {
      const source = { model: 'gpt-4' };
      const target = { model: 'custom', mySecret: '123' };
      const result = mergeJson(source, target);
      assert.deepEqual(result, { model: 'custom', mySecret: '123' });
    });

    it('adds missing source keys to target', () => {
      const source = { model: 'gpt-4', newKey: 'val' };
      const target = { model: 'custom' };
      const result = mergeJson(source, target);
      assert.deepEqual(result, { model: 'custom', newKey: 'val' });
    });
  });

  describe('findMissingKeys', () => {
    it('returns keys present in source but missing in target', () => {
      const source = { a: 1, b: 2, c: { d: 3 } };
      const target = { a: 1 };
      const missing = findMissingKeys(source, target);
      assert.deepEqual(missing, ['b', 'c']);
    });

    it('returns empty array when no keys missing', () => {
      const source = { a: 1 };
      const target = { a: 1, b: 2 };
      const missing = findMissingKeys(source, target);
      assert.deepEqual(missing, []);
    });

    it('does not recurse for missing keys (reports top-level missing keys)', () => {
      const source = { nested: { a: 1 } };
      const target = {};
      const missing = findMissingKeys(source, target);
      assert.deepEqual(missing, ['nested']);
    });
  });
});
