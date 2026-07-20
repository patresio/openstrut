# HARNESS-045: Multi-Platform Plugin Distribution

## Objective
Transform OpenStrut into a multi-platform plugin framework that distributes agents, skills, and workflows to OpenCode, Claude Code, Codex, and Hermes-Agent while maintaining the team coordination essence.

## Classification
Feature

## Status
- [x] Approved (HARNESS-045 approval gate)
- [ ] In Progress
- [x] Complete

## Evidence
- Task contract: `docs/proposals/HARNESS-045-multi-platform-plugins-task-contract.md`
- Exploration report: `docs/explore/HARNESS-045-multi-platform-exploration.md`
- User approval: HARNESS-045 approval gate

## Scope
### In Scope
- Plugin manifest format for all 4 platforms
- Bootstrap injection for all platforms
- Tool mapping layer for platform differences
- Installer updates with `--platform` flag
- Platform-specific documentation

### Out of Scope
- Skill format changes (keep SKILL.md)
- Agent topology changes (keep 9-team structure)
- Retrieval system changes (keep CTX/B selectors)
- New features (no new commands/skills/agents)
- Platform-specific optimizations (generic first)

## Assumptions
- Platform plugin APIs are stable
- Existing 266 tests continue to pass
- Users have access to all 4 platforms for testing

## Risks
1. **Platform API Changes** → Pin platform versions in tests
2. **Tool Mapping Complexity** → Start with minimal mapping, iterate
3. **Agent Compatibility** → Start with core agents, add others later
4. **Maintenance Burden** → Shared code, automated testing

## Issue
- HARNESS-045: Multi-Platform Plugin Distribution

## Branch
- feat/harness-045-multi-platform

## Base
- main (v0.4.1 + ADR-005 + ADR-006 + ot-synthetize + ot-create + ot-goal)

## Affected Files
### New Files
- `.opencode/plugins/opentrust.js` (OpenCode plugin)
- `.claude-plugin/plugin.json` (Claude Code plugin)
- `.claude-plugin/skills/*/SKILL.md` (Claude Code skills)
- `.codex-plugin/plugin.json` (Codex plugin)
- `.codex-plugin/skills/*/SKILL.md` (Codex skills)
- `plugins/opentrust/plugin.yaml` (Hermes plugin)
- `plugins/opentrust/__init__.py` (Hermes plugin)
- `plugins/opentrust/tools.py` (Hermes tools)
- `plugins/opentrust/hooks.py` (Hermes hooks)
- `src/plugins/tool-mapping.js` (Tool mapping interface)
- `src/plugins/opencode-mapping.js` (OpenCode mapping)
- `src/plugins/claude-mapping.js` (Claude mapping)
- `src/plugins/codex-mapping.js` (Codex mapping)
- `src/plugins/hermes-mapping.js` (Hermes mapping)
- `tests/plugins/opencode.test.js` (OpenCode tests)
- `tests/plugins/claude.test.js` (Claude tests)
- `tests/plugins/codex.test.js` (Codex tests)
- `tests/plugins/hermes.test.js` (Hermes tests)
- `docs/installation/opencode.md` (OpenCode guide)
- `docs/installation/claude.md` (Claude guide)
- `docs/installation/codex.md` (Codex guide)
- `docs/installation/hermes.md` (Hermes guide)
- `docs/guides/plugin-development.md` (Plugin dev guide)
- `docs/decisions/ADR-007-multi-platform-plugin-architecture.md` (ADR)

### Modified Files
- `src/setup/index.js` (add --platform flag)
- `src/setup/configure.js` (add plugin installation)
- `src/installer/inventory.js` (update artifact count)
- `README.md` (update for multi-platform)
- `docs/opencode/WORKFLOW.md` (update for plugins)

## Microincrements

### MI1: Plugin Architecture Design + ADR-007
- [x] Define plugin manifest format for each platform
- [x] Design bootstrap injection mechanism
- [x] Design tool mapping layer
- [x] Create ADR-007

### MI2: OpenCode Plugin
- [x] Create `.opencode/plugins/opentrust.js`
- [x] Implement bootstrap injection
- [x] Implement tool mapping for OpenCode
- [x] Test plugin loads correctly

### MI3: Claude Code Plugin
- [x] Create `.claude-plugin/plugin.json`
- [x] Create `skills/` directory with SKILL.md files
- [x] Implement bootstrap injection
- [x] Implement tool mapping for Claude Code
- [x] Test plugin loads correctly

### MI4: Codex Plugin
- [x] Create `.codex-plugin/plugin.json`
- [x] Create `skills/` directory with SKILL.md files
- [x] Implement bootstrap injection
- [x] Implement tool mapping for Codex
- [x] Test plugin loads correctly

### MI5: Hermes Plugin
- [x] Create `plugin.yaml` manifest
- [x] Create `__init__.py` with `register(ctx)` function
- [x] Implement tools via `ctx.register_tool()`
- [x] Implement hooks via `ctx.register_hook()`
- [x] Implement skills via `ctx.register_skill()`
- [x] Test plugin loads correctly

### MI6: Tool Mapping Layer
- [x] Create tool mapping interface
- [x] Implement OpenCode tool mappings
- [x] Implement Claude Code tool mappings
- [x] Implement Codex tool mappings
- [x] Implement Hermes tool mappings

### MI7: Installer Update
- [x] Update `openstrut setup` to support `--platform` flag
- [x] Implement plugin installation for each platform
- [x] Update inventory for new plugin files
- [x] Test installation across platforms

### MI8: Documentation
- [x] Create platform-specific installation guides
- [x] Update main README for multi-platform support
- [x] Create plugin development guide
- [x] Update WORKFLOW.md for plugin usage

## TDD Strategy
- RED: Write failing test for plugin manifest validation
- GREEN: Implement plugin manifest generation
- REFACTOR: Clean up plugin code

## Validation
- Run `npm test` — all 266 tests pass
- Run `npm run test:installer` — installer tests pass
- Run `npm run eval:deterministic` — evals pass
- Manual test: Install plugin on each platform

## Review
- [ ] Code reviewed
- [ ] Tests reviewed
- [ ] Documentation reviewed
- [ ] Security reviewed

## Delivery
- [ ] Committed with conventional commit message
- [ ] Merged to main branch
- [ ] Inventory updated
- [ ] WORKFLOW.md updated

## Evidence Log
| Step | Date | Evidence |
|------|------|----------|
| Approved | 2026-07-12 | HARNESS-045 approval gate |
| MI1 Started | 2026-07-12 | Created feature branch feat/harness-045-multi-platform |
| MI1 Complete | 2026-07-12 | ADR-007 and Design 011 created and committed |
| MI2 Started | 2026-07-12 | Created OpenCode plugin |
| MI2 Complete | 2026-07-12 | OpenCode plugin tests passing (39 tests) |
| MI3 Started | 2026-07-12 | Created Claude Code plugin |
| MI3 Complete | 2026-07-12 | Claude Code plugin tests passing (31 tests) |
| MI4 Started | 2026-07-12 | Created Codex plugin |
| MI4 Complete | 2026-07-12 | Codex plugin tests passing (31 tests) |
| MI5 Started | 2026-07-12 | Created Hermes plugin |
| MI5 Complete | 2026-07-12 | Hermes plugin tests passing (51 tests) |
| MI6 Started | 2026-07-12 | Created tool mapping layer |
| MI6 Complete | 2026-07-12 | Tool mapping tests passing (40 tests) |
| MI7 Started | 2026-07-12 | Created plugin installer |
| MI7 Complete | 2026-07-12 | Plugin installer tests passing (26 tests) |
| MI8 Started | 2026-07-12 | Created documentation |
| MI8 Complete | 2026-07-12 | Documentation complete (4 installation guides + 1 development guide) |

## Current State
- Task Plan: Created
- Branch: feat/harness-045-multi-platform
- MI1: Complete (ADR-007 + Design 011)
- MI2: Complete (OpenCode plugin + 39 tests)
- MI3: Complete (Claude Code plugin + 31 tests)
- MI4: Complete (Codex plugin + 31 tests)
- MI5: Complete (Hermes plugin + 51 tests)
- MI6: Complete (Tool Mapping Layer + 40 tests)
- MI7: Complete (Plugin Installer + 26 tests)
- MI8: Complete (Documentation)
- Next Action: Ready for review and merge
- Blockers: None
- Blockers: None
