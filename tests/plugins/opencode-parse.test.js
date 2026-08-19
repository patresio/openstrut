/**
 * OpenCode plugin syntax tests (HARNESS-052).
 *
 * The plugin must parse as an ES module; a SyntaxError here means the plugin
 * is dead on arrival for OpenCode.
 *
 * NOTE: `node --check <file.js>` is unreliable for ESM-detected files on
 * Node >= 22.7 (module syntax detection skips the ESM parse for `--check`).
 * We force ESM parsing via stdin with `--input-type=module`.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..', '..');
const pluginPath = join(projectRoot, '.opencode', 'plugins', 'opentrust.js');

describe('OpenCode plugin syntax', () => {
  it('parses as an ES module (node --input-type=module --check)', () => {
    const content = readFileSync(pluginPath, 'utf8');
    assert.doesNotThrow(() => {
      execFileSync(process.execPath, ['--input-type=module', '--check'], {
        input: content,
        encoding: 'utf8',
      });
    }, 'plugin should parse without syntax errors');
  });
});