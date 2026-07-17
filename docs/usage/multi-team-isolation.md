# Multi-Team Isolation Guide

## Purpose

When multiple teams (9 OpenTrust teams) work in parallel, they need clear file-level and branch-level isolation to prevent conflicts. This guide defines the rules.

## Isolation Model

### File-Level Ownership

Each team owns specific paths. Agents may only edit files within their team's owned paths.

| Team | Owned Paths | Read-Only Paths |
|------|-------------|-----------------|
| Trust Coordination | `.opencode/`, `docs/opencode/` | `src/`, `tests/` |
| Product | `docs/`, `.opencode/` | `src/` |
| Architecture | `docs/`, `.opencode/` | `src/`, `tests/` |
| Engineering | `src/`, `tests/` | `docs/`, `.opencode/` |
| Testing | `tests/`, `src/` | `docs/`, `.opencode/` |
| Review | `.opencode/`, `docs/` | `src/`, `tests/` (read-only) |
| DevOps | `.github/`, `.opencode/` | `src/`, `tests/` |
| Delivery | `docs/`, `.opencode/` | `src/`, `tests/` |
| Knowledge | `docs/`, `global/context/` | `src/`, `tests/` |

### Branch Strategy

- **Branch per task**: `feat/{team}-{task-id}-{short-description}`
- **Base branch**: `main` (or current release branch)
- **No shared feature branches**: each team gets its own branch
- **PR gating**: all changes go through PR review before merge

### Conflict Prevention

1. **Different teams edit different paths** — file ownership prevents overlap
2. **Same team, different tasks** — branch-per-task isolation
3. **Shared files** (e.g., `package.json`, `opencode.jsonc`) — only Trust Coordination or Engineering leads may modify
4. **Merge conflicts** — rebase on main before opening PR, resolve locally

## Shared Resources

These files require explicit coordination:

| File | Owner | Coordination |
|------|-------|--------------|
| `package.json` | Engineering lead | Version bumps require task plan |
| `opencode.jsonc` | Trust lead | Permission changes require task plan |
| `AGENTS.md` | Trust lead | Workflow changes require task plan |
| `CONTRIBUTING.md` | Trust lead | Process changes require task plan |
| `CHANGELOG.md` | Delivery lead | Updated at release time only |

## Parallel Work Rules

1. **Never edit a file owned by another team** without explicit approval
2. **Always branch from main** — no direct commits to main
3. **Rebase before PR** — ensure no conflicts with main
4. **One task per branch** — don't combine unrelated changes
5. **PR review required** — no self-merges
6. **Task plan required** — before any mutation
7. **Test before PR** — run `npm test` and ensure all pass

## Emergency Override

When a shared resource needs urgent modification:

1. Create a task plan with explicit scope
2. Get approval from the file owner's team lead
3. Make the minimal change
4. Notify affected teams
5. Document the override in the task plan

## Monitoring

- `git status` before each mutation
- `git log --oneline -5` to check recent changes
- `npm test` before and after changes
- Review PRs for scope violations
