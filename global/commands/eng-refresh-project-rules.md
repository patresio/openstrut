---
description: Refresh an existing project-local AGENTS.md.
agent: build
---

# Refresh Project Rules

**Purpose:** Refresh existing project-local engineering instructions safely.

## Instructions
1. Load the `engineering-project-bootstrap` skill using your native skill tool.
2. Audit stale, duplicated, missing, or conflicting instructions in the existing project instructions.
3. Preserve valid project-specific rules, ensuring global instructions are preserved and not overridden.
4. If prerequisites cannot be met, stop and provide a factual report.
5. Stop at the Approval Gate to present your proposed changes to the human operator before any mutation.

**Context:** $ARGUMENTS
