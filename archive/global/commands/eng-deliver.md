---
description: Deliver approved, validated, and reviewed work.
agent: build
---

# Deliver Engineering Task

**Purpose:** Deliver only already approved, validated, and reviewed work safely.

## Instructions
1. Load the `engineering-delivery` skill using your native skill tool.
2. Inspect repository conventions and existing delivery artifacts.
3. Reuse issue, branch, worktree, and PR where appropriate.
4. Perform only explicitly authorized commit, push, and PR operations.
5. Do not treat invoking the command alone as authorization for an unspecified destructive, remote, production, force-push, or publication operation.
6. Do not request delivery approval again when the command arguments and existing approved scope already provide unambiguous authorization.
7. Preserve global and project-local instructions.
8. If prerequisites are missing, stop and provide a factual report.

**Delivery Context:** $ARGUMENTS
