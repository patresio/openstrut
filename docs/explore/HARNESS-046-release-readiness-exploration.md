# HARNESS-046 Exploration Report: Release Readiness

## Date
2026-07-20

## Objective
Explore current state and identify requirements for making OpenStrut release-ready.

## Current State

### Repository Status
- **Branch:** `feat/harness-045-multi-platform`
- **Version:** 0.4.1
- **License:** UNLICENSED (no LICENSE file)
- **Tests:** 266 existing + 218 plugin tests = 484 total
- **Failing Tests:** 24 (CLI subprocess tests)

### Critical Issue Found
**Bug in `src/plugins/plugin-installer.js:14`:**
```javascript
const __dirname = dirname(__filename);  // ❌ dirname is not defined
```
Should be:
```javascript
const __dirname = path.dirname(__filename);  // ✅ path.dirname
```

**Impact:** CLI crashes with `ReferenceError: dirname is not defined`, causing 18 CLI subprocess tests to fail.

### CI/CD Status
- **CI Workflow:** `.github/workflows/ci.yml`
  - Runs on Node.js 20 and 22
  - Tests: `npm test`, `npm pack --dry-run`, evals
  - No lint/format check
  - No status badge in README

- **Release Workflow:** `.github/workflows/release.yml`
  - Triggers on `v*.*.*` tags
  - Runs tests + evals
  - Creates GitHub Release with tarball
  - No CHANGELOG automation
  - No semantic versioning

### Documentation Status
- **README.md:** Updated with HARNESS-045, but needs badge
- **CONTRIBUTING.md:** Exists but may be outdated
- **ARCHITECTURE.md:** Exists but missing plugin architecture
- **CHANGELOG.md:** Manual updates, last entry v0.4.1

## Risk Assessment

### Critical Risks
1. **No License** — Cannot legally distribute or use
2. **Broken CLI** — 24 tests fail, CLI unusable
3. **Manual Releases** — Error-prone, no automation

### Medium Risks
4. **No Lint/Format** — Code style inconsistencies
5. **Outdated Docs** — Confusion for contributors
6. **No CI Badge** — No visibility into build status

### Low Risks
7. **Zero Dependencies** — semantic-release adds deps (philosophical concern)
8. **Documentation Scope** — May be incomplete

## Selector Analysis

| Selector | Relevance | Usage |
|----------|-----------|-------|
| CTX19 | High | DevOps/CI/CD operations |
| CTX20 | High | Release management |
| CTX23 | Medium | Quality gates |
| B13 | Medium | Workflow operations |
| B14 | High | CI/CD pipeline |
| SK19 | High | CI/CD procedures |
| SK20 | High | Release management |
| DOC_OPENCODE_CONFIG | Low | Configuration reference |

## Recommendations

### Immediate Actions (MI1)
1. Fix `dirname` bug in plugin-installer.js
2. Add MIT license (or get user preference)
3. Verify all tests pass

### Short-term Actions (MI2-MI3)
4. Improve CI with lint/format
5. Implement release automation
6. Add CI badge to README

### Medium-term Actions (MI4)
7. Update CONTRIBUTING.md
8. Add plugin architecture to docs
9. Improve quick start guide

## Decision Points

### 1. License Choice
**Options:**
- **MIT** — Permissive, allows commercial use, minimal restrictions
- **Apache 2.0** — Similar to MIT but with patent protection
- **GPL-3.0** — Copyleft, forces derivative works to be open source

**Recommendation:** MIT (simplest, most permissive)

### 2. Release Tool
**Options:**
- **semantic-release** — Full automation, conventional commits
- **changesets** — Manual control, explicit versioning
- **Manual** — Current approach, error-prone

**Recommendation:** semantic-release with GitHub Action (avoids adding npm deps)

### 3. CI Scope
**Options:**
- **Minimal** — Just fix bugs, add badge
- **Standard** — Add lint/format, improve workflow
- **Comprehensive** — Full pipeline with all checks

**Recommendation:** Standard (balanced approach)

## Evidence

### Test Failures
```
not ok 1 - --help exits 0 and prints Usage:
  Expected values to be strictly equal:
  1 !== 0
```

**Root Cause:** `dirname` not defined in plugin-installer.js

### Package Status
```json
{
  "name": "@patrese/openstrut",
  "version": "0.4.1",
  "private": true,
  "license": "UNLICENSED"
}
```

### CI Workflow
```yaml
- run: npm test
- run: npm pack --dry-run --ignore-scripts
- run: node evals/runner/run.js --layer deterministic
```

No lint, no format check, no badges.

## Conclusion

OpenStrut is feature-complete but not release-ready. Critical issues:
1. **Broken CLI** — Must fix immediately
2. **No License** — Must add before any distribution
3. **Manual Process** — Should automate for sustainability

**Recommendation:** Proceed with HARNESS-046 to address all release readiness issues.

---

**Exploration complete. Proceed to Propose phase.**
