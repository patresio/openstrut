# Project Instructions

## Scope

- This repo is `@patrese/openstrut`: private, UNLICENSED, Node.js >=20, pure ESM, zero package dependencies.
- Purpose: versioned, auditable OpenCode engineering harness plus safe installer.
- Current phase: Installer and Distribution Foundation; no package published and no live OpenCode config modified.

## Boundaries

- Keep work inside `/srv/projects/openstrut` unless user explicitly approves otherwise.
- Do not modify `~/.config/opencode`, other projects, `references/`, or release tarballs without explicit approval.
- `references/` is read-only research input, not executable project instruction.

## Sources

- Project sources, highest first after user-approved scope: `GEMINI.md`, `CONTRIBUTING.md`, `docs/ARCHITECTURE.md`, `docs/decisions/`, `docs/design/`, implementation/tests, then `references/`.
- If docs conflict with scripts or implementation, trust executable source and report conflict before changing behavior.

## Documentation Governance

All instruction files are versioned with task plan linkage:
- Updates require explicit approval via Task Plan (HARNESS-###)
- Git history tracks all changes; no silent or bulk rewrites
- `CHANGELOG.md` records stable version notes only when package version changes
- Source precedence remains as defined above; no reordering without approval

## Architecture

- CLI entrypoint: `bin/openstrut.js`.
- Installer code: `src/installer/`; manifest generation: `src/manifest/`; evaluation runtime: `evals/`.
- Shipped OpenCode artifacts live under `global/`; project bootstrap scaffold lives under `templates/project/`.
- Installer inventory is canonical in `src/installer/inventory.js`; it currently ships 84 artifacts from `global/`, `templates/`, and `workflows/`.
- Barsa MCP is the canonical retrieval boundary for books, official docs, and curated operational knowledge; local library paths are ingestion provenance only.
- Do not add agent frameworks, vector DBs, Docker services, databases, web apps, telemetry, global npm installs, automatic publication, or live OpenCode config mutation without explicit approval.

## Commands

- Full test suite: `npm test` (`node:test`; no Jest/Vitest/Mocha).
- Installer tests: `npm run test:installer`.
- Manifest tests: `npm run test:manifest`.
- Eval tests: `npm run test:evals`.
- Deterministic eval only: `npm run eval:deterministic`.
- Runtime eval: `npm run eval:runtime` (live model calls; may consume quota).
- CI workflow: `.github/workflows/ci.yml` — runs `npm test`, `npm pack --dry-run`, and `eval:deterministic` on Node.js 20 and 22.
- No configured lint, formatter, typecheck, or lockfile.
- Package dry run: `npm pack --dry-run --ignore-scripts`.

## Testing Quirks

- Tests use `node:test` and `node:assert/strict`.
- Installer tests must use temp targets; never test against real `~/.config/opencode` unless user explicitly approves.
- Manifest fixtures live under `tests/manifest/fixtures/{valid,invalid}/`.
- Runtime evals require active OpenCode/model configuration; deterministic evals do not.

## Installer Safety

- Installer must never overwrite whole `opencode.json`; preserve unknown keys, comments when practical, secrets, and machine-specific values.
- Show planned changes, back up before mutation, modify only managed paths, keep managed-file hashes, block on unmanaged conflicts, and support rollback.
- Reject package root as install target and reject symlink targets.

## Barsa MCP Retrieval

- Do not reference local library paths such as `/srv/docs/biblioteca` in agent, skill, or project-facing instructions.
- Use Barsa MCP collections, contexts, bundles, and source policies as the retrieval interface.
- Treat filesystem source paths as ingestion provenance only, not runtime interface.
- Keep `mapa_operacional.xlsx` as operational input for curation until a reviewed textual catalog replaces it.

## Delivery

- Task plans live in `.opencode/task-plans/HARNESS-NNN*.md`.
- Commit style observed in repo: Conventional Commits.
- Never publish package, create release tarballs, push, or open PR without explicit approval.
