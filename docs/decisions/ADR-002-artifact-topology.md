# ADR-002: OpenCode Artifact Topology

**Status:** Accepted  
**Date:** 2026-06-16  
**Author:** Build Agent (derived from HARNESS-001/004 design)

## Context
The harness must organize agents, skills, commands, workflows, and templates into a predictable, versionable structure for both development and installation.

## Decision
- **Global artifacts** under `global/`:
  - `agents/` — agent definitions (21 agents: AG01-AG21)
  - `skills/` — skill definitions (39 skills: SK01-SK39)
  - `commands/` — command definitions (10 eng-* commands)
- **Workflows** under `workflows/` (8 workflow YAML files)
- **Templates** under `templates/project/` (project bootstrap scaffold)
- **Installation target** mirrors this structure under `~/.config/opencode/`
- Package includes `bin/`, `src/`, `global/`, `templates/`, `workflows/`
- Excludes `references/`, `evals/`, `docs/`, `releases/`, `.opencode/`, task plans

## Consequences
- Clear separation between source (repository) and install (config directory).
- Task plans live outside package under `.opencode/task-plans/`.
- No duplicative `src/commands/` or similar mirroring.

## Alternatives
- Monolithic single-file config (rejected: poor maintainability).
- Generated runtime config from DB (rejected: over-engineering).
