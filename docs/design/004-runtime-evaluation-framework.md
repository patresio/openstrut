# Design 004: Runtime Evaluation Framework

## Purpose

This document defines the architecture and principles for evaluating the runtime behavior of the OpenCode Engineering Harness. The goal is to prove whether the configured agents, subagents, skills, commands, permissions, Approval Gate, Task Plans, and installer behave as designed inside a real OpenCode environment without mutating the user's actual configuration.

## Evaluation Goals

1. Create deterministic static and sandboxed runtime evaluations.
2. Install the packaged harness into an isolated temporary OpenCode configuration.
3. Exercise real agents, skills, subagents, and commands through documented OpenCode interfaces.
4. Produce factual evidence showing what works, what fails, and what cannot yet be observed reliably.

## Layers

The framework consists of two explicit layers:

### Layer A: Deterministic Evaluations
Validates the package structure, installer behavior (plan, install, check), configuration syntax, declared permissions, command frontmatter, skill frontmatter, and isolation integrity. This layer does not make model calls and does not require `opencode` to execute behavioral paths.

### Layer B: Live OpenCode Behavioral Evaluations
Performs real OpenCode executions using the installed configuration against synthetic project fixtures. It verifies behavior using headless JSON output from `opencode run`.

## Result Semantics

- **PASS**: All required observable evidence exists and matches the expected behavior.
- **FAIL**: The harness or OpenCode demonstrably behaved contrary to the expected contract.
- **BLOCKED**: A required external dependency failed (e.g., model unavailable, rate limit, provider outage, missing capability).
- **INCONCLUSIVE**: The operation may have behaved correctly, but the available runtime evidence cannot prove the required property (e.g., final output looks correct but tool traces are missing).
- **SKIPPED**: The scenario was intentionally excluded for a documented platform reason.

## Fixture Isolation

Every evaluation uses disposable directories for both the configuration target (`XDG_CONFIG_HOME`) and the project execution directory (`HOME`, Git repositories). The evaluations must never read from or write to the user's `~/.config/opencode` or actual project repositories.

## Observability Requirements

Live scenarios capture and inspect documented and available mechanisms, including:
- Primary agent and model
- Tool calls and skill calls
- Subagent delegation and command expansion
- Permission denials
- File and Git mutations
- Final output, exit code, and execution time

If OpenCode does not expose a required observability primitive, the result must be marked `INCONCLUSIVE` rather than fabricating success based purely on prose.

## Model Failure Behavior

The evaluation strictly preserves the configured model routing. If a free model hits a rate limit or returns unavailable, the result is recorded as `BLOCKED — CONFIGURED MODEL UNAVAILABLE`. The framework will not silently fall back to another model to ensure the evaluation accurately reflects the configured harness contract.

## Security and Redaction

- Generated sessions, raw outputs, and temporary reports must not contain secrets.
- API keys, tokens, private endpoints, complete model headers, and user home paths must be redacted from summary reports.
- Temporary directories must be strictly cleaned up after each test case, and cleanup failures must be reported.

## Routing Evaluation

The framework evaluates natural-language routing compared to explicit commands (e.g., natural-language project bootstrap vs `/eng-init-project`). Results are separated to distinguish whether a skill is loaded implicitly vs explicitly.

## Future Capabilities

Technical debate and advanced RAG architectures remain documented but unenforced in this phase. Evaluation capabilities for these will be added in HARNESS-010 or later once the execution runtime is proven.
