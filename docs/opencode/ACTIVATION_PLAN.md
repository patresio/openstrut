# OpenTrust Runtime Activation Plan

## Objective

Replace the legacy `global/opencode.json` with an OpenTrust-native configuration that activates the 38-agent topology, workflow commands, and workflow skills. Provider and MCP blocks are preserved; agent, default_agent, permission, and instructions are rebuilt from the OpenTrust draft.

## Current State

| Artifact | Count | Namespace |
|----------|-------|-----------|
| `global/agents/` | 57 `.md` files | 38 OpenTrust + 19 legacy |
| `global/commands/` | 17 `.md` files | 7 `ot-*` + 10 `eng-*` |
| `global/skills/` | 46 directories | 7 `opentrust-*` + 39 legacy |

### Current `global/opencode.json`
- **Primary agents**: `build` (full access), `plan` (read-only)
- **Subagents**: 19 legacy agents (no OpenTrust agent is referenced)
- The `build` agent references `eng-*` skills and legacy subagents for task delegation
- Provider (9Router) and MCP (homelab-ai-coding, barsa) blocks are correct and should be retained
- Permission block was designed for legacy `build`/`plan`/`eng-*` agents and must be rebuilt

### Draft `opencode.jsonc`
- 9 leaders (mode: primary) + 29 subagents (mode: subagent) = 38 agents
- Permission model with scoped `bash` patterns per leader
- All subagents have `task: deny` and no delegation
- References `ot-*` command instructions and `opentrust-*` skills

## Required Changes to `global/opencode.json`

### 1. Replace `agent` block

Remove all 21 agents (build, plan, + 19 legacy). Replace with:

```
9 leaders (mode: primary)
29 subagents (mode: subagent)
```

The leader agents are:

| Agent | Role |
|-------|------|
| `trust-lead` | Trust Coordination lead |
| `product-lead` | Product / Discovery lead |
| `architecture-lead` | Architecture lead |
| `engineering-lead` | Engineering lead |
| `quality-lead` | Testing / Quality lead |
| `review-lead` | Review / Governance lead |
| `devops-lead` | DevOps / SRE lead |
| `delivery-lead` | Delivery / Release lead |
| `knowledge-lead` | Knowledge / Context lead |

Each leader references its agent file at `global/agents/{name}.md` and inherits the instruction files.

The 29 subagents (mode: subagent, task: deny) span 9 teams. 3 subagents reuse preserved legacy files (`code-reviewer`, `compliance-auditor`, `release-manager`).

### 2. Update `default_agent`

Change from `"build"` to `"trust-lead"` — the OpenTrust coordination entry point.

### 3. Add `instructions` block

Reference the OpenTrust workflow documents:

```json
"instructions": [
  "docs/opencode/TEAM_TOPOLOGY.md",
  "docs/opencode/WORKFLOW.md",
  "docs/opencode/TASK_CONTRACT.md",
  "docs/opencode/PERMISSIONS.md",
  "docs/opencode/OBSERVABILITY.md",
  "docs/opencode/OPERATIONAL_RETRIEVAL_MAP.md"
]
```

### 4. Rebuild `permission` block

The current top-level permission block was designed for the legacy `build` agent workflow. It must be rebuilt from the approved OpenTrust topology — each leader gets scoped permissions matching its role (read/write/execute per team scope). Base on `opencode.jsonc` permission model and validate against `docs/opencode/PERMISSIONS.md`.

### 5. Preserve unchanged (runtime-neutral)

- `$schema` — keep
- `share` — keep `"disabled"`
- `snapshot` — keep `true`
- `autoupdate` — keep `"notify"`
- `compaction` — keep `{"auto": true}`
- `model` — keep `"9router/combo-main"`
- `small_model` — keep `"9router/combo-cheap"`
- `provider` — keep 9Router config as-is
- `mcp` — keep homelab-ai-coding + barsa as-is

### 6. Rebuild agent-level permission blocks

Each agent in the new topology carries its own scoped permissions. Per-agent `edit`, `bash`, `skill`, `task`, and `external_directory` rules must be set per the `opencode.jsonc` draft — not inherited from legacy agents.

### 7. Remove legacy agent-specific permission structures

- Remove `agent > build > permission > skill` block — OpenTrust skill permissions are defined per-leader in topology
- Remove `agent > build > permission > task` block — task delegation is replaced by leader→subagent topology
- Remove `agent > plan` agent — OpenTrust planning is owned by `trust-lead`

## Activation Strategy

### Option A: Full replacement (recommended)

Build the new `global/opencode.json` by:

- Preserving: `$schema`, `share`, `snapshot`, `autoupdate`, `compaction`, `model`, `small_model`, `provider`, `mcp`
- Rebuilding from `opencode.jsonc` draft: `default_agent`, `instructions`, `permission`, `agent` (all 38 agents with per-agent permissions)
- Dropping: legacy `plan` agent, legacy agent task/skill permission blocks in `build`

**Validation gates before commit:**
1. `npm run validate:opentrust` passes (config + taxonomy validators)
2. `node --test` passes (existing test suite)
3. `npm pack --dry-run --ignore-scripts` verifies package structure
4. `git diff --check` ensures no whitespace errors
5. Manual diff review: no secrets leaked, no provider/MCP config dropped

### Option B: Two-step (safer but slower)

1. First commit: add OpenTrust agents to `global/opencode.json` alongside legacy agents, with `"enabled": false` on legacy agents
2. Second commit: remove legacy agents, enable OpenTrust fully

Not recommended — OpenCode does not support disabling agents by `"enabled"` flag at config level.

### Rollback

If activation breaks the runtime:
1. `git checkout HEAD@{1} global/opencode.json` restores the legacy config
2. Re-run `npm run validate:opentrust` to verify rollback is clean

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Legacy agents still in `global/agents/` | User might accidentally reference them | Archive to `global/archive/` in a follow-up phase after activation |
| `eng-*` commands still in `global/commands/` | Duplicate workflow surface | Archive in same follow-up |
| Legacy skills still in `global/skills/` | No conflict — skills are opt-in by agent permissions | Leave in place; OpenTrust agents reference only `opentrust-*` skills |
| `build` agent removed | Existing sessions or scripts referencing `build` break | `default_agent` changes to `trust-lead`; `build` is no longer the default agent name |
| Permission block built from draft but untested with actual runtime | Agent may be over- or under-privileged | Validate with `npm run validate:opentrust` and manual review against `docs/opencode/PERMISSIONS.md` |
| 9Router provider config dropped | All model calls fail | Merge from existing config, not draft |

## Pre-flight Checklist

- [ ] `global/agents/` has all 38 files (9 leaders + 26 created + 3 preserved legacy)
- [ ] `global/commands/` has all 7 `ot-*` files
- [ ] `global/skills/` has all 7 `opentrust-*` directories
- [ ] `docs/opencode/` has all 8 foundation documents
- [ ] `scripts/validate-opencode-config.mjs` passes
- [ ] `scripts/validate-opentrust-taxonomy.mjs` passes
- [ ] `npm test` passes
- [ ] `npm pack --dry-run --ignore-scripts` passes
- [ ] No `"*": "allow"` wildcards
- [ ] No private/internal library names in config
- [ ] All subagents have `task: deny` in draft `opencode.jsonc`

## Next Phase (after approval)

Phase 9 — Activate: implement the `global/opencode.json` replacement using the approved Option A strategy, followed by validation and commit.
