---
name: opentrust-spec-anchored
description: Spec-anchored development — the spec stays true because the machine audits it via exit code, not because the agent promised. Use when specifying a feature, auditing an implementation against a spec, checking "what has no test", verifying before calling it done, or running the mechanical gate. Triggers: "especificar feature", "auditar spec", "o que não tem teste", "verificar", "está pronto?", "run the gate". Not for technical design docs.
metadata:
  author: OpenTrust
  version: 1.0.0
  agent: opencode
---

# opentrust-spec-anchored — the specification that stays true

Most SDD tooling is **spec-first**: the spec generates code, the code evolves,
and the spec becomes a lie. This skill is **spec-anchored**: the spec is audited
mechanically against the code, continuously. You do not trust that the agent
obeyed — **the machine proves it via exit code**.

> Platform note: this is the OpenCode variant (`metadata.agent: opencode`).
> Cursor/Antigravity variants follow the same pattern with a different
> `agent:` marker in the frontmatter, per the onp-spec multi-platform pattern
> (see design 012).

## 1. Purpose

Make "done" machine-checkable. Every acceptance criterion (AC-xxx) must have an
annotated test (`@spec:AC-xxx`); every task claims status honestly; the audit
gate compares spec → tasks → tests and refuses drift. The machine is the
arbiter — never the agent's promise.

## 2. Workflow

Map the OpenStrut phases to the audit loop:

| Phase | Activity | OpenStrut |
|---|---|---|
| **Especificar** | Write `openspec/changes/<slug>/specs/<capability>/spec.md` with US-xxx stories + AC-xxx criteria, ASM-xxx assumptions, Q-xxx questions | Explore / Propose |
| **Tarefas** | Write `openspec/changes/<slug>/tasks.md` — T-xxx with `Refs:` and `[status]` | Propose |
| **Executar** | Implement; every AC gets an annotated `@spec:AC-xxx` test; mark `[concluida]` only with passing proof | Apply |
| **Auditar** | Run the mechanical gate as the LAST step | Review (gate before Ship) |

Small scope (≤3 files): keep the spec lean and go straight from Especificar to
Executar — Auditar is always mandatory. Large scope: slice into tasks.md, one
task = one atomic commit.

## 3. Traceability contract

The chain is US → AC → T → test, and each link is machine-checked:

| Link | Where | Documented in |
|---|---|---|
| US-xxx → AC-xxx | story heading, criteria under it | spec.md |
| AC-xxx → T-xxx | task `Refs:` lists the AC/US it covers | tasks.md |
| T-xxx → proof | task `[status]` + covered annotated test | tasks.md + tests |
| test → AC-xxx | `@spec:AC-xxx` annotation | test source (`tests/**/*.test.js`) |

### Finding catalog

The audit prints readable names and stable codes. Speak to the user in readable
terms; use codes for CI and gate decisions.

| Finding (code) | Meaning | What to do |
|---|---|---|
| acceptance criterion without test (AC_SEM_TESTE) | requirement has no proof | write the test annotated `@spec:AC-xxx` |
| orphan test (TESTE_ORFAO) | test points to a criterion that vanished (drift) | the spec changed — update or remove the test |
| task completed without proof (TASK_CONCLUIDA_SEM_PROVA) | task `[concluida]` has no covered criterion | verify it or reopen the task |
| broken reference (REF_QUEBRADA) | task cites a nonexistent US/AC | fix the `Refs:` entry |
| invalid task status (TASK_STATUS_INVALIDO) | unknown status token | use `[pendente]`, `[em-andamento]`, `[concluida]` |

## 4. Executable DoD

1. Every AC-xxx must have at least one annotated test; the test runner decides
   PASS, never the agent.
2. Skip/todo tests are not proof — the audit accepts only annotated tests.
3. Run the gate as the LAST step of the feature (see §7 for the command).
4. **Exit 0 = aligned** — every criterion has an annotated test, no orphan
   tests, completed tasks are proven. **Exit 1 = DRIFT** — read each finding
   and fix it, then re-audit.
5. Never weaken, skip, or delete a test to make the gate pass; fix the spec,
   the task refs, or the code instead.
6. Limit: max 3 audit iterations on the same problem — then stop and escalate
   to the user with the findings ranked.

## 5. Assumptions and open questions

`## Suposições` / `## Assumptions` (ASM-xxx) and
`## Perguntas em aberto` / `## Open questions` (Q-xxx) are first-class sections
of the spec, with honest status (`aberta|confirmada|invalidada` for ASM;
`aberta|respondida` for Q).

- Missing sections are a finding (`SECAO_AUSENTE`); if none exist, write
  "Nenhuma." and be suspicious.
- Open assumptions are planned findings (`ASM_ABERTA`, `Q_ABERTA`) per design
  012; until the engine emits them, the review gate enforces that a feature
  does not reach "done" with an open assumption.
- User present with a question? Ask now, record the answer with status
  `respondida`/`confirmada`. Do not decide product questions silently.

## 6. Cost control

Executing tasks (especially via `ot-goal`) spends model quota. Before mutating:

- Confirm model and effort with the user — per task when the plan defines it.
- No headless execution without an explicit user choice; the loop stays
  cost-transparent.
- Prefer the cheapest sufficient model for mechanical steps (parse, annotate,
  run the gate) and reserve stronger models for design decisions.

## 7. The mechanical command

Run from the project root:

```
openstrut audit --change openspec/changes/<slug>
```

Without an installed binary, point at the harness repo:

```
node <path-to-harness>/bin/openstrut.js audit --change <dir>
```

The `/ot-audit` OpenCode command wraps this and translates findings. Exit codes:
`0` aligned, `1` findings (one `[CODE] message` per finding), `2` non-canonical
change path, `3` invalid usage. Paste the raw output and translate what it means
in one or two sentences — the output is the proof.

## Golden rule

If you are about to say "done", run `openstrut audit --change <dir>` and paste
the output. If it did not exit 0, it is not done. Here, "done" is something the
machine verifies — not a phrase you say.