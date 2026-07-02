# HARNESS-017 — Global Agents and Skills Documentation

- Classification: implementation (documentation-only)
- Status: in_progress
- Approval evidence: user requested detailed documentation for global agents and skills using Barsa MCP.
- Scope: document existing global agents and skills; explain what was done with `mapa_operacional.xlsx`; cite Barsa MCP as retrieval boundary.
- Exclusions: no new agents/skills materialized; no changes to live OpenCode config; no package publish.
- Branch: main
- Worktree strategy: current worktree only

## Workflow Checklist
- [x] Explore
- [x] Proposal
- [x] Planning
- [x] Approval Gate
- [ ] Build
- [ ] Review
- [ ] Archive
- [ ] Commit
- [ ] Push
- [ ] Pull Request

## Evidence
- `docs/barsa/agents.md`: 12 domain agents cataloged from `mapa_operacional.xlsx` sheet `04_AGENTS`, not installed globally.
- `docs/barsa/skills.md`: 18 domain skills cataloged from `mapa_operacional.xlsx` sheet `03_SKILLS`, not installed globally.
- Barsa MCP query confirmed OpenCode has native `build` and `plan`, and skills/agents are documented OpenCode concepts.
- Local spreadsheet inspection confirmed sheets `03_SKILLS` and `04_AGENTS` with detailed contracts.

## Spreadsheet Update Evidence
- `mapa_operacional.xlsx` sheet `03_SKILLS`: appended `SK19`–`SK27` for the 9 harness-global engineering skills.
- `mapa_operacional.xlsx` sheet `04_AGENTS`: appended `AG13`–`AG15` for the 3 harness-global agents.
- Native OpenCode agents `build` and `plan` were intentionally not added.
- `mapa_operacional.xlsx` is ignored by `.gitignore`, so it requires `git add -f mapa_operacional.xlsx` if it must be committed.

## Current State
Docs updated and spreadsheet updated locally. Barsa summaries synchronized with 27 skills and 15 agents.

## Next Action
Validate docs/status and ask whether to force-add ignored spreadsheet for commit.
