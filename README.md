# OpenStrut

A versioned, auditable engineering harness and safe installer for OpenCode — with multi-CLI support for Codex, Claude Code, Aider, Goose, Cursor, and more.

**v0.4.0** · Private · Node.js ≥20 · Zero npm dependencies

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

```bash
# Install from GitHub
npx github:patresio/openstrut install

# Configure for a specific CLI
npx github:patresio/openstrut setup --cli opencode

# See what would be installed (dry-run)
npx github:patresio/openstrut plan
```

## CLI Commands

| Command | Description |
|---------|-------------|
| `openstrut plan` | Read-only inspection of what would be installed |
| `openstrut install` | Install managed artifacts into the target config root |
| `openstrut check` | Report drift between installed and packaged versions |
| `openstrut setup` | Interactive TUI to configure OpenStrut for multiple CLIs |

### Global Options

| Flag | Description |
|------|-------------|
| `--target <dir>` | Target config root (default: `$XDG_CONFIG_HOME/opencode`) |
| `--dry-run` | Simulate without writing |
| `--json` | Machine-readable JSON output |
| `--cli <ids>` | Comma-separated CLI IDs for non-interactive setup |
| `--home <dir>` | Home root for path expansion (testing/isolation) |

### Supported CLIs

| CLI | Config Format | MCP Support |
|-----|---------------|-------------|
| OpenCode | JSON (`opencode.jsonc`) | ✅ SSE |
| Codex | TOML (`config.toml`) | ✅ stdio |
| Claude Code | JSON (`settings.json`) | ✅ stdio |
| Aider | YAML (`.aider.conf.yml`) | ✅ stdio |
| Goose | YAML (`config.yaml`) | ✅ stdio |
| Cursor | JSON (`settings.json`) | ✅ stdio |

## Architecture

```
openstrut
├── bin/openstrut.js          # CLI entrypoint
├── src/
│   ├── installer/            # Plan, install, check, inventory
│   ├── manifest/             # Manifest generation and validation
│   ├── setup/                # Multi-CLI TUI and config writers
│   └── workflows/            # Workflow parsing and validation
├── global/                   # Shipped OpenCode artifacts
│   ├── agents/               # 40 agent prompt files
│   ├── skills/               # 11 skill definitions
│   ├── commands/             # 7 command definitions
│   ├── context/              # Semantic selector catalog (CTX/SK/B/AG/DOC)
│   ├── opentrust/docs/       # Runtime OpenTrust documentation
│   └── opencode.json         # Default OpenCode configuration
├── templates/project/        # Project bootstrap scaffold
├── workflows/                # 8 workflow definitions
└── tests/                    # 266 tests (node:test)
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

- [GitHub Release](https://github.com/patresio/openstrut/releases/tag/v0.4.0)
- [CHANGELOG](./CHANGELOG.md)
- [Contributing Guide](./CONTRIBUTING.md)

## License

UNLICENSED — private project.
