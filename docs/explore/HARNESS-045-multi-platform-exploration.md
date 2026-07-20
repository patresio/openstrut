# Explore Report: Multi-Platform Distribution

**Status:** Complete  
**Date:** 2026-07-20  
**Author:** trust-lead  
**Classification:** exploration (read-only)

## [STATE]

**Branch:** feat/harness-044-goal  
**Diff:** ADR-006 + ot-goal command (merged PR #14)  
**Git Status:** Clean (only untracked docs/proposals/)  
**Issues:** #10 (closed), #11 (closed), #12 (open), #13 (merged)

## [SCOPE]

### Current Architecture

```
[OpenStrut Repository]
    ├── bin/openstrut.js          # CLI entrypoint
    ├── src/installer/            # Installer logic
    │   ├── inventory.js          # 205 artifacts
    │   ├── install.js            # File installation
    │   ├── plan.js               # Read-only planning
    │   └── check.js              # Drift detection
    ├── src/setup/                # Multi-CLI setup
    │   ├── registry.js           # 6 CLIs defined
    │   ├── detect.js             # CLI detection
    │   ├── configure.js          # Config writer
    │   └── mcp.js                # MCP configuration
    └── global/                   # Platform-agnostic artifacts
        ├── commands/             # 10 commands (ot-*)
        ├── skills/               # 11 skills (opentrust-*)
        ├── agents/               # 40 agents (9 teams + 31 subagents)
        └── context/              # 32 CTX + 24 B bundles
```

### Supported CLIs (src/setup/registry.js)

| CLI | Config Dir | Format | Agent Mechanism |
|-----|------------|--------|-----------------|
| OpenCode | ~/.config/opencode | JSON | opencode.json + .opencode/agents/*.md |
| Codex | ~/.codex | TOML | [agents] in config.toml + AGENTS.md |
| Hermes | ~/.hermes/hermes-agent | YAML | SOUL.md + toolsets |
| Pi | ~/.pi/agent | JSON | Extensions + skills + prompt templates |
| Oh-my-Pi | ~/.oh-my-pi | JSON | Plugins + subagents |
| Antigravity | ~/.antigravity | JSON | Context + plugins |

### Key Difference from Superpowers

| Aspect | Superpowers | OpenStrut |
|--------|-------------|-----------|
| **Architecture** | Plugin-based (thin plugin per platform) | Installer-based (copies files) |
| **Activation** | Automatic (bootstrap injection) | Manual (user invokes commands) |
| **Skill Format** | SKILL.md with frontmatter | SKILL.md with frontmatter ✓ |
| **Agent Support** | 0 agents | 40 agents |
| **Context System** | None | 32 CTX + 24 B bundles |
| **Platform Plugins** | .claude-plugin/, .opencode/plugins/ | None (installer copies files) |

## [RISKS]

### Critical

1. **No Bootstrap Injection** — Superpowers injects "using-superpowers" at session start. OpenStrut requires manual command invocation.
2. **No Platform Plugins** — Superpowers has thin plugins per platform. OpenStrut only has installer.
3. **Agent Compatibility** — 40 agents with complex prompts may not work across all platforms.

### Breaking Changes

1. **Skill Format** — Skills may need platform-specific adaptations (tool mappings).
2. **Agent Definitions** — Agents use OpenCode-specific permissions model.
3. **Context System** — CTX/B selectors are OpenTrust-specific, not portable.

### Dependencies

1. **Platform Plugin APIs** — Each platform has different plugin/extension mechanisms.
2. **Configuration Formats** — JSON, TOML, YAML require different parsers.
3. **Tool Mappings** — Each platform has different tool names and capabilities.

## [SELECTORS]

### Needed Contexts

- **CTX01** — OpenTrust foundation (team topology, workflow, contracts)
- **CTX03** — Operational retrieval map (selectors, bundles, contexts)
- **CTX17** — Engineering workflow (TDD, implementation, review)
- **CTX23** — Task contracts (retrieval context, acceptance criteria)

### Needed Skills

- **SK01** — opentrust-task-contract (task contract creation)
- **SK03** — opentrust-reference-research (retrieval by selectors)
- **SK08** — opentrust-spec-change (structured spec changes)

### Needed Bundles

- **B01** — Foundation (team topology, workflow, contracts)
- **B11** — Engineering (TDD, implementation, review)

### Needed Docs

- **DOC_OPENCODE_CONFIG** — OpenCode configuration format
- **DOC_OPENCODE_AGENTS** — OpenCode agent definition format

## [ANALYSIS]

### What Superpowers Does That We Don't

1. **Bootstrap Injection** — Injects context at session start automatically
2. **Platform Plugins** — Thin adapters per platform that map tools
3. **Automatic Skill Triggering** — Skills activate based on context
4. **Tool Mapping** — Maps skill actions to platform-specific tools

### What We Have That Superpowers Doesn't

1. **40 Agents** — Complete team topology with 9 teams
2. **32 CTX + 24 B** — Semantic selector system for knowledge
3. **10 Commands** — Workflow commands (explore, propose, apply, review, ship)
4. **Permission Model** — Least-privilege agent permissions
5. **Retrieval Context** — CTX/SK/B/DOC selector system

### Gap Analysis

| Capability | Superpowers | OpenStrut | Gap |
|------------|-------------|-----------|-----|
| Multi-platform | ✓ | Partial | Need plugins |
| Bootstrap injection | ✓ | ✗ | Need plugin per platform |
| Automatic activation | ✓ | ✗ | Need context triggers |
| Agent topology | ✗ | ✓ | We have it |
| Semantic selectors | ✗ | ✓ | We have it |
| Workflow commands | ✗ | ✓ | We have it |

## [RECOMMENDATION]

### Option A: Add Plugin Layer (Like Superpowers)

**Approach:** Create platform-specific plugins that inject OpenTrust context and map tools.

**Structure:**
```
[OpenStrut Repository]
    ├── .opencode/plugins/opentrust.js
    ├── .claude-plugin/opentrust.json
    ├── .codex-plugin/opentrust.json
    ├── .hermes-plugin/opentrust.yaml
    ├── .pi/extensions/opentrust.ts
    └── global/                    # Shared artifacts
        ├── commands/
        ├── skills/
        ├── agents/
        └── context/
```

**Pros:**
- Matches Superpowers pattern (proven)
- Automatic activation via bootstrap injection
- Tool mapping per platform

**Cons:**
- Need to write 6+ plugins
- Plugin APIs differ across platforms
- More maintenance burden

### Option B: Enhance Installer (Current Approach)

**Approach:** Improve installer to handle platform-specific adaptations.

**Changes:**
1. Add bootstrap injection to installer
2. Add platform-specific skill adaptations
3. Add automatic activation triggers

**Pros:**
- Maintains current architecture
- Less code to maintain
- Already supports 6 CLIs

**Cons:**
- No automatic activation
- Manual command invocation required
- Less "magic" than Superpowers

### Option C: Hybrid (Recommended)

**Approach:** Keep installer for file management, add thin plugins for activation.

**Structure:**
```
[OpenStrut Repository]
    ├── bin/openstrut.js          # Installer (existing)
    ├── src/setup/                # Multi-CLI setup (existing)
    ├── plugins/                  # NEW: Platform-specific activation
    │   ├── opencode.js
    │   ├── claude.js
    │   ├── codex.js
    │   ├── hermes.js
    │   ├── pi.js
    │   └── antigravity.js
    └── global/                   # Shared artifacts (existing)
```

**Workflow:**
1. `openstrut install` — Copies files (existing)
2. `openstrut setup --platform hermes` — Configures platform + installs plugin
3. Plugin activates at session start, injects context, maps tools

**Pros:**
- Maintains current installer
- Adds automatic activation
- Clean separation of concerns

**Cons:**
- Need to write 6 plugins
- Plugin APIs differ

## [NEXT]

1. **Research Platform Plugin APIs** — Understand how each platform supports plugins/extensions
2. **Define Plugin Interface** — Create common interface for OpenTrust plugins
3. **Prototype One Plugin** — Start with OpenCode (already supported)
4. **Test Across Platforms** — Verify skills work with tool mappings

## [OPEN QUESTIONS]

1. **Hermes Plugin API:** How does hermes-agent support plugins/extensions?
2. **Bootstrap Injection:** How to inject context at session start in each platform?
3. **Tool Mapping:** How to map OpenTrust commands to platform-specific tools?
4. **Agent Compatibility:** Will 40 agents work across all platforms?
5. **Context System:** Should CTX/B selectors be portable or platform-specific?

---

**Explore complete. Stop at Approval Gate.**
