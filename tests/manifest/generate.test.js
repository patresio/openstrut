/**
 * Integration tests for src/manifest/generate.js
 *
 * Tests use the fixture directories under tests/manifest/fixtures/.
 * Each invalid fixture must produce the correct BLOCKED error code.
 * The valid fixture must produce a correct execution-manifest.yaml.
 */

import { describe, it, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { generate } from '../../src/manifest/generate.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(__dirname, '../..');
const FIXTURES = path.join(__dirname, 'fixtures');
const VALID_FIXTURE = path.join(FIXTURES, 'valid');

// ─── Cleanup helper ───────────────────────────────────────────────────────────

/** Remove generated manifests from fixture dirs after each test */
const generatedFiles = [];
afterEach(() => {
  for (const f of generatedFiles.splice(0)) {
    if (fs.existsSync(f)) fs.unlinkSync(f);
  }
});

// ─── Valid fixture ────────────────────────────────────────────────────────────

describe('generate — valid fixture', () => {
  it('writes execution-manifest.yaml to the change directory', () => {
    const manifestPath = path.join(VALID_FIXTURE, 'execution-manifest.yaml');
    generatedFiles.push(manifestPath);

    const result = generate({ changeDir: VALID_FIXTURE, packageRoot: PACKAGE_ROOT });
    assert.ok(result.ok, `Expected ok=true, got errors: ${result.errors?.join(', ')}`);
    assert.ok(fs.existsSync(manifestPath), 'execution-manifest.yaml must exist');
  });

  it('manifest starts with schema_version: 1', () => {
    const manifestPath = path.join(VALID_FIXTURE, 'execution-manifest.yaml');
    generatedFiles.push(manifestPath);

    generate({ changeDir: VALID_FIXTURE, packageRoot: PACKAGE_ROOT });
    const content = fs.readFileSync(manifestPath, 'utf8');
    assert.ok(content.startsWith('schema_version: 1'), `Got:\n${content}`);
  });

  it('manifest contains waiting_for_execution_approval', () => {
    const manifestPath = path.join(VALID_FIXTURE, 'execution-manifest.yaml');
    generatedFiles.push(manifestPath);

    generate({ changeDir: VALID_FIXTURE, packageRoot: PACKAGE_ROOT });
    const content = fs.readFileSync(manifestPath, 'utf8');
    assert.ok(content.includes('waiting_for_execution_approval'), `Got:\n${content}`);
  });

  it('manifest is byte-for-byte identical on two runs', () => {
    const manifestPath = path.join(VALID_FIXTURE, 'execution-manifest.yaml');
    generatedFiles.push(manifestPath);

    generate({ changeDir: VALID_FIXTURE, packageRoot: PACKAGE_ROOT });
    const first = fs.readFileSync(manifestPath, 'utf8');
    fs.unlinkSync(manifestPath);
    generate({ changeDir: VALID_FIXTURE, packageRoot: PACKAGE_ROOT });
    const second = fs.readFileSync(manifestPath, 'utf8');
    assert.equal(first, second, 'Manifest must be byte-for-byte identical on repeat runs');
  });

  it('only execution-manifest.yaml is written — no other files changed', () => {
    const before = fs.readdirSync(VALID_FIXTURE).sort();
    const manifestPath = path.join(VALID_FIXTURE, 'execution-manifest.yaml');
    generatedFiles.push(manifestPath);

    generate({ changeDir: VALID_FIXTURE, packageRoot: PACKAGE_ROOT });
    const after = fs.readdirSync(VALID_FIXTURE).sort().filter(f => f !== 'execution-manifest.yaml');
    assert.deepEqual(before, after,
      'No files other than execution-manifest.yaml should be created or deleted');
  });

  it('tasks appear in dependency order: T001 before T002', () => {
    const manifestPath = path.join(VALID_FIXTURE, 'execution-manifest.yaml');
    generatedFiles.push(manifestPath);

    generate({ changeDir: VALID_FIXTURE, packageRoot: PACKAGE_ROOT });
    const content = fs.readFileSync(manifestPath, 'utf8');
    const t001Idx = content.indexOf('id: T001');
    const t002Idx = content.indexOf('id: T002');
    assert.ok(t001Idx < t002Idx, `T001 must appear before T002\n${content}`);
  });

  it('success replacing previous file atomically', () => {
    const manifestPath = path.join(VALID_FIXTURE, 'execution-manifest.yaml');
    generatedFiles.push(manifestPath);
    
    fs.writeFileSync(manifestPath, 'old content');
    const result = generate({ changeDir: VALID_FIXTURE, packageRoot: PACKAGE_ROOT });
    assert.ok(result.ok);
    const content = fs.readFileSync(manifestPath, 'utf8');
    assert.ok(content.includes('schema_version: 1'));
  });

  it('absence of residual temporaries', () => {
    const manifestPath = path.join(VALID_FIXTURE, 'execution-manifest.yaml');
    generatedFiles.push(manifestPath);

    generate({ changeDir: VALID_FIXTURE, packageRoot: PACKAGE_ROOT });
    const files = fs.readdirSync(VALID_FIXTURE);
    const temps = files.filter(f => f.includes('.tmp'));
    assert.deepEqual(temps, []);
  });
});

describe('generate — atomic error handling', () => {
  it('error without previous file leaves no file', () => {
    const changeDir = path.join(FIXTURES, 'invalid', 'missing-proposal');
    const manifestPath = path.join(changeDir, 'execution-manifest.yaml');
    if (fs.existsSync(manifestPath)) fs.unlinkSync(manifestPath);
    
    generate({ changeDir, packageRoot: PACKAGE_ROOT });
    assert.ok(!fs.existsSync(manifestPath), 'manifest should not be created on error');
  });

  it('error preserving previous file leaves it intact', () => {
    const changeDir = path.join(FIXTURES, 'invalid', 'missing-proposal');
    const manifestPath = path.join(changeDir, 'execution-manifest.yaml');
    fs.writeFileSync(manifestPath, 'pre-existing valid content');
    generatedFiles.push(manifestPath); // clean up after
    
    generate({ changeDir, packageRoot: PACKAGE_ROOT });
    const content = fs.readFileSync(manifestPath, 'utf8');
    assert.equal(content, 'pre-existing valid content');
    fs.unlinkSync(manifestPath); // Manual cleanup here just in case
  });
});

// ─── Invalid fixtures — one per blocking error ────────────────────────────────

describe('generate — blocking errors', () => {
  function assertBlocked(fixtureName, expectedCode) {
    it(`${fixtureName} → ${expectedCode}`, () => {
      const changeDir = path.join(FIXTURES, 'invalid', fixtureName);
      const result = generate({ changeDir, packageRoot: PACKAGE_ROOT });
      assert.ok(!result.ok, `Expected ok=false for fixture "${fixtureName}"`);
      assert.ok(
        result.errors.some(e => e.includes(expectedCode)),
        `Expected error containing "${expectedCode}", got: ${result.errors.join('; ')}`
      );
    });
  }

  [
    ['duplicate-task-agent', 'BLOCKED — DUPLICATE TASK FIELD'],
    ['duplicate-task-skills', 'BLOCKED — DUPLICATE TASK FIELD'],
    ['duplicate-task-dependencies', 'BLOCKED — DUPLICATE TASK FIELD'],
    ['duplicate-task-parallel-group', 'BLOCKED — DUPLICATE TASK FIELD'],
    ['duplicate-approval-field', 'BLOCKED — DUPLICATE APPROVAL FIELD'],
    ['missing-approval-metadata', 'BLOCKED — CHANGE APPROVAL METADATA REQUIRED']
  ].forEach(([f, c]) => assertBlocked(f, c));

  assertBlocked('not-approved',               'CHANGE NOT APPROVED');
  assertBlocked('invalid-approval-metadata',  'INVALID APPROVAL METADATA');
  assertBlocked('task-id-required',           'TASK ID REQUIRED');
  assertBlocked('duplicate-task-id',          'DUPLICATE TASK ID');
  assertBlocked('invalid-task-id',            'INVALID TASK ID');
  assertBlocked('task-agent-required',        'TASK AGENT REQUIRED');
  assertBlocked('unknown-agent',              'UNKNOWN AGENT');
  assertBlocked('task-skills-required',       'TASK SKILLS DECLARATION REQUIRED');
  assertBlocked('unknown-skill',              'UNKNOWN SKILL');
  assertBlocked('dependency-required',        'DEPENDENCY DECLARATION REQUIRED');
  assertBlocked('unknown-dependency',         'UNKNOWN TASK DEPENDENCY');
  assertBlocked('cyclic-dependency',          'CYCLIC DEPENDENCY');
  assertBlocked('self-dependency',            'SELF DEPENDENCY');
  assertBlocked('parallel-group-required',    'PARALLEL GROUP DECLARATION REQUIRED');
  assertBlocked('invalid-parallel-group',     'INVALID PARALLEL GROUP');
  assertBlocked('missing-proposal',           'PROPOSAL REQUIRED');
  assertBlocked('missing-tasks',              'TASKS REQUIRED');
  assertBlocked('missing-specs-dir',          'SPEC REQUIRED');
  assertBlocked('missing-spec-md',            'SPEC REQUIRED');
  assertBlocked('missing-spec-capability',    'SPEC REQUIRED');
  assertBlocked('missing-spec-file',          'SPEC REQUIRED');
  assertBlocked('change-id-mismatch',         'CHANGE ID PATH MISMATCH');
});
