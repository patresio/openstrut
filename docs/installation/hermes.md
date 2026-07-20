# Hermes Installation Guide

This guide explains how to install OpenTrust plugins for Hermes-Agent.

## Prerequisites

- Hermes-Agent installed (`curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash`)
- Python 3.8+

## Installation

### Using OpenStrut Setup

```bash
openstrut setup --platform hermes
```

This will:
1. Create `plugins/opentrust/` directory
2. Copy OpenTrust plugin files
3. Register plugin in Hermes configuration

### Manual Installation

1. Create plugin directory:
   ```bash
   mkdir -p plugins/opentrust
   ```

2. Copy plugin files:
   ```bash
   cp -r global/hermes-plugin/* plugins/opentrust/
   ```

3. Copy skill files:
   ```bash
   mkdir -p plugins/opentrust/skills
   cp -r global/hermes-plugin/skills/* plugins/opentrust/skills/
   ```

## Verification

1. Start Hermes session
2. Check for bootstrap message:
   ```
   OpenTrust Bootstrap: Starting...
   OpenTrust Bootstrap: Completed successfully
     • 40 agents loaded
     • 11 skills loaded
     • 32 contexts loaded
     • 24 bundles loaded
     • 10 commands loaded
   ```

3. Test tool availability:
   ```bash
   /ot_explore
   ```

## Available Tools

| Tool | Description |
|------|-------------|
| `ot_explore` | Synthesize OpenTrust context for exploration |
| `ot_propose` | OpenTrust Propose phase guidance |
| `ot_apply` | OpenTrust Apply phase guidance |
| `ot_review` | OpenTrust Review phase guidance |
| `ot_ship` | OpenTrust Ship phase guidance |
| `ot_status` | OpenTrust status check |
| `ot_incident` | OpenTrust incident response |
| `ot_synthetize` | OpenTrust synthetize mode |
| `ot_create` | OpenTrust create mode |
| `ot_goal` | OpenTrust goal mode |

## Available Skills

| Skill | Description |
|-------|-------------|
| `opentrust_task_contract` | Create task contracts with retrieval context |
| `opentrust_reference_research` | Use Operational Retrieval Map selectors |
| `opentrust_delivery` | Prepare commit, push, and pull request |
| `opentrust_observability` | Require execution reports and validation evidence |
| `opentrust_spec_change` | Guide structured spec and design changes |
| `opentrust_meeting_facilitator` | Facilitate OpenTrust meetings |
| `opentrust_decision_logger` | Log OpenTrust decisions |
| `opentrust_context_retrieval` | Retrieve context from Operational Retrieval Map |
| `opentrust_workflow_orchestrator` | Orchestrate OpenTrust workflow |
| `opentrust_quality_gate` | Enforce quality gates in OpenTrust |
| `opentrust_security_review` | Review security in OpenTrust |

## Hooks

The plugin registers two hooks:
- `on_session_start` — Inject OpenTrust context at session start
- `on_session_end` — Cleanup OpenTrust context at session end

## Plugin Structure

```
plugins/opentrust/
├── __init__.py      # Plugin registration
├── hooks.py         # Session hooks
├── tools.py         # Tool implementations
├── plugin.yaml      # Plugin manifest
└── skills/          # Skill files
    ├── opentrust_task_contract.md
    ├── opentrust_reference_research.md
    └── ...
```

## Troubleshooting

### Plugin not loading

1. Check plugin directory exists:
   ```bash
   ls -la plugins/opentrust/
   ```

2. Check plugin manifest:
   ```bash
   cat plugins/opentrust/plugin.yaml
   ```

3. Check Python files:
   ```bash
   python -c "import plugins.opentrust"
   ```

4. Restart Hermes session

### Tools not available

1. Check bootstrap message in session output
2. Verify plugin is registered in configuration
3. Check for Python errors in session logs

## Uninstallation

1. Remove plugin directory:
   ```bash
   rm -rf plugins/opentrust
   ```

2. Restart Hermes session
