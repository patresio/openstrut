# Skills

This page documents the active OpenTrust runtime skills and explains what happened to the older broader skill catalog from `mapa_operacional.xlsx`.

## Source Status

`mapa_operacional.xlsx` is now provenance only. Its reviewed outcomes should live in Markdown under `global/context/` and supporting documentation under `docs/`.

- `global/context/skills/*.md` records semantic `SK##` mappings.
- `docs/barsa/skills.md` remains historical catalog material.
- `docs/barsa/agents.md` remains historical catalog material.
- `docs/barsa/operational-map.md` remains historical routing context.

Only the installed runtime skills under `global/skills/*/SKILL.md` are executable runtime skills. Semantic `SK##` maps do not imply installed executable skills.

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

## Current Global Skills

The harness currently ships 12 runtime skills in `global/skills/`, all `opentrust-*`:

- `opentrust-task-contract`
- `opentrust-tdd`
- `opentrust-spec-change`
- `opentrust-spec-anchored`
- `opentrust-review`
- `opentrust-delivery`
- `opentrust-observability`
- `opentrust-reference-research`
- `opentrust-grilling`
- `opentrust-domain-modeling`
- `opentrust-handoff`
- `opentrust-diagnose`

The older broader catalog (39 `engineering-*` and domain skills) is archived under `archive/global/skills/` and remains catalog-only — those entries are not installed as runtime skills.

## Detailed Skill Reference

### `opentrust-task-contract`

**Location:** `global/skills/opentrust-task-contract/SKILL.md`

**Purpose:** create or refine task contracts using `docs/opencode/TASK_CONTRACT.md`, including Retrieval Context selectors when needed.

**Use when:**

- a task needs a formal contract between teams;
- scope, acceptance criteria, or retrieval selectors must be explicit;
- a contract needs refinement before approval.

**Expected outputs:**

- task contract with objective, acceptance criteria, scope, retrieval context, and definition of done.

### `opentrust-tdd`

**Location:** `global/skills/opentrust-tdd/SKILL.md`

**Purpose:** seams-first TDD — agree test boundaries, then RED-GREEN-REFACTOR.

**Use when:**

- executable behavior changes;
- a bugfix needs a regression test first;
- test boundaries are unclear and need agreement before writing tests.

**Expected outputs:**

- agreed seams and test boundaries;
- RED evidence;
- GREEN evidence;
- refactor safety conditions.

### `opentrust-spec-change`

**Location:** `global/skills/opentrust-spec-change/SKILL.md`

**Purpose:** guide structured spec and design changes using Explore → Propose before Apply.

**Use when:**

- a feature or design change needs a spec first;
- the change is non-trivial and benefits from an approval gate;
- OpenSpec change artifacts are required.

**Expected outputs:**

- proposal, tasks, and spec artifacts;
- approval gate evidence.

### `opentrust-spec-anchored`

**Location:** `global/skills/opentrust-spec-anchored/SKILL.md`

**Purpose:** spec-anchored audit gate — the spec stays true because the machine audits it via exit code, not because the agent promised.

**Use when:**

- specifying a feature;
- auditing an implementation against a spec;
- checking "what has no test";
- verifying before calling it done.

**Expected outputs:**

- findings from `openstrut audit`;
- exit-code gate verdict (0 = aligned, 1 = findings);
- annotated tests `@spec:AC-xxx`.

### `opentrust-review`

**Location:** `global/skills/opentrust-review/SKILL.md`

**Purpose:** two-axis review — Standards + Spec — approve or block with evidence.

**Use when:**

- an implementation diff is ready for review before delivery;
- validation evidence must be checked against acceptance criteria;
- a gate decision (approve/block) is needed.

**Expected outputs:**

- findings by axis (standards, spec);
- approve or block decision with evidence.

### `opentrust-delivery`

**Location:** `global/skills/opentrust-delivery/SKILL.md`

**Purpose:** prepare commit, push, and pull request using Conventional Commits in English; avoid unrelated files.

**Use when:**

- implementation and validation are complete;
- the user explicitly authorized Git and delivery actions;
- a commit/PR needs a scoped, conventional message.

**Expected outputs:**

- scoped commit(s) with conventional messages;
- PR body with scope, validation, risks, and limitations.

### `opentrust-observability`

**Location:** `global/skills/opentrust-observability/SKILL.md`

**Purpose:** require execution reports, validation evidence, and operational notes; do not implement external telemetry yet.

**Use when:**

- work must produce evidence artifacts;
- session logs, task plans, or retrieval audits need structure;
- operational notes are required for handoff.

**Expected outputs:**

- execution reports;
- validation evidence;
- operational notes.

### `opentrust-reference-research`

**Location:** `global/skills/opentrust-reference-research/SKILL.md`

**Purpose:** use Operational Retrieval Map selectors; request synthesis only; no raw chunks in output or commits.

**Use when:**

- domain knowledge is needed through the selector catalog;
- retrieval synthesis must be cited by source ID;
- external research must be written back into Markdown before operational use.

**Expected outputs:**

- synthesized summaries with source IDs;
- no raw chunks or library paths in versioned files.

### `opentrust-grilling`

**Location:** `global/skills/opentrust-grilling/SKILL.md`

**Purpose:** one-question-at-a-time interview that exhausts the decision tree before implementation begins; prevents misalignment.

**Use when:**

- a non-trivial change is about to start;
- requirements or scope are ambiguous;
- the #1 failure mode (misalignment) must be prevented.

**Expected outputs:**

- clarified requirements and decisions;
- aligned scope before implementation.

### `opentrust-domain-modeling`

**Location:** `global/skills/opentrust-domain-modeling/SKILL.md`

**Purpose:** maintain a living glossary (`GLOSSARY.md`) as the single source of truth for domain language when terminology is fuzzy or evolving.

**Use when:**

- project terminology is inconsistent;
- domain concepts need explicit definitions;
- a shared vocabulary is required across teams.

**Expected outputs:**

- living glossary entries;
- clarified domain terminology.

### `opentrust-handoff`

**Location:** `global/skills/opentrust-handoff/SKILL.md`

**Purpose:** produce a compact handoff document capturing everything needed to resume work in a new session or by another agent.

**Use when:**

- a conversation must continue in a new session;
- context window limits or session end require a handoff;
- another agent takes over the work.

**Expected outputs:**

- compact handoff document with objective, state, evidence, and next action.

### `opentrust-diagnose`

**Location:** `global/skills/opentrust-diagnose/SKILL.md`

**Purpose:** 6-phase disciplined approach for hard bugs, performance regressions, and mysterious failures — build evidence before theorizing.

**Use when:**

- a bug is hard to reproduce or understand;
- performance regressions need diagnosis;
- repeated retries would risk loops or destructive action.

**Expected outputs:**

- symptoms, hypotheses, and evidence;
- containment status and next safe action;
- blocker or recovery path.

## Skill Selection Rule

Use the smallest skill that fits the task. Do not load all skills by default.

Good examples:

- ambiguous requirements before a non-trivial change → `opentrust-grilling`
- formal task contract needed → `opentrust-task-contract`
- behavior change → `opentrust-tdd`
- spec/design change before implementation → `opentrust-spec-change`
- auditing implementation against a spec / verifying before done → `opentrust-spec-anchored`
- review gate before delivery → `opentrust-review`
- final delivery after explicit approval → `opentrust-delivery`
- evidence and operational notes required → `opentrust-observability`
- selector-based research needed → `opentrust-reference-research`
- fuzzy domain terminology → `opentrust-domain-modeling`
- resuming work in a new session → `opentrust-handoff`
- hard bug or performance regression → `opentrust-diagnose`

## Domain Skills from `mapa_operacional.xlsx`

The spreadsheet defined domain-skill contracts that are now represented as semantic catalog entries. They are not automatically materialized as executable runtime skills.

| ID | Skill | Current status | Focus |
|---|---|---|---|
| SK01 | `knowledge-system-design` | catalog-only | knowledge systems and retrieval structure |
| SK02 | `learning-plan-design` | catalog-only | learning plans and evidence of mastery |
| SK03 | `personal-execution-system` | catalog-only | routine, WIP limits, hyperfocus-aware execution |
| SK04 | `financial-organization` | catalog-only | finance organization and decision rules |
| SK05 | `product-discovery` | catalog-only | hypothesis, MVP, experiments, metrics |
| SK06 | `leadership-feedback` | catalog-only | feedback, expectations, agreements |
| SK07 | `career-positioning` | catalog-only | narrative, CV, interviews, communication |
| SK08 | `architecture-decision` | catalog-only | ADRs and architecture trade-offs |
| SK09 | `domain-modeling` | catalog-only | vocabulary, invariants, bounded contexts |
| SK10 | `distributed-systems-review` | catalog-only | consistency, failure, recovery, observability |
| SK11 | `api-data-design` | catalog-only | contracts, schemas, data design |
| SK12 | `devops-sre-diagnostics` | catalog-only | incidents, pipelines, SLOs, rollback |
| SK13 | `frontend-ux-review` | catalog-only | UX heuristics, forms, accessibility |
| SK14 | `code-refactoring` | catalog-only | incremental refactoring |
| SK15 | `security-review` | catalog-only | threats, controls, validation |
| SK16 | `testing-strategy` | catalog-only | risk-based testing strategy |
| SK17 | `rag-agent-design` | catalog-only (pilot-priority) | RAG, MCP, agents, retrieval, evaluation |
| SK18 | `health-planning` | catalog-only | health research organization and practical planning |

## Materialization Rule

Do not promote a domain skill from `docs/barsa/skills.md` into `global/skills/` until it has:

1. approved runtime contract;
2. clear trigger and output shape;
3. local catalog policy;
4. tests/evals;
5. limits and safety rules;
6. clear proof of recurring need.

## Catalog-Aware Usage

When a global engineering skill needs domain or documentation context:

1. identify the relevant local selector, bundle, or doc map;
2. use the local catalog and repository evidence first;
3. record any durable external extraction back into Markdown before operational reuse;
4. avoid injecting broad unrelated context;
5. do not reference local library filesystem paths as runtime instructions.

## Current Recommendation

Keep global runtime skills engineering-focused and small.

Use catalog skill maps as design backlog, not as installed runtime prompts, until a focused pilot is approved. Best next pilot remains `SK17 rag-agent-design`, paired with a named runtime agent only if a future implementation is approved.
