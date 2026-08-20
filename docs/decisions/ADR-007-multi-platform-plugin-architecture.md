# ADR-007: Multi-Platform Plugin Architecture

## Status
Accepted

> **Updated (HARNESS-054):** The OpenCode plugin wiring changed from an object
> spec `{ "spec": "file:..." }` to a relative string spec
> `".opencode/plugins/opentrust.js"`, and the plugin now uses the current
> OpenCode plugin API (named export function returning a `tool` registry)
> instead of the legacy `bootstrap`/`registerTool` API. The installed layout is:
>
> - plugin entrypoint: `.opencode/plugins/opentrust.js`
> - shared core: `.opencode/lib/opentrust-core.js`
>
> The core lives outside the plugins directory because OpenCode auto-discovers
> executable plugin files in plugin directories; shared implementation must
> live outside those directories. See `docs/installation/opencode.md` for the
> current wiring.

## Context
OpenStrut currently distributes 40 agents, 11 skills, 10 commands, and 32 CTX + 24 B context selectors for OpenCode only. Users want to use OpenTrust on multiple platforms: OpenCode, Claude Code, Codex, and Hermes-Agent. Each platform has a different plugin system:

- **OpenCode**: `opencode.json` plugin array with `@opencode/plugin-<name>` or git-backed package specs
- **Claude Code**: `.claude-plugin/plugin.json` manifest with skills, agents, hooks, MCP servers
- **Codex**: `.codex-plugin/plugin.json` manifest with skills, MCP servers, apps
- **Hermes-Agent**: `plugin.yaml` manifest with Python `register(ctx)` function, tools via `ctx.register_tool()`, hooks via `ctx.register_hook()`, skills via `ctx.register_skill()`

We need a plugin architecture that distributes OpenTrust content across all platforms while maintaining the team coordination essence.

## Decision
We will implement a **hybrid plugin distribution architecture** with:

1. **Common Core** — Shared plugin logic, tool mappings, and context definitions
2. **Platform Adapters** — Platform-specific manifests, wrappers, and activation
3. **Tool Mapping Layer** — Abstracts platform differences behind common interface
4. **Bootstrap Injection** — Ensures agents/skills load automatically at session start

### Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                   Common Core                        │
│  - Plugin logic (shared)                            │
│  - Tool mappings (platform-specific)                │
│  - Context definitions (CTX/B)                      │
│  - Skill definitions (SK)                           │
└─────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│               Platform Adapters                      │
│  - OpenCode: .opencode/plugins/opentrust.js         │
│  - Claude Code: .claude-plugin/plugin.json          │
│  - Codex: .codex-plugin/plugin.json                 │
│  - Hermes: plugins/opentrust/plugin.yaml            │
└─────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│              Bootstrap Injection                     │
│  - OpenCode: Plugin array + bootstrap script        │
│  - Claude Code: Hooks (onSessionStart)              │
│  - Codex: Apps (onSessionStart)                     │
│  - Hermes: hooks.py (on_session_start)              │
└─────────────────────────────────────────────────────┘
```

### Plugin Manifest Formats

#### OpenCode Plugin (`.opencode/plugins/opentrust.js`)
```javascript
export const OpenTrustPlugin = async (input) => {
  // Load OpenTrust content (agents, skills, context, commands)
  return {
    tool: {
      'ot-explore': {
        description: 'Synthesize OpenTrust context for exploration',
        args: {
          task: { type: 'string', description: 'Task name or identifier' },
          project: { type: 'string', description: 'Project name or identifier' }
        },
        execute: async (args) => `OpenTrust Context Loaded: ...`
      }
      // ... 10 tools total
    }
  };
};
```

#### Claude Code Plugin (`.claude-plugin/plugin.json`)
```json
{
  "name": "opentrust",
  "version": "1.0.0",
  "description": "OpenTrust multi-platform agent harness",
  "skills": [
    { "name": "opentrust-task-contract", "path": "skills/opentrust-task-contract" },
    { "name": "opentrust-reference-research", "path": "skills/opentrust-reference-research" }
    // ... 11 skills
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

#### Codex Plugin (`.codex-plugin/plugin.json`)
```json
{
  "name": "opentrust",
  "version": "1.0.0",
  "description": "OpenTrust multi-platform agent harness",
  "skills": [
    { "name": "opentrust-task-contract", "path": "skills/opentrust-task-contract" }
    // ... 11 skills
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

#### Hermes Plugin (`plugins/opentrust/plugin.yaml`)
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

### Tool Mapping Layer

The tool mapping layer abstracts platform differences:

```javascript
// src/plugins/tool-mapping.js
export class ToolMapping {
  constructor(platform) {
    this.platform = platform;
  }
  
  mapTool(toolName) {
    const mappings = {
      'ot-explore': {
        opencode: 'read',
        claude: 'Read',
        codex: 'read',
        hermes: 'read_file'
      },
      'ot-apply': {
        opencode: 'bash',
        claude: 'Bash',
        codex: 'bash',
        hermes: 'execute_command'
      }
    };
    return mappings[toolName]?.[this.platform] || toolName;
  }
}
```

### Bootstrap Injection

Bootstrap injection ensures agents/skills load automatically:

```javascript
// OpenCode: Plugin array (string spec, relative to config root)
// opencode.json
{
  "plugin": [
    ".opencode/plugins/opentrust.js"
  ]
}

// Claude Code: Hooks
// .claude-plugin/plugin.json
{
  "hooks": [
    {
      "name": "opentrust-bootstrap",
      "event": "onSessionStart",
      "action": "inject-opentrust-context"
    }
  ]
}

// Codex: Apps
// .codex-plugin/plugin.json
{
  "apps": [
    {
      "name": "opentrust-bootstrap",
      "entrypoint": "bootstrap.js",
      "description": "Inject OpenTrust context at session start"
    }
  ]
}

// Hermes: hooks.py
// plugins/opentrust/hooks.py
def on_session_start(session, project):
    """Inject OpenTrust context at session start."""
    # Register OpenTrust context
    session.register_context('opentrust:agents', load_agents())
    session.register_context('opentrust:skills', load_skills())
    session.register_context('opentrust:context', load_context())
```

## Consequences

### Positive
1. **Unified Experience** — Same agents, skills, workflows across platforms
2. **Platform Native** — Uses each platform's native plugin system
3. **Maintainable** — Common core, platform-specific adapters
4. **Extensible** — Easy to add new platforms
5. **Backward Compatible** — Existing OpenCode installer continues to work

### Negative
1. **Maintenance Burden** — Multiple plugins to maintain
2. **Platform API Changes** — Need to track changes across platforms
3. **Testing Complexity** — Need to test on all platforms
4. **Documentation Overhead** — Platform-specific guides required

### Risks
1. **Platform API Instability** → Pin platform versions in tests
2. **Tool Mapping Gaps** → Start with minimal mapping, iterate
3. **Agent Compatibility** → Start with core agents, add others later
4. **Plugin Conflicts** → Isolate plugins, test combinations

## Alternatives Considered

### Alternative 1: Pure Installer Approach
- Extend `openstrut install` to handle all platforms
- **Rejected**: Platform plugin systems require native manifests

### Alternative 2: Pure Plugin Approach
- Create plugins only, no installer changes
- **Rejected**: Loses installer's file management benefits

### Alternative 3: Universal Plugin Format
- Create one plugin format that works everywhere
- **Rejected**: Platform plugin systems are incompatible

### Alternative 4: Hybrid Approach (Chosen)
- Keep installer for file management + add platform-specific plugins
- **Accepted**: Combines benefits of both approaches

## References
- OpenCode Plugin System: https://opencode.ai/docs/plugins
- Claude Code Plugins: https://code.claude.com/docs/en/plugins
- Codex Plugins: https://developers.openai.com/codex/plugins
- Hermes Plugin System: https://hermes-agent.nousresearch.com/docs/developer-guide/plugins
- OpenTrust Workflow: docs/opencode/WORKFLOW.md
- OpenTrust Task Contract: docs/opencode/TASK_CONTRACT.md
