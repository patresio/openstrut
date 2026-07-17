# opentrust-grilling

## When to Use

Use before every non-trivial change. The grilling pattern exhausts the decision tree before implementation begins. Prevents the #1 failure mode: misalignment.

## Workflow

1. **Receive request** — understand the surface intent
2. **One question at a time** — never batch questions
3. **Facts looked up by agent** — use Barsa MCP (`search`, `ask`) for reference material
4. **Decisions deferred to human** — agent recommends, human decides
5. **Recommended answers** — each question includes a suggested answer with rationale
6. **Exit condition** — when all decision branches are resolved, produce a summary

## Interview Structure

### Round 1: Scope
- What is the expected outcome?
- What is explicitly out of scope?
- What are the constraints (time, dependencies, compatibility)?

### Round 2: Approach
- What patterns or conventions should be followed?
- What existing code/design should be referenced?
- What are the trade-offs between alternatives?

### Round 3: Validation
- How will we know this is done correctly?
- What tests are needed?
- What could go wrong and how do we mitigate?

### Round 4: Delivery
- What is the smallest viable increment?
- What is the commit/PR strategy?
- Are there migration or rollback concerns?

## Rules

- Never skip a round
- Never ask more than one question at a time
- Always provide a recommended answer
- Record all decisions in the task contract
- If the human says "use your judgment" — record the decision and proceed
- Use Barsa MCP for any reference lookups (CTX/SK/B selectors)

## Output

A completed grilling session produces:
- Clear scope with in/out boundaries
- Approved approach with trade-offs documented
- Acceptance criteria
- Risk mitigations
- Ready for Propose phase

## References

- CTX03 (governance), CTX17 (implementation)
- `opentrust-task-contract` — for formalizing grilling output
- `opentrust-spec-change` — for turning grilling results into specs
