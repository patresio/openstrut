# HARNESS-016 — Operational Usage and Installation Documentation

Classification: documentation
Status: in_progress
Approval evidence: user approved proposal to document current agents, skills, commands, Barsa MCP usage, and remote installation for release `v0.1.0`.
Scope: create operational documentation under `docs/usage/`, update indexes, and document SSH/SCP + npm exec install flow.
Exclusions: no code changes, no package metadata changes, no new executable agents/skills, no npm publication, no push, no changes to global OpenCode config.

## Checklist

- [x] Explore
  - Evidence: inspected current agents, commands, skills, docs, release artifacts, and Barsa MCP docs/search results.
- [x] Proposal
  - Evidence: proposed usage docs structure and user approved.
- [x] Planning
  - Evidence: ordered microincrements: task plan, usage docs, index links, validation.
- [x] Approval Gate
  - Evidence: user said "Aprovado" and switched to build mode.
- [x] Build
  - Evidence: created `docs/usage/` guide set covering agents, skills, commands, Barsa MCP integration, SSH tarball install, npm exec, and verification.
- [x] Review
  - Evidence: `npm test`, `npm run test:manifest`, `npm pack --dry-run --ignore-scripts`, and `git diff --check` passed.
- [x] Archive
  - Evidence: durable usage docs and docs index updated; no separate archive artifact required.
- [ ] Commit
- [ ] Push
- [ ] Pull Request

Current state: operational usage and installation documentation complete and validated.
Next action: commit only if user explicitly approves delivery.
