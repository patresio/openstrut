# Plugin Development Guide

This guide explains how to develop and extend OpenTrust plugins for multiple platforms.

## Overview

OpenTrust plugins distribute 40 agents, 11 skills, 10 commands, and 32 CTX + 24 B context selectors across multiple platforms. Each platform has a different plugin system, but they share common concepts.

## Architecture

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
```

## Platform-Specific Development

### OpenCode Plugin

**Location:** `.opencode/plugins/opentrust.js`

**Key Concepts:**
- Plugin array in `opencode.json`
- Bootstrap function for initialization
- Tool registration via `ctx.registerTool()`

**Example:**
```javascript
export default {
  name: 'opentrust',
  version: '1.0.0',
  bootstrap: async (ctx) => {
    // Load context
    const agents = loadAgents();
    const skills = loadSkills();
    
    // Inject context
    await ctx.injectContext('opentrust:agents', agents);
    
    // Register tools
    ctx.registerTool('ot-explore', {
      description: 'Synthesize OpenTrust context',
      parameters: { ... },
      handler: handleOtExplore
    });
  }
};
```

### Claude Code Plugin

**Location:** `.claude-plugin/plugin.json`

**Key Concepts:**
- Plugin manifest with skills, hooks, agents
- Skills in `skills/` directory
- Hooks for lifecycle events

**Example:**
```json
{
  "name": "opentrust",
  "skills": [
    { "name": "opentrust-task-contract", "path": "skills/opentrust-task-contract" }
  ],
  "hooks": [
    { "name": "bootstrap", "event": "onSessionStart", "action": "inject-context" }
  ]
}
```

### Codex Plugin

**Location:** `.codex-plugin/plugin.json`

**Key Concepts:**
- Plugin manifest with skills, apps
- Skills in `skills/` directory
- Apps for lifecycle events

**Example:**
```json
{
  "name": "opentrust",
  "skills": [
    { "name": "opentrust-task-contract", "path": "skills/opentrust-task-contract" }
  ],
  "apps": [
    { "name": "bootstrap", "entrypoint": "bootstrap.js" }
  ]
}
```

### Hermes Plugin

**Location:** `plugins/opentrust/plugin.yaml`

**Key Concepts:**
- Plugin manifest with tools, hooks, skills
- Python `register(ctx)` function
- Tools via `ctx.register_tool()`

**Example:**
```yaml
name: opentrust
tools:
  - name: ot_explore
    command: python tools.py
hooks:
  - name: on_session_start
    command: python hooks.py
skills:
  - name: opentrust_task_contract
    file: skills/opentrust_task_contract.md
```

## Adding New Tools

### 1. Define Tool Handler

Create handler function in platform-specific file:

```javascript
// OpenCode/Claude/Codex
async function handleOtNewTool(params) {
  const { session, task, project } = params;
  return {
    content: [{ type: 'text', text: 'Tool response' }]
  };
}

// Hermes
def handle_ot_new_tool(session, task, project):
    return {"content": [{"type": "text", "text": "Tool response"}]}
```

### 2. Register Tool

```javascript
// OpenCode
ctx.registerTool('ot-new-tool', {
  description: 'New tool description',
  parameters: { ... },
  handler: handleOtNewTool
});

// Claude Code - Add to plugin.json tools array
// Codex - Add to plugin.json apps array
// Hermes - Add to plugin.yaml tools section
```

### 3. Update Tool Mapping

```javascript
// src/plugins/tool-mapping.js
const TOOL_MAPPINGS = {
  'ot-new-tool': {
    opencode: 'bash',
    claude: 'Bash',
    codex: 'bash',
    hermes: 'execute_command'
  }
};
```

## Adding New Skills

### 1. Create Skill File

Create `skills/opentrust-new-skill/SKILL.md`:

```markdown
# opentrust-new-skill

Description of the skill.

## When to Use
- Use case 1
- Use case 2

## Workflow
1. Step 1
2. Step 2

## Examples
...
```

### 2. Register Skill

```javascript
// OpenCode - Add to bootstrap function
await ctx.injectContext('opentrust:skills', { ...skills, 'new-skill': newSkill });

// Claude Code - Add to plugin.json skills array
// Codex - Add to plugin.json skills array
// Hermes - Add to plugin.yaml skills section
```

## Adding New Agents

### 1. Create Agent File

Create `global/agents/new-agent.md`:

```markdown
# new-agent

Agent description.

## Responsibilities
- Responsibility 1
- Responsibility 2

## Reference Profile
Primary contexts:
- CTX...

## Workflow
1. Step 1
2. Step 2
```

### 2. Register Agent

```javascript
// OpenCode - Add to bootstrap function
await ctx.injectContext('opentrust:agents', { ...agents, 'new-agent': newAgent });

// Claude Code - Add to plugin.json agents array
// Codex - Add to plugin.json agents array
// Hermes - Add to plugin.yaml agents section
```

## Testing

### Unit Tests

```bash
# Run all plugin tests
node --test tests/plugins/*.test.js

# Run specific platform tests
node --test tests/plugins/opencode.test.js
node --test tests/plugins/claude.test.js
node --test tests/plugins/codex.test.js
node --test tests/plugins/hermes.test.js
```

### Integration Tests

```bash
# Test plugin installation
openstrut setup --platform opencode --dry-run
openstrut setup --platform claude --dry-run
openstrut setup --platform codex --dry-run
openstrut setup --platform hermes --dry-run
```

## Best Practices

1. **Keep plugins synchronized** — All platforms should have the same tools, skills, and agents
2. **Use consistent naming** — Follow OpenTrust naming conventions
3. **Test across platforms** — Verify functionality on all supported platforms
4. **Document changes** — Update documentation when adding new features
5. **Follow conventions** — Use conventional commits for changes

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Plugin not loading | Check file paths and permissions |
| Tools not available | Verify tool registration in bootstrap |
| Skills not found | Check skill file paths in manifest |
| Context not injected | Verify bootstrap function execution |

### Debug Mode

Enable debug logging:

```bash
# OpenCode
DEBUG=opentrust:* opencode

# Claude Code
DEBUG=opentrust:* claude

# Codex
DEBUG=opentrust:* codex

# Hermes
DEBUG=opentrust:* hermes
```
