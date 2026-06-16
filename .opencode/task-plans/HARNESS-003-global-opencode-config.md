# HARNESS-003: Canonical Global OpenCode Configuration

## Objective
Create the canonical global OpenCode configuration (`global/opencode.json`) that the future installer will distribute.

## Scope and Exclusions
- **In Scope:** Creating a valid, secret-free, portable `global/opencode.json` based on approved architecture decisions and the sanitized snapshot.
- **Exclusions:** Mutating the live `~/.config/opencode` configuration, creating custom agents/skills/commands, adding placeholders, packaging secrets, starting HARNESS-004.

## Current Configuration Sources
- `references/current-state/opencode.notebook.redacted.jsonc`

## Official Documentation Consulted
- `references/docs/config.mdx`
- `references/docs/permissions.mdx`
- `references/docs/agents.mdx`
- `references/docs/mcp-servers.mdx`

## Configuration Decision Table

| Feature / Key | Decision | Meaning / Details |
| --- | --- | --- |
| schema | Retain | Standard OpenCode JSON schema reference |
| provider | Retain | 9router provider retained with safe env/file substitutions |
| model definitions | Retain | `combo-main` and `combo-cheap` definitions are portable |
| default agent | Retain | `build` is the default agent |
| native agents | Adapt | `build` and `plan` updated. `plan` uses `combo-main` model |
| permissions | Adapt | Strict global baseline established (`ask` for mutating actions) |
| MCP | Retain | `homelab-ai-coding` retained (global documentation/retrieval service) |
| compaction | Adapt | Explicitly enabled (`"auto": true`) |
| snapshot | Adapt | Explicitly enabled (`true`) |
| sharing | Adapt | Explicitly disabled (`"disabled"`) |
| autoupdate | Adapt | Set to `"notify"` |
| formatter | Remove | Disabled globally per architecture |
| LSP | Remove | Disabled globally per architecture |
| obsolete prompt references | Remove | Removed `build.txt` and `plan.txt` references |
| custom agents | Remove | No custom agents included |

## Planned Top-Level Keys
- `$schema`
- `default_agent`
- `model`
- `small_model`
- `share`
- `snapshot`
- `autoupdate`
- `compaction`
- `provider`
- `mcp`
- `permission`
- `agent`

## External Environment and Secret Requirements
- Environment variable: `BASE_URL_9ROUTER`
- Environment variable: `HOMELAB_AI_CODING_MCP_URL`
- Secret file: `~/.local/share/opencode/secrets/9router-api-key`

## Deferred Work and Runtime Verification
- **Runtime Verification:** `options.thinking` on `combo-cheap` is a 9Router-specific requirement and must be verified during runtime integration.
- **Runtime Verification:** The `homelab-ai-coding` MCP exposed tool inventory and mutation capabilities must be verified during integrated runtime validation.
- **Deferred Work:** The current global `"skill": "deny"` and `"task": "deny"` settings serve as a temporary conservative base for HARNESS-003.
- **Deferred Work:** HARNESS-004 must define the approved subagent task allowlist.
- **Deferred Work:** HARNESS-005 must define the `engineering-*` skill allowlist.
- **Release Blocker:** The harness must not be considered installation-ready while the build agent remains unable to load approved skills or delegate to approved subagents.

## Validation Checklist
- [x] JSON validation passes
- [x] Repository diff validation passes
- [x] Prohibited residue check passes (found only documented file reference)
- [x] Package dry-run validation passes

## Evidence
- `npm pack --dry-run` successfully packaged `global/opencode.json` while excluding all reference/docs content.
- `rg` found only the expected file-based secret substitution `"{file:~/.local/share/opencode/secrets/9router-api-key}"`.
- JSON structure and `git diff` validated.
- **Corrections applied:**
  - Verified `instructions` is absent.
  - Verified canonical models (`9router/combo-main`, `9router/combo-cheap`) are set.
  - Verified `combo-cheap` modalities are top-level and not inside `options`.
  - Externalized MCP URL to `{env:HOMELAB_AI_CODING_MCP_URL}`.
  - Preserved read-only Git inspection in `bash` block for `plan` agent.
  - Confirmed deferred permission work recorded in Task Plan.
- Validation script `HARNESS-003 structural assertions: PASS` ran successfully.

## Deviations and Blockers
- None

## Current State
- Validations complete. Consolidated final corrections applied and verified.

## Next Action
- Await user approval. Do not begin HARNESS-004.
