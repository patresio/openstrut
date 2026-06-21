import test from 'node:test';
import assert from 'node:assert';
import { execSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
const CLI_PATH = path.join(PROJECT_ROOT, 'bin', 'opencode-engineering-harness.js');

test('CLI generate-manifest — canonical path checks and portability', async (t) => {
  const tmpDir = fs.mkdtempSync(path.join('/tmp', 'harness-cli-test-'));

  t.after(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  // Create a fake project structure inside tmpDir
  const gitRoot = path.join(tmpDir, 'fake-repo');
  fs.mkdirSync(gitRoot);
  execSync('git init', { cwd: gitRoot });

  const canonicalChangeDir = path.join(gitRoot, 'openspec', 'changes', 'my-change');
  fs.mkdirSync(path.join(canonicalChangeDir, 'specs', 'auth'), { recursive: true });

  // Add necessary files for a valid change
  fs.writeFileSync(path.join(canonicalChangeDir, 'proposal.md'), `---
change_id: my-change
status: approved
approved_by: tester
approved_at: 2026-06-18T00:00:00Z
---
`);
  fs.writeFileSync(path.join(canonicalChangeDir, 'tasks.md'), `
## T001 — Task
Agent: build
Skills: none
Depends on: none
Parallel group: none
`);
  fs.writeFileSync(path.join(canonicalChangeDir, 'specs', 'auth', 'spec.md'), '# Spec');

  // Test 1: Canonical change works
  await t.test('CLI accepts canonical change path', () => {
    const stdout = execSync(`node ${CLI_PATH} generate-manifest --change ${canonicalChangeDir}`, { cwd: gitRoot, encoding: 'utf8' });
    assert.ok(stdout.includes('Generated:'));
    const manifestPath = path.join(canonicalChangeDir, 'execution-manifest.yaml');
    assert.ok(fs.existsSync(manifestPath));
    const content = fs.readFileSync(manifestPath, 'utf8');
    assert.ok(!content.includes(gitRoot)); // no absolute local paths
    assert.ok(content.includes('path: openspec/changes/my-change'));
  });

  // Test 2: Arbitrary directory outside openspec/changes
  await t.test('CLI rejects arbitrary directory outside openspec/changes', () => {
    const arbitraryDir = path.join(gitRoot, 'random-dir');
    fs.mkdirSync(arbitraryDir);
    let errorOutput = '';
    try {
      execSync(`node ${CLI_PATH} generate-manifest --change ${arbitraryDir}`, { cwd: gitRoot, encoding: 'utf8', stdio: 'pipe' });
    } catch (err) {
      errorOutput = err.stderr.toString();
    }
    assert.ok(errorOutput.includes('BLOCKED — NON-CANONICAL CHANGE PATH: expected'));
  });

  // Test 3: CLI called with cwd different from project root
  await t.test('CLI works when called from outside the project root (testing portability)', () => {
    // Delete existing manifest
    fs.rmSync(path.join(canonicalChangeDir, 'execution-manifest.yaml'));
    
    // Call from /tmp
    const stdout = execSync(`node ${CLI_PATH} generate-manifest --change ${canonicalChangeDir}`, { cwd: '/tmp', encoding: 'utf8' });
    assert.ok(stdout.includes('Generated:'));
    assert.ok(fs.existsSync(path.join(canonicalChangeDir, 'execution-manifest.yaml')));
  });
});
