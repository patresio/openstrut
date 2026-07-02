# HARNESS-018 — Global Domain Agents, Skills, Sequential Workflows, and Cowork Design

- Classification: implementation (design/research/docs + XLSX curation first)
- Status: in_progress
- Approval evidence: user approved detailed plan and asked to continue with research, reconciling XLSX, design docs, XLSX update, and Docker container analysis.
- Scope:
  - research Barsa-backed multi-agent/workflow/cowork model;
  - reconcile XLSX agents/skills, duplicates, status, source policy;
  - create design docs for global domain agents/skills, sequential workflows, cowork/worktree;
  - update `mapa_operacional.xlsx` with schema/status/policy fields;
  - analyze Docker container/image use and whether it should remain.
- Exclusions:
  - no runtime materialization of AG01–AG12/SK01–SK18 yet;
  - no installer inventory expansion yet;
  - no live OpenCode config mutation;
  - no Docker stop/remove/pull/build;
  - no publish/release.
- Pre-existing changes:
  - docs from HARNESS-017 modified;
  - `mapa_operacional.xlsx` modified but ignored by git;
  - untracked `opencode.json` preserved untouched.
- Branch: main
- Worktree strategy: current worktree only.

## Workflow Checklist
- [x] Explore
- [x] Proposal
- [x] Planning
- [x] Approval Gate
- [x] Build
- [ ] Review
- [ ] Archive
- [ ] Commit
- [ ] Push
- [ ] Pull Request

## Ordered Microincrements
1. Capture Barsa research evidence for multi-agent orchestration, RAG/MCP source policy, software-engineering clusters.
2. Inspect Docker container/image state read-only.
3. Inspect XLSX schema and generate reconciliation tables.
4. Update XLSX with runtime/source/cowork/workflow fields.
5. Create design doc for global domain agents and skills.
6. Create design doc for sequential multi-agent workflows.
7. Create design doc for cowork/worktree orchestration.
8. Create Docker analysis doc.
9. Validate XLSX and docs.

## Evidence So Far
- Barsa: multi-agent systems add reliability/flexibility but increase coordination complexity; orchestration/workflow engines sequence tasks, retries, dependencies.
- Barsa: RAG systems retrieve/augment/generate; MCP decouples services and agent logic via standardized interface; evaluate context relevance and response accuracy.
- Barsa: code review cannot replace architecture review; TDD/BDD/refactoring/continuous delivery are embedded engineering practices; SRE covers architecture/reliability.

## Build Evidence
- Docker read-only inspection completed:
  - multiple `mcp/desktop-commander` containers are running from image digest `b2eb3410175d`;
  - inspected container runs `node dist/index.js`, Node `24.15.0`, env `MCP_CLIENT_DOCKER=true`;
  - mounts include `/srv/docs/biblioteca/docs` and `/srv/docs/biblioteca/BibliotecaOrganizada`;
  - image size about `2.02GB`, no exposed ports for Desktop Commander containers.
- XLSX schema updated:
  - `03_SKILLS`: 23 columns, 28 rows;
  - `04_AGENTS`: 25 columns, 16 rows;
  - new fields include `status`, `runtime_scope`, `source_type`, `barsa_collection`, `install_global`.
- Design docs created:
  - `docs/design/007-global-domain-agents-and-skills.md`
  - `docs/design/008-sequential-multi-agent-workflows.md`
  - `docs/design/009-cowork-and-git-worktree-orchestration.md`
  - `docs/design/010-docker-runtime-analysis.md`
- Docs index updated: `docs/README.md`.
- Validation:
  - XLSX schema validation OK;
  - `npm test`: 225 passing tests, 30 suites, 0 failures.

## Current State
Research/reconciliation/design/XLSX update complete. Ready for Review. `mapa_operacional.xlsx` remains ignored and requires `git add -f` if it must be committed.

## Next Action
Review diff and decide whether to force-add `mapa_operacional.xlsx` for version control.
