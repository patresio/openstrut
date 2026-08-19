/**
 * Tests for the spec-anchored audit gate.
 *
 * Covers:
 *   - auditChange: end-to-end audit of the aligned and findings fixtures
 *   - CLI gate: `openstrut audit --change <dir>` exits 0 when aligned and 1
 *     when findings exist; blocks non-canonical change paths (exit 2)
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { execSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { auditChange } from '../../src/audit/audit.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
const CLI_PATH = path.join(PROJECT_ROOT, 'bin', 'openstrut.js');
const FIXTURES = path.join(__dirname, 'fixtures');
const ALIGNED_FIXTURE = path.join(FIXTURES, 'aligned');
const FINDINGS_FIXTURE = path.join(FIXTURES, 'findings');
const ALIGNED_CHANGE = path.join(ALIGNED_FIXTURE, 'openspec', 'changes', 'sample-auth');
const FINDINGS_CHANGE = path.join(FINDINGS_FIXTURE, 'openspec', 'changes', 'sample-findings');

/**
 * Ensures a git repository exists at the fixture root so the CLI canonical
 * change-path check (`git rev-parse --show-toplevel`) resolves to the fixture.
 * The .git directory is removed after the test so the working tree stays clean.
 */
function ensureFixtureGit(fixtureRoot) {
  if (!fs.existsSync(path.join(fixtureRoot, '.git'))) {
    execSync('git init -q', { cwd: fixtureRoot, stdio: 'pipe' });
  }
}

function removeFixtureGit(fixtureRoot) {
  const gitDir = path.join(fixtureRoot, '.git');
  if (fs.existsSync(gitDir)) fs.rmSync(gitDir, { recursive: true, force: true });
}

function runCLI(args) {
  return spawnSync(process.execPath, [CLI_PATH, ...args], { encoding: 'utf8' });
}

// ─── auditChange ─────────────────────────────────────────────────────────────

test('auditChange reports the aligned fixture as ok', () => {
  const result = auditChange({ changeDir: ALIGNED_CHANGE, packageRoot: PROJECT_ROOT, testRoot: ALIGNED_FIXTURE });
  assert.equal(result.ok, true);
  assert.deepEqual(result.findings, []);
  assert.deepEqual(result.counts, { stories: 1, criteria: 2, tasks: 2, tests: 1 });
});

test('auditChange reports the findings fixture with all five codes', () => {
  const result = auditChange({ changeDir: FINDINGS_CHANGE, packageRoot: PROJECT_ROOT, testRoot: FINDINGS_FIXTURE });
  assert.equal(result.ok, false);
  assert.deepEqual(result.counts, { stories: 1, criteria: 2, tasks: 4, tests: 1 });
  const codes = result.findings.map(f => f.code);
  assert.ok(codes.includes('AC_SEM_TESTE'), `expected AC_SEM_TESTE, got ${codes}`);
  assert.ok(codes.includes('TESTE_ORFAO'), `expected TESTE_ORFAO, got ${codes}`);
  assert.ok(codes.includes('TASK_CONCLUIDA_SEM_PROVA'), `expected TASK_CONCLUIDA_SEM_PROVA, got ${codes}`);
  assert.ok(codes.includes('REF_QUEBRADA'), `expected REF_QUEBRADA, got ${codes}`);
  assert.ok(codes.includes('TASK_STATUS_INVALIDO'), `expected TASK_STATUS_INVALIDO, got ${codes}`);
});

// ─── CLI gate ────────────────────────────────────────────────────────────────

test('CLI audit gate exits 0 on an aligned change', (t) => {
  ensureFixtureGit(ALIGNED_FIXTURE);
  t.after(() => removeFixtureGit(ALIGNED_FIXTURE));

  const res = runCLI(['audit', '--change', ALIGNED_CHANGE]);
  assert.equal(res.status, 0, `expected exit 0, got ${res.status}: ${res.stdout}\n${res.stderr}`);
  assert.ok(res.stdout.includes('Audit OK'), `expected Audit OK line, got: ${res.stdout}`);
});

test('CLI audit gate exits 1 when findings exist', (t) => {
  ensureFixtureGit(FINDINGS_FIXTURE);
  t.after(() => removeFixtureGit(FINDINGS_FIXTURE));

  const res = runCLI(['audit', '--change', FINDINGS_CHANGE]);
  assert.equal(res.status, 1, `expected exit 1, got ${res.status}: ${res.stdout}\n${res.stderr}`);
  for (const code of ['AC_SEM_TESTE', 'TESTE_ORFAO', 'TASK_CONCLUIDA_SEM_PROVA', 'REF_QUEBRADA', 'TASK_STATUS_INVALIDO']) {
    assert.ok(res.stdout.includes(`[${code}]`), `expected [${code}] in output: ${res.stdout}`);
  }
});

test('CLI audit gate blocks a non-canonical change path (exit 2)', () => {
  const nonCanonical = path.join(FIXTURES, 'aligned', 'random-dir');
  fs.mkdirSync(nonCanonical, { recursive: true });
  try {
    const res = runCLI(['audit', '--change', nonCanonical]);
    assert.equal(res.status, 2, `expected exit 2, got ${res.status}`);
    assert.ok(res.stderr.includes('NON-CANONICAL CHANGE PATH'), `expected block message, got: ${res.stderr}`);
  } finally {
    fs.rmSync(nonCanonical, { recursive: true, force: true });
  }
});

test('CLI audit command requires --change', () => {
  const res = runCLI(['audit']);
  assert.equal(res.status, 3, `expected exit 3, got ${res.status}`);
});

test('CLI audit outputs JSON with --json', (t) => {
  ensureFixtureGit(ALIGNED_FIXTURE);
  t.after(() => removeFixtureGit(ALIGNED_FIXTURE));

  const res = runCLI(['audit', '--change', ALIGNED_CHANGE, '--json']);
  assert.equal(res.status, 0, `expected exit 0, got ${res.status}`);
  const parsed = JSON.parse(res.stdout);
  assert.equal(parsed.command, 'audit');
  assert.equal(parsed.ok, true);
  assert.equal(parsed.counts.criteria, 2);
});