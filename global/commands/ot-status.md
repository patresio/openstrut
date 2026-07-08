---
description: Summarize branch, diff, current task, pending validation and next step
agent: trust-lead
---

# Status Command

**Purpose:** Summarize current state: branch, diff, active task, pending validation, and next step.

## Instructions

1. Read WORKFLOW.md from installed `opentrust/docs/` if phase context is needed.
2. Inspect current Git state: branch, diff, log.
3. Identify active Task Plan if any.
4. Summarize:
   - Current phase and workflow state
   - Active task and approved scope
   - Completed steps and evidence
   - Pending validation and blockers
   - Next step and requirements
5. Do not mutate anything.
6. Do not call the retrieval provider — status is read-only local evidence synthesis.

## Input Format

```
ot-status
```

## Workflow Step

Read-only status summary.

## Expected Output

Status Report:

```
[BRANCH]
Name: <branch-name>
Remote: <tracking status>
Diff: <clean/dirty + file count>

[TASK]
Active: <task-id or none>
Phase: <Explore | Propose | Apply | Review | Ship>
Status: <pending | in-progress | blocked | complete>

[EVIDENCE]
Approved: <yes/no>
TDD-RED: <recorded/unrecorded>
TDD-GREEN: <recorded/unrecorded>
Tests: <pass/fail>
Review: <pending/approved/blocking>

[BLOCKERS]
<none or list>

[NEXT]
<exactly one next action with requirements>
```
