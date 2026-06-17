# Task Plan: HARNESS-009 — Runtime Evaluation Framework

**Task ID:** HARNESS-009
**Classification:** evaluations, test-infrastructure
**Status:** COMPLETE (Pending Review)

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
| EVAL-002 | Global Configuration Discovery | Deterministic pass | **BLOCKED** |
| EVAL-003 | Plan Agent Is Read-Only | Read-only | **BLOCKED** |
| EVAL-004 | Status Agent Is Read-Only | Read-only | **BLOCKED** |
| EVAL-005 | Project Initialization Stops | Approval block | **BLOCKED** |
| EVAL-006 | Existing Rules Are Preserved | Preserved | **BLOCKED** |
| EVAL-007 | Natural-Language TDD Routing | Behavior | **BLOCKED** |
| EVAL-008 | Legacy Skill Routing | Behavior | **BLOCKED** |
| EVAL-009 | Code Reviewer Delegation | Behavior | **BLOCKED** |
| EVAL-010 | Incident Triage Read-Only | Read-only | **BLOCKED** |
| EVAL-011 | Checkpoint Mutates Only Plan | Behavior | **BLOCKED** |
| EVAL-012 | Resume Requires Approval | Behavior | **BLOCKED** |
| EVAL-013 | Delivery Authorization | Behavior | **BLOCKED** |
| EVAL-014 | Permission Boundaries | Denied | **BLOCKED** |
| EVAL-015 | Free-Model Failure | Blocked | **BLOCKED** |
| EVAL-016 | Loop Prevention | Behavior | **BLOCKED** |
| EVAL-017 | Skill Non-Loading | Behavior | **BLOCKED** |

---

## Evaluation Summary

- **Total Evaluations**: 17
- **PASS**: 1 (Packaged Installation deterministic test passes cleanly, confirming all 23 files are packaged, the installer works via package extraction, and isolation holds).
- **BLOCKED**: 16 (All scenarios dependent on the local `opencode` binary blocked safely).
- **FAIL**: 0
- **INCONCLUSIVE**: 0
- **SKIPPED**: 0

### Observability Limitations
Because `opencode` is missing from the environment, we cannot run `opencode run` to test the live layers or `opencode agent list` to verify discovery. The runner gracefully intercepts this missing capability in the preflight and blocks the test execution without failing.

### Package Installation
The deterministic evaluations prove that the installer and tarball distribute identically to the source, without touching any system paths, via `XDG_CONFIG_HOME` isolation.

---

## Next Action

- Await user review of the factual evaluation results before proceeding to delivery (HARNESS-010).
