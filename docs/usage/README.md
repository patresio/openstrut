# Usage Guide

This directory explains how to use the installed OpenCode Engineering Harness.

## What Exists Today

The current harness release provides:

- global engineering rules;
- three harness-managed agents;
- nine engineering skills;
- ten workflow commands;
- project bootstrap templates;
- safe installer CLI;
- deterministic execution-manifest generation;
- Barsa MCP retrieval guidance.

## Quick Navigation

- [Agents](agents.md)
- [Skills](skills.md)
- [Commands](commands.md)
- [Barsa MCP Integration](barsa-integration.md)
- [Installation](installation/README.md)

## Operating Model

1. Use commands for common workflow entry points.
2. Use agents for role-specific execution boundaries.
3. Use skills for reusable engineering procedures.
4. Use Barsa MCP for books, official docs, and curated operational knowledge.
5. Stop at approval gates before implementation, delivery, or destructive action.

## Important Boundaries

- Do not copy global agents, skills, or commands into projects.
- Keep project-specific truth in each project repository.
- Use Barsa MCP routing instead of local library paths.
- Install release artifacts through `npm exec --package=<tarball>` unless a future version documents a different mechanism.
