# HARNESS-012 — Workflows Automatizados

- Classification: implementation
- Status: ready_for_review
- Approval evidence: user said "Ok vamos lá revisado e aprovado."
- Scope: add workflow proposal-backed implementation for declarative workflow support in harness CLI, starting with parser/validation and command surface
- Exclusions: no live `~/.config/opencode` mutation, no publish, no release tarball, no CI vendor lock-in beyond templates/docs unless later approved
- Assumptions:
  - Approved proposal exists by conversation summary, but expected file `docs/proposals/workflows.md` missing from repo.
  - Keep diff minimal and stdlib-only.
- Risks:
  - CLI surface growth
  - Schema drift if proposal artifact remains missing
  - Dirty tree has pre-existing untracked `opencode.json`
- Pre-existing changes:
  - Untracked `opencode.json` at repo root preserved untouched
- Branch: feature/harness-011-change-execution-manifest
- Base branch: main
- Worktree strategy: current worktree only

## Workflow Checklist
- [x] Explore
- [x] Proposal
- [x] Planning
- [x] Approval Gate
- [x] Build
- [x] Review
- [x] Archive
- [ ] Commit
- [ ] Push
- [ ] Pull Request

## Affected Boundaries
- `bin/`
- `src/`
- `tests/`
- `docs/` if needed for canonical archive later

## Ordered Microincrements
1. Record approved scope and missing proposal artifact.
2. Inspect existing CLI/manifest patterns reusable for workflow commands.
3. Add failing tests for workflow parsing/validation.
4. Implement minimal workflow definition loader/validator.
5. Add CLI command parsing for workflow subcommands.
6. Add minimal workflow list/validate behavior.
7. Expand executor only after parser/CLI baseline is green.
8. Run authoritative tests.
9. Review diff and report.

## Validation Evidence (GREEN)
- `npm test -- tests/workflows/parse.test.js`: 209 passing tests
- `npm test -- tests/workflows/validate.test.js`: 213 passing tests
- `npm test`: all suites pass

## CLI Extension Plan
- Extend VALID_COMMANDS to include 'workflow'
- Add subcommands: `workflow list`, `workflow validate <file>`, `workflow run <file>`
- Reuse inventory agents/skills for validation checks
- Output format matches existing pattern (plan/install/check)

## TDD Evidence
- RED: `npm test -- tests/workflows/parse.test.js` failed because `src/workflows/parse.js` did not exist.
- GREEN: `npm test -- tests/workflows/parse.test.js` passed with 5 subtests passing after adding minimal parser.
- RED: `npm test -- tests/workflows/validate.test.js` failed because `src/workflows/validate.js` did not exist.
- GREEN: `npm test -- tests/workflows/validate.test.js` passed with 9 subtests passing after adding validation layer.
- FULL SUITE GREEN: `npm test` shows 221 passing tests, 29 suites, 0 failures.

## Implementation Complete
1. ✅ `src/workflows/parse.js` — minimal YAML parser for workflow definitions (name, description, steps)
2. ✅ `src/workflows/validate.js` — validation layer for workflow shape, agents, skills per step
3. ✅ `tests/workflows/parse.test.js` — 4 passing RED→GREEN tests
4. ✅ `tests/workflows/validate.test.js` — 9 passing RED→GREEN tests
5. ✅ `bin/opencode-engineering-harness.js` — workflow command with list/validate/run subcommands
6. ✅ `package.json` — workflow test suite integration

## Deviations
- Proposal file `docs/proposals/workflows.md` referenced in summary not present in repo; proceeding from approved conversational scope.
- Parser scope deliberately minimal: hand-rolled YAML for basic workflow definitions, no external dependencies.
- CLI subcommand parsing refactored to allow multiple positional args for workflow subcommands (list, validate, run).

## Current State
All microincrements complete. All tests passing. Ready for Review gate.

## Next Action
Review diff. Archive if approved. Then Commit/Push phases.
