# OpenCode Engineering Harness

A versioned, auditable engineering harness and safe installer for OpenCode.

**Current phase: Installer and Distribution Foundation**

---

## Purpose

This repository develops a controlled, versionable engineering harness for OpenCode.

The harness will provide:

- a global `AGENTS.md` — engineering rules for the default `build` agent and all delegated work;
- controlled OpenCode agents and subagents;
- reusable engineering skills;
- workflow commands;
- project initialization templates;
- a safe CLI installer distributed from the homelab;
- deterministic validation and behavioral evaluations.

The project must remain small, auditable, reversible, and independent of unnecessary agent frameworks.

---

## Status

**Phase: Installer and Distribution Foundation**

The global artifact set, project bootstrap templates, safe installer CLI, execution-manifest generator, workflow validation scaffolding, and installable `0.1.0` package are implemented.

The recommended distribution path is npm installing from the local git bare repository at `/srv/git/opencode-engineering-harness.git`. The package is not published to a public npm registry.
See [Architecture](docs/ARCHITECTURE.md) for the distribution strategy.

---

## Installation

Recommended local install from git bare:

```bash
npm install -g /srv/git/opencode-engineering-harness.git
```

Then run:

```bash
opencode-engineering-harness plan
opencode-engineering-harness install
opencode-engineering-harness check
```

## CLI Usage

```bash
# Show what would be installed (read-only)
opencode-engineering-harness plan [--target <dir>] [--json]

# Install managed artifacts into the target configuration root
opencode-engineering-harness install [--target <dir>] [--dry-run] [--json]

# Report drift between installed artifacts and the packaged version
opencode-engineering-harness check [--target <dir>] [--json]

# Generate deterministic execution manifest for an approved OpenSpec change
opencode-engineering-harness generate-manifest --change <openspec-change-dir>

# Manage workflow definitions
opencode-engineering-harness workflow list
opencode-engineering-harness workflow validate <workflow-file>
opencode-engineering-harness workflow run <workflow-file>

# Options
opencode-engineering-harness --help
opencode-engineering-harness --version
```

### Runtime Evaluation

The harness includes a reproducible evaluation framework to verify its runtime behavior. **Warning**: Runtime evaluations execute live model calls and may consume model quota.

```bash
# Run structural and static validation only (no external model calls)
npm run eval:deterministic

# Run behavioral evaluations inside an isolated temporary OpenCode config
npm run eval:runtime

# Run both evaluation layers
npm run eval:all
```


**Default target** (precedence order):
1. `--target <directory>` when provided
2. `$XDG_CONFIG_HOME/opencode` when `XDG_CONFIG_HOME` is set
3. `$HOME/.config/opencode`

**Custom target:** use `--target <directory>` for CI or isolated validation.

### Managed files

The following are installed into the target configuration root:

- `AGENTS.md` — global engineering rules
- `opencode.json` — canonical global agent and model configuration
- `agents/` — custom subagent definitions
- `commands/` — workflow command shortcuts
- `skills/` — reusable engineering skills
- `templates/project/` — project bootstrap templates (installed for runtime access, never blindly applied to a project)

### Conflict behavior

- Existing files that differ without harness ownership are **preserved** and installation is blocked.
- Locally modified managed files are **preserved** and installation is blocked.
- Run `plan` to review before running `install`.

### Ownership manifest

An installation manifest is stored at:

```
<target>/.engineering-harness/installation.json
```

The manifest records which files were installed and their checksums. It never stores secrets, API keys, tokens, or private data.

### Limitations in this release

- `uninstall` is not implemented.
- Automatic JSON merging for `opencode.json` or `AGENTS.md` is not implemented. Conflicting files must be resolved manually.
- References, design documents, and private books are not distributed in the package.
- Per-file writes are atomic (POSIX rename). Cross-file rollback is best-effort: abrupt process termination may require a subsequent `check` or manual recovery.

---

## Repository Structure

```text
bin/                        CLI entry point
src/
  installer/                Installer modules (inventory, classify, install, check, plan, manifest, target, output)
  manifest/                 OpenSpec change execution-manifest generator
global/
  AGENTS.md                 Global engineering execution rules
  agents/                   Global OpenCode agent definitions
  commands/                 Global OpenCode command definitions
  skills/                   Global OpenCode skill definitions
templates/
  project/                  Project initialization template
evals/
  cases/                    Behavioral evaluation cases
  fixtures/                 Evaluation input fixtures
  expected/                 Reserved expected-output directory
  reports/                  Evaluation run reports
  runner/                   Evaluation runner and adapter
scripts/                    Reserved for future validation helpers
docs/
  README.md                 Documentation index
  ARCHITECTURE.md           Current system structure (canonical)
  barsa/                    Barsa MCP retrieval catalog and source policy summaries
  usage/                    Operational usage and installation guides
  decisions/                Accepted architectural decisions (ADRs)
  design/                   Active design proposals
references/                 Read-only research material (do not modify)
  books/                    Reference PDFs (excluded from package)
  docs/                     Vendored OpenCode documentation
  current-state/            Redacted current OpenCode configuration snapshot
releases/                   Versioned release tarballs (committed after approval only)
.opencode/
  task-plans/               Operational task ledgers (HARNESS-NNN format)
```

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the contribution contract, branching policy,
and current boundary of allowed work.

---

## References

Files under `references/` are **read-only research material**.

- Do not modify, rename, or redistribute reference files.
- Reference manifests and MDX documentation are version-controlled.
- PDF book files are excluded from version control by `.gitignore`.
- Barsa MCP is the retrieval boundary for books, official docs, and curated operational knowledge.
- Local source paths are ingestion provenance only; use Barsa collections, contexts, bundles, and source policies in agent-facing docs.

---

## License

UNLICENSED — private project, not for distribution.
