# ADR-001: Installer Safety and Managed Inventory

**Status:** Accepted  
**Date:** 2026-06-16  
**Author:** Build Agent (derived from HARNESS-008 design)

## Context
The harness installer must deploy 72+ artifacts (agents, skills, commands, workflows, templates) into the global OpenCode configuration directory (`~/.config/opencode/`). It must never overwrite user configuration, secrets, or machine-specific values.

## Decision
- Installer uses a **manifest-based approach** with SHA-256 checksums stored in `.openstrut/installation.json`.
- Six artifact classification states: `missing`, `identical`, `managed-outdated`, `managed-locally-modified`, `unmanaged-conflict`, `invalid-target`.
- Atomic per-file writes via POSIX rename. Best-effort cross-file rollback.
- Symlink target rejection, package-root rejection, explicit target resolution (CLI flag → XDG → HOME).
- `opencode.json` and `AGENTS.md` are treated as user-editable managed artifacts: block on conflict, never overwrite without backup.

## Consequences
- Preserves user customizations and machine-specific values.
- Requires manual conflict resolution when managed files are locally modified.
- Cross-file atomicity is best-effort; abrupt termination may leave partial state requiring `check` command.

## Alternatives
- Blind overwrite (rejected: destructive).
- Full JSON merge (deferred: complex, risk of comment/secret loss).
