# Agents

This page documents agents available after installing the harness and explains what happened to the domain-agent designs from `mapa_operacional.xlsx`.

## Source Status

`mapa_operacional.xlsx` was processed into reviewed Barsa documentation under `docs/barsa/`:

- `docs/barsa/agents.md` records 12 proposed domain-agent designs from sheet `04_AGENTS`, plus 9 harness-global agents now mirrored into the spreadsheet as `AG13`–`AG21`.
- `docs/barsa/skills.md` records 26 domain-skill contracts from sheet `03_SKILLS`, plus 13 harness-global engineering skills mirrored into the spreadsheet as `SK19`–`SK31`.
- `docs/barsa/operational-map.md` records the operational map summary: 236 books, 16 official doc sets, 32 contexts, 39 skills, 21 agents, 24 bundles, and 12 project profiles.

The original domain catalog is now materialized for global runtime installation. Runtime prompts must use Barsa MCP logical routing keys—collection, context, bundle, project profile, skill ID, or agent ID—instead of filesystem source paths.

## Current Runtime Agents

OpenCode provides two native primary agents:

- `build` — default implementation agent with mutation capability.
- `plan` — read-only planning and exploration agent.

The harness currently ships 21 managed agents in `global/agents/`:

- 9 harness process/generation agents: `sdd`, `code-reviewer`, `project-rules-auditor`, `documentation-generator`, `harness-generator`, `skill-creator`, `performance-optimizer`, `release-manager`, `compliance-auditor`
- 12 Barsa-backed domain specialist agents: `AG01`–`AG12`

## Native OpenCode Agents

### `build`

**Type:** native primary agent.

**Purpose:** implementation, validation, review coordination, and delivery execution after approval.

**Use when:**

- a plan has been approved;
- repository mutation is explicitly in scope;
- tests, lint, typecheck, package validation, or Git delivery actions are needed;
- a task needs integration across files and tools.

**Do not use when:**

- user only asked for exploration or planning;
- no Approval Gate has been passed;
- action would discard user work;
- package publish, push, branch deletion, or destructive Git action lacks explicit approval.

**Expected behavior:**

1. inspect applicable instructions and Git state;
2. preserve pre-existing changes;
3. create or update a task plan for mutating work;
4. follow TDD-first for executable behavior;
5. run authoritative validation;
6. perform final diff review;
7. report only observed facts.

**Barsa usage:** query Barsa MCP for official docs, curated operational knowledge, or book-backed principles only when needed for the task. Keep retrieval focused.

### `plan`

**Type:** native primary agent.

**Purpose:** read-only discovery, analysis, proposal, and planning.

**Use when:**

- exploring a repository;
- preparing a proposal;
- evaluating architecture or conventions;
- deciding scope before mutation;
- answering design questions from evidence.

**Do not use when:**

- edits are required;
- commits or pushes are requested;
- package installation or file mutation must happen;
- a task already passed into build execution.

**Expected output:** facts, assumptions, risks, proposed plan, open questions, and approval request when mutation is needed.

**Barsa usage:** ideal for Barsa-backed discovery because it keeps retrieval read-only and can compare operational-map proposals against shipped harness artifacts.

## Harness-Managed Agents

### `sdd`

**File:** `global/agents/sdd.md`

**Type:** primary agent.

**Mode:** `primary`

**Model:** `9router/combo-main`

**Purpose:** Specification-Driven Development. Converts informal requests into verifiable technical specifications before implementation.

**Core responsibilities:**

1. understand user objective and project domain;
2. inspect project rules, architecture, and existing specs;
3. define scope, exclusions, constraints, risks, and acceptance criteria;
4. create or update OpenSpec change artifacts;
5. decompose work into TDD-ready microincrements;
6. call `project-rules-auditor` to audit the draft;
7. consolidate findings;
8. stop at Approval Gate.

**Allowed writes:**

- `openspec/changes/**`
- `specs/**`
- `docs/**`
- `.opencode/task-plans/**`

**Denied actions:**

- production code implementation;
- dependency changes;
- migrations;
- commits, pushes, PRs, deploys;
- calling mutative subagents;
- passing the Approval Gate.

**Allowed skill:** `engineering-sdd-change`

**Allowed delegated agents:**

- `explore`
- `project-rules-auditor`
- `scout` with approval

**Typical trigger:**

```text
/eng-spec-change <objective>
```

**Output contract:**

- OpenSpec proposal;
- task breakdown;
- capability spec;
- optional design document;
- final response ending exactly with:

```text
Approval Gate: aguardando aprovação da change antes do handoff para build.
```

**Barsa usage:** use Barsa MCP for official docs, domain references, and curated operational context. Do not reference local library paths in generated specs except as ingestion provenance already documented in `docs/barsa/`.

### `code-reviewer`

**File:** `global/agents/code-reviewer.md`

**Type:** subagent.

**Mode:** `subagent`

**Model:** `9router/combo-main`

**Purpose:** independent read-only review of an approved implementation diff before archive, commit, push, or PR.

**Use when:**

- implementation is complete;
- focused validation evidence exists;
- final delivery needs an independent check;
- changes touch security, migrations, dependencies, public contracts, or broad behavior.

**Required inputs/evidence:**

- approved scope and acceptance criteria;
- active task plan, when present;
- full Git diff;
- test and validation evidence;
- project-local instructions;
- separation of pre-existing changes from task changes.

**Review priorities:**

1. correctness and regressions;
2. approved scope compliance;
3. weakened or misleading tests;
4. security and privacy;
5. contracts, schemas, migrations, compatibility;
6. dependency and lockfile changes;
7. legacy behavior preservation;
8. error paths and edge cases;
9. documentation/spec synchronization;
10. unrelated formatting or accidental edits.

**Permissions:**

- edit: denied;
- task delegation: denied;
- external directories: denied;
- Git read-only commands allowed (`git status`, `git diff`, `git log`, `git show`, etc.).

**Output contract:**

- findings ordered by severity;
- exact file and line references when possible;
- evidence, impact, and minimal correction;
- explicit no-material-findings statement when clean;
- no generic praise.

**Barsa usage:** only when review requires official docs or curated policy evidence. Retrieval must remain narrow and read-only.

### `project-rules-auditor`

**File:** `global/agents/project-rules-auditor.md`

**Type:** subagent.

**Mode:** `subagent`

**Model:** `opencode/deepseek-v4-flash-free`

**Purpose:** read-only audit of project-local engineering rules, architecture, conventions, authoritative commands, and gaps in local `AGENTS.md`.

**Use when:**

- initializing a project for harness use;
- refreshing stale project-local instructions;
- checking conflicts between `AGENTS.md`, `CONTRIBUTING.md`, README, architecture docs, and executable commands;
- auditing SDD draft consistency against project rules.

**Required inspection:**

- repository structure;
- root/nested instruction files;
- `AGENTS.md`;
- `CONTRIBUTING.md`;
- README files;
- package manifests;
- task runners;
- CI workflows;
- tests;
- architecture docs;
- ADRs/OpenSpec;
- deployment/runbook files;
- domain language;
- security/data-handling rules;
- branch, commit, review, and delivery conventions.

**Permissions:**

- edit: denied;
- task delegation: denied;
- external directories: denied;
- Git read-only commands allowed.

**Output contract:**

- observed facts;
- conflicts and ambiguities;
- global rules that must not be duplicated;
- project-local rules to add;
- obsolete rules to remove/correct;
- proposed local `AGENTS.md` structure;
- authoritative commands with evidence locations;
- unresolved questions needing user approval.

**Barsa usage:** use Barsa only to verify harness conventions or official OpenCode behavior. Do not invent project-local stack rules from Barsa sources.

### `documentation-generator`

**File:** `global/agents/documentation-generator.md`

**Type:** subagent.

**Mode:** `subagent`

**Model:** `opencode/deepseek-v4-flash-free`

**Purpose:** generate technical documentation — docs/, PRD, ADR, AGENTS.md, specifications, runbooks, and collaboration protocols.

**Use when:**

- a project needs structured documentation from scratch;
- ADRs or PRDs need to be written or updated;
- AGENTS.md needs generation from project evidence;
- specifications or runbooks are required;
- cowork or XP protocol documentation is needed.

**Allowed skill list:** `engineering-documentation`, `engineering-code-review`, `engineering-sdd-change`, `engineering-task-plan`, `engineering-tdd-first`, `security-review`

**Allowed delegated agents:** `explore`, `project-rules-auditor`

**Permissions:**

- edit: denied (read-only);
- task delegation: denied;
- Git read-only commands allowed.

**Barsa usage:** queries all three Barsa collections — `documentation` for templates/examples, `technology` for stack docs, `personal` for context alignment.

**Output contract:** ADR, PRD, AGENTS.md, specs, runbooks, protocol docs — all written to the repository destinations specified by the task.

### `harness-generator`

**File:** `global/agents/harness-generator.md`

**Type:** subagent.

**Mode:** `subagent`

**Model:** `opencode/deepseek-v4-flash-free`

**Purpose:** analyze a project's tech stack, context, and personal methodology, then generate custom agents, skills, workflows, and inventory entries for the engineering harness.

**Use when:**

- bootstrapping a new project into the harness;
- generating custom agents/skills/workflows tailored to a project;
- auditing existing harness artifacts against project evidence.

**Allowed skill list:** `harness-generation`, `engineering-project-bootstrap`, `engineering-code-review`, `engineering-sdd-change`, `engineering-task-plan`, `engineering-documentation`, `team-cowork-orchestration`, `personal-execution-system`

**Allowed delegated agents:** `explore`, `project-rules-auditor`, `documentation-generator`

**Permissions:**

- edit: denied (read-only);
- task delegation: denied;
- Git read-only commands allowed.

**Barsa usage:** accesses `technology` (stack analysis), `personal` (methodology/context alignment), and `documentation` (templates and ADR patterns).

**Output contract:** proposed `global/agents/`, `global/skills/`, `workflows/`, and `src/installer/inventory.js` entries; documented in OpenSpec change proposal for approval.

## Domain Agents from `mapa_operacional.xlsx`

These 12 domain-agent designs are now materialized as global runtime agent files:

| ID | Agent | Current status | Intended domain |
|---|---|---|---|
| AG01 | `knowledge-system-designer` | global-runtime | knowledge systems, Obsidian, RAG library |
| AG02 | `personal-operating-system-advisor` | global-runtime | routine, execution, habits, cognitive adaptation |
| AG03 | `business-product-strategist` | global-runtime | product, business, finance, small-team operations |
| AG04 | `career-communication-advisor` | global-runtime | career narrative, interviews, communication |
| AG05 | `software-architect` | global-runtime | architecture, DDD, distributed systems |
| AG06 | `backend-data-reviewer` | global-runtime | APIs, backend, data modeling, database review |
| AG07 | `devops-sre-advisor` | global-runtime | delivery, reliability, observability, production diagnosis |
| AG08 | `code-quality-testing-reviewer` | global-runtime | refactoring, legacy, testing, quality |
| AG09 | `security-infrastructure-reviewer` | global-runtime | application security, infrastructure, hardening |
| AG10 | `frontend-ux-reviewer` | global-runtime | UX, frontend, forms, design systems |
| AG11 | `ai-rag-agent-architect` | global-runtime (pilot-priority) | RAG, MCP, agents, tools, evaluation |
| AG12 | `health-exercise-nutrition-researcher` | global-runtime | health research organization, exercise, nutrition limits |

## Materialization Rule

Do not move a domain agent from `docs/barsa/agents.md` into `global/agents/` until it has:

1. approved runtime contract;
2. explicit Barsa source policy;
3. permission model;
4. eval cases;
5. safety limits;
6. clear trigger/use case;
7. demonstrated recurring need in real workflow.

## Current Recommendation

Keep current global runtime agents focused:

- `sdd` for specs;
- `project-rules-auditor` for read-only project rules audits;
- `code-reviewer` for read-only implementation review;
- `documentation-generator` for documentation generation;
- `harness-generator` for project harness bootstrapping.

Use Barsa-backed domain agents as design backlog until a focused pilot is approved. Best pilot remains `AG11 ai-rag-agent-architect` paired with `SK17 rag-agent-design` for MCP/RAG work.
