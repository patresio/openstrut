# HARNESS-020 — Reconciliation and Hardening (Bundled)

**Classification:** implementation (documentation, security, governance)
**Status:** in_progress

**Scope:**
- HARNESS-020: Normalize stale task plan statuses; remove duplicate HARNESS-012.md
- HARNESS-021: Security hardening (repo opencode.json perms, MCP trust doc, Docker de-risk)
- HARNESS-022: Map CTX14/23/27/29/30/31 in docs/barsa/
- HARNESS-023: Create minimal ADRs (installer safety, artifact topology, SDD manifest, MCP trust)
- HARNESS-024: Add permission regression tests + per-agent/skill eval cases
- HARNESS-025: Decide global-config-analyzer agent

**Exclusions:**
- No production code behavior changes
- No package publish
- No live OpenCode config mutation
- No global `~/.config/opencode` changes

## Workflow Checklist
- [x] Explore
- [x] Proposal (approved by user)
- [x] Planning
- [x] Approval Gate
- [x] Build (HARNESS-020)
- [x] Build (HARNESS-021)
- [x] Build (HARNESS-022)
- [x] Build (HARNESS-023)
- [x] Build (HARNESS-024)
- [x] Build (HARNESS-025)
- [x] Review
- [x] Archive
- [ ] Commit
- [ ] Push
