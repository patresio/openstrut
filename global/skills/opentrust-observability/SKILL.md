---
name: opentrust-observability
description: Require execution reports, validation evidence, and operational notes. Do not implement external telemetry yet.
---

## When to Use This Skill

When work requires traceability, decision logging, or deployment evidence.

## Workflow

1. Record the task plan state, current phase, and evidence for each step.
2. Log decisions with rationale and alternatives considered.
3. Capture validation output (test pass/fail, lint, type-check).
4. After delivery, archive task plan knowledge to canonical documentation.
5. Report unresolved risks and follow-up work.

## Output

- Execution report with timestamps and evidence
- Decision log entries
- Validation summary

## Rules

- Do not implement external telemetry, dashboards, or monitoring agents.
- Use structured logging: `[LEVEL] [TEAM] [AGENT] message {key=value}`.
- Reference `docs/opencode/OBSERVABILITY.md`.
