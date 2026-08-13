# Using OpenTrust with Hermes-Agent

This guide explains how to use the OpenTrust plugin inside **Hermes-Agent
v0.20.0**. It assumes the plugin is installed and enabled (see
[Installation](../installation/hermes.md)).

## Quick Start

```bash
# Start a Hermes session with the OpenTrust plugin active
hermes -p isagi

# Ask the model to use an OpenTrust tool
#   "Call ot_status to show the OpenTrust workflow state."
#   "Use ot_create to analyze this project."
#   "Load skill opentrust:opentrust-tdd and apply it."
```

The model discovers the 10 `ot_*` tools automatically once the plugin is
enabled. You do not call them directly — you ask the model to call them.

## Scope: Profiles

Hermes plugins are **per-profile**. Each profile has its own
`<profile>/plugins/` and `plugins.enabled` list in its `config.yaml`.

> **Note:** the profile names below (`isagi`, `motoko-platform`) are examples
> from the machine where this guide was written. On a new computer, install
> and enable the plugin for the profile you actually use — or for the default
> profile if you do not use profiles. See
> [Installation](../installation/hermes.md#enable-the-plugin).

| Profile | Plugin state |
|---------|--------------|
| `default` | disabled (installed, not loaded) |
| `isagi` | **enabled** (use `hermes -p isagi`) |
| `motoko-platform` | not installed |

To use OpenTrust, start sessions with `hermes -p isagi`.

## What the Plugin Provides

### 10 Tools (toolset `opentrust`)

All tools are **guidance-only**: they return a deterministic JSON string and
never mutate state. They tell the model *what phase to follow*, not *how to
change your system*.

| Tool | Phase | What it guides |
|------|-------|----------------|
| `ot_create` | Create | Stack analysis and gap discovery for a project |
| `ot_explore` | Explore | Read-only investigation before decisions |
| `ot_propose` | Propose | Writing proposals and acceptance criteria |
| `ot_apply` | Apply | Implementing within approved scope (TDD gate) |
| `ot_review` | Review | Evidence-based review before delivery |
| `ot_ship` | Ship | Delivery: commit, push, PR |
| `ot_status` | — | Workflow status synthesis |
| `ot_incident` | Incident | Smallest safe containment and recovery |
| `ot_synthetize` | Synthetize | Idea refinement, grilling rounds, gap analysis |
| `ot_goal` | Goal | Autonomous multi-task loop with human gates |

Typical JSON output:

```json
{"phase": "propose", "status": "guidance",
 "message": "OpenTrust Propose: write proposal and acceptance criteria; no implementation.",
 "received": true}
```

### 11 Skills (namespace `opentrust`)

Plugin skills are **read-only and namespaced**: they are not injected into
every session and do not appear in `hermes skills list`. The model loads
them on demand with the `skill_view` tool:

```
skill_view("opentrust:opentrust-tdd")
```

| Skill | Use for |
|-------|---------|
| `opentrust-task-contract` | Creating task contracts with retrieval context |
| `opentrust-reference-research` | Operational Retrieval Map selectors (CTX/B/SK/DOC) |
| `opentrust-delivery` | Preparing commit, push, and PR |
| `opentrust-observability` | Execution reports and validation evidence |
| `opentrust-spec-change` | Structured spec and design changes |
| `opentrust-review` | Two-axis review: Standards + Spec |
| `opentrust-tdd` | Seams-first TDD: RED-GREEN-REFACTOR |
| `opentrust-grilling` | Requirement grilling rounds |
| `opentrust-domain-modeling` | Domain modeling guidance |
| `opentrust-handoff` | Session context compaction |
| `opentrust-diagnose` | Diagnosing repository and workflow state |

## Example Session

```
You:  Use ot_create to analyze this Node.js repository.
Hermes: [calls ot_create]
        The ot_create tool returned status: "guidance" — it guides an
        interactive stack analysis. Would you like to run the step-by-step
        analysis, starting with the project structure?

You:  Yes, follow its prompts.
Hermes: [runs the guided analysis, using the repository as evidence]
```

```
You:  Load skill opentrust:opentrust-tdd and tell me the test boundary
      you would propose for the new merge feature.
Hermes: [calls skill_view("opentrust:opentrust-tdd")]
        [answers with a seams-first TDD proposal]
```

## Workflow Guidance vs. Real Mutation

The plugin is a **process guide**, not an execution engine:

- `ot_*` tools return JSON guidance for the current workflow phase.
- Real changes (editing files, committing, pushing, opening PRs) happen
  through the normal Hermes/agent tooling **and still require human
  approval** — the OpenTrust gates (Approval, TDD RED/GREEN, Review,
  Merge) are human gates by design.

Keep this separation in mind: the model may use `ot_apply` guidance to plan
an implementation, but it must not modify the repository without your
explicit go-ahead.

## Verifying the Plugin Is Loaded

```bash
hermes -p isagi doctor
# Expect:
#   OpenTrust Plugin: Registered successfully
#     ✓ opentrust

hermes -p isagi plugins list
# opentrust | enabled | 1.0.0 | OpenTrust | user
```

## Enabling / Disabling

```bash
hermes -p isagi plugins enable opentrust
hermes -p isagi plugins disable opentrust

# Install/update the plugin files (from the OpenStrut repo):
# openstrut setup --platform hermes --home ~/.hermes/profiles/isagi
```

Disabling is not removal: the plugin directory remains, so re-enabling is
instant. To remove entirely, see
[Uninstallation](../installation/hermes.md#uninstallation).

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `ot_*` tools not available | `hermes -p isagi plugins enable opentrust`; restart session |
| Plugin not loading | Check `hermes -p isagi doctor`; confirm `plugins/opentrust/plugin.yaml` exists |
| Skills not discoverable | Re-run `openstrut setup --platform hermes --home ~/.hermes/profiles/isagi` to repopulate `skills/` |
| Wrong profile | OpenTrust is only enabled on `isagi`; use `hermes -p isagi` |
