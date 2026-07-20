# opentrust-reference-research

Use Operational Retrieval Map selectors. Request synthesis only. No raw chunks in output or commits.

## When to Use

- Researching OpenTrust context
- Finding relevant CTX/B selectors
- Synthesizing knowledge from retrieval system

## Workflow

1. **Identify selectors** — Determine which CTX/B selectors are needed
2. **Request synthesis** — Get synthesized summary, not raw chunks
3. **Cite sources** — Include source IDs in output
4. **Apply to task** — Use synthesis to inform work

## Selector Categories

### Contexts (CTX01-32)
Knowledge domains that define operational areas.

| Selector | Domain |
|----------|--------|
| CTX01 | OpenTrust foundation |
| CTX02 | Reference library management |
| CTX03 | Operational retrieval map |
| CTX14 | Architecture decisions |
| CTX17 | Engineering workflow |
| CTX23 | Task contracts |
| CTX27 | Testing strategy |

### Bundles (B01-24)
Grouped sets of contexts for common task types.

| Selector | Bundle |
|----------|--------|
| B01 | Foundation |
| B08 | Architecture-core |
| B11 | Engineering |
| B17 | Testing |

### Skills (SK01-39)
Semantic procedure maps that describe reusable methods.

| Selector | Skill |
|----------|-------|
| SK01 | opentrust-task-contract |
| SK03 | opentrust-reference-research |
| SK08 | architecture-decision |
| SK09 | domain-modeling |

## Retrieval Rules

1. **Synthesize only** — No raw chunks in output
2. **Cite source IDs** — Include CTX/B/SK/DOC IDs
3. **No raw book content** — Summarize, don't quote
4. **Use approved selectors** — Only from task contract

## Examples

### Research Request

```markdown
I need to understand architecture decisions for this task.

Required selectors:
- CTX14 (Architecture decisions)
- B08 (Architecture-core)
- SK08 (architecture-decision)

Please synthesize relevant context from these selectors.
```

### Synthesis Response

```markdown
## Architecture Decision Context

Based on CTX14 and B08, here are the key architectural principles:

1. **Evidence before decision** — Every gate requires demonstrable evidence
2. **Approval before mutation** — No code changes without explicit plan approval
3. **Smallest viable increment** — Microincrements, not monoliths

For this task, you should:
- Create an ADR before implementation
- Get approval before code changes
- Work in small, validated increments

Source: CTX14, B08, SK08
```

## Anti-Patterns

❌ Don't:
- Dump raw chunks from retrieval system
- Include internal library names in commits
- Skip source citations
- Use selectors not in task contract

✅ Do:
- Synthesize into actionable summaries
- Cite source IDs (CTX, B, SK, DOC)
- Keep output concise and relevant
- Use only approved selectors from task contract
