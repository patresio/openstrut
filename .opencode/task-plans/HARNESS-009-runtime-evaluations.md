# Task Plan: HARNESS-009 — Runtime Evaluation Framework

**Task ID:** HARNESS-009
**Classification:** evaluations, test-infrastructure
**Status:** COMPLETED — PARTIALLY VERIFIED

---

## Approved Objective and Exclusions

**Objective:**
1. Create deterministic static and sandboxed runtime evaluations for the harness.
2. Install the packaged harness into an isolated temporary OpenCode configuration.
3. Exercise real agents, skills, subagents, and commands through documented OpenCode interfaces.
4. Produce factual evidence showing what works, what fails, and what cannot yet be observed reliably.

**Exclusions:**
- Do not repair production harness artifacts during the evaluation.
- Do not implement technical debate.
- Do not implement RAG or MCP.
- Do not publish the npm package.
- Do not touch the user's live OpenCode configuration.
- Do not use real project repositories.

---

## Technical Context

- **OpenCode version**: `NOT FOUND` (Command line `opencode` is unavailable on the execution environment).
- **Documented runtime interfaces**: `opencode run`, headless execution via `--format json`, non-interactive flags (`--command`, `--agent`, `--model`).
- **Temporary directories**: Evaluations use temporary `XDG_CONFIG_HOME` and isolated Git repositories.

## Evaluation Architecture

- **Layer A**: Deterministic Evaluations (`npm run eval:deterministic`). Evaluates package artifact integrity, installer behavior, configuration discovery semantics.
- **Layer B**: Live OpenCode Behavioral Evaluations (`npm run eval:runtime`). Executes synthetic fixture projects and observes real `opencode` behavior under the isolated config.
- **Runner**: Node.js script located at `evals/runner/run.js`.

### Result Semantics
- **PASS**: All required observable evidence exists and matches expected behavior.
- **FAIL**: Harness or OpenCode demonstrably behaved contrary to expected contract.
- **BLOCKED**: External dependency failed (e.g., OpenCode unavailable).
- **INCONCLUSIVE**: Operation may have behaved correctly, but available evidence cannot prove it.
- **SKIPPED**: Intentionally excluded.

### Generated Artifact Locations
- Summaries: `evals/reports/latest-summary.json`

### Validation Commands
- `npm run eval:deterministic`
- `npm run eval:runtime`
- `npm run eval:all`

---

## Scenario Matrix Results

| ID | Purpose | Expected Result | Actual Result |
|---|---|---|---|
| EVAL-001 | Packaged Installation | Deterministic pass | **PASS** |
| EVAL-002 | Global Configuration Discovery | Deterministic pass | **PASS** |
| EVAL-003 | Plan Agent Is Read-Only | Read-only | **PASS** |
| EVAL-004 | Status Agent Is Read-Only | Read-only | **INCONCLUSIVE** |
| EVAL-005 | Project Initialization Stops | Approval block | **INCONCLUSIVE** |
| EVAL-006 | Existing Rules Are Preserved | Preserved | **SKIPPED** |
| EVAL-007 | Natural-Language TDD Routing | Behavior | **SKIPPED** |
| EVAL-008 | Legacy Skill Routing | Behavior | **SKIPPED** |
| EVAL-009 | Code Reviewer Delegation | Behavior | **SKIPPED** |
| EVAL-010 | Incident Triage Read-Only | Read-only | **SKIPPED** |
| EVAL-011 | Checkpoint Mutates Only Plan | Behavior | **SKIPPED** |
| EVAL-012 | Resume Requires Approval | Behavior | **SKIPPED** |
| EVAL-013 | Delivery Authorization | Behavior | **SKIPPED** |
| EVAL-014 | Permission Boundaries | Denied | **SKIPPED** |
| EVAL-015 | Free-Model Failure | Blocked | **SKIPPED** |
| EVAL-016 | Loop Prevention | Behavior | **SKIPPED** |
| EVAL-017 | Skill Non-Loading | Behavior | **SKIPPED** |

---

## Evaluation Summary

- **Total Evaluations**: 17
- **PASS**: 3 (EVAL-001, EVAL-002, EVAL-003)
- **BLOCKED**: 0
- **FAIL**: 0
- **INCONCLUSIVE**: 2 (EVAL-004, EVAL-005)
- **SKIPPED**: 12 (Not implemented in this slice).

### Observability Limitations
- Agent and model identity are completely unobservable from `--format json` in OpenCode 1.17.8.
- Skill invocations and subagent delegations in `/eng-init-project` were unobservable in the JSON event stream (returning INCONCLUSIVE).
- The OpenCode `bash` auto-reject logic causes the model to enter non-deterministic retry loops. This was observed correctly rejecting mutation, but occasionally triggering the adapter's 90s subprocess timeout.

### Adapter Corrections
- `run` argument normalization was updated to safely inject `--format json` exactly once.
- Subprocess stdin was explicitly closed (`ignore`) to prevent open-pipe hangs.
- `XDG_DATA_HOME` environment overrides were removed to prevent breaking credential discovery paths.

### Package Installation
The deterministic evaluations prove that the installer and tarball distribute identically to the source, without touching any system paths, via `XDG_CONFIG_HOME` isolation.

---

## Current State

Current state: HARNESS-009 is partially verified. Runtime execution, isolated configuration, provider access, adapter behavior, and filesystem safety were validated. Agent/model identity and explicit skill/subagent routing remain inconclusive because of current OpenCode runtime and permission observability limits.

## Next Action

Next action: none. Carry forward runtime observability limitations only when a future approved increment needs deeper agent or skill routing evidence.
