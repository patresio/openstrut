# opentrust-handoff

## When to Use

When a conversation needs to continue in a new session (context window limits, session end, or handing off to another agent). Produces a compact handoff document that captures everything needed to resume work.

## Workflow

1. **Summarize objective** — what are we trying to achieve?
2. **List completed work** — what has been done so far?
3. **List pending work** — what remains?
4. **Record decisions** — what choices were made and why?
5. **Identify blockers** — what is preventing progress?
6. **Suggest next steps** — what should the next session start with?
7. **Suggest skills** — which skills are relevant for continuing?
8. **Redact secrets** — remove API keys, tokens, passwords
9. **Save to temp** — write to os.tmpdir() with timestamp

## Handoff Format

```markdown
# Handoff: [Task Title]
- Date: [ISO timestamp]
- Session: [identifier]

## Objective
[What we're trying to achieve]

## Completed
- [x] [item 1]
- [x] [item 2]

## Pending
- [ ] [item 3]
- [ ] [item 4]

## Decisions Made
1. [Decision] — [Rationale]
2. [Decision] — [Rationale]

## Blockers
- [Blocker 1]

## Suggested Next Steps
1. [Step 1]
2. [Step 2]

## Relevant Skills
- [skill-name] — [why]

## Context
[Any additional context needed to resume]
```

## Rules

- Never include secrets, tokens, or API keys
- Keep under 2000 tokens — compact, not exhaustive
- Include file paths and line numbers for code references
- Reference task plan ID if one exists
- Include git branch and status if relevant
- The handoff is a starting point, not a complete history

## Output

- Handoff document saved to `os.tmpdir()`
- Path reported to user
- Suggested skills listed for continuation

## References

- CTX01 (knowledge management)
- `opentrust-task-contract` — for task context
- `opentrust-grilling` — for resuming interview-driven work
