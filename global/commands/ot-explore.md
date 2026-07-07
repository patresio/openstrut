---
description: Perform read-only exploration for a given objective
agent: trust-lead
---

# Explore Command

**Purpose:** Inspect current state, identify scope, files, risks, and needed Retrieval Context selectors.

## Instructions

1. Load `docs/opencode/WORKFLOW.md` and `docs/opencode/TASK_CONTRACT.md`.
2. Inspect current repository state: branch, diff, git log, open issues.
3. Identify affected files, dependencies, and risks.
4. Determine needed Retrieval Context selectors:
   - CTX: Operational contexts (knowledge domains)
   - SK: Reusable skills
   - B: Reference bundles
   - DOC: Official documentation
5. Do not implement, commit, or mutate anything.
6. Stop at the Explore phase. Do not propose or plan.

## Input Format

```
ot-explore <objective>
```

## Workflow Step

Phase 1: Explore (Read Only)

| Aspect | Rule |
|--------|------|
| Allowed | reading, searching, git history, diagnostics |
| Forbidden | edits, installations, branch changes, commits |
| Retrieval | May call Knowledge lead to identify relevant CTX/BUNDLE/SK/DOC selectors |

## Expected Output

- Current state summary (branch, diff, git status)
- Scope identification (affected files, boundaries)
- Risk assessment (breaking changes, dependencies)
- Needed Retrieval Context selectors (CTX, SK, B, DOC)
- Explicit statement: "Explore complete. Stop at Approval Gate."

## Execution Report

```
[STATE]
Branch: <branch>
Diff: <summary of changes>
Git Status: <clean/dirty>
Issues: <open/closed count>

[SCOPE]
Affected Files: <list>
Dependencies: <list>
Boundaries: <defined>

[RISKS]
Critical: <none identified / list>
Breaking Changes: <none identified / list>
Dependencies: <list>

[SELECTORS]
CTX: <needed contexts>
SK: <needed skills>
B: <needed bundles>
DOC: <needed docs>

[NEXT]
Approve to proceed to Propose phase.
```
