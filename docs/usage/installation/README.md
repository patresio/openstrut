# Server-Based Installation Guide

Install `@patrese/openstrut` on any new machine from this server.

## Prerequisites

| Machine | Requirements |
|---|---|
| **Server** (this machine) | Node.js ≥20, npm, repository checked out at `/srv/projects/openstrut` |
| **Client** (target machine) | Node.js ≥20, npm, SSH access to this server |

## Step-by-Step

### 1. Build the package on the server

```bash
cd /srv/projects/openstrut
npm pack
```

This creates `patrese-openstrut-0.2.0.tgz` in the current directory.

### 2. Transfer to the client

```bash
# From the client machine
scp patrese@<server-ip>:/srv/projects/openstrut/patrese-openstrut-0.1.0.tgz ./
```

Replace `<server-ip>` with the server's IP (Tailscale `100.100.141.105`, LAN `192.168.0.101`, or hostname `homelab`).

### 3. Verify checksum

```bash
sha256sum patrese-openstrut-0.1.0.tgz
```

Compare with the server output of `sha256sum patrese-openstrut-0.1.0.tgz`.

### 4. Install the package globally

```bash
npm install -g ./patrese-openstrut-0.1.0.tgz
```

### 5. Verify the CLI

```bash
openstrut --version
openstrut --help
```

Expected output shows version `0.2.0` and available commands.

### 6. Install harness artifacts into OpenCode

```bash
# Review what will be installed
openstrut plan

# Install 84 managed artifacts into ~/.config/opencode
openstrut install

# Verify everything matches
openstrut check
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
| Agent Count | 21 | sdd, code-reviewer, project-rules-auditor, documentation-generator, harness-generator, skill-creator, performance-optimizer, release-manager, compliance-auditor, 12 domain specialists |
| Commands | 10 | `eng-*` workflow commands |
| Skills | 39 | 13 engineering skills + 26 domain skills |
| Workflows | 8 | sequential and cowork workflow definitions |
| Templates | 4 | project bootstrap scaffold |

The `opencode.json` includes:

- **Barsa MCP** configured via `{env:BARSA_MCP}` for documentation retrieval
- **Skill allowlist**: all 39 skills permitted for build agent
- **Task allowlist**: all 21 agents permitted for build agent
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
npm uninstall -g @patrese/openstrut

# Remove installed harness artifacts
rm -rf ~/.config/opencode/.openstrut

# Remove individual managed files listed in:
#   ~/.config/opencode/.openstrut/installation.json
```

> **Warning:** This does not revert local modifications to `opencode.json` or `AGENTS.md`. Back up these files before removal if you need to preserve local changes.

## Security

- This package is **private and UNLICENSED** — do not publish to any npm registry
- Do not install from untrusted sources
- Always verify tarball checksums before installation
- No telemetry, no external network calls from the installed artifacts
- Barsa MCP is optional and must be configured separately via `BARSA_MCP` env var
