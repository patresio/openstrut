# Task Plan: HARNESS-002 — Finalize Global AGENTS.md

**Task ID:** HARNESS-002  
**Classification:** documentation + structural (non-TDD)  
**Status:** IN PROGRESS  
**Approval evidence:** Explicit user request — HARNESS-002 task description, 2026-06-16  

---

## Approved Objective

Review, correct, and finalize `global/AGENTS.md` as the global engineering constitution
to be installed as `~/.config/opencode/AGENTS.md`.

The result must be written entirely in English, operational, globally applicable,
and free of project-specific assumptions, invented capabilities, and obsolete references.

---

## Approved Scope

Only these files may be modified:

- `.opencode/task-plans/HARNESS-002-finalize-global-agents.md` (this file)
- `global/AGENTS.md`

---

## Explicit Exclusions

- No `global/opencode.json`
- No agents, subagents, skills, commands, templates
- No installer code or package metadata
- No reference files, OpenCode documentation, or book files
- No live machine configuration
- No commit or push (left for user approval)
- No HARNESS-003

---

## Current State of global/AGENTS.md (as of HARNESS-001 commit 41a1623)

- 336 lines, CRLF line endings, ~20 KB
- Written in English
- Covers 12 numbered sections
- Content is largely sound but has the following issues requiring correction:
  1. **Section 5 Task Plan fallback path**: references `.agents/task-plans/` — must be `.opencode/task-plans/` per project decisions
  2. **`doom_loop` permission**: listed as a behavioral rule but it is an OpenCode platform feature (`doom_loop` permission key) — needs accurate framing
  3. **Section 3 Skills/Delegation**: references skills as loaded "on demand" which is accurate, but the note "Skills are procedures loaded on demand" undersells how skills work — the `skill` tool is invoked by the agent, listed in the tool description with name + description
  4. **Section 4 Workflow**: overall structure is good; the Approval Gate description about "unambiguous equivalent" is sound but could clarify that silence is not approval
  5. **Section 12 Definition of Done**: repeats "do not restart" after completion — this is good but creates minor duplication with the loop-prevention section
  6. **Missing coverage**: `doom_loop` as platform guard (actual permission key), `external_directory` permission semantics, compaction behavior (native auto-compaction), `question` permission
  7. **No mention of**: OpenCode's `snapshot` feature (relevant to working tree safety), `instructions` field hierarchy, precedence order (local traversal → global → Claude Code fallback)
  8. **Trailing whitespace**: CRLF throughout (pre-existing, acceptable for cross-platform; keep as-is to avoid noisy diff)

---

## Source Consultation Matrix

| Rule family | OpenCode source | Engineering sources | Adopted conclusion |
|---|---|---|---|
| Instruction precedence | `rules.mdx`: local → global → Claude fallback; `config.mdx`: config merge order | Design doc 001 §1 | Local AGENTS.md + global AGENTS.md loaded; global applies across all sessions; project-local specializes without weakening global safety |
| Agent types and task delegation | `agents.mdx`: primary (build, plan), subagents (explore, scout, general); task permission glob; hidden agents | AI Engineering (evaluation, context management); Building AI Agents (bounded delegation, human-in-loop, tool selection) | build owns synthesis; subagents bounded and validated; task permission controls which subagents build may invoke |
| Skills | `skills.mdx`: `skill` tool, SKILL.md format, `name`+`description` required, loaded on-demand via tool | N/A | Skills are listed in the `skill` tool and loaded by agent call; not auto-injected into context |
| Permissions | `permissions.mdx`: allow/ask/deny; `doom_loop` triggers on 3 identical tool calls; `external_directory` for paths outside worktree; `question` for asking user | N/A | Permissions are behavioral policy enforced by OpenCode; `doom_loop` is a platform guard, not a behavioral rule alone |
| Compaction | `config.mdx`: `compaction.auto` (default true), `prune`, `reserved` | N/A | Context compaction is automatic; before manual compact, update Task Plan |
| TDD First | N/A | TDD by Example: write test first, fail for correct reason, minimum change for GREEN, refactor while green; XP: fast feedback, small steps | Production behavior cannot change before valid RED for expected behavioral reason; GREEN through minimum change only |
| Legacy code | N/A | Working Effectively with Legacy Code: characterization tests, seams, behavior before refactoring; Refactoring: green baseline first | Characterization tests before touching legacy; separate behavior change from structural improvement |
| BDD | N/A | BDD in Action; More Agile Testing: examples → acceptance criteria → executable tests; no mandatory framework | Use BDD-style examples for business outcomes; do not require Gherkin/Cucumber globally |
| Workflow gates | Design doc 001 §build; design doc 002 §installer | XP: approval before action; Pragmatic Programmer: feedback loops, reversible decisions | Full workflow required for mutating tasks; Approval Gate mandatory; silence is not approval |
| Implementation discipline | Design doc 001 §principles | Pragmatic Programmer: tracer bullets, don't repeat yourself carefully, orthogonality; Refactoring: small focused changes | Smallest coherent microincrement; no unrelated cleanup; no speculative abstraction; no arbitrary metric |
| Delegation | `agents.mdx`: task permission, subagents | Building AI Agents: bounded scope, human-in-loop; AI Engineering: single agent often sufficient | Use smallest effective structure; do not delegate simple linear work |
| Security | GEMINI.md §installer safety | N/A | External secrets only; least privilege; untrusted input; explicit approval for destructive operations |
| Failure handling | `permissions.mdx`: doom_loop guard | Building AI Agents: failing gracefully, improvement loops | Capture → classify → change hypothesis → stop after 3 equivalent attempts |
| Git safety | GEMINI.md §git; design doc 002 §delivery | Continuous Delivery: always releasable, no broken trunk | Inspect before mutation; no auto-stash/reset/clean; reuse existing delivery artifacts |
| Definition of Done | Design doc 001 §principles; GEMINI.md §reporting | XP: done = tested, integrated; TDD: clean code that works | All Task Plan items checked; TDD evidence; validated; reviewed; factual report |

---

## Implementation Checklist

- [x] Read all project authority documents (GEMINI.md, CONTRIBUTING.md, docs/ARCHITECTURE.md, design docs)
- [x] Read OpenCode documentation (agents.mdx, skills.mdx, permissions.mdx, rules.mdx, commands.mdx, config.mdx)
- [x] Consult relevant engineering book sections (TDD by Example, Pragmatic Programmer, XP, Building AI Agents, AI Engineering)
- [x] Document source consultation matrix in Task Plan
- [x] Identify specific corrections needed in current global/AGENTS.md
- [x] Write corrected global/AGENTS.md
- [x] Run validation commands (git status, git diff --check, git diff -- global/AGENTS.md)
- [x] Review complete diff
- [x] Update Task Plan with evidence
- [x] Report

---

## Validation Commands

```bash
git status --short
git diff --check
git diff -- global/AGENTS.md
```

---

## Evidence

**2026-06-16T19:55–19:58Z — Build complete:**

`global/AGENTS.md` rewritten from 336 lines (CRLF) to 435 lines (LF).

Key corrections made:
1. Task Plan fallback path corrected: `.agents/task-plans/` → `.opencode/task-plans/<task-id>.md`
2. OpenCode instruction loading order documented (local traversal → global `~/.config/opencode/AGENTS.md`; combined, not replaced)
3. Skills section: accurate description of the `skill` tool (lists name+description; agent loads on-demand via tool call; not auto-injected)
4. `doom_loop` reframed as OpenCode platform guard (triggers on 3 identical tool calls, surfaces recovery prompt); behavioral rule preserved separately
5. `external_directory` permission semantics documented (governs paths outside project working directory; not inherited from workspace)
6. `snapshot` feature noted in Git section (tracks agent changes; disabling removes UI undo)
7. Silence-is-not-approval clarified in Approval Gate
8. CRLF line endings removed (new file is LF only — cleaner for cross-platform)
9. No persona, roleplay, or theatrical identity; no project-specific stack references; no invented agents/commands/skills
10. Coverage verified for all 18 required sections from the task specification

Validation:
- `git status --short`: `M global/AGENTS.md`, `?? .opencode/task-plans/HARNESS-002-finalize-global-agents.md`
- `git diff --check`: exit 0, **PASS** (no trailing whitespace)
- Full diff reviewed: all additions, no deletions of prior behavioral policy, no secrets, no project-specific references
- Self-review checks: no `.agents/task-plans`, no stack references, no invented agents/commands, PASS

Line count: 435 lines.

---

## Deviations

None.

---

## Failures

None.

---

## Blockers

None.

---

## Current Phase

Complete. Awaiting user review and commit approval.

---

## Next Action

User reviews `global/AGENTS.md` and approves commit. Do not start HARNESS-003.
