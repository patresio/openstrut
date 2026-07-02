# Commands

Commands are workflow entry points installed under `commands/` in the OpenCode configuration.

## Current Commands

### `/eng-spec-change`

Agent: `sdd`

Purpose: start the SDD workflow for a change before implementation.

Use when:

- you need OpenSpec artifacts;
- you want approval before code;
- the change needs scope, constraints, acceptance criteria, and tasks.

Example:

```text
/eng-spec-change Force password change on first login. Do not implement code.
```

Stops at: Approval Gate.

### `/eng-init-project`

Agent: `build`

Purpose: initialize project-local engineering instructions safely.

Use when:

- entering a real project repository;
- creating or refreshing local `AGENTS.md`;
- establishing authoritative commands and architecture boundaries.

Expected internal flow:

1. load `engineering-project-bootstrap`;
2. delegate repository audit to `project-rules-auditor`;
3. propose localized project rules;
4. stop at Approval Gate.

### `/eng-plan`

Purpose: structure implementation planning after exploration.

Use when:

- scope is understood;
- implementation is not approved yet;
- the next step is turning evidence into a plan.

### `/eng-review`

Purpose: trigger review-oriented workflow before delivery.

Use when:

- implementation exists;
- validation evidence is available;
- an independent read-only review is desired.

### `/eng-deliver`

Purpose: finalize approved delivery actions.

Use when:

- commit/push/PR work is explicitly approved;
- review and validation are complete.

### `/eng-incident`

Purpose: enter incident triage mode.

Use when:

- urgent diagnosis, containment, or rollback planning is required.

### `/eng-checkpoint`

Purpose: create factual progress checkpoints for long-running work.

Use when:

- work is multi-step;
- handoff or pause may happen;
- current state needs explicit summary.

### `/eng-resume`

Purpose: resume interrupted work from repository evidence.

Use when:

- returning after interruption;
- task plan and diff must be reloaded before proceeding.

### `/eng-status`

Purpose: summarize current state of tracked work.

Use when:

- you want a concise factual status update based on repository state.

### `/eng-refresh-project-rules`

Purpose: refresh local project rules from repository evidence.

Use when:

- project docs changed;
- local `AGENTS.md` drifted;
- architecture or commands need re-audit.

## Command Selection Rule

- choose `/eng-spec-change` for specification work;
- choose `/eng-init-project` for preparing a real project;
- choose review/delivery commands only after implementation exists.
