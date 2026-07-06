# OpenCode Engineering Harness Changelog

All changes are documented here; this file is excluded from the npm package (`references/` is excluded). Package versions are tagged by Git and used for distribution.

## v0.1.0 (2026-06-16)

### Added
- HARNESS-001: Repository foundation, architecture, and structure.
- HARNESS-002: Global OpenCode configuration (`AGENTS.md`, `opencode.json`).
- HARNESS-003: Global agents (`code-reviewer`, `project-rules-auditor`, `sdd`).
- HARNESS-004: Global agent topology and permissions.
- HARNESS-005: Engineering skills (`engineering-task-plan`, `engineering-tdd-first`, `engineering-bdd-discovery`, `engineering-legacy-change`, `engineering-code-review`, `engineering-delivery`, `engineering-incident-triage`).
- HARNESS-006: Workflow commands (`/eng-plan`, `/eng-resume`, `/eng-checkpoint`, `/eng-status`, `/eng-review`, `/eng-deliver`, `/eng-incident`).
- HARNESS-007: Project bootstrap templates and scaffolds.
- HARNESS-008: Safe installer and distribution foundation (plan, install, check, generate-manifest, Atomic rollback, symlink safety, inventory and manifest).
- HARNESS-009: Runtime evaluation framework (deterministic and live OpenCode runtime evaluations).
- HARNESS-010: SDD agent and change specification workflow (DISCOVER → SCOPE → DRAFT → EXAMPLES → APPROVAL GATE).
- HARNESS-011: Change execution manifest (executor for OpenSpec changes, Tasks with IDs, policies).
- HARNESS-012: Root `AGENTS.md` project-specific guidance (verified and ready for commit).
- HARNESS-013: Documentation reconciliation (sync phase, scope, architecture docs; 201 tests; pass).
- HARNESS-014: Organization backlog (Plan review, commit ready, Milestone 1/2/3 status).
- HARNESS-015: Barsa MCP retrieval model (catalog design, OpenCode integration, version policies).
- HARNESS-016: Operational usage installation (admin user guide, skip fragile updates, roadmap).
- HARNESS-017: Global agents and skills documentation (agents.md, skills.md, spreadsheet curation).
- HARNESS-018: Global domain agents and workflows (research, XLSX curation, design docs: 10-Global-Agorra's, 011-Sequencial FLUX, 012-Cowork-Worktree, 013-Docker-runtime).

## No published releases

No package has been published to public registries. Distribution is planned from the homelab after explicit user approval.

## Notes

- Content is oriented to the developer team; changes to live OpenCode configuration are permitted only after explicit approval and via controlled installer flow.
- All work honors the Task Plan, Approval Gate, and approval boundaries; no silent scope expansion is permitted.
- Version alignment is with manual release practices; package-lock, lockfiles, and dependency management are not part of this project to keep scope minimal.