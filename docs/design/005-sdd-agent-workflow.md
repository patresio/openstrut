# 005 - SDD Agent Workflow and Build Handoff

## Context
Specification-Driven Development (SDD) is the canonical approach to introducing changes in the OpenCode Engineering Harness. Before any production code is mutated, a verifiable specification must exist. The `sdd` agent is introduced to formalize this process, separating the act of specifying from the act of implementing (`build`).

## Responsibilities

### `sdd` Agent Responsibilities
- Transform informal requests into formal OpenSpec proposals and specifications.
- Discover and read project architecture, conventions, domain language, and reference books.
- Search for reference books in `<project-root>/reference/`, `<project-root>/references/`, and the shared library `$HOME/.local/share/opencode-engineering-harness/references/`.
- Enforce Ubiquitous Language and define bounded contexts for the change.
- Create verifiable criteria (Given/When/Then examples) and define the test strategy.
- Decompose the implementation into TDD-friendly microincrements (`tasks.md`).
- Call the `project-rules-auditor` to validate the draft.
- Halt at the Approval Gate to await user review.

### `sdd` Agent Non-Responsibilities
- Cannot write or edit production code, tests, or scripts.
- Cannot mutate Git state (no commits, pushes, PRs).
- Cannot run build or deployment tools.
- Cannot call mutative agents (`build`, `code-reviewer`).

### `build` Agent Responsibilities (Handoff)
- Read the approved OpenSpec documents (`proposal.md`, `specs/*/spec.md`, `tasks.md`, `design.md`).
- Create an operational `.opencode/task-plans/<task-id>.md` from the `tasks.md` specification.
- Execute the microincrements via TDD-First.
- Commit, review, and deliver the final changes.

## State Machine
1. User requests change -> `/eng-spec-change` command invoked.
2. The command delegates exactly to the `sdd` agent and preserves the user's `$ARGUMENTS`.
3. The `sdd` agent is instructed to load and execute the `engineering-sdd-change` skill.
4. `sdd` explores, drafts OpenSpec, and decomposes tasks.
5. `sdd` requests audit from `project-rules-auditor`.
6. `sdd` applies audit findings.
7. **Approval Gate**: `sdd` halts and requests user approval.
8. User reviews the change and approves.
9. **Handoff**: User invokes `build` agent, pointing it to the approved change slug.
10. `build` creates the operational Task Plan and implements the change incrementally.

## Artifacts
- **Primary output**: `openspec/changes/<change-slug>/`
  - `proposal.md`
  - `tasks.md`
  - `specs/<capability>/spec.md`
  - `design.md` (only if necessary)

## Permissions
The `sdd` agent is restricted via OpenCode permissions using a last-match-wins explicit allow-list strategy:
- `edit`: default deny (`*`: deny) first, then explicitly allowed only in `openspec/changes/**`, `specs/**`, `docs/**`, `.opencode/task-plans/**`. Production source code paths implicitly remain denied.
- `bash`: default deny (`*`: deny) first, then allowed only for safe non-mutating inspection (`pwd`, `ls *`, `find *`, `git status*`, `git diff*`, `git log*`, `grep *`, `rg *`). Mutating git commands are implicitly denied.
- `external_directory`: default ask (`*`: ask), then explicitly allowed to read the shared reference library at `~/.local/share/opencode-engineering-harness/references/**`.
- `skill`: allowed only `engineering-sdd-change`.
- `task`: allowed `explore`, `project-rules-auditor`, `scout`. Denied mutative agents.

## Portability
- PDFs and private books remain outside the distributed package. They must be placed in the project directory or the shared reference library by the user.
- No absolute server-specific paths (e.g., `/srv/...`) are packaged.

## Audit and Approval
The SDD flow mandates an automated audit using `project-rules-auditor` to ensure the generated specification complies with global and project-local instructions. The flow is hard-stopped at the Approval Gate, which prevents premature implementation or runaway agent loops.

## Errors and Blockers
- If `sdd` cannot find sufficient context or domain knowledge, it must stop and ask the user for clarification before generating the spec.
- If `project-rules-auditor` identifies material conflicts that `sdd` cannot resolve, the `sdd` agent must halt and present the conflict to the user at the Approval Gate.
- The `build` agent will fail the handoff if the specification lacks verifiable examples or a decomposed `tasks.md`.
