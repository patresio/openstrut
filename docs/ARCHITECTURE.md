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
  usage/                           Operational usage and installation guides
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
AGENTS.md                            Global engineering rules
opencode.json                        Managed baseline — installer preserves unknown keys
agents/
  sdd.md                             AG13  OpenSpec change specification
  code-reviewer.md                   AG14  Read-only implementation review
  project-rules-auditor.md           AG15  Read-only project rules audit
  documentation-generator.md         AG16  Documentation generation
  harness-generator.md               AG17  Harness bootstrapping
  knowledge-system-designer.md       AG01  Knowledge system architecture
  personal-operating-system-advisor.md  AG02  Personal productivity systems
  business-product-strategist.md     AG03  Business/product strategy
  career-communication-advisor.md    AG04  Career & communication
  software-architect.md              AG05  Software architecture
  backend-data-reviewer.md           AG06  Backend/data review
  devops-sre-advisor.md              AG07  DevOps/SRE advisory
  code-quality-testing-reviewer.md   AG08  Code quality & testing
  security-infrastructure-reviewer.md  AG09  Security & infrastructure
  frontend-ux-reviewer.md            AG10  Frontend/UX review
  ai-rag-agent-architect.md          AG11  AI/RAG agent architecture
  health-exercise-nutrition-researcher.md  AG12  Health & wellness
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
  engineering-bdd-discovery/         SK19  BDD discovery
  engineering-code-review/           SK20  Code review
  engineering-delivery/              SK21  Delivery
  engineering-documentation/         SK29  Documentation generation
  engineering-incident-triage/       SK22  Incident triage
  engineering-legacy-change/         SK23  Legacy change
  engineering-project-bootstrap/     SK24  Project bootstrap
  engineering-sdd-change/            SK25  SDD change
  engineering-task-plan/             SK26  Task planning
  engineering-tdd-first/             SK27  TDD first
  harness-generation/                SK30  Harness generation
  team-cowork-orchestration/         SK28  Cowork orchestration
  worktree-lifecycle-management/     SK31  Worktree lifecycle
  knowledge-system-design/           SK01  Knowledge system design
  learning-plan-design/              SK02  Learning plan design
  personal-execution-system/         SK03  Personal execution system
  financial-organization/            SK04  Financial organization
  product-discovery/                 SK05  Product discovery
  leadership-feedback/               SK06  Leadership feedback
  career-positioning/                SK07  Career positioning
  architecture-decision/             SK08  Architecture decision
  domain-modeling/                   SK09  Domain modeling
  distributed-systems-review/        SK10  Distributed systems
  api-data-design/                   SK11  API data design
  devops-sre-diagnostics/            SK12  DevOps/SRE diagnostics
  frontend-ux-review/                SK13  Frontend/UX review
  code-refactoring/                  SK14  Code refactoring
  security-review/                   SK15  Security review
  testing-strategy/                  SK16  Testing strategy
  rag-agent-design/                  SK17  RAG agent design
  health-planning/                   SK18  Health planning
workflows/
  backend-safe-change.yaml
  feature-spec-to-build.yaml
  full-harness-orchestration.yaml
  harness-generation.yaml
  product-to-implementation.yaml
  project-documentation.yaml
  rag-feature-sequential.yaml
  team-cowork-worktree.yaml
templates/project/                   Bootstrap scaffold for runtime access
.engineering-harness/installation.json  Installation manifest with checksums
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
| Harness-managed global agents | 17 | 5 process/generation agents + 12 Barsa-backed domain specialists |
| Global skills | 31 | 13 engineering workflow/generation skills + 18 Barsa-backed domain skills |
| Global commands | 10 | Prefixed `eng-` |
| Global workflows | 8 | Sequential/cowork workflow definitions |
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
workflows/
```

Excluded from the package:

- `references/`
- `evals/`
- `scripts/`
- `docs/`
- `releases/`
- `.opencode/task-plans/`
- Task Plans
- Design proposals
- Environment files
- Secrets

## Versioning Model

Package version follows semantic versioning at release time:
- Current released package version is `0.1.0`
- `CHANGELOG.md` records released package versions only
- HARNESS task IDs track implementation scope and sequence; they do not imply automatic package version bumps
- Future major, minor, and patch bumps are decided explicitly during approved release work
- Packaging infrastructure is external to this package and not versioned here

## Task Plan Inventory

Task Plans are execution ledgers stored in `.opencode/task-plans/`:
- HARNESS-001 through HARNESS-018 are implemented and operative
- HARNESS-019 governs documentation and versioning organization work
- New HARNESS IDs must remain unique; legacy duplicate IDs must be reconciled in separate approved cleanup work

---

## Distribution Strategy

1. **Current**: `npm pack` from the source repository, transfer tarball via SCP/rsync/USB to target machine.
2. **Client install flow**: Transfer tarball, review with `plan`, then `install` and `check`.
3. **Default (homelab)**: SSH-only versioned tarball built from approved source and stored under the homelab user data directory; client downloads via SCP over port 22.
4. **Later**: private Verdaccio registry (not yet required).

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
