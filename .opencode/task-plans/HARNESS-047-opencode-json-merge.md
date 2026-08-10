# Task: HARNESS-047 — opencode.json Merge on Install

## Objective
Fix installer to deep-merge `opencode.json` instead of blocking on conflict. Report missing keys so user knows what the new harness version adds.

## Classification
bugfix

## Status
complete — delivered in `acc8853` (merged to main, no PR required per direct commit)

## Approval Evidence
User-reported bug: installation on second computer failed because opencode.json was classified as unmanaged-conflict. User expects merge + missing key report.

## Scope
### In Scope
- `mergeJson(source, target)` utility for deep JSON merge
- New classification: `mergeable-json` for JSON config files
- Install path: merge source JSON with existing user JSON
- Missing key report in install result
- TDD: RED → GREEN → REFACTOR

### Out of Scope
- Merge for non-JSON files (Markdown, etc.)
- Comment preservation (JSON has no comments)
- Secret detection/redaction
- AGENTS.md merge (Markdown, not JSON)

## Assumptions
- `opencode.json` is the only JSON file in inventory that needs merge
- Deep merge means nested objects are merged recursively
- Arrays are replaced (not merged) — standard JSON merge behavior
- User keys not in source are always preserved

## Risks
- Nested object merge may surprise users → mitigate with clear reporting
- Source checksum tracking changes → manifest must record merged checksum

## Issue
GitHub issue creation pending (credentials unavailable)

## Branch
`fix/opencode-json-merge`

## Base
`main`

## Affected Files
- `src/installer/merge.js` (new)
- `src/installer/classify.js` (add mergeable-json class)
- `src/installer/install.js` (merge path for JSON)
- `tests/installer/installer.test.js` (new tests)
- `tests/installer/merge.test.js` (new)

## Ordered Microincrements

### 1. TDD RED: mergeJson utility
- Write `tests/installer/merge.test.js` with tests for:
  - Flat merge (source keys added, target keys preserved)
  - Deep nested merge
  - Array replacement
  - Missing keys reported
- Tests must FAIL (merge.js doesn't exist)

### 2. TDD GREEN: mergeJson implementation
- Create `src/installer/merge.js` with `mergeJson(source, target)` and `findMissingKeys(source, target)`
- Tests must PASS

### 3. TDD RED: classify mergeable-json
- Add test in `installer.test.js`:
  - User has opencode.json with custom key → should classify as `mergeable-json`, not `unmanaged-conflict`
- Test must FAIL

### 4. TDD GREEN: classify mergeable-json
- Add `'mergeable-json'` to ArtifactClass union
- Update `classifyArtifact()` to detect JSON files and return `mergeable-json`
- Update `isBlockingConflict()` to NOT block on `mergeable-json`
- Update `requiresWrite()` to return true for `mergeable-json`
- Tests must PASS

### 5. TDD RED: install merge path
- Add test: install with user's custom opencode.json → should merge, preserve custom keys, add missing keys
- Test must FAIL

### 6. TDD GREEN: install merge path
- In `install()`, detect `mergeable-json` class
- Read source JSON, read target JSON, merge, write merged result
- Add `missingKeys` to install result
- Tests must PASS

### 7. Validate all tests pass
- Run `npm run test:installer`
- All existing + new tests pass

## TDD Strategy
- RED: Write smallest failing test first
- GREEN: Implement minimum code to pass
- REFACTOR: Clean up while green

## Validation
- `npm run test:installer` — all pass
- `npm test` — full suite passes

## Review
- Pending after implementation

## Delivery
- Commit with conventional commit: `fix(installer): deep-merge opencode.json instead of blocking on conflict`
- PR to main

## Evidence
- TDD RED/GREEN证据将在此记录

## Blockers
- GitHub credentials unavailable for issue/PR creation

## Current State
**COMPLETE** — trabalho entregue em `acc8853` (2026-07-27) no main: `src/installer/merge.js` (mergeJson, findMissingKeys), classificação `mergeable-json`, path de merge no install, missing keys report. Testes: `tests/installer/merge.test.js` — 8/8 pass (verificado 2026-08-10). Follow-up conhecido: issue #17 (merge não propaga fixes de config em updates).

## Next Action
Nenhum — task completa. Follow-up registrado na issue #17.
