# HARNESS-011 — Change Execution Manifest

**Objective:** Transformar uma change OpenSpec aprovada em um manifesto determinístico de execução, sem executar nenhuma task.

**Classification:** architecture, execution-manifest

## Scope

- Validate approved OpenSpec change structure.
- Validate explicit canonical approval via frontmatter (`change_id`, `status: approved`, `approved_by`, `approved_at`) in `proposal.md`.
- Parse explicit task contract from `tasks.md`: IDs (`^T[0-9]{3,}$`), agents, skills, dependencies, parallel groups.
- Validate deterministic task rules: reject missing fields, duplicate IDs, unknown agents/skills, cyclic/self/unknown dependencies, conflicting parallel groups.
- Canonicalize task order (dependency graph then ID) and fields (alphabetical skills, normalized nulls).
- Generate `openspec/changes/<change>/execution-manifest.yaml` deterministically (byte-for-byte identical for same change inputs).
- Stop at the `WAITING_FOR_EXECUTION_APPROVAL` gate. No agents initiated.

## Exclusions

- Do not initiate agents, create worktrees, or create branches.
- Do not execute project tests, project build, or modify project code during manifest generation.
- Do not call an orchestrator or generate manifest content via non-deterministic LLM output.
- Do not create tasks in SimpleCheckList, query/write Memory MCP, Filesystem MCP, or GitHub MCP.
- Do not define an MCP Capability Policy or reference classifications.
- Do not homologate, create PRs, merge, or deploy.
- Do not infer dependencies, select agents semantically, or suggest parallelism automatically.

## Blocking Error Codes

All of the following must be detectable and cause generation to halt:

```text
BLOCKED — TASK ID REQUIRED
BLOCKED — DUPLICATE TASK ID
BLOCKED — INVALID TASK ID
BLOCKED — TASK AGENT REQUIRED
BLOCKED — UNKNOWN AGENT
BLOCKED — TASK SKILLS DECLARATION REQUIRED
BLOCKED — UNKNOWN SKILL
BLOCKED — DEPENDENCY DECLARATION REQUIRED
BLOCKED — UNKNOWN TASK DEPENDENCY
BLOCKED — CYCLIC DEPENDENCY
BLOCKED — SELF DEPENDENCY
BLOCKED — PARALLEL GROUP DECLARATION REQUIRED
BLOCKED — INVALID PARALLEL GROUP
BLOCKED — CHANGE APPROVAL METADATA REQUIRED
BLOCKED — CHANGE NOT APPROVED
BLOCKED — INVALID APPROVAL METADATA
BLOCKED — PROPOSAL REQUIRED
BLOCKED — TASKS REQUIRED
BLOCKED — SPEC REQUIRED
BLOCKED — CHANGE ID PATH MISMATCH
```

## Audit Note

Implementation started before explicit final design approval. The two pending decisions were resolved automatically using recommended defaults:
- **Agent inventory v1:** Fixed versioned allowlist containing supported native (`build`) and harness-managed agents (`code-reviewer`, `project-rules-auditor`).
- **CLI v1:** `generate-manifest --change <path>` subcommand in the existing CLI.

## Required Harness Tests (during implementation)

- Structural tests
- Parsing tests (valid and invalid fixtures for all blocking errors)
- Determinism tests (byte-for-byte comparison)
- Installer tests

## Current State

Current state: HARNESS-011 final pre-commit hardening complete. All identified risks regarding portable scalar serialization (`yamlScalar`), blocking duplicate fields, exact spec folder structure (`specs/<capability>/spec.md`), and cross-platform paths (`import.meta.url`) have been addressed and validated. 201 tests passing in CI.

## Next Action

Next action: WAITING FOR HARNESS-011 FINAL APPROVAL FOR COMMIT.
