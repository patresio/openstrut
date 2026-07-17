---
name: opentrust-tdd
description: Seams-first TDD: agree test boundaries, then RED-GREEN-REFACTOR.
---

## When to Use This Skill

When changing executable behavior (bugfix, new feature, refactoring of behavior). Not for documentation-only changes.

## Workflow

### Pre-Step: Seams-First

Before writing any test, agree on test boundaries:

1. **Identify seams** — places where you can alter behavior without editing in that place
2. **Choose vertical slices** — tracer bullets through every layer, each demoable on its own
3. **Define test surface** — "the interface is the test surface"
4. **Agree on scope** — what is in this slice, what is not

### RED-GREEN-REFACTOR

1. Write the smallest automated test that specifies the desired behavior at the agreed seam.
2. Run the test and confirm RED (fails for the expected behavioral reason).
3. Implement the minimum production code needed.
4. Run the test and confirm GREEN.
5. Refactor while tests remain GREEN.

## Anti-Patterns

- **Tautological tests** — tests that just re-implement the production code
- **Implementation-coupled tests** — tests that break when internals change but behavior doesn't
- **Horizontal slicing** — testing one layer at a time instead of vertical slices
- **Premature test writing** — writing tests before agreeing on seams

## Output

- Seam agreement (what is being tested and where)
- RED evidence (test name, failure reason)
- GREEN evidence (test name, pass output)
- Validation log or report

## Rules

- Do not skip RED. Do not manufacture GREEN.
- Use existing test framework (node:test) and test patterns.
- Documentation-only, formatting, configuration, and generated artifacts are exempt.
- Agree on seams before writing tests.
