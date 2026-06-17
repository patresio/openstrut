# Task Plan: HARNESS-007 — Project Bootstrap Templates and Integration

**Task ID:** HARNESS-007  
**Classification:** workflow  
**Status:** IN PROGRESS  

## Approved Objective and Exclusions
- **Objective:** Create a minimal, evidence-driven project bootstrap foundation for `engineering-project-bootstrap`, `/eng-init-project`, and `/eng-refresh-project-rules`.
- **Exclusions:** Do not copy templates blindly. Do not modify global `AGENTS.md`, `opencode.json`, other skills/commands, package metadata, installer/CLI code, live OpenCode configuration, or external projects. Do not start HARNESS-008.

## Current Design Documents Consulted
- `GEMINI.md`, `CONTRIBUTING.md`, `docs/ARCHITECTURE.md`, `docs/design/001-harness-architecture.md`, `docs/design/002-project-bootstrap-and-distribution.md`.
- `global/skills/engineering-project-bootstrap/SKILL.md`
- `global/commands/eng-init-project.md`, `global/commands/eng-refresh-project-rules.md`
- Books: *The Pragmatic Programmer*, *Clean Architecture*, etc. (conventions for repository bounds, single source of truth).
- `references/padroes-de-commits/`: `README.md`, `conventional-commits.md`, `commit-msg.sh`, `prepare-commit-msg.sh`, `push.sh`. Note that references are authoring material and are not shipped as runtime artifacts in the installed harness.

## Approved Template Inventory
- `templates/project/AGENTS.md`: Minimal project-local structure.
- `templates/project/.opencode/task-plans/README.md`: Directory explanation for local Task Plans.
- **Decision on `CONTRIBUTING.md`**: Omitted. While design doc 002 mentions "Proposed CONTRIBUTING.md changes", it is ambiguous on requiring it as a *bootstrap template file* to be shipped. It will not be created to prevent redundant or mandating contribution mechanics without project evidence.

## Project-local versus Global Responsibility Matrix
- **Global:** Approval Gate, TDD First, security, core command routing, agent definitions.
- **Project-local:** Domain language, authoritative test/build commands, specific environments, Git branching strategy, project-specific Definition of Done.

## Bootstrap Flow
`Repository inspection -> project-rules-auditor -> evidence validation -> local-rule proposal -> Approval Gate -> Task Plan -> create or update approved project files -> diff review`

## Template Section Matrix (AGENTS.md)
Project Scope, Sources of Truth, Architecture and Boundaries, Domain Language, Supported Environments, Authoritative Commands, Testing and Quality, Git and Delivery (with explicit evidence-based commit discovery instructions), Security and Data Handling, Project-Specific Exceptions, Unresolved Questions.

## Rules for Existing vs Missing Project Files
- **No project AGENTS.md:** Audit, propose, stop at Approval Gate, create file after approval and Task Plan creation.
- **Existing project AGENTS.md:** Preserve as baseline, propose focused updates, do not replace wholesale.
- **Nested AGENTS.md files:** Inspect scope, preserve specialization, do not blindly merge.
- **Insufficient Evidence:** Stop with facts, request human decision. Do not hallucinate commands.

## Evidence Requirements
- Source path for authoritative commands, architecture rules, security, delivery.
- Commit convention source path, prioritizing formal configuration (commitlint, CI, CONTRIBUTING.md) over simple history.
- Explicit classification of commit conventions as verified, inconsistent, absent, or proposed.
- Explicit identification of unresolved items.
- Final diff showing project-local changes.

## Expected Files
- `templates/project/AGENTS.md`
- `templates/project/.opencode/task-plans/README.md`
- `global/skills/engineering-project-bootstrap/SKILL.md` (modified)
- `global/commands/eng-init-project.md` (modified)
- `global/commands/eng-refresh-project-rules.md` (modified)

## Validation Checklist
- Static validation script to verify templates and modified behaviors: **PASSED**.
- Confirm exactly HARNESS-007 files changed via Git diff: **CONFIRMED**.
- Verify NPM packaging includes templates but excludes references: **CONFIRMED** (`templates/project/AGENTS.md` and `templates/project/.opencode/task-plans/README.md` are packed; `references/` is excluded).

## Deviations and Blockers
- None. `CONTRIBUTING.md` omitted as per explicit conditional logic.
- Decision: Do not impose a global commit convention.
- Decision: Adopted a commit-convention discovery order (config > documentation > history).

## Current State
- All templates and integrations complete and validated with commit convention logic. Ready for delivery.

## Next Action
- Deliver HARNESS-007 (commit and push) upon explicit human approval.
