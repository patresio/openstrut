# HARNESS-043: Creator — Project Analyzer

**Status:** Ready for Review  
**Issue:** [#10](https://github.com/patresio/openstrut/issues/10)  
**Branch:** `feat/harness-043-creator`  
**Base:** `main`  
**Created:** 2026-07-20

## Objective

Create `ot-create` command that analyzes the project to detect gaps in agent/skill/workflow harness and recommends new artifacts.

## Acceptance Criteria

- [x] New `ot-create` command defined in `global/commands/ot-create.md`
- [x] Analyzes tech stack (language, frameworks, test tools, build tools, CI)
- [x] Detects existing agents, skills, and workflows
- [x] Identifies gaps between needs and inventory
- [x] Recommends specific agents/skills with justification
- [x] Integrates with agent template and taxonomy validator

## Scope

### In Scope
- Create `global/commands/ot-create.md`
- Stack analysis logic
- Gap detection engine
- Recommendation engine
- Integration with agent template
- Integration with taxonomy validator

### Out of Scope
- Automatic artifact creation (recommends only)
- External project analysis
- Personal context analysis (future extension)

## Microincrements

### MI1: Command Definition
- [x] Create `global/commands/ot-create.md`
- [x] Define analysis pipeline
- [x] Define output format

### MI2: Integration & Tests
- [x] Update WORKFLOW.md
- [x] Update inventory (204 artifacts)
- [x] Update tests (9 commands)
- [x] Run full test suite

## Current State

- [x] Issue #10 created
- [x] Branch created
- [x] MI1: Command definition
- [x] MI2: Integration & tests

## Next Action

Ready for review. Commit changes and open PR.
