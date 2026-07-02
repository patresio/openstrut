# Design 009 — Cowork and Git Worktree Orchestration

## Decision

Create a cowork model before allowing broad parallel agent work.

Recommended first artifact: a skill named `team-cowork-orchestration` (`SK28`)
rather than a new coordinating agent. A skill is enough because cowork is a
procedure: ownership, handoff, worktree rules, and review checkpoints. A new
agent can be added later only if the skill proves insufficient.

As of HARNESS-015, a dedicated `worktree-lifecycle-management` skill (SK31) has
been created to separate technical worktree operations from agent/people
coordination. SK28 handles coordination; SK31 handles the git worktree lifecycle.

## Why

Barsa research indicates multi-agent coordination increases complexity and needs
explicit task flow, communication, dependencies, and validation. In engineering
repositories, uncontrolled parallel work creates merge conflicts, hidden scope
expansion, and lost ownership.

Additional sources consulted:
- **Hermes Agent** (Nous Research): definitive reference for multi-agent
  parallel execution with git worktrees — manual worktree creation, automatic
  `-w` mode` isolated checkouts, per-worktree checkpoint/rollback.
- **DevOps Handbook** (Kim et al.): branching isolation vs merge complexity.
- **Accelerate** (Forsgren et al.): fewer than 3 branches, short lifetimes.
- **Building Microservices** (Newman): delayed integration cost, feature flags.

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
- review and validation occur before integration;
- track count is ≤ 3;
- expected lifetime < 1 working day.

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
6. define merge order (topological);
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
|---|---|---|---|---|---|---|
| spec | sdd | engineering-sdd-change | openspec/** | current | docs review |
| backend | build | api-data-design | src/api/** | work/T-api | npm test |
| review | code-reviewer | engineering-code-review | read-only | none | diff review |

## `SK28 team-cowork-orchestration`

### Purpose

Coordinate human/agent teamwork with explicit ownership, handoffs, and
optional Git worktrees. Delegates technical worktree operations to SK31.

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
- rollback strategy;
- stop conditions.

### Procedure (15 steps in 4 phases)

Phase 1 — Classify and Plan:
1. classify work as sequential, review, consult, or worktree cowork;
2. map dependencies;
3. assign one owner per output;
4. prevent overlapping file ownership;
5. decide if worktrees are justified.

Phase 2 — Worktree Preparation:
6. define worktree plan (branches, paths, base, merge order, cleanup);
7. load SK31 for technical worktree operations;
8. assign agents to worktrees;
9. record plan in Task Plan.

Phase 3 — Validation and Approval:
10. define validation per track and integration;
11. define rollback strategy;
12. ask approval before Git worktree mutation.

Phase 4 — Post-Merge Review:
13. run integration validation;
14. route to code-reviewer;
15. route to delivery if approved.

### Limits

- never create worktrees without explicit approval;
- never allow concurrent edits to same files;
- never merge a track without review/validation;
- never use cowork to bypass Approval Gate;
- never let a domain specialist mutate code directly unless explicitly
  designed and approved;
- never exceed 3 simultaneous worktrees;
- never leave stale worktrees.

## `SK31 worktree-lifecycle-management`

### Purpose

Handle the technical Git worktree lifecycle: create, delegate, merge, validate,
cleanup. Separated from SK28 to keep coordination and technical concerns
independent.

### Procedure (22 steps in 6 phases)

Phase 1 — Inspect and Plan (steps 1–6)
Phase 2 — Create Worktrees (steps 7–9)
Phase 3 — Delegate and Monitor (steps 10–12)
Phase 4 — Merge Coordination (steps 13–16)
Phase 5 — Validate (steps 17–19)
Phase 6 — Cleanup (steps 20–22)

See `global/skills/worktree-lifecycle-management/SKILL.md` for full procedure.

### Limits

- never create worktrees without explicit approval;
- never force-push to worktree branches;
- never merge without review and validation;
- never leave stale worktrees;
- never exceed 3 simultaneous worktrees;
- keep worktree branches short-lived (< 1 day).

## Agent or Skill?

Start with skill.

Create `AG16 team-workflow-coordinator` only if:

- `SK28` becomes too large for current-agent context;
- worktree orchestration needs independent read-only audit;
- recurrent workflows need a separate coordinator with strict permissions.

As of HARNESS-015, SK28 is supplemented by SK31 (worktree-lifecycle-management)
rather than replaced by a new agent. If the two-skill pattern proves too complex
for a single agent context, a coordinating agent remains an option.

## Recommended Workflows

### `team-cowork-worktree`

1. `build` loads `team-cowork-orchestration` + `worktree-lifecycle-management`;
2. `project-rules-auditor` checks repo constraints;
3. relevant domain specialist(s) provide read-only advice;
4. user approves worktree plan;
5. `build` creates worktrees/branches (via SK31);
6. each track runs focused implementation;
7. `build` merges tracks in dependency order;
8. `build` validates integration;
9. `code-reviewer` reviews integration diff;
10. `build` cleans up worktrees.

### `full-harness-orchestration`

For end-to-end harness generation with parallel tracks:

1. `harness-generator` analyzes project + personal context;
2. `build` plans cowork/worktree split;
3. `software-architect` provides architecture constraints;
4. user approves worktree plan;
5. `build` creates worktrees;
6. tracks run in parallel: agents, skills, workflows;
7. `build` merges in order (agents → skills → workflows);
8. `documentation-generator` updates docs;
9. `project-rules-auditor` checks consistency;
10. `code-reviewer` reviews final diff.

## Validation

Cowork/worktree support requires tests for:

- overlapping file ownership rejection;
- missing branch/worktree cleanup rules;
- invalid handoff dependency;
- sequential order determinism;
- no worktree creation in dry-run;
- Git state preservation.
