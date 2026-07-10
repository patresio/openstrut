# HARNESS-032: Config Optimization — slim opencode.json, agent frontmatter, AGENTS.md

## Status
- [x] Explore
- [x] Proposal
- [x] Planning
- [x] Approval Gate
- [x] **Research — Workflow governance via Barsa**
- [x] **Build — MI0: workflow governance design (issue → branch → TDD → commit → PR → review → merge)**
- [x] **Build — MI1: opencode.json cleanup**
- [x] **Build — MI2a: lead + build frontmatter**
- [x] **Build — MI2b: subagent models + temperature**
- [x] **Build — MI3: AGENTS.md reorganization**
- [x] **Build — MI4: inventory + test + eval updates**
- [x] **Build — MI5: workflow-governance agent/skill/command proposal**
- [x] **Build — MI6: validation (npm test, startup timing)**
- [x] Review
- [ ] Archive
- [ ] Commit
- [ ] Push

## Objective
1. Remove `provider.opencode` (redundant — OpenCode built-in provides free models)
2. Remove `agent` section from JSON (redundant with markdown files)
3. Add `model`, `permission`, `temperature` to agent frontmatter where missing
4. Assign free OpenCode models to simpler subagents (mimo-v2.5-free, deepseek-v4-flash-free)
5. Remove `build.md` (OpenCode has built-in `build` agent as fallback)
6. Reorganize `global/AGENTS.md`: 437 lines → ~180 lines of invariant rules only
7. Update inventory + tests + evals for new artifact count (70 → 69)
8. Add workflow guardrails so leads do not skip issue, branch, TDD, commit, PR, review, or merge steps
9. Design two governance subagents (or reuse existing agents if creation is out of scope):
   - `workflow-governance-auditor`: audits docs/system/issues and opens issues for gaps
   - `issue-pr-coordinator`: aligns open issues with branches/PRs, opens PRs, tracks closure
10. Require agents to ask whether issue/PR workflow is needed for simple tasks

## Barsa Research — Workflow Governance

Sources consulted: CTX02, CTX03, CTX09, CTX10, CTX14, CTX15, CTX16, CTX19, CTX20, CTX23, CTX24, CTX27, CTX29 via Operational Retrieval Map and Barsa technology/personal/documentation collections.

Key findings:
- Healthy engineering workflow: **issue → branch → TDD-first → commit → PR → review → merge**.
- Branches should be **short-lived** and patches **small/readable**.
- PRs should be **small, focused, self-reviewed**, linked to issue/goal.
- TDD must create a valid RED before production behavior changes.
- CI/CD and required checks enforce discipline better than memory.
- Review must compare implementation against issue + PR scope, not just code style.
- Feedback should follow 4As: actionable, accurate, appropriate, adaptive.
- DevOps/SRE sources emphasize small blast radius, automation, monitoring, and post-change feedback.
- Trivial work may use fast path, but agent must explicitly classify it and ask whether issue/PR is required.

## Diagnosis (Measured)
- Baseline `opencode run "hello"`: **~18.15s**
- Remove `provider.opencode`: **~12.46s** (-5.69s, 31%)
- Remove `mcp`: **~13.48s** (-4.67s, 26%)
- Remove `agent` inline: **~13.51s** (-4.64s, 26%)
- Remove zen + MCP + agent: **~10.80s** (-7.35s, 40%)
- **Target: ~11s startup**

---

# 🎯 Detailed Implementation Plan

## MI0 — Workflow governance design

### Global rule to embed in `global/AGENTS.md`
For any non-trivial mutating task:
1. Classify work.
2. Ask whether issue/branch/PR is required when not explicit.
3. If required: create/reuse issue before branch.
4. Create/reuse branch before code mutation.
5. TDD-first: RED before production behavior change.
6. Commit only after tests + review.
7. PR links issue and states validation.
8. Review checks issue + PR + diff + tests.
9. Merge only after review approval and passing checks.

### Fast path for trivial work
Allowed only for typo/docs-only/tiny config changes when user confirms no issue/PR needed. Still requires clean diff review and validation proportional to risk.

### Lead behavior rule
Every lead must orchestrate, not silently implement. On start:
- restate task classification;
- identify whether issue/branch/PR needed;
- identify required subagents;
- ensure TDD-first for behavioral changes;
- delegate implementation/review to subagents;
- report unresolved blockers.

### Proposed new governance subagents
Creation is part of follow-up MI5 and must respect OpenCode agent policy.

1. `workflow-governance-auditor`
   - Purpose: regularly inspect system docs, agent prompts, skills, commands, workflows, open gaps.
   - Outputs: issue candidates, missing docs, stale prompts, broken workflow contracts.
   - Model: `opencode/big-pickle`, temp 0.1.
   - Permissions: read docs/.opencode/global, GitHub issue write if approved, no code edit.

2. `issue-pr-coordinator`
   - Purpose: align open issues with branches/PRs, open PRs, ensure PR links issue, track closure.
   - Outputs: branch/PR plan, PR body, issue closure checklist.
   - Model: `opencode/deepseek-v4-flash-free`, temp 0.2.
   - Permissions: GitHub issue/PR read/write, git status/diff/log, no source edit.

### Existing agents to reuse meanwhile
- `delivery-lead`: release/PR/commit orchestration
- `review-lead`: gate review
- `code-reviewer`: code-level review
- `context-historian`: trace decisions/issues/PRs
- `decision-logger`: durable decisions

## MI1 — `global/opencode.json` cleanup

**File:** `global/opencode.json`

### Step 1.1 — Remove `provider.opencode`
Remove lines 64-82 (the entire `"opencode": { ... }` block inside `provider`).
After this, `provider` only has `9router`.

### Step 1.2 — Remove `agent` section  
Remove lines 138-696 (the entire `"agent": { ... 39 agents ... }` block).

### Step 1.3 — Keep `mcp` section
Lines 84-94 remain unchanged.

### Step 1.4 — Keep `default_agent: "trust-lead"`
Line 95 stays as-is.

### Step 1.5 — Keep everything else
- `$schema`, `share`, `snapshot`, `autoupdate`, `compaction` (lines 1-8)
- `model`, `small_model` (lines 9-10)
- `mcp` (lines 84-94)
- `instructions` (lines 96-104)
- `references` (lines 105-114)
- `watcher` (lines 115-127)
- `permission` (lines 128-137)

### Verification after MI1
```bash
python3 -c "
import json
with open('global/opencode.json') as f:
    c = json.load(f)
assert 'opencode' not in c.get('provider', {}), 'opencode provider still present'
assert 'agent' not in c, 'agent section still present'
assert 'mcp' in c, 'mcp section missing'
print('MI1 OK: opencode.json clean')
"
```

---

## MI2a — Lead + Build frontmatter

### Decision: Remove `build.md`
- OpenCode has a **built-in** `build` agent as fallback
- Our custom `build.md` overrode it — without it, built-in takes over
- `default_agent` is already `trust-lead`, so `build` is never the entry point
- Leads delegate directly to subagents via `task` tool — no `build` needed

### Files to modify (9 leads):

Each lead gets `model`, `temperature`, and `permission` added to YAML frontmatter.

#### 1. `global/agents/trust-lead.md`
```yaml
---
description: Coordinates cross-team communication, decision logging, meeting facilitation, and process health
model: opencode/big-pickle
mode: primary
temperature: 0.1
permission:
  read: allow
  edit:
    ".opencode/**": allow
  bash:
    "git status*": allow
    "git diff*": allow
    "git log*": allow
    "git branch --show-current": allow
  task: allow
---
```

#### 2. `global/agents/product-lead.md`
```yaml
model: opencode/big-pickle
temperature: 0.1
permission:
  read: allow
  edit:
    "docs/opencode/**": allow
  bash:
    "git status*": allow
    "git diff*": allow
    "git log*": allow
  task: allow
```

#### 3. `global/agents/architecture-lead.md`
```yaml
model: opencode/big-pickle
temperature: 0.1
permission:
  read: allow
  edit:
    "docs/opencode/**": allow
    "docs/decisions/**": allow
  bash:
    "git status*": allow
    "git diff*": allow
    "git log*": allow
  task: allow
```

#### 4. `global/agents/engineering-lead.md`
```yaml
model: opencode/big-pickle
temperature: 0.1
permission:
  read: allow
  edit:
    "src/**": allow
    "tests/**": allow
  bash:
    "npm test*": allow
    "node --test*": allow
    "git status*": allow
    "git diff*": allow
    "git log*": allow
  task: allow
```

#### 5. `global/agents/quality-lead.md`
```yaml
model: opencode/big-pickle
temperature: 0.1
permission:
  read: allow
  edit:
    "tests/**": allow
  bash: allow
  task: allow
```

#### 6. `global/agents/review-lead.md`
```yaml
model: opencode/big-pickle
temperature: 0.1
permission:
  read: allow
  edit: deny
  bash:
    "git status*": allow
    "git diff*": allow
    "git log*": allow
    "git show*": allow
    "git branch --show-current": allow
  task: allow
```

#### 7. `global/agents/devops-lead.md`
```yaml
model: opencode/big-pickle
temperature: 0.1
permission:
  read: allow
  edit:
    ".github/**": allow
    "scripts/**": allow
    ".opencode/**": allow
  bash: allow
  task: allow
```

#### 8. `global/agents/delivery-lead.md`
```yaml
model: opencode/big-pickle
temperature: 0.1
permission:
  read: allow
  edit:
    "docs/**": allow
    ".opencode/**": allow
  bash:
    "git status*": allow
    "git diff*": allow
    "git log*": allow
    "git show*": allow
    "git branch --show-current": allow
    "git remote -v": allow
    "git push*": ask
  task: allow
```

#### 9. `global/agents/knowledge-lead.md`
```yaml
model: opencode/big-pickle
temperature: 0.1
permission:
  read: allow
  edit:
    "docs/opencode/**": allow
    ".opencode/skills/**": allow
    ".opencode/agents/**": allow
  bash:
    "git status*": allow
    "git diff*": allow
    "git log*": allow
    "git branch --show-current": allow
  task: allow
```

#### 10. `global/agents/build.md` — REMOVE file
Also remove from inventory (MI4).

---

## MI2b — Subagent model assignments + temperature

### Group A: Complex reasoning → `opencode/big-pickle`, temp: 0.3
Currently no model in frontmatter (relied on JSON `combo-cheap`).

| File | model | temp | permission |
|------|-------|------|------------|
| `architecture-decision-designer.md` | opencode/big-pickle | 0.3 | (keep existing) |
| `domain-modeler.md` | opencode/big-pickle | 0.3 | (keep existing) |
| `api-database-designer.md` | opencode/big-pickle | 0.3 | (keep existing) |
| `distributed-systems-reviewer.md` | opencode/big-pickle | 0.3 | (keep existing) |

### Group B: Implementation → `9router/combo-main`, temp: 0.1
Already have model in frontmatter — just add temperature.

| File | model | temp | permission |
|------|-------|------|------------|
| `feature-implementer.md` | 9router/combo-main | 0.1 | (keep existing) |
| `code-refactoring-specialist.md` | 9router/combo-main | 0.1 | (keep existing) |
| `performance-engineer.md` | 9router/combo-main | 0.1 | (keep existing) |
| `security-reviewer.md` | 9router/combo-main | 0.1 | (keep existing) |
| `privacy-reviewer.md` | 9router/combo-main | 0.1 | (keep existing) |
| `tdd-engineer.md` | 9router/combo-main | 0.1 | (keep existing) |
| `integration-tester.md` | 9router/combo-main | 0.1 | (keep existing) |
| `testing-strategy-designer.md` | 9router/combo-main | 0.1 | (keep existing) |
| `code-reviewer.md` | 9router/combo-main | 0.1 | (keep existing) |
| `compliance-auditor.md` | 9router/combo-main | 0.1 | (keep existing) |
| `ux-accessibility-reviewer.md` | 9router/combo-main | 0.1 | (keep existing) |

### Group C: Infra/DevOps → `9router/combo-main`, temp: 0.3

| File | model | temp | permission |
|------|-------|------|------------|
| `ci-cd-infrastructure-engineer.md` | 9router/combo-main | 0.3 | (keep existing) |
| `observability-designer.md` | 9router/combo-main | 0.3 | (keep existing) |
| `incident-triage-specialist.md` | 9router/combo-main | 0.3 | (keep existing) |

### Group D: Medium reasoning → `opencode/deepseek-v4-flash-free`, temp: 0.3

| File | Current model | New model | temp |
|------|--------------|-----------|------|
| `product-discovery.md` | (none — combo-cheap) | opencode/deepseek-v4-flash-free | 0.3 |
| `requirements-analyzer.md` | (none — combo-cheap) | opencode/deepseek-v4-flash-free | 0.3 |
| `story-slicer.md` | (none — combo-cheap) | opencode/deepseek-v4-flash-free | 0.3 |
| `context-historian.md` | 9router/combo-main | opencode/deepseek-v4-flash-free | 0.3 |
| `documentation-skill-creator.md` | 9router/combo-main | opencode/deepseek-v4-flash-free | 0.3 |
| `reference-librarian.md` | 9router/combo-main | opencode/deepseek-v4-flash-free | 0.3 |
| `release-manager.md` | 9router/combo-cheap | opencode/deepseek-v4-flash-free | 0.3 |
| `changelog-writer.md` | 9router/combo-main | opencode/deepseek-v4-flash-free | 0.3 |

### Group E: Simple tasks → `opencode/mimo-v2.5-free`, temp: 0.5

| File | Current model | New model | temp |
|------|--------------|-----------|------|
| `coordination-facilitator.md` | (none — combo-cheap) | opencode/mimo-v2.5-free | 0.5 |
| `meeting-scribe.md` | (none — combo-cheap) | opencode/mimo-v2.5-free | 0.5 |
| `decision-logger.md` | (none — combo-cheap) | opencode/mimo-v2.5-free | 0.5 |

---

## MI3 — `global/AGENTS.md` reorganization

**Before:** 437 lines, 12 sections — full procedural workflows
**After:** ~180 lines, invariant rules only. User requirement: **no agent-specific instructions and no skill references inside AGENTS.md**.

### Structure of new AGENTS.md:
```
# Global Engineering Execution Rules

## 1. Instruction Precedence and Sources of Truth
## 2. Classification, Evidence, and Context
## 3. Healthy Engineering Workflow
## 4. Task Plan and Execution Ledger
## 5. TDD-First Gate
## 6. Code Quality and Architecture
## 7. Git State and Working Tree Safety
## 8. Review, Archive, and Delivery
## 9. Security, Failures, and Fallbacks
## 10. Definition of Done and Final Report
```

### What's removed:
- Agent/subagent-specific procedural guidance
- Skill references
- Long examples and repeated workflow prose
- Expanded delivery/review details better owned by docs/skills/agents

### What's kept:
- Source precedence and conflict resolution
- Evidence before decision
- Approval before mutation
- Issue/branch/PR question requirement
- Task Plan requirement
- TDD-first in condensed, strict form
- Git safety and non-destructive rules
- Security/failure handling
- Definition of Done and factual reporting

### What's added:
- Healthy workflow gate: issue → branch → TDD → commit → PR → review → merge
- Fast-path rule for trivial work only after explicit confirmation
- Code quality principles from Barsa research: Clean Code, SOLID, DDD, refactoring, small batches, feedback loops

---

## MI4 — Inventory + test + eval updates

### `src/installer/inventory.js`
- Remove line 35: `{ source: 'global/agents/build.md', target: 'agents/build.md' }`
- Agent count: 39 → 38
- Total: 70 → 69

### `tests/installer/installer.test.js`
- Line 190: `it('3 + 39 + 7 + 7 + 10 + 0 + 4 = 70',` → `it('3 + 38 + 7 + 7 + 10 + 0 + 4 = 69',`
- Line 192: agent filter: 39 → 38
- Line 200-201: sum assertions 70 → 69

### `evals/cases/deterministic.js`
- Line 38: `70 artifacts` → `69 artifacts`
- Line 54: `length !== 70` → `length !== 69`

---

## MI5 — Workflow-governance agent/skill/command proposal

Because current trust-lead boundary says not to create agents/commands/skills directly, this microincrement produces an implementation-ready design and handoff. Actual creation needs explicit implementation owner or renewed approval to let the appropriate agent modify agent/skill/command artifacts.

### Deliverables
1. Draft `workflow-governance-auditor` agent spec:
   - mission, use cases, inputs, outputs, boundaries, permissions, reference profile, model/temp.
2. Draft `issue-pr-coordinator` agent spec:
   - mission, issue/branch/PR lifecycle, GitHub permissions, closure rules, model/temp.
3. Draft workflow command proposal:
   - `opentrust-start-work`: asks issue/branch/PR/TDD questions before mutation.
   - `opentrust-ready-for-pr`: validates issue link, branch, tests, review checklist.
4. Draft skill proposal if needed:
   - `opentrust-workflow-governance`: issue → branch → TDD → commit → PR → review → merge checklist.

### Acceptance
- No new agents/skills/commands created in this MI unless explicitly reapproved.
- Existing leads get rule updates so they ask about issue/PR needs immediately.

## MI6 — Validation

### Step-by-step checks:
1. ✅ `python3 -c "import json; json.load(open('global/opencode.json'))"` — valid JSON
2. ✅ `python3 -c "..."` — no `provider.opencode`, no `agent` section
3. ✅ `python3 -c "..."` — agent markdown files have model/permission/temperature where expected
4. ✅ `rm -f global/agents/build.md` — build.md removed
5. ✅ `npm test` — all tests pass (238/238)
6. ✅ `opencode models` — shows both opencode/* and 9router/* models
7. ✅ `opencode agent list` — shows 38 agents (no build)
8. ⏱️ `time opencode run "hello"` — target ~11s
9. ✅ Install from package: `npm pack --dry-run` + verify inventory

---

## Files Changed Summary

| # | File | Action |
|---|------|--------|
| 1 | `global/opencode.json` | Remove provider.opencode + agent section |
| 2 | `global/agents/trust-lead.md` | Add model, permission, temperature |
| 3 | `global/agents/product-lead.md` | Add model, permission, temperature |
| 4 | `global/agents/architecture-lead.md` | Add model, permission, temperature |
| 5 | `global/agents/engineering-lead.md` | Add model, permission, temperature |
| 6 | `global/agents/quality-lead.md` | Add model, permission, temperature |
| 7 | `global/agents/review-lead.md` | Add model, permission, temperature |
| 8 | `global/agents/devops-lead.md` | Add model, permission, temperature |
| 9 | `global/agents/delivery-lead.md` | Add model, permission, temperature |
| 10 | `global/agents/knowledge-lead.md` | Add model, permission, temperature |
| 11 | `global/agents/build.md` | **DELETE** |
| 12 | 4 complex subagent .md files | Add model + temperature |
| 13 | 11 implementation subagent .md files | Add temperature only |
| 14 | 3 infra subagent .md files | Add temperature only |
| 15 | 8 medium subagent .md files | Change model + add temperature |
| 16 | 3 simple subagent .md files | Change model + add temperature |
| 17 | `global/AGENTS.md` | Rewrite (437→~180 lines) |
| 18 | `src/installer/inventory.js` | Remove build.md entry (70→69) |
| 19 | `tests/installer/installer.test.js` | Update counts (39→38, 70→69) |
| 20 | `evals/cases/deterministic.js` | Update counts (70→69) |

## Execution Evidence

- Branch created: `harness-032-config-workflow-governance`.
- MI1: `global/opencode.json` valid JSON; provider keys now `["9router"]`; no top-level `agent`; MCP retained; `default_agent=trust-lead`.
- MI2: remaining agent files count is 38; `global/agents/build.md` removed; every remaining agent has `model` and `temperature` in frontmatter.
- MI3: `global/AGENTS.md` reduced to 175 lines; invariant rules only; no skill refs/agent-specific instructions.
- MI4: inventory/test/eval counts updated to 69 artifacts and 38 agents.
- Test fix: `tests/global/permission-hardening.test.js` now reads trust-lead config from markdown frontmatter.
- Validation: `npm test` passed 238/238.
- Validation: `npm run eval:deterministic` passed.
- Validation: `npm pack --dry-run --ignore-scripts` passed; tarball lists 98 total files.
- Startup probes with temp install: `opencode agent list` 9.474s, `opencode models` 5.523s. `opencode run "hello"` reached `trust-lead · big-pickle` but timed out after 30s waiting for model response; not counted as startup regression.
- Review: code-reviewer approved, no blockers; six non-blocking suggestions recorded.

## Risks

| Risk | Mitigation |
|------|-----------|
| Removing `build.md` breaks task delegation | OpenCode has built-in `build` agent as fallback. Subagents are referenced directly by name in `task` tool. |
| Changing subagent models reduces quality | Complex/implementation subagents stay on `9router/combo-main`. Only simple/medium move to free models. |
| AGENTS.md too trimmed causes hallucinations | Keep all invariant rules. Remove only redundant procedural prose. Add reference to skills. |
| Inventory count mismatch breaks CI | MI4 updates all 3 files (inventory, test, eval) in lockstep. |
| `opencode run` regression | MI5 measures timing after all changes. |
