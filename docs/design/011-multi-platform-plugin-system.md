# Design 011: Multi-Platform Plugin System

## Overview
This design defines the multi-platform plugin system for OpenTrust, enabling distribution of 40 agents, 11 skills, 10 commands, and 32 CTX + 24 B context selectors across OpenCode, Claude Code, Codex, and Hermes-Agent.

## Goals
1. Distribute OpenTrust content to all 4 supported platforms
2. Maintain team coordination essence across platforms
3. Provide bootstrap injection for automatic agent/skill loading
4. Abstract platform differences behind common interface
5. Keep existing OpenCode installer working

## Architecture

### Layer 1: Common Core
Shared logic and definitions that work across all platforms.

**Components:**
- `src/plugins/core/plugin-manager.js` — Plugin lifecycle management
- `src/plugins/core/context-loader.js` — Load CTX/B context definitions
- `src/plugins/core/skill-loader.js` — Load SK skill definitions
- `src/plugins/core/agent-loader.js` — Load agent definitions
- `src/plugins/core/tool-mapping.js` — Map tools across platforms

**Responsibilities:**
- Load and validate plugin manifests
- Provide common interfaces for tools, skills, agents
- Handle plugin configuration and state
- Manage plugin dependencies

### Layer 2: Platform Adapters
Platform-specific implementations that wrap the common core.

**Adapters:**
- `src/plugins/adapters/opencode.js` — OpenCode adapter
- `src/plugins/adapters/claude.js` — Claude Code adapter
- `src/plugins/adapters/codex.js` — Codex adapter
- `src/plugins/adapters/hermes.js` — Hermes adapter

**Responsibilities:**
- Generate platform-specific manifests
- Wrap common core for platform APIs
- Handle platform-specific tool mappings
- Manage platform-specific state

### Layer 3: Bootstrap Injection
Mechanisms to inject OpenTrust context at session start.

**Bootstrap Mechanisms:**
- **OpenCode**: Plugin array + bootstrap script in `.opencode/plugins/`
- **Claude Code**: Hooks in `.claude-plugin/plugin.json` (onSessionStart)
- **Codex**: Apps in `.codex-plugin/plugin.json` (onSessionStart)
- **Hermes**: hooks.py in `plugins/opentrust/` (on_session_start)

**Responsibilities:**
- Inject agents, skills, context at session start
- Register tools with platform APIs
- Handle plugin activation/deactivation
- Manage plugin lifecycle events

## Data Flow

```
User Request
    ↓
Platform Session Start
    ↓
Bootstrap Injection (hooks.py / onSessionStart)
    ↓
Common Core Loads:
  - 40 agents (9 teams + 31 subagents)
  - 11 skills (opentrust-*)
  - 10 commands (ot-*)
  - 32 CTX + 24 B context definitions
    ↓
Platform Adapter Wraps:
  - Tool mappings (platform-specific)
  - Agent definitions (platform-specific)
  - Skill definitions (platform-specific)
    ↓
User Interacts with OpenTrust
    ↓
Platform Routes to Correct Tool/Agent/Skill
```

## Plugin Manifest Formats

### OpenCode Plugin
Location: `.opencode/plugins/opentrust.js`

```javascript
export default {
  name: 'opentrust',
  version: '1.0.0',
  description: 'OpenTrust multi-platform agent harness',
  
  // Bootstrap function called at session start
  bootstrap: async (ctx) => {
    // Inject OpenTrust context
    await ctx.injectContext('opentrust:agents');
    await ctx.injectContext('opentrust:skills');
    await ctx.injectContext('opentrust:context');
    
    // Register tools
    ctx.registerTool('ot-explore', {
      description: 'Synthesize OpenTrust context for exploration',
      parameters: {
        session: { type: 'object', required: true },
        task: { type: 'object', required: true },
        project: { type: 'object', required: true }
      },
      handler: handleOtExplore
    });
    
    // ... 9 more tools
  }
};
```

### Claude Code Plugin
Location: `.claude-plugin/plugin.json`

```json
{
  "name": "opentrust",
  "version": "1.0.0",
  "description": "OpenTrust multi-platform agent harness",
  "skills": [
    {
      "name": "opentrust-task-contract",
      "path": "skills/opentrust-task-contract",
      "description": "Create task contracts with retrieval context"
    }
    // ... 10 more skills
  ],
  "hooks": [
    {
      "name": "opentrust-bootstrap",
      "event": "onSessionStart",
      "action": "inject-opentrust-context"
    }
  ]
}
```

### Codex Plugin
Location: `.codex-plugin/plugin.json`

```json
{
  "name": "opentrust",
  "version": "1.0.0",
  "description": "OpenTrust multi-platform agent harness",
  "skills": [
    {
      "name": "opentrust-task-contract",
      "path": "skills/opentrust-task-contract",
      "description": "Create task contracts with retrieval context"
    }
    // ... 10 more skills
  ],
  "apps": [
    {
      "name": "opentrust-bootstrap",
      "entrypoint": "bootstrap.js",
      "description": "Inject OpenTrust context at session start"
    }
  ]
}
```

### Hermes Plugin
Location: `plugins/opentrust/plugin.yaml`

```yaml
name: opentrust
version: 1.0.0
description: OpenTrust multi-platform agent harness
author: OpenTrust Team

hooks:
  - name: on_session_start
    command: python hooks.py
    description: Inject OpenTrust context at session start

tools:
  - name: ot_explore
    command: python tools.py
    description: Synthesize OpenTrust context for exploration
    parameters:
      - name: session
        type: object
        required: true
      - name: task
        type: object
        required: true
      - name: project
        type: object
        required: true

skills:
  - name: opentrust_task_contract
    file: skills/opentrust_task_contract.md
    description: Create task contracts with retrieval context
```

## Tool Mapping

### OpenTrust Tools → Platform Tools

| OpenTrust Tool | OpenCode | Claude Code | Codex | Hermes |
|----------------|----------|-------------|-------|--------|
| ot-explore | read | Read | read | read_file |
| ot-propose | write | Write | write | write_file |
| ot-apply | bash | Bash | bash | execute_command |
| ot-review | read | Read | read | read_file |
| ot-ship | bash | Bash | bash | execute_command |
| ot-status | bash | Bash | bash | execute_command |
| ot-incident | bash | Bash | bash | execute_command |
| ot-synthetize | bash | Bash | bash | execute_command |
| ot-create | bash | Bash | bash | execute_command |
| ot-goal | bash | Bash | bash | execute_command |

### Tool Mapping Implementation

```javascript
// src/plugins/core/tool-mapping.js
export class ToolMapping {
  constructor(platform) {
    this.platform = platform;
    this.mappings = {
      'ot-explore': {
        opencode: 'read',
        claude: 'Read',
        codex: 'read',
        hermes: 'read_file'
      },
      'ot-propose': {
        opencode: 'write',
        claude: 'Write',
        codex: 'write',
        hermes: 'write_file'
      },
      'ot-apply': {
        opencode: 'bash',
        claude: 'Bash',
        codex: 'bash',
        hermes: 'execute_command'
      }
      // ... more mappings
    };
  }
  
  mapTool(toolName) {
    return this.mappings[toolName]?.[this.platform] || toolName;
  }
  
  mapParameters(toolName, params) {
    // Platform-specific parameter transformations
    if (this.platform === 'hermes') {
      // Hermes uses snake_case
      return Object.fromEntries(
        Object.entries(params).map(([k, v]) => [k.replace(/([A-Z])/g, '_$1').toLowerCase(), v])
      );
    }
    return params;
  }
}
```

## Context Distribution

### CTX Definitions (32 contexts)
Location: `global/context/contexts/CTX01-32.md`

Each platform receives the same CTX definitions but wrapped in platform-specific format:
- **OpenCode**: Injected via plugin bootstrap
- **Claude Code**: Loaded via hooks
- **Codex**: Loaded via apps
- **Hermes**: Loaded via hooks.py

### B Definitions (24 bundles)
Location: `global/context/bundles/B01-24.md`

Same as CTX — wrapped in platform-specific format.

### SK Definitions (11 skills)
Location: `global/context/skills/SK01-39.md`

Same as CTX — wrapped in platform-specific format.

## Agent Adaptation

### OpenCode Agents
Location: `global/agents/*.md`

Loaded via plugin bootstrap, no adaptation needed.

### Claude Code Agents
Location: `.claude-plugin/agents/*.md`

Adapted for Claude Code's agent system:
- Skills moved to `.claude-plugin/skills/`
- Hooks added for lifecycle events
- Tool mappings applied

### Codex Agents
Location: `.codex-plugin/agents/*.md`

Adapted for Codex's agent system:
- Skills moved to `.codex-plugin/skills/`
- Apps added for lifecycle events
- Tool mappings applied

### Hermes Agents
Location: `plugins/opentrust/agents/*.md`

Adapted for Hermes' agent system:
- Skills moved to `plugins/opentrust/skills/`
- Hooks added for lifecycle events
- Tools registered via `ctx.register_tool()`

## Installation Flow

### OpenCode Installation
```bash
openstrut setup --platform opencode
# 1. Install plugin to .opencode/plugins/opentrust.js
# 2. Update .opencode/opencode.json with plugin array
# 3. Verify plugin loads correctly
```

### Claude Code Installation
```bash
openstrut setup --platform claude
# 1. Install plugin to .claude-plugin/plugin.json
# 2. Install skills to .claude-plugin/skills/
# 3. Verify plugin loads correctly
```

### Codex Installation
```bash
openstrut setup --platform codex
# 1. Install plugin to .codex-plugin/plugin.json
# 2. Install skills to .codex-plugin/skills/
# 3. Verify plugin loads correctly
```

### Hermes Installation
```bash
openstrut setup --platform hermes
# 1. Install plugin to plugins/opentrust/
# 2. Install skills to plugins/opentrust/skills/
# 3. Verify plugin loads correctly
```

## Testing Strategy

### Unit Tests
- Plugin manifest validation
- Tool mapping correctness
- Context loader functionality
- Skill loader functionality
- Agent loader functionality

### Integration Tests
- Plugin loads on each platform
- Bootstrap injection works
- Tool mapping works
- Context distribution works

### E2E Tests
- Same skill works on multiple platforms
- Agents work across platforms
- CTX/B bundles distributed correctly

## Documentation

### Platform-Specific Guides
- `docs/installation/opencode.md` — OpenCode installation
- `docs/installation/claude.md` — Claude Code installation
- `docs/installation/codex.md` — Codex installation
- `docs/installation/hermes.md` — Hermes installation

### Plugin Development Guide
- `docs/guides/plugin-development.md` — How to create plugins

### Architecture Documentation
- `docs/decisions/ADR-007-multi-platform-plugin-architecture.md` — ADR

## Success Criteria
- [ ] All 4 platforms have working plugins
- [ ] Bootstrap injection works on all platforms
- [ ] Tool mapping layer handles platform differences
- [ ] `openstrut setup --platform` installs correct plugin
- [ ] All 266 existing tests pass
- [ ] New plugin tests pass
- [ ] Documentation complete
