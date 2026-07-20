# OpenStrut

A versioned, auditable engineering harness and safe installer for OpenCode — with multi-CLI support for Codex, Claude Code, Aider, Goose, Cursor, and more.

**v0.4.1** · Private · Node.js ≥20 · Zero npm dependencies

## What is this?

OpenStrut packages a complete AI-assisted engineering setup — agents, skills, workflows, permissions, and team topology — into a versioned, reproducible artifact. Install it into any supported CLI tool with a single command.

### Shipped artifacts

| Category | Count |
|----------|-------|
| Agents (9 leads + 31 subagents) | 40 |
| Skills | 11 |
| Commands | 7 |
| Context catalog (CTX/SK/B/AG/DOC) | 127 |
| OpenTrust runtime docs | 10 |
| Templates | 4 |
| **Total** | **202** |

## Quick Start

### Prerequisites

- Node.js >=20
- One of the supported platforms: OpenCode, Claude Code, Codex, or Hermes-Agent

### Installation

```bash
# 1. Install OpenStrut into OpenCode config
npx github:patresio/openstrut install --force

# 2. Configure MCP servers (interactive)
npx github:patresio/openstrut setup
# Press Enter = OpenCode only (default)

# 3. See what would be installed (dry-run)
npx github:patresio/openstrut plan
```

### Multi-Platform Installation

OpenStrut supports multiple platforms. Install plugins for your preferred platform:

```bash
# Install OpenCode plugin
openstrut setup --platform opencode

# Install Claude Code plugin
openstrut setup --platform claude

# Install Codex plugin
openstrut setup --platform codex

# Install Hermes plugin
openstrut setup --platform hermes
```

Each platform plugin includes:
- 40 agents (9 leads + 31 subagents)
- 11 skills
- 10 commands
- 32 CTX + 24 B context selectors
- Bootstrap injection for automatic loading

### Environment Variables

Add to `~/.bashrc` or `~/.zshrc`:

```bash
# 9Router — LLM provider
export NINE_ROUTER_BASE_URL="http://your-server:port"
export NINE_ROUTER_API_KEY="your-api-key"

# homelab-ai-coding — MCP server (file operations, GitHub, etc.)
export HOMELAB_AI_CODING_MCP_URL="http://your-server:port/sse"

# Barsa — MCP server (reference retrieval, knowledge)
export BARSA_MCP_URL="http://your-server:port/sse"
```

Then reload: `source ~/.bashrc`

## CLI Commands

| Command | Description |
|---------|-------------|
| `openstrut plan` | Read-only inspection of what would be installed |
| `openstrut install` | Install managed artifacts into the target config root |
| `openstrut check` | Report drift between installed and packaged versions |
| `openstrut setup` | Interactive TUI to configure OpenStrut for multiple CLIs |
| `openstrut setup --platform <name>` | Install plugin for specific platform |

### Global Options

| Flag | Description |
|------|-------------|
| `--target <dir>` | Target config root (default: `$XDG_CONFIG_HOME/opencode`) |
| `--dry-run` | Simulate without writing |
| `--force`, `-f` | Overwrite existing files (backup before overwrite) |
| `--json` | Machine-readable JSON output |
| `--cli <ids>` | Comma-separated CLI IDs for non-interactive setup |
| `--platform <name>` | Install plugin for specific platform (opencode, claude, codex, hermes) |
| `--home <dir>` | Home root for path expansion (testing/isolation) |

### Supported Platforms

| Platform | Plugin Location | Description |
|----------|-----------------|-------------|
| OpenCode | `.opencode/plugins/opentrust.js` | OpenCode plugin |
| Claude Code | `.claude-plugin/plugin.json` | Claude Code plugin |
| Codex | `.codex-plugin/plugin.json` | Codex plugin |
| Hermes | `plugins/opentrust/plugin.yaml` | Hermes plugin |

## Architecture

```
openstrut
├── bin/openstrut.js          # CLI entrypoint
├── src/
│   ├── installer/            # Plan, install, check, inventory
│   ├── manifest/             # Manifest generation and validation
│   ├── setup/                # Multi-CLI TUI and config writers
│   ├── plugins/              # Multi-platform plugin system
│   │   ├── tool-mapping.js   # Tool mapping interface
│   │   ├── opencode-mapping.js
│   │   ├── claude-mapping.js
│   │   ├── codex-mapping.js
│   │   ├── hermes-mapping.js
│   │   └── plugin-installer.js
│   └── workflows/            # Workflow parsing and validation
├── global/                   # Shipped OpenCode artifacts
│   ├── agents/               # 40 agent prompt files
│   ├── skills/               # 11 skill definitions
│   ├── commands/             # 7 command definitions
│   ├── context/              # Semantic selector catalog (CTX/SK/B/AG/DOC)
│   ├── opentrust/docs/       # Runtime OpenTrust documentation
│   └── opencode.json         # Default OpenCode configuration
├── .opencode/plugins/        # OpenCode plugin
│   └── opentrust.js
├── .claude-plugin/           # Claude Code plugin
│   ├── plugin.json
│   └── skills/
├── .codex-plugin/            # Codex plugin
│   ├── plugin.json
│   ├── bootstrap.js
│   └── skills/
├── plugins/opentrust/        # Hermes plugin
│   ├── plugin.yaml
│   ├── __init__.py
│   ├── hooks.py
│   ├── tools.py
│   └── skills/
├── templates/project/        # Project bootstrap scaffold
├── workflows/                # 8 workflow definitions
└── tests/                    # 266+ tests (node:test)
```

## Development

```bash
# Install
npm install

# Run all tests
npm test

# Run specific test suites
npm run test:installer
npm run test:setup
npm run test:manifest

# Package dry-run
npm pack --dry-run
```

### Test Commands

| Command | What it tests |
|---------|---------------|
| `npm test` | Full suite (266 tests, 40 suites) |
| `npm run test:installer` | Installer logic and inventory |
| `npm run test:setup` | Multi-CLI TUI and config writers |
| `npm run test:manifest` | Manifest generation and validation |
| `npm run eval:deterministic` | Deterministic evaluation layer |

## Engineering Principles

- **Zero dependencies** — pure Node.js built-ins only
- **TDD-first** — test-first workflow for all behavioral changes
- **Evidence before decision** — every gate requires demonstrable proof
- **Approval before mutation** — no code changes without explicit plan approval
- **Least privilege** — agents get only the permissions they need, no wildcards
- **Versioned artifacts** — every agent, skill, command, and context is version-controlled

## Team Topology

OpenTrust organizes AI-assisted engineering into **9 specialized teams**:

| Team | Focus |
|------|-------|
| Trust Coordination | Cross-team communication, decision logging |
| Product / Discovery | Requirements, acceptance criteria, story slicing |
| Architecture | Structural decisions, domain modeling, ADRs |
| Engineering | Implementation, refactoring, performance, security |
| Testing / Quality | Test strategy, TDD, integration tests |
| Review / Governance | Independent review, compliance, accessibility |
| DevOps / SRE | CI/CD, infrastructure, observability |
| Delivery / Release | Versioning, changelog, deployment |
| Knowledge / Context | Context retrieval, reference management |

Each team has one lead agent and 2-5 subagents. Teams coordinate through task contracts and explicit file-level ownership.

## How the Installer Works

The installer tracks what it installed using a **manifest** (`.harness/installation.json`):

```
~/.config/opencode/
├── .harness/
│   └── installation.json    ← manifest (checksums of all 202 artifacts)
├── AGENTS.md                ← installed by harness
├── opencode.json            ← installed by harness
└── agents/                  ← installed by harness
```

**Conflict detection:**
- File not in manifest + different content → `unmanaged-conflict` (blocks install)
- File in manifest + content changed → `managed-locally-modified` (blocks install)
- File in manifest + content same as packaged → `managed-outdated` (safe to update)

**With `--force`:** All conflicts are overwritten (backup created first), except manifest corruption.

**Commands:**
- `openstrut plan` — see what would change (read-only)
- `openstrut install` — install with conflict detection
- `openstrut install --force` — install, overwrite conflicts
- `openstrut check` — detect drift from installed version

## Skills

| Skill | Purpose |
|-------|---------|
| `opentrust-grilling` | Interview pattern — one question at a time, exhaust decision tree |
| `opentrust-domain-modeling` | Living glossary (GLOSSARY.md), ADR 3-gate |
| `opentrust-handoff` | Context compactation between sessions |
| `opentrust-diagnose` | 6-phase bug diagnosis, feedback-loop-first |
| `opentrust-review` | Two-axis review: Standards + Spec, Fowler code smells |
| `opentrust-tdd` | Seams-first TDD, vertical slices, RED-GREEN-REFACTOR |
| `opentrust-task-contract` | Task contract creation with retrieval selectors |
| `opentrust-spec-change` | Structured spec and design changes |
| `opentrust-delivery` | Conventional Commits, PR creation |
| `opentrust-observability` | Execution reports and validation evidence |
| `opentrust-reference-research` | Operational Retrieval Map selector usage |

## Security

- No wildcard `"*": "allow"` permissions — verified by automated tests
- Agent permissions scoped to specific file paths and command patterns
- All file operations use temp directories — never mutates real config without approval
- Secrets are never hardcoded or committed

## Links

- [GitHub Release](https://github.com/patresio/openstrut/releases/tag/v0.4.1)
- [CHANGELOG](./CHANGELOG.md)
- [Contributing Guide](./CONTRIBUTING.md)

## License

UNLICENSED — private project.
