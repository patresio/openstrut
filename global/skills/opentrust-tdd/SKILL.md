---
name: opentrust-tdd
description: Enforce test-first workflow when behavior or rules change — define failing test, implement, validate.
---

## When to Use This Skill

When changing executable behavior (bugfix, new feature, refactoring of behavior). Not for documentation-only changes.

## Workflow

1. Write the smallest automated test that specifies the desired behavior.
2. Run the test and confirm RED (fails for the expected behavioral reason).
3. Implement the minimum production code needed.
4. Run the test and confirm GREEN.
5. Refactor while tests remain GREEN.

## Output

- RED evidence (test name, failure reason)
- GREEN evidence (test name, pass output)
- Validation log or report

## Rules

- Do not skip RED. Do not manufacture GREEN.
- Use existing test framework (node:test) and test patterns.
- Documentation-only, formatting, configuration, and generated artifacts are exempt.
