# ADR-005: Branch-Per-Task Enforcement for All Mutating Agents

**Status:** Proposed  
**Date:** 2026-07-20  
**Author:** trust-lead (derived from Explore phase analysis)

## Context

The OpenTrust agent system has a documented branching policy (AGENTS.md Section 3, WORKFLOW.md) that defines the canonical workflow:

```
issue → branch → TDD → small change → focused validation → self-review → commit → PR → review → merge
```

However, enforcement is fragmented across multiple layers with critical gaps:

### Policy Exists But Is Not Enforced

| Layer | Status | Gap |
|-------|--------|-----|
| AGENTS.md (global) | ✅ Policy defined | No runtime verification |
| WORKFLOW.md | ✅ Phase rules defined | Apply phase checks decisions recorded, not Git state |
| Lead agent preflights | ⚠️ Soft enforcement | Ask "branch needed?" but don't verify Git state |
| `ot-apply` command | ⚠️ Weak gate | Checks if decision was *recorded*, not if agent is *on* a branch |
| Subagent prompts | ❌ Zero awareness | 5+ implementing agents have no branch instructions |
| Permissions | ⚠️ Mismatch | Only `engineering-lead` has explicit `git branch*`; others with `bash: allow` can implicitly create branches |

### Implementing Agents Without Branch Awareness

| Agent | Has Edit | Has Bash | Branch Instructions |
|-------|----------|----------|---------------------|
| `feature-implementer` | ✅ allow | ✅ allow | ❌ None |
| `code-refactoring-specialist` | ✅ allow | status/diff | ❌ None |
| `performance-engineer` | ✅ allow | ✅ allow | ❌ None |
| `tdd-engineer` | ✅ allow | test only | ❌ None |
| `ci-cd-infrastructure-engineer` | ✅ allow | ✅ allow | ❌ None |

### Result

Agents with mutation capabilities work directly on `main`, violating engineering best practices and making rollback, review traceability, and isolation harder.

## Decision

We enforce branch-per-task through three defense-in-depth mechanisms:

### 1. Hard Branch Gate in `ot-apply` Command

Add a pre-mutation verification step to `global/commands/ot-apply.md`:

```markdown
## Branch Verification (MANDATORY)

Before any file edit or bash mutation:
1. Run `git branch --show-current`
2. If result is `main`, `master`, or empty (detached HEAD):
   - STOP immediately
   - Report: "Cannot mutate on main branch. Create a task branch first."
   - Do NOT proceed with any edits
3. If on a feature branch, proceed with approved mutations
```

### 2. Branch Preflight in Implementing Subagent Prompts

Add a "Branch Awareness" section to all 5 implementing subagent files:

```markdown
## Branch Awareness (MANDATORY)

Before any edit or bash mutation:
1. Run `git branch --show-current`
2. If on `main`, `master`, or detached HEAD:
   - STOP and report: "Task branch required before mutation"
   - Do NOT proceed with any edits
3. Never commit directly to main
4. This gate applies to ALL mutations, including docs, tests, and config
```

Files to modify:
- `global/agents/feature-implementer.md`
- `global/agents/code-refactoring-specialist.md`
- `global/agents/performance-engineer.md`
- `global/agents/tdd-engineer.md`
- `global/agents/ci-cd-infrastructure-engineer.md`

### 3. Explicit Branch Permissions in `opencode.jsonc`

Grant explicit branch creation permissions to agents that need them:

```jsonc
{
  "bash": {
    "allow": [
      "git branch --show-current",
      "git checkout -b *",
      "git switch -c *",
      "git status*",
      "git diff*",
      "git log*"
    ]
  }
}
```

Apply to: `code-refactoring-specialist`, `tdd-engineer` (restricted-bash agents that need explicit grants)

Note: `feature-implementer`, `performance-engineer`, `ci-cd-infrastructure-engineer` already have `"bash": "allow"` (unrestricted), which implicitly covers branch commands.

## Consequences

### Positive
- Agents will refuse to work on main — enforced at three levels
- Workflow becomes consistent and fully auditable
- Rollback is easier with isolated branches per task
- Review traceability improves with clear branch-per-task mapping
- Incident recovery is simpler with branch isolation

### Negative
- Minor friction for trivial changes (intentional — trivial changes still need a branch)
- Additional Git operations in agent workflow (branch check before every mutation)
- Task plan must record branch name for traceability

### Risks
- Agents with `bash: allow` could bypass the prompt-level gate via unrestricted bash — mitigated by the `ot-apply` hard gate
- Permission changes may need testing to ensure agents can still function

## Alternatives

### Alternative 1: Prompt-only enforcement
Add branch checks to prompts only, without permission changes.
- **Rejected**: Prompt-only enforcement is advisory; agents can ignore it. Defense-in-depth requires multiple layers.

### Alternative 2: Git hook enforcement
Use a pre-commit hook to block commits to main.
- **Rejected**: Hooks can be bypassed with `--no-verify`. Agent-level enforcement is more reliable.

### Alternative 3: Restrict bash permissions to exclude git
Remove `bash: allow` from implementing agents and grant only specific git commands.
- **Rejected**: Too restrictive; agents need bash for tests, npm, and other non-git operations.

### Alternative 4: Create a new `ot-start-work` command
Mandatory pre-mutation command that handles issue/branch/PR/TDD questions.
- **Deferred**: This was proposed in HARNESS-032 MI5 but not implemented. Can be added later as an enhancement to this ADR.

## Implementation Order

1. Create this ADR (this task)
2. Modify `ot-apply` command with hard branch gate
3. Add branch awareness to 5 implementing subagent prompts
4. Update `opencode.jsonc` with explicit branch permissions
5. Test with a sample feature to verify enforcement works
6. Update WORKFLOW.md to reference ADR-005

## References

- AGENTS.md Section 3: Healthy Engineering Workflow
- WORKFLOW.md: Apply Phase rules
- HARNESS-032: Workflow governance design
- HARNESS-033: Lead workflow governance
- `.opencode/task-plans/HARNESS-032.md` line 74-84: Branch decision table
