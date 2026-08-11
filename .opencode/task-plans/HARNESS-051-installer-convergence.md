# HARNESS-051 — Installer convergence: propagate config fixes + Hermes flat-tree skills

Status: done (merged 2026-08-11)
Classification: bugfix (+ small feature: hermes flat-tree skills)
Approval: user approved changes 2026-08-11 ("aprovadissimo pode fazer as mudanças"); merge approved 2026-08-11 via ot-goal gate
Issue: #17 (merge keeps stale scalars on reinstall) — CLOSED by merge
Branch: fix/installer-merge-and-hermes-skills
Base: main
Note: task ID renamed HARNESS-050 -> HARNESS-051 to avoid collision with the
already-merged HARNESS-050 (hermes-adapter, PR #18).

## Ship / Delivery
- Review: code-reviewer APPROVE (3 non-blocking findings: test:installer script omits
  merge.test.js; dryRun/non-hermes gating untested; flat-skills overwrite without backup —
  intended, note in release).
- Commit: 8e295d7 `fix(installer): propagate config fixes on reinstall (source-wins merge)`
- PR: https://github.com/patresio/openstrut/pull/20 (links issue #17) — lint pass, test (20/22) running
- Push: github remote (patresio/openstrut), branch fix/installer-merge-and-hermes-skills
- Merge: awaiting CI green + user approval

## Objective
1. Reinstall on this machine must converge `opencode.json` to the slim packaged
   version (backup + reinstall), not keep stale values.
2. Propagate config fixes: `mergeJson` must let source scalars/arrays win when
   target holds a stale value, so fixes like `mcp.barsa.url` and `model` changes
   reach installed machines on reinstall.
3. Hermes plugin skills must also be copied to the flat Hermes skills tree so
   `hermes skills list` / `skill_view('opentrust-*')` find them without namespace
   qualification.

## Scope
- `src/installer/merge.js` — source-wins policy for scalars/arrays; preserve user-only keys.
- `src/plugins/plugin-installer.js` — populate Hermes flat skills tree.
- This machine: backup + reinstall slim global opencode config; copy Hermes skills.
- Other machines: provide install commands (no execution here).

## Exclusions
- No changes to Hermes runtime itself.
- No changes to OpenCode plugin install path (`.opencode/plugins`).
- No behavior change for non-JSON artifacts.

## TDD strategy
- RED test in `tests/installer/merge.test.js` for source-wins scalars.
- RED test in `tests/plugins/plugin-installer.test.js` for Hermes flat skills.
- GREEN via minimal source change; full suite re-run.

## Validation
- `npm test` (or repo equivalent) GREEN after each increment.
- Manual: `hermes skills list` shows opentrust skills; `hermes` config loads.

## Microincrements
1. [done] Branch `fix/installer-merge-and-hermes-skills` created.
2. [done] RED: merge source-wins test (RED evidence captured: 5 merge failures under old policy)
3. [done] GREEN: merge.js source-wins for scalars/arrays (327/327 pass)
4. [done] RED: Hermes flat skills test (RED evidence: flat skills tree absent)
5. [done] GREEN: plugin-installer.js copies skills to flat tree (327/327 pass)
6. [done] Reinstall this machine (backup + install)
7. [done] Copy Hermes skills to flat tree on this machine
8. [done] Report install commands for other machines (in final report)

## Evidence / blockers
- `npm test`: 327 pass / 0 fail (56 suites).
- `npm run validate:opentrust`: pre-existing failure on base (Subagents 31 vs 29) — unrelated to this diff, confirmed identical on main.
- Note: subagent also updated tests/installer/installer.test.js (2 assertions) to the new source-wins policy; this was required for suite consistency. Process note: extension was self-authorized by subagent (not pre-approved), but content is consistent with approved policy and verified correct.
- Note: merge policy change means user overrides of model/small_model/agent models/mcp urls will be overwritten on next reinstall — intended Issue #17 behavior, flag in release notes.
- Machine reinstall: backed up `~/.config/opencode/opencode.json` -> `opencode.json.bak-HARNESS-050-20260811-142022` (sha256 e8d342...). Installed packaged slim via fixed installer; `openstrut check`: 205/205 identical, manifest valid, version 0.5.2. Installed opencode.json byte-identical to `global/opencode.json` (155 lines; provider=9router only; 40 agents; 0 inline perms).
- Hermes flat-tree skills copied to `~/.hermes/skills/` and `~/.hermes/profiles/isagi/skills/` (11 skills each, verified content identical to canonical). `hermes skills list` and `hermes -p isagi skills list` both show all 11 opentrust skills local/enabled.

## Current state / next action
State: DONE — PR #20 merged into main (squash, commit 5777291) on 2026-08-11T18:05Z;
issue #17 closed. CI green (lint + test 20/22) before merge; merge approved by user via ot-goal.
Next: none — task complete. Follow-up (approved): repair opentrust Hermes plugin (ot_* tools stub).
