import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const expectedLeaders = [
  'trust-lead', 'product-lead', 'architecture-lead',
  'engineering-lead', 'quality-lead', 'review-lead',
  'devops-lead', 'delivery-lead', 'knowledge-lead'
];

const expectedSubagents = [
  // Phase 4A (10 created)
  'coordination-facilitator', 'meeting-scribe', 'decision-logger',
  'product-discovery', 'requirements-analyzer', 'story-slicer',
  'architecture-decision-designer', 'domain-modeler', 'api-database-designer',
  'distributed-systems-reviewer',
  // Phase 4B-1 (9 created)
  'feature-implementer', 'code-refactoring-specialist', 'performance-engineer',
  'security-reviewer', 'privacy-reviewer',
  'tdd-engineer', 'integration-tester', 'testing-strategy-designer',
  'ux-accessibility-reviewer',
  // Phase 4B-1 preserved legacy (2)
  // code-reviewer (preserved)
  // compliance-auditor (preserved)
  // Phase 4B-2 (7 created)
  'ci-cd-infrastructure-engineer', 'observability-designer', 'incident-triage-specialist',
  'changelog-writer',
  'context-historian', 'reference-librarian', 'documentation-skill-creator',
  // Phase 4B-2 preserved legacy (1)
  // release-manager (preserved)
];

const preservedLegacy = ['code-reviewer', 'compliance-auditor', 'release-manager'];

function main() {
  let pass = true;
  const fail = (msg) => { console.error(`  ❌ ${msg}`); pass = false; };
  const ok = (msg) => console.log(`  ✅ ${msg}`);

  console.log('\n=== validate-opentrust-taxonomy.mjs ===\n');

  // 1. Foundation docs exist
  const requiredDocs = [
    'docs/opencode/TEAM_TOPOLOGY.md',
    'docs/opencode/WORKFLOW.md',
    'docs/opencode/TASK_CONTRACT.md',
    'docs/opencode/OPERATIONAL_RETRIEVAL_MAP.md',
  ];
  for (const doc of requiredDocs) {
    const full = resolve(root, doc);
    existsSync(full) ? ok(`Doc exists: ${doc}`) : fail(`Missing: ${doc}`);
  }

  // 2. All 9 leaders in global/agents/
  const agentDir = resolve(root, 'global/agents');
  for (const lead of expectedLeaders) {
    const f = resolve(agentDir, `${lead}.md`);
    existsSync(f) ? ok(`Leader agent: ${lead}.md`) : fail(`Missing leader: ${lead}.md`);
  }

  // 3. All 29 subagents (created + preserved legacy)
  for (const sub of expectedSubagents) {
    const f = resolve(agentDir, `${sub}.md`);
    existsSync(f) ? ok(`Subagent: ${sub}.md`) : fail(`Missing subagent: ${sub}.md`);
  }
  // Preserved legacy
  for (const legacy of preservedLegacy) {
    const f = resolve(agentDir, `${legacy}.md`);
    existsSync(f) ? ok(`Preserved legacy subagent: ${legacy}.md`) : fail(`Missing preserved legacy: ${legacy}.md`);
  }

  // 4. Count leaders + subagents in directory
  let leaderCount = 0, subagentCount = 0;
  if (existsSync(agentDir)) {
    const files = readdirSync(agentDir).filter(f => f.endsWith('.md'));
    for (const f of files) {
      const name = f.replace(/\.md$/, '');
      if (expectedLeaders.includes(name)) leaderCount++;
      else if (expectedSubagents.includes(name) || preservedLegacy.includes(name)) subagentCount++;
    }
  }
  if (leaderCount === 9) {
    ok(`Leader files in dir: ${leaderCount}`);
  } else {
    fail(`Leader files: ${leaderCount} (expected 9)`);
  }
  if (subagentCount === 29) {
    ok(`Subagent files in dir: ${subagentCount}`);
  } else {
    fail(`Subagent files: ${subagentCount} (expected 29)`);
  }

  // 5. Global commands
  const cmdDir = resolve(root, 'global/commands');
  const otCommands = existsSync(cmdDir)
    ? readdirSync(cmdDir).filter(f => f.startsWith('ot-') && f.endsWith('.md'))
    : [];
  if (otCommands.length === 7) {
    ok(`ot-* commands: ${otCommands.length}`);
  } else {
    fail(`ot-* commands: ${otCommands.length} (expected 7)`);
  }

  // 6. OpenTrust skills
  const skillDir = resolve(root, 'global/skills');
  const otSkills = existsSync(skillDir)
    ? readdirSync(skillDir).filter(f => f.startsWith('opentrust-'))
    : [];
  if (otSkills.length === 7) {
    ok(`opentrust-* skills: ${otSkills.length}`);
  } else {
    fail(`opentrust-* skills: ${otSkills.length} (expected 7)`);
  }

  // 7. No untracked HARNESS task plans
  const tpDir = resolve(root, '.opencode/task-plans');
  if (existsSync(tpDir)) {
    const tps = readdirSync(tpDir).filter(f => f.startsWith('HARNESS-'));
    const untracked = tps.filter(f => f.startsWith('HARNESS-033'));
    if (untracked.length === 0) {
      ok('No HARNESS task plans in directory');
    } else {
      fail(`HARNESS task plans found: ${untracked.join(', ')}`);
    }
  }

  // 8. No raw chunks/book patterns in new OpenTrust files
  const bannedPatterns = [/Barsa/, /biblioteca/, /\/srv\/docs\/biblioteca/, /10_NUCLEO_/];
  const pathsToCheck = [
    ...requiredDocs,
    ...expectedLeaders.map(l => `global/agents/${l}.md`),
    ...expectedSubagents.map(s => `global/agents/${s}.md`),
    ...otCommands.map(c => `global/commands/${c}`),
    ...otSkills.map(s => `global/skills/${s}/SKILL.md`),
  ];
  let foundBanned = false;
  for (const rel of pathsToCheck) {
    const full = resolve(root, rel);
    if (!existsSync(full)) continue;
    const content = readFileSync(full, 'utf8');
    for (const p of bannedPatterns) {
      if (p.test(content)) {
        fail(`Banned pattern in ${rel}`);
        foundBanned = true;
        break;
      }
    }
  }
  if (!foundBanned) ok('No banned raw content patterns');

  // 9. CTX/SK/B/DOC selectors used consistently in new OpenTrust files
  let selectorIssues = 0;
  for (const rel of pathsToCheck) {
    const full = resolve(root, rel);
    if (!existsSync(full)) continue;
    const content = readFileSync(full, 'utf8');
    // Check that if Reference Profile exists, it uses selectors
    if (content.includes('## Reference Profile')) {
      if (!/CTX\d+/.test(content)) {
        fail(`${rel}: Reference Profile missing CTX selectors`);
        selectorIssues++;
      }
      if (!/SK\d+/.test(content) && !/B\d+/.test(content) && !/DOC_/.test(content)) {
        fail(`${rel}: Reference Profile missing selectors (SK/B/DOC)`);
        selectorIssues++;
      }
    }
  }
  if (selectorIssues === 0) ok('Selectors used consistently across new files');

  console.log(`\nResult: ${pass ? '✅ ALL CHECKS PASSED' : '❌ SOME CHECKS FAILED'}`);
  process.exit(pass ? 0 : 1);
}

main();
