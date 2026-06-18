# Skill: engineering-sdd-change

**Description:** Use this skill to define the technical specification of a new feature or change, document business rules, analyze impact, or prepare an OpenSpec proposal before any implementation begins. (e.g., "defina a especificação desta funcionalidade", "crie uma change para esta alteração", "planeje esta feature antes de implementar", "documente esta regra de negócio", "prepare uma proposta OpenSpec", "analise o impacto desta mudança").

---

## Workflow

Follow these sequential steps exactly. Do not skip any steps.

### 1. DISCOVER
Read and understand the context:
- Project rules (`AGENTS.md`, `ARCHITECTURE.md`, `README.md`, ADRs, roadmap).
- Existing specifications, open changes, and backlog.
- Read existing code only to understand current behavior, NOT to modify it.
- Existing tests to understand how the system is currently verified.
- Existing tests to understand how the system is currently verified.
- Discover and consult reference materials using this exact order of precedence:
  1. `<project-root>/reference/`
  2. `<project-root>/references/`
  3. `$HOME/.local/share/opencode-engineering-harness/references/`
- You must record which directory was actually found.
- If the reference library is missing, you must explicitly report its absence.
- If books are unavailable, you may continue only if project documentation is sufficient and the absence is disclosed.
- If the user explicitly requires a particular unavailable reference, you MUST stop for clarification.
- NOTE: The user can populate the shared reference directory by copying or symlinking their private local library to `$HOME/.local/share/opencode-engineering-harness/references/`.

### 2. DOMAIN
Establish the vocabulary and invariants:
- User or business objective.
- Relevant actors and stakeholders.
- Ubiquitous language and domain terms.
- Affected bounded contexts.
- Core invariants, states, and transitions.
- Relevant existing business rules.

### 3. SCOPE
Define the boundaries:
- The core problem being solved.
- The expected result.
- What is explicitly IN scope.
- What is explicitly OUT of scope.
- Dependencies, risks, and existing constraints.
- Decisions already made vs. decisions pending.

### 4. DRAFT
Draft the change in the project's canonical specification format (default: OpenSpec).
Create the following structure inside `openspec/changes/<change-slug>/`:
- `proposal.md`: Context, problem, expected result, scope, stakeholders, risks, dependencies, alternatives, open questions, and the "References consulted" section.
- `tasks.md`: Ordered microincrements for execution.
- `specs/<capability>/spec.md`: The behavioral specification, invariants, rules, transitions, and acceptance criteria.
- `design.md` (Optional): ONLY if there is a complex architectural change, data model shift, security implication, or significant trade-off to record.

*Requirement:* The change must include a section titled "References consulted" (or "Referências consultadas"). You must list the references from the actual discovered directory that truly influenced the design. Cite the file, chapter/section, principle applied, and the impact on the decision. You must NEVER claim a reference was consulted when it was unavailable. Consult only relevant books or documentation.

### 5. EXAMPLES
Add verifiable examples to the specification (`spec.md`):
- Use Given / When / Then format when it adds clarity.
- Cover the happy path, authorization, validation, error states, boundary transitions, concurrency, and idempotency.
- Do not use artificial scenarios just to fill space.

### 6. TEST STRATEGY
Define the validation approach in the specification:
- Unit, integration, acceptance, contract, and regression tests.
- For legacy code, specify characterization tests.
- Manual validation only when strictly inevitable.
*Constraint:* Do not write actual test code in this phase. Do not invent a RED state.

### 7. TASK DECOMPOSITION
Outline the operational execution in `tasks.md`:
- Strict dependency order.
- Decomposed into small, testable microincrements (TDD-first).
- Include validation steps.
- Avoid artificial line-by-line commits or unrelated refactoring.
- Include a delivery step only after full implementation and review.
- Do not pre-check future tasks.

### 8. RULES AUDIT
Call the `project-rules-auditor` subagent to review the draft.
The auditor must verify:
- Adherence to `AGENTS.md` and architecture.
- Consistency with OpenSpec and the domain model.
- Identification of acceptance gaps, risks, permissions, and scope creep.
- Feasibility of incremental implementation.

### 9. CONSOLIDATED REVISION
Apply the auditor's findings in a single, consolidated revision of the change documents.
- Do not enter an endless ping-pong loop with the auditor.
- Record optional findings or out-of-scope feedback as open questions, without implementing them.

### 10. APPROVAL GATE
Stop all execution and output the exact phrase:
`Approval Gate: aguardando aprovação da change antes do handoff para build.`
- Do not execute any further actions, write code, or make Git commits.
