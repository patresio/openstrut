---
description: Refine a vague idea into a clear, actionable task contract
agent: product-lead
---

# Synthetize Command

**Purpose:** Transform a vague user description into a refined, actionable task contract through structured questioning, gap analysis, and documentation alignment.

## Instructions

1. Read WORKFLOW.md and TASK_CONTRACT.md from installed `opentrust/docs/`.
2. Load `opentrust-grilling` skill pattern (4-round structured interview).
3. Receive the user's idea/description.
4. Classify the request: question, exploration, planning, implementation, bugfix, refactoring, review, delivery, or incident.
5. Run the 4-round interview — one question at a time, never skip a round:
   - **Round 1: Scope** — expected outcome, explicit exclusions, constraints (time, dependencies, compatibility)
   - **Round 2: Approach** — patterns/conventions, existing code/design to reference, trade-offs between alternatives
   - **Round 3: Validation** — success criteria, tests needed, risks and mitigations
   - **Round 4: Delivery** — smallest viable increment, commit/PR strategy, migration/rollback concerns
6. Each question must include a recommended answer with rationale. Agent recommends; human decides.
7. If user says "use your judgment" — record the decision and proceed.
8. After all rounds resolve, perform **Gap Analysis**: identify what is missing between user intent and current repository state.
9. Perform **Documentation Check**: suggest documentation updates needed (specs, ADRs, runbooks, README).
10. Produce a **Task Contract draft** using TASK_CONTRACT.md structure.
11. List clear **Next Steps** (e.g. approve contract, run `ot-explore`, open issue).
12. Do not implement, commit, or mutate production code.
13. Synthesize only — no raw chunks in output. Cite source IDs (CTX, SK, B, DOC) when available.
14. Do not call the retrieval provider unless selectors are required for gap analysis; prefer local catalog and repo evidence.

## Input Format

```
ot-synthetize <idea-description>
```

## Workflow Step

Pre-Explore / Idea Refinement (Read Only) — feeds Explore and Propose.

| Aspect | Rule |
|--------|------|
| Allowed | questioning, reading, searching, gap analysis, drafting task contract |
| Forbidden | implementation, branch changes, commits, production mutation |
| Retrieval | May identify needed CTX/BUNDLE/SK/DOC selectors; synthesize only |
| Output | Refined task contract draft + next steps |

## Rules

- One question at a time (from `opentrust-grilling`)
- Always provide a recommended answer with rationale
- Never skip a round
- Record all decisions
- If user says "use your judgment" — record decision and proceed
- Synthesize only — no raw chunks in output
- Cite source IDs when available
- Use only approved selectors when retrieval applies

## Expected Output

- Refined scope with in/out boundaries
- Approved approach with trade-offs documented
- Acceptance criteria
- Risk mitigations
- Task contract draft
- Documentation suggestions
- Clear next steps

## Execution Report

```
[IDEA]
Original: <user's original description>
Refined: <clarified understanding>
Classification: <question | exploration | planning | implementation | bugfix | refactoring | review | delivery | incident>

[SCOPE]
In Scope: <list>
Out of Scope: <list>
Constraints: <list>

[APPROACH]
Pattern: <chosen approach>
Trade-offs: <documented>
Existing References: <related code/design>

[VALIDATION]
Success Criteria: <list>
Tests Needed: <list>
Risks: <list with mitigations>

[DELIVERY]
Smallest Increment: <description>
Commit Strategy: <plan>
Migration Concerns: <none / list>

[GAPS]
Missing: <what's missing between intent and current state>
Documentation: <suggested updates>

[SELECTORS]
CTX: <needed contexts or none>
SK: <needed skills or none>
B: <needed bundles or none>
DOC: <needed docs or none>

[TASK CONTRACT]
# Task: <Title>

## Objective
<what and why>

## Acceptance Criteria
- [ ] <criterion>

## Scope
### In Scope
- <item>
### Out of Scope
- <item>

## Retrieval Context
Required contexts: <list or none>
Required bundles: <list or none>
Required skills: <list or none>
Official docs: <list or none>
Provider: local-context-catalog | none
Policy: synthesize-only; no raw chunks; cite source IDs; approved selectors only

## Definition of Done
- [ ] Acceptance criteria met
- [ ] Tests pass
- [ ] Review approved
- [ ] Documentation updated
- [ ] Committed with conventional commit message

[NEXT]
<clear action items — e.g. approve contract, ot-explore, open issue>
```
