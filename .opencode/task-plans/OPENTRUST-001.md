# Task Plan: OPENTRUST-001

## Phase 1 — Foundation Documentation & Operational Retrieval Map

### Status
- [x] Explore (completed in previous session)
- [x] Proposal (completed in previous session)
- [x] Approval Gate (approved 2026-07-07 — scope: Phase 1 only)
- [x] Build (Phase 1 — 10 files complete)
- [ ] Review (pending user review)
- [ ] Archive (pending approval)
- [ ] Commit (pending approval)
- [ ] Push (pending approval)
- [ ] Pull Request (pending approval)

### Approved Scope
Create 10 files under `docs/opencode/`:

Foundation docs:
1. `docs/opencode/TEAM_TOPOLOGY.md`
2. `docs/opencode/WORKFLOW.md`
3. `docs/opencode/TASK_CONTRACT.md`
4. `docs/opencode/PERMISSIONS.md`
5. `docs/opencode/OBSERVABILITY.md`
6. `docs/opencode/OPERATIONAL_RETRIEVAL_MAP.md`
7. `docs/opencode/REFERENCE_PROFILES.md`

Reference map:
8. `docs/opencode/reference-map/README.md`
9. `docs/opencode/reference-map/TEAM_CONTEXT_MATRIX.md`
10. `docs/opencode/reference-map/MCP_PROVIDER_CONTRACT.md`

### Exclusions
- No agents, commands, skills, or plugin creation
- No legacy file modification or archival
- No touching pre-existing modified files: `bin/openstrut.js`, `opencode.json`
- No embedded book content, raw chunks, or internal library names
- No `mapa_operacional.xlsx` raw contents in committed files
- No continuation to Phase 2 without explicit approval

### Rules
- Neutral names: "OpenTrust Reference Library", "Operational Retrieval Map", "Reference Profiles", "Reference Packs", "Retrieval Provider"
- CTX/SK/AG/BUNDLE/DOC selectors only — no inline book lists
- Operational Retrieval Map documents that selectors route to a local retrieval provider, without naming private/internal infrastructure in committed files

### Next Action
Awaiting user review and approval to continue. See full report below.

### Build Evidence
Files created (10/10):
```
docs/opencode/TEAM_TOPOLOGY.md          — 9-team topology with lead/subagent roles
docs/opencode/WORKFLOW.md              — 5-phase workflow with retrieval rules
docs/opencode/TASK_CONTRACT.md         — Task contract template with Retrieval Context
docs/opencode/PERMISSIONS.md           — Granular permission model, no wildcards
docs/opencode/OBSERVABILITY.md         — Logging, monitoring, debugging patterns
docs/opencode/OPERATIONAL_RETRIEVAL_MAP.md — 3-layer retrieval architecture
docs/opencode/REFERENCE_PROFILES.md    — Agent selector declaration format
docs/opencode/reference-map/README.md  — Map index and usage guide
docs/opencode/reference-map/TEAM_CONTEXT_MATRIX.md — 9-team to selector matrix
docs/opencode/reference-map/MCP_PROVIDER_CONTRACT.md — Provider interface contract
```

Validation:
- No banned terms (Barsa, biblioteca, personal library names) in committed content
- No wildcard permissions in new files
- Selectors (CTX/SK/AG/B/DOC) used consistently across all files
- Pre-existing modified files untouched (bin/openstrut.js, opencode.json)
- Neutral naming convention followed throughout

### Evidence
- File listing of `docs/opencode/` with all 10 files
- Summary of each document
- 9-team to CTX/SK/BUNDLE/DOC selector mapping
- Validation commands run
- Git status

---

## Phase 2 — Safe OpenCode Config Draft

### Status
- [x] Explore (reference docs inspected)
- [x] Proposal (user-approved scope)
- [x] Approval Gate (approved 2026-07-07 — scope: Phase 2 only)
- [x] Build (Phase 2 — `opencode.jsonc` created)
- [ ] Review (pending user review)
- [ ] Archive
- [ ] Commit
- [ ] Push
- [ ] Pull Request

### Scope
- Created `opencode.jsonc` as the OpenTrust runtime configuration
- Did NOT modify or replace the existing `opencode.json`

### Build Evidence

**File created:**
- `opencode.jsonc` — proposed runtime configuration (no wildcard `*: "allow"`)

**Validation results:**
- JSONC is valid (passed custom parser)
- No wildcard `*: "allow"` permissions
- No banned terms (Barsa, biblioteca, personal library names)
- 9 primary agents (leads)
- 35 subagents (all with `task: deny`)
- 44 total agents
- 7 `instructions` paths referencing Phase 1 docs
- 2 `references` (reference-map, docs-opencode)
- 9 `watcher.ignore` patterns
- `git diff --check`: no whitespace errors
- Pre-existing modified files untouched

**Count note:** TEAM_TOPOLOGY.md defines 35 subagents (versus original 29 in the early proposal). Phase 1 topology was approved without correction, so 35 was used here.

### Why `opencode.json` Was Left Untouched

The existing `opencode.json` is pre-existing modified and contains `"*": "allow"`. Replacing it now would mix scope. A dedicated microincrement (Phase 2.1) must after confirming:
1. `opencode.jsonc` is valid
2. OpenCode loads it correctly
3. The diff is clean and easy to review
4. It doesn't interfere with `bin/openstrut.js`

### Next Action
Awaiting user review and approval to continue.
