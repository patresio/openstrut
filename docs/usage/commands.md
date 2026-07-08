# Commands

Commands are workflow entry points installed under `commands/` in the OpenCode configuration.

## Current Commands

The active runtime installs 7 OpenTrust workflow commands:

- `/ot-explore`
- `/ot-propose`
- `/ot-apply`
- `/ot-review`
- `/ot-ship`
- `/ot-status`
- `/ot-incident`

Legacy `eng-*` commands are no longer part of the active install inventory.

## Command Reference

### `/ot-explore`

Purpose: inspect repository state, constraints, risks, and current behavior without mutation.

Use when:
- entering a project;
- reviewing architecture or implementation state;
- gathering evidence before proposing work.

### `/ot-propose`

Purpose: turn exploration evidence into a small scoped proposal with acceptance criteria.

Use when:
- scope is understood;
- implementation is not approved yet;
- next step is choosing smallest safe change.

### `/ot-apply`

Purpose: execute approved work under Task Plan and validation gates.

Use when:
- proposal is approved;
- mutation is explicitly authorized;
- tests and validation must run as part of execution.

### `/ot-review`

Purpose: inspect diff, validation evidence, scope, and policy compliance before delivery.

Use when:
- implementation exists;
- validation evidence exists;
- delivery decision is next.

### `/ot-ship`

Purpose: finalize approved delivery actions.

Use when:
- review is complete;
- commit/push/PR work is explicitly approved.

### `/ot-status`

Purpose: summarize current runtime or task state.

Use when:
- you want a concise factual status update.

### `/ot-incident`

Purpose: enter incident triage mode.

Use when:
- urgent diagnosis, containment, or rollback planning is required.

## Selection Rule

- choose `/ot-explore` first for unknown state;
- choose `/ot-propose` before implementation;
- choose `/ot-apply` only after approval;
- choose `/ot-review` before delivery;
- choose `/ot-ship` only for approved delivery work.
