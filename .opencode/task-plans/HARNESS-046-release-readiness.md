# HARNESS-046: Release Readiness — License, CI, Fixes, Documentation

## Objective
Prepare OpenStrut for production release by adding a license, fixing critical bugs, improving CI/CD pipeline, automating releases, and updating documentation.

## Classification
Feature + Bugfix + Infrastructure

## Status
- [x] Approved (HARNESS-046 approval gate)
- [ ] In Progress
- [ ] Complete

## Evidence
- Task contract: `docs/proposals/HARNESS-046-release-readiness-task-contract.md`
- Exploration report: Explore phase output
- User approval: HARNESS-046 approval gate

## Scope

### In Scope
1. **License Addition** — Choose and add MIT license
2. **Critical Bug Fix** — Fix `dirname` import in plugin-installer.js
3. **CI Improvements** — Add lint, badges, improve workflow
4. **Release Automation** — Implement semantic-release or changesets
5. **Documentation Updates** — Contributing guide, architecture docs

### Out of Scope
- New features or agents
- Platform-specific optimizations
- Retrieval system changes
- Package publication (stays private)

## Assumptions
- MIT license is acceptable (user approval required)
- semantic-release is preferred over manual releases
- Existing 266 tests + 218 plugin tests should pass after fix

## Risks
1. **License Choice** → Present options, get user approval
2. **CI Complexity** → Start simple, iterate
3. **Release Automation** → Use proven tools (semantic-release)
4. **Documentation Scope** → Focus on essentials first

## Issue
- HARNESS-046: Release Readiness

## Branch
- feat/harness-046-release-readiness

## Microincrements

### MI1: Critical Bug Fix + License Addition
**Goal:** Fix the dirname bug and add license
**Files:**
- `src/plugins/plugin-installer.js` — Fix dirname import
- `LICENSE` — Add MIT license
- `package.json` — Update license field

**Tests:**
- All 266 existing tests pass
- CLI subprocess tests pass (18 tests fixed)

**Acceptance Criteria:**
- [ ] `node bin/openstrut.js --help` exits 0
- [ ] LICENSE file exists with MIT text
- [ ] package.json has `"license": "MIT"`

### MI2: CI Improvements
**Goal:** Improve CI pipeline with lint and badges
**Files:**
- `.github/workflows/ci.yml` — Add lint job
- `README.md` — Add CI badge
- `package.json` — Add lint script (if needed)

**Tests:**
- CI passes on all jobs
- Badge displays correctly

**Acceptance Criteria:**
- [ ] CI includes lint/format check
- [ ] README shows CI status badge
- [ ] All CI jobs pass

### MI3: Release Automation
**Goal:** Implement automated releases with semantic-release
**Files:**
- `.github/workflows/release.yml` — Update for semantic-release
- `package.json` — Add semantic-release config
- `CHANGELOG.md` — Auto-generated

**Tests:**
- Release workflow creates proper tags
- CHANGELOG updates automatically

**Acceptance Criteria:**
- [ ] semantic-release config exists
- [ ] Release workflow uses semantic-release
- [ ] CHANGELOG auto-updates on release

### MI4: Documentation Updates
**Goal:** Update contributing guide and architecture docs
**Files:**
- `CONTRIBUTING.md` — Update with current workflow
- `docs/ARCHITECTURE.md` — Add plugin architecture
- `README.md` — Update quick start

**Tests:**
- Documentation renders correctly
- Links work

**Acceptance Criteria:**
- [ ] CONTRIBUTING.md reflects current workflow
- [ ] ARCHITECTURE.md includes plugin system
- [ ] README quick start is accurate

## Definition of Done
- [ ] All acceptance criteria met
- [ ] All tests pass (266 + 218 plugin tests)
- [ ] CI pipeline passes
- [ ] Review approved
- [ ] Documentation updated
- [ ] Committed with conventional commit messages

## Retrieval Context

Required contexts:
- CTX19 (DevOps/CI/CD)
- CTX20 (Release management)
- CTX23 (Quality gates)

Required bundles:
- B13 (workflow-operations)
- B14 (ci-cd-pipeline)

Required skills:
- SK19 (CI/CD)
- SK20 (Release)

Official docs:
- DOC_OPENCODE_CONFIG

Provider:
- local-context-catalog

Policy:
- synthesize-only
- no raw chunks in commits
- cite source IDs when available
- use only approved selectors

## Teams Involved

| Team | Role |
|------|------|
| Engineering | Bug fix, CI improvements |
| DevOps | Release automation, CI pipeline |
| Knowledge | Documentation updates |
| Delivery | Release management |

## Dependencies
- HARNESS-045 (Multi-Platform Plugin) — Complete
- Node.js >=20
- GitHub Actions access

## Next
Approve to proceed to Apply phase.
