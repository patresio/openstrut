# Skills

This page documents the global engineering skills shipped by the harness and explains what happened to the domain-skill catalog from `mapa_operacional.xlsx`.

## Source Status

`mapa_operacional.xlsx` was transformed into reviewed Barsa-facing summaries under `docs/barsa/`.

- `docs/barsa/skills.md` records 18 proposed domain-skill contracts from sheet `03_SKILLS`, plus 13 harness-global engineering skills now mirrored into the spreadsheet as `SK19`–`SK31`.
- `docs/barsa/agents.md` records 12 proposed domain-agent contracts from sheet `04_AGENTS`, plus 5 harness-global agents mirrored as `AG13`–`AG17`.
- `docs/barsa/operational-map.md` records the routing layers and recommended pilot path.

The original domain skills were **not** installed as harness-global runtime skills. The current global skills are engineering workflow skills only. They are now present in the spreadsheet for catalog completeness. Domain skills remain curated backlog until they have explicit runtime contracts and evaluated need.

## What Is a Skill in This Harness?

A skill is a reusable procedure loaded on demand into the current agent context.

A skill is **not**:

- a subagent with separate permissions;
- an always-loaded prompt;
- a project-local instruction file;
- a domain-expert persona by itself.

A skill is best when:

- procedure matters more than autonomy;
- no second conversation is needed;
- permission model should stay with the current agent;
- the task benefits from a reliable sequence.

## Current Global Engineering Skills

The harness currently ships 13 global engineering skills in `global/skills/`:

- `engineering-bdd-discovery`
- `engineering-code-review`
- `engineering-delivery`
- `engineering-documentation`
- `engineering-incident-triage`
- `engineering-legacy-change`
- `engineering-project-bootstrap`
- `engineering-sdd-change`
- `engineering-task-plan`
- `engineering-tdd-first`
- `harness-generation`
- `team-cowork-orchestration`
- `worktree-lifecycle-management`

## Detailed Skill Reference

### `engineering-bdd-discovery`

**Location:** `global/skills/engineering-bdd-discovery/SKILL.md`

**Purpose:** clarify business outcomes, journeys, rules, state transitions, and acceptance criteria through concrete examples.

**Use when:**

- requirements are ambiguous;
- user journeys matter more than internals;
- state transitions or authorization rules are easy to misunderstand;
- Given/When/Then examples would make scope testable.

**Expected outputs:**

- business rules;
- domain terminology clarification;
- happy path and edge-case examples;
- acceptance criteria;
- scenario coverage candidates.

**Do not use when:**

- task is purely technical refactoring with no behavior change;
- behavior is already specified and clear;
- implementation has already started and no discovery gap remains.

**Barsa usage:** query Barsa MCP when examples need official product/domain docs or curated operational references.

### `engineering-code-review`

**Location:** `global/skills/engineering-code-review/SKILL.md`

**Purpose:** orchestrate an independent review of an approved implementation diff before delivery.

**Use when:**

- implementation is complete;
- validation evidence exists;
- delivery is being prepared;
- you want a standard review workflow before commit/push/PR.

**Expected outputs:**

- findings by severity;
- validation gaps;
- risks accepted or unresolved;
- review summary that can gate delivery.

**Typical interaction:** often paired with `code-reviewer` subagent for actual independent review while the current agent keeps overall workflow state.

### `engineering-delivery`

**Location:** `global/skills/engineering-delivery/SKILL.md`

**Purpose:** finalize approved work through review, archive, commit, push, and PR actions.

**Use when:**

- implementation and validation are complete;
- user explicitly authorized Git and delivery actions;
- repository requires structured finalization.

**Expected outputs:**

- final delivery checklist;
- commit/push/PR evidence when applicable;
- factual summary of what was shipped.

**Hard limits:** must not bypass review, validation, or explicit user approval for Git mutations.

### `engineering-incident-triage`

**Location:** `global/skills/engineering-incident-triage/SKILL.md`

**Purpose:** diagnose, contain, and recover from urgent failures using evidence, minimal safe action, and rollback awareness.

**Use when:**

- service is failing;
- incident diagnosis is urgent;
- recovery or containment needs a disciplined sequence;
- repeated retries would risk loops or destructive action.

**Expected outputs:**

- symptoms;
- hypotheses;
- evidence gathered;
- containment status;
- next safe action;
- blocker or recovery path.

**Key value:** keeps urgent work evidence-based and prevents random retries.

### `engineering-legacy-change`

**Location:** `global/skills/engineering-legacy-change/SKILL.md`

**Purpose:** change untested or fragile legacy behavior safely using characterization tests, seams, and narrow changes.

**Use when:**

- code lacks reliable tests;
- wide rewrites would be risky;
- change must preserve old behavior except for a narrow fix;
- you need seams before implementation.

**Expected outputs:**

- characterization strategy;
- seam candidates;
- safe microincrements;
- validation plan.

**Key rule:** preserve behavior first; change second.

### `engineering-project-bootstrap`

**Location:** `global/skills/engineering-project-bootstrap/SKILL.md`

**Purpose:** initialize or refresh project-local engineering instructions without duplicating global rules.

**Use when:**

- onboarding a real project into the harness;
- creating or fixing project-local `AGENTS.md`;
- recording project-specific commands, boundaries, and architecture;
- refreshing stale project-local rules from evidence.

**Expected outputs:**

- project-local rule structure;
- authoritative commands with evidence;
- gaps between repository reality and project instructions;
- safe bootstrap plan.

**Typical pair:** works well with `project-rules-auditor`.

### `engineering-sdd-change`

**Location:** `global/skills/engineering-sdd-change/SKILL.md`

**Purpose:** define the technical specification of a new feature or change before implementation begins.

**Primary workflow:**

1. discover project rules, architecture, existing specs, tests, and references;
2. establish domain vocabulary and invariants;
3. define scope, exclusions, dependencies, and risks;
4. draft OpenSpec change artifacts;
5. add verifiable examples;
6. define test strategy;
7. decompose into TDD-ready tasks;
8. call `project-rules-auditor`;
9. apply a consolidated revision;
10. stop at Approval Gate.

**Required outputs:**

- `proposal.md`;
- `tasks.md`;
- `specs/<capability>/spec.md`;
- optional `design.md` only when complexity requires it.

**Current Barsa note:** this skill still contains older direct reference-directory discovery text. Project policy now says Barsa MCP is canonical retrieval boundary for books, official docs, and curated operational knowledge. When using the skill, prefer Barsa retrieval and record the logical source used.

### `engineering-task-plan`

**Location:** `global/skills/engineering-task-plan/SKILL.md`

**Purpose:** maintain the repository-local execution ledger for approved mutating work.

**Use when:**

- a plan is approved;
- file mutation is about to begin;
- work must be resumed after interruption;
- progress, evidence, and next action need a stable ledger.

**Procedure focus:**

- create/adopt one task plan;
- record approved scope and exclusions;
- map each action to ordered microincrements;
- maintain one current state and one next action;
- record evidence before marking progress;
- stop and mark blocked when safe continuation is impossible.

**Output:** `.opencode/task-plans/<task-id>.md`

**Key value:** preserves execution truth across long-running sessions.

### `engineering-tdd-first`

**Location:** `global/skills/engineering-tdd-first/SKILL.md`

**Purpose:** apply RED-GREEN-REFACTOR to new behavior and bug fixes.

**Use when:**

- executable behavior changes;
- bugfix needs a regression test first;
- characterizing old behavior before change is practical;
- the team wants explicit RED/GREEN evidence.

**Expected outputs:**

- RED evidence;
- GREEN evidence;
- refactor safety conditions;
- exceptions when TDD is not applicable.

**Key rule:** no production behavior change before a valid RED state exists.

### `team-cowork-orchestration`

**Location:** `global/skills/team-cowork-orchestration/SKILL.md`

**Purpose:** coordinate human and agent teamwork with explicit ownership, handoffs, and optional Git worktree strategy.

**Use when:**

- multiple agents are useful;
- work may split into independent tracks;
- file ownership and handoffs must be explicit;
- user asks for cowork/team workflow;
- git worktree might reduce conflict risk.

**Expected outputs:**

- cowork mode;
- ownership matrix;
- handoff contract;
- optional worktree plan;
- validation matrix;
- stop conditions.

**Key rule:** no worktree, branch, merge, or concurrent file edit without explicit approval and recorded ownership.

### `engineering-documentation`

**Location:** `global/skills/engineering-documentation/SKILL.md`

**Purpose:** generate project documentation — docs/, PRD, ADR, AGENTS.md, specifications, runbooks, collaboration protocols.

**Use when:**

- a project needs structured documentation from scratch;
- ADRs or PRDs need writing or updating;
- AGENTS.md needs generation from project evidence;
- specifications, runbooks, or protocol docs are needed.

**Expected outputs:**

- ADR, PRD, AGENTS.md, specs, runbooks, protocol docs;
- complete documentation tree under `docs/`.

**Barsa usage:** queries all three Barsa collections — `documentation` for templates/examples, `technology` for stack alignment, `personal` for context.

### `harness-generation`

**Location:** `global/skills/harness-generation/SKILL.md`

**Purpose:** analyze a project's stack (package.json, framework, tests, deploy) and personal context (Obsidian, PARA, GTD, methodology, self-assessment), then generate custom agents, skills, workflows, and inventory entries for the engineering harness.

**Use when:**

- bootstrapping a new project into the harness;
- generating custom agents/skills/workflows tailored to a project;
- auditing existing harness artifacts against project evidence.

**Expected outputs:**

- proposed `global/agents/`, `global/skills/`, `workflows/` entries;
- `src/installer/inventory.js` update;
- documented in an OpenSpec change proposal for approval.

**Barsa usage:** queries `technology` (stack analysis), `personal` (methodology/context), and `documentation` (templates and ADR patterns).

### `worktree-lifecycle-management`

**Location:** `global/skills/worktree-lifecycle-management/SKILL.md`

**Purpose:** manage the full lifecycle of Git worktrees: create isolated working directories for parallel agent work, coordinate merges in dependency order, validate integration, and clean up.

**Use when:**

- `team-cowork-orchestration` (SK28) has determined worktrees are justified;
- parallel agent work needs file-level isolation;
- a merge sequence with dependency ordering is required;
- worktree branches need cleanup after merge.

**Expected outputs:**

- created worktrees and branches;
- merged integration branch;
- cleaned up worktree artifacts;
- evidence log of the full lifecycle.

**Key rule:** never create worktrees without explicit approval; never exceed 3 simultaneous worktrees; keep branches short-lived (< 1 day).

**Barsa usage:** queries `documentation` and `technology` for official Git docs and curated engineering references on worktree strategy, merge policy, and cleanup.

## Skill Selection Rule

Use the smallest skill that fits the task. Do not load all skills by default.

Good examples:

- ambiguous user journey → `engineering-bdd-discovery`
- approved implementation starting now → `engineering-task-plan`
- behavior change → `engineering-tdd-first`
- untested legacy code → `engineering-legacy-change`
- preparing OpenSpec → `engineering-sdd-change`
- generating project docs → `engineering-documentation`
- bootstrapping harness artifacts → `harness-generation`
- final delivery after explicit approval → `engineering-delivery`
- git worktree isolation needed → `worktree-lifecycle-management`

## Domain Skills from `mapa_operacional.xlsx`

The spreadsheet defines 18 domain-skill contracts. They are cataloged in `docs/barsa/skills.md` and now materialized for global runtime installation.

| ID | Skill | Current status | Focus |
|---|---|---|---|
| SK01 | `knowledge-system-design` | global-runtime | knowledge systems and retrieval structure |
| SK02 | `learning-plan-design` | global-runtime | learning plans and evidence of mastery |
| SK03 | `personal-execution-system` | global-runtime | routine, WIP limits, hyperfocus-aware execution |
| SK04 | `financial-organization` | global-runtime | finance organization and decision rules |
| SK05 | `product-discovery` | global-runtime | hypothesis, MVP, experiments, metrics |
| SK06 | `leadership-feedback` | global-runtime | feedback, expectations, agreements |
| SK07 | `career-positioning` | global-runtime | narrative, CV, interviews, communication |
| SK08 | `architecture-decision` | global-runtime | ADRs and architecture trade-offs |
| SK09 | `domain-modeling` | global-runtime | vocabulary, invariants, bounded contexts |
| SK10 | `distributed-systems-review` | global-runtime | consistency, failure, recovery, observability |
| SK11 | `api-data-design` | global-runtime | contracts, schemas, data design |
| SK12 | `devops-sre-diagnostics` | global-runtime | incidents, pipelines, SLOs, rollback |
| SK13 | `frontend-ux-review` | global-runtime | UX heuristics, forms, accessibility |
| SK14 | `code-refactoring` | global-runtime | incremental refactoring |
| SK15 | `security-review` | global-runtime | threats, controls, validation |
| SK16 | `testing-strategy` | global-runtime | risk-based testing strategy |
| SK17 | `rag-agent-design` | global-runtime (pilot-priority) | RAG, MCP, agents, retrieval, evaluation |
| SK18 | `health-planning` | global-runtime | health research organization and practical planning |

## Materialization Rule

Do not promote a domain skill from `docs/barsa/skills.md` into `global/skills/` until it has:

1. approved runtime contract;
2. clear trigger and output shape;
3. Barsa source policy;
4. tests/evals;
5. limits and safety rules;
6. clear proof of recurring need.

## Barsa-Aware Usage

When a global engineering skill needs books, official docs, or curated operational knowledge:

1. identify the relevant collection, context, or bundle;
2. query Barsa MCP for focused evidence;
3. cite the retrieved source conceptually in the working artifact when needed;
4. avoid injecting broad unrelated context;
5. do not reference local library filesystem paths as runtime instructions.

## Current Recommendation

Keep global runtime skills engineering-focused and small.

Use Barsa catalog skills as design backlog, not as installed runtime prompts, until a focused pilot is approved. Best next pilot remains `SK17 rag-agent-design`, ideally paired with `AG11 ai-rag-agent-architect` for MCP/RAG work.
