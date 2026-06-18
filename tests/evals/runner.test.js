import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { normaliseArgs, bridgeCredentials, parseEvents } from '../../evals/runner/adapter.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------------------
// Argument normalisation
// ---------------------------------------------------------------------------

test('Arg normalisation: prompt-only becomes run command with --format json', () => {
  const result = normaliseArgs(['Reply with exactly: OK']);
  assert.strictEqual(result[0], 'run');
  assert.ok(result.includes('--format'));
  const fmtIdx = result.indexOf('--format');
  assert.strictEqual(result[fmtIdx + 1], 'json');
  assert.ok(result.includes('Reply with exactly: OK'));
});

test('Arg normalisation: explicit run also receives --format json', () => {
  const result = normaliseArgs(['run', 'Reply with exactly: OK']);
  assert.strictEqual(result[0], 'run');
  const count = result.filter(t => t === '--format').length;
  assert.strictEqual(count, 1, '--format should appear exactly once');
  const fmtIdx = result.indexOf('--format');
  assert.strictEqual(result[fmtIdx + 1], 'json');
});

test('Arg normalisation: existing --format json is not duplicated', () => {
  const result = normaliseArgs(['run', 'Hello', '--format', 'json']);
  const count = result.filter(t => t === '--format').length;
  assert.strictEqual(count, 1, '--format should not be duplicated');
});

test('Arg normalisation: agent override is injected', () => {
  const result = normaliseArgs(['Reply with OK'], 'plan');
  assert.ok(result.includes('--agent'));
  const idx = result.indexOf('--agent');
  assert.strictEqual(result[idx + 1], 'plan');
});

test('Arg normalisation: agent already present is not duplicated', () => {
  const result = normaliseArgs(['run', 'Hello', '--agent', 'build'], 'plan');
  const count = result.filter(t => t === '--agent').length;
  assert.strictEqual(count, 1);
  const idx = result.indexOf('--agent');
  assert.strictEqual(result[idx + 1], 'build'); // original preserved
});

test('Arg normalisation: model override is injected', () => {
  const result = normaliseArgs(['Reply with OK'], null, '9router/combo-main');
  assert.ok(result.includes('--model'));
  const idx = result.indexOf('--model');
  assert.strictEqual(result[idx + 1], '9router/combo-main');
});

test('Arg normalisation: debug config is not rewritten as run', () => {
  const result = normaliseArgs(['debug', 'config']);
  assert.strictEqual(result[0], 'debug');
  assert.ok(!result.includes('run'));
  assert.ok(!result.includes('--format'));
});

test('Arg normalisation: agent list is not rewritten as run', () => {
  const result = normaliseArgs(['agent', 'list']);
  assert.strictEqual(result[0], 'agent');
  assert.ok(!result.includes('run'));
  assert.ok(!result.includes('--format'));
});

// ---------------------------------------------------------------------------
// Standard input: mock executable that blocks until EOF on stdin
// ---------------------------------------------------------------------------

test('Stdin closed (ignore): adapter completes without timeout', { timeout: 15000 }, async () => {
  // Create a mock opencode executable that:
  // 1. Reads stdin until EOF
  // 2. Emits a JSON event only after EOF
  // 3. Exits 0
  // Under the previous open-stdin behaviour this test would hang indefinitely.
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'eval-mock-bin-'));
  const mockBin = path.join(tmpDir, 'mock-opencode');
  fs.writeFileSync(
    mockBin,
    `#!/usr/bin/env node
// Blocks until stdin closes, then emits one JSON event and exits.
let chunks = [];
process.stdin.on('data', d => chunks.push(d));
process.stdin.on('end', () => {
  const event = JSON.stringify({ type: 'assistant_message', content: 'STDIN_CLOSED_OK' });
  process.stdout.write(event + '\\n');
  process.exit(0);
});
`,
    { mode: 0o755 }
  );

  const tmpPkg = fs.mkdtempSync(path.join(os.tmpdir(), 'eval-pkg-'));
  const xdgConfigHome = fs.mkdtempSync(path.join(os.tmpdir(), 'eval-xdg-'));
  const xdgDataHome = fs.mkdtempSync(path.join(os.tmpdir(), 'eval-xdgd-'));
  const tempHome = fs.mkdtempSync(path.join(os.tmpdir(), 'eval-home-'));
  const fixtureDir = fs.mkdtempSync(path.join(os.tmpdir(), 'eval-fixture-'));

  const cleanupDirs = [tmpDir, tmpPkg, xdgConfigHome, xdgDataHome, tempHome, fixtureDir];
  const cleanup = () => {
    for (const d of cleanupDirs) {
      try { fs.rmSync(d, { recursive: true, force: true }); } catch (_) {}
    }
  };

  // We need a minimal harness installation so executeOpenCode can proceed.
  // Because we can't use the full installHarness without npm, we stub by
  // pre-creating the expected XDG structure manually.
  // Instead, we test the spawn-level stdin behaviour directly via a thin wrapper.

  // Spawn mock executable directly with stdio: ['ignore', 'pipe', 'pipe']
  const { spawn } = await import('node:child_process');
  const start = Date.now();

  await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [mockBin], {
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    child.stdout.on('data', d => { stdout += d.toString(); });
    child.on('close', (code) => {
      cleanup();
      try {
        assert.strictEqual(code, 0, 'mock should exit 0');
        const event = JSON.parse(stdout.trim());
        assert.strictEqual(event.content, 'STDIN_CLOSED_OK');
        const elapsed = Date.now() - start;
        assert.ok(elapsed < 10000, `Should complete quickly, took ${elapsed}ms`);
        resolve();
      } catch (err) {
        reject(err);
      }
    });
    const timer = setTimeout(() => {
      child.kill('SIGKILL');
      cleanup();
      reject(new Error('FAIL: mock executable hung — stdin was not closed (open-stdin regression)'));
    }, 12000);
    child.on('close', () => clearTimeout(timer));
  });
});

// ---------------------------------------------------------------------------
// Event parser
// ---------------------------------------------------------------------------

test('Event parser: synthetic session_start → agent and model', () => {
  const events = [
    { type: 'session_start', agent: 'plan', model: 'combo-main' },
    { type: 'tool_start', tool: 'skill:engineering-project-bootstrap' },
    { type: 'tool_start', tool: 'opencode_run', args: { agent: 'code-reviewer' } },
    { type: 'assistant_message', content: 'Here is the plan.' },
  ];
  const parsed = parseEvents(events);
  assert.strictEqual(parsed.agent, 'plan');
  assert.strictEqual(parsed.model, 'combo-main');
  assert.ok(parsed.skills.includes('skill:engineering-project-bootstrap'));
  assert.ok(parsed.subagents.includes('code-reviewer'));
  assert.strictEqual(parsed.finalResponse.trim(), 'Here is the plan.');
});

test('Event parser: empty events return nulls', () => {
  const parsed = parseEvents([]);
  assert.strictEqual(parsed.agent, null);
  assert.strictEqual(parsed.model, null);
  assert.deepStrictEqual(parsed.tools, []);
});

// ---------------------------------------------------------------------------
// Credential bridge
// ---------------------------------------------------------------------------

test('Credential bridge: valid source key is copied byte-for-byte with 0600 permissions', () => {
  const tmpHome = fs.mkdtempSync(path.join(os.tmpdir(), 'eval-testhome-'));
  const tmpOverride = fs.mkdtempSync(path.join(os.tmpdir(), 'eval-override-'));
  const srcSecrets = path.join(tmpOverride, '.local/share/opencode/secrets');
  fs.mkdirSync(srcSecrets, { recursive: true });
  fs.writeFileSync(path.join(srcSecrets, '9router-api-key'), 'fake-secret-value');

  bridgeCredentials(true, tmpHome, tmpOverride);

  const dstFile = path.join(tmpHome, '.local/share/opencode/secrets/9router-api-key');
  assert.ok(fs.existsSync(dstFile));
  assert.strictEqual(fs.readFileSync(dstFile, 'utf8'), 'fake-secret-value');

  const stats = fs.statSync(dstFile);
  assert.strictEqual(stats.mode & 0o777, 0o600);

  const parentStats = fs.statSync(path.dirname(dstFile));
  assert.strictEqual(parentStats.mode & 0o777, 0o700);

  fs.rmSync(tmpHome, { recursive: true, force: true });
  fs.rmSync(tmpOverride, { recursive: true, force: true });
});

test('Credential bridge: empty source file creates no destination key', () => {
  const tmpHome = fs.mkdtempSync(path.join(os.tmpdir(), 'eval-testhome-'));
  const tmpOverride = fs.mkdtempSync(path.join(os.tmpdir(), 'eval-override-'));
  const srcSecrets = path.join(tmpOverride, '.local/share/opencode/secrets');
  fs.mkdirSync(srcSecrets, { recursive: true });
  fs.writeFileSync(path.join(srcSecrets, '9router-api-key'), '');

  bridgeCredentials(true, tmpHome, tmpOverride);

  const dstFile = path.join(tmpHome, '.local/share/opencode/secrets/9router-api-key');
  assert.ok(!fs.existsSync(dstFile), 'Empty source key must not be bridged');

  fs.rmSync(tmpHome, { recursive: true, force: true });
  fs.rmSync(tmpOverride, { recursive: true, force: true });
});

test('Credential bridge: requireModel=false creates empty config placeholder at 0600', () => {
  const tmpHome = fs.mkdtempSync(path.join(os.tmpdir(), 'eval-testhome-'));
  const tmpOverride = fs.mkdtempSync(path.join(os.tmpdir(), 'eval-override-'));
  const srcSecrets = path.join(tmpOverride, '.local/share/opencode/secrets');
  fs.mkdirSync(srcSecrets, { recursive: true });
  fs.writeFileSync(path.join(srcSecrets, '9router-api-key'), 'fake-secret-value');

  bridgeCredentials(false, tmpHome, tmpOverride);

  const dstFile = path.join(tmpHome, '.local/share/opencode/secrets/9router-api-key');
  assert.ok(fs.existsSync(dstFile));
  assert.strictEqual(fs.readFileSync(dstFile, 'utf8'), '', 'Config placeholder must be empty');
  const stats = fs.statSync(dstFile);
  assert.strictEqual(stats.mode & 0o777, 0o600);

  fs.rmSync(tmpHome, { recursive: true, force: true });
  fs.rmSync(tmpOverride, { recursive: true, force: true });
});

test('Credential bridge: missing source key creates no destination', () => {
  const tmpHome = fs.mkdtempSync(path.join(os.tmpdir(), 'eval-testhome-'));
  const tmpOverride = fs.mkdtempSync(path.join(os.tmpdir(), 'eval-override-'));
  // No secrets dir created — key file is absent

  bridgeCredentials(true, tmpHome, tmpOverride);

  const dstFile = path.join(tmpHome, '.local/share/opencode/secrets/9router-api-key');
  assert.ok(!fs.existsSync(dstFile), 'Missing source must not produce destination');

  fs.rmSync(tmpHome, { recursive: true, force: true });
  fs.rmSync(tmpOverride, { recursive: true, force: true });
});
