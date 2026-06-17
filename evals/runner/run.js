#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { execSync } from 'child_process';
import os from 'os';
import url from 'url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '../../');
const REPORTS_DIR = path.join(REPO_ROOT, 'evals/reports');

if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

function printUsage() {
  console.log(`
Usage: node evals/runner/run.js [options]

Options:
  --layer <layer>        Layer to run: 'deterministic', 'runtime', or 'all'
  --case <case_id>       Run a specific case (e.g., EVAL-001)
  --opencode-bin <path>  Path to the opencode executable
  --json                 Output results as JSON
  --help                 Show this help message
`);
}

function parseArgs() {
  const args = process.argv.slice(2);
  const config = {
    layer: null,
    caseId: null,
    opencodeBinArg: null,
    json: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--help') {
      printUsage();
      process.exit(0);
    } else if (arg === '--layer') {
      config.layer = args[++i];
    } else if (arg === '--case') {
      config.caseId = args[++i];
    } else if (arg === '--opencode-bin') {
      if (i + 1 >= args.length || args[i + 1].startsWith('--')) {
        console.error('Error: --opencode-bin requires a value');
        process.exit(4);
      }
      config.opencodeBinArg = args[++i];
    } else if (arg === '--json') {
      config.json = true;
    } else {
      console.error(`Unknown argument: ${arg}`);
      process.exit(4);
    }
  }

  if (!config.layer && !config.caseId) {
    console.error('Error: Must specify --layer or --case');
    printUsage();
    process.exit(4);
  }

  return config;
}

function resolveOpencodeBinary(opencodeBinArg) {
  let resolvedPath = null;
  let source = null;

  if (opencodeBinArg) {
    resolvedPath = path.resolve(opencodeBinArg);
    source = 'cli';
  } else if (process.env.OPENCODE_BIN) {
    resolvedPath = path.resolve(process.env.OPENCODE_BIN);
    source = 'environment';
  } else {
    try {
      const output = execSync('command -v opencode', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
      if (output && output.trim()) {
        resolvedPath = output.trim();
        source = 'path';
      }
    } catch (e) {
      // Not found in PATH
    }
  }

  if (resolvedPath) {
    if (!fs.existsSync(resolvedPath)) {
      console.error(`Error: OpenCode executable not found at resolved path: ${resolvedPath} (source: ${source})`);
      process.exit(4);
    }
    const stat = fs.statSync(resolvedPath);
    if (!stat.isFile() && !stat.isSymbolicLink()) {
      console.error(`Error: Resolved OpenCode path is not a regular file: ${resolvedPath} (source: ${source})`);
      process.exit(4);
    }
    try {
      fs.accessSync(resolvedPath, fs.constants.X_OK);
    } catch (e) {
      console.error(`Error: Resolved OpenCode file is not executable: ${resolvedPath} (source: ${source})`);
      process.exit(4);
    }
    
    try {
      const verOut = execSync(`"${resolvedPath}" --version`, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
      return { path: resolvedPath, source, version: verOut.trim() };
    } catch (e) {
      console.error(`Error: Failed to execute resolved OpenCode binary: ${resolvedPath}`);
      process.exit(4);
    }
  }

  return { path: null, source: null, version: null };
}

function createTempDir(prefix) {
  const tmpRoot = os.tmpdir();
  return fs.mkdtempSync(path.join(tmpRoot, prefix));
}

// -----------------------------------------------------------------------------
// Framework core
// -----------------------------------------------------------------------------

const SCENARIOS = [];

export function registerScenario(scenario) {
  SCENARIOS.push(scenario);
}

// Result definitions
export const PASS = 'PASS';
export const FAIL = 'FAIL';
export const BLOCKED = 'BLOCKED';
export const INCONCLUSIVE = 'INCONCLUSIVE';
export const SKIPPED = 'SKIPPED';

async function runScenario(scenario, context) {
  const result = {
    id: scenario.id,
    purpose: scenario.purpose,
    status: INCONCLUSIVE,
    reason: null,
    durationMs: 0,
    evidence: [],
  };

  const startTime = Date.now();
  let cleanupFns = [];

  try {
    const scenarioCtx = {
      ...context,
      createTempDir: (prefix) => {
        const dir = createTempDir(prefix);
        cleanupFns.push(() => {
          try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { /* ignore */ }
        });
        return dir;
      },
      addEvidence: (ev) => result.evidence.push(ev),
    };

    const runResult = await scenario.run(scenarioCtx);
    result.status = runResult.status;
    if (runResult.reason) result.reason = runResult.reason;
    if (runResult.evidence) result.evidence.push(...runResult.evidence);

  } catch (err) {
    result.status = FAIL;
    result.reason = `Unhandled exception: ${err.message}`;
    result.evidence.push(err.stack);
  } finally {
    result.durationMs = Date.now() - startTime;
    for (const fn of cleanupFns) {
      fn();
    }
  }

  return result;
}

// -----------------------------------------------------------------------------
// Preflight and Main
// -----------------------------------------------------------------------------

async function main() {
  const config = parseArgs();

  // Load scenarios
  const casesDir = path.join(__dirname, '../cases');
  if (fs.existsSync(casesDir)) {
    const files = fs.readdirSync(casesDir).filter(f => f.endsWith('.js'));
    for (const file of files) {
      await import(url.pathToFileURL(path.join(casesDir, file)).href);
    }
  }

  const opencodeInfo = resolveOpencodeBinary(config.opencodeBinArg);

  // Preflight
  const context = {
    opencodeInfo,
    repoRoot: REPO_ROOT,
  };

  if (!config.json) {
    console.log('--- Runtime Evaluation Preflight ---');
    if (opencodeInfo.path) {
      console.log(`OpenCode Version: ${opencodeInfo.version}`);
      console.log(`Resolution Source: ${opencodeInfo.source}`);
      console.log(`Executable Path: ${opencodeInfo.path}`);
    } else {
      console.log(`OpenCode Version: BLOCKED — OPENCODE EXECUTABLE NOT FOUND`);
    }
    console.log('------------------------------------');
  }

  let scenariosToRun = SCENARIOS;
  if (config.caseId) {
    scenariosToRun = scenariosToRun.filter(s => s.id === config.caseId);
  } else if (config.layer === 'deterministic') {
    scenariosToRun = scenariosToRun.filter(s => s.layer === 'deterministic');
  } else if (config.layer === 'runtime') {
    scenariosToRun = scenariosToRun.filter(s => s.layer === 'runtime');
  }

  if (scenariosToRun.length === 0) {
    console.error('No scenarios matched the filters.');
    process.exit(4);
  }

  const results = [];
  const counts = { PASS: 0, FAIL: 0, BLOCKED: 0, INCONCLUSIVE: 0, SKIPPED: 0 };

  for (const scenario of scenariosToRun) {
    if (!config.json) {
      process.stdout.write(`Running ${scenario.id} (${scenario.layer})... `);
    }

    const res = await runScenario(scenario, context);
    results.push(res);
    counts[res.status]++;

    if (!config.json) {
      console.log(`[${res.status}]`);
      if (res.reason) {
        console.log(`  -> ${res.reason}`);
      }
    }
  }

  // Generate Report
  const report = {
    timestamp: new Date().toISOString(),
    opencodeInfo,
    counts,
    results,
  };

  fs.writeFileSync(
    path.join(REPORTS_DIR, 'latest-summary.json'),
    JSON.stringify(report, null, 2)
  );

  let harnessStatus = "READY FOR REVIEW";
  if (counts.FAIL > 0) {
    harnessStatus = "FAIL";
  } else if (!opencodeInfo.path) {
    harnessStatus = "BLOCKED";
  } else if (counts.BLOCKED > 0) {
    harnessStatus = "BLOCKED";
  }

  const mdReport = `
# Runtime Evaluation Summary
**Timestamp:** ${report.timestamp}
**OpenCode Version:** ${opencodeInfo.version || 'BLOCKED — OPENCODE EXECUTABLE NOT FOUND'}
**Resolution Source:** ${opencodeInfo.source || 'N/A'}
**HARNESS-009 Status:** ${harnessStatus}

${!opencodeInfo.path ? `
Deterministic installation: verified.
OpenCode behavioral runtime: not evaluated.
` : ''}

## Counts
- PASS: ${counts.PASS}
- FAIL: ${counts.FAIL}
- BLOCKED: ${counts.BLOCKED}
- INCONCLUSIVE: ${counts.INCONCLUSIVE}
- SKIPPED: ${counts.SKIPPED}

## Results
${results.map(r => `### ${r.id}: ${r.status}\n**Purpose:** ${r.purpose}\n${r.reason ? `**Reason:** ${r.reason}\n` : ''}${r.evidence.length ? `**Evidence:**\n${r.evidence.map(e => '- ' + e).join('\n')}` : ''}`).join('\n\n')}
  `.trim();

  fs.writeFileSync(
    path.join(REPORTS_DIR, 'latest-summary.md'),
    mdReport
  );

  if (config.json) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log('--- Evaluation Summary ---');
    console.log(`PASS: ${counts.PASS}, FAIL: ${counts.FAIL}, BLOCKED: ${counts.BLOCKED}, INCONCLUSIVE: ${counts.INCONCLUSIVE}, SKIPPED: ${counts.SKIPPED}`);
    console.log(`Detailed report saved to evals/reports/latest-summary.json`);
  }

  // Exit Semantics:
  // 0 = all selected scenarios PASS or intentionally SKIPPED
  // 1 = one or more FAIL
  // 2 = one or more BLOCKED and no FAIL
  // 3 = one or more INCONCLUSIVE and no FAIL or BLOCKED
  // 4 = invalid invocation or evaluation infrastructure failure
  
  if (counts.FAIL > 0) {
    process.exit(1);
  } else if (counts.BLOCKED > 0) {
    process.exit(2);
  } else if (counts.INCONCLUSIVE > 0) {
    process.exit(3);
  } else {
    process.exit(0);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(4);
});
