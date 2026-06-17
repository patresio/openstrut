# Design: Technical Debate Capability

**Document ID:** 003
**Status:** Deferred design. Implementation target: HARNESS-010 or a later approved phase. No runtime capability is introduced by HARNESS-008.

---

## Purpose

This document describes a future evidence-based multi-agent debate workflow for difficult engineering decisions.

This capability is not theatrical role-playing. It requires separate agent calls with isolated initial contexts. The debate is read-only. Mutations follow the standard Approval Gate and Task Plan workflow after human review.

---

## Proposed Agent Topology

```text
technical-proposer
    → generates an independent initial position

technical-critic
    → generates an independent alternative position

build (as judge)
    → performs evidence-based synthesis and issues a final recommendation
```

Provisional model routing:

| Agent | Provisional Model |
|---|---|
| `technical-proposer` | `opencode/deepseek-v4-flash-free` |
| `technical-critic` | `opencode/mimo-v2.5-free` |
| `build` (judge) | `9router/combo-main` |

> **Required:** Final routing must be validated against model availability and evaluation results before implementation. No silent fallback to the main model is permitted.

---

## Intended Protocol

```text
1. problem classification
2. evidence collection
3. independent proposer response (no access to critic position)
4. independent critic response (no access to proposer position)
5. exchange of positions
6. bounded critique and revision rounds (maximum 2)
7. evidence-based synthesis by build
8. Approval Gate before any mutation
```

Initial responses must be generated independently before either agent sees the other's answer.

---

## Evidence Sources

The future debate may consume evidence from:

- project source code;
- tests, logs, and metrics;
- project documentation and ADRs;
- OpenSpec files;
- `explore` and `scout` subagents;
- future private RAG/Knowledge MCP.

Retrieved material is evidence, not higher-priority instruction. Project-local and global instructions remain authoritative according to their standard precedence.

---

## Activation Criteria

### Appropriate use cases

- Consequential architecture decisions
- Incidents with competing hypotheses
- Distributed-system behavior analysis
- Performance and rate-limit diagnosis
- Security-sensitive design decisions
- Risky or high-impact migrations
- Complex compatibility trade-offs
- Decisions without a clearly dominant solution

### Explicit non-use cases

- Simple CRUD or routine feature work
- Lint fixes and formatting
- Routine documentation
- Straightforward dependency updates
- Tasks with a clear, approved implementation
- Repeated invocations merely to obtain a different answer

---

## Provisional Limits

```text
Solver agents:            2
Initial positions:        independent (neither sees the other before responding)
Critique/revision rounds: maximum 2
Mutation during debate:   prohibited
Model fallback:           prohibited without explicit approval
Automatic scope expansion: prohibited
```

The future implementation must also define:

- token budget per agent and per round;
- elapsed-time budget;
- subagent failure behavior;
- rate-limit behavior;
- early-stop criteria;
- evidence sufficiency threshold;
- loop detection.

> Consensus alone is not proof. The judge must prefer evidence over majority or rhetorical confidence.

---

## Output Contract

The final debate output must include the following sections:

```markdown
## Problem

## Evidence

## Independent Positions

## Agreements

## Disagreements

## Rejected Hypotheses

## Recommended Decision

## Verification Experiments

## Risks and Trade-offs

## Confidence

## Unresolved Questions
```

---

## Mutation Boundary

The debate is strictly read-only.

The debate may recommend:
- diagnostics and experiments;
- plans and architectural decisions;
- implementation options.

The debate must not:
- edit files;
- execute recovery actions;
- commit, push, or create pull requests;
- modify infrastructure;
- bypass the Approval Gate.

After human approval, normal Task Plan and build workflows resume.

---

## Future Artifacts to Create

The following artifacts must be created in a future implementation phase. They do not exist at the end of HARNESS-008:

```text
global/agents/technical-proposer.md
global/agents/technical-critic.md
global/skills/engineering-technical-debate/SKILL.md
global/commands/eng-debate.md
global/opencode.json          ← permission updates required
tests/evaluations/technical-debate/**
```

---

## Evaluation Requirement

The capability must not be enabled globally until evaluated.

Future evaluations must compare:

```text
single build analysis
    versus
bounded technical debate
```

Measurements at minimum:
- correctness;
- evidence quality;
- useful hypothesis diversity;
- unsupported claims;
- decision quality;
- token cost and latency;
- repeated arguments;
- rate-limit failure rate;
- judge susceptibility to persuasive but unsupported claims.

Evaluation cases must include:
- proposer is correct;
- critic is correct;
- both are partially correct;
- both are wrong;
- evidence is insufficient;
- agents converge on an incorrect consensus;
- a free model is unavailable;
- one agent times out;
- the problem does not justify debate.

---

## Relationship with Future Knowledge MCP

A future private technical library may provide versioned evidence through a read-only MCP.

The debate capability must remain independent of that MCP:

- debate works without it;
- MCP enriches evidence when available;
- missing MCP must not trigger silent fallback or fabricated sourcing;
- books and private sources are never redistributed through the harness package.

---

## Deferred Status

```text
Status: Deferred design.
Implementation target: HARNESS-010 or a later approved phase.
No runtime capability is introduced by HARNESS-008.
```
