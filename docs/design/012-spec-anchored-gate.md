# 012 - Spec-Anchored Audit Gate

## Context

The SDD flow (005, ADR-003) produced trustworthy *specifications* but not trustworthy *implementations*. The `sdd` agent drafts OpenSpec changes, a human approves at the Approval Gate, and `build` implements from `tasks.md` — yet nothing mechanically proves the code satisfies the spec. The only audit was `project-rules-auditor`, an LLM review of the *draft*; after approval, compliance rested on agent obedience.

Spec-first tools generate code from the spec; the code evolves and the spec becomes a lie. This design adopts the **spec-anchored** pattern (adapted from onp-spec-driven, MIT © Vitor Manoel): the spec stays true because it is audited mechanically against the code, continuously, via exit code. We do not trust that the agent obeyed — the machine proves it.

## Decision

Add a mechanical audit command to the harness CLI: `openstrut audit`, exposed as the `ot-audit` command in the multi-platform plugin system (011).

**Inputs**
- `openspec/changes/<slug>/specs/<capability>/spec.md` — US-xxx stories, AC-xxx criteria (Given/When/Then), ASM-xxx assumptions, Q-xxx open questions.
- `openspec/changes/<slug>/tasks.md` — T-xxx tasks with `Refs:` and `[status]`, parsed with the new `src/audit/parse.js` (same conventions as `src/manifest/parse.js`: explicit fields, no semantic inference, deterministic output).
- Test files scanned for `@spec:AC-xxx` annotations in test titles (framework-agnostic).

**Behavior**
- Reports findings: AC without test (`AC_SEM_TESTE`), orphan test (`TESTE_ORFAO`), task completed without proof (`TASK_CONCLUIDA_SEM_PROVA`), broken refs (`REF_QUEBRADA`), invalid task status (`TASK_STATUS_INVALIDO`). Structural checks (missing sections, open assumptions/questions) are planned follow-ups, not yet emitted.
- Gates via exit code: `0` = aligned, `1` = findings. Usable in CI and as the last step of the Ship phase (WORKFLOW.md).
- The traceability chain US→AC→T→test is explicit and machine-checked.

**Consequences**
- Specs stop being decorative; drift is detected mechanically.
- Features cannot ship without proof; CI enforces alignment.
- Authors pay a small annotation cost (`@spec:AC-xxx`) for machine-checkable DoD.
- Requires parser extensions for spec.md (US/AC/ASM/Q) and a test-scan adapter; reuses parse.js conventions.

## Traceability Model

| Link | Source | Target | Broken meaning |
|---|---|---|---|
| US-xxx → AC-xxx | spec.md | AC under story | story without criteria (US_SEM_AC) |
| AC-xxx → T-xxx | tasks.md `Refs:` | task covering AC | AC without task (AC_SEM_TASK) |
| T-xxx → proof | tasks.md status + test result | PASS | task [concluida] without proof (TASK_CONCLUIDA_SEM_PROVA) |
| test → AC-xxx | `@spec:AC-xxx` title | AC in spec | AC without test (AC_SEM_TESTE) |
| test → AC-xxx (drift) | `@spec:AC-xxx` title | missing AC | orphan test (TESTE_ORFAO) |
| T-xxx → US/AC | tasks.md `Refs:` | any spec (IDs global) | broken ref (REF_QUEBRADA) |

Each broken link is a finding with a stable code (adapted from the onp-spec catalog): `AC_SEM_TESTE`, `TESTE_ORFAO`, `TASK_CONCLUIDA_SEM_PROVA`, `REF_QUEBRADA`, plus `TASK_STATUS_INVALIDO`. `ASM_ABERTA`, `Q_ABERTA`, `SECAO_AUSENTE` are planned follow-up codes (v1.1), not yet emitted. Codes are stable for CI and for future lesson signals.

## Executable DoD

- Every AC must have at least one annotated test; the test runner decides PASS, never the agent.
- Skip/todo is not proof — the audit refuses it.
- The audit is the last step of every feature: run `openstrut audit`, paste the output; exit 0 is the only "done".

## Assumptions and Open Questions

- `## Suposições` (ASM-xxx) and `## Perguntas em aberto` (Q-xxx) are mandatory sections with honest status (`aberta|confirmada|invalidada`; `aberta|respondida`).
- A missing section is a planned finding (`SECAO_AUSENTE`, v1.1); until the engine emits it, require the sections to exist and write "Nenhuma." when none apply.
- A feature cannot reach "done" with an open assumption.

## Verifiable Constitution (optional scope)

- P-xxx principles with levels [DEVE]/[RECOMENDADO]/[PODE]; each [DEVE] carries executable verification (test tag or forbidden-pattern regex+glob).
- A violated [DEVE] breaks the audit; fix the code, never the principle.
- Marked optional for v1 of the harness gate; requires its own design increment.

## Lessons with Provenance

- A lesson is only accepted if backed by a real audit/verify signal from history; otherwise the engine refuses it (`LICAO_SEM_LASTRO`).
- For the harness this is a follow-up candidate, not v1: the audit must first accumulate signal history.

## Cost Control in the Engineering Loop

- `ot-goal` must confirm model and effort per task with the user before executing (onp-spec pattern: per-task `Modelo:`/`Esforço:`, plan prints models, agent asks before running).
- The loop stays cost-transparent: no headless execution without an explicit user choice.

## Comparison with 005 and ADR-003

| Aspect | 005 / ADR-003 | This design |
|---|---|---|
| Audit | LLM review of spec draft (`project-rules-auditor`) | Mechanical audit of implementation vs spec (exit code) |
| Trust model | Agent obeys the spec | Machine proves alignment |
| DoD | Approval + task plan | Executable DoD: every AC has an annotated PASS test |
| Manifest | Execution contract (structure, approval, tasks) | Retained; audit adds the verification contract after execution |
| Gate | Approval Gate before Apply | Audit gate before Ship, plus CI |

**Superseded:** reliance on agent obedience; LLM-only compliance as the gate.
**Retained:** OpenSpec change structure, approval frontmatter, deterministic parsing (parse.js), TDD-first, task plans, branch-per-task (ADR-005), sdd/build separation.

## Attribution

Pattern adapted from onp-spec-driven (skill v3.6.0), MIT © Vitor Manoel — O Novo Programador. This design synthesizes the pattern; no raw chunks are copied. Attribution registered here per retrieval policy.

## Alternatives

- **LLM-judged compliance** — rejected: non-deterministic, no exit code, cannot gate CI.
- **Spec-first generation** — rejected: spec drifts once code evolves; no drift detection.
- **No gate** — rejected: no proof; returns to trusting the agent.

Sources: CTX01, CTX03, CTX14, CTX17, CTX23 · B01, B08, B11 · SK01, SK08, SK09, SK16 · DOC_OPENCODE_AGENTS, DOC_OPENCODE_CONFIG