---
name: engineering-project-bootstrap
description: Audit a repository and create or refresh project-local engineering instructions without duplicating global rules. Use when initializing project AGENTS.md or reconciling stale project conventions.
compatibility: opencode
---

## Purpose
Establish or update project-local engineering conventions without duplicating the global rules or making unverified assumptions about the architecture.

## When to Load
- When entering a new repository that lacks an `AGENTS.md`.
- When project instructions are visibly stale or conflicting.
- When explicitly requested to bootstrap a project.

## Do Not Load When
- Implementing ordinary feature work or bug fixes.
- The project already has functioning, up-to-date conventions.

## Required Inputs
- None initially. It discovers state through observation.

## Procedure
1. Inspect existing repository instructions, manifests, and conventions.
2. Delegate the read-only audit to the `project-rules-auditor` subagent.
3. Validate the auditor's returned evidence.
4. Distinguish global rules (already enforced by the harness) from project-local specialization.
5. Identify any conflicting, duplicated, missing, or stale instructions.
6. Propose a local `AGENTS.md` structure or update.
7. Stop at the Approval Gate to present findings to the human operator.
8. After explicit approval, use an active Task Plan to execute the creation or update.
9. Create or update only the approved project-local artifacts.
10. Review the final diff to ensure no global rules were duplicated.

## Required Evidence
- Auditor output specifying actual observed paths and commands.
- Diff showing only project-local instruction changes.

## Stop Conditions
- Stop at the Approval Gate after the audit and before any file mutation.
- Stop if the auditor finds no established conventions and requires a human architectural decision.

## Output
- A well-formed project-local `AGENTS.md` or related convention files that defer appropriately to global rules.
- A clean Git diff of the instruction changes.

## Interactions
- **project-rules-auditor**: Receives the delegation to perform a read-only audit of the repository to discover actual rules.
