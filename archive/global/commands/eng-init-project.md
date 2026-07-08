---
description: Initialize project-local engineering instructions.
agent: build
---

# Initialize Project

**Purpose:** Initialize project-local engineering instructions safely without duplicating global rules.

## Instructions
1. Load the `engineering-project-bootstrap` skill using your native skill tool.
2. Delegate the repository audit to the `project-rules-auditor` subagent to inspect existing rules and conventions.
3. Review the findings and propose a localized `AGENTS.md` structure. The selected template is a structural aid only: it must be populated from verified audit evidence, must not overwrite existing instructions, must not be copied verbatim, and must omit unsupported sections. Git and commit conventions must be evidence-backed and not imposed silently.
4. If prerequisites cannot be met, stop and provide a factual report.
5. Stop at the Approval Gate to present findings to the human operator.
6. Mutate and create files only after explicit human approval and the creation of a Task Plan.

**Context:** $ARGUMENTS
