---
name: worktree-lifecycle-management
description: Create, manage, and clean up isolated git worktrees for parallel agent work with safe merge coordination.
compatibility: opencode; hermes
x-harness:
  skill_id: SK31
  status: active
  source_type: harness-global
  source_policy:
    collection: documentation; technology
    contexts: [CTX23, CTX25, CTX27, CTX20, CTX12]
    bundles: []
  usable_by_agents: [build, AG05, AG17]
---

# Skill: worktree-lifecycle-management

## Purpose
Manage the full lifecycle of Git worktrees: create isolated working directories for parallel agent work, coordinate merges in dependency order, validate integration, and clean up. This skill handles the *technical* worktree operations; `team-cowork-orchestration` (SK28) handles the *coordination* of people/agents across tracks.

## When to Load
- SK28 (team-cowork-orchestration) has determined worktrees are justified.
- Parallel agent work needs file-level isolation.
- A merge sequence with dependency ordering is required.
- Worktree branches need cleanup after merge.

## Do Not Load When
- Worktrees are not approved or justified.
- Only one track of work exists.
- Task can be done in a single diff.
- User has not approved branch/worktree mutation.

## Required Inputs
- Base branch name.
- List of tracks with branch names, file ownership, and dependency order.
- Worktree parent directory (convention: `../<repo-name>-<task-id>-<track>`).
- Validation commands per track and for integration.
- Merge order (topological: base deps first, leaf tracks last).

## Barsa Retrieval Policy
Use Barsa MCP for official docs and curated engineering references when designing worktree strategy, merge policy, or cleanup.

- collection: `documentation` or `technology`
- contexts: `CTX23`, `CTX25`, `CTX27`, `CTX20`, `CTX12`

Key sources:
- Hermes Agent docs: `git worktree add`, `-w` auto mode, checkpoint isolation, cleanup.
- DevOps Handbook: branch lifetime limits (< 1 day), merge frequency.
- Accelerate: fewer than 3 active branches, short branch lifetimes.
- Building Microservices: trunk-based development, merge complexity.
- Five Lines of Code: cleanup after merge — branches are expensive in mental overhead.

Do not reference local library filesystem paths.

## Procedure

### Phase 1 — Inspect and Plan
1. Inspect current Git state: `git status`, `git worktree list`, `git branch`, `git remote -v`.
2. Record pre-existing changes and stash if needed (with user approval).
3. Define base branch (usually `main` or `master`).
4. Assign branch names per track:
   ```text
   work/<task-id>-<track-a>
   work/<task-id>-<track-b>
   work/<task-id>-<track-c>
   ```
5. Assign worktree paths:
   ```text
   ../<repo-name>-<task-id>-<track-a>
   ../<repo-name>-<task-id>-<track-b>
   ```
6. Verify file ownership is non-overlapping across tracks.

### Phase 2 — Create Worktrees
7. Create each worktree:
   ```bash
   git worktree add <path> <base-branch>
   ```
8. Inside each worktree, create the track branch:
   ```bash
   cd <path> && git checkout -b <branch>
   ```
9. Record the worktree-to-branch mapping in the Task Plan.

### Phase 3 — Delegate and Monitor
10. Assign each worktree to one agent.
11. Define handoff artifacts per worktree.
12. Monitor progress: `git worktree list`, `git status` per worktree.

### Phase 4 — Merge Coordination
13. Define merge order (topological):
    - Tracks with no dependencies merge first.
    - Tracks that depend on prior work merge next.
    - The integration branch (base) receives all merges last.
14. For each track in merge order:
    ```bash
    cd <base-worktree>
    git pull <track-path> <track-branch>
    ```
    Use `--ff-only` when possible; use `--no-ff` with explicit merge commit for large tracks.
15. Resolve conflicts immediately — pause remaining merges until resolved.
16. Run integration validation (`npm test`, lint, etc.) after each merge.

### Phase 5 — Validate
17. Run full integration test suite on the merged result.
18. Run diff review (`code-reviewer` or human).
19. Record merge evidence: commit SHAs, validation output, conflict log.

### Phase 6 — Cleanup
20. After successful merge and review:
    ```bash
    git worktree remove <path>
    git branch -d <branch>
    ```
21. Verify cleanup: `git worktree list` should show only the main worktree.
22. Only force-remove with explicit user approval.

## Required Evidence
- Worktree list before and after creation.
- Branch-to-worktree mapping.
- Merge order with justification.
- Validation output per merge step.
- Conflict resolution log (if conflicts occurred).
- Cleanup confirmation.
- Git state evidence before and after.

## Output
- Created worktrees and branches.
- Merged integration branch.
- Cleaned up worktree artifacts.
- Evidence log of the full lifecycle.

## Limits
- Never create worktrees without explicit approval.
- Never force-push to worktree branches.
- Never merge without review and validation.
- Never leave stale worktrees — always clean up.
- Never exceed 3 simultaneous worktrees (per Accelerate research).
- Keep worktree branches short-lived (< 1 day).

## Worktree Naming Convention
```text
# Branch
work/<task-id>-<descriptive-track>

# Worktree path (relative to repo root)
../<repo-name>-<task-id>-<descriptive-track>
```

## Merge Strategy
| Track Size | Merge Method | When |
|---|---|---|
| Small (< 5 files, no deps) | `--ff-only` | Always preferred |
| Medium (5-20 files, low conflict risk) | `--no-ff` with message | Explicit history |
| Large (> 20 files, complex deps) | `--no-ff` with validation per step | High-risk tracks |

## Conflict Resolution Protocol
1. Pause merge sequence.
2. Identify conflicting files.
3. Determine if conflict indicates overlapping ownership (design error) or legitimate contention.
4. If overlapping ownership: return to SK28 cowork-planning step.
5. If legitimate contention: resolve manually, re-run validation, resume merge.

## Hermes Agent Compatibility
This skill follows patterns from the Hermes Agent git worktrees documentation:
- Manual worktree creation for multi-agent parallel execution.
- Isolated checkouts per agent.
- Per-worktree checkpoint/rollback (via OpenCode snapshot feature).
- Cleanup after integration.

For fully automated worktree mode, OpenCode plans a future `worktree` subcommand
analogous to Hermes Agent's `-w` flag.

## Interactions
- `team-cowork-orchestration` (SK28): loads this skill when worktrees are justified.
- `engineering-task-plan` (SK26): records worktree lifecycle evidence.
- `engineering-code-review` (SK19): reviews the integration diff.
- `engineering-delivery` (SK21): commits and pushes the merged result.
