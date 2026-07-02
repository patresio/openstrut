# Design 009 — Cowork and Git Worktree Orchestration

## Decision

Create a cowork model before allowing broad parallel agent work.

Recommended first artifact: a skill named `team-cowork-orchestration` (`SK28`) rather than a new coordinating agent. A skill is enough because cowork is a procedure: ownership, handoff, worktree rules, and review checkpoints. A new agent can be added later only if the skill proves insufficient.

## Why

Barsa research indicates multi-agent coordination increases complexity and needs explicit task flow, communication, dependencies, and validation. In engineering repositories, uncontrolled parallel work creates merge conflicts, hidden scope expansion, and lost ownership.

## Cowork Modes

### Sequential cowork

Default and safest.

One agent works, produces an artifact, next agent consumes it.

Use for:

- specification;
- architecture review;
- security review;
- implementation handoff.

### Review cowork

A reviewer checks an artifact without mutation.

Use for:

- final diff review;
- architecture review;
- security review;
- project rules audit.

### Consult cowork

A domain specialist answers a bounded question.

Use for:

- API contract concern;
- UX concern;
- RAG retrieval concern;
- SRE concern.

### Worktree cowork

Multiple implementation tracks happen in isolated Git worktrees.

Use only when:

- tasks are independent;
- file ownership is non-overlapping;
- each worktree has a branch;
- merge order is explicit;
- review and validation occur before integration.

## When Not to Use Worktrees

Do not use worktrees when:

- change is small;
- files overlap;
- implementation order is tightly coupled;
- task can be done in one diff;
- user did not approve branch/worktree creation.

## Worktree Protocol

Before creating worktrees:

1. inspect `git status`, current branch, remotes, and worktrees;
2. record pre-existing changes;
3. define base branch;
4. assign branch name per track;
5. assign file ownership per track;
6. define merge order;
7. define cleanup criteria.

Example branch naming:

```text
work/<task-id>-api
work/<task-id>-ui
work/<task-id>-docs
```

Example worktree paths:

```text
../<repo-name>-<task-id>-api
../<repo-name>-<task-id>-ui
```

## Ownership Matrix

Every cowork plan must define:

| Track | Owner | Agent/skill | Files | Branch | Validation |
|---|---|---|---|---|---|
| spec | sdd | engineering-sdd-change | openspec/** | current | docs review |
| backend | build | api-data-design | src/api/** | work/T-api | npm test |
| review | code-reviewer | engineering-code-review | read-only | none | diff review |

## `SK28 team-cowork-orchestration`

### Purpose

Coordinate human/agent teamwork with explicit ownership, handoffs, and optional Git worktrees.

### Trigger

Use when:

- multiple agents are useful;
- work may split into independent tracks;
- user requests cowork/team workflow;
- a large change risks file conflicts;
- sequential specialist review is needed.

### Inputs

- objective;
- approved scope;
- affected files/boundaries;
- candidate agents;
- dependencies;
- validation commands;
- delivery target;
- risk tolerance.

### Outputs

- cowork mode;
- agent sequence;
- file ownership;
- worktree strategy;
- handoff contract;
- merge order;
- validation matrix;
- stop conditions.

### Procedure

1. classify work as sequential, review, consult, or worktree cowork;
2. map dependencies;
3. assign one owner per output;
4. prevent overlapping file ownership;
5. define handoff artifacts;
6. define validation per track;
7. define integration order;
8. record in task plan;
9. ask approval before Git worktree mutation.

### Limits

- never create worktrees without explicit approval;
- never allow concurrent edits to same files;
- never merge a track without review/validation;
- never use cowork to bypass Approval Gate;
- never let a domain specialist mutate code directly unless explicitly designed and approved.

## Agent or Skill?

Start with skill.

Create `AG16 team-workflow-coordinator` only if:

- `SK28` becomes too large for current-agent context;
- worktree orchestration needs independent read-only audit;
- recurrent workflows need a separate coordinator with strict permissions.

## Recommended Workflow

`team-cowork-worktree`:

1. `build` loads `team-cowork-orchestration`;
2. `project-rules-auditor` checks repo constraints;
3. relevant domain specialist(s) provide read-only advice;
4. user approves worktree plan;
5. `build` creates worktrees/branches;
6. each track runs focused implementation;
7. `code-reviewer` reviews integration diff;
8. `engineering-delivery` handles commit/push/PR if approved.

## Validation

Cowork/worktree support requires tests for:

- overlapping file ownership rejection;
- missing branch/worktree cleanup rules;
- invalid handoff dependency;
- sequential order determinism;
- no worktree creation in dry-run;
- Git state preservation.
