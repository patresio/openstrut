# Usage Guide

This directory explains how to use the installed OpenCode Engineering Harness.

## What Exists Today

The current harness release provides:

- global engineering rules;
- 21 harness-managed agents;
- 39 skills;
- 10 workflow commands;
- project bootstrap templates;
- safe installer CLI;
- deterministic execution-manifest generation;
- local semantic catalog guidance.

## Quick Navigation

- [Agents](agents.md)
- [Skills](skills.md)
- [Commands](commands.md)
- [Catalog and Extraction Guidance](barsa-integration.md)
- [Installation](installation/README.md)

## Operating Model

1. Use commands for common workflow entry points.
2. Use agents for role-specific execution boundaries.
3. Use skills for reusable engineering procedures.
4. Use the local semantic catalog during runtime; record any future extraction back into Markdown.
5. Stop at approval gates before implementation, delivery, or destructive action.

## Important Boundaries

- Do not copy global agents, skills, or commands into projects.
- Keep project-specific truth in each project repository.
- Use the local catalog instead of local library paths or live provider dependency.
- Install release artifacts through `npm exec --package=<tarball>` unless a future version documents a different mechanism.
