# Task Plan: HARNESS-008 — Safe Installer, Distribution Foundation, and Technical Debate Design

**Task ID:** HARNESS-008
**Classification:** installer, distribution, design
**Status:** COMPLETE

---

## Approved Objective and Exclusions

**Objective:**
1. Implement a safe, testable local installer CLI for the packaged global artifacts.
2. Document the future multi-agent technical debate capability without implementing it.

**Exclusions:**
- Do not publish the package.
- Do not touch live OpenCode configuration at `~/.config/opencode/`.
- Do not implement technical debate agents, skills, commands, or MCP.
- Do not implement `uninstall` in this increment.
- Do not implement automatic JSON merging for `opencode.json` or `AGENTS.md`.
- Do not begin HARNESS-009 or HARNESS-010.

---

## Documentation Consulted

- `GEMINI.md`, `CONTRIBUTING.md`, `README.md`, `package.json`
- `docs/ARCHITECTURE.md`, `docs/design/001-harness-architecture.md`, `docs/design/002-project-bootstrap-and-distribution.md`
- `references/docs/config.mdx` — confirms global config root: `~/.config/opencode/`
- `references/docs/skills.mdx` — confirms skills location: `~/.config/opencode/skills/<name>/SKILL.md`
- `references/docs/agents.mdx`, `references/docs/commands.mdx`, `references/docs/rules.mdx`
- All HARNESS Task Plans HARNESS-001 through HARNESS-007

---

## Global Artifact Inventory

Source → Target (relative to `<opencode-config-root>`):

```text
global/AGENTS.md                                → AGENTS.md
global/opencode.json                             → opencode.json
global/agents/code-reviewer.md                  → agents/code-reviewer.md
global/agents/project-rules-auditor.md          → agents/project-rules-auditor.md
global/commands/eng-checkpoint.md               → commands/eng-checkpoint.md
global/commands/eng-deliver.md                  → commands/eng-deliver.md
global/commands/eng-incident.md                 → commands/eng-incident.md
global/commands/eng-init-project.md             → commands/eng-init-project.md
global/commands/eng-plan.md                     → commands/eng-plan.md
global/commands/eng-refresh-project-rules.md    → commands/eng-refresh-project-rules.md
global/commands/eng-resume.md                   → commands/eng-resume.md
global/commands/eng-review.md                   → commands/eng-review.md
global/commands/eng-status.md                   → commands/eng-status.md
global/skills/engineering-bdd-discovery/SKILL.md          → skills/engineering-bdd-discovery/SKILL.md
global/skills/engineering-code-review/SKILL.md            → skills/engineering-code-review/SKILL.md
global/skills/engineering-delivery/SKILL.md               → skills/engineering-delivery/SKILL.md
global/skills/engineering-incident-triage/SKILL.md        → skills/engineering-incident-triage/SKILL.md
global/skills/engineering-legacy-change/SKILL.md          → skills/engineering-legacy-change/SKILL.md
global/skills/engineering-project-bootstrap/SKILL.md      → skills/engineering-project-bootstrap/SKILL.md
global/skills/engineering-task-plan/SKILL.md              → skills/engineering-task-plan/SKILL.md
global/skills/engineering-tdd-first/SKILL.md              → skills/engineering-tdd-first/SKILL.md
templates/project/AGENTS.md                              → templates/project/AGENTS.md
templates/project/.opencode/task-plans/README.md         → templates/project/.opencode/task-plans/README.md
```

**Total: 23 artifacts** in 5 categories:

| Category | Count |
|---|---|
| Root configuration files | 2 |
| Agents | 2 |
| Commands | 9 |
| Skills | 8 |
| Templates | 2 |
| **Total** | **23** |

**Excluded from installation:** `references/`, `docs/`, `evals/`, `scripts/`, `.opencode/task-plans/`, `src/` (installer is part of package, not installed artifact).

---

## Install Target Resolution

Resolution order (corrected):
1. `--target <dir>` CLI flag — explicit, never falls back to default
2. `$XDG_CONFIG_HOME/opencode` — when `XDG_CONFIG_HOME` is set and non-empty
3. `$HOME/.config/opencode` — when `HOME` is set (POSIX default)
4. `$USERPROFILE/.config/opencode` — Windows fallback when `HOME` is unset
5. Error: cannot resolve safely

Reject: filesystem root, empty path, traversal outside target, source package dir, invalid types,
any path segment (including the target root or its ancestors) that is a symbolic link.

An explicitly provided `--target` with an empty value is invalid.
`--target` followed by another option flag is invalid.
An explicit target never silently falls back to a default.

---

## Manifest Strategy

Location: `<target>/.engineering-harness/installation.json`

Contents:
- `manifestVersion`: schema version string (`"1"`)
- `packageName`: `@patrese/opencode-engineering-harness`
- `packageVersion`: from `package.json`
- `installedAt`: ISO 8601 timestamp
- `targetRoot`: resolved absolute path
- `artifacts`: array of `{ relativePath, sourceChecksum, installedChecksum }`

Never store: API keys, tokens, env values, private endpoints, file contents, backup data.

Hash algorithm: SHA-256 via Node.js `crypto` built-in.

Manifest states: `missing` | `valid` | `invalid` | `unsafe`

An invalid or unsafe manifest is a blocking conflict for `plan` and `install`.
A missing manifest is not a conflict; it is created during install.

---

## Artifact Classification

Six states:

| Class | Condition | Install Action |
|---|---|---|
| `missing` | File absent | Install |
| `identical` | Target matches package checksum | No-op |
| `managed-outdated` | Target matches old manifest installed checksum, not current | Update |
| `managed-locally-modified` | Target was installed but no longer matches recorded installed checksum | Conflict — preserve |
| `unmanaged-conflict` | Differing file without valid harness ownership | Conflict — preserve |
| `invalid-target` | Unsafe path, symlink, dir/file mismatch | Stop |

---

## Conflict Resolution Matrix for High-Risk Files

`AGENTS.md` and `opencode.json` are user-editable. Apply same classification table — no speculative JSON merging in this increment.

---

## Atomicity and Rollback Strategy

Write sequence (corrected):
1. Validate complete plan — no writes.
2. For each artifact requiring install:
   a. If the target exists, create a collision-resistant backup in the same directory.
   b. Write new content to a collision-resistant temporary path.
   c. Atomically rename the temporary path to the final target path.
   d. Record the completed operation.
3. Write the updated manifest atomically.
4. On success: remove all backup files.
5. On failure at any step:
   - Reverse completed operations: rename backups back to originals; remove newly created files.
   - Remove remaining backup files.
   - Leave the previous manifest unchanged.
   - Report: original error, restored files, removed files, rollback failures.
   - Return nonzero exit code.

**Actual guarantee:** Per-file atomic replacement with best-effort cross-file rollback.
Abrupt process or machine termination may still require a subsequent `check` or recovery operation.

Temporary filenames: `<absTarget>.<16-hex-chars>.harness-tmp`
Backup filenames: `<absTarget>.<16-hex-chars>.harness-backup`
Both names are collision-resistant and do not reuse a fixed suffix.

---

## Symlink Safety

Checked locations:
- Target root and all existing ancestors (via `findSymlinkedAncestor`)
- Every managed parent directory under target root (via `findSymlinkedAncestorUnder`)
- Every managed target file itself (via `isSymlink`)
- The manifest directory and manifest file

The same checks apply to `plan`, `install`, and `check`.
Symlinked paths are never followed for checksum calculation.

---

## install --dry-run Contract

JSON output shape when `--dry-run` is used with `install`:

```json
{
  "command": "install",
  "dryRun": true,
  "target": "<targetRoot>",
  "status": "changes-required" | "up-to-date" | "conflicts",
  "changesRequired": true,
  "artifacts": [ { "target": "...", "class": "...", "reason": null } ],
  "conflicts": [],
  "errors": []
}
```

The target is not modified. The same classification as `plan` is computed and returned, but the JSON preserves the command the user actually invoked (`"install"`).

---

## CLI Parsing Strictness

Valid commands: `plan`, `install`, `check`
Valid options: `--target <dir>`, `--dry-run`, `--json`, `--help`, `--version`

Rules:
- `--dry-run` is valid only with `install`
- `--target` without a value or followed by a flag → exit 3
- Unknown options → exit 3
- Extra positional arguments → exit 3
- Parsing errors never trigger default installation behavior

---

## Template Runtime-Location Decision

After installation, the bootstrap skill must reference the template as a sibling of the installed skills within the global OpenCode configuration root:

```text
<opencode-config-root>/templates/project/AGENTS.md
```

`engineering-project-bootstrap/SKILL.md` states this installed location explicitly.

---

## CLI Command Matrix

Executable name: `opencode-engineering-harness`

| Command | Mutating | Description |
|---|---|---|
| `plan` | No | Show intended actions and conflicts |
| `install` | Yes | Install managed artifacts |
| `check` | No | Compare installed vs packaged |
| `--help` | No | Usage |
| `--version` | No | Print version |

Arguments: `--target <dir>`, `--dry-run` (install only), `--json`

---

## Exit Codes

| Code | Meaning |
|---|---|
| 0 | Success, no conflicts |
| 1 | Check detected drift or missing/invalid manifest |
| 2 | Blocked by conflict |
| 3 | Invalid invocation or target |
| 4 | Unexpected internal failure |

---

## Expected Files

**New:**
- `.opencode/task-plans/HARNESS-008-safe-installer-and-distribution.md` (this file)
- `bin/opencode-engineering-harness.js`
- `src/installer/inventory.js`
- `src/installer/manifest.js`
- `src/installer/classify.js`
- `src/installer/install.js`
- `src/installer/check.js`
- `src/installer/plan.js`
- `src/installer/target.js`
- `src/installer/output.js`
- `tests/installer/installer.test.js`
- `docs/design/003-technical-debate-capability.md`

**Modified:**
- `package.json` (bin, scripts)
- `README.md` (usage documentation)
- `global/skills/engineering-project-bootstrap/SKILL.md` (template installed location)
- `docs/ARCHITECTURE.md` (concise link to design 003)

---

## Validation Evidence

All validations run against temporary directories. The real OpenCode configuration was not touched.

### Test results

```
tests 91 | suites 9 | pass 91 | fail 0
```

Test suites:
1. Inventory integrity (11 tests) — exact counts: 23 total, 2 root, 2 agents, 9 commands, 8 skills, 2 templates
2. Target resolution (15 tests) — explicit, XDG, HOME, rejection of root/empty/traversal/pkg-root
3. Symlink safety (6 tests) — root, ancestor, managed parent, target file, manifest dir, destination preservation
4. Plan read-only (5 tests) — missing all, no writes, JSON shape, manifest state, invalid manifest conflict
5. Install (19 tests) — fresh install, file content, templates, no-op, unrelated preserved, upgrade, conflicts, symlink, dry-run, manifest
6. Rollback (3 tests) — restore pre-install bytes, remove created files, no tmp leftovers
7. Check (7 tests) — missing, no writes, locally modified, clean, JSON, manifest drift, invalid-target state
8. Manifest state (7 tests) — missing, valid, malformed JSON, unsupported version, unsafe symlink, install block, check drift
9. CLI subprocess (19 tests) — help, version, unknown flag, --target edge cases, --dry-run restrictions, unknown command, JSON output, exit codes, XDG resolution

### CLI demo results

```
plan:     command: plan  status: changes-required  manifestState: missing  artifacts: 23  conflicts: 0
dry-run:  command: install  dryRun: true  artifacts: 23  status: changes-required  [target empty PASS]
install:  command: install  status: ok  installed: 23  errors: []
check:    command: check  status: ok  manifestState: valid  counts: {"identical":23}
XDG demo: target inside $XDG_CONFIG_HOME/opencode ✓
```

### Package dry-run

```
34 files  |  122.9 kB unpacked
```

References, task-plans, docs, private books, and debate design excluded. Debate runtime artifacts do not exist.

---

## Deviations

- Inventory count corrected from 24 to 23 (no deviations from the corrected design).
- Target resolution expanded to XDG → HOME → USERPROFILE (improved from HOME only).
- Rollback upgraded from temp-file deletion only to full backup-based restoration.
- Manifest state model expanded from binary valid/null to four states.
- CLI parsing hardened to strict mode (unknown options, invalid combinations rejected).
- install --dry-run now returns install-shaped JSON (command=install, dryRun=true).
- Package-root rejection added to all three commands.
- Symlink checking extended to managed parent directories under target root.

---

## Known Limitations

- `uninstall` is not implemented.
- Automatic JSON merging for `opencode.json` or `AGENTS.md` is not implemented.
- Rollback guarantee is best-effort: abrupt process termination may leave partial state requiring `check` and manual recovery.
- XDG_DATA_HOME is not consulted (OpenCode uses XDG_CONFIG_HOME only).
- Installer is not yet distributed from the homelab or published to a registry.

---

## Current Status

**COMPLETE.** All validations pass. Committed and pushed.
