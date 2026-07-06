# HARNESS-019 Documentation and Versioning Governance

**Task ID:** HARNESS-019
**Classification:** planning (documentation, versioning, governance)
**Status:** READY

**Objective:**
Implement minimal versioning and documentation governance for the OpenCode Engineering Harness without modifying production code behavior or delivery pipeline.

**Scope:**
- Define simple semantic versioning model aligned with task plan IDs
- Update .opencode/task-plans/ inventory and documentation links
- Establish basic documentation governance rules:
  - Revision control for instruction documents (AGENTS.md, CONTRIBUTING.md, README.md)
  - Clear hierarchy and precedence of sources
- Implement CHANGELOG.md for released package version notes
- Keep all existing HARNESS-001 through HARNESS-018 behavior intact

**Exclusions:**
- Do not modify application behavior or business logic
- Do not change runtime behavior or cross files with spec changes
- Do not implement automatic documentation merging
- Do not distribute or publish new package versions
- Do not modify task plan execution algorithm
- Do not create new agent/producer configurations
- Do not introduce new dependencies or package managers

**Workflow Checklist:**
- [x] Explore current documentation and versioning state
- [x] Proposal minimal governance changes
- [x] Planning implementation steps
- [x] Approval Gate approval complete
- [x] Build implementation
- [x] Review completed diff
- [ ] Archive updated documents
- [ ] Commit changes
- [ ] Push changes
- [ ] Deliver final state

## Expected Artifacts:
- docs/ARCHITECTURE.md updated with versioning model
- AGENTS.md updated with documentation governance rules
- CHANGELOG.md created for version tracking
- .opencode/task-plans/ inventory links updated
- README.md updated with governance guidance

## Dependencies:
- HARNESS-001 through HARNESS-018 must be implemented before this task begins
- Package must be testable, without runtime machine configuration modification
- Documentation must remain read-only unless explicitly approved

## References:
1. Original discovery: audit of existing task plan state
2. HARNESS-001 through HARNESS-018 implementation patterns
3. OpenCode version management system (NOM manipulated)
4. Documentation governance patterns in AGENTS.md
5. Barsa MCP retrieval documentation patterns
6. Package version management best practices (npm)

## Best Practices:
- Minimal changes to existing behavior
- Version strings should align with technical decisions
- Documentation must be readable and maintainable
- Test suite should continue to pass after documentation governance changes
- All documentation and versioning changes must be reversible
- Changing documentation requires explicit user approval