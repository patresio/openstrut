---
name: harness-generation
description: Analyze a project's tech stack, documentation, and personal context (Obsidian vault, methodology books, productivity systems) and generate customized agents, skills, and workflows that follow Barsa best practices and the engineering harness architecture.
compatibility: opencode
---

## Purpose
Generate a complete, customized OpenCode engineering harness for any project — analyzing its tech stack, existing documentation, team practices, and even personal development context (Obsidian notes, methodology books, self-esteem, organization systems) to produce agents, skills, and workflows that genuinely fit the project and its people.

## When to Load
- Starting a new project that needs a custom agent/skill/workflow harness.
- Onboarding a team to OpenCode and needing project-specific agents.
- A project has unique practices, frameworks, or personal workflows that generic agents don't cover.
- You want to integrate personal knowledge management (Obsidian, PARA, GTD) into your development workflow.
- You need agents that reflect the team's actual methodology (XP, Scrum, Kanban, Lean, or custom).

## Do Not Load When
- The project already has a complete harness (unless a major shift has occurred).
- Only a trivial agent update is needed (use edit instead).
- There is no project context or tech stack to analyze.

## Required Inputs
- Project path (local directory with code, docs, configs).
- (Optional) Path to personal vault, notes, or methodology docs for personal/human context.
- (Optional) Specific agent types or skill categories desired.

## Procedure
1. **ANALYZE project stack and patterns:**
   - Read project files: `package.json`, `Cargo.toml`, `pyproject.toml`, `go.mod`, `composer.json`, etc. for tech stack.
   - Read `README.md`, `AGENTS.md`, `ARCHITECTURE.md`, existing ADRs for project conventions.
   - Identify frameworks, testing patterns, build tools, deployment approach, and team workflow.
   - Read existing specs, docs, and test files to understand quality standards.
   - Identify the project's methodology (XP, Scrum, Kanban, waterfall, or custom).

2. **ANALYZE personal/human context (Barsa personal collection):**
   - Consult Barsa MCP `personal` collection for relevant methodology and organization books.
   - Map personal tools (Obsidian, Notion, Todoist, etc.) to potential agents and skills.
   - Identify personal methodology preferences: PARA, GTD, Zettelkasten, Atomic Habits, Miracle Morning, etc.
   - Detect recurring personal themes: self-esteem, organization, productivity, communication, finance, health.
   - Use `barsa_ask` and `barsa_search` with collections `personal` and `technology` for relevant patterns.

3. **MAP to harness architecture:**
   - Determine which agents are needed: spec owners, domain advisors, reviewers, implementers.
   - Determine which skills each agent needs, based on project stack and team methodology.
   - Determine workflow structure: sequential, parallel, or worktree-based.
   - Follow the architecture patterns from global/AGENTS.md and existing agents (AG01-AG17).

4. **CONSULT Barsa MCP for best practices:**
   - `technology` collection: software architecture patterns, documentation templates, engineering practices.
   - `documentation` collection: official docs templates (arc42), contribution guides.
   - `personal` collection: methodology books, productivity systems, knowledge management.
   - Record which collections, contexts, and sources materially influenced the design.

5. **GENERATE agents (one per role):**
   - Each agent follows the pattern: `---` frontmatter (permissions, mode, model, x-harness metadata).
   - Include role, when-to-use, responsibilities, primary/support skills, cowork rules, Barsa source policy.
   - Write to `global/agents/<agent-name>.md`.

6. **GENERATE skills (one per capability):**
   - Each skill follows the pattern: `---` frontmatter (name, description, compatibility).
   - Include purpose, when-to-load, procedure, required evidence, stop conditions, output, interactions.
   - Write to `global/skills/<skill-name>/SKILL.md`.

7. **GENERATE workflows (one per process):**
   - Each workflow follows the YAML pattern: name, description, mode, steps with agent/skills/handoff.
   - Ensure every agent and skill in the workflow exists or is being generated.
   - Write to `workflows/<workflow-name>.yaml`.

8. **UPDATE inventory:**
   - Add all new artifacts to `src/installer/inventory.js`.
   - Validate that all source paths follow the `global/`, `templates/`, `workflows/` prefix convention.
   - Verify that `isAllowedSource()` accepts each path.

9. **PRESENT results:**
   - Show the complete list of generated agents, skills, and workflows.
   - Explain the rationale for each generation decision.
   - List Barsa sources consulted and how they influenced the output.
   - Do not write to the project filesystem unless explicitly approved.

## Required Evidence
- The complete set of generated agent, skill, and workflow files.
- Tech stack analysis summary.
- Personal context analysis summary.
- List of Barsa collections/contexts/sources consulted.

## Stop Conditions
- Stop if the project has no detectable tech stack or conventions.
- Stop if the generated harness would conflict with existing harness agents (detect via inventory.js).
- Stop if Barsa MCP is unavailable and you cannot produce reliable patterns.

## Output
- A complete, ready-to-install harness: agents + skills + workflows + inventory update.
- A summary report of what was generated and why.

## Interactions
- After generation, hand off to `engineering-project-bootstrap` for rule audit.
- May run in parallel with `engineering-documentation` for doc alignment.
- Can feed generated agents into `rag-agent-design` for RAG-specific agents.
