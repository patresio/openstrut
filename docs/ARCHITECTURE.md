# Architecture

This document is the canonical reference for the current system structure of the
OpenCode Engineering Harness.

Active design proposals are in `docs/design/`.  
Accepted architectural decisions are in `docs/decisions/`.

---

## Current Phase

**Repository Foundation** — structure, documentation, and package metadata.

No functional installer, agents, skills, or commands are implemented yet.

---

## System Overview

The harness is a versioned, auditable engineering configuration for OpenCode.

It has two deployment surfaces:

| Surface | Mechanism |
|---|---|
| Global OpenCode configuration | Safe installer (`npm pack` + `npx`) |
| Project-local initialization | `/eng-init-project` command via OpenCode |

The installer operates on the **machine**; the project command operates inside a **repository**.
They must not be conflated.

---

## Runtime

- **Node.js ≥ 20**
- **ESM package** (`"type": "module"`)
- **Private** (`"private": true`) — not published to a public registry
- **Distribution**: versioned tarball from the homelab; Verdaccio registry is a later option

---

## Repository Structure

```text
bin/
  patrese-harness.js        Future CLI entry point (not yet created)

src/
  commands/                 CLI command implementations
  config/                   Configuration merge logic (JSONC-safe)

global/
  AGENTS.md                 Global engineering execution rules (shipped)
  agents/                   Global OpenCode agent definitions (shipped)
  commands/                 Global OpenCode command definitions (shipped)
  skills/                   Global OpenCode skill definitions (shipped)

templates/
  project/                  Project initialization scaffold
    .opencode/
      task-plans/           Task Plan location for initialized projects

evals/
  cases/                    Behavioral evaluation inputs
  fixtures/                 Evaluation fixtures
  expected/                 Expected evaluation outputs
  reports/                  Evaluation run reports (excluded from package)

scripts/                    Deterministic structural validation scripts

docs/
  ARCHITECTURE.md           This file — current system structure
  decisions/                Accepted architectural decision records
  design/                   Active design proposals

references/                 Read-only research material
  books/                    Reference PDFs (not shipped, excluded by .gitignore)
  docs/                     Vendored OpenCode documentation (not shipped)
  current-state/            Redacted configuration snapshot (not shipped)

releases/                   Versioned release tarballs (not shipped, committed on approval)

.opencode/
  task-plans/               Operational task ledgers for this repository
```

---

## Global OpenCode Configuration (Target)

The harness installs the following under `~/.config/opencode/`:

```text
AGENTS.md                   Global engineering rules
agents/
  code-reviewer.md          Mandatory global subagent
  project-rules-auditor.md  Read-only project audit subagent
commands/
  eng-plan.md
  eng-resume.md
  eng-checkpoint.md
  eng-status.md
  eng-review.md
  eng-deliver.md
  eng-incident.md
  eng-init-project.md
  eng-refresh-project-rules.md
skills/
  engineering-task-plan/
  engineering-tdd-first/
  engineering-legacy-change/
  engineering-bdd-discovery/
  engineering-code-review/
  engineering-delivery/
  engineering-incident-triage/
  engineering-project-bootstrap/
.patrese-harness.json       Installation manifest
```

The installer makes a **safe, targeted merge** into `opencode.json`.
It never overwrites the complete file. See [design/002](design/002-project-bootstrap-and-distribution.md).

---

## Installer Safety Invariants

- Never overwrite `opencode.json` completely.
- Inspect existing configuration before mutation.
- Preserve unknown keys.
- Preserve comments when practical.
- Show planned changes before writing.
- Create a backup before mutation.
- Modify only explicitly managed paths.
- Maintain a manifest of managed files and hashes.
- Block on unmanaged conflicts.
- Preserve secrets and machine-specific values.
- Support validation and rollback.
- Never include credentials, tokens, or private user data in the package.

---

## Agent Architecture

| Component | Count | Decision |
|---|---|---|
| Primary agents | 2 | `build` and `plan` (native) |
| Mandatory global subagents | 2 | `explore`, `code-reviewer` |
| Conditional global subagent | 1 | `scout` (when available) |
| Global skills | 8 | Loaded on demand |
| Global commands | 9 | Prefixed `eng-` |
| Vector memory | 0 | Not used initially |
| Global MCPs | ≤ 2 | Documentation/retrieval only |

See [design/001](design/001-harness-architecture.md) for full rationale.

---

## Memory Layers

| Layer | Mechanism |
|---|---|
| 0 — Session context | Native OpenCode compaction |
| 1 — Task state | `.opencode/task-plans/<task-id>.md` |
| 2 — Project memory | `AGENTS.md`, `CONTRIBUTING.md`, `docs/`, ADRs |
| 3 — Harness memory | `docs/decisions/`, `CHANGELOG.md`, `evals/` |

No vector databases, embeddings, or automatic session capture.

---

## Package Contents (Intended)

The npm package includes only:

```text
bin/
src/
global/
templates/
```

Excluded from the package:

- `references/`
- `evals/`
- `scripts/`
- `docs/`
- `releases/`
- `.opencode/`
- Task Plans
- Design proposals
- Environment files
- Secrets

---

## Distribution Strategy

1. **Current (foundation)**: `npm pack` locally; no tarballs committed yet.
2. **First release**: versioned tarball served from homelab.
3. **Later**: private Verdaccio registry (not yet required).

---

## Constraints

Do not introduce without explicit approval:

- agent frameworks
- vector databases or embedding pipelines
- external memory services
- Verdaccio (not yet)
- Docker services
- databases
- web applications
- telemetry or cloud services
- global npm installation
- automatic publication
- automatic modification of live OpenCode configuration
