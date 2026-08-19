/**
 * npm pack distribution tests.
 *
 * Asserts that plugin sources ship inside the published tarball so that a
 * global install via tarball can find them (HARNESS-052).
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = join(__dirname, '../..');
const NPM = process.platform === 'win32' ? 'npm.cmd' : 'npm';

function packedFiles() {
  const output = execFileSync(NPM, ['pack', '--dry-run', '--json', '--ignore-scripts'], {
    cwd: PACKAGE_ROOT,
    encoding: 'utf8',
  });
  const [result] = JSON.parse(output);
  return result.files.map((file) => file.path);
}

describe('npm pack distribution', () => {
  it('ships Hermes plugin sources (plugins/opentrust/**)', () => {
    const files = packedFiles();
    assert.ok(files.includes('plugins/opentrust/plugin.yaml'), 'plugin.yaml should be packed');
    assert.ok(files.includes('plugins/opentrust/__init__.py'), '__init__.py should be packed');
    assert.ok(files.includes('plugins/opentrust/tools.py'), 'tools.py should be packed');
  });

  it('ships OpenCode plugin (.opencode/plugins/opentrust.js)', () => {
    const files = packedFiles();
    assert.ok(files.includes('.opencode/plugins/opentrust.js'), 'opentrust.js should be packed');
  });

  it('excludes Python bytecode (__pycache__) from the tarball', () => {
    const files = packedFiles();
    assert.ok(
      !files.some((file) => file.includes('__pycache__') || file.endsWith('.pyc')),
      'no __pycache__ bytecode should be packed',
    );
  });
});