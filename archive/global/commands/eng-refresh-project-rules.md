---
description: Refresh an existing project-local AGENTS.md.
agent: build
---

# Refresh Project Rules

**Purpose:** Refresh existing project-local engineering instructions safely.

## Instructions
1. Load the `engineering-project-bootstrap` skill using your native skill tool.
2. Audit stale, duplicated, missing, or conflicting instructions using the existing project file as the baseline.
3. Use the template only to identify potentially missing categories. Preserve valid project-specific rules. Git and commit conventions must be evidence-backed and not imposed silently.
4. Produce a focused proposal and diff. Never replace the existing file wholesale merely to match the template.
5. If prerequisites cannot be met, stop and provide a factual report.
6. Stop at the Approval Gate to present your proposed changes to the human operator before any mutation.

**Context:** $ARGUMENTS
