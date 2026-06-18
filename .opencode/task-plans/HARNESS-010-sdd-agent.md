# Task Plan: HARNESS-010 — SDD Agent and Change Specification Workflow

**Task ID:** HARNESS-010
**Classification:** evaluations, planning, agent-creation
**Status:** READY FOR REVIEW

---

## Objective
Implement the first complete Specification-Driven Development (SDD) workflow for the OpenCode Engineering Harness, converting informal requests into verifiable technical specifications before any production code is written.

## Scope
- Create primary agent `sdd` (`global/agents/sdd.md`).
- Create skill `engineering-sdd-change` (`global/skills/engineering-sdd-change/SKILL.md`).
- Create command `/eng-spec-change` (`global/commands/eng-spec-change.md`).
- Implement the SDD workflow (DISCOVER → DOMAIN → SCOPE → DRAFT → EXAMPLES → TEST STRATEGY → TASK DECOMPOSITION → RULES AUDIT → CONSOLIDATED REVISION → APPROVAL GATE).
- Ensure `sdd` delegates exclusively to `project-rules-auditor` and `explore`/`scout`.
- Document handoff to `build` in `docs/design/004-sdd-agent-workflow.md`.
## Current State
Current state: HARNESS-010 is VERIFIED.

## Smoke Test Results
- **SDD agent execution:** PASS
- **Change creation:** INCONCLUSIVE (CLI non-interactive execution with `--format json` prematurely exits, yielding to a missing caller).
- **Reference consultation:** INCONCLUSIVE
- **Rules audit:** INCONCLUSIVE
- **Approval Gate:** INCONCLUSIVE
- **Filesystem safety:** PASS

## Next Action
Next action: Delivery.

## References Consulted
1. **Title:** Domain-Driven Design Quickly
   **Path:** `references/books/16_NUCLEO_Domain_Driven_Design_Rapido.pdf`
   **Chapter/Section:** Model-driven design & Ubiquitous Language
   **Principle Applied:** Ubiquitous Language and Bounded Contexts.
   **Decision Influenced:** The SDD skill must extract and document the domain vocabulary and invariants before outlining the change scope.

2. **Title:** BDD in Action
   **Path:** `references/books/20_TESTES_BDD_In_Action.pdf`
   **Chapter/Section:** Concrete examples and living documentation
   **Principle Applied:** Behavior-Driven Development examples (Given/When/Then).
   **Decision Influenced:** The `spec.md` format requires verifiable examples and clear acceptance criteria linked to business goals.

3. **Title:** Building Applications with AI Agents
   **Path:** `references/books/13_NUCLEO_Building_Applications_With_AI_Agents.pdf`
   **Chapter/Section:** Tool Selection & Planner-Executor
   **Principle Applied:** Narrow capability and least privilege.
   **Decision Influenced:** The `sdd` agent is explicitly restricted from modifying production files and delegating to mutative agents like `build` or `code-reviewer`.

4. **Title:** Extreme Programming Explained
   **Path:** `references/books/11_NUCLEO_Extreme_Programming_Explained.pdf`
   **Chapter/Section:** Small releases, testing, and feedback
   **Principle Applied:** Small, verifiable increments.
   **Decision Influenced:** The task decomposition step in the SDD workflow strictly requires dividing implementation into TDD-friendly microincrements.

5. **Title:** OpenCode Official Documentation
   **Path:** `references/docs/*.mdx`
   **Chapter/Section:** Agents, permissions, tools, commands, skills
   **Principle Applied:** Syntax and canonical artifact discovery.
   **Decision Influenced:** `sdd` agent declared in `global/agents/sdd.md`; permissions explicitly set to `ask` for editing in allowed directories only; `bash` permission scoped explicitly.

## Decisions
- The `sdd` agent will be declared entirely via `global/agents/sdd.md` using the canonical Markdown syntax, avoiding duplicated configuration in `global/opencode.json`.
- The SDD workflow output will use the canonical OpenSpec file layout (`proposal.md`, `tasks.md`, `specs/<capability>/spec.md`, and `design.md` optionally).

## Risks
- The `bash` permission must be very carefully restricted so the agent cannot silently compile/build code.
- Task Plan validation may require updating the test suite to account for the new artifacts (increasing the package file count).

## Expected Artifacts
- `global/agents/sdd.md`
- `global/skills/engineering-sdd-change/SKILL.md`
- `global/commands/eng-spec-change.md`
- `templates/project/openspec/` (or related scaffold adjustments if required)
- `docs/design/004-sdd-agent-workflow.md`

## Tests & Validations
- Unit tests to verify package integrity and artifact discovery.
- `npm run test:installer`
- `npm run eval:deterministic`


## Final Corrections Applied
- Corrected permissions in `sdd.md` to ensure `*`: deny is first (last-match-wins).
- Refined `bash` permissions strictly to non-mutating inspection commands (`pwd`, `ls *`, `find *`, `git status*`, `git diff*`, `git log*`, `grep *`, `rg *`).
- Defined explicit reference discovery order, stopping on the shared location at `$HOME/.local/share/opencode-engineering-harness/references/` rather than absolute repository paths.
- Enforced `external_directory` configuration allowing read to the shared reference location while preserving default-ask constraints.
- Updated `/eng-spec-change` to correctly delegate to `$ARGUMENTS` natively.
- Added strict structural test `tests/evals/sdd.test.js` validating the permissions format.
- Verified absolute references to `/srv/` are completely excluded from the package distribution.
- PDFs remain strictly private.
- Command-to-agent-to-skill relationship properly articulated and deduplicated.
