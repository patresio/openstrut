# [0.5.0](https://github.com/patresio/openstrut/compare/v0.4.1...v0.5.0) (2026-07-28)


### Bug Fixes

* add --platform flag to setup command ([fdc2a4d](https://github.com/patresio/openstrut/commit/fdc2a4dd42d3bd18ca2bb5c05d051c669cad9e10))
* **ci:** repair release workflow ([091b087](https://github.com/patresio/openstrut/commit/091b087b12ebf6cae35c949aacc4e28f820f3de9))
* **evals:** update artifact count to 203 for ot-synthetize addition ([3bd6b9f](https://github.com/patresio/openstrut/commit/3bd6b9fd874a4c1348d5ebb5b5adab00d4f75b89))
* **evals:** update artifact count to 204 for ot-create addition ([3f4d4e9](https://github.com/patresio/openstrut/commit/3f4d4e9ff4b6d6b1181a32991d9b8af6564acebc))
* **installer:** deep-merge opencode.json instead of blocking on conflict ([acc8853](https://github.com/patresio/openstrut/commit/acc88534144293433691e5a848f3203d4660ff5d))
* resolve dirname import bug in plugin-installer and add MIT license ([ab03557](https://github.com/patresio/openstrut/commit/ab03557293f53f03d6fb00216e41063fc6a9d618))
* **tests:** update installer test counts for ot-create (204 artifacts, 9 commands) ([eb6c551](https://github.com/patresio/openstrut/commit/eb6c551ebfa018d78b5ea7c4f2b507550c3d32ab))


### Features

* add Claude Code plugin for multi-platform distribution ([651a79a](https://github.com/patresio/openstrut/commit/651a79acf459258a1b13e89e53742eb066cfbc42)), closes [#12](https://github.com/patresio/openstrut/issues/12)
* add Codex plugin for multi-platform distribution ([b3bbe50](https://github.com/patresio/openstrut/commit/b3bbe50918c727b6534655b03739e20178d792b3)), closes [#12](https://github.com/patresio/openstrut/issues/12)
* add Hermes plugin for multi-platform distribution ([a21d4ab](https://github.com/patresio/openstrut/commit/a21d4abcbbde197005242528679f91c352ea4258)), closes [#12](https://github.com/patresio/openstrut/issues/12)
* add OpenCode plugin for multi-platform distribution ([dd82f63](https://github.com/patresio/openstrut/commit/dd82f63f99851716b34c446e6d98793674422a83)), closes [#12](https://github.com/patresio/openstrut/issues/12)
* add plugin installer for multi-platform distribution ([b71d20c](https://github.com/patresio/openstrut/commit/b71d20ce3d00091cc64a80342c2b0a4120b6a6e2)), closes [#12](https://github.com/patresio/openstrut/issues/12)
* add tool mapping layer for multi-platform distribution ([7541276](https://github.com/patresio/openstrut/commit/7541276054751b44a12119d6df18845009bcac78)), closes [#12](https://github.com/patresio/openstrut/issues/12)
* **agents:** enforce branch-per-task per ADR-005 ([b5db906](https://github.com/patresio/openstrut/commit/b5db906c0e4910d60a8a94c9afec58d2e5873d8b)), closes [#7](https://github.com/patresio/openstrut/issues/7)
* **agents:** enforce branch-per-task per ADR-005 ([e663654](https://github.com/patresio/openstrut/commit/e66365401b188c76696c8548ba6e385572681b46)), closes [#7](https://github.com/patresio/openstrut/issues/7)
* **commands:** add ot-create project analyzer command ([cc88860](https://github.com/patresio/openstrut/commit/cc88860cf11c9231ba7897b37c3dcd87fa9123c5)), closes [#10](https://github.com/patresio/openstrut/issues/10)
* **commands:** add ot-goal autonomous loop agent ([e759394](https://github.com/patresio/openstrut/commit/e759394efc045fa727487bb1d737d1c25f8fcd8a)), closes [#11](https://github.com/patresio/openstrut/issues/11)
* **commands:** add ot-synthetize unified idea refinement command ([2abdc82](https://github.com/patresio/openstrut/commit/2abdc827f4476ea53bacd49fe048315dbee55c20)), closes [#9](https://github.com/patresio/openstrut/issues/9)
* **commands:** add ot-synthetize unified idea refinement command ([eecfc87](https://github.com/patresio/openstrut/commit/eecfc87ab948e9ad91f31b07fbb710c4bbfd5dec)), closes [#9](https://github.com/patresio/openstrut/issues/9)

# OpenStrut Changelog (formerly OpenCode Engineering Harness)

All changes are documented here; this file is excluded from the npm package. Package versions are tagged by Git and used for distribution.

## v0.4.1 (2026-07-17)

### Fixed

- **`--force` flag**: Now overwrites all conflicts (unmanaged-conflict + managed-locally-modified), not just unmanaged. Manifest corruption still blocks.
- **OpenCode config**: No longer adds `openstrut` metadata key (OpenCode rejects unknown keys).
- **Env vars**: `BASE_URL_9ROUTER` → `NINE_ROUTER_BASE_URL`, `BARSA_MCP` → `BARSA_MCP_URL`, apiKey uses `{env:NINE_ROUTER_API_KEY}` instead of file path.
- **Setup menu**: OpenCode is now default — pressing Enter installs OpenCode without selecting other CLIs.

## v0.4.0 (2026-07-17)

### Added

- **Multi-CLI installer** (`openstrut setup`): Interactive TUI for configuring OpenCode, Codex, Claude Code, Aider, Goose, and Cursor. Supports `--cli`, `--home`, `--dry-run`, `--json` flags.
- **`--force` flag** (`openstrut install --force`): Overwrites existing files during install. Backs up user files before overwriting. Skips all conflicts except manifest corruption.
- **OpenCode as default in setup menu**: Pressing Enter installs OpenCode without selecting other CLIs.
- **4 new skills**: `opentrust-grilling` (interview pattern), `opentrust-domain-modeling` (living glossary + ADR 3-gate), `opentrust-handoff` (context compactation), `opentrust-diagnose` (6-phase bug diagnosis).
- **Permission isolation tests**: Tests verifying no wildcard `"*": "allow"` in opencode.jsonc agent permissions.
- **Multi-team isolation guide**: `docs/usage/multi-team-isolation.md` — file ownership, branch strategy, conflict prevention.
- **SK→runtime skill mapping**: `global/context/skills/MAPPING.md` maps selector IDs to installed skills.

### Changed

- **Skills enrichment**: Enhanced `opentrust-review` (two-axis: Standards + Spec, Fowler code smell baseline) and `opentrust-tdd` (seams-first discipline, vertical slices).
- **Agent reference profiles**: 11 agents updated with references to new skills.
- **Reference map coherence**: Removed references to 4 non-existent files (CONTEXTS.md, SKILLS.md, BUNDLES.md, OFFICIAL_DOCS.md). `global/context/` is SSoT.
- **TEAM_CONTEXT_MATRIX**: Skills section completed for all 9 teams.
- **Orphan CTXs deprecated**: CTX04, CTX05, CTX06, CTX07, CTX11, CTX13, CTX32 marked deprecated.
- **OPERATIONAL_RETRIEVAL_MAP**: Corrected `OFFICIAL_DOCS.md` reference to `global/context/docs/`.

### Removed

- **`mapa_operacional.xlsx`**: Deleted — Barsa MCP API (`/api/selectors`) is SSoT for selectors.

### Fixed

- **Engineering-lead permissions**: Restricted in opencode.jsonc (edit scoped to `src/**`/`tests/**`, bash scoped to npm test/node/git).
- **Feature-implementer contradiction**: Permission Seams now match frontmatter.
- **CONTRIBUTING.md**: Removed hardcoded `/srv/projects/openstrut` path.

## v0.3.1 (2026-07-08)

### Fixed

- `global/tui.json` is now tracked and shipped again so `npx github:patresio/openstrut install` installs the OpenCode keybinding config.
- Root `/tui.json` remains ignored for local per-project theme overrides.

## v0.3.0 (2026-07-08)

### Added

- **Delegation architecture**: `## Delegation Workflow` section (PLAN→DELEGATE→COLLECT→SYNTHESIZE→VALIDATE→REPORT) added to all 9 lead prompts. Leads now explicitly forbidden from implementing work themselves.
- **build agent**: New general-purpose worker agent with `edit: allow`, `bash: allow`, `task: deny` — sits at the bottom of the delegation chain.
- **Model routing**: Added `opencode` provider (Big Pickle, DeepSeek V4 Flash Free, MiMo V2.5 Free). Leads + build use `opencode/big-pickle`; 20 lightweight subagents use `9router/combo-cheap`.
- **Task plan**: HARNESS-001.md documents the delegation fix implementation.

### Changed

- **Permissions**: Engineering-lead restricted (edit scoped to `src/**`/`tests/**`, bash scoped to npm test/node/git). Subagent frontmatter permissions simplified and aligned with `opencode.json`. Removed legacy `external_directory` and `skill` permission blocks.
- **AG references replaced**: `agent_id: AG20/AG21` removed from agent frontmatter. `cowork_agents` updated from AG codes to current agent names. TEAM_CONTEXT_MATRIX, MCP_PROVIDER_CONTRACT, README, and OPERATIONAL_RETRIEVAL_MAP cleared of legacy AG01-AG21 references.
- **Inventory**: Increased from 69 to 70 artifacts, 38 to 39 agents.

## v0.2.3 (2026-07-08)

### Added

- `tui.json` — installable OpenCode TUI keybinding configuration with custom leader key (`ctrl+o`) and optimized navigation bindings. Installed as root config alongside `AGENTS.md` and `opencode.json`.
- Legacy agents (18), commands (10), and skills (39) archived to `archive/global/` — removed from active source tree, preserved for reference.
- `docs/usage/agents.md` now includes individual role descriptions for each lead agent.
- `mapa_operacional.xlsx` updated with OpenTrust runtime entries (38 agents, 7 skills, 7 commands, 6 workflows, 3 bundles, 1 project, 4 docs, 6 prompts).

### Changed

- **Inventory**: increased from 68 to 69 artifacts — added `tui.json` as new root config file.
- **Tests**: updated artifact count assertions; rollback test refactored for new inventory layout; removed legacy skill-specific tests (SK29–SK31); updated manifest fixture skills to `opentrust-*` variants.

## v0.2.2 (2026-07-08)

### Added

- OpenTrust runtime docs package: 10 files installed to `opentrust/docs/` and `opentrust/reference-map/` inside the config root.
- `opencode.json` instructions and references now point to `opentrust/` paths instead of uninstalled `docs/opencode/`.

### Changed

- **Permission source of truth**: removed `permission:` frontmatter block from all 9 lead agent files (`trust-lead`, `product-lead`, `architecture-lead`, `engineering-lead`, `quality-lead`, `review-lead`, `devops-lead`, `delivery-lead`, `knowledge-lead`). The installed `global/opencode.json` is now the sole permission authority for all agents, resolving the `task: deny` vs `task: allow` conflict.
- **Command prompts**: all 7 `/ot-*` commands rewritten — no longer reference `docs/opencode/` paths; use installed `opentrust/docs/` or skip loading (status, incident). Added explicit boundary: no retrieval/Barsa calls unless task contract specifies approved selectors.
- **Retrieval policy**: lead agents updated to use retrieval/Barsa conditionally instead of as default behavior. Knowledge team remains the sole retrieval coordinator.
- **Inventory**: reduced from 76 to 68 artifacts — removed 8 legacy workflow definitions that reference uninstalled agents/skills. Workflow source files remain in the repository for future migration.
- **Installation layout**: installed runtime no longer ships workflows. New `opentrust/docs/` and `opentrust/reference-map/` directories provide self-contained documentation.

### Removed

- 8 legacy workflow definitions removed from install inventory (`backend-safe-change`, `harness-generation`, `project-documentation`, `feature-spec-to-build`, `product-to-implementation`, `rag-feature-sequential`, `team-cowork-worktree`, `full-harness-orchestration`).

## v0.2.1 (2026-07-07)

### Added

- OpenTrust install cleanup: `openstrut install` now removes stale previously-managed legacy artifacts that are no longer in the current inventory when their installed checksum still matches the manifest.
- Installer regression test covering stale managed cleanup while preserving locally modified legacy files.

### Changed

- OpenTrust runtime is the active installable baseline: `trust-lead` default agent, 38 agents total, 7 `ot-*` commands, and 7 `opentrust-*` skills.
- Installation docs and usage docs now describe the OpenTrust runtime instead of the legacy `build` / `eng-*` workflow.

## v0.2.0 (2026-07-06)

### Added

- HARNESS-019: Documentation and versioning governance (AGENTS.md, CHANGELOG.md, README.md, docs/ARCHITECTURE.md updates).
- HARNESS-020: Normalized stale task plan statuses; hardened `opencode.json` from wildcard `"*": "allow"` to granular permissions.
- HARNESS-021: Barsa CTX routing documentation (`docs/barsa/ctx-routing.md`).
- HARNESS-022: Architecture Decision Records (`docs/decisions/ADR-001` through `ADR-004`).
- HARNESS-023: Permission regression tests (`tests/global/permission-hardening.test.js` — 8 tests).
- HARNESS-024: Global config analyzer decision (not needed; covered by existing agents).
- HARNESS-026: `skill-creator` agent (AG18) for generating new skills following SKILL.md pattern.
- HARNESS-027: Batch 1-3 skills and agents:
  - 8 new skills: SK32 (performance-engineering), SK33 (release-management), SK34 (compliance-audit), SK35 (database-design), SK36 (observability-design), SK37 (accessibility-review), SK38 (localization), SK39 (privacy-review).
  - 3 new agents: AG19 (performance-optimizer), AG20 (release-manager), AG21 (compliance-auditor).
  - Updated inventory from 73 to 84 artifacts, 18 to 21 agents, 31 to 39 skills.
  - Tests updated from 492 to 556 (0 fail).
- HARNESS-028: CI workflow (GitHub Actions matrix on Node 20/22, `npm test` + `npm pack --dry-run`).
- HARNESS-029: All 21 agents and 39 skills registered in `opencode.json` for task/skill delegation.

### Changed

- **Security:** `opencode.json` permission scheme hardened — removed `"*": "allow"`, replaced with `read/glob/grep/list/question: allow`, `edit/bash/skill/task/external_directory: ask`. Build agent gets `edit: allow`, plan agent gets `edit: deny`.
- **Installer:** Ships 84 artifacts (up from 72) across `global/`, `templates/`, `workflows/`.
- **Documentation:** `docs/barsa/agents.md`, `docs/barsa/skills.md`, `docs/barsa/ctx-routing.md` created/updated with new artifacts.
- **Config:** `global/opencode.json` and `~/.config/opencode/opencode.json` both updated with full agent definitions and expanded task/skill permissions.
- **CI workflow:** expanded to run `eval:deterministic` in addition to `npm test` and `npm pack --dry-run`.
- **Test scripts:** `npm test` and `npm run test:all` now include `tests/global/permission-hardening.test.js`; `test:all` is now a true superset of `test`.

### Removed

- Docker Desktop Commander (`mcp/desktop-commander`) — image deleted, MCP server removed from catalog.
- `GEMINI.md` marked as legacy — superseded by `AGENTS.md`.

### Infrastructure

- Repository published to `github.com/patresio/openstrut` (private).
- CI pipeline (GitHub Actions) operational — 556 tests pass, package validates on Node 20 and 22.

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
