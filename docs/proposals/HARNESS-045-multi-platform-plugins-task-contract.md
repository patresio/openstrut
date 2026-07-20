# Task: Multi-Platform Plugin Distribution for OpenTrust

## Objective

Transform OpenStrut from an OpenCode-only installer into a multi-platform plugin framework that distributes agents, skills, and workflows to OpenCode, Claude Code, Codex, and Hermes-Agent while maintaining the team coordination essence.

## Acceptance Criteria

- [ ] Plugin manifest format defined for each platform
- [ ] OpenCode plugin created (`.opencode/plugins/opentrust.js`)
- [ ] Claude Code plugin created (`.claude-plugin/plugin.json` + skills)
- [ ] Codex plugin created (`.codex-plugin/plugin.json` + skills)
- [ ] Hermes plugin created (`plugin.yaml` + `__init__.py`)
- [ ] Bootstrap injection works on all platforms
- [ ] Tool mapping layer handles platform differences
- [ ] `openstrut setup --platform <name>` installs correct plugin
- [ ] All 266 existing tests pass
- [ ] Documentation updated for multi-platform installation

## Scope

### In Scope

1. **Plugin Manifests** — Define plugin.json/plugin.yaml for each platform
2. **Bootstrap Injection** — Inject OpenTrust context at session start
3. **Tool Mapping** — Map OpenTrust commands to platform-specific tools
4. **Skill Adaptation** — Adapt 11 skills for each platform's tool system
5. **Agent Adaptation** — Adapt 40 agents for each platform's agent system
6. **Context Distribution** — Distribute 32 CTX + 24 B bundles
7. **Installer Update** — Update `openstrut setup` to install plugins
8. **Documentation** — Platform-specific installation guides

### Out of Scope

1. **Skill Format Changes** — Keep SKILL.md format, add platform wrappers
2. **Agent Topology Changes** — Keep 9-team structure, adapt for platforms
3. **Retrieval System Changes** — Keep CTX/B selectors, make portable
4. **New Features** — No new commands/skills/agents in this task
5. **Platform-Specific Optimizations** — Generic first, optimize later

## Retrieval Context

### Required Contexts

- **CTX01** — OpenTrust foundation (team topology, workflow, contracts)
- **CTX03** — Operational retrieval map (selectors, bundles, contexts)
- **CTX17** — Engineering workflow (TDD, implementation, review)
- **CTX23** — Task contracts (retrieval context, acceptance criteria)

### Required Bundles

- **B01** — Foundation (team topology, workflow, contracts)
- **B11** — Engineering (TDD, implementation, review)

### Required Skills

- **SK01** — opentrust-task-contract (task contract creation)
- **SK03** — opentrust-reference-research (retrieval by selectors)

### Official Docs

- **DOC_OPENCODE_CONFIG** — OpenCode configuration format
- **DOC_OPENCODE_AGENTS** — OpenCode agent definition format

### Provider

- operational-reference-map

### Policy

- synthesize-only
- no raw chunks in commits
- cite source IDs when available
- use only approved selectors

## Test Plan

### Unit Tests

1. **Plugin Manifest Tests** — Validate manifest format for each platform
2. **Bootstrap Injection Tests** — Verify context injection at session start
3. **Tool Mapping Tests** — Verify OpenTrust commands map correctly
4. **Skill Adaptation Tests** — Verify skills work with platform tools
5. **Installer Tests** — Verify `openstrut setup --platform` works

### Integration Tests

1. **OpenCode Plugin Test** — Install and verify plugin loads
2. **Claude Code Plugin Test** — Install and verify plugin loads
3. **Codex Plugin Test** — Install and verify plugin loads
4. **Hermes Plugin Test** — Install and verify plugin loads

### E2E Tests

1. **Cross-Platform Skill Test** — Run same skill on multiple platforms
2. **Agent Compatibility Test** — Verify agents work across platforms
3. **Context Distribution Test** — Verify CTX/B bundles distributed correctly

## Microincrements

### MI1: Plugin Architecture Design (2-3 days)

- Define plugin manifest format for each platform
- Design bootstrap injection mechanism
- Design tool mapping layer
- Create architecture decision record

**Files:**
- `docs/decisions/ADR-007-multi-platform-plugin-architecture.md`
- `docs/design/011-multi-platform-plugin-system.md`

### MI2: OpenCode Plugin (2-3 days)

- Create `.opencode/plugins/opentrust.js`
- Implement bootstrap injection
- Implement tool mapping for OpenCode
- Test plugin loads correctly

**Files:**
- `.opencode/plugins/opentrust.js`
- `tests/plugins/opencode.test.js`

### MI3: Claude Code Plugin (3-4 days)

- Create `.claude-plugin/plugin.json`
- Create `skills/` directory with SKILL.md files
- Implement bootstrap injection
- Implement tool mapping for Claude Code
- Test plugin loads correctly

**Files:**
- `.claude-plugin/plugin.json`
- `skills/*/SKILL.md` (11 skills)
- `tests/plugins/claude.test.js`

### MI4: Codex Plugin (3-4 days)

- Create `.codex-plugin/plugin.json`
- Create `skills/` directory with SKILL.md files
- Implement bootstrap injection
- Implement tool mapping for Codex
- Test plugin loads correctly

**Files:**
- `.codex-plugin/plugin.json`
- `skills/*/SKILL.md` (11 skills)
- `tests/plugins/codex.test.js`

### MI5: Hermes Plugin (4-5 days)

- Create `plugin.yaml` manifest
- Create `__init__.py` with `register(ctx)` function
- Implement tools via `ctx.register_tool()`
- Implement hooks via `ctx.register_hook()`
- Implement skills via `ctx.register_skill()`
- Test plugin loads correctly

**Files:**
- `plugins/opentrust/plugin.yaml`
- `plugins/opentrust/__init__.py`
- `plugins/opentrust/tools.py`
- `plugins/opentrust/hooks.py`
- `tests/plugins/hermes.test.js`

### MI6: Tool Mapping Layer (2-3 days)

- Create tool mapping interface
- Implement OpenCode tool mappings
- Implement Claude Code tool mappings
- Implement Codex tool mappings
- Implement Hermes tool mappings

**Files:**
- `src/plugins/tool-mapping.js`
- `src/plugins/opencode-mapping.js`
- `src/plugins/claude-mapping.js`
- `src/plugins/codex-mapping.js`
- `src/plugins/hermes-mapping.js`

### MI7: Installer Update (2-3 days)

- Update `openstrut setup` to support `--platform` flag
- Implement plugin installation for each platform
- Update inventory for new plugin files
- Test installation across platforms

**Files:**
- `src/setup/index.js` (update)
- `src/setup/configure.js` (update)
- `src/installer/inventory.js` (update)

### MI8: Documentation (2-3 days)

- Create platform-specific installation guides
- Update main README for multi-platform support
- Create plugin development guide
- Update WORKFLOW.md for plugin usage

**Files:**
- `docs/installation/opencode.md`
- `docs/installation/claude.md`
- `docs/installation/codex.md`
- `docs/installation/hermes.md`
- `docs/guides/plugin-development.md`
- `README.md` (update)

## Definition of Done

- [ ] All acceptance criteria met
- [ ] All 266 existing tests pass
- [ ] New plugin tests pass
- [ ] Documentation complete
- [ ] Code reviewed and approved
- [ ] Committed with conventional commit message
- [ ] Merged to main branch

## Risks

1. **Platform API Changes** — Plugin APIs may change between versions → Mitigation: Pin platform versions in tests
2. **Tool Mapping Complexity** — Different platforms have different tools → Mitigation: Start with minimal mapping, iterate
3. **Agent Compatibility** — 40 agents may not work everywhere → Mitigation: Start with core agents, add others later
4. **Maintenance Burden** — Multiple plugins to maintain → Mitigation: Shared code, automated testing

## Dependencies

1. **Platform Documentation** — Need complete plugin API docs for each platform
2. **Platform Access** — Need access to each platform for testing
3. **Existing Tests** — Must not break existing 266 tests
4. **Inventory System** — Must update inventory for new files

## References

- Superpowers: https://github.com/obra/superpowers
- Hermes Plugin System: https://hermes-agent.nousresearch.com/docs/developer-guide/plugins
- Claude Code Plugins: https://code.claude.com/docs/en/plugins
- Codex Plugins: https://developers.openai.com/codex/plugins
- OpenTrust Workflow: docs/opencode/WORKFLOW.md
- OpenTrust Task Contract: docs/opencode/TASK_CONTRACT.md
