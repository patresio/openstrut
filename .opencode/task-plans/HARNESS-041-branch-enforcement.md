# HARNESS-041: Enforce Branch-Per-Task for All Mutating Agents

**Status:** Delivered — PR Open  
**Issue:** [#7](https://github.com/patresio/openstrut/issues/7)  
**PR:** [#8](https://github.com/patresio/openstrut/pull/8)  
**Branch:** `feat/adr-005-branch-enforcement`  
**Base:** `main`  
**Created:** 2026-07-20  
**ADR:** ADR-005  
**Commit:** `e663654`

## Objective

Implement ADR-005 to enforce branch-per-task discipline across all OpenTrust mutating agents.

## Acceptance Criteria

- [x] `ot-apply` command has hard branch gate that stops mutation on main/master
- [x] 5 implementing subagent prompts include mandatory branch preflight check
- [x] `opencode.jsonc` grants explicit branch creation permissions to relevant agents
- [x] All existing tests pass after changes (266/266 pass)
- [x] ADR-005 is referenced in WORKFLOW.md

## Scope

### In Scope
- Modify `global/commands/ot-apply.md` — add branch verification step
- Modify 5 subagent prompts — add branch awareness section
- Update `opencode.jsonc` — add explicit git branch permissions
- Update `docs/opencode/WORKFLOW.md` — reference ADR-005

### Out of Scope
- New `ot-start-work` command (deferred)
- Git hooks enforcement (rejected in ADR)
- Changes to lead agent prompts (already have soft enforcement)

## Microincrements

### MI1: Hard Branch Gate in `ot-apply`
- [x] Add "Branch Verification (MANDATORY)" section to `global/commands/ot-apply.md`
- [x] Include branch check logic before mutation step

### MI2: Branch Awareness in Subagent Prompts
- [x] Add "Branch Awareness" section to `feature-implementer.md`
- [x] Add "Branch Awareness" section to `code-refactoring-specialist.md`
- [x] Add "Branch Awareness" section to `performance-engineer.md`
- [x] Add "Branch Awareness" section to `tdd-engineer.md`
- [x] Add "Branch Awareness" section to `ci-cd-infrastructure-engineer.md`

### MI3: Explicit Branch Permissions
- [x] Update `opencode.jsonc` with `git checkout -b*` and `git switch -c*` for relevant agents

### MI4: Documentation Update
- [x] Update `docs/opencode/WORKFLOW.md` to reference ADR-005
- [x] Run `npm test` to verify no regressions

## TDD Strategy

- **RED**: Verify current behavior (agents can work on main)
- **GREEN**: After changes, verify agents refuse to work on main
- **REFACTOR**: Clean up any inconsistencies

## Evidence

- [x] `ot-apply` now stops on main branch
- [x] All 5 subagent prompts have branch awareness
- [x] Permissions updated in `opencode.jsonc`
- [x] Tests pass (266/266)
- [x] WORKFLOW.md references ADR-005

## Delivery

- [x] Commit `e663654` on `feat/adr-005-branch-enforcement`
- [x] Pushed to origin
- [x] PR #8 opened → https://github.com/patresio/openstrut/pull/8
- [x] Working tree clean

## Current State

- [x] ADR-005 created
- [x] Issue #7 created
- [x] Branch `feat/adr-005-branch-enforcement` created
- [x] MI1: Hard branch gate in ot-apply
- [x] MI2: Branch awareness in subagent prompts
- [x] MI3: Explicit branch permissions
- [x] MI4: Documentation update
- [x] Committed, pushed, PR opened

## Next Action

Await PR review and merge approval. Closes #7 on merge.
