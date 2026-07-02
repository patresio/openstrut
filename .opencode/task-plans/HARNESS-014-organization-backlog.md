# HARNESS-014 Organization Backlog

Classification: planning
Status: ready
Approval evidence: user requested an artifact to preserve the proposal and continue organized.
Scope: capture current repo organization proposal, ready-now actions, deferred work, and validation commands.
Exclusions: no code changes, no delivery actions, no push/PR/release.

## Current verified state

- Branch: `feature/harness-011-change-execution-manifest`.
- Recent completed but uncommitted work:
  - root `AGENTS.md` from HARNESS-012;
  - documentation reconciliation from HARNESS-013;
  - HARNESS-009 marked `COMPLETED — PARTIALLY VERIFIED`.
- Validation last observed after HARNESS-013:
  - `npm test`: PASS, 201 tests;
  - `npm run test:evals`: PASS, 35 tests;
  - `npm pack --dry-run --ignore-scripts`: PASS, 46 files.
- Pre-existing/unresolved local items:
  - `references/tips/` untracked;
  - `eval-output.log` present at repo root;
  - possible `$tempHome/` artifact at repo root;
  - no lint, formatter, typecheck, lockfile, or CI workflow configured.

## Milestone 1 — stabilize repo

Goal: remove remaining incoherence and local clutter before delivery.

Checklist:

- [x] Fix `docs/ARCHITECTURE.md` Agent Architecture table counts:
  - `Global skills`: 8 → 9;
  - `Global commands`: 9 → 10.
- [x] Resolve plan-agent model mismatch:
  - Decision: keep `global/opencode.json` plan model as `opencode/deepseek-v4-flash-free` and update docs as cost decision.
- [x] Inspect `eval-output.log`; remove or gitignore if stale.
  - Result: file is stale but already ignored by root `.gitignore` via `*.log`.
- [x] Inspect `$tempHome/`; remove or gitignore if stale.
  - Result: no matching path found in repo root during inspection.
- [x] Decide whether empty `src/commands/` and `src/config/` stay as placeholders or are removed.
  - Result: no matching directories found during inspection; no action needed.
- [x] Run validation:
  - `npm test`;
  - `npm run test:evals`;
  - `npm pack --dry-run --ignore-scripts`.

## Milestone 2 — preserve completed work

Goal: commit current completed work coherently after user approval.

Checklist:

- [x] Update HARNESS-012 and HARNESS-013 task plan statuses to complete if not already done.
  - Result: both marked `ready for commit`; Commit/Push/PR remain unchecked until delivery approval.
- [x] Review full diff and untracked files.
  - Result: reviewed working tree summary and diff stats; `references/tips/` remains untracked and outside current commit scope unless user explicitly includes it.
- [ ] Commit docs + root `AGENTS.md` + task plans with Conventional Commit message.
- [ ] Do not push without separate explicit approval.

Candidate commit message:

```text
docs: reconcile harness project instructions and architecture
```

## Milestone 3 — organize durable backlog

Goal: make future work discoverable without rereading all task plans.

Checklist:

- [ ] Create `CHANGELOG.md` if versioned release notes are desired.
- [ ] Create minimal ADRs in `docs/decisions/`:
  - installer safety and managed inventory;
  - OpenCode artifact topology;
  - SDD change execution manifest.
- [ ] Close or normalize stale statuses in HARNESS-001 through HARNESS-007.
- [ ] Document `generate-manifest` in README CLI usage if still missing.

## Deferred product work

- `uninstall`, `update`, `diff`, and `doctor` CLI commands.
- Automatic JSON/JSONC merge for `opencode.json`.
- Homelab tarball distribution and `npx` pilot flow.
- Real-machine install test against explicitly approved target.
- Expanded deterministic/runtime eval scenarios.
- Technical debate capability.
- AI Workspace layer from `references/tips/future-tips.md`.

## Milestone 1 evidence

- `docs/ARCHITECTURE.md` updated to 9 global skills and 10 global commands.
- `docs/design/001-harness-architecture.md` updated to document `plan` using `opencode/deepseek-v4-flash-free` as current cost decision.
- `eval-output.log` inspected and confirmed already ignored by root `.gitignore`.
- No `$tempHome/`, `src/commands/`, or `src/config/` paths found during current inspection.
- Validation results:
  - `npm test`: PASS, 201 tests.
  - `npm run test:evals`: PASS, 35 tests.
  - `npm pack --dry-run --ignore-scripts`: PASS, 46 packaged files.

## Next recommended action

Start Milestone 2: review full diff, normalize HARNESS-012/HARNESS-013 status if needed, and prepare coherent commit when user approves delivery.
