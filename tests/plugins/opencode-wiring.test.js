/**
 * OpenCode plugin global wiring tests (HARNESS-052).
 *
 * The shipped global config must register the plugin and the installer
 * inventory must install it, so a global install wires the plugin
 * automatically.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { INVENTORY } from '../../src/installer/inventory.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..', '..');

function globalConfig() {
  return JSON.parse(readFileSync(join(projectRoot, 'global', 'opencode.json'), 'utf8'));
}

describe('OpenCode plugin global wiring', () => {
  it('global/opencode.json registers the plugin as a relative string spec', () => {
    const config = globalConfig();
    assert.ok(Array.isArray(config.plugin), 'config.plugin should be an array');
    const spec = config.plugin[0];
    assert.equal(typeof spec, 'string', `plugin[0] should be a string, got ${typeof spec}`);
    assert.ok(spec.startsWith('.'), `plugin spec should be a relative path, got ${spec}`);
    assert.ok(!spec.includes('{'), 'plugin spec should not be an object');
  });

  it('plugin spec resolves to a shipped file', () => {
    const config = globalConfig();
    const spec = config.plugin[0];
    assert.ok(existsSync(join(projectRoot, spec)), `plugin file should exist at ${spec}`);
  });

  it('inventory installs the plugin to the global config', () => {
    const entry = INVENTORY.find((e) => e.source === '.opencode/plugins/opentrust.js');
    assert.ok(entry, 'inventory should include .opencode/plugins/opentrust.js');
    assert.equal(entry.target, '.opencode/plugins/opentrust.js');
  });
});