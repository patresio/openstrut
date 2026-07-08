# Server-Based Installation Guide

Install `@patrese/openstrut` on any new machine from this server.

## Prerequisites

| Machine | Requirements |
|---|---|
| **Server** (this machine) | Node.js ≥20, npm, repository checked out at `/srv/projects/opencode-engineering-harness` |
| **Client** (target machine) | Node.js ≥20, npm, SSH access to this server |

## Step-by-Step

### 1. Build the package on the server

```bash
cd /srv/projects/opencode-engineering-harness
npm pack
```

This creates `patrese-openstrut-0.2.1.tgz` in the current directory.

### 2. Transfer to the client

```bash
# From the client machine
scp patrese@<server-ip>:/srv/projects/opencode-engineering-harness/patrese-openstrut-0.2.1.tgz ./
```

### 3. Verify checksum

```bash
sha256sum patrese-openstrut-0.2.1.tgz
```

Compare with the server output.

### 4. Install the package globally

```bash
npm install -g ./patrese-openstrut-0.2.1.tgz
```

### 5. Verify the CLI

```bash
openstrut --version
openstrut --help
```

Expected output shows version `0.2.1`.

### 6. Install OpenTrust runtime into OpenCode

```bash
openstrut plan
openstrut install
openstrut check
```

`install` now reconciles stale previously-managed legacy artifacts:
- removes stale managed files no longer in current inventory;
- preserves locally modified legacy files;
- updates `.openstrut/installation.json` to current inventory.

### 7. Verify in OpenCode

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

- This package is **private and UNLICENSED** — do not publish to any npm registry
- Do not install from untrusted sources
- Always verify tarball checksums before installation
- No telemetry, no external network calls from the installed artifacts
