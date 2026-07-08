# OpenStrut

A versioned, auditable engineering harness and safe installer for OpenCode — rebranded as OpenStrut.

**Current phase: Installer and Distribution Foundation — rebranded to OpenStrut**

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

**Phase: OpenTrust Runtime Foundation**

The OpenTrust runtime, safe installer CLI, project bootstrap templates, execution-manifest generator, workflow validation scaffolding, and installable `0.2.2` package are implemented.

The recommended distribution path is downloading the release tarball from GitHub Releases and installing it with `npm install -g`. The package is not published to a public npm registry.
See [Architecture](docs/ARCHITECTURE.md) for the distribution strategy.

## Documentation Governance

This repository uses task-linked documentation:
- Instruction files (`AGENTS.md`, `CONTRIBUTING.md`, README.md) are versioned via HARNESS Task Plans
- All governance changes are documented in `CHANGELOG.md` and require approval
- `AGENTS.md` defines current sources of truth, permissions, and workflow
- `CONTRIBUTING.md` defines contribution mechanics, execution contract, and delivery boundaries
- `README.md` remains the entry point and linked to `docs/ARCHITECTURE.md`
- Design proposals live in `docs/design/`, accepted decisions in `docs/decisions/`
- Version governance is aligned with HARNESS-019 for future enhancements

---

## Installation

### GitHub Release Tarball (Recommended)

Install on any new machine:

```bash
curl -L -o patrese-openstrut-0.2.2.tgz https://github.com/patresio/openstrut/releases/download/v0.2.2/patrese-openstrut-0.2.2.tgz
npm install -g ./patrese-openstrut-0.2.2.tgz
openstrut plan
openstrut install
openstrut check
```

### Manual Steps

1. **Download the release asset:**

   ```bash
   curl -L -o patrese-openstrut-0.2.2.tgz https://github.com/patresio/openstrut/releases/download/v0.2.2/patrese-openstrut-0.2.2.tgz
   ```

2. **Install globally:**

   ```bash
   npm install -g ./patrese-openstrut-0.2.2.tgz
   ```

3. **Review, install, and verify:**

   ```bash
   openstrut plan
   openstrut install
   openstrut check
   ```

### Target Directory Overrides

Use custom target for isolated validation (CI, nested configs):

```bash
openstrut plan --target ./my-config
openstrut install --target ./my-config
openstrut check --target ./my-config
```

## CLI Usage

```bash
# Show what would be installed (read-only)
openstrut plan [--target <dir>] [--json]

# Install managed artifacts into the target configuration root
openstrut install [--target <dir>] [--dry-run] [--json]

# Report drift between installed artifacts and the packaged version
openstrut check [--target <dir>] [--json]

# Generate deterministic execution manifest for an approved OpenSpec change
openstrut generate-manifest --change <openspec-change-dir>

# Manage workflow definitions
openstrut workflow list
openstrut workflow validate <workflow-file>
openstrut workflow run <workflow-file>

# Options
openstrut --help
openstrut --version
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
- `opentrust/docs/` — OpenTrust workflow and architecture documentation
- `opentrust/reference-map/` — OpenTrust selector definitions and context matrix
- `templates/project/` — project bootstrap templates (installed for runtime access, never blindly applied to a project)

### Conflict behavior

- Existing files that differ without harness ownership are **preserved** and installation is blocked.
- Locally modified managed files are **preserved** and installation is blocked.
- Run `plan` to review before running `install`.

### Ownership manifest

An installation manifest is stored at:

```
<target>/.openstrut/installation.json
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
