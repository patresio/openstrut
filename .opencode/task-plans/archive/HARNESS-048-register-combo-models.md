# HARNESS-048 — Register combo-* models for 9router provider

## Objective

Sync the harness source artifact `global/opencode.json` with the validated runtime fix for the "invalid llm" incident: register the `combo-*` model family (including `combo-prefeitura-*`) under `provider["9router"].models`, so future installs are consistent and per-machine env-var model selection (`MODEL_LEAD/TECH/LIGHT`) resolves to registered models.

## Classification

- Type: implementation (config-only, non-executable declarative JSON)
- TDD: NOT applicable (declared exception — no executable behavior change; config artifact)
- Issue: required (approved)
- Branch: required (approved)
- PR: required (approved)
- Worktree: not required (working tree has only one pre-existing untracked task plan; branch work is isolated by commit)

## Approval Evidence

- User approved via question response: "Sim, via task plan + branch (Recommended)" (2026-08-01).
- Runtime fix validated first: `opencode run --model 9router/combo-prefeitura-{lead,tech,light}` all `ok`, exit 0; `opencode models` lists 8 models; backup at `~/.config/opencode/opencode.json.2026-08-01T15-27-24-486Z.incident-backup`.

## Scope

### In Scope
- Add to `global/opencode.json` → `provider["9router"].models`:
  - `combo-lead`, `combo-tech`, `combo-light`
  - `combo-prefeitura-lead`, `combo-prefeitura-tech`, `combo-prefeitura-light`
- Keep existing `combo-main`, `combo-cheap` unchanged.
- GitHub issue, branch, commit, push, PR.

### Out of Scope
- No changes to `~/.config/opencode/` (already fixed at runtime).
- No changes to installer code, inventory, manifest, tests, docs, or other artifacts.
- No changes to `references/`, release tarballs, or other projects.
- No wildcard/auto-discovery mechanism (none exists in OpenCode for OpenAI-compatible providers).
- Do not touch pre-existing untracked `.opencode/task-plans/HARNESS-001-migrate-agents.md`.

## Assumptions
- Remote is `github.com/patresio/openstrut` (private), branch `main`, base for PR.
- `gh` authenticated as the active account (`patresio`); no token env overrides active.
- Model IDs must match `GET /v1/models` ids of the 9Router server (validated earlier).

## Risks
- `npm test` fixtures may assert provider models content → mitigation: run full `npm test`; do not weaken assertions; if a fixture asserts the old model set, update fixture ONLY as a factual sync and report it in the PR body.
- Unrelated untracked file could get swept up → mitigation: stage only `global/opencode.json`.

## Affected Files
- `global/opencode.json` (only source file)
- `.opencode/task-plans/HARNESS-048-register-combo-models.md` (task plan)

## Ordered Microincrements
1. Create GitHub issue (title: `Register combo-* models for 9router provider`).
2. Create branch `fix/register-combo-models` from `main`.
3. Edit `global/opencode.json` — add 6 model entries under `provider["9router"].models`.
4. Validate: JSON parses; models keys contain the 6 new ids; `npm test` passes.
5. Self-review diff (scope, no unrelated files).
6. Commit conventional: `fix(config): register combo-* models for 9router provider` (Closes #issue).
7. Push branch; open PR to `main` with issue link, scope, validation, risks.

## Validation
- `node -e` JSON parse + keys assertion.
- `npm test` (node:test suite) — must pass.
- Diff review: only `global/opencode.json` changed (+ task plan + issue/PR metadata).

## Review
- Review-lead (or lead) reviews PR diff before merge; merge only after approval and checks pass.

## Delivery
- Push branch and open PR (user approved). Do NOT merge without further approval.

## Evidence
- PR URL; `npm test` output; git status/diff summary; models keys before/after.

## Blockers
- None known.

## Current State
- Plan approved; ready for execution.

## Next Action
- Delegate execution to ci-cd-infrastructure-engineer.

## Completion (2026-08-19, HARNESS-052 MI-8 cleanup)

- Executed and committed: `git log -- global/opencode.json` shows
  `fix(config): register combo-* models for 9router provider` (442f92e, fa0af1e).
- `global/opencode.json` → `provider["9router"].models` contains all 8 models:
  `combo-main, combo-cheap, combo-lead, combo-tech, combo-light,
  combo-prefeitura-lead, combo-prefeitura-tech, combo-prefeitura-light`.
- Status: **complete** — archived to `.opencode/task-plans/archive/`.
