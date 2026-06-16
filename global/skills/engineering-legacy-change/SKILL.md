---
name: engineering-legacy-change
description: Change untested or fragile legacy behavior safely using characterization tests, seams, narrow changes, and behavior-preserving refactoring.
compatibility: opencode
---

## Purpose
Safely modify untested, fragile, or undocumented legacy code by establishing a secure boundary of tests before implementing changes, preserving existing behavior.

## When to Load
- When asked to modify a system lacking sufficient test coverage.
- When dealing with highly coupled legacy code that is difficult to test directly.

## Do Not Load When
- The codebase already has strong test coverage (use `engineering-tdd-first`).
- The task is a complete rewrite approved from scratch.

## Required Inputs
- The requested change or feature.

## Procedure
1. Discover the current behavior by running the system or writing exploratory tests.
2. Write characterization tests that capture the actual, current behavior (even if flawed), rather than the intended behavior.
3. Identify a "seam" where behavior can be altered without editing the entire highly coupled component.
4. Establish a GREEN baseline with the characterization tests.
5. Separate behavior-preserving refactoring from the actual behavior change.
6. Introduce the smallest safe change required for the new feature or fix.
7. Preserve backward compatibility where required.
8. Review the results for any unintended behavior changes outside the intended scope.

## Required Evidence
- Passing characterization tests that document the previous behavior.
- Clean test runs after the narrow change is made.

## Stop Conditions
- Stop and require a decision if the current required behavior is ambiguous or contradictory.
- Stop if no safe seam exists without making a massive architectural impact.
- Stop if the required change effectively becomes a rewrite rather than a modification.
- Stop if characterization tests expose conflicting expectations that need human resolution.

## Output
- Modified code wrapped in characterization tests, successfully implementing the change without breaking preserved behaviors.

## Interactions
- Relies heavily on the Task Plan (`engineering-task-plan`) to track the separation between refactoring and behavior modification.
