/**
 * Package metadata and distribution tests.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
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
    assert.equal(pkg.bin['openstrut'], './bin/openstrut.js');
  });

  it('keeps package private until explicit publish approval', () => {
    assert.equal(pkg.private, true);
  });

  it('ships a workflows directory in repo', () => {
    assert.equal(existsSync(path.join(PACKAGE_ROOT, 'workflows')), true);
  });

  it('ships 40 priority agents in repo (OpenTrust topology)', () => {
    const agents = readdirSync(path.join(PACKAGE_ROOT, 'global', 'agents')).filter(name => name.endsWith('.md'));
    assert.ok(agents.length >= 40, `Expected at least 40 agents, got ${agents.length}`);
  });

  it('ships 7 opentrust-* skills by default, legacy skills still on disk', () => {
    const skills = readdirSync(path.join(PACKAGE_ROOT, 'global', 'skills'), { withFileTypes: true })
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name)
      .filter(name => existsSync(path.join(PACKAGE_ROOT, 'global', 'skills', name, 'SKILL.md')));
    const opentrustSkills = skills.filter(name => name.startsWith('opentrust-'));
    assert.equal(opentrustSkills.length, 7, 'Expected exactly 7 opentrust-* skills');
  });

  it('ships 8 workflow definitions in repo', () => {
    const workflows = readdirSync(path.join(PACKAGE_ROOT, 'workflows')).filter(name => name.endsWith('.yaml'));
    assert.equal(workflows.length, 8);
  });
});
