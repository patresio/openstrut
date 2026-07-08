---
name: engineering-tdd-first
description: Apply RED-GREEN-REFACTOR to new or changed executable behavior and regression fixes. Use before modifying production behavior when automated tests are applicable.
compatibility: opencode
---

## Purpose
Ensure all executable behavior changes are driven by automated tests, preventing regression and ensuring high test integrity through the RED-GREEN-REFACTOR cycle.

## When to Load
- Before introducing new functionality.
- Before modifying existing production behavior.
- When fixing a reported bug or regression.

## Do Not Load When
- Performing structural refactoring without behavior changes (use legacy-change or standard refactoring instead).
- Doing documentation, repository setup, or non-executable config changes (declare an exception).

## Required Inputs
- The requested behavior change or bug report.

## Procedure
1. Identify the smallest observable behavior to change.
2. Write or identify a focused test for that behavior.
3. Run the test and confirm it fails (RED) for the expected reason, not due to syntax or setup errors.
4. Record the RED evidence in the Task Plan.
5. Implement the minimum production code required to pass the test.
6. Confirm the test passes (GREEN).
7. Record the GREEN evidence in the Task Plan.
8. Refactor the implementation only while the test remains GREEN.
9. Perform focused validation, followed by authoritative validation (e.g., full test suite run).
10. For non-behavioral work where TDD does not apply, declare explicit exceptions in the Task Plan.

## Required Evidence
- Test output showing a valid RED failure.
- Test output showing a successful GREEN pass.

## Stop Conditions
- Stop and seek clarification if a test cannot be made RED without breaking the build entirely.
- Stop if obtaining GREEN requires weakening assertions, deleting valid tests, blindly updating snapshots, mocking the behavior under test, or changing expectations to match defective behavior.

## Output
- Tested, passing production code and its corresponding regression or unit tests.
- Evidence recorded in the Task Plan.

## Interactions
- May lead to `engineering-code-review` after completion.
