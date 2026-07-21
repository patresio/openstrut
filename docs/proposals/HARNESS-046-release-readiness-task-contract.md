# Task: HARNESS-046 — Release Readiness

## Objective
Prepare OpenStrut for production release by adding a license, fixing critical bugs, improving CI/CD pipeline, automating releases, and updating documentation.

## Why Now
After completing HARNESS-045 (Multi-Platform Plugin Distribution), the project is feature-complete but not release-ready. Critical issues:
1. No LICENSE file (UNLICENSED status)
2. Bug in plugin-installer.js causes 24 test failures
3. CI is minimal (no lint, no badges)
4. Release process is manual
5. Documentation needs updates

## Acceptance Criteria

### Critical (Must Have)
- [ ] LICENSE file exists with chosen license text
- [ ] `node bin/openstrut.js --help` exits 0 (fix dirname bug)
- [ ] All 266 existing tests pass
- [ ] All 218 plugin tests pass
- [ ] CI pipeline passes on all jobs

### Important (Should Have)
- [ ] README shows CI status badge
- [ ] semantic-release config exists
- [ ] Release workflow uses semantic-release
- [ ] CONTRIBUTING.md reflects current workflow

### Nice to Have
- [ ] CHANGELOG auto-updates on release
- [ ] ARCHITECTURE.md includes plugin system
- [ ] Lint/format check in CI

## Scope

### In Scope
1. **License Addition**
   - Choose license (MIT recommended)
   - Create LICENSE file
   - Update package.json license field

2. **Critical Bug Fix**
   - Fix `dirname` import in `src/plugins/plugin-installer.js:14`
   - Should be `path.dirname` not `dirname`

3. **CI Improvements**
   - Add lint/format job to CI
   - Add CI status badge to README
   - Improve workflow reliability

4. **Release Automation**
   - Implement semantic-release
   - Update release workflow
   - Auto-generate CHANGELOG

5. **Documentation Updates**
   - Update CONTRIBUTING.md
   - Add plugin architecture to ARCHITECTURE.md
   - Update README quick start

### Out of Scope
- New features or agents
- Platform-specific optimizations
- Retrieval system changes
- Package publication (stays private)
- Major refactoring

## Retrieval Context

Required contexts:
- CTX19 — DevOps/CI/CD operations
- CTX20 — Release management
- CTX23 — Quality gates and validation

Required bundles:
- B13 — Workflow operations
- B14 — CI/CD pipeline

Required skills:
- SK19 — CI/CD procedures
- SK20 — Release management

Official docs:
- DOC_OPENCODE_CONFIG

Provider:
- local-context-catalog

Policy:
- synthesize-only
- no raw chunks in commits
- cite source IDs when available
- use only approved selectors

## Test Plan

### Unit Tests
- Fix existing CLI subprocess tests (18 tests)
- Verify all 266 + 218 tests pass

### Integration Tests
- CI pipeline runs successfully
- Release workflow creates proper tags
- Badge displays correctly

### Validation
- `npm test` passes
- `npm run eval:deterministic` passes
- `npm pack --dry-run` succeeds

## Microincrements

### MI1: Critical Bug Fix + License Addition
**Duration:** ~30 minutes
**Goal:** Fix the dirname bug and add license

**Tasks:**
1. Fix `src/plugins/plugin-installer.js:14`
   - Change `const __dirname = dirname(__filename);`
   - To `const __dirname = path.dirname(__filename);`

2. Create `LICENSE` file with MIT text

3. Update `package.json`
   - Change `"license": "UNLICENSED"` to `"license": "MIT"`

4. Run tests to verify fix

**Acceptance Criteria:**
- [ ] `node bin/openstrut.js --help` exits 0
- [ ] LICENSE file exists
- [ ] package.json has `"license": "MIT"`
- [ ] All 266 tests pass

### MI2: CI Improvements
**Duration:** ~45 minutes
**Goal:** Improve CI pipeline with lint and badges

**Tasks:**
1. Update `.github/workflows/ci.yml`
   - Add lint/format job (if applicable)
   - Improve workflow structure

2. Update `README.md`
   - Add CI status badge
   - Update quick start section

3. Verify CI passes

**Acceptance Criteria:**
- [ ] CI includes all necessary jobs
- [ ] README shows CI status badge
- [ ] All CI jobs pass

### MI3: Release Automation
**Duration:** ~1 hour
**Goal:** Implement automated releases with semantic-release

**Tasks:**
1. Install semantic-release (dev dependency)
   - Note: Project has zero deps, so this needs consideration
   - Alternative: Use GitHub Actions semantic-release action

2. Update `.github/workflows/release.yml`
   - Use semantic-release action
   - Configure proper branches

3. Add semantic-release config to `package.json`

4. Test release workflow

**Acceptance Criteria:**
- [ ] semantic-release config exists
- [ ] Release workflow uses semantic-release
- [ ] CHANGELOG auto-updates on release

### MI4: Documentation Updates
**Duration:** ~30 minutes
**Goal:** Update contributing guide and architecture docs

**Tasks:**
1. Update `CONTRIBUTING.md`
   - Reflect current workflow
   - Add plugin development section

2. Update `docs/ARCHITECTURE.md`
   - Add plugin architecture section
   - Document multi-platform support

3. Update `README.md`
   - Ensure quick start is accurate
   - Add troubleshooting section

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
- [ ] No regressions introduced

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| License choice wrong | Legal issues | Present options, get user approval |
| semantic-release adds deps | Violates zero-dep原则 | Use GitHub Action instead of npm package |
| CI complexity | Slower builds | Start simple, optimize later |
| Documentation scope | Incomplete docs | Focus on essentials, iterate |

## Dependencies

- HARNESS-045 (Multi-Platform Plugin) — Complete
- Node.js >=20
- GitHub Actions access
- User approval for license choice

## Decision Points

1. **License Choice** — MIT vs Apache 2.0 vs GPL-3.0
2. **Release Tool** — semantic-release vs changesets vs manual
3. **CI Scope** — Minimal vs comprehensive

## Next Steps

1. Get user approval on license choice
2. Create feature branch
3. Execute MI1 (bug fix + license)
4. Execute MI2 (CI improvements)
5. Execute MI3 (release automation)
6. Execute MI4 (documentation)
7. Review and merge

---

**Propose complete. Stop at Approval Gate.**
