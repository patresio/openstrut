---
description: Orchestrate an independent code review before delivery.
agent: build
---

# Engineering Review

**Purpose:** Orchestrate an independent code review before delivery.

## Instructions
1. Verify that implementation and focused validation are complete.
2. Load the `engineering-code-review` skill using your native skill tool.
3. Delegate the bounded independent review to the `code-reviewer` subagent.
4. Classify the resulting findings.
5. Stop and do not perform delivery if blocking findings remain.
6. Do not create a repeated review loop without material changes.
7. Preserve global and project-local instructions.
8. If prerequisites cannot be met, stop and provide a factual report.

**Review Context:** $ARGUMENTS
