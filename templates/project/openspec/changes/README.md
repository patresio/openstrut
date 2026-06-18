# OpenSpec Changes

This directory contains specifications for upcoming and active changes, following the Specification-Driven Development (SDD) workflow.

## Structure
Each change should have its own directory using a stable slug (e.g., `feature-user-login/`):

```text
openspec/changes/<change-slug>/
├── proposal.md          # Context, scope, and domain rules
├── tasks.md             # TDD-friendly microincrements
└── specs/
    └── <capability>/
        └── spec.md      # Behavioral specs, invariants, and Given/When/Then examples
```

## Workflow
1. The `sdd` agent creates the change specification.
2. The `project-rules-auditor` validates it against `AGENTS.md`.
3. The user approves it at the Approval Gate.
4. The `build` agent executes it incrementally.
