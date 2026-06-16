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

**Phase: Repository Foundation**

The repository structure, documentation, and package metadata are being established.
No functional installer behavior, agents, skills, commands, or live OpenCode configuration
changes are implemented at this stage.

See the [Architecture document](docs/ARCHITECTURE.md) for the target system structure.  
See [design proposals](docs/design/) for active decisions under review.  
See [accepted decisions](docs/decisions/) for finalized architectural decisions.

---

## Repository Structure

```text
bin/                        Future CLI entry point
src/
  commands/                 Future CLI command implementations
  config/                   Future configuration merge logic
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
