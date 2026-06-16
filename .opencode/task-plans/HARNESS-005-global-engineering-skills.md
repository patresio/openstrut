# Task Plan: HARNESS-005 — Global Engineering Skills

**Task ID:** HARNESS-005  
**Classification:** configuration  
**Status:** IN PROGRESS  

## Approved Scope and Exclusions
- **In Scope:** Create eight `engineering-*` skills with precise procedural instructions based on consulted engineering references. Enable the `build` agent to load these skills via permissions. Correct a factual consistency issue in `code-reviewer.md`.
- **Exclusions:** Do not modify `global/AGENTS.md`, native agent topology (aside from `build` skill access), commands, templates, installer code, references, or live OpenCode configuration. Do not invent automated hooks, priorities, or unsupported lifecycle events. No commit/push.

## Official OpenCode Documentation Consulted
- `references/docs/skills.mdx`, `permissions.mdx`, `agents.mdx`, `config.mdx`, `rules.mdx`.
- Confirmed global skills directory structure (`skills/<name>/SKILL.md`), recognized frontmatter fields (`name`, `description`, `compatibility`), explicit loading via the `skill` tool, and pattern-based access control.
- **Platform vs Harness Requirements:** `name` and `description` are required by the OpenCode platform for skill discovery. `compatibility` is a supported field; however, `compatibility: opencode` is enforced strictly as a *harness consistency convention*, not a universal platform requirement.

## Engineering Sources Consulted Per Skill
- **engineering-project-bootstrap:** *The Pragmatic Programmer*, *Clean Architecture*, *Domain-Driven Design Quickly*, *The Software Craftsman*, *Continuous Delivery*, *AI Engineering*, *Building Applications with AI Agents*.
- **engineering-task-plan:** *The Pragmatic Programmer*, *Extreme Programming Explained*, *Continuous Delivery*, *AI Engineering*, *Building Applications with AI Agents*.
- **engineering-tdd-first:** *TDD by Example*, *Extreme Programming Explained*, *More Agile Testing*, *Refactoring*.
- **engineering-legacy-change:** *Working Effectively with Legacy Code*, *Refactoring*, *TDD by Example*, *More Agile Testing*.
- **engineering-bdd-discovery:** *BDD in Action*, *More Agile Testing*, *Domain-Driven Design Quickly*, *Extreme Programming Explained*.
- **engineering-code-review:** *Refactoring*, *The Software Craftsman*, *More Agile Testing*, *Continuous Delivery*, *Working Effectively with Legacy Code*, *AI Engineering*.
- **engineering-delivery:** *Continuous Delivery*, *The Pragmatic Programmer*, *The Software Craftsman*, *Extreme Programming Explained*.
- **engineering-incident-triage:** *The Pragmatic Programmer*, *Continuous Delivery*, *Working Effectively with Legacy Code*, *More Agile Testing*, *AI Engineering*.

## Skill Responsibility Matrix
| Skill | Primary Responsibility |
| --- | --- |
| `engineering-project-bootstrap` | Create/refresh project-local instructions. |
| `engineering-task-plan` | Manage the stateful execution ledger. |
| `engineering-tdd-first` | RED-GREEN-REFACTOR for behavior changes. |
| `engineering-legacy-change` | Characterization and safe modification of untested code. |
| `engineering-bdd-discovery` | Discover business rules and examples before code. |
| `engineering-code-review` | Orchestrate independent diff reviews before delivery. |
| `engineering-delivery` | Archive, commit, PR, and deliver approved work. |
| `engineering-incident-triage` | Diagnose and recover from failures without blind mutation. |

## Trigger and Non-Trigger Matrix
- **Triggers:** OpenCode discovers valid skills and exposes their names and descriptions. An authorized agent (like `build`) may load a skill on demand through the native `skill` tool. The model decides whether a skill is applicable based on the request, available descriptions, instructions, and current context. Precise descriptions improve routing but do not technically guarantee invocation.
- **Non-Triggers:** There are no automatic hooks, lifecycle events, implicit chains, guaranteed exact matching, or deterministic forced executions.

## Interaction Matrix Between Skills and Agents
- `build`: Owner of skill selection and integration. Only agent authorized to use `engineering-*` skills.
- `plan`, `explore`, `scout`, `project-rules-auditor`: Read-only, `skill` tool denied.
- `code-reviewer`: Driven by `engineering-code-review`. `skill` tool denied.

## Expected Files
- `.opencode/task-plans/HARNESS-005-global-engineering-skills.md`
- `global/opencode.json` (modified)
- `global/agents/code-reviewer.md` (modified)
- `global/skills/engineering-project-bootstrap/SKILL.md` (new)
- `global/skills/engineering-task-plan/SKILL.md` (new)
- `global/skills/engineering-tdd-first/SKILL.md` (new)
- `global/skills/engineering-legacy-change/SKILL.md` (new)
- `global/skills/engineering-bdd-discovery/SKILL.md` (new)
- `global/skills/engineering-code-review/SKILL.md` (new)
- `global/skills/engineering-delivery/SKILL.md` (new)
- `global/skills/engineering-incident-triage/SKILL.md` (new)

## `build` Skill Permission Decision
- Explicitly authorize `engineering-*` skills for the `build` agent, preserving `*` deny. The global `skill` baseline remains `deny`.

## Static Validation Plan
- `node -e` validation of `global/opencode.json` JSON parsing and schema rules.
- Dependency-free node script to validate all 8 `SKILL.md` files (names, descriptions, formatting).
- Repository diff validation using `git status`, `git diff --check`, `npm pack --dry-run`.

## Future Runtime-Evaluation Requirements
- Conduct runtime evaluations to measure if the model correctly selects and loads applicable skills based on their descriptions using the native `skill` tool.
- Verify `build` agent successfully uses the native `skill` tool without hallucinations.

## Evidence, Deviations, and Blockers
- Configured `skill: { "engineering-*": "allow" }` for `build`.
- Kept `skill: deny` as the global permission baseline.
- Corrected the free-model policy in `code-reviewer.md` to a neutral one per HARNESS requirements.
- Validated `opencode.json` programmatically: all assertions passed.
- Validated all 8 `SKILL.md` structures programmatically: frontmatter and headings passed.
- No commands, templates, installer files, or live configurations were modified.
- Checked `git status --short` and `git diff --check`, showing a clean diff exclusively containing approved artifacts.
- Verified package creation included all skills via `npm pack --dry-run`.
- **Final Corrections:** 
  - Updated `engineering-bdd-discovery` to preserve Approval Gate boundaries.
  - Updated `engineering-delivery` to conditionally request approval and avoid redundant requests.
  - Updated `engineering-incident-triage` to enforce mutation containment boundaries and accurate output.

## Current State
- Final validation and diff review complete. Package is verified. Ready for delivery.

## Next Action
- Commit and push HARNESS-005 to remote, then close.
