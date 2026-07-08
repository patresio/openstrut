# GitHub Release Installation Guide

Install `@patrese/openstrut` on a new machine from a GitHub Release tarball.

The package is private and not published to a public npm registry.

## Prerequisites

| Machine | Requirements |
|---|---|
| **Client** | Node.js ≥20, npm, GitHub access to `patresio/openstrut` |

## Step-by-Step

### 1. Download the release tarball

```bash
curl -L -o patrese-openstrut-0.2.1.tgz https://github.com/patresio/openstrut/releases/download/v0.2.1/patrese-openstrut-0.2.1.tgz
```

### 2. Verify checksum

Download or compare the release checksum published with the release notes:

```bash
sha256sum patrese-openstrut-0.2.1.tgz
```

### 3. Install the package globally

```bash
npm install -g ./patrese-openstrut-0.2.1.tgz
```

### 4. Verify the CLI

```bash
openstrut --version
openstrut --help
```

Expected output shows version `0.2.1`.

### 5. Install OpenTrust runtime into OpenCode

```bash
openstrut plan
openstrut install
openstrut check
```

`install` reconciles stale previously-managed legacy artifacts:
- removes stale managed files no longer in current inventory;
- preserves locally modified legacy files;
- updates `.openstrut/installation.json` to current inventory.

### 6. Restart and verify OpenCode

Restart OpenCode after install.

Check for:
- `trust-lead` as default agent;
- 7 `/ot-*` commands;
- OpenTrust leader/subagent topology.

## What Gets Installed

After `install`, the active runtime under `~/.config/opencode/` is:

| Category | Count | Contents |
|---|---|---|
| Root config | 2 | `AGENTS.md`, `opencode.json` |
| Agents | 38 | 9 leaders + 29 subagents |
| Commands | 7 | `ot-*` workflow commands |
| Skills | 7 | `opentrust-*` workflow skills |
| Workflows | 8 | workflow definitions |
| Templates | 4 | project bootstrap scaffold |

The installed `opencode.json` includes:
- `trust-lead` as `default_agent`;
- OpenTrust instructions and references;
- scoped per-agent permissions;
- Barsa MCP and project provider settings preserved from shipped runtime.

## Troubleshooting

| Problem | Check |
|---|---|
| `check` reports drift | Run `plan`; review local modifications before reinstall |
| `/ot-*` commands not visible | Confirm `~/.config/opencode/commands/ot-*.md` exists; restart OpenCode |
| `build` still appears as default | Confirm installed `~/.config/opencode/opencode.json` has `default_agent: "trust-lead"` |
| Legacy `eng-*` commands still visible | Re-run `openstrut install`; stale managed legacy files should be removed automatically |
| Agents not visible in OpenCode | Verify `~/.config/opencode/agents/` contains OpenTrust files; restart OpenCode |

## Security

- This package is **private and UNLICENSED** — do not publish to any public npm registry
- Do not install from untrusted sources
- Always verify tarball checksums before installation
- No telemetry, no external network calls from the installed artifacts
