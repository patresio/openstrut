# HARNESS-001: Fix Agent Delegation Architecture

## Classification
implementation

## Status
APPROVED

## Scope
Fix all 38 OpenTrust agent prompts so leads delegate to subagents instead of doing work directly.

### In Scope
- Add `## Delegation Workflow` section to all 9 lead prompts (source + installed)
- Fix frontmatter permissions in all 29 subagent prompts to match `opencode.json` (source + installed)
- Restrict engineering-lead permissions to incentivize delegation
- Create `build` agent as general worker (source + installed)
- Update `global/opencode.json` and `~/.config/opencode/opencode.json`

### Out of Scope
- Changing team topology or selector definitions
- Modifying workflow docs (`TEAM_TOPOLOGY.md`, `WORKFLOW.md`, etc.)
- Modifying skill files
- Installing, pushing, or publishing

## Microincrements

### 1. Fix lead prompts (9 source + 9 installed)
Add `## Delegation Workflow` section after `## Delegation` in each lead `.md`.
Content instructs: PLAN → DELEGATE (via `task` tool) → COLLECT → SYNTHESIZE → VALIDATE → REPORT
Explicitly says: "Do NOT implement work yourself"

### 2. Fix subagent frontmatter (29 source + 29 installed)
Replace frontmatter `permission` block in each subagent `.md` to match `opencode.json` permissions.
Each subagent gets its specific permission set (edit scope, bash scope) instead of blanket `deny`.

### 3. Restrict engineering-lead permissions
In `global/agents/engineering-lead.md` and installed copy:
- Frontmatter: restrict edit and bash (remove blanket allow)
In `global/opencode.json` and installed copy:
- Change `edit: allow` → `edit: {src/**, tests/**}`
- Change `bash: allow` → `bash: {npm test*, node --test*, git status*, git diff*, git log*}`

### 4. Create build agent
Create `global/agents/build.md` and install to `~/.config/opencode/agents/build.md`.
Full permissions: edit allow, bash allow, task deny.
Purpose: general worker for implementation work that doesn't fit a specialist subagent.
Add build agent entry to both `global/opencode.json` and installed copy.

### 5. Update both opencode.json files
- Add build agent entry
- Restrict engineering-lead permissions
- (Lead/subagent entries already correct in opencode.json; only frontmatter in .md needed fixing)

## Validation
- `npm test` passes
- All agent `.md` files have consistent frontmatter-to-config permissions
- All lead prompts have delegation workflow section
- `build` agent exists in both locations
- No blanket `edit: deny` or `bash: deny` in subagent frontmatter where opencode.json grants permissions

## Approval Evidence
User explicitly approved "Sim, implementa tudo" on 2026-07-08.
