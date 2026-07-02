---
name: engineering-documentation
description: Generate comprehensive project documentation — architecture docs (SAD/arc42), PRD, ADR, AGENTS.md, specs, XP/cowork documents, and any development artifact following Barsa best practices.
compatibility: opencode
---

## Purpose
Create consistent, high-quality project documentation using established templates (arc42, ADR, PRD, SAD) and patterns from software architecture, XP methodologies, and knowledge management. Each document must be actionable, verifiable, and aligned with the project's phase and team culture.

## When to Load
- Starting a new project and need foundational docs (AGENTS.md, ARCHITECTURE.md, PRD, ADR).
- Adding a feature that requires a specification, ADR, or design document.
- Preparing stakeholder-facing documentation or PRD for a product initiative.
- Generating team onboarding docs, runbooks, or cowork/workflow protocols.
- Documenting architecture decisions or cross-cutting concerns.

## Do Not Load When
- The only task is writing inline code comments.
- Documentation already exists and only needs a trivial update.
- The project explicitly refuses documentation (unlikely — document the refusal).

## Required Inputs
- Project context: name, description, tech stack, team size, phase.
- Document type desired: AGENTS.md, ADR, PRD, SPEC, SAD/arc42, runbook, cowork protocol, onboarding guide.
- (Optional) Existing project files for context extraction.

## Procedure
1. **DISCOVER** project context:
   - Read existing project files (package.json, README, AGENTS.md, ARCHITECTURE.md, ADRs, code samples).
   - Determine the project language, framework, build system, testing approach, and team workflow.
   - Identify stakeholders and their documentation needs.
2. **CONSULT Barsa MCP** for documentation patterns and templates:
   - `technology` collection: arc42 template, ADR patterns, SAD structure, Google Design Doc template.
   - `documentation` collection: arc42 official template (docs-oficiais/arc42).
   - `personal` collection: PARA method for knowledge organization, Second Brain for structuring project notes.
   - Record which collections, contexts, and sources materially influenced the output.
3. **SELECT template** based on document type:
   - `AGENTS.md`: Use the harness project-local AGENTS.md pattern (global execution rules + project instructions).
   - `ADR`: Use the Michael Nygard / Design It! ADR template (Title, Status, Context, Decision, Consequences).
   - `PRD`: Use product-discovery patterns with business goals, user personas, success metrics, scope.
   - `SAD/arc42`: Use the Views and Beyond / arc42 9.0 structure.
   - `SPEC/Technical Spec`: Use SDD patterns with acceptance criteria, Given/When/Then examples.
   - `Cowork Protocol`: Use team-cowork-orchestration patterns with ownership, handoff, conflict rules.
4. **DRAFT** the document following the selected template:
   - Fill each section with project-specific content.
   - Include rationale, alternatives considered, and open questions.
   - Keep language clear and accessible to the intended audience.
   - For technical docs (ADR, SAD), include diagrams as ASCII or link to external renderings.
5. **REVIEW** the draft:
   - Check for consistency with existing project documentation.
   - Verify that all Barsa references are correctly cited.
   - Ensure the document is self-contained or clearly links to dependencies.
6. **DELIVER** the document:
   - Present the full document to the user for review.
   - Do not write to the project filesystem unless explicitly approved.
   - After approval, write to the appropriate project path.

## Required Evidence
- The complete generated document.
- List of Barsa collections/contexts consulted.
- Key sources and templates that influenced the output.

## Stop Conditions
- Stop if the project context is insufficient (no existing files, no tech stack info).
- Stop if the requested document type is outside the supported set.
- Stop if Barsa MCP is unavailable and you cannot produce a reliable document without it.

## Output
- A complete, formatted document matching the selected template and project conventions.
- A summary of sources consulted and key decisions made during generation.

## Interactions
- After document generation, hand off to `engineering-code-review` for peer review.
- May be chained with `engineering-bdd-discovery` for PRD/Spec examples.
- Can feed into `engineering-sdd-change` when generating technical specifications.
