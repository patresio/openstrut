# HARNESS-034: Governance Subagents — workflow-governance-auditor + issue-pr-coordinator

## Status
- [x] Explore
- [x] Proposal
- [x] Planning
- [x] Approval Gate (approved in conversation)
- [ ] Build — MI1: create workflow-governance-auditor agent
- [ ] Build — MI2: create issue-pr-coordinator agent
- [ ] Build — MI3: update leads and inventory
- [ ] Build — MI4: tests and validation
- [ ] Review
- [ ] Commit
- [ ] Push

## Objective

Create 2 specialized subagents for workflow governance and delivery coordination, completing the OpenTrust topology after HARNESS-032 and HARNESS-033.

**workflow-governance-auditor**: Audits system docs, prompts, rules, selectors for gaps; opens issues with proposals.

**issue-pr-coordinator**: Opens branches from issues, creates PRs, ensures issue↔PR linking, tracks merge status.

These agents were originally proposed in HARNESS-032 but deferred to separate task plan.

## Decision Model

### workflow-governance-auditor

**Team:** Review / Governance
**Reports to:** review-lead
**Like:** compliance-auditor + code-reviewer, but workflow-focused

**Mission:** Audit OpenTrust/OpenCode runtime, find gaps, propose fixes via issues.

**Responsibilities:**
- Read prompts, AGENTS.md, commands, skills, docs
- Check for gaps: missing rules, selector inconsistencies, prompt drift
- Identify what should be changed
- Create or suggest GitHub issues with proposal

**Boundaries:**
- Does not implement changes directly
- Does not mutate files
- Does not approve or merge
- Reports findings as issues; leads/review decides action

**Model/Temp:** combo-main / 0.3 (analysis + proposals)

### issue-pr-coordinator

**Team:** Delivery / Release
**Reports to:** delivery-lead
**Like:** release-manager, but focused on issue→branch→PR→merge flow

**Mission:** Coordinate issue lifecycle through branches and PRs.

**Responsibilities:**
- Create branches from issues (with approval)
- Open PRs linking issues
- Ensure PR scope matches issue acceptance criteria
- Track PR status, blockers, merge readiness
- Update issue with PR link

**Boundaries:**
- Does not implement code changes
- Does not approve PRs or code
- Only opens PR/branches with explicit approval
- Inherits delivery-lead's safety rules: `git push ask`, no commit without approval

**Model/Temp:** opencode/big-pickle / 0.1 (coordination, high precision)

## Files to Create / Modify

### New Files
- `global/agents/workflow-governance-auditor.md` — ~60 lines
- `global/agents/issue-pr-coordinator.md` — ~60 lines

### Modified Files
- `global/agents/review-lead.md` — add workflow-governance-auditor to Delegation section
- `global/agents/delivery-lead.md` — add issue-pr-coordinator to Delegation section
- `src/installer/inventory.js` — add 2 entries (69 → 71 artifacts, 38 → 40 agents)
- `tests/installer/installer.test.js` — update agent count assertions (38 → 40)
- `evals/cases/deterministic.js` — update artifact count (69 → 71)
- `global/opentrust/docs/TEAM_TOPOLOGY.md` — add new subagent roles

## Acceptance Criteria
- [x] Objective documented
- [x] workflow-governance-auditor.md created with proper frontmatter, mission, scope, delegation
- [x] issue-pr-coordinator.md created with proper frontmatter, mission, scope, delegation
- [x] review-lead.md lists workflow-governance-auditor in Delegation
- [x] delivery-lead.md lists issue-pr-coordinator in Delegation
- [x] inventory.js has 2 new entries (71 artifacts total, 40 agents)
- [x] installer test updated (40 agents)
- [x] deterministic eval updated (71 artifacts)
- [x] TEAM_TOPOLOGY.md updated with new roles
- [x] npm test passes (238/238)
- [x] npm run eval:deterministic passes
- [x] npm pack --dry-run passes
- [x] No permission issues
- [x] No reference profile conflicts

## Microincrements

### MI1: Create workflow-governance-auditor agent

File: `global/agents/workflow-governance-auditor.md`

Content:
- Frontmatter: description, model: combo-main, temperature: 0.3, permissions (read-heavy, minimal task)
- Mission section
- Use When
- Inputs/Outputs
- No delegation (leaf agent)
- Workflow Preflight / Leadership Cadence / Questioning Checklist — NO, this is a subagent
- Role description (focused on governance audit)
- Reference Profile (CTX03, CTX14, CTX29, etc.)
- Boundaries

### MI2: Create issue-pr-coordinator agent

File: `global/agents/issue-pr-coordinator.md`

Content:
- Frontmatter: description, model: big-pickle, temperature: 0.1, permissions (git push ask, task ask)
- Mission section
- Use When
- Inputs/Outputs
- No delegation (leaf agent)
- Role description (issue→branch→PR coordination)
- Reference Profile
- Boundaries (explicit approval requirement)

### MI3: Update leads

- review-lead.md: add workflow-governance-auditor to Delegation list
- delivery-lead.md: add issue-pr-coordinator to Delegation list

### MI4: Update inventory and tests

- inventory.js: add 2 entries
- installer.test.js: update count assertions
- deterministic.js: update count
- TEAM_TOPOLOGY.md: add new roles

### MI5: Validate

- npm test
- npm run eval:deterministic
- npm pack --dry-run

## Out of Scope
- New skills or commands
- Permission hardening beyond what's in agent frontmatter
- Changes to existing agent behavior
- Release/changelog

## Evidence
- [x] `global/agents/workflow-governance-auditor.md` created and well-formed.
- [x] `global/agents/issue-pr-coordinator.md` created and well-formed.
- [x] `global/agents/review-lead.md` and `global/agents/delivery-lead.md` list the new subagents.
- [x] Inventory now contains 71 artifacts and 40 agents.
- [x] `npm test` passed 238/238.
- [x] `npm run eval:deterministic` passed.
- [x] `npm pack --dry-run --ignore-scripts` passed.

## Current State
Build complete. Validation complete. Ready for final diff review and commit.

## Next Action
Inspect git diff, then commit HARNESS-034 changes.
