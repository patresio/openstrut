# HARNESS-015 — Barsa MCP Retrieval Model

Classification: implementation
Status: in_progress
Approval evidence: user chose option 1 after detailed explore: remove `/srv/docs/biblioteca` references, replace with Barsa MCP model, organize docs/catalog only, no new executable agents/skills.
Scope: remove hardcoded biblioteca path references from project docs, define Barsa MCP as canonical retrieval boundary, add minimal Barsa catalog docs derived from `mapa_operacional.xlsx`, update project instructions and architecture accordingly.
Exclusions: no code changes, no package changes, no installer/runtime behavior changes, no new global agents/skills, no commit/push, no inclusion of `references/tips/future-tips.md`, `tui.json`, or `mapa_operacional.xlsx` in commit scope.

## Checklist

- [x] Explore
  - Evidence: searched repo for `/srv/docs/biblioteca`; audited Barsa health/collections; inspected `mapa_operacional.xlsx` contexts/skills/agents/bundles/projects.
- [x] Proposal
  - Evidence: proposed option 1 minimal doc/catalog change; user approved by choosing `1`.
- [x] Planning
  - Evidence: ordered microincrements: task plan, remove path refs, add Barsa docs, update AGENTS/ARCHITECTURE, validate.
- [x] Approval Gate
  - Evidence: user selected approved option and switched to build mode.
- [x] Build
  - Evidence: removed `/srv/docs/biblioteca` from reference manifests; added `docs/barsa/` catalog docs; added `docs/design/004-barsa-mcp-retrieval-model.md`; updated `AGENTS.md` and `docs/ARCHITECTURE.md`.
- [x] Review
  - Evidence: validated remaining path mentions are policy/design references only; inspected changed-file list; `npm test` and `npm run test:manifest` passed.
- [x] Archive
  - Evidence: canonical project docs and design docs updated; no separate archive artifact required.
- [ ] Commit
- [ ] Push
- [ ] Pull Request

Current state: HARNESS-015 expanded into broader documentation organization using Barsa MCP as retrieval boundary; docs index added, README/CONTRIBUTING/GEMINI aligned, and architecture/design docs updated.
Next action: split commit groups cleanly and commit only if user approves delivery.
