# HARNESS-044: Goal — Autonomous Loop Agent

**Status:** In Progress  
**Issue:** [#11](https://github.com/patresio/openstrut/issues/11)  
**Branch:** `feat/harness-044-goal`  
**Base:** `main`  
**Created:** 2026-07-20

## Objective

Create `ot-goal` command that processes all pending tasks autonomously, orchestrating multiple agents in parallel or in worktrees.

## Acceptance Criteria

- [x] ADR-006 created for autonomous execution policy
- [x] New `ot-goal` command defined in `global/commands/ot-goal.md`
- [ ] Scans `.opencode/task-plans/` for pending tasks
- [ ] Automatically chains phases with human gates
- [ ] Supports worktree isolation for parallel tasks
- [ ] Respects branch-per-task enforcement (ADR-005)
- [ ] Implements 3-attempt halt rule
- [ ] Produces multi-task status dashboard

## Scope

### In Scope
- ADR-006: autonomous execution policy
- Task queue scanner
- Phase chaining engine
- Loop controller
- Worktree lifecycle
- Multi-task status aggregation

### Out of Scope
- Background/daemon execution
- Event-driven processing
- Relaxing human approval gates
- Full autonomous execution (requires separate ADR)

## Microincrements

### MI1: ADR for Autonomous Execution
<<<<<<< HEAD
- [x] Create ADR-006
- [x] Define safety limits
- [x] Document decisions and trade-offs

### MI2: Command Definition
- [x] Create `global/commands/ot-goal.md`
- [x] Define execution pipeline
- [x] Define output format

### MI3: Task Scanner
- [x] Implement task plan reading
- [x] Implement topological sort
- [x] Implement pending task filter

### MI4: Phase Chaining Engine
- [x] Implement auto-invocation
- [x] Implement human gates
- [x] Implement decision logging

### MI5: Worktree Support
- [x] Implement worktree creation
- [x] Implement lifecycle management
- [x] Implement safety limits

### MI6: Status Dashboard
- [x] Implement multi-task aggregation
- [x] Implement final report
- [x] Integrate with handoff skill

### MI7: Integration & Tests
- [x] Update WORKFLOW.md
- [x] Update inventory (205 artifacts)
- [x] Update tests (10 commands)
- [x] Run full test suite
=======
- [ ] Create ADR-006
- [ ] Define safety limits
- [ ] Document decisions and trade-offs

### MI2: Command Definition
- [ ] Create `global/commands/ot-goal.md`
- [ ] Define execution pipeline
- [ ] Define output format

### MI3: Task Scanner
- [ ] Implement task plan reading
- [ ] Implement topological sort
- [ ] Implement pending task filter

### MI4: Phase Chaining Engine
- [ ] Implement auto-invocation
- [ ] Implement human gates
- [ ] Implement decision logging

### MI5: Worktree Support
- [ ] Implement worktree creation
- [ ] Implement lifecycle management
- [ ] Implement safety limits

### MI6: Status Dashboard
- [ ] Implement multi-task aggregation
- [ ] Implement final report
- [ ] Integrate with handoff skill

### MI7: Integration & Tests
- [ ] Update WORKFLOW.md
- [ ] Update inventory (205 artifacts)
- [ ] Update tests (9 → 10 commands)
- [ ] Run full test suite
>>>>>>> github/main

## Current State

- [x] Issue #11 created
- [x] Branch created
- [x] MI1: ADR-006
- [x] MI2-MI7: Implementation

## Next Action

Ready for review. Commit changes and open PR.
