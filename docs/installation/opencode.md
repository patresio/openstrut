# OpenCode Installation Guide

This guide explains how to install OpenTrust plugins for OpenCode.

## Prerequisites

- OpenCode installed (`npm install -g opencode-ai`)
- Node.js >= 20

## Installation

### Using OpenStrut Setup

```bash
openstrut setup --platform opencode
```

This will:
1. Create `.opencode/plugins/` directory
2. Copy OpenTrust plugin files
3. Register plugin in OpenCode configuration

### Manual Installation

1. Create plugins directory:
   ```bash
   mkdir -p .opencode/plugins
   ```

2. Copy plugin file:
   ```bash
   cp global/plugins/opentrust.js .opencode/plugins/
   ```

3. Update `.opencode/opencode.json`:
   ```json
   {
     "plugins": [
       { "spec": "file:plugins/opentrust.js" }
     ]
   }
   ```

## Verification

1. Start OpenCode session
2. Check for bootstrap message:
   ```
   OpenTrust Plugin: Bootstrapped successfully
     • 40 agents loaded
     • 11 skills loaded
     • 32 contexts loaded
     • 24 bundles loaded
     • 10 commands loaded
     • 10 tools registered
   ```

3. Test tool registration:
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

## Available Agents

The plugin loads all 40 OpenTrust agents:
- 9 lead agents (trust-lead, product-lead, architecture-lead, etc.)
- 31 subagents (coordination-facilitator, meeting-scribe, etc.)

## Available Skills

The plugin loads all 11 OpenTrust skills:
- opentrust-task-contract
- opentrust-reference-research
- opentrust-delivery
- opentrust-observability
- opentrust-spec-change
- opentrust-meeting-facilitator
- opentrust-decision-logger
- opentrust-context-retrieval
- opentrust-workflow-orchestrator
- opentrust-quality-gate
- opentrust-security-review

## Troubleshooting

### Plugin not loading

1. Check plugin file exists:
   ```bash
   ls -la .opencode/plugins/opentrust.js
   ```

2. Check OpenCode configuration:
   ```bash
   cat .opencode/opencode.json
   ```

3. Restart OpenCode session

### Tools not available

1. Check bootstrap message in session output
2. Verify plugin is registered in configuration
3. Check for JavaScript errors in session logs

## Uninstallation

1. Remove plugin file:
   ```bash
   rm .opencode/plugins/opentrust.js
   ```

2. Update `.opencode/opencode.json` to remove plugin entry
3. Restart OpenCode session
