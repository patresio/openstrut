# ADR-006: Autonomous Execution Policy for Multi-Task Processing

**Status:** Proposed  
**Date:** 2026-07-20  
**Author:** trust-lead  

## Context

The OpenTrust harness currently requires human approval at every phase gate. This is correct for single-task work but creates friction when processing multiple independent tasks. Design docs 006 and 008 explicitly restrict autonomous execution:

- **Design 006** (Change Execution Manifest): "Nenhum agent iniciado" — manifest generation is pure planning, no execution.
- **Design 008** (Sequential Multi-Agent Workflows): "only later consider actual autonomous execution" — sequential workflows are default, autonomous execution is deferred.
- **Design 009** (Cowork and Git Worktree Orchestration): Requires explicit approval before worktree creation, max 3 simultaneous, short-lived.

The `ot-goal` command needs to process multiple pending tasks in a loop, which requires relaxing the "no autonomous execution" constraint while preserving safety invariants.

### What Autonomous Means Here

Autonomous execution in this context means:

1. **Phase chaining** — automatically advancing from one phase to the next within a single task
2. **Task queuing** — automatically starting the next pending task after completing the current one
3. **Worktree isolation** — creating worktrees for independent parallel tasks

Autonomous execution does NOT mean:

1. **Removing human approval gates** — all gates remain; autonomy is about sequencing, not approval
2. **Running without oversight** — every action is logged and auditable
3. **Bypassing TDD, review, or delivery gates** — all quality gates remain mandatory
4. **Modifying production without review** — all changes go through PR and review

## Decision

We create a formal autonomous execution policy that relaxes Design 006/008 constraints under specific conditions.

### 1. Human Gate Preservation

All existing human gates remain mandatory:

| Gate | Required | Autonomous? |
|------|----------|-------------|
| Issue creation | Yes | No — human decides what to build |
| Branch creation | Yes | Yes — auto-create per ADR-005 |
| TDD RED | Yes | No — human verifies test intent |
| TDD GREEN | Yes | No — human verifies behavior |
| Review | Yes | No — human reviews diff |
| Merge | Yes | No — human approves merge |
| PR creation | Yes | Yes — auto-create with template |

**Key insight:** Autonomy is about *sequencing* between gates, not *removing* gates. The loop advances from one gate to the next, but waits at each gate for human approval.

### 2. Autonomy Levels

| Level | Description | When to Use |
|-------|-------------|-------------|
| 0 | Full manual — human drives every step | Default for new users |
| 1 | Suggest next — recommend what to do, human executes | Learning phase |
| 2 | Auto-advance — advance between gates, wait at gates | Experienced users |
| 3 | Auto-execute — run until blocked, report results | Batch processing |

ot-goal operates at **Level 2** by default: it advances between gates but waits at human approval points.

### 3. Safety Limits

| Limit | Value | Rationale |
|-------|-------|-----------|
| Max tasks per run | 5 | Prevent runaway execution |
| Max worktrees | 3 | Per Design 009 |
| Max worktree lifetime | 1 working day | Per Design 009 |
| Max retries per task | 3 | Per AGENTS.md §9 |
| Max total runtime | 4 hours | Prevent stale state |
| Halt on failure | Yes | Per AGENTS.md §9 |

### 4. Audit Trail Requirements

Every autonomous action must be logged:

```
[TIMESTAMP] [LEVEL] [GOAL] action {task=HARNESS-XXX, phase=apply, agent=feature-implementer, status=ok}
```

Required logs:

- Task start/end
- Phase transitions
- Agent invocations
- Gate decisions (pass/fail/block)
- Worktree create/merge/cleanup
- Errors and retries

### 5. Worktree Policy

Worktrees are allowed under these conditions:

- Tasks are independent (no file overlap)
- Each worktree has a branch (per ADR-005)
- Max 3 simultaneous worktrees
- Each worktree < 1 working day
- Merge order is explicit (topological)
- Review and validation before integration

### 6. Branch Policy

All tasks must use branches (per ADR-005):

- Auto-create branch before any mutation
- Branch name: `work/<task-id>-<description>`
- No direct commits to main
- PR required for each task

### 7. Gate Behavior

```
[ot-goal loop]
    ↓
[Scan pending tasks]
    ↓
[Select next task] → if none, exit
    ↓
[Create branch] (auto)
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
[Task complete] → next task
```

## Consequences

### Positive
- Multiple tasks can be processed in sequence without manual intervention between tasks
- Human approval gates are preserved — autonomy is about sequencing, not approval
- Full audit trail for compliance and debugging
- Worktree isolation for independent parallel tasks
- Consistent with Design 009 worktree protocol

### Negative
- Complexity of loop controller and state management
- Risk of stale state if loop runs too long (mitigated by max runtime limit)
- Need for clear halt conditions to prevent runaway execution

### Risks
- Agent could advance too quickly between gates — mitigated by requiring explicit human approval at each gate
- Worktree conflicts if tasks have file overlap — mitigated by ownership matrix and Design 009 rules

## Alternatives

### Alternative 1: Full autonomous execution (no human gates)
- **Rejected**: Violates Design 006/008 safety invariants. Human approval is non-negotiable for quality gates.

### Alternative 2: Manual task queuing only
- **Rejected**: Defeats the purpose of ot-goal. Users want batch processing, not manual queuing.

### Alternative 3: Event-driven processing
- **Rejected**: Out of scope per task plan. Requires daemon infrastructure.

## Implementation Order

1. Create this ADR (this task)
2. Create `ot-goal` command with loop controller
3. Implement task scanner (read pending tasks from `.opencode/task-plans/`)
4. Implement phase chaining engine (advance between gates, wait at gates)
5. Implement worktree support (create, manage, cleanup)
6. Implement status dashboard (multi-task aggregation)
7. Update WORKFLOW.md to reference ADR-006

## References

- Design 006: Change Execution Manifest
- Design 008: Sequential Multi-Agent Workflows
- Design 009: Cowork and Git Worktree Orchestration
- ADR-005: Branch-Per-Task Enforcement
- AGENTS.md §3: Healthy Engineering Workflow
- AGENTS.md §9: Security, Failures, and Fallbacks
- HARNESS-044: Goal — Autonomous Loop Agent
