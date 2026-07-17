# opentrust-domain-modeling

## When to Use

When project terminology is fuzzy, inconsistent, or evolving. Maintains a living glossary (GLOSSARY.md) as the single source of truth for domain language.

## Workflow

1. **Identify fuzzy terms** — words used differently by different people or in different contexts
2. **Challenge the term** — ask "what exactly do you mean by X?"
3. **Stress-test with edge cases** — "does this definition hold when Y happens?"
4. **Propose definition** — clear, concise, unambiguous
5. **Update GLOSSARY.md** — inline during the conversation
6. **Offer ADR** — only when the definition has architectural implications

## ADR 3-Gate

Only create an Architecture Decision Record when ALL three criteria are met:

1. **Hard to reverse** — changing this later would be expensive
2. **Surprising** — the decision is not obvious to a competent developer
3. **Real trade-off** — there are genuine alternatives with different pros/cons

If any criterion is not met, just update the glossary.

## Glossary Format

```markdown
# GLOSSARY.md

## Term: [Name]
- **Definition**: [Clear, concise definition]
- **Context**: [Where this term is used]
- **Related**: [Related terms, see also]
- **Decision**: [ADR-XXX if applicable, or "no ADR needed"]
- **Last Updated**: [Date]
```

## Rules

- One definition per term — no synonyms in the glossary
- Definitions must be testable — "does X satisfy this definition?"
- Prefer existing industry terms over neologisms
- When terms conflict with external usage, note the divergence
- Update glossary inline — don't defer to "later"
- Reference Barsa MCP for industry-standard definitions

## Output

- Updated GLOSSARY.md with new/modified terms
- ADR (only if 3-gate is met)
- Clear domain model that agents and humans share

## References

- CTX15 (domain modeling)
- `opentrust-spec-change` — for formalizing domain decisions
- `opentrust-grilling` — for interview-driven domain discovery
