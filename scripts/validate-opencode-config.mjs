import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const EXPECTED = {
  leaders: 9,
  subagents: 29,
  total: 38,
};

const expectedLeaders = [
  'trust-lead', 'product-lead', 'architecture-lead',
  'engineering-lead', 'quality-lead', 'review-lead',
  'devops-lead', 'delivery-lead', 'knowledge-lead'
];

function parseJsonc(text) {
  // Try JSON first (faster, avoids corrupting URLs with //)
  try { return JSON.parse(text); } catch {}
  // Fallback: strip JSONC comments — only // at line start (after whitespace)
  const stripped = text
    .replace(/^\s*\/\/.*$/gm, '')
    .replace(/^\s*\/\*[\s\S]*?\*\//gm, '');
  return JSON.parse(stripped);
}

function main() {
  let pass = true;
  const fail = (msg) => { console.error(`  ❌ ${msg}`); pass = false; };
  const ok = (msg) => console.log(`  ✅ ${msg}`);

  console.log('\n=== validate-opencode-config.mjs ===\n');

  // 1. opencode.jsonc exists and parseable
  const configPath = resolve(root, 'opencode.jsonc');
  if (!existsSync(configPath)) { fail('opencode.jsonc not found'); process.exit(1); }

  let config;
  try {
    const raw = readFileSync(configPath, 'utf8');
    config = parseJsonc(raw);
    ok('opencode.jsonc exists and is valid JSONC');
  } catch (e) {
    fail(`opencode.jsonc parse error: ${e.message}`);
    process.exit(1);
  }

  // 2. No wildcard "*": "allow"
  const raw2 = readFileSync(configPath, 'utf8');
  if (/"\*"\s*:\s*"allow"/.test(raw2)) {
    fail('Found wildcard "*": "allow" in opencode.jsonc');
  } else {
    ok('No wildcard "*": "allow" found');
  }

  // 3. Count leaders
  const agents = config.agent || {};
  const leaders = Object.entries(agents).filter(([, v]) => v.mode === 'primary');
  if (leaders.length === EXPECTED.leaders) {
    ok(`Leaders: ${leaders.length} (expected ${EXPECTED.leaders})`);
  } else {
    fail(`Leaders: ${leaders.length} (expected ${EXPECTED.leaders})`);
  }

  // 4. Count subagents
  const subagents = Object.entries(agents).filter(([, v]) => v.mode === 'subagent');
  if (subagents.length === EXPECTED.subagents) {
    ok(`Subagents: ${subagents.length} (expected ${EXPECTED.subagents})`);
  } else {
    fail(`Subagents: ${subagents.length} (expected ${EXPECTED.subagents})`);
  }

  // 5. Total agents
  const total = leaders.length + subagents.length;
  if (total === EXPECTED.total) {
    ok(`Total agents: ${total} (expected ${EXPECTED.total})`);
  } else {
    fail(`Total agents: ${total} (expected ${EXPECTED.total})`);
  }

  // 6. Subagents have task disabled
  const taskIssues = subagents.filter(([, v]) => {
    const p = v.permission || {};
    return p.task !== 'deny' && p.task !== false;
  });
  if (taskIssues.length === 0) {
    ok('All subagents have task disabled');
  } else {
    fail(`Subagents with task not disabled: ${taskIssues.map(([n]) => n).join(', ')}`);
  }

  // 7. Leaders match expected set
  const foundLeaders = leaders.map(([n]) => n);
  const missing = expectedLeaders.filter(l => !foundLeaders.includes(l));
  if (missing.length === 0) {
    ok('All expected leaders present');
  } else {
    fail(`Missing leaders: ${missing.join(', ')}`);
  }

  // 8. No private/lib names
  const patterns = [/Barsa/, /biblioteca/, /\/srv\/docs\/biblioteca/, /10_NUCLEO_/, /11_NUCLEO_/, /12_NUCLEO_/, /13_NUCLEO_/];
  let banned = false;
  for (const [name, agent] of Object.entries(agents)) {
    const raw = JSON.stringify(agent);
    for (const p of patterns) {
      if (p.test(raw)) { fail(`Private/lib name in agent "${name}"`); banned = true; break; }
    }
  }
  if (!banned) ok('No private/internal library names');

  console.log(`\nResult: ${pass ? '✅ ALL CHECKS PASSED' : '❌ SOME CHECKS FAILED'}`);
  process.exit(pass ? 0 : 1);
}

main();
