# Agents

This page documents the agents available after installing the harness.

## Native OpenCode Agents

### `build`

Purpose: default implementation agent.

Use when:

- implementing approved changes;
- editing files after an Approval Gate;
- running validation;
- coordinating review and delivery.

Do not use for:

- read-only exploration that has not reached approval;
- speculative implementation;
- destructive Git or system actions without explicit approval.

How to trigger:

- default interactive OpenCode agent;
- switch to it from `plan` when approved for mutation.

### `plan`

Purpose: read-only planning and exploration agent.

Use when:

- exploring unfamiliar repositories;
- creating proposals;
- auditing rules and docs;
- planning without mutation.

Do not use for:

- edits;
- installs;
- commits;
- release creation.

How to trigger:

- switch to the native `plan` agent in OpenCode.

## Harness-Managed Agents

### `sdd`

Purpose: Specification-Driven Development agent for turning informal requests into approved OpenSpec changes.

Use when:

- a request needs scope, acceptance criteria, and task decomposition before code;
- a feature or behavior change should start with OpenSpec;
- business rules, invariants, and BDD examples need discovery.

How to trigger:

```text
/eng-spec-change <objective>
```

Main workflow:

1. inspect project rules and architecture;
2. load `engineering-sdd-change`;
3. create or update OpenSpec artifacts;
4. request audit from `project-rules-auditor`;
5. consolidate findings;
6. stop at the Approval Gate.

Output contract:

- proposal;
- tasks;
- specs;
- optional design;
- final response ending with the Approval Gate message.

Limits:

- must not implement production code;
- must not call `build`;
- must not pass the Approval Gate.

### `code-reviewer`

Purpose: read-only independent review of an approved implementation diff before delivery.

Use when:

- implementation is complete;
- focused validation has evidence;
- a diff needs review for scope, tests, security, contracts, migrations, dependencies, and regressions.

How to trigger:

- from `build`, delegate to `code-reviewer` for read-only review;
- or use workflow commands that perform review.

Required inputs:

- approved scope;
- active task plan;
- complete diff;
- validation evidence;
- project rules.

Output contract:

- findings ordered by severity;
- file and line references;
- evidence, impact, and minimal correction;
- explicit statement when no material findings exist.

Limits:

- no edits;
- no commits;
- no scope redefinition;
- no generic praise.

### `project-rules-auditor`

Purpose: read-only audit of project-local engineering rules, architecture, conventions, and command evidence.

Use when:

- initializing a real project for the harness;
- refreshing stale project rules;
- checking if `AGENTS.md` is missing, duplicated, or outdated;
- validating project-local commands and architecture boundaries.

How to trigger:

```text
/eng-init-project <context>
```

or delegate directly during SDD/project bootstrap workflows.

Required inspection:

- `AGENTS.md`;
- `CONTRIBUTING.md`;
- README files;
- package manifests;
- tests and task runners;
- CI workflows;
- architecture docs;
- OpenSpec;
- runbooks.

Output contract:

- observed facts;
- conflicts and ambiguities;
- commands with evidence;
- project-local rules to add;
- unresolved questions.

Limits:

- no mutation;
- no invented stack or commands;
- no copying global rules into local project docs.
