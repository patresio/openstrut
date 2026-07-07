# OpenTrust Observability

## Principles

1. **Structured logging** — all agent output uses machine-readable format
2. **Traceability** — every decision links back to a task contract and evidence
3. **Minimal noise** — log what matters; suppress the rest
4. **Debuggable sessions** — session state is inspectable at any point

## Logging Levels

| Level | Usage | Example |
|-------|-------|---------|
| ERROR | Operation failures, blocked tasks | `[ERROR] validation failed: missing CTX reference` |
| WARN | Non-blocking issues, policy violations | `[WARN] agent exceeded approved selector scope` |
| INFO | Phase transitions, approvals, deliveries | `[INFO] Phase 1 complete: 10 files created` |
| DEBUG | Detailed step-by-step execution | `[DEBUG] writing agent prompt for review-lead` |
| TRACE | Retrieval queries and responses | `[TRACE] Knowledge: CTX14 → bundle B08 → synthesis 284b` |

## Log Format

```
[TIMESTAMP] [LEVEL] [TEAM] [AGENT] message {key=value, key=value}
```

Example:
```
[2026-07-07T14:30:00Z] [INFO] [architecture] [architecture-lead] ADR-014 approved {decision=cqrs, tradeoffs=3, duration=12m}
```

## Session Monitoring

Each OpenTrust session produces:

1. **Session log** — all agent output with timestamps
2. **Task Plan** — current state, evidence, blockers
3. **Retrieval audit trail** — every CTX/SK/BUNDLE/DOC query and its synthesis
4. **Permission audit** — every file access or command execution

## Debugging

### Common Issues

| Symptom | Likely Cause | Check |
|---------|-------------|-------|
| Agent ignores selectors | Missing or invalid CTX/BUNDLE in task contract | Verify contract retrieval section |
| Wrong synthesis | Wrong selector mapped | Check TEAM_CONTEXT_MATRIX.md |
| Permission denied | Agent not in opencode.jsonc permissions | Check agent entry in config |
| Retrieval failure | Provider unavailable | Check MCP_PROVIDER_CONTRACT.md fallback |

### Recovery

1. Check session log for ERROR/WARN entries
2. Verify Task Plan state and evidence
3. Check retrieval audit trail
4. Narrow scope to single microincrement
5. Report blocker with evidence

## Observability Artifacts

| Artifact | Location | Content |
|----------|----------|---------|
| Session log | `.opencode/logs/session-{id}.log` | Full agent output |
| Task Plan | `.opencode/task-plans/{task-id}.md` | State, evidence, blockers |
| Retrieval audit | `.opencode/logs/retrieval-{id}.log` | Every CTX/SK/B/DOC query |
| Permission audit | `.opencode/logs/permissions.log` | Every access or execution |
| Decision log | `docs/decisions/` | Architecture Decision Records |

## Retention

| Artifact | Retention |
|----------|-----------|
| Session logs | 90 days |
| Task Plans | Until archived |
| Retrieval audit | 30 days |
| Permission audit | 90 days |
| ADRs | Permanent |
