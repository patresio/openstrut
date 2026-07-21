# HARNESS-046: Release Readiness Proposal

## Executive Summary

OpenStrut has completed HARNESS-045 (Multi-Platform Plugin Distribution) and is feature-complete. However, it is not release-ready due to:
1. **Critical Bug** — CLI crashes due to missing `path.dirname` import
2. **No License** — Cannot legally distribute
3. **Minimal CI** — No lint, no badges, manual releases
4. **Outdated Docs** — Missing plugin architecture, outdated contributing guide

This proposal addresses all release readiness issues in a structured, incremental approach.

## Problem Statement

### Current State
- **Version:** 0.4.1
- **License:** UNLICENSED
- **Tests:** 484 total (266 + 218 plugin), 24 failing
- **CI:** Basic test runner, no lint/format
- **Release:** Manual process, no automation
- **Docs:** Incomplete, outdated

### Impact
- **Cannot distribute** — No license
- **Broken CLI** — 24 tests fail, CLI unusable
- **Error-prone releases** — Manual process
- **Contributor confusion** — Outdated docs

## Proposed Solution

### MI1: Critical Bug Fix + License Addition
**Goal:** Fix the dirname bug and add license

**Tasks:**
1. Fix `src/plugins/plugin-installer.js:14`
2. Create `LICENSE` file with MIT text
3. Update `package.json` license field
4. Verify all tests pass

**Duration:** ~30 minutes
**Risk:** Low

### MI2: CI Improvements
**Goal:** Improve CI pipeline with lint and badges

**Tasks:**
1. Add lint/format job to CI
2. Add CI status badge to README
3. Improve workflow structure

**Duration:** ~45 minutes
**Risk:** Low

### MI3: Release Automation
**Goal:** Implement automated releases with semantic-release

**Tasks:**
1. Add semantic-release GitHub Action
2. Update release workflow
3. Configure semantic-release

**Duration:** ~1 hour
**Risk:** Medium (adds complexity)

### MI4: Documentation Updates
**Goal:** Update contributing guide and architecture docs

**Tasks:**
1. Update CONTRIBUTING.md
2. Add plugin architecture to ARCHITECTURE.md
3. Update README quick start

**Duration:** ~30 minutes
**Risk:** Low

## Alternative Approaches

### Option A: Minimal Fix (Recommended)
- Fix bug, add license
- Keep manual releases
- Update docs incrementally

**Pros:** Simple, fast, low risk
**Cons:** Still manual releases

### Option B: Full Automation
- semantic-release, lint, badges
- Complete documentation overhaul

**Pros:** Professional, automated
**Cons:** Complex, adds dependencies

### Option C: Deferred
- Fix bug only
- Defer license, CI, docs

**Pros:** Fastest
**Cons:** Still not release-ready

**Recommendation:** Option A (Minimal Fix) with gradual improvements.

## Technical Details

### Bug Fix
**File:** `src/plugins/plugin-installer.js:14`

**Current:**
```javascript
const __dirname = dirname(__filename);
```

**Fixed:**
```javascript
const __dirname = path.dirname(__filename);
```

### License Choice
**Recommended:** MIT

**Why MIT:**
- Simple, permissive
- Allows commercial use
- Minimal restrictions
- Industry standard

### CI Improvements
**Add to `.github/workflows/ci.yml`:**
```yaml
- name: Lint
  run: npm run lint  # if lint script exists
- name: Format Check
  run: npm run format:check  # if format script exists
```

### Release Automation
**Use GitHub Action instead of npm package:**
```yaml
- name: Semantic Release
  uses: cycjimmy/semantic-release-action@v4
  with:
    branches: |
      ['main']
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Success Criteria

### Must Have
- [ ] LICENSE file exists with MIT text
- [ ] `node bin/openstrut.js --help` exits 0
- [ ] All 484 tests pass
- [ ] CI pipeline passes

### Should Have
- [ ] README shows CI status badge
- [ ] CONTRIBUTING.md updated
- [ ] ARCHITECTURE.md includes plugin system

### Nice to Have
- [ ] semantic-release configured
- [ ] CHANGELOG auto-updates
- [ ] Lint/format in CI

## Timeline

| MI | Duration | Dependencies |
|----|----------|--------------|
| MI1 | 30 min | None |
| MI2 | 45 min | MI1 |
| MI3 | 1 hour | MI2 |
| MI4 | 30 min | MI1 |
| **Total** | **~2.5 hours** | |

## Risks and Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| License choice wrong | High | Low | Present options, get approval |
| semantic-release adds deps | Medium | Medium | Use GitHub Action |
| CI complexity | Low | Medium | Start simple |
| Documentation scope | Low | High | Focus on essentials |

## Decision Points

1. **License Choice** — MIT vs Apache 2.0 vs GPL-3.0
2. **Release Tool** — semantic-release vs changesets vs manual
3. **CI Scope** — Minimal vs standard vs comprehensive

## Next Steps

1. Get user approval on proposal
2. Create feature branch
3. Execute MI1 (bug fix + license)
4. Execute MI2 (CI improvements)
5. Execute MI3 (release automation)
6. Execute MI4 (documentation)
7. Review and merge

## Conclusion

HARNESS-046 addresses all release readiness issues in a structured, incremental approach. The critical bug fix and license addition are immediate priorities, while CI improvements and release automation can follow.

**Recommendation:** Approve HARNESS-046 with MIT license and minimal CI improvements.

---

**Proposal complete. Stop at Approval Gate.**
