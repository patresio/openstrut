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
1. Create `.opencode/plugins/` directory in the config root
2. Copy the OpenTrust plugin file
3. Register the plugin in the OpenCode configuration

### Manual Installation

1. Create the plugins directory in your OpenCode config root
   (`~/.config/opencode/` by default):

   ```bash
   mkdir -p ~/.config/opencode/.opencode/plugins
   ```

2. Copy the plugin file from the harness repository:

   ```bash
   cp .opencode/plugins/opentrust.js ~/.config/opencode/.opencode/plugins/
   ```

3. Register the plugin in `opencode.json` (the config root file). The OpenCode
   config key is `plugin` (singular):

   ```json
   {
     "plugin": [
       { "spec": "file:.opencode/plugins/opentrust.js" }
     ]
   }
   ```

> **Note:** the harness ships this wiring already in `global/opencode.json`
> (installed as `opencode.json` in the config root), so manual registration is
> only needed for custom setups.

## Verification

1. Start an OpenCode session
2. Check for the bootstrap message:
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
- opentrust-tdd
- opentrust-spec-change
- opentrust-review
- opentrust-delivery
- opentrust-observability
- opentrust-reference-research
- opentrust-grilling
- opentrust-domain-modeling
- opentrust-handoff
- opentrust-diagnose

## Troubleshooting

### Plugin not loading

1. Check the plugin file exists in the config root:
   ```bash
   ls -la ~/.config/opencode/.opencode/plugins/opentrust.js
   ```

2. Check the OpenCode configuration:
   ```bash
   cat ~/.config/opencode/opencode.json
   ```

3. Restart the OpenCode session

### Tools not available

1. Check the bootstrap message in session output
2. Verify the plugin is registered in the configuration
3. Check for JavaScript errors in session logs

## Uninstallation

1. Remove the plugin file:
   ```bash
   rm ~/.config/opencode/.opencode/plugins/opentrust.js
   ```

2. Update `opencode.json` to remove the plugin entry
3. Restart the OpenCode session