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
1. Inspect existing project files before selecting a template.
2. Delegate the read-only audit to the `project-rules-auditor` subagent.
3. Validate the auditor's returned evidence.
4. Distinguish global rules (already enforced by the harness) from project-local specialization.
5. Treat `templates/project/AGENTS.md` as structure only. Omit template sections unsupported by evidence.
6. Validate every populated rule against repository evidence.
7. Preserve valid existing rules. Do not replace an existing `AGENTS.md` with the template.
8. Create a new local `AGENTS.md` only when: the project lacks one, the audit establishes sufficient evidence, and the proposed contents are approved.
9. Update an existing file through a focused diff.
10. Do not create `CONTRIBUTING.md` unless: repository contribution mechanics justify it, no suitable file already exists, and its creation is explicitly included in the approved plan.
11. Inspect existing project contribution documentation; commitlint, release, changelog, CI, and PR-template configuration; and a representative recent Git history for a consistent commit convention.
12. Treat repository configuration and documented policy as stronger evidence than examples from history. Preserve an established project convention, and report inconsistent or conflicting conventions.
13. When no reliable convention exists, present one or more proposals at the Approval Gate. Never apply a commit convention silently.
14. Keep the local `AGENTS.md` rule concise and refer to `CONTRIBUTING.md` when detailed rules already live there.
15. Stop at the Approval Gate to present findings to the human operator.
16. After explicit approval, use an active Task Plan to execute the creation or update.
17. Ensure the final project file contains no template comments, fake values, or unresolved placeholders represented as facts.

## Required Evidence
- Auditor output specifying actual observed paths and commands.
- Source path for every authoritative command.
- Source path for architecture, domain, security, and delivery rules.
- Explicit identification of inferred or unresolved items.
- The source of the detected commit convention, and representative Git history evidence when history was used.
- Commitlint, release, changelog, CI, or contribution-file paths when present.
- Explicit classification as verified, inconsistent, absent, or proposed.
- Final diff showing only project-local instruction changes.

## Stop Conditions
- Stop at the Approval Gate after the audit and before any file mutation.
- Stop if the auditor finds no established conventions and requires a human architectural decision.
- Stop if repository evidence is insufficient to create reliable local instructions.

## Output
- A well-formed project-local `AGENTS.md` or related convention files that defer appropriately to global rules.
- A clean Git diff of the instruction changes.

## Interactions
- **project-rules-auditor**: Receives the delegation to perform a read-only audit of the repository to discover actual rules.
