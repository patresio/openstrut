# OPENTRUST-003 — Runtime Coherence Reorganization Plan

## Objective
Make the installed OpenTrust runtime coherent, self-contained, and usable from any project after `openstrut install`.

## Current Problem
The current runtime installs agents, commands, skills, workflows, and config, but several artifacts still assume repository-local paths or legacy runtime components.

Observed issues:
- `global/opencode.json` references `docs/opencode/*`, but no docs are installed into `~/.config/opencode`.
- `/ot-*` commands instruct agents to load `docs/opencode/*`, which resolves incorrectly in user projects.
- primary OpenTrust lead agent files deny `task`, while `global/opencode.json` allows `task`; this blocks delegation and creates a source-of-truth conflict.
- installed workflows reference legacy agents and skills that are no longer in the install inventory.
- many runtime prompts over-emphasize Barsa/retrieval and can loop in retrieval instead of executing repository work.
- documentation still mixes repo design docs, installed runtime docs, and legacy workflow language.

## Sources of Truth
1. User-approved goal in this session.
2. Official OpenCode config schema and customization rules.
3. `global/opencode.json` as installable runtime config source.
4. `src/installer/inventory.js` as installable artifact source of truth.
5. `docs/opencode/*` as source documentation to package into runtime form.

## Out of Scope
- Changing provider credentials or model settings.
- Changing Barsa MCP server config beyond prompt policy.
- Publishing until all validations pass and user approves release.
- Removing the three preserved OpenTrust subagents: `code-reviewer`, `compliance-auditor`, `release-manager`.
- Editing user project configs outside this repository, except final explicit `openstrut install` verification if approved.

## Target Runtime Layout
Installed under `~/.config/opencode`:

```text
AGENTS.md
opencode.json
agents/*.md
commands/ot-*.md
skills/opentrust-*/SKILL.md
opentrust/
  docs/
    TEAM_TOPOLOGY.md
    WORKFLOW.md
    TASK_CONTRACT.md
    PERMISSIONS.md
    OBSERVABILITY.md
    OPERATIONAL_RETRIEVAL_MAP.md
    REFERENCE_PROFILES.md
  reference-map/
    README.md
    TEAM_CONTEXT_MATRIX.md
    MCP_PROVIDER_CONTRACT.md
workflows/   # only if coherent with installed agents/skills
```

Decision: use `opentrust/` instead of `docs/opencode/` inside installed runtime to avoid collision with a user's project `docs/` directory.

## Acceptance Criteria
- `openstrut install` installs a self-contained OpenTrust runtime.
- Installed `opencode.json.instructions` references only installed files.
- Installed `opencode.json.references` references only installed directories.
- `/ot-*` commands do not require repository-local paths.
- primary leads can delegate to installed subagents.
- workflows either reference only installed agents/skills or are not installed.
- Barsa retrieval is used only by policy, not as default loop.
- tests fail before fix for at least one current coherence issue and pass after fix.
- `npm test`, `npm run validate:opentrust`, `npm pack --dry-run --ignore-scripts`, and temp install smoke pass.
- docs and release notes describe the final install/runtime layout.

## Microincrements

### Phase 1 — Runtime docs packaging
Files likely touched:
- `src/installer/inventory.js`
- `global/opencode.json`
- `tests/installer/installer.test.js`
- `tests/package/metadata.test.js` if package metadata expectations change

Actions:
1. Add install inventory entries mapping source docs to `opentrust/docs/*` and `opentrust/reference-map/*`.
2. Update `global/opencode.json.instructions` from `docs/opencode/*` to `opentrust/docs/*`.
3. Update `global/opencode.json.references` from `docs/opencode/*` to `opentrust/*`.
4. Add tests asserting all instruction/reference paths are installed.

Validation:
- focused inventory tests
- `npm test`

### Phase 2 — Permission source-of-truth cleanup
Files likely touched:
- `global/agents/*.md`
- `global/opencode.json`
- `tests/global/permission-hardening.test.js`

Actions:
1. Remove or align frontmatter `permission:` blocks in lead agent files.
2. Keep `global/opencode.json` as source of runtime permission truth.
3. Ensure primary leads that orchestrate work have `task: allow` where intended.
4. Ensure subagents keep `task: deny`.
5. Add/adjust tests for no file-vs-config task permission conflict.

Validation:
- `npm test`
- temp install smoke verifying trust-lead can see/use subagents by config shape

### Phase 3 — Command prompt coherence
Files likely touched:
- `global/commands/ot-explore.md`
- `global/commands/ot-propose.md`
- `global/commands/ot-apply.md`
- `global/commands/ot-review.md`
- `global/commands/ot-ship.md`
- `global/commands/ot-status.md`
- `global/commands/ot-incident.md`
- tests for command integrity

Actions:
1. Replace `Load docs/opencode/*` with installed runtime paths or embedded workflow instructions.
2. Make commands action-oriented and explicit about when to use Barsa.
3. Add rule: do not call Barsa unless task contract or uncertainty requires external/reference knowledge.
4. Add tests asserting `/ot-*` commands do not reference missing paths.

Validation:
- command integrity tests
- temp install smoke

### Phase 4 — Workflow coherence
Files likely touched:
- `src/installer/inventory.js`
- `workflows/*.yaml`
- `tests/workflows/validate.test.js`
- `tests/installer/installer.test.js`

Decision point:
- Option A: remove legacy workflows from install inventory until rewritten.
- Option B: rewrite workflows to OpenTrust agents/skills only.

Recommended first pass:
- Remove workflows from install inventory if they cannot be made coherent in one small diff.
- Keep source workflows in repo for later migration.

Acceptance:
- every installed workflow references only installed agents/skills.
- if no coherent workflows remain, no workflows are installed.

### Phase 5 — Barsa/retrieval prompt policy cleanup
Files likely touched:
- `global/agents/*.md`
- `global/skills/opentrust-*/SKILL.md`
- `global/commands/ot-*.md`
- `docs/opencode/OPERATIONAL_RETRIEVAL_MAP.md`

Actions:
1. Rewrite agent boundaries so normal project work starts with local evidence.
2. Retrieval becomes conditional: use when selectors are approved or domain knowledge is needed.
3. Knowledge team remains retrieval coordinator, but trust-lead should coordinate execution, not loop in Barsa.
4. Add lightweight tests for banned phrases like “must call retrieval provider” in non-knowledge agents.

### Phase 6 — Documentation update
Files likely touched:
- `README.md`
- `docs/usage/installation/README.md`
- `docs/usage/commands.md`
- `docs/usage/agents.md`
- `docs/usage/skills.md`
- `docs/opencode/ACTIVATION_PLAN.md`
- `CHANGELOG.md`
- `package.json`

Actions:
1. Document installed runtime layout under `~/.config/opencode/opentrust/`.
2. Document `ot-*` workflow behavior.
3. Document Barsa usage policy: conditional, not default.
4. Bump version to next patch after fix.
5. Update release notes.

### Phase 7 — Release
Actions:
1. Run full validation:
   - `npm test`
   - `npm run validate:opentrust`
   - `npm pack --dry-run --ignore-scripts`
   - temp install smoke
2. Commit coherent diff.
3. Push branch.
4. Open PR.
5. Merge after approval.
6. Tag and create GitHub Release with `.tgz` asset.
7. Install release tarball into local `~/.config/opencode` only after explicit final approval.

## Test Plan
Add/extend tests for:
- all `opencode.json.instructions` are installed targets;
- all `opencode.json.references.path` directories are installed targets;
- no installed command references missing `docs/opencode/*` paths;
- no primary lead file conflicts with inline config task permission;
- installed workflows reference only installed agents and skills;
- Barsa/retrieval is not mandatory in non-knowledge runtime prompts;
- temp install produces expected runtime layout.

## Validation Commands
```bash
npm test
npm run validate:opentrust
npm pack --dry-run --ignore-scripts
node bin/openstrut.js install --target /tmp/opencode-opentrust-coherence
node bin/openstrut.js check --target /tmp/opencode-opentrust-coherence
```

## Current State
Branch created: `chore/opentrust-runtime-coherence`.
Explore complete. No runtime artifacts edited yet.

## Next Action
Start Phase 1 with RED tests for missing installed instruction/reference paths.
