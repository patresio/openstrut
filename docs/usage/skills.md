# Skills

Skills are reusable engineering procedures loaded on demand. They are not agents and should not be copied into projects manually.

## Current Engineering Skills

### `engineering-bdd-discovery`

Purpose: clarify business outcomes, journeys, rules, state transitions, and acceptance criteria through examples.

Use when:

- business behavior is unclear;
- requirements need Given/When/Then examples;
- user journeys or state transitions matter.

Output: concrete examples, rules, edge cases, and acceptance criteria.

### `engineering-code-review`

Purpose: orchestrate independent review of an approved implementation diff.

Use when:

- implementation is done;
- validation evidence exists;
- delivery is being prepared.

Output: review findings, blockers, accepted risks, and validation gaps.

### `engineering-delivery`

Purpose: finalize approved work through review, archive, commit, push, and pull request steps.

Use when:

- implementation is complete;
- validation passed;
- user explicitly authorizes delivery actions.

Output: factual delivery report with commit, push, and PR evidence when applicable.

### `engineering-incident-triage`

Purpose: diagnose, contain, and recover from urgent failures using evidence and minimal safe action.

Use when:

- production or local service is failing;
- urgent diagnosis is needed;
- rollback or containment may be required.

Output: symptoms, hypotheses, evidence, containment, recovery path, and blocker status.

### `engineering-legacy-change`

Purpose: change untested or fragile legacy behavior safely.

Use when:

- code lacks tests;
- refactoring risk is high;
- characterization tests or seams are needed.

Output: characterization strategy, seams, safe increments, and validation plan.

### `engineering-project-bootstrap`

Purpose: initialize or refresh project-local engineering instructions without duplicating global rules.

Use when:

- preparing SIGA, Base11, HealthVault, or another real project;
- creating project-local `AGENTS.md`;
- documenting project-specific commands and boundaries.

Output: proposed project-local rules and safe bootstrap plan.

### `engineering-sdd-change`

Purpose: define technical specification for a new feature or change before implementation.

Use when:

- a change needs OpenSpec proposal/tasks/specs;
- business rules need documented acceptance criteria;
- implementation should not start yet.

Output: OpenSpec change files and Approval Gate.

### `engineering-task-plan`

Purpose: maintain the repository-local execution ledger for approved mutating work.

Use when:

- a task is approved and about to mutate files;
- work needs state, evidence, and next-action tracking;
- resuming interrupted work.

Output: `.opencode/task-plans/<task-id>.md` with current state and evidence.

### `engineering-tdd-first`

Purpose: apply RED-GREEN-REFACTOR to new behavior and bug fixes.

Use when:

- executable behavior changes;
- regression fixes need reproduction;
- test-first workflow is practical.

Output: RED evidence, GREEN evidence, and refactor safety notes.

## Skill Selection Rule

Use the smallest skill that fits the task. Do not load all skills by default.

## Barsa-Aware Usage

When a skill needs books, official docs, or curated operational knowledge:

1. identify the relevant collection, context, or bundle;
2. query Barsa MCP for focused evidence;
3. cite the retrieved source conceptually;
4. avoid injecting broad unrelated context.
