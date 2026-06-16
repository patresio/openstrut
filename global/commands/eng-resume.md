---
description: Resume an already approved mutating task.
agent: build
---

# Resume Engineering Task

**Purpose:** Resume execution of an already approved mutating task by loading its active Task Plan.

## Instructions
1. Load the `engineering-task-plan` skill using your native skill tool.
2. Locate and read the active Task Plan for the current work.
3. Verify the objective, scope, approval evidence, current state, next action, Git state, and existing diff.
4. Continue execution only from the next factual unchecked action.
5. Stop and provide a factual report if:
   - no active Task Plan exists;
   - scope changed materially;
   - approval is invalid or missing;
   - Git state is unsafe;
   - the next action cannot be proven from evidence.
6. Do not ask for approval again when the existing approval remains valid.
7. Preserve global and project-local instructions.

**Task Context:** $ARGUMENTS
