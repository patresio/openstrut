---
description: Analyze project and recommend new agents, skills, or workflows
agent: knowledge-lead
---

# Create Command

**Purpose:** Analyze the project's tech stack, existing harness, and methodology to identify gaps and recommend new agents, skills, or workflows.

## Instructions

1. Resolve project root: use `[project-path]` if given, else current directory.
2. **Analyze Stack** — Detect language, frameworks, test tools, build tools, CI from filesystem evidence.
3. **Scan Documentation** — Read `AGENTS.md`, `CONTRIBUTING.md`, `docs/`, architecture notes for methodology and constraints.
4. **Scan Inventory** — Count and list existing agents, skills, workflows, commands from installed harness and project inventory.
5. **Detect Gaps** — Compare stack/methodology needs against inventory. Classify each gap.
6. **Prioritize Gaps** — Rank by impact (high/medium/low) and effort (high/medium/low).
7. **Recommend** — Suggest specific artifacts with evidence-based justification. Recommend only; do not create.
8. **Validate** — Check recommendations against agent template and taxonomy (teams, naming, permission model).
9. **Report** — Emit structured analysis report.
10. Do not mutate the project. Analyze and recommend only.
11. Synthesize only — no raw chunks in output. Cite source IDs when available.

## Input Format

```
ot-create [project-path]
```

## Analysis Pipeline

```
[Project Root]
    ↓
[Stack Analysis] — Language, frameworks, test tools, build tools
    ↓
[Documentation Scan] — AGENTS.md, CONTRIBUTING.md, docs/
    ↓
[Existing Inventory] — What agents/skills already exist
    ↓
[Gap Detection] — What's needed vs. what exists
    ↓
[Prioritization] — Rank gaps by impact/effort
    ↓
[Recommendations] — Specific agents/skills to create
    ↓
[Validation] — Taxonomy check for recommended artifacts
    ↓
[Report] — Summary with justification
```

## Stack Detection Patterns

| Pattern | Detection Method |
|---------|-----------------|
| Node.js | `package.json`, `node_modules`, `.npmrc` |
| Python | `pyproject.toml`, `setup.py`, `requirements.txt` |
| Rust | `Cargo.toml`, `src/main.rs` |
| Go | `go.mod`, `go.sum` |
| Java | `pom.xml`, `build.gradle` |
| Docker | `Dockerfile`, `docker-compose.yml` |
| CI/CD | `.github/workflows/`, `.gitlab-ci.yml` |
| Testing | `jest.config`, `pytest.ini`, `vitest.config`, `node:test` usage |

## Gap Categories

| Category | Description | Example |
|----------|-------------|---------|
| Missing Agent | No agent for specific domain | No security-reviewer for auth code |
| Missing Skill | No skill for specific workflow | No TDD skill for Python projects |
| Missing Workflow | No workflow for specific pattern | No CI/CD workflow for Docker |
| Weak Coverage | Agent exists but lacks capabilities | feature-implementer missing branch awareness |

## Rules

- Analyze first, recommend second
- Justify every recommendation with specific evidence from stack, docs, or inventory
- Prioritize by impact and effort
- Validate against existing taxonomy before recommending
- Do not create artifacts automatically
- Synthesize only — no raw chunks in output

## Expected Output

- Stack analysis summary
- Gap list with categories
- Prioritized recommendations
- Taxonomy validation results
- Next steps

## Execution Report

```
[STACK]
Language: <detected>
Frameworks: <list>
Test Tools: <list>
Build Tools: <list>
CI/CD: <detected>

[INVENTORY]
Agents: <count>
Skills: <count>
Workflows: <count>

[GAPS]
Missing Agents: <list>
Missing Skills: <list>
Missing Workflows: <list>
Weak Coverage: <list>

[RECOMMENDATIONS]
Priority 1: <artifact> — <justification> (impact: high|medium|low, effort: high|medium|low)
Priority 2: <artifact> — <justification> (impact: high|medium|low, effort: high|medium|low)
...

[VALIDATION]
Taxonomy Check: <pass/fail>
Conflicts: <none / list>

[NEXT]
<clear action items>
```
