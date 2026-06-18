import fs from 'fs';
import os from 'os';
import path from 'path';
import { spawn } from 'child_process';
import { execSync } from 'child_process';

// ---------------------------------------------------------------------------
// Argument normalisation
// ---------------------------------------------------------------------------
// OpenCode may read piped stdin until EOF when stdin is non-TTY.
// All run-mode invocations must therefore use stdio: ['ignore', 'pipe', 'pipe']
// to guarantee immediate EOF on stdin.  Do NOT leave a writable stdin pipe open.
//
// Inspection subcommands (debug config, debug skill, agent list) are passed
// through unchanged; --format json is NOT injected into them.
//
// Run subcommands receive --format json to produce newline-delimited JSON events.

const INSPECTION_PREFIXES = [
  ['debug'],
  ['agent'],
];

function isInspectionCommand(args) {
  return INSPECTION_PREFIXES.some(prefix =>
    prefix.every((tok, i) => args[i] === tok)
  );
}

/**
 * Normalise a caller-supplied argument list into a valid noninteractive
 * opencode run invocation.
 *
 * Accepted caller inputs:
 *   ['Reply with OK']                       → run invocation with prompt only
 *   ['run', 'Reply with OK']                → run already stated
 *   ['run', 'Reply with OK', '--agent', 'build']  → run with options
 *   ['debug', 'config']                     → returned unchanged
 *   ['agent', 'list']                       → returned unchanged
 *
 * Guarantees on output for run commands:
 *   • First element is 'run'
 *   • '--format', 'json' present exactly once
 *   • '--agent', agentOverride injected when provided and not already present
 *   • '--model', modelOverride injected when provided and not already present
 *   • Prompt is the non-option element after 'run'
 *
 * @param {string[]} promptArgs   Raw args from the scenario.
 * @param {string|null} agent     Agent override (null = no injection).
 * @param {string|null} model     Model override (null = no injection).
 * @returns {string[]}            Normalised argument array.
 */
export function normaliseArgs(promptArgs, agent = null, model = null) {
  if (isInspectionCommand(promptArgs)) {
    return promptArgs;
  }

  // Strip a leading 'run' if the caller supplied it
  let inner = promptArgs[0] === 'run' ? promptArgs.slice(1) : [...promptArgs];

  const hasFormatJson = inner.includes('--format');
  if (!hasFormatJson) {
    inner.push('--format', 'json');
  }

  if (agent && !inner.includes('--agent')) {
    inner.push('--agent', agent);
  }

  if (model && !inner.includes('--model')) {
    inner.push('--model', model);
  }

  return ['run', ...inner];
}

// ---------------------------------------------------------------------------
// Credential bridge
// ---------------------------------------------------------------------------

export function bridgeCredentials(requireModel, tempHome, overrideHome = null) {
  const secretsDir = path.join(tempHome, '.local/share/opencode/secrets');
  // Always read from the original host home, not from tempHome even after
  // the caller may have already overridden process.env.HOME.
  const realHome = overrideHome || process.env.HOME || os.homedir();
  const realKeyFile = path.join(realHome, '.local/share/opencode/secrets/9router-api-key');

  if (requireModel) {
    if (fs.existsSync(realKeyFile)) {
      const stats = fs.statSync(realKeyFile);
      if (stats.isFile() && !stats.isSymbolicLink() && stats.size > 0) {
        fs.mkdirSync(secretsDir, { recursive: true, mode: 0o700 });
        fs.copyFileSync(realKeyFile, path.join(secretsDir, '9router-api-key'));
        fs.chmodSync(path.join(secretsDir, '9router-api-key'), 0o600);
      }
    }
  } else {
    // For config-only discovery without real model execution,
    // create an empty placeholder so the {file:~/.local/share/opencode/secrets/9router-api-key}
    // reference in opencode.json resolves to a file (even if empty).
    fs.mkdirSync(secretsDir, { recursive: true, mode: 0o700 });
    fs.writeFileSync(path.join(secretsDir, '9router-api-key'), '');
    fs.chmodSync(path.join(secretsDir, '9router-api-key'), 0o600);
  }
}

// ---------------------------------------------------------------------------
// Harness installation helpers
// ---------------------------------------------------------------------------

function installHarness(repoRoot, tmpPkg, xdgConfigHome) {
  const packOut = execSync(
    'npm pack --ignore-scripts --pack-destination ' + tmpPkg,
    { cwd: repoRoot, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }
  );
  const tarballName = packOut.trim().split('\n').pop().trim();
  const tarballPath = path.join(tmpPkg, tarballName);

  execSync(`npm install --no-save ${tarballPath}`, { cwd: tmpPkg, stdio: 'ignore' });

  const installerPath = path.join(
    tmpPkg,
    'node_modules/@patrese/opencode-engineering-harness/bin/opencode-engineering-harness.js'
  );

  try {
    execSync(`node ${installerPath} install`, {
      env: { ...process.env, XDG_CONFIG_HOME: xdgConfigHome },
      stdio: 'pipe',
    });
  } catch (err) {
    throw new Error(
      `Installer install failed: ${err.message}\nStdout: ${err.stdout?.toString()}\nStderr: ${err.stderr?.toString()}`
    );
  }

  try {
    execSync(`node ${installerPath} check`, {
      env: { ...process.env, XDG_CONFIG_HOME: xdgConfigHome },
      stdio: 'pipe',
    });
  } catch (err) {
    throw new Error(
      `Installer check failed: ${err.message}\nStdout: ${err.stdout?.toString()}\nStderr: ${err.stderr?.toString()}`
    );
  }
}

// ---------------------------------------------------------------------------
// Main execution entry point
// ---------------------------------------------------------------------------

export async function executeOpenCode(context, fixtureDir, promptArgs, agent, requireModel = true) {
  const { opencodeInfo, repoRoot, createTempDir } = context;

  if (!opencodeInfo || !opencodeInfo.path) {
    throw new Error('OpenCode CLI not available');
  }

  // Capture the real host HOME before any override so the credential bridge
  // always reads from the original host path, not the temporary home.
  const originalHome = process.env.HOME;

  // Set up temporary environment
  const xdgConfigHome = createTempDir('eval-xdg-config-');
  // NOTE: Do NOT create a separate xdgDataHome temp dir.
  // OpenCode resolves {file:~/.local/share/opencode/secrets/...} using XDG_DATA_HOME
  // (defaulting to $HOME/.local/share when unset).  bridgeCredentials deposits the
  // key at tempHome/.local/share/opencode/secrets/9router-api-key, which is exactly
  // where OpenCode will look when HOME=tempHome and XDG_DATA_HOME is not overridden.
  // Overriding XDG_DATA_HOME to a fresh empty directory breaks credential resolution.
  const tempHome = createTempDir('eval-home-');
  const tmpPkg = createTempDir('eval-pkg-');

  // Ephemeral credential bridge — reads from originalHome, writes to tempHome
  bridgeCredentials(requireModel, tempHome, originalHome);

  // Pack and install the harness into the isolated XDG_CONFIG_HOME
  installHarness(repoRoot, tmpPkg, xdgConfigHome);

  // Normalise the argument list.
  // Inspection commands (debug, agent list) are passed through unchanged.
  // Run commands always receive --format json and any agent/model overrides.
  const args = normaliseArgs(promptArgs, agent, null);

  const env = {
    ...process.env,
    HOME: tempHome,
    XDG_CONFIG_HOME: xdgConfigHome,
    // XDG_DATA_HOME intentionally NOT overridden — see comment above.
    // With HOME=tempHome and no XDG_DATA_HOME override, OpenCode resolves
    // data paths to tempHome/.local/share which contains the bridged credential.
    OPENCODE_CONFIG_DIR: path.join(xdgConfigHome, 'opencode'),
  };

  return new Promise((resolve) => {
    // Use stdio: ['ignore', 'pipe', 'pipe'] to guarantee immediate EOF on stdin.
    // When stdin is a non-TTY pipe that is never closed, OpenCode may wait
    // indefinitely for additional input before proceeding.
    const child = spawn(opencodeInfo.path, args, {
      cwd: fixtureDir,
      env,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdoutData = '';
    let stderrData = '';
    const MAX_BYTES = 1024 * 1024; // 1 MiB cap per stream

    child.stdout.on('data', (data) => {
      if (stdoutData.length < MAX_BYTES) {
        stdoutData += data.toString();
      }
    });

    child.stderr.on('data', (data) => {
      if (stderrData.length < MAX_BYTES) {
        stderrData += data.toString();
      }
    });

    // Per-process timeout (90 s).
    // A timeout means only that the subprocess exceeded the evaluation deadline.
    // It does NOT independently prove provider outage, bad API key, or network failure.
    const TIMEOUT_MS = 90_000;
    const timeout = setTimeout(() => {
      child.kill('SIGKILL');
      resolve({
        status: 'BLOCKED',
        reason: 'OPENCODE SUBPROCESS TIMED OUT',
        output: stdoutData,
        error: stderrData,
        events: [],
      });
    }, TIMEOUT_MS);

    child.on('close', (code, signal) => {
      clearTimeout(timeout);

      const events = [];
      const lines = stdoutData.split('\n');
      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          events.push(JSON.parse(line));
        } catch (e) {
          // non-JSON lines (e.g. human-readable output) are ignored
        }
      }

      // Only classify specific provider failures when explicit evidence exists.
      // Do not infer provider failure from a timeout or from the absence of events.
      const allOut = (stdoutData + '\n' + stderrData).toLowerCase();

      let blockedReason = null;
      if (
        allOut.includes('401') ||
        allOut.includes('unauthorized') ||
        (allOut.includes('api key') && allOut.includes('invalid')) ||
        allOut.includes('bad file reference')
      ) {
        blockedReason = 'PROVIDER AUTHENTICATION FAILED';
      } else if (
        allOut.includes('econnrefused') ||
        allOut.includes('fetch failed') ||
        (allOut.includes('network error') && !allOut.includes('timeout'))
      ) {
        blockedReason = 'PROVIDER ENDPOINT UNAVAILABLE';
      } else if (
        allOut.includes('404') ||
        allOut.includes('model not found') ||
        allOut.includes('model unavailable')
      ) {
        blockedReason = 'CONFIGURED MODEL UNAVAILABLE';
      } else if (
        allOut.includes('429') ||
        allOut.includes('rate limit') ||
        allOut.includes('too many requests')
      ) {
        blockedReason = 'PROVIDER RATE LIMITED';
      }

      if (blockedReason) {
        resolve({
          status: 'BLOCKED',
          reason: blockedReason,
          output: stdoutData,
          error: stderrData,
          events,
          code,
          signal,
        });
        return;
      }

      resolve({
        status: 'SUCCESS',
        code,
        signal,
        output: stdoutData,
        error: stderrData,
        events,
      });
    });
  });
}

// ---------------------------------------------------------------------------
// Event parser
// ---------------------------------------------------------------------------
//
// OpenCode 1.17.8 --format json emits NDJSON events with these confirmed types:
//   step_start   — session begins; keys: type, timestamp, sessionID, part
//                  part.type === "step-start"
//   text         — assistant text response; keys: type, timestamp, sessionID, part
//                  part.type === "text", part.text === response content
//   tool_use     — tool/skill invocation; part.type === "tool", part.tool === tool name
//                  part.callID, part.state
//   tool_result  — tool result; part.type === "tool-result"
//   step_finish  — session ends; part.type === "step-finish"
//   error        — provider/runtime error; ev.error.name, ev.error.data.statusCode
//
// OBSERVABILITY GAP: Agent identity and model are NOT emitted in any event.
// The --format json stream does not carry agent_start, session_start, or
// similar events that expose which agent or model was selected. These fields
// will always be null and must be reported as INCONCLUSIVE.

export function parseEvents(events) {
  const observed = {
    // Agent and model are not observable in OpenCode 1.17.8 --format json.
    // They remain null; callers must report INCONCLUSIVE for these fields.
    agent: null,
    model: null,
    tools: [],
    skills: [],
    subagents: [],
    finalResponse: '',
    sessionStarted: false,
    sessionFinished: false,
    providerError: null,
  };

  for (const ev of events) {
    const t = ev.type;

    // Legacy event types (may appear in future versions or mocked tests)
    if (t === 'agent_start' || t === 'session_start') {
      if (ev.agent && !observed.agent) observed.agent = ev.agent;
      if (ev.model && !observed.model) observed.model = ev.model;
      observed.sessionStarted = true;

    // Real 1.17.8 types
    } else if (t === 'step_start') {
      observed.sessionStarted = true;

    } else if (t === 'step_finish') {
      observed.sessionFinished = true;

    } else if (t === 'text') {
      // part.text holds the assistant response content
      const text = ev.part?.text || ev.content || '';
      if (text) observed.finalResponse += text + '\n';

    } else if (t === 'tool_use') {
      // part.tool holds the tool name
      const toolName = ev.part?.tool || ev.tool || '';
      if (toolName) {
        observed.tools.push(toolName);
        if (toolName.startsWith('skill:')) {
          observed.skills.push(toolName);
        } else if (toolName === 'opencode_run' || toolName === 'delegate') {
          observed.subagents.push(ev.part?.args?.agent || ev.args?.agent || 'unknown');
        }
      }

    // Legacy tool_start (mocked tests)
    } else if (t === 'tool_start') {
      const toolName = ev.tool || '';
      if (toolName) {
        observed.tools.push(toolName);
        if (toolName.startsWith('skill:')) {
          observed.skills.push(toolName);
        } else if (toolName === 'opencode_run' || toolName === 'delegate') {
          observed.subagents.push(ev.args?.agent || 'unknown');
        }
      }

    // Legacy message types (mocked tests)
    } else if (t === 'message' || t === 'assistant_message') {
      observed.finalResponse += (ev.content || '') + '\n';

    } else if (t === 'error') {
      // Capture structured provider errors for upstream classification
      const status = ev.error?.data?.statusCode;
      const msg = ev.error?.data?.message || ev.error?.name || 'unknown error';
      observed.providerError = { status, message: msg, raw: ev.error };
    }
  }

  return observed;
}
