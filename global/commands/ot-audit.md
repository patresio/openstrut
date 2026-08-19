---
description: Mechanical spec-anchored audit gate — traceability US→AC→T→test with exit-code verdict
agent: quality-lead
---

# Audit Command

**Purpose:** Run the mechanical spec-anchored audit gate for an OpenSpec change. The machine proves the implementation satisfies the specification via exit code — you do not trust the agent, you check the proof.

## Instructions

1. Resolve the OpenSpec change directory for the current work (e.g. `openspec/changes/<slug>`).
2. Run the audit gate:
   - `openstrut audit --change <change-dir>`
   - or without an installed binary: `node bin/openstrut.js audit --change <change-dir>`
3. Translate each finding for the user (readable name first, stable code in parentheses):
   - criterion of acceptance without test (AC_SEM_TESTE) — requirement has no proof
   - orphan test (TESTE_ORFAO) — test points to a criterion that vanished (drift)
   - task completed without proof (TASK_CONCLUIDA_SEM_PROVA) — task `[concluida]` has no covered criterion
   - broken reference (REF_QUEBRADA) — task cites a nonexistent US/AC
   - invalid task status (TASK_STATUS_INVALIDO) — use `[pendente]`, `[em-andamento]`, `[concluida]`
4. **ENFORCE the gate** — do not mark work done until the audit exits 0. Exit 0 is the only "done".
5. Skip/todo tests are not proof — the audit only accepts annotated, passing tests.
6. Never weaken or delete a test to make the audit pass; fix the spec, the task refs, or the code.
7. Paste the raw audit output and translate what it means in one or two sentences.

## Input Format

```
openstrut audit --change openspec/changes/<slug>
```

## Workflow Step

Gate before Ship: mechanical traceability proof (US→AC→T→test).

## Expected Output

- Exit 0 (OK): aligned — every criterion has an annotated test, no orphan tests, completed tasks are proven.
- Exit 1 (DRIFT): one `[CODE] message` per finding; resolve each finding and re-audit (max 3 iterations, then stop and escalate).
- Exit 2 (CONFLICT): the change path is not canonical (`<git-root>/openspec/changes/<slug>`).