---
name: opentrust-delivery
description: Prepare commit, push, and pull request using Conventional Commits in English. Avoid unrelated files.
---

## When to Use This Skill

When approved work is ready for version control and delivery.

## Workflow

1. Inspect `git status`, `git diff`, and recent history.
2. Stage only intended files. Exclude secrets, generated artifacts, and unrelated changes.
3. Write a Conventional Commit message in English:
   - `feat:` for features
   - `fix:` for bugfixes
   - `docs:` for documentation
   - `refactor:` for behavior-preserving refactoring
   - `chore:` for maintenance
4. Commit. Do not amend, force-push, or use `-i`.
5. When requested: push, create or update PR.

## Output

- Committed diff
- Push/PR confirmation when applicable

## Rules

- Only deliver approved scope.
- Never include unrelated files.
- Reference `docs/opencode/WORKFLOW.md` for ship phase.
