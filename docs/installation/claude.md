# Claude Code Installation Guide

This guide explains how to install OpenTrust plugins for Claude Code.

## Prerequisites

- Claude Code installed
- Node.js >= 20

## Installation

### Using OpenStrut Setup

```bash
openstrut setup --platform claude
```

This will:
1. Create `.claude-plugin/` directory
2. Copy OpenTrust plugin files
3. Register plugin in Claude Code configuration

### Manual Installation

1. Create plugin directory:
   ```bash
   mkdir -p .claude-plugin/skills
   ```

2. Copy plugin manifest:
   ```bash
   cp global/claude-plugin/plugin.json .claude-plugin/
   ```

3. Copy skill files:
   ```bash
   cp -r global/claude-plugin/skills/* .claude-plugin/skills/
   ```

## Verification

1. Start Claude Code session
2. Check for plugin loaded message
3. Test skill availability:
   ```
   /opentrust-task-contract
   ```

## Available Skills

| Skill | Description |
|-------|-------------|
| `opentrust-task-contract` | Create task contracts with retrieval context |
| `opentrust-reference-research` | Use Operational Retrieval Map selectors |
| `opentrust-delivery` | Prepare commit, push, and pull request |
| `opentrust-observability` | Require execution reports and validation evidence |
| `opentrust-spec-change` | Guide structured spec and design changes |
| `opentrust-meeting-facilitator` | Facilitate OpenTrust meetings |
| `opentrust-decision-logger` | Log OpenTrust decisions |
| `opentrust-context-retrieval` | Retrieve context from Operational Retrieval Map |
| `opentrust-workflow-orchestrator` | Orchestrate OpenTrust workflow |
| `opentrust-quality-gate` | Enforce quality gates in OpenTrust |
| `opentrust-security-review` | Review security in OpenTrust |

## Available Agents

The plugin loads 9 lead agents:
- trust-lead
- product-lead
- architecture-lead
- engineering-lead
- quality-lead
- review-lead
- devops-lead
- delivery-lead
- knowledge-lead

## Hooks

The plugin registers two hooks:
- `onSessionStart` — Inject OpenTrust context at session start
- `onSessionEnd` — Cleanup OpenTrust context at session end

## Troubleshooting

### Plugin not loading

1. Check plugin directory exists:
   ```bash
   ls -la .claude-plugin/
   ```

2. Check plugin manifest:
   ```bash
   cat .claude-plugin/plugin.json
   ```

3. Restart Claude Code session

### Skills not available

1. Check skill files exist:
   ```bash
   ls -la .claude-plugin/skills/
   ```

2. Check plugin manifest for skill entries
3. Restart Claude Code session

## Uninstallation

1. Remove plugin directory:
   ```bash
   rm -rf .claude-plugin
   ```

2. Restart Claude Code session
