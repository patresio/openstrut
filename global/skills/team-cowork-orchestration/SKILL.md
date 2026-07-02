---
name: team-cowork-orchestration
description: Coordinate human and agent teamwork with explicit ownership, handoffs, and safe git worktree strategy when approved.
compatibility: opencode
x-harness:
  skill_id: SK28
  status: active
  source_type: harness-global
  source_policy:
    collection: documentation; technology
    contexts: [CTX23, CTX25, CTX27, CTX20]
    bundles: []
  usable_by_agents: [build, AG05, AG06, AG07, AG08, AG11, AG14, AG15]
---

# Skill: team-cowork-orchestration

## Purpose
Coordinate work across humans and agents without losing ownership, evidence, or Git safety.

## When to Load
- Work needs multiple agents or domain specialists.
- Work may split into independent tracks.
- User asks for cowork/team workflow.
- Git worktree might reduce conflicts.
- Review, implementation, and delivery need separate owners.

## Do Not Load When
- Task is small enough for one agent and one diff.
- Files overlap heavily.
- No Approval Gate has been reached for mutating work.
- User has not approved Git branch/worktree mutation.

## Required Inputs
- Objective.
- Approved scope and exclusions.
- Candidate agents/skills.
- Affected files or boundaries.
- Dependencies between tracks.
- Validation commands.
- Delivery target.

## Barsa Retrieval Policy
Use Barsa MCP for official docs and curated engineering references when designing cowork, testing, delivery, or worktree strategy.

Use logical routing keys only:

- collection: `documentation` or `technology`
- contexts: `CTX23`, `CTX25`, `CTX27`, `CTX20`

Do not reference local library filesystem paths.

## Procedure
1. Classify cowork mode: sequential, review, consult, or worktree.
2. Map dependencies and required handoffs.
3. Assign exactly one owner per output.
4. Assign file ownership per track.
5. Reject concurrent edits to the same files.
6. Decide whether worktrees are justified.
7. If worktrees are justified, define branch names, paths, base branch, merge order, and cleanup criteria.
8. Define validation per track and final integration validation.
9. Record the cowork plan in the active Task Plan.
10. Stop for explicit approval before creating branches, worktrees, merges, or destructive Git operations.

## Required Evidence
- Ownership matrix.
- Handoff artifacts.
- Worktree plan if applicable.
- Validation matrix.
- Git status/worktree evidence before mutation.

## Output
A cowork plan containing:

- cowork mode;
- agent sequence;
- ownership matrix;
- handoff contract;
- optional worktree plan;
- merge order;
- validation matrix;
- stop conditions.

## Limits
- No Git mutation without explicit approval.
- No concurrent writes to same files.
- No autonomous swarm.
- No bypassing Approval Gate.
- No merging unreviewed worktree output.

## Interactions
Pairs with:

- `engineering-task-plan`
- `engineering-code-review`
- `engineering-delivery`
- `project-rules-auditor`
- domain specialist agents when scoped consultation is needed
