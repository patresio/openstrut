---
description: Update the active Task Plan with factual current evidence.
agent: build
---

# Checkpoint Engineering Task

**Purpose:** Update the active Task Plan of an already approved task with factual progress evidence.

## Instructions
1. Inspect the active Task Plan, global instructions, and project-local instructions.
2. Record completed steps, failures, deviations, blockers, current state, and exactly one next action in the Task Plan based on factual evidence.
3. Mutate only the active Task Plan. Do not make production-code or delivery changes.
4. Do not fabricate progress or pre-check future steps.
5. If prerequisites are missing (e.g., no active Task Plan or missing approval), stop and provide a factual report.

**Checkpoint Context:** $ARGUMENTS
