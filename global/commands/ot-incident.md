---
description: Diagnose incident/failure; collect evidence; propose fix; validate resolution
agent: devops-lead
---

# Incident Command

**Purpose:** Diagnose incident or failure; collect evidence; propose fix; validate resolution.

## Instructions

1. Load `docs/opencode/WORKFLOW.md`.
2. Load project `docs/observability.md` if exists.
3. Classify failure type: runtime, test, build, deployment, or configuration.
4. Collect evidence: logs, stack traces, test output, system state.
5. Propose minimal safe fix with rollback plan.
6. Validate resolution: run tests, verify behavior.
7. Document incident and lessons learned.

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
