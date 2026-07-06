# ADR-003: SDD Change Execution Manifest

**Status:** Accepted  
**Date:** 2026-06-18  
**Author:** Build Agent (derived from HARNESS-010/011 design)

## Context
The Specification-Driven Development (SDD) workflow converts informal user requests into verifiable technical specifications before any production code. The change execution manifest bridges specification and implementation.

## Decision
- SDD agent (`sdd`) is a **primary agent** with read-only permissions on production code; writes only to `openspec/changes/`, `specs/`, `docs/`, `.opencode/task-plans/`.
- SDD workflow: Discover → Domain → Scope → Draft → Examples → Test Strategy → Task Decomposition → Rules Audit → Consolidated Revision → **Approval Gate**.
- Change Execution Manifest (`execution-manifest.yaml`) is generated deterministically from `tasks.md` and `proposal.md` with approval frontmatter.
- Manifest format: YAML with `schema_version`, `change`, `approval`, `tasks` array.
- Five task ID, agent, skills, dependency, and parallel group requirements block on missing/invalid data.

## Consequences
- No production code is written before specification approval.
- Deterministic manifest ensures byte-for-byte reproducibility.
- Build agent handoff requires explicitly approved change.

## Alternatives
- LLM-generated manifest (rejected: non-deterministic).
- Direct build-from-conversation (rejected: no audit trail).
