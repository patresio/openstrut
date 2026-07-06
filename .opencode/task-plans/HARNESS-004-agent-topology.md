# Task Plan: HARNESS-004 — Agent Topology

**Task ID:** HARNESS-004  
**Classification:** configuration  
**Status:** COMPLETE  

## Approved Scope and Exclusions
- **In Scope:** Configure `build`, `plan`, `explore`, `scout`, `code-reviewer`, `project-rules-auditor`. Use approved models. Establish strict read-only permissions and task delegation boundaries.
- **Exclusions:** Do not modify `AGENTS.md`, live files, project templates, installer code, package metadata, reference files. No custom files for native agents unless required. No new skills/commands. No commit or push.

## Current Configuration
- `build` uses `9router/combo-main`, mode `primary`.
- `plan` uses `opencode/deepseek-v4-flash-free`, mode `primary`.
- `explore` and `scout` are native subagents.
- `code-reviewer` and `project-rules-auditor` do not exist yet.

## Official Documentation Consulted
- `references/docs/agents.mdx`: Confirmed `scout` and `explore` are built-in native subagents. Mode definitions, task delegation glob patterns (`permission.task`), bash glob patterns (`permission.bash`).
- `references/docs/permissions.mdx`: Validated permission hierarchy.

## Focused Engineering References Consulted
- *AI Engineering* / *Building Applications with AI Agents*: Use one primary execution owner (`build`). Bounded specialist delegation. Strict context isolation and human approval boundaries. Prevent silent model fallback.
- *Refactoring* / *Continuous Delivery* / *Working Effectively with Legacy Code* (for code review): Review complete diffs, identify regressions, check contracts/dependencies, distinguish blockers from suggestions.
- *The Pragmatic Programmer* / *Clean Architecture* (for rules auditor): Discover actual project conventions, identify authoritative commands, detect stale instructions without mutating files.

## Native-Agent Availability Findings
- `explore` and `scout` are officially documented as built-in subagents in `agents.mdx`.
- Custom Markdown files are not required for `explore` and `scout`.

## Agent Responsibility Matrix
| Agent | Type | Primary Role |
| --- | --- | --- |
| `build` | Primary | Execution owner, synthesizes, mutates, tests, validates. |
| `plan` | Primary | Read-only analysis, risk assessment, proposals. |
| `explore` | Subagent | Local repository discovery, symbol/history search. |
| `scout` | Subagent | Official external documentation/reference lookup. |
| `code-reviewer` | Subagent | Independent diff review, regression/security check. |
| `project-rules-auditor` | Subagent | Rule/convention discovery, conflict detection. |

## Model-Routing Matrix
| Agent | Model |
| --- | --- |
| `build` | `9router/combo-main` |
| `plan` | `opencode/deepseek-v4-flash-free` |
| `explore` | `opencode/mimo-v2.5-free` |
| `scout` | `opencode/mimo-v2.5-free` |
| `code-reviewer` | `9router/combo-main` |
| `project-rules-auditor` | `opencode/deepseek-v4-flash-free` |
| `small_model` | `9router/combo-cheap` |

*Policy constraint:* If a free model is unavailable, report the failure and preserve state. Require explicit user decision before switching models. Never silently fallback to the main model.

## Permissions Matrix
| Agent | edit | bash | task | external_dir |
| --- | --- | --- | --- | --- |
| `build` | allow | global | `explore`, `scout`, `code-reviewer`, `project-rules-auditor` | global |
| `plan` | deny | git read-only | `explore`, `scout` | deny |
| `explore` | deny | git read-only | deny | deny |
| `scout` | deny | deny | deny | ask |
| `code-reviewer` | deny | git read-only | deny | deny |
| `project-rules-auditor`| deny | git read-only | deny | deny |

## Expected Files
- `global/opencode.json` (modified)
- `global/agents/code-reviewer.md` (new)
- `global/agents/project-rules-auditor.md` (new)
- `.opencode/task-plans/HARNESS-004-agent-topology.md` (new)

## Validation Checklist
- [x] JSON validation passes
- [x] Custom agent files created, frontmatter valid, read-only
- [x] Permission validation passes (task allowlists, bash wildcards)
- [x] Repository diff is clean (no unexpected files/secrets)
- [x] `npm pack --dry-run` includes new global agents

## Evidence and Adopted Decisions
- Native `scout` agent availability confirmed in `agents.mdx`. Handled native `scout` configuration entirely inside `global/opencode.json`.
- Modified `global/opencode.json` with the full model-routing matrix.
- `build` explicitly granted `edit: allow` to permit changes after Approval Gate while `edit: ask` remains the global baseline.
- `scout` explicitly granted `external_directory: ask` to allow controlled access to trusted paths.
- `code-reviewer` and `project-rules-auditor` created in `global/agents/` as read-only subagents with strict permission matrices, utilizing the read-only Git bash allowlist.
- Verified `code-reviewer.md` and `project-rules-auditor.md` contain valid custom OpenCode agent definitions, not completion reports.
- JSON verification script successfully confirmed configurations and permissions (output: `HARNESS-004 final assertions: PASS`).
- `git status` shows only `global/opencode.json`, `global/agents/`, and `.opencode/task-plans/HARNESS-004-agent-topology.md`.
- `npm pack --dry-run` validated `global/opencode.json`, `global/AGENTS.md`, `code-reviewer.md`, and `project-rules-auditor.md` were correctly included while ignoring other files.

## Deviations and Blockers
- None

## Current State
- Final validation complete. Configuration ready for delivery.

## Next Action
- Deliver HARNESS-004. Do not start HARNESS-005.
