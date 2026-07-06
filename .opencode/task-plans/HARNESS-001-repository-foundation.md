# Task Plan: HARNESS-001 — Repository Foundation

**Task ID:** HARNESS-001  
**Classification:** structural repository setup (non-TDD)  
**Status:** COMPLETE  
**Approval evidence:** Explicit user request — HARNESS-001 task description, 2026-06-16  

---

## Approved Objective

Establish the minimal, safe, versionable foundation of the OpenCode Engineering Harness repository.

Prepare the repository for future implementation without creating functional installer behavior,
agents, skills, commands, registries, services, or live OpenCode configuration changes.

---

## Approved Scope

1. Create this Task Plan at `.opencode/task-plans/HARNESS-001-repository-foundation.md`
2. Create or refine `.gitignore`
3. Create `package.json` (minimal, valid)
4. Ensure planned directory structure exists
5. Create missing root-level documentation: `README.md`, `CONTRIBUTING.md`, `docs/ARCHITECTURE.md`
6. Validate: `git status --short`, `git diff --check`, `package.json` JSON parse, `npm pack --dry-run`
7. Review complete diff
8. Report

---

## Explicit Exclusions

- No functional CLI
- No installer logic (install, update, diff, doctor, uninstall, rollback)
- No `opencode.json` merge logic
- No agents, subagents, skills, commands, plugins, hooks
- No vector memory, databases, Verdaccio, Docker, web servers
- No npm dependencies or devDependencies
- No tests for behavior that does not exist
- No package publication or release tarballs
- No live installation or `~/.config/opencode` modifications
- No changes outside this repository
- No `git commit`, `git push`, branch deletion, or destructive Git commands
- No `npm install`, `npm publish`, or remote `npx`

---

## Pre-existing Repository State (observed 2026-06-16T18:54Z)

**Branch:** `main`  
**Commits:** none (fresh repository)  
**Remote:** `origin /srv/git/opencode-engineering-harness.git`  
**Untracked:** `GEMINI.md`, `docs/`, `global/`, `references/`

**Directories already present:**
- `bin/` (empty)
- `src/commands/`, `src/config/` (both empty)
- `global/` with `AGENTS.md`, `agents/`, `commands/`, `skills/`
- `templates/project/.opencode/task-plans/` (empty)
- `evals/cases/`, `evals/expected/`, `evals/fixtures/`, `evals/reports/` (all empty)
- `scripts/` (empty)
- `docs/design/` with `001-harness-architecture.md`, `002-project-bootstrap-and-distribution.md`
- `docs/decisions/` (empty)
- `references/books/` with 17 PDFs and `MANIFEST.md`
- `references/docs/` with 36 MDX files and `MANIFEST.md`
- `references/current-state/` with `opencode.notebook.redacted.jsonc`

**Files NOT present (to be created):**
- `.gitignore`
- `package.json`
- `README.md`
- `CONTRIBUTING.md`
- `docs/ARCHITECTURE.md`
- `.opencode/task-plans/` directory (being created now)
- `releases/` directory

---

## Expected Files After This Microincrement

| File/Directory | Action |
|---|---|
| `.opencode/task-plans/HARNESS-001-repository-foundation.md` | CREATE |
| `.gitignore` | CREATE |
| `package.json` | CREATE |
| `README.md` | CREATE |
| `CONTRIBUTING.md` | CREATE |
| `docs/ARCHITECTURE.md` | CREATE |
| `releases/` | CREATE (directory) |

All pre-existing files and directories preserved without modification.

---

## Validation Commands

```bash
git status --short
git branch --show-current
git remote -v
git diff --check
node -e "JSON.parse(require('fs').readFileSync('package.json', 'utf8')); console.log('package.json: valid JSON')"
npm pack --dry-run --ignore-scripts
```

---

## Implementation Checklist

- [x] Read GEMINI.md
- [x] Inspect repository root, Git status, branch, remotes
- [x] Read existing documentation (design docs, AGENTS.md, reference manifests)
- [x] Identify pre-existing changes and structure
- [x] Create Task Plan at `.opencode/task-plans/HARNESS-001-repository-foundation.md`
- [x] Create `.gitignore`
- [x] Create `package.json`
- [x] Create `releases/` directory (with `releases/README.md`)
- [x] Create `README.md`
- [x] Create `CONTRIBUTING.md`
- [x] Create `docs/ARCHITECTURE.md`
- [x] Run validation commands and record evidence
- [x] Review complete diff
- [x] Report results
- [x] **Corrective verification (2026-06-16T19:38Z):** Search all files for obsolete HARNESS-002/legacy prompt references; correct one instance found in `docs/design/002-project-bootstrap-and-distribution.md`; run `git add --intent-to-add`; validate full diff; confirm no secrets, no binaries, no tgz in diff; run final `npm pack --dry-run`

---

## Evidence

**2026-06-16T18:58Z — Git state before changes:**

```
branch: main
no commits
remote: origin /srv/git/opencode-engineering-harness.git
untracked: GEMINI.md, docs/, global/, references/
```

**2026-06-16T18:58Z — Validation results:**

```
git status --short: all new files appear as untracked (??), as expected
git branch --show-current: main
git remote -v: origin /srv/git/opencode-engineering-harness.git
git diff --check: exit 0, no output (PASS)
node JSON.parse(package.json): "package.json: valid JSON" (PASS)
npm pack --dry-run: 3 files — README.md, global/AGENTS.md, package.json
  (bin/, src/, templates/ excluded because empty; references/, docs/,
   .opencode/, releases/ excluded by package files field — PASS)
```

**2026-06-16T18:58Z — .gitignore verification:**

```
references/books/10_NUCLEO_AI_Engineering.pdf: IGNORED (line 79: references/books/*.pdf) — PASS
references/books/MANIFEST.md: NOT ignored (exit 1) — PASS
references/docs/agents.mdx: NOT ignored (exit 1) — PASS
references/current-state/opencode.notebook.redacted.jsonc: NOT ignored (exit 1) — PASS
```

**2026-06-16T19:38–19:39Z — Corrective verification:**

Searched all project files for `build.txt`, `plan.txt`, `HARNESS-002`, and legacy prompt references.

Matches found:

| File | Line | Content | Classification |
|---|---|---|---|
| `docs/design/002-project-bootstrap-and-distribution.md` | 208 | `"prompt": "{file:.../build.txt}"` | Code example — read-only, accurate, retained |
| `docs/design/002-project-bootstrap-and-distribution.md` | 216 | `HARNESS-002 — Audit and reconcile legacy Build and Plan prompts` | **Obsolete identifier** — corrected |
| `references/docs/agents.mdx` | 159 | `"prompt": "{file:./prompts/build.txt}"` | Official OpenCode docs — read-only, not touched |
| `references/current-state/opencode.notebook.redacted.jsonc` | 82 | `build.txt` path | Live config snapshot — read-only, not touched |
| `references/current-state/opencode.notebook.redacted.jsonc` | 92 | `plan.txt` path | Live config snapshot — read-only, not touched |

Correction applied: `docs/design/002-project-bootstrap-and-distribution.md` L213–217
- Replaced `HARNESS-002 — Audit and reconcile legacy Build and Plan prompts`
- With `[BACKLOG] — Audit and reconcile legacy Build and Plan prompts`
- Added note that `HARNESS-002` is reserved for CLI scaffold
- Historical reasoning (section 2) preserved intact — it is accurate

`git add --intent-to-add .` executed to make untracked files visible to diff (no content staged).

`git diff --check`: trailing whitespace found in pre-existing files only:
- `global/AGENTS.md` (CRLF line endings, pre-existing)
- `references/books/MANIFEST.md` (trailing spaces, pre-existing)
- `references/docs/MANIFEST.md` (trailing spaces, pre-existing)

All HARNESS-001-created files: `git diff -- [created files] --check` → exit 0, **PASS**

`git diff --stat`: 50 files, 15,988 insertions, 0 deletions

Secret scan on HARNESS-001 diff: only documentation references to secrets policy — no actual credentials, tokens, or keys

PDF exclusion: `git ls-files references/books/*.pdf` = 0 (all ignored, **PASS**)

Tgz exclusion: no `.tgz` or `.tar.gz` in diff (**PASS**)

`npm pack --dry-run --ignore-scripts`: unchanged — 3 files, 8.7 kB (**PASS**)

`node JSON.parse(package.json)`: `package.json: valid JSON` (**PASS**)

---

## Deviations

None so far.

---

## Failures

None so far.

---

## Blockers

None.

---

## Current State

HARNESS-001 corrective verification complete. All validations passed.
Ready for delivery (commit).

---

## Next Action

User approves commit. Recommended message:

```
feat(foundation): establish HARNESS-001 repository foundation

- Add .gitignore (node_modules, build, coverage, env, editor, OS,
  npm tarballs; reference PDFs excluded, manifests tracked)
- Add package.json (minimal ESM, private, no deps, no bin yet)
- Add README.md, CONTRIBUTING.md, docs/ARCHITECTURE.md
- Create .opencode/task-plans/ and HARNESS-001 task plan
- Create releases/README.md (directory placeholder)
- Correct obsolete HARNESS-002 identifier in design doc 002
  (reserved for CLI scaffold; prompt audit moved to [BACKLOG])

No functional CLI, installer, agents, skills, or commands added.
No live OpenCode configuration modified.
No dependencies installed.
```

Do not start HARNESS-002 without renewed approval.
