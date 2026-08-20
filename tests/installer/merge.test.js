import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mergeJson, findMissingKeys, reconcileManagedKeys, preserveUserKeys, MANAGED_KEYS, USER_KEYS } from '../../src/installer/merge.js';

describe('Installer Merge Utilities', () => {
  describe('mergeJson', () => {
    it('flat merge: source keys added, target keys preserved', () => {
      const source = { a: 1, b: 2 };
      const target = { b: 3, c: 4 };
      const result = mergeJson(source, target);
      assert.deepEqual(result, { a: 1, b: 2, c: 4 });
    });

    it('deep nested merge: nested objects merged recursively', () => {
      const source = { nested: { a: 1, b: 2 } };
      const target = { nested: { b: 3, c: 4 } };
      const result = mergeJson(source, target);
      assert.deepEqual(result, { nested: { a: 1, b: 2, c: 4 } });
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
      assert.deepEqual(result, { model: 'gpt-4', mySecret: '123' });
    });

    it('adds missing source keys to target', () => {
      const source = { model: 'gpt-4', newKey: 'val' };
      const target = { model: 'custom' };
      const result = mergeJson(source, target);
      assert.deepEqual(result, { model: 'gpt-4', newKey: 'val' });
    });

    it('Issue #17: source scalar fixes win over stale installed values', () => {
      const source = {
        model: '{env:MODEL_TECH}',
        mcp: { barsa: { url: '{env:BARSA_MCP_URL}' } },
      };
      const target = {
        model: 'opencode/deepseek-v4-flash-free',
        mcp: { barsa: { url: '{env:BARSA_MCP}' } },
      };
      const result = mergeJson(source, target);
      assert.equal(result.model, '{env:MODEL_TECH}');
      assert.equal(result.mcp.barsa.url, '{env:BARSA_MCP_URL}');
    });

    it('Issue #17: nested target-only keys preserved, source scalars win', () => {
      const source = { provider: { newP: { a: 1 } } };
      const target = { provider: { oldP: { b: 2 } } };
      const result = mergeJson(source, target);
      assert.deepEqual(result.provider.oldP, { b: 2 });
      assert.deepEqual(result.provider.newP, { a: 1 });
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

  describe('reconcileManagedKeys (HARNESS-054)', () => {
    it('removes obsolete managed keys present in target but absent in source', () => {
      const source = { model: 'gpt-4' };
      const target = { model: 'custom', plugin: ['old-plugin'], mySecret: '123' };
      const result = reconcileManagedKeys(source, target);
      assert.deepEqual(result, { model: 'custom', mySecret: '123' });
    });

    it('preserves managed keys present in source', () => {
      const source = { model: 'gpt-4', plugin: ['.opencode/plugins/opentrust.js'] };
      const target = { model: 'custom', plugin: ['old-plugin'] };
      const result = reconcileManagedKeys(source, target);
      assert.deepEqual(result, { model: 'custom', plugin: ['old-plugin'] });
    });

    it('preserves non-managed user keys', () => {
      const source = { model: 'gpt-4' };
      const target = { share: 'disabled', snapshot: true, autoupdate: 'notify', compaction: { auto: true } };
      const result = reconcileManagedKeys(source, target);
      assert.deepEqual(result, {
        share: 'disabled',
        snapshot: true,
        autoupdate: 'notify',
        compaction: { auto: true },
      });
    });

    it('does not mutate inputs', () => {
      const source = { model: 'gpt-4' };
      const target = { plugin: ['old'] };
      const result = reconcileManagedKeys(source, target);
      assert.deepEqual(target, { plugin: ['old'] });
      assert.deepEqual(source, { model: 'gpt-4' });
      assert.notEqual(result, target);
    });

    it('MANAGED_KEYS covers the harness-managed top-level keys', () => {
      for (const key of ['$schema', 'model', 'small_model', 'provider', 'mcp', 'default_agent', 'instructions', 'references', 'watcher', 'permission', 'agent', 'plugin']) {
        assert.ok(MANAGED_KEYS.includes(key), `MANAGED_KEYS should include ${key}`);
      }
    });
  });

  describe('preserveUserKeys (HARNESS-054)', () => {
    it('restores user values for user-controlled keys after source-wins merge', () => {
      const source = { snapshot: true, autoupdate: 'notify', compaction: { auto: true } };
      const target = { snapshot: false, autoupdate: 'never', compaction: { auto: false } };
      const merged = mergeJson(source, target);
      assert.equal(merged.snapshot, true, 'source wins in plain merge');
      const result = preserveUserKeys(merged, target);
      assert.equal(result.snapshot, false, 'user snapshot restored');
      assert.equal(result.autoupdate, 'never', 'user autoupdate restored');
      assert.deepEqual(result.compaction, { auto: false }, 'user compaction restored');
    });

    it('keeps merged value when user key is absent from target', () => {
      const source = { snapshot: true };
      const target = {};
      const merged = mergeJson(source, target);
      const result = preserveUserKeys(merged, target);
      assert.equal(result.snapshot, true, 'source value kept when user has no value');
    });

    it('does not mutate inputs', () => {
      const source = { snapshot: true };
      const target = { snapshot: false };
      const merged = mergeJson(source, target);
      const result = preserveUserKeys(merged, target);
      assert.deepEqual(target, { snapshot: false });
      assert.notEqual(result, merged);
    });

    it('USER_KEYS covers the user-controlled top-level keys', () => {
      for (const key of ['share', 'snapshot', 'autoupdate', 'compaction']) {
        assert.ok(USER_KEYS.includes(key), `USER_KEYS should include ${key}`);
      }
    });
  });
});
