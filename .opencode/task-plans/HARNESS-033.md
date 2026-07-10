# HARNESS-033: Lead Workflow Governance — issue/PR/worktree/TDD gates

## Status
- [x] Explore
- [x] Proposal
- [x] Planning
- [x] Approval Gate (approved in conversation)
- [x] Build — MI1: shared leadership preflight in all leads
- [x] Build — MI2: role-specific leadership rules
- [x] Build — MI3: issue/PR/worktree criteria in global rules and commands
- [-] Build — MI4: permission hardening for lead roles (deferred; prompt hardening preferred per task plan)
- [x] Build — MI5: tests and validation
- [ ] Review
- [ ] Commit
- [ ] Push

## Objective
Close governance gaps found after HARNESS-032 so lead agents reliably lead instead of silently implementing.

Core outcomes:
1. Every lead asks/decides issue, branch, PR, and worktree need before mutation.
2. Every behavioral change routes through TDD-first RED evidence before implementation.
3. Worktree criteria are explicit and owned.
4. Issue/PR optionality is explicit for simple work.
5. Review checks implementation against issue + PR + TDD evidence.
6. Lead prompts no longer contain broad direct-implementation loopholes.

## Research Basis
Barsa MCP technology contexts used in prior audit:
- CTX03 governance
- CTX09 requirements
- CTX10 acceptance criteria
- CTX14 architecture decisions
- CTX15 domain modeling
- CTX16 distributed systems
- CTX19 CI/CD
- CTX20 infrastructure
- CTX23 team dynamics
- CTX24 performance
- CTX27 testing strategy
- CTX29 documentation

Applied principles:
- Small issues and small PRs reduce review cost and risk.
- Short-lived branches reduce integration risk.
- TDD-first builds quality into the work instead of inspecting it later.
- CI/CD and review gates prevent memory-based process skips.
- Issue/PR traceability links work to intent and acceptance criteria.
- Worktrees are for isolation, parallel work, and dirty-tree preservation, not default ceremony.
- Feedback should be actionable, accurate, appropriate, and adaptive.
- Trivial work can use fast path only when explicitly classified and confirmed.
- Agile/Scrum: leads facilitate, question, remove blockers, keep shared vision, and inspect/adapt.
- Kanban/Lean: visualize work, limit WIP, use small batches, reduce handoffs, expose blockers early.
- Scrum cadence: planning/refinement before work, daily-style progress checks during work, review/retro after work.

## Current Gaps

### Shared lead gaps
- All 9 leads have delegation sections.
- All 9 lack explicit issue/PR/worktree preflight.
- All 9 lack operational TDD-first routing.
- All 9 include broad direct-tool loophole for emergency/trivial work.

### Rule gaps
- No explicit criteria for when issue/PR is optional.
- No explicit owner for worktree decision.
- Review prompt does not explicitly verify issue + PR + TDD evidence.
- Delivery prompt assumes readiness rather than checking traceability.

## Decision Model

### Issue / Branch / PR

| Work type | Issue | Branch | PR |
|---|---:|---:|---:|
| New feature | required | required | required |
| Behavioral bugfix | required | required | required |
| Architecture/API/schema change | required | required | required |
| Large refactor | required | required | required |
| CI/CD/infra behavior change | required | required | required |
| Docs-only non-trivial | ask | branch recommended | PR recommended |
| Prompt/agent/skill behavior change | required | required | required |
| Tiny typo/comment/config | optional with confirmation | optional | optional |
| Incident containment | may defer issue until stable | branch if repo mutation | PR after containment if mutation remains |

### Worktree

Owner:
- `engineering-lead` decides worktree need for implementation.
- `trust-lead` validates if work crosses teams or parallel work exists.
- `delivery-lead` validates before commit/PR if branch/worktree state is safe.

Use worktree when:
- parallel independent work
- multiple agents may edit separate areas
- current branch has unrelated work
- risky refactor or broad change needs isolation
- long-running task may overlap another task
- user explicitly requests isolation

Do not use worktree when:
- single linear task
- clean branch
- tiny change
- no parallel writes
- no cross-team dependency

### Agile/Scrum-like lead cadence

This system should behave like a lightweight Scrum/Kanban team, not a single agent doing everything.

Before work — planning/refinement:
- clarify goal, issue need, acceptance criteria, definition of ready;
- slice work into small increments;
- identify required roles/subagents;
- set WIP limit: avoid parallel agent tasks unless independent and explicitly coordinated;
- define validation and definition of done.

During work — daily-style check:
- lead checks active delegated tasks;
- ask: what is done, what is next, what is blocked;
- escalate blockers immediately;
- avoid starting new work while blocked WIP exists;
- verify TDD/validation evidence as it appears, not only at the end.

After work — review/retro:
- compare result against issue/acceptance criteria;
- verify PR/diff/test evidence;
- capture follow-ups, process gaps, documentation gaps;
- improve workflow rules when repeated problems appear.

### Lead questioning pattern

Every lead should ask:
- Why is this needed?
- What outcome proves success?
- Is there an issue or should one be created?
- Is the work small enough?
- Who owns acceptance criteria?
- What must be tested first?
- Is a worktree needed for isolation?
- What can run in parallel safely?
- What is currently blocked?
- What evidence will close the loop?

### TDD-first

Behavioral changes:
1. Product/architecture/engineering lead identifies behavior.
2. Quality lead or `tdd-engineer` defines failing test.
3. RED evidence recorded.
4. Engineering implementation proceeds only after RED.
5. GREEN evidence recorded.
6. Review blocks without RED/GREEN evidence.

Exceptions:
- docs-only
- non-executable prompt text
- comments/formatting
- generated metadata
- explicitly approved spike

## Files to Modify

### MI1 — Shared leadership preflight in all leads
Files:
- `global/agents/trust-lead.md`
- `global/agents/product-lead.md`
- `global/agents/architecture-lead.md`
- `global/agents/engineering-lead.md`
- `global/agents/quality-lead.md`
- `global/agents/review-lead.md`
- `global/agents/devops-lead.md`
- `global/agents/delivery-lead.md`
- `global/agents/knowledge-lead.md`

Add common sections:

```md
## Workflow Preflight
Before any mutation:
1. Classify the task.
2. Ask or decide whether issue, branch, PR, and worktree are required.
3. Record the decision and reason in the Task Plan.
4. Confirm acceptance criteria and definition of done.
5. For behavioral work, require TDD RED evidence before implementation.
6. Delegate execution to the appropriate subagent; do not implement substantive changes directly.
7. If fast path is appropriate, confirm explicitly and keep scope tiny.

## Leadership Cadence
For delegated work:
1. Plan: clarify goal, ready criteria, owners, WIP, validation.
2. Track: check active tasks for done/next/blockers.
3. Verify: inspect evidence before marking work complete.
4. Adapt: capture follow-ups and process gaps after review.
```

Add questioning checklist:
```md
Ask: why now, what proves success, issue needed, PR needed, worktree needed, who owns test, what is blocked, what evidence closes this?
```

Replace broad loophole:

Old:
```md
Only use tools directly for emergency fixes or trivial changes that don't warrant delegation.
```

New:
```md
Use tools directly only for read-only inspection, coordination notes, or explicitly approved trivial fast-path work. Do not implement substantive changes directly.
```

### MI2 — Role-specific leadership rules

#### `trust-lead`
Add:
- Owns cross-team workflow classification.
- Ensures issue/branch/PR/worktree decisions exist before mutation.
- Delegates to product/architecture/engineering/quality/review/delivery leads.

#### `product-lead`
Add:
- Owns requirements, acceptance criteria, issue readiness.
- If issue is required and missing, draft issue content before implementation.

#### `architecture-lead`
Add:
- Owns architecture decision requirement.
- Routes architecture-affecting implementation to engineering + quality.
- Does not implement architectural changes directly.

#### `engineering-lead`
Add:
- Owns branch/worktree implementation strategy.
- Requires RED evidence before behavioral implementation.
- Delegates implementation to `feature-implementer`, `code-refactoring-specialist`, etc.

#### `quality-lead`
Add:
- Owns TDD gate.
- Produces/verifies RED and GREEN evidence.
- Blocks implementation/review when TDD evidence missing.

#### `review-lead`
Add:
- Verifies issue/PR/worktree decision evidence.
- Verifies implementation matches issue acceptance criteria and PR scope.
- Verifies RED/GREEN evidence for behavioral changes.

#### `devops-lead`
Add:
- Owns CI/CD, infra, operational validation strategy.
- Requires issue/branch/PR for non-trivial infra or CI changes.
- Uses worktree for isolated infra experiments or parallel CI work.

#### `delivery-lead`
Add:
- Owns commit/PR/merge readiness.
- Checks issue link, branch name, validation evidence, review approval.
- Does not open PR unless explicitly requested/approved.

#### `knowledge-lead`
Add:
- Owns documentation/retrieval traceability.
- If prompt/skill/doc mutation is non-trivial, require issue/branch/PR decision.
- Synthesizes; does not directly implement prompt/skill changes unless explicitly trivial and approved.

### MI3 — Global rules and commands

#### `global/AGENTS.md`
Add concise decision criteria:
- issue/branch/PR table or short rules
- worktree owner and criteria
- TDD gate owner/evidence rule
- fast path rule

Keep AGENTS.md basic: no skill references, no agent-specific instructions.

#### `global/commands/ot-apply.md`
Ensure Apply phase says:
- verify issue/branch/PR/worktree decisions before mutation
- verify RED evidence before behavioral production code

#### `global/commands/ot-review.md`
Ensure Review phase checks:
- issue linkage
- PR scope if present
- TDD evidence
- worktree/branch safety

#### `global/commands/ot-ship.md`
Ensure Ship phase checks:
- commit/PR only if explicitly requested/approved
- PR links issue if issue exists
- merge only after passing checks and review approval

### MI4 — Permission hardening

Review only; change permissions only if clear and safe.

Candidates:
- `engineering-lead`: keep edit perms? If lead should not implement, consider making edit deny or scoped to task plans only.
- `quality-lead`: broad `bash: allow`; consider limiting to test commands.
- `devops-lead`: broad `bash: allow`; consider diagnostics/CI commands only.

Default decision:
- Prefer prompt hardening first.
- Do not reduce permissions if it would block intended lead coordination or validation.
- Record permission changes only if tests support them.

### MI5 — Tests and validation

Validation commands:
- `npm test`
- `npm run eval:deterministic`
- `npm pack --dry-run --ignore-scripts`

Static checks:
- All 9 leads contain `## Workflow Preflight`.
- No lead contains the old broad loophole text.
- `global/AGENTS.md` has issue/PR/worktree/TDD fast-path rules.
- No new agents/skills/commands created unless separately approved.

## Acceptance Criteria
- [x] All 9 leads have shared Workflow Preflight.
- [x] All 9 leads have Leadership Cadence for planning, tracking, verification, adaptation.
- [x] All 9 leads include questioning checklist for goal, success, issue/PR/worktree/TDD/blockers/evidence.
- [x] All 9 leads have role-specific issue/PR/worktree/TDD leadership rules.
- [x] Leads no longer encourage direct implementation.
- [x] AGENTS.md remains concise/basic and does not mention skills or specific agents.
- [x] Commands enforce issue/branch/PR/TDD checks at apply/review/ship.
- [x] Worktree decision owner and criteria are explicit.
- [x] `npm test` passes.
- [x] Deterministic eval passes.
- [x] Package dry-run passes.

## Evidence
- Static check: 9/9 leads contain `## Workflow Preflight`.
- Static check: 9/9 leads contain `## Leadership Cadence`.
- Static check: 9/9 leads contain `## Questioning Checklist`.
- Static check: old broad direct-tool loophole removed from leads.
- Validation: `npm test` passed 238/238.
- Validation: `npm run eval:deterministic` passed.
- Validation: `npm pack --dry-run --ignore-scripts` passed.
- Review: code-reviewer found no content blockers; task-plan ledger issues fixed.

## Out of Scope
- Creating new subagents (`workflow-governance-auditor`, `issue-pr-coordinator`).
- Creating new skills or commands.
- Opening GitHub issues/PRs.
- Changing release version or changelog.
- Pushing branch.

## Current State
Build complete. Validation complete. Review complete after fixing ledger accuracy. Ready for commit approval.

## Next Action
Inspect final diff and create micro commits for HARNESS-033 changes.
