# HARNESS-021 — Permission Hardening (opencode.json)

- Classification: refactoring
- Status: COMPLETE
- Scope: Replace wildcard `"*": "allow"` with granular permissions
- Evidence: Commit `f50d4e3`
- Outcome: `read/glob/grep/list/question: allow`, `edit/bash/skill/task/external_directory: ask`
