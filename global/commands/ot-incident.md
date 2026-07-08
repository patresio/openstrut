---
description: Diagnose incident/failure; collect evidence; propose fix; validate resolution
agent: devops-lead
---

# Incident Command

**Purpose:** Diagnose incident or failure; collect evidence; propose fix; validate resolution.

## Instructions

1. Read WORKFLOW.md from installed `opentrust/docs/` for incident procedure.
2. Classify failure type: runtime, test, build, deployment, or configuration.
3. Collect local evidence: logs, stack traces, test output, system state.
4. Propose minimal safe fix with rollback plan.
5. Validate resolution: run tests, verify behavior.
6. Document incident and lessons learned.
7. Do not call the retrieval provider — focus on local diagnostics first.

## Input Format

```
ot-incident <description>
```

## Workflow Step

Incident triage and recovery.

## Expected Output

Incident Report:

```
[INCIDENT]
Type: <runtime | test | build | deployment | config>
Severity: <low | medium | high | critical>
Status: <diagnosed | in-progress | resolved>

[EVIDENCE]
Logs: <summary>
Test Output: <summary>
System State: <description>
Timeline: <events>

[ANALYSIS]
Root Cause: <hypothesis>
Affected Code: <files>
Regression Risk: <low | medium | high>

[PROPOSAL]
Fix: <minimal safe change>
Rollback: <recovery steps>
Validation: <tests to run>

[RESOLUTION]
Tests: <pass/fail>
Behavior: <verified/unverified>
Next: <monitor | commit | revert>

[LESSONS]
Prevention: <recommendations]
Detection: <improvements needed]
```
