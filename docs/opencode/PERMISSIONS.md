# OpenTrust Permissions Model

## Principles

1. **Least privilege** — each agent gets only the permissions it needs
2. **No wildcards** — never use `"*": "allow"` or equivalent catch-all grants
3. **Explicit scope** — every permission is scoped to specific files, directories, or operations
4. **Read-only by default** — mutation requires explicit authorization

## Permission Categories

| Category | Description | Examples |
|----------|-------------|----------|
| Read | Read files and directories | `dir:read`, `file:read` |
| Search | Grep and glob operations | `grep`, `glob` |
| Write | Create and modify files | `file:write`, `file:edit` |
| Execute | Run commands | `bash`, `execute` |
| Network | Web and API access | `webfetch`, `websearch` |
| Git | Version control operations | `git:status`, `git:diff` |

## Agent Permission Scope

### Leads (9 agents)

| Agent | Read | Search | Write | Execute | Network | Git |
|-------|------|--------|-------|---------|---------|-----|
| trust-lead | `.opencode/`, `docs/opencode/` | `.opencode/`, `docs/` | `.opencode/`, `docs/opencode/` | read-only | no | status, diff |
| product-lead | `docs/`, `.opencode/` | `docs/`, `.opencode/` | `docs/opencode/` | read-only | limited | no |
| architecture-lead | `docs/`, `.opencode/` | `docs/`, `.opencode/` | `docs/opencode/` | read-only | limited | no |
| engineering-lead | `src/`, `tests/`, `.opencode/` | `src/`, `tests/`, `.opencode/` | `src/`, `tests/` | full | yes | status, diff |
| quality-lead | `tests/`, `src/`, `.opencode/` | `tests/`, `src/`, `.opencode/` | `tests/` | full | no | status, diff |
| review-lead | `.opencode/`, `docs/`, `src/`, `tests/` | `.opencode/`, `docs/` | none (read-only) | read-only | no | status, diff |
| devops-lead | `.opencode/`, `.github/` | `.opencode/`, `.github/` | `.github/`, `.opencode/` | full | yes | status, diff |
| delivery-lead | `.opencode/`, `docs/` | `.opencode/`, `docs/` | `docs/`, `.opencode/` | limited | limited | full |
| knowledge-lead | `docs/`, `.opencode/`, `references/` | `docs/`, `.opencode/`, `references/` | `docs/opencode/`, `.opencode/` | read-only | retrieval | status, diff |

### Subagents

Subagents inherit their lead's permissions with further narrowing. Each subagent file declares its own `permissions` array in `opencode.jsonc`.

## Prohibited Operations

- `"*": "allow"` wildcard permissions
- Access to `~/.config/opencode/` without explicit task approval
- Global `npm install` or system package installation
- Access to files outside the project root (without explicit approval)
- Force push, history rewrite, or destructive git operations
- Runtime dependence on external retrieval providers

## Permission Verification

1. Every agent file must declare a `permissions` array
2. Validators check that no wildcard permissions exist
3. Validators check that each permission is scoped to an existing path
4. Pre-commit hook (future) validates permission changes
