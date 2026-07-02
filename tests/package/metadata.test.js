/**
 * Package metadata and distribution tests.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(__dirname, '../..');
const pkg = JSON.parse(readFileSync(path.join(PACKAGE_ROOT, 'package.json'), 'utf8'));

describe('package distribution metadata', () => {
  it('includes workflows in packaged files', () => {
    assert.ok(Array.isArray(pkg.files));
    assert.ok(pkg.files.includes('workflows'));
  });

  it('keeps CLI bin entry', () => {
    assert.equal(pkg.bin['opencode-engineering-harness'], './bin/opencode-engineering-harness.js');
  });

  it('keeps package private until explicit publish approval', () => {
    assert.equal(pkg.private, true);
  });

  it('ships a workflows directory in repo', () => {
    assert.equal(existsSync(path.join(PACKAGE_ROOT, 'workflows')), true);
  });
});
