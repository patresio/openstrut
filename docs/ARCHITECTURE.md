# Architecture

This document is the canonical reference for the current system structure of the
OpenCode Engineering Harness.

Active design proposals are in `docs/design/`.  
Accepted architectural decisions are in `docs/decisions/`.

---

## Current Phase

**Installer and Distribution Foundation** — safe installer CLI, artifact inventory, conflict detection, and manifest management.

No live OpenCode configuration has been modified. No package has been published.

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
- **Distribution**: SSH-only versioned tarball from the homelab; Verdaccio registry is a later option

---

## Repository Structure

```text
bin/
  opencode-engineering-harness.js  CLI entry point

src/
  installer/                       Installer modules (inventory, classify, install, check, plan, manifest, target, output)
  manifest/                        Change execution manifest generation

global/
  AGENTS.md                        Global engineering execution rules (shipped)
  opencode.json                    Global OpenCode configuration baseline (shipped)
  agents/                          Global OpenCode agent definitions (shipped)
  commands/                        Global OpenCode command definitions (shipped)
  skills/                          Global OpenCode skill definitions (shipped)

templates/
  project/                         Project initialization scaffold
    AGENTS.md
    .opencode/task-plans/          Task Plan location for initialized projects
    openspec/                      OpenSpec scaffold

evals/
  cases/                           Behavioral evaluation inputs
  fixtures/                        Evaluation fixtures
  expected/                        Reserved expected-output directory
  reports/                         Evaluation run reports (excluded from package)
  runner/                          Evaluation runner and adapter

docs/
  README.md                        Documentation index
  ARCHITECTURE.md                  This file — current system structure
  barsa/                           Barsa retrieval catalog and routing summaries
  decisions/                       Accepted architectural decision records
  design/                          Active design proposals

references/                        Read-only research material

releases/                          Versioned release tarballs (not shipped, committed only on approval)

.opencode/
  task-plans/                      Operational task ledgers for this repository
```

---

## Global OpenCode Configuration (Target)

The harness installs the following under `~/.config/opencode/`:

```text
AGENTS.md                   Global engineering rules
opencode.json               Managed baseline merged only through installer rules
agents/
  code-reviewer.md
  project-rules-auditor.md
  sdd.md
commands/
  eng-checkpoint.md
  eng-deliver.md
  eng-incident.md
  eng-init-project.md
  eng-plan.md
  eng-refresh-project-rules.md
  eng-resume.md
  eng-review.md
  eng-spec-change.md
  eng-status.md
skills/
  engineering-bdd-discovery/
  engineering-code-review/
  engineering-delivery/
  engineering-incident-triage/
  engineering-legacy-change/
  engineering-project-bootstrap/
  engineering-sdd-change/
  engineering-task-plan/
  engineering-tdd-first/
templates/project/          Bootstrap scaffold installed for runtime access
.engineering-harness/installation.json  Installation manifest
```

The installer treats `opencode.json` as a managed artifact and blocks on unmanaged conflicts.
Automatic JSON merging is deferred; conflicting files must be resolved manually. See [design/002](design/002-project-bootstrap-and-distribution.md).

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
| Global skills | 9 | Loaded on demand |
| Global commands | 10 | Prefixed `eng-` |
| Vector memory | 0 | Not used initially |
| Global MCPs | ≤ 2 | Documentation/retrieval only |

See [design/001](design/001-harness-architecture.md) for full rationale.

**Future deferred capability:** See [design/003](design/003-technical-debate-capability.md) for the planned multi-agent technical debate protocol (HARNESS-010, not yet implemented).

---

## Barsa MCP Retrieval Layer

Barsa MCP is the canonical retrieval boundary for books, official documentation, and curated operational knowledge used by the harness.

Known collections:

- `documentation`
- `technology`
- `personal`

Agents and skills should request retrieval through logical routing keys such as collection, context, bundle, project profile, or source policy.

Local filesystem paths such as `/srv/docs/biblioteca/...` are ingestion provenance only and must not appear as the runtime retrieval interface for project-facing instructions.

The operational spreadsheet `mapa_operacional.xlsx` is a curation input, not the runtime API. Reviewed summaries live under `docs/barsa/`.

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

1. **Current**: SSH-only versioned tarball built from approved source and stored under the homelab user data directory.
2. **Client install flow**: SCP tarball + `SHA256SUMS` over port 22, review with `plan`, then `install` and `check`.
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
