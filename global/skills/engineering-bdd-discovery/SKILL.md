---
name: engineering-bdd-discovery
description: Clarify business outcomes, journeys, rules, state transitions, and acceptance criteria through concrete examples before implementation.
compatibility: opencode
---

## Purpose
Bridge the gap between ambiguous feature requests and executable code by discovering and defining concrete business outcomes, rules, and acceptance criteria through examples.

## When to Load
- When a feature request is vague or lacks acceptance criteria.
- Before beginning implementation of a complex business journey or state machine.

## Do Not Load When
- The task is purely technical (e.g., updating a dependency, refactoring).
- The acceptance criteria and examples are already fully specified and unambiguous.

## Required Inputs
- The high-level feature request or user story.

## Procedure
1. Identify the core business outcome and the primary actor or stakeholder.
2. Define the initial state of the system before the action occurs.
3. Define the trigger or event that initiates the journey.
4. Define the observable result or final state.
5. Generate concrete examples that illustrate the happy path.
6. Generate examples for edge cases and invalid state transitions.
7. Establish shared terminology (Ubiquitous Language) for the domain.
8. Consolidate these into clear acceptance criteria.
9. Map each example to proposed project-appropriate tests or specifications. Do not create or modify implementation, test, Task Plan, or specification files before the Approval Gate. After approval, record the accepted examples in the active Task Plan or the project's approved specification mechanism.

## Required Evidence
- Concrete examples and acceptance criteria presented in the current proposal or an existing approved specification.
- After approval, accepted examples recorded in the active Task Plan or the project's canonical specification mechanism.

## Stop Conditions
- Stop and request human input if unresolved business decisions or contradictory requirements are exposed.

## Output
- Clear, unambiguous acceptance criteria backed by concrete examples, ready for `engineering-tdd-first` implementation.

## Interactions
- Hands off to `engineering-tdd-first` or `engineering-task-plan` once discovery is complete.
