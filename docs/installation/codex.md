# Codex Installation Guide

This guide explains how to install OpenTrust plugins for Codex.

## Prerequisites

- Codex installed (`npm install -g @openai/codex`)
- Node.js >= 20

## Installation

### Using OpenStrut Setup

```bash
openstrut setup --platform codex
```

This will:
1. Create `.codex-plugin/` directory
2. Copy OpenTrust plugin files
3. Register plugin in Codex configuration

### Manual Installation

1. Create plugin directory:
   ```bash
   mkdir -p .codex-plugin/skills
   ```

2. Copy plugin manifest:
   ```bash
   cp global/codex-plugin/plugin.json .codex-plugin/
   ```

3. Copy bootstrap file:
   ```bash
   cp global/codex-plugin/bootstrap.js .codex-plugin/
   ```

4. Copy skill files:
   ```bash
   cp -r global/codex-plugin/skills/* .codex-plugin/skills/
   ```

## Verification

1. Start Codex session
2. Check for bootstrap message:
   ```
   OpenTrust Bootstrap: Starting...
   OpenTrust Bootstrap: Completed successfully
     • 40 agents loaded
     • 11 skills loaded
     • 32 contexts loaded
     • 24 bundles loaded
     • 10 commands loaded
     • 10 tools registered
   ```

3. Test tool availability:
   ```bash
   /ot-explore
   ```

## Available Tools

| Tool | Description |
|------|-------------|
| `ot-explore` | Synthesize OpenTrust context for exploration |
| `ot-propose` | OpenTrust Propose phase guidance |
| `ot-apply` | OpenTrust Apply phase guidance |
| `ot-review` | OpenTrust Review phase guidance |
| `ot-ship` | OpenTrust Ship phase guidance |
| `ot-status` | OpenTrust status check |
| `ot-incident` | OpenTrust incident response |
| `ot-synthetize` | OpenTrust synthetize mode |
| `ot-create` | OpenTrust create mode |
| `ot-goal` | OpenTrust goal mode |

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

## Apps

The plugin registers two apps:
- `opentrust-bootstrap` — Inject OpenTrust context at session start
- `opentrust-status` — Check OpenTrust status

## Troubleshooting

### Plugin not loading

1. Check plugin directory exists:
   ```bash
   ls -la .codex-plugin/
   ```

2. Check plugin manifest:
   ```bash
   cat .codex-plugin/plugin.json
   ```

3. Check bootstrap file:
   ```bash
   cat .codex-plugin/bootstrap.js
   ```

4. Restart Codex session

### Tools not available

1. Check bootstrap message in session output
2. Verify plugin is registered in configuration
3. Check for JavaScript errors in session logs

## Uninstallation

1. Remove plugin directory:
   ```bash
   rm -rf .codex-plugin
   ```

2. Restart Codex session
