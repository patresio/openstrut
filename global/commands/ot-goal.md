---
description: Process pending tasks autonomously with human gates
agent: trust-lead
---

# Goal Command

**Purpose:** Process all pending tasks in `.opencode/task-plans/` autonomously, advancing between phases while respecting human approval gates. Implements ADR-006 autonomous execution policy.

## Instructions

1. Resolve task directory: use `[task-dir]` if given, else `.opencode/task-plans/`.
2. **Scan** — Read all task plans in the directory, identify pending tasks.
3. **Prioritize** — Sort by dependency graph (topological sort), then by priority.
4. **Loop** — For each pending task:
   a. **Pre-flight** — Verify branch exists or create one (per ADR-005).
   b. **Phase chain** — Advance through phases, waiting at human gates.
   c. **Track progress** — Update task plan status after each phase.
   d. **Halt conditions** — Stop on failure, max retries, or max runtime.
5. **Report** — Emit multi-task status dashboard.

## Input Format

```
ot-goal [task-dir] [--max-tasks N] [--max-runtime HOURS]
```

Options:
- `--max-tasks N`: Maximum tasks to process (default: 5)
- `--max-runtime HOURS`: Maximum total runtime (default: 4)
- `--dry-run`: Show what would be done without executing

## Execution Pipeline

```
[ot-goal]
    ↓
[Scan Task Plans]
    ↓
[Filter Pending] → tasks with status "pending" or "in_progress"
    ↓
[Topological Sort] → respect dependencies
    ↓
[Loop: For Each Task]
    ↓
    [Pre-flight Check]
        ├── Branch exists? → use it
        └── No branch? → create work/<task-id>-<desc>
    ↓
    [Phase: Explore] → read-only, no approval needed
    ↓
    [Phase: Propose] → read-only, no approval needed
    ↓
    [Gate: Approval] → STOP, wait for human
    ↓
    [Phase: Apply] → mutation, TDD required
    ↓
    [Gate: TDD RED] → STOP, wait for human
    ↓
    [Phase: Apply continued] → implement
    ↓
    [Gate: TDD GREEN] → STOP, wait for human
    ↓
    [Phase: Review] → read-only, no approval needed
    ↓
    [Gate: Review] → STOP, wait for human
    ↓
    [Phase: Ship] → commit, push, PR
    ↓
    [Gate: Merge] → STOP, wait for human
    ↓
    [Task Complete] → next task
    ↓
[End Loop]
    ↓
[Status Dashboard] → multi-task summary
```

## Task Plan Format

ot-goal reads task plans in this format:

```markdown
# Task: [Title]

**Status:** pending | in_progress | done | blocked
**Issue:** #NNN
**Branch:** feat/harness-XXX-name
**Base:** main

## Objective
[What needs to be done]

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

## Microincrements

### MI1: [Name]
- [ ] Step 1
- [ ] Step 2

### MI2: [Name]
- [ ] Step 1
- [ ] Step 2
```

## Phase Advancement Rules

### Explore Phase (Read-only)
- No approval needed
- Read files, search, analyze
- Record findings in task plan
- Auto-advance to Propose

### Propose Phase (Read-only)
- No approval needed
- Write proposal documents
- Compare alternatives
- Auto-advance to Approval Gate

### Approval Gate (Human required)
- STOP and wait for human
- Present proposal summary
- Wait for explicit approval
- Record approval in task plan
- Auto-advance to Apply

### Apply Phase (Mutation)
- Create branch if needed (per ADR-005)
- Implement changes
- Run tests
- Record evidence
- Auto-advance to TDD Gate

### TDD RED Gate (Human required)
- STOP and wait for human
- Present test failure evidence
- Wait for human to verify test intent
- Record verification
- Auto-advance to implementation

### TDD GREEN Gate (Human required)
- STOP and wait for human
- Present passing test evidence
- Wait for human to verify behavior
- Record verification
- Auto-advance to Review

### Review Phase (Read-only)
- No approval needed
- Read diff, run tests
- Record review findings
- Auto-advance to Review Gate

### Review Gate (Human required)
- STOP and wait for human
- Present review findings
- Wait for human approval
- Record approval
- Auto-advance to Ship

### Ship Phase (Delivery)
- Commit changes
- Push to remote
- Create PR with template
- Auto-advance to Merge Gate

### Merge Gate (Human required)
- STOP and wait for human
- Present PR link
- Wait for human to merge
- Record merge status
- Mark task complete

## Halt Conditions

The loop stops when:

1. **Task failure** — 3 equivalent unsuccessful attempts (per AGENTS.md §9)
2. **Max retries** — Task exceeds retry limit
3. **Max runtime** — Total runtime exceeds limit (default: 4 hours)
4. **Max tasks** — Processed maximum number of tasks (default: 5)
5. **Blocked** — Task has unresolved dependency
6. **Human halt** — User explicitly stops the loop
7. **Safety** — Unsafe operation detected

## Worktree Support

For independent parallel tasks:

1. **Detection** — Identify tasks with no file overlap
2. **Creation** — Create worktrees per Design 009 protocol
3. **Isolation** — Each worktree gets its own branch
4. **Merge order** — Topological sort by dependencies
5. **Cleanup** — Remove worktrees after merge

Rules (per Design 009):
- Max 3 simultaneous worktrees
- Each worktree < 1 working day
- Explicit approval before creation
- No concurrent edits to same files

## Status Dashboard

After processing all tasks, emit:

```
[GOAL STATUS]
Processed: N tasks
Completed: N
Blocked: N
Failed: N
In Progress: N

[TASK DETAILS]
Task ID | Status | Branch | Phase | Evidence
--------|--------|--------|-------|----------
HARNESS-043 | done | feat/harness-043 | ship | PR #13 merged
HARNESS-044 | in_progress | feat/harness-044 | apply | RED evidence recorded

[BLOCKERS]
- HARNESS-045: blocked on HARNESS-044 (dependency)

[WORKTREES]
- ../openstrut-HARNESS-043-api (cleanup due: 2026-07-21)

[NEXT]
- Continue HARNESS-044 (Phase: Apply)
- Start HARNESS-045 after HARNESS-044 completes
```

## Rules

- Respect ADR-005 branch-per-task enforcement
- Respect ADR-006 autonomous execution policy
- Respect Design 009 worktree limits
- Never skip human approval gates
- Never exceed safety limits
- Always record evidence in task plans
- Always emit status dashboard
- Halt on 3 equivalent failures (per AGENTS.md §9)

## Expected Output

- Task scan results
- Execution plan
- Phase transitions with evidence
- Status dashboard
- Blocker list
- Next action recommendations

## Execution Report

```
[GOAL START]
Time: <timestamp>
Max Tasks: <N>
Max Runtime: <HOURS>

[TASK SCAN]
Pending: <list>
In Progress: <list>
Blocked: <list>

[EXECUTION]
Task: <HARNESS-XXX>
  Phase: <explore|propose|apply|review|ship>
  Status: <ok|blocked|failed>
  Evidence: <evidence location>
  Duration: <time>

[GOAL END]
Time: <timestamp>
Processed: <N>
Completed: <N>
Blocked: <N>
Failed: <N>
Total Duration: <time>
```
