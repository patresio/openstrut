---
name: team-cowork-orchestration
description: Coordinate human and agent teamwork with explicit ownership, handoffs, and safe git worktree strategy when approved.
compatibility: opencode; hermes
x-harness:
  skill_id: SK28
  status: active
  source_type: harness-global
  source_policy:
    collection: documentation; technology
    contexts: [CTX23, CTX25, CTX27, CTX20]
    bundles: []
  usable_by_agents: [build, AG05, AG06, AG07, AG08, AG11, AG14, AG15, AG17]
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

Key sources for worktree/cowork design:
- **Hermes Agent docs**: canonical reference for `git worktree add` multi-agent parallel execution, isolated checkouts, per-worktree checkpoint/rollback, cleanup. See hermes-agent user-guide/git-worktrees.
- **Hermes Agent delegation patterns**: parallel research, code review delegation, multi-file refactoring split across subagents. See hermes-agent guides/delegation-patterns.
- **DevOps Handbook (Kim et al.)**: branching isolation vs merge complexity, trunk-based development.
- **Accelerate (Forsgren et al.)**: fewer than 3 active branches, short lifetimes (< 1 day), correlation with high delivery performance.
- **Building Microservices (Sam Newman)**: delayed integration complexity, feature flags as alternative to long-lived branches.
- **Five Lines of Code**: branches are expensive in mental overhead — delete after merge.

Do not reference local library filesystem paths.

## Procedure

### Phase 1 — Classify and Plan
1. Classify cowork mode: sequential, review, consult, or worktree.
2. Map dependencies and required handoffs.
3. Assign exactly one owner per output.
4. Assign file ownership per track — reject overlapping ownership.
5. Decide whether worktrees are justified (see When to Use Worktrees).

### Phase 2 — Worktree Preparation
6. If worktrees are justified, define:
   - Branch names per track (`work/<task-id>-<track>`).
   - Worktree paths (`../<repo-name>-<task-id>-<track>`).
   - Base branch (usually `main`).
   - Merge order (topological: base deps first).
   - Cleanup criteria (after merge + review).
7. Load `worktree-lifecycle-management` (SK31) for technical worktree operations.
8. Define which agent owns each worktree.
9. Record the full cowork/worktree plan in the active Task Plan.

### Phase 3 — Validation and Approval
10. Define validation per track and final integration validation.
11. Define rollback strategy (revert merge, delete branch).
12. Stop for explicit approval before creating branches, worktrees, merges, or destructive Git operations.

### Phase 4 — Post-Merge Review
13. After worktree tracks are merged (by SK31), run integration validation.
14. Route to `code-reviewer` for final diff review.
15. Route to `engineering-delivery` for commit/push/PR if approved.

## When to Use Worktrees
Use only when ALL conditions are met:
- Tasks are independent (no shared files).
- File ownership is non-overlapping.
- Each track has a dedicated branch.
- Merge order is explicit and dependency-resolved.
- Review and validation occur before integration.
- Track count is ≤ 3 (per Accelerate research).
- Expected worktree lifetime is < 1 working day.

## Worktree Lifecycle Summary
```
Plan → Approve → Create → Assign → Work → Validate → Merge → Review → Cleanup
```
Each phase is owned by exactly one agent. The worktree skill (SK31) handles
the technical create/work/merge/cleanup steps; this skill owns the
coordination/planning/approval steps.

## Required Evidence
- Ownership matrix.
- Handoff artifacts.
- Worktree plan (branches, paths, merge order).
- Validation matrix.
- Git status/worktree evidence before and after mutation.
- Merge order justification.
- Conflict resolution log (if any).

## Output
A cowork plan containing:

- cowork mode;
- agent sequence;
- ownership matrix;
- handoff contract;
- worktree plan (branches, paths, merge order, cleanup);
- validation matrix;
- rollback strategy;
- stop conditions.

## Limits
- No Git mutation without explicit approval.
- No concurrent writes to same files.
- No autonomous swarm — each track has exactly one owner.
- No bypassing Approval Gate.
- No merging unreviewed worktree output.
- Never exceed 3 simultaneous worktrees.
- Never leave stale worktrees.

## Interactions
Pairs with:

- `worktree-lifecycle-management` (SK31) — technical worktree operations.
- `engineering-task-plan` (SK26) — records cowork evidence.
- `engineering-code-review` (SK19) — reviews integration diff.
- `engineering-delivery` (SK21) — commits/pushes merged result.
- `project-rules-auditor` (AG15) — validates repo constraints.
- `harness-generation` (SK30) — when cowork involves generating new agents/skills.
- Domain specialist agents when scoped consultation is needed (AG05–AG12).
