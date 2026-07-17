# HARNESS-035: Semantic Context Catalog — replace implicit selector semantics with Markdown source of truth

## Status
- [x] Explore
- [x] Proposal
- [x] Planning
- [x] Approval Gate (approved in conversation)
- [x] Build — MI1: define `global/context/` structure and templates
- [x] Build — MI2: create full Markdown catalog for CTX/SK/AG/B/DOC
- [x] Build — MI3: update installer inventory and count-sensitive tests
- [x] Review (closed via HARNESS-040 reconciliation)
- [x] Commit (committed in PR #5)
- [x] Push (pushed in PR #5)

## Objective
Create a simple Markdown semantic catalog under `global/context/` so CTX/SK/AG/B/DOC meanings are explicit, versioned, and separated from executable runtime artifacts.

## Core Rules
- `global/agents/*.md` remain executable agents.
- `global/skills/*/SKILL.md` remain executable skills.
- `AGxx` files are semantic/runtime mapping docs only, never executable agents.
- `SKxx` files are semantic/runtime mapping docs only, never executable skills.
- Barsa remains retrieval/enrichment backend.
- `xlsx/csv` stop being active semantic source after textual catalog lands.

## In Scope
- `global/context/README.md`, `INDEX.md`, `MIGRATION_POLICY.md`, `RELATIONS.md`, `DEPRECATIONS.md`
- `global/context/contexts/CTX*.md`
- `global/context/skills/SK*.md`
- `global/context/agent-maps/AG*.md`
- `global/context/bundles/B*.md`
- `global/context/docs/DOC_*.md`
- inventory/test updates if `global/context/**` becomes installable

## Out of Scope
- changing executable behavior of agents/skills
- changing runtime prompts or runtime docs beyond installable artifact inclusion
- removing Barsa MCP
- deleting historical files without explicit follow-up
- pushing, PR creation, or merge without explicit approval

## Acceptance Criteria
- [x] `global/context/` exists with documented structure and templates
- [x] every current CTX selector has a Markdown file
- [x] every current SK selector has a Markdown file with runtime mapping when applicable
- [x] every AG selector has a Markdown file marked semantic/legacy/runtime-mapping only
- [x] every bundle selector has a Markdown file
- [x] every referenced DOC selector has a Markdown file
- [ ] docs explain separation: selector semantics vs executable runtime artifacts
- [ ] inventory/tests/package checks pass

## Risks
- scope size across many files
- selector drift between repo docs and installed runtime docs
- packaging count changes if `global/context/**` is installed
- need to preserve simple boring model

## Evidence
- Added `global/context/` root docs.
- Generated selector files: 32 CTX, 39 SK, 21 AG, 24 B, 6 DOC.
- Added `global/context/**` to installer inventory.
- Updated installer artifact-count tests from 71 to 198 and added context-count assertion.

## Current State
Build complete for requested catalog + installer/test count changes. Validation still pending.

## Next Action
Run focused tests for installer/package coverage, then review diff.
