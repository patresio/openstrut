# OpenCode Installation Guide

This guide explains how to install OpenTrust plugins for OpenCode.

## Prerequisites

- OpenCode installed (`npm install -g opencode-ai`)
- Node.js >= 20

## What gets installed

OpenTrust installs a baseline into the OpenCode configuration root
(`~/.config/opencode/` by default):

```
~/.config/opencode/
├── opencode.json                          ← baseline config (wired plugin)
└── .opencode/
    ├── plugins/
    │   └── opentrust.js                   ← plugin entrypoint (loaded by OpenCode)
    └── lib/
        └── opentrust-core.js              ← shared core (imported by the plugin)
```

The `opencode.json` baseline contains the plugin wiring:

```json
{
  "plugin": [
    ".opencode/plugins/opentrust.js"
  ]
}
```

### How the plugin path resolves

The plugin spec `".opencode/plugins/opentrust.js"` is a **relative path
resolved against the directory that contains `opencode.json`** — the config
root. So:

```
".opencode/plugins/opentrust.js"
        ↓ resolved against ~/.config/opencode/
~/.config/opencode/.opencode/plugins/opentrust.js
```

### Why the core lives outside the plugins directory

`.opencode/plugins/` contains only the entrypoint OpenCode loads. The shared
implementation lives in `.opencode/lib/opentrust-core.js`. This is
intentional: OpenCode auto-discovers executable plugin files in plugin
directories, so shared code must live outside those directories to avoid
being loaded as a plugin.

## Installation

### Using OpenStrut

```bash
npx github:patresio/openstrut install --force
```

This installs the full baseline (including `opencode.json`, the plugin
entrypoint, and the shared core) into the OpenCode config root. Use
`openstrut plan` first to preview what would change:

```bash
npx github:patresio/openstrut plan
```

### Manual Installation

1. Create the plugin and core directories in your OpenCode config root
   (`~/.config/opencode/` by default):

   ```bash
   mkdir -p ~/.config/opencode/.opencode/plugins
   mkdir -p ~/.config/opencode/.opencode/lib
   ```

2. Copy the plugin entrypoint and shared core from the harness repository:

   ```bash
   cp .opencode/plugins/opentrust.js ~/.config/opencode/.opencode/plugins/
   cp .opencode/lib/opentrust-core.js ~/.config/opencode/.opencode/lib/
   ```

3. Register the plugin in `opencode.json` (the config root file). The OpenCode
   config key is `plugin` (singular), and each entry is a string spec resolved
   relative to the config file directory:

   ```json
   {
     "plugin": [
       ".opencode/plugins/opentrust.js"
     ]
   }
   ```

   The spec resolves to `<config-root>/.opencode/plugins/opentrust.js`, which is
   exactly where the installer places the plugin file. Object specs such as
   `{ "spec": "file:..." }` are invalid and rejected by OpenCode's schema
   (`Expected string | array`).

> **Note:** the harness ships this wiring already in `global/opencode.json`
> (installed as `opencode.json` in the config root), so manual registration is
> only needed for custom setups.

## Updating

Running the installer again performs an idempotent update:

- updates properties managed by OpenTrust (source wins);
- removes managed properties that no longer exist in the baseline;
- preserves properties recognized as user configuration
  (`share`, `snapshot`, `autoupdate`, `compaction`);
- updates the plugin entrypoint and its shared core;
- keeps the process idempotent (a second run with no changes is a no-op).

```bash
npx github:patresio/openstrut install --force
```

## Upgrading from older installs

Older OpenTrust versions may have left legacy configuration such as:

```json
{
  "plugin": [
    { "spec": "file:.opencode/plugins/opentrust.js" }
  ]
}
```

or may not have the plugin installed correctly at all. Running the official
installer/update command fixes this automatically: the legacy object spec is
replaced by the relative string spec, and the plugin entrypoint plus shared
core are installed in the correct paths.

Do not edit `opencode.json` by hand unless troubleshooting as a last resort.

## Verification

1. Start an OpenCode session
2. Check for the bootstrap message:
   ```
   OpenTrust Plugin: Bootstrapped successfully
     • 40 agents loaded
     • 12 skills loaded
     • 32 contexts loaded
     • 24 bundles loaded
     • 11 commands loaded
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

The plugin also loads the `ot-audit` command: mechanical spec-anchored audit gate (runs `openstrut audit`; exit 0 aligned, exit 1 findings).

## Available Agents

The plugin loads all 40 OpenTrust agents:
- 9 lead agents (trust-lead, product-lead, architecture-lead, etc.)
- 31 subagents (coordination-facilitator, meeting-scribe, etc.)

## Available Skills

The plugin loads all 12 OpenTrust skills:
- opentrust-task-contract
- opentrust-tdd
- opentrust-spec-change
- opentrust-spec-anchored
- opentrust-review
- opentrust-delivery
- opentrust-observability
- opentrust-reference-research
- opentrust-grilling
- opentrust-domain-modeling
- opentrust-handoff
- opentrust-diagnose

## Troubleshooting

### Verify configuration

```bash
cat ~/.config/opencode/opencode.json
```

Expected:

```json
"plugin": [
  ".opencode/plugins/opentrust.js"
]
```

### Verify plugin

```bash
test -f ~/.config/opencode/.opencode/plugins/opentrust.js && echo OK
```

### Verify core

```bash
test -f ~/.config/opencode/.opencode/lib/opentrust-core.js && echo OK
```

### Validate OpenCode

Run a minimal OpenCode session and confirm it loads without:

- `Configuration is invalid`
- `Plugin export is not a function`
- `failed to load plugin`
- `ERR_INVALID_ARG_TYPE`

```bash
opencode --print-logs --log-level DEBUG run "hi"
```

If none of those errors appear, the installation is coherent.

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

1. Remove the plugin entrypoint and shared core:
   ```bash
   rm ~/.config/opencode/.opencode/plugins/opentrust.js
   rm ~/.config/opencode/.opencode/lib/opentrust-core.js
   ```

2. Update `opencode.json` to remove the plugin entry
3. Restart the OpenCode session