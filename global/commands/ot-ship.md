---
description: Prepare commit/PR/release only when requested; use Conventional Commit in English
agent: delivery-lead
---

# Ship Command

**Purpose:** Prepare commit, PR, and release artifacts only when explicitly requested.

## Instructions

1. Read WORKFLOW.md and TASK_CONTRACT.md from installed `opentrust/docs/`.
2. Load project `CONTRIBUTING.md` for delivery rules.
3. Verify: all tests pass, review approved, diff inspected.
4. Prepare delivery artifacts:
   - Archive (OpenSpec, ADR, docs update)
   - Commit (Conventional Commits in English)
   - Push (to approved branch)
   - Pull Request (with approved template)
5. Do not push or PR without explicit user authorization.
6. Do not include unrelated files or retrieval content.
7. Do not call the retrieval provider during shipping — no retrieval content in commits.

## Input Format

```
ot-ship <task-id> [commit | push | pr | release]
```

## Workflow Step

Phase 5: Ship (Delivery)

| Aspect | Rule |
|--------|------|
| Allowed | archive, commit, push, PR |
| Required | all tests pass, review approved, diff inspected |
| Retrieval | Must not include private retrieval content in commits |

## Expected Output

Delivery Report:

```
[SHIP]
Task: <task-id>
Status: <pending-authorization | prepared | completed>

[ARTIFACTS]
Archive: <created/updated files>
Commit: <conventional message>
Branch: <target branch>
PR: <URL or draft>

[VERIFICATION]
Tests: <passed>
Review: <approved>
Diff: <inspected>
Security: <clear>
Secrets: <none detected>

[NEXT]
User authorization required for push/PR.
```
