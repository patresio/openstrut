# HARNESS-040: OpenStrut v0.4.0 — System Coherence, Multi-CLI Installer & Skills Enrichment

## Status: IN-PROGRESS

## Classification: implementation + refactoring + feature

## Approval Evidence
- User approved task contract (Propose phase output)
- Scope: 5 phases (A-E), 36 microincrements
- Exclusions: npm publish, ~/.config mutation, observability infra, Docker, new MCP server, Wegner AI

## Scope
### In Scope
- Fase A: Reconciliation & Cleanup (A1-A10)
- Fase B: Reference Map & Catalog (B1-B5)
- Fase C: Multi-CLI Installer (C1-C7)
- Fase D: Skills Enrichment (D1-D8)
- Fase E: Validation & Release (E1-E6)

### Out of Scope
- npm publish (private: true maintained)
- ~/.config mutation
- Observability infra (.opencode/logs/)
- Docker/containerization
- New MCP server (uses existing Barsa)
- Wegner AI
- wayfinder/teach skills (high complexity, niche use)

## Assumptions
- Barsa MCP API is the SSoT for selector resolution (xlsx can be deleted)
- TUI installer in Node.js using readline (zero deps)
- Skills adapted from Matt Pocock are language-agnostic
- Single release v0.4.0 after all phases complete

## Risks
- Matt Pocock skills may have TS-specific assumptions → adapt concepts, not code
- Multi-CLI config formats vary → registry pattern, one module per CLI
- 9 teams may have PR conflicts → branch-per-task, PR gating

## Branch: feat/v0.4.0-coherence-multi-cli
## Base: harness-033-lead-workflow-governance (will rebase to main)

## Affected Boundaries
- root: AGENTS.md, README.md, CHANGELOG.md, package.json, opencode.jsonc
- src/installer/: inventory.js (skills addition)
- src/setup/: NEW directory (C1-C7)
- global/skills/: NEW skill directories (D1-D6)
- global/agents/: 11 files updated with skill references (D7)
- docs/opencode/reference-map/: TEAM_CONTEXT_MATRIX.md, README.md, OPERATIONAL_RETRIEVAL_MAP.md
- tests/setup/: NEW directory (C6-C7)

## Microincrements

### Fase A — Reconciliation & Cleanup — COMPLETE ✅
- [x] A1: Delete mapa_operacional.xlsx
- [x] A2: Clean stale artifacts ($tempHome/, .tgz, eval-output.log)
- [x] A3: Update AGENTS.md → "198 artifacts"
- [x] A4: Fix engineering-lead permissions in opencode.jsonc
- [x] A5: Add 2 missing agents to opencode.jsonc
- [x] A6: Fix feature-implementer contradiction
- [x] A7: Close task plans HARNESS-034/035
- [x] A8: Update CONTRIBUTING.md paths
- [x] A9: Update README.md → v0.4.0
- [x] A10: Run npm test — all pass

### Fase B — Reference Map & Catalog — COMPLETE ✅
- [x] B1: Update reference-map README
- [x] B2: Complete TEAM_CONTEXT_MATRIX skills section
- [x] B3: Mark orphan CTXs as deprecated
- [x] B4: Create SK→runtime mapping
- [x] B5: DOC naming alignment

### Fase C — Multi-CLI Installer — COMPLETE ✅
- [x] C1: CLI registry data model
- [x] C2: detect.js — CLI detection
- [x] C3: menu.js — TUI menu
- [x] C4: configure.js — per-CLI config writer
- [x] C5: mcp.js — MCP server setup
- [x] C6: Wire setup command
- [x] C7: Tests (23 new, 262 total)

### Fase D — Skills Enrichment — COMPLETE ✅
- [x] D1: opentrust-grilling SKILL.md
- [x] D2: opentrust-domain-modeling SKILL.md
- [x] D3: Enhance opentrust-review (two-axis + Fowler smells)
- [x] D4: opentrust-handoff SKILL.md
- [x] D5: opentrust-diagnose SKILL.md
- [x] D6: Enhance opentrust-tdd (seams-first + vertical slices)
- [x] D7: Update 11 agent reference profiles
- [x] D8: Update inventory.js (198→202), test counts updated

### Fase E — Validation & Release
- [ ] E1: Permission isolation test
- [ ] E2: Wildcard scan test
- [ ] E3: Multi-team guide
- [ ] E4: Version bump 0.4.0
- [ ] E5: CHANGELOG v0.4.0
- [ ] E6: CI + GitHub release

## Evidence Log
| Date | Step | Evidence |
|------|------|----------|
| 2026-07-17 | Baseline | 239 pass, 0 fail, branch harness-033-lead-workflow-governance |
| 2026-07-17 | Phase A | Deleted xlsx, cleaned stale, fixed permissions/agents, tests 239/239 |
| 2026-07-17 | Phase B | 5 reference-map fixes, 7 CTXs deprecated, SK mapping created, tests 239/239 |
| 2026-07-17 | Phase C | 6 new src/setup/ modules, 23 tests, inventory 198, tests 262/262 |
| 2026-07-17 | Phase D | 4 new skills, 2 enhanced, 11 agent profiles updated, inventory 202, tests 262/262 |

## Current State
- Phase: D complete, E pending
- Next: E1 (Permission isolation test)
