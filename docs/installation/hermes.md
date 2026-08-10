# Hermes Installation Guide

This guide explains how to install the OpenTrust plugin for Hermes-Agent.

## Prerequisites

- Hermes-Agent installed (`curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash`)
- Python 3.8+

## Installation

### Using OpenStrut Setup

```bash
openstrut setup --platform hermes
```

This will:

1. Copy `plugins/opentrust/` to `plugins/opentrust/` under the target directory
2. Populate `skills/<name>/SKILL.md` inside the installed plugin from the
   canonical `global/skills/` source (11 skills), so the installed plugin is
   **self-sufficient** — it does not need the OpenStrut repository at runtime
3. Register the plugin with Hermes

To install into the Hermes user plugins directory:

```bash
openstrut setup --platform hermes --home-dir ~/.hermes
```

The plugin lands at `~/.hermes/plugins/opentrust/`.

### Manual Installation

1. Create plugin directory:

   ```bash
   mkdir -p ~/.hermes/plugins/opentrust
   ```

2. Copy plugin files:

   ```bash
   cp -r plugins/opentrust/* ~/.hermes/plugins/opentrust/
   ```

3. Copy skill files (the plugin loads `skills/<name>/SKILL.md`):

   ```bash
   mkdir -p ~/.hermes/plugins/opentrust/skills
   for skill in global/skills/*/; do
     name=$(basename "$skill")
     mkdir -p ~/.hermes/plugins/opentrust/skills/"$name"
     cp "$skill/SKILL.md" ~/.hermes/plugins/opentrust/skills/"$name"/SKILL.md
   done
   ```

> **Runtime self-sufficiency:** the installed plugin resolves resources from
> its own directory (`Path(__file__).parent / "skills"`). The
> `OPENSTRUST_ROOT` environment variable is only a **development** fallback:
> when the plugin runs from the repository and has no installed `skills/`
> tree, `$OPENSTRUST_ROOT/global/skills` is used. It is not required at
> runtime.

## Verification

1. Load the plugin (Hermes calls `register(ctx)` once on startup). The
   plugin prints:

   ```
   OpenTrust Plugin: Registered successfully
   ```

2. Check the plugin manifest:

   ```bash
   cat ~/.hermes/plugins/opentrust/plugin.yaml
   ```

3. Run the behavioral contract test (no live Hermes needed — fake ctx):

   ```bash
   python3 tests/plugins/hermes_behavior_test.py
   ```

4. The 10 `ot_*` tools are available to the model with toolset `opentrust`.

## Available Tools

All tools are guidance-only: they return a deterministic JSON string and
never mutate state. Toolset: `opentrust`.

| Tool | Description |
|------|-------------|
| `ot_explore` | OpenTrust Explore phase guidance (read-only) |
| `ot_propose` | OpenTrust Propose phase guidance |
| `ot_apply` | OpenTrust Apply phase guidance (approved scope, TDD gate) |
| `ot_review` | OpenTrust Review phase guidance (evidence-based) |
| `ot_ship` | OpenTrust Ship phase guidance (delivery) |
| `ot_status` | OpenTrust workflow status synthesis |
| `ot_incident` | OpenTrust incident guidance (smallest safe change) |
| `ot_synthetize` | OpenTrust Synthetize guidance (grilling, gap analysis) |
| `ot_create` | OpenTrust Create guidance (stack analysis, recommendations) |
| `ot_goal` | OpenTrust Goal guidance (autonomous loop, human gates) |

## Available Skills

The plugin discovers skills dynamically from `skills/<name>/SKILL.md` (no
magic count). The canonical OpenStrut skills shipped on install:

| Skill | Description |
|-------|-------------|
| `opentrust-task-contract` | Create task contracts with retrieval context |
| `opentrust-reference-research` | Use Operational Retrieval Map selectors |
| `opentrust-delivery` | Prepare commit, push, and pull request |
| `opentrust-observability` | Require execution reports and validation evidence |
| `opentrust-spec-change` | Guide structured spec and design changes |
| `opentrust-review` | Two-axis review: Standards + Spec |
| `opentrust-tdd` | Seams-first TDD: RED-GREEN-REFACTOR |
| `opentrust-grilling` | Requirement grilling rounds |
| `opentrust-domain-modeling` | Domain modeling guidance |
| `opentrust-handoff` | Session context compaction |
| `opentrust-diagnose` | Diagnose repository and workflow state |

Plugin skills are read-only, namespaced, and loaded via `skill_view`
(`opentrust:<skill>`); they are not injected into every session.

## Hooks

The plugin registers **no hooks**. OpenTrust is guidance-only: tools cover
workflow phases and skills cover knowledge. Only real Hermes hook events
would be registered if a runtime need appears; no fake context injection
is used.

## Plugin Structure

```
plugins/opentrust/
├── plugin.yaml          # Native manifest (kind: backend, provides_tools)
├── __init__.py          # register(ctx): 10 tools + dynamic skill registration
├── tools.py             # Schemas + handlers ((args, **kwargs) -> JSON string)
├── resource_loader.py   # Skills discovery + resource resolution
└── skills/              # Populated at install time by the installer
    ├── opentrust-task-contract/
    │   └── SKILL.md
    └── ...              # one directory per canonical skill
```

## Troubleshooting

### Plugin not loading

1. Check plugin directory exists:

   ```bash
   ls -la ~/.hermes/plugins/opentrust/
   ```

2. Check plugin manifest:

   ```bash
   cat ~/.hermes/plugins/opentrust/plugin.yaml
   ```

3. Run the behavioral contract test (fake ctx, no live Hermes):

   ```bash
   python3 tests/plugins/hermes_behavior_test.py
   ```

4. Restart the Hermes session

### Skills not discovered

1. Confirm `skills/<name>/SKILL.md` exists inside the installed plugin
2. Confirm each directory contains exactly one `SKILL.md`
3. Re-run `openstrut setup --platform hermes` to repopulate

## Uninstallation

1. Remove the plugin directory:

   ```bash
   rm -rf ~/.hermes/plugins/opentrust
   ```

2. Restart the Hermes session
