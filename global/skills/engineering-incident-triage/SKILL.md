---
name: engineering-incident-triage
description: Diagnose, contain, and recover from urgent failures using evidence, minimal safe actions, rollback awareness, loop prevention, and factual status reporting.
compatibility: opencode
---

## Purpose
Safely and systematically diagnose and recover from urgent production or build failures without causing further damage through blind mutation or speculation.

## When to Load
- When a build, deployment, or system fails unexpectedly and urgently.
- When tasked with triage or recovery of an active incident.

## Do Not Load When
- Diagnosing a routine test failure during normal TDD cycles.
- Performing routine maintenance.

## Required Inputs
- The failure report, alert, or observable symptom.

## Procedure
1. Establish the severity and affected scope.
2. Capture evidence (logs, traces, metrics) and establish a timeline.
3. Separate symptoms from hypotheses.
4. Identify and propose the smallest safe containment action. Execute a mutating containment action only when it is explicitly authorized. Read-only diagnosis may continue without mutation.
5. Identify rollback or recovery options immediately.
6. Select the smallest safe diagnostic to test a hypothesis.
7. Change the hypothesis before retrying; do not repeat equivalent failed attempts.
8. After three equivalent unsuccessful attempts, or earlier when evidence shows that progress is blocked, stop mutation and request the smallest required human decision.
9. Implement the smallest approved recovery action.
10. Validate the recovery using the original evidence source.
11. Create regression protection (e.g., a test) after stabilization whenever feasible.
12. Record residual risk and any follow-up work required in the Task Plan.
13. Emergency containment may precede full test-first execution only when the specific mutating action is explicitly authorized and automated reproduction is impractical. Record the action, authorization, evidence, and reason for the exception.

## Required Evidence
- Captured logs, metrics, or output demonstrating the failure.
- Evidence of successful recovery or rollback.
- Documented hypotheses and test results.

## Stop Conditions
- Stop if recovery requires broad speculative changes or destructive cleanup without evidence.
- Stop and do not perform blind restarts.
- Stop if there is a silent environment or model fallback.
- Stop if attempting to declare recovery based on a weaker or unrelated check.
- Stop if you are caught in a failure loop.

## Output
- A contained or recovered system state when successful; otherwise, a factual blocked-state report with evidence and the smallest required decision.
- A factual incident status report, residual risks, and regression protection when feasible.

## Interactions
- Follow-up work is recorded in `engineering-task-plan`.
- May trigger `engineering-tdd-first` to build regression protection once stabilized.
