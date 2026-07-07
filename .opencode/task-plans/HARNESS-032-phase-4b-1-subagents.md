# HARNESS-032 Phase 4B-1 Subagents

## Status
Active

## Approval Evidence
User: "Choose Option 1. Proceed with Phase 4B-1 only. Implement subagents for Engineering, Testing / Quality, Review / Governance."

## Scope
Create compact subagent files only under `global/agents/` for Phase 4B-1 teams.

## Exclusions
No DevOps, Delivery, Knowledge subagents. No commands, skills, plugins, config edits, installer edits, legacy archival, commits, pushes, PRs.

## Conflicts
- `global/agents/code-reviewer.md` exists; do not overwrite.
- `global/agents/compliance-auditor.md` exists; do not overwrite.

## Files Planned
- `global/agents/feature-implementer.md`
- `global/agents/code-refactoring-specialist.md`
- `global/agents/performance-engineer.md`
- `global/agents/security-reviewer.md`
- `global/agents/privacy-reviewer.md`
- `global/agents/tdd-engineer.md`
- `global/agents/integration-tester.md`
- `global/agents/testing-strategy-designer.md`
- `global/agents/ux-accessibility-reviewer.md`

## Validation Plan
- `git diff --check`
- verify only Phase 4B-1 subagent files created
- verify no existing legacy agent overwritten
- verify all created subagents match `TEAM_TOPOLOGY.md`
- verify no banned/private terms
- verify no `global/opencode.json` change

## Checklist
- [x] Explore
- [x] Proposal
- [x] Planning
- [x] Approval Gate
- [x] Build
- [x] Review
- [ ] Archive
- [ ] Commit
- [ ] Push
- [ ] Pull Request

## Evidence
- Created 9 new subagent files under `global/agents/`.
- Preserved pre-existing modified files: `bin/openstrut.js`, `opencode.json`.
- Preserved existing agent files: `global/agents/code-reviewer.md`, `global/agents/compliance-auditor.md`.

## Current State
Build and validation complete for Phase 4B-1. Next action: stop and report results.
