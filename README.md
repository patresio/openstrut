# OpenCode Engineering Harness

A versioned, auditable engineering harness and safe installer for OpenCode.

**Current phase: Repository Foundation**

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

The global artifact set, project bootstrap templates, and safe installer CLI are implemented.

The CLI is not yet distributed from the homelab or published to a registry.
See [Architecture](docs/ARCHITECTURE.md) for the target distribution strategy.

---

## CLI Usage

```bash
# Show what would be installed (read-only)
opencode-engineering-harness plan [--target <dir>] [--json]

# Install managed artifacts into the target configuration root
opencode-engineering-harness install [--target <dir>] [--dry-run] [--json]

# Report drift between installed artifacts and the packaged version
opencode-engineering-harness check [--target <dir>] [--json]

# Options
opencode-engineering-harness --help
opencode-engineering-harness --version
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
  expected/                 Expected evaluation outputs
  reports/                  Evaluation run reports
scripts/                    Deterministic validation scripts
docs/
  ARCHITECTURE.md           Current system structure (canonical)
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

---

## License

UNLICENSED — private project, not for distribution.
