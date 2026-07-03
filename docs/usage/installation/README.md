# Server-Based Installation Guide

Install `@patrese/opencode-engineering-harness` on any new machine from this server.

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

This creates `patrese-opencode-engineering-harness-0.1.0.tgz` in the current directory.

### 2. Transfer to the client

```bash
# From the client machine
scp patrese@<server-ip>:/srv/projects/opencode-engineering-harness/patrese-opencode-engineering-harness-0.1.0.tgz ./
```

Replace `<server-ip>` with the server's IP (Tailscale `100.100.141.105`, LAN `192.168.0.101`, or hostname `homelab`).

### 3. Verify checksum

```bash
sha256sum patrese-opencode-engineering-harness-0.1.0.tgz
```

Compare with the server output of `sha256sum patrese-opencode-engineering-harness-0.1.0.tgz`.

### 4. Install the package globally

```bash
npm install -g ./patrese-opencode-engineering-harness-0.1.0.tgz
```

### 5. Verify the CLI

```bash
opencode-engineering-harness --version
opencode-engineering-harness --help
```

Expected output shows version `0.1.0` and available commands.

### 6. Install harness artifacts into OpenCode

```bash
# Review what will be installed
opencode-engineering-harness plan

# Install 72 managed artifacts into ~/.config/opencode
opencode-engineering-harness install

# Verify everything matches
opencode-engineering-harness check
```

Expected output: `All managed artifacts match the installed version.`

### 7. Verify in OpenCode

```bash
opencode agent list
```

You should see the following harness-managed agents in addition to native agents:

- `sdd` — OpenSpec change specification
- `code-reviewer` — read-only implementation review
- `project-rules-auditor` — read-only project rules audit
- `documentation-generator` — documentation generation
- `harness-generator` — harness bootstrapping

## What Gets Installed

After `install`, the following artifacts are materialized under `~/.config/opencode/`:

| Category | Count | Contents |
|---|---|---|
| Root config | 2 | `AGENTS.md`, `opencode.json` |
| Agents | 17 | sdd, code-reviewer, project-rules-auditor, documentation-generator, harness-generator, 12 domain specialists |
| Commands | 10 | `eng-*` workflow commands |
| Skills | 31 | engineering-*, harness-generation, worktree-lifecycle-management, 18 domain skills |
| Workflows | 8 | sequential and cowork workflow definitions |
| Templates | 4 | project bootstrap scaffold |

The `opencode.json` includes:

- **Barsa MCP** configured via `{env:BARSA_MCP}` for documentation retrieval
- **Skill allowlist**: `engineering-*`, `harness-generation`, `worktree-lifecycle-management`
- **Task delegation**: `explore`, `scout`, `code-reviewer`, `project-rules-auditor`, `documentation-generator`, `harness-generator`

## Troubleshooting

| Problem | Check |
|---|---|
| `sha256sum` mismatch | File corrupted during transfer; re-run SCP |
| `npm install -g` fails | Node.js ≥20 required; `npm --version` to verify |
| `check` reports drift | Run `plan` to see changes; do not overwrite local config manually |
| SSH connection refused | Verify server IP and Tailscale/LAN connectivity |
| Permission denied | Ensure SSH key is added (`ssh-add -l`) or use password auth |
| Agents not visible in OpenCode | Verify `~/.config/opencode/agents/` has `.md` files; restart OpenCode |

## Uninstall

```bash
# Remove global package
npm uninstall -g @patrese/opencode-engineering-harness

# Remove installed harness artifacts
rm -rf ~/.config/opencode/.engineering-harness

# Remove individual managed files listed in:
#   ~/.config/opencode/.engineering-harness/installation.json
```

> **Warning:** This does not revert local modifications to `opencode.json` or `AGENTS.md`. Back up these files before removal if you need to preserve local changes.

## Security

- This package is **private and UNLICENSED** — do not publish to any npm registry
- Do not install from untrusted sources
- Always verify tarball checksums before installation
- No telemetry, no external network calls from the installed artifacts
- Barsa MCP is optional and must be configured separately via `BARSA_MCP` env var
