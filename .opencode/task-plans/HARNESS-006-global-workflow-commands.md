# Task Plan: HARNESS-006 — Global Workflow Commands

**Task ID:** HARNESS-006  
**Classification:** workflow  
**Status:** IN PROGRESS  

## Approved Objective and Exclusions
- **In Scope:** Create nine global OpenCode commands acting as explicit entry points into the engineering workflows without overriding native natural-language routing.
- **Exclusions:** Do not modify `global/AGENTS.md`, `global/opencode.json`, existing agents, skills, templates, package metadata, installer code, references, or live OpenCode configurations. No commit/push yet.

## Official Documentation Consulted
- `commands.mdx`, `agents.mdx`, `skills.mdx`, `permissions.mdx`, `rules.mdx`, `config.mdx`.
- Confirmed global commands belong in `commands/<command-name>.md`.
- Confirmed frontmatter requires `description` and `agent` (`build` or `plan`), but prohibits setting `model` directly or using `subtask`.
- Confirmed `$ARGUMENTS` usage.
- Excluded shell-output injection and automatic file inclusions.

## Command Responsibility Matrix
| Command | Purpose |
| --- | --- |
| `eng-init-project` | Initialize project-local instructions, load `engineering-project-bootstrap`. |
| `eng-refresh-project-rules` | Refresh existing local `AGENTS.md`, load `engineering-project-bootstrap`. |
| `eng-plan` | Read-only exploration and planning. |
| `eng-resume` | Resume an approved mutating task, load `engineering-task-plan`. |
| `eng-checkpoint` | Update the active Task Plan with factual progress evidence. |
| `eng-status` | Provide a read-only status summary. |
| `eng-review` | Orchestrate independent review via `engineering-code-review`. |
| `eng-deliver` | Deliver approved work via `engineering-delivery`. |
| `eng-incident` | Diagnose and recover from failures via `engineering-incident-triage`. |

## Command-to-Agent Matrix
| Command | Agent |
| --- | --- |
| `eng-init-project` | `build` |
| `eng-refresh-project-rules` | `build` |
| `eng-plan` | `plan` |
| `eng-resume` | `build` |
| `eng-checkpoint` | `build` |
| `eng-status` | `plan` |
| `eng-review` | `build` |
| `eng-deliver` | `build` |
| `eng-incident` | `build` |

## Command-to-Skill Matrix
| Command | Loaded Skill |
| --- | --- |
| `eng-init-project` | `engineering-project-bootstrap` |
| `eng-refresh-project-rules` | `engineering-project-bootstrap` |
| `eng-plan` | None (reads instructions/evidence) |
| `eng-resume` | `engineering-task-plan` |
| `eng-checkpoint` | None (mutates active task plan) |
| `eng-status` | None (reads task plan and git state) |
| `eng-review` | `engineering-code-review` |
| `eng-deliver` | `engineering-delivery` |
| `eng-incident` | `engineering-incident-triage` |

## Mutation and Approval Boundaries
- Commands do not bypass the Approval Gate, global rules, or permission constraints.
- `eng-plan` and `eng-status` are strictly read-only.
- `eng-init-project`, `eng-refresh-project-rules`, `eng-review` and `eng-incident` perform diagnostic work and stop at the Approval Gate before making broad mutations.
- `eng-checkpoint` mutates only the active Task Plan of an already approved task.

## Expected Files
- `.opencode/task-plans/HARNESS-006-global-workflow-commands.md` (this file)
- `global/commands/eng-init-project.md`
- `global/commands/eng-refresh-project-rules.md`
- `global/commands/eng-plan.md`
- `global/commands/eng-resume.md`
- `global/commands/eng-checkpoint.md`
- `global/commands/eng-status.md`
- `global/commands/eng-review.md`
- `global/commands/eng-deliver.md`
- `global/commands/eng-incident.md`

## Validation Plan
- Static dependency-free validation verifying filenames, frontmatter, descriptions, expected agents, formatting, and lack of shell injections.
- Run `git status --short`, `git diff --check`, `git diff` for changes, and `npm pack --dry-run --ignore-scripts` to verify artifacts.

## Evidence, Deviations, and Blockers
- Created all 9 global command files with `eng-` prefixes in `global/commands/`.
- Command frontmatter uses only `description` and `agent` (`build` or `plan`).
- Verified commands contain NO shell-output injections or automatic file references.
- Validated programmatically that all 9 command files meet strict constraints.
- Diff and Git status are clean, showing only HARNESS-006 additions.
- `npm pack --dry-run` confirmed inclusion of all 9 commands and 8 skills in the final distribution archive.
- Blockers: None.

## Current State
- All 9 global workflow commands are created, validated, and ready for human review.

## Next Action
- Deliver HARNESS-006 (commit and push) upon explicit human approval.
