# HARNESS-042: ot-synthetize — Unified Idea Refinement Command

**Status:** Ready for Review  
**Issue:** [#9](https://github.com/patresio/openstrut/issues/9)  
**Branch:** `feat/ot-synthetize-idea-refinement`  
**Base:** `main`  
**Created:** 2026-07-20

## Objective

Create a new `ot-synthetize` command that unifies the idea refinement pipeline into a single entry point, combining Grilling Skill, Product Discovery, and Task Contract patterns.

## Acceptance Criteria

- [x] New `ot-synthetize` command defined in `global/commands/ot-synthetize.md`
- [x] Accepts vague user description as input
- [x] Uses Grilling Skill pattern (4-round structured interview) to clarify
- [x] Uses Product Discovery patterns to identify gaps
- [x] Produces refined task contract draft
- [x] Outlines clear next steps
- [x] Integrates with existing WORKFLOW.md phase model

## Scope

### In Scope
- Create `global/commands/ot-synthetize.md` command definition
- Integrate Grilling Skill, Product Discovery, and Task Contract patterns
- Define input/output contract
- Document in WORKFLOW.md

### Out of Scope
- New agents (uses existing Product team)
- New skills (leverages existing opentrust-grilling)
- Autonomous execution

## Microincrements

### MI1: Command Definition
- [x] Create `global/commands/ot-synthetize.md` with full command spec
- [x] Define 4-round interview structure
- [x] Define gap analysis step
- [x] Define task contract output format

### MI2: Integration Documentation
- [x] Update `docs/opencode/WORKFLOW.md` to reference ot-synthetize
- [x] Document relationship to existing commands (ot-explore, ot-propose)

### MI3: Validation
- [x] Verify command follows existing command patterns
- [x] Run `npm test` to ensure no regressions

## Evidence

- [x] Command file created
- [x] WORKFLOW.md updated
- [x] Tests pass (266/266)

## Current State

- [x] Issue #9 created
- [x] Branch created
- [x] MI1: Command definition
- [x] MI2: Integration documentation
- [x] MI3: Validation

## Next Action

Ready for review. Commit changes and open PR.
