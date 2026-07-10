# Migration Policy

## Intent
Move selector semantics from implicit spreadsheets and scattered docs into local Markdown files.

## Policy
- This catalog is the local semantic source of truth for selector meanings.
- Executable prompts stay under `global/agents/` and `global/skills/`.
- Barsa docs remain provenance and routing input.
- If a selector lacks exact detail in repo-local sources, mark `status: partial`.

## Not Included
- no runtime prompt rewrites in this task
- no MCP/provider dependency
- no selector expansion beyond repo-local evidence
