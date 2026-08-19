"""
OpenTrust Hermes plugin tools.

Native Hermes plugin contract (validated against Hermes v0.20.0):

- Each tool has a JSON schema with ``name`` and ``parameters``.
- Each handler has the signature ``(args: dict, **kwargs) -> str`` and
  returns a JSON string via ``json.dumps``.

The tools are workflow-guidance only: they return a deterministic JSON
synthesis for each OpenTrust phase; they do not mutate any state.
"""

from __future__ import annotations

import json

TOOLSET = "opentrust"

SCHEMAS: dict[str, dict] = {
    "ot_explore": {
        "name": "ot_explore",
        "description": "OpenTrust Explore phase guidance (read-only investigation).",
        "parameters": {
            "type": "object",
            "properties": {
                "task": {
                    "type": "object",
                    "description": "Optional task contract state for context.",
                },
            },
            "required": [],
        },
    },
    "ot_propose": {
        "name": "ot_propose",
        "description": "OpenTrust Propose phase guidance (proposal and acceptance criteria).",
        "parameters": {
            "type": "object",
            "properties": {
                "task": {
                    "type": "object",
                    "description": "Optional task contract state for context.",
                },
            },
            "required": [],
        },
    },
    "ot_apply": {
        "name": "ot_apply",
        "description": "OpenTrust Apply phase guidance (approved-scope mutation, TDD gate).",
        "parameters": {
            "type": "object",
            "properties": {
                "task": {
                    "type": "object",
                    "description": "Optional task contract state for context.",
                },
            },
            "required": [],
        },
    },
    "ot_review": {
        "name": "ot_review",
        "description": "OpenTrust Review phase guidance (evidence-based review, read-only).",
        "parameters": {
            "type": "object",
            "properties": {
                "task": {
                    "type": "object",
                    "description": "Optional task contract state for context.",
                },
            },
            "required": [],
        },
    },
    "ot_ship": {
        "name": "ot_ship",
        "description": "OpenTrust Ship phase guidance (delivery, commit, PR).",
        "parameters": {
            "type": "object",
            "properties": {
                "task": {
                    "type": "object",
                    "description": "Optional task contract state for context.",
                },
            },
            "required": [],
        },
    },
    "ot_status": {
        "name": "ot_status",
        "description": "OpenTrust workflow status synthesis.",
        "parameters": {
            "type": "object",
            "properties": {
                "task": {
                    "type": "object",
                    "description": "Optional task contract state for context.",
                },
            },
            "required": [],
        },
    },
    "ot_incident": {
        "name": "ot_incident",
        "description": "OpenTrust incident guidance (smallest safe containment).",
        "parameters": {
            "type": "object",
            "properties": {
                "task": {
                    "type": "object",
                    "description": "Optional incident state for context.",
                },
            },
            "required": [],
        },
    },
    "ot_synthetize": {
        "name": "ot_synthetize",
        "description": "OpenTrust Synthetize guidance (grilling rounds, gap analysis, task contract).",
        "parameters": {
            "type": "object",
            "properties": {
                "task": {
                    "type": "object",
                    "description": "Optional task contract state for context.",
                },
            },
            "required": [],
        },
    },
    "ot_create": {
        "name": "ot_create",
        "description": "OpenTrust Create guidance (stack analysis, gap detection, recommendations).",
        "parameters": {
            "type": "object",
            "properties": {
                "task": {
                    "type": "object",
                    "description": "Optional task contract state for context.",
                },
            },
            "required": [],
        },
    },
    "ot_goal": {
        "name": "ot_goal",
        "description": "OpenTrust Goal guidance (autonomous multi-task loop with human gates).",
        "parameters": {
            "type": "object",
            "properties": {
                "task": {
                    "type": "object",
                    "description": "Optional task contract state for context.",
                },
            },
            "required": [],
        },
    },
    "ot_audit": {
        "name": "ot_audit",
        "description": "OpenTrust spec-anchored audit guidance (mechanical gate: exit 0 aligned, exit 1 findings).",
        "parameters": {
            "type": "object",
            "properties": {
                "change_dir": {
                    "type": "string",
                    "description": "Optional OpenSpec change directory path.",
                },
            },
            "required": [],
        },
    },
}


def _guidance(tool: str, phase: str, message: str, args: dict) -> str:
    """Return a deterministic JSON guidance string for a phase tool."""
    return json.dumps({
        "tool": tool,
        "phase": phase,
        "status": "guidance",
        "message": message,
        "received": bool(args),
    })


def handle_ot_explore(args, **kwargs):
    """Explore phase guidance. Returns a JSON string."""
    return _guidance(
        "ot_explore", "explore",
        "OpenTrust Explore: read-only investigation; no edits, installs, or branch changes.",
        args,
    )


def handle_ot_propose(args, **kwargs):
    """Propose phase guidance. Returns a JSON string."""
    return _guidance(
        "ot_propose", "propose",
        "OpenTrust Propose: write proposal and acceptance criteria; no implementation.",
        args,
    )


def handle_ot_apply(args, **kwargs):
    """Apply phase guidance. Returns a JSON string."""
    return _guidance(
        "ot_apply", "apply",
        "OpenTrust Apply: mutate only within approved scope; one microincrement at a time.",
        args,
    )


def handle_ot_review(args, **kwargs):
    """Review phase guidance. Returns a JSON string."""
    return _guidance(
        "ot_review", "review",
        "OpenTrust Review: inspect diff, tests, and evidence; no editing during review.",
        args,
    )


def handle_ot_ship(args, **kwargs):
    """Ship phase guidance. Returns a JSON string."""
    return _guidance(
        "ot_ship", "ship",
        "OpenTrust Ship: archive, commit, push, PR after tests pass and review approves.",
        args,
    )


def handle_ot_status(args, **kwargs):
    """Status guidance. Returns a JSON string."""
    return _guidance(
        "ot_status", "status",
        "OpenTrust Status: check task plan state, evidence, and next action.",
        args,
    )


def handle_ot_incident(args, **kwargs):
    """Incident guidance. Returns a JSON string."""
    return _guidance(
        "ot_incident", "incident",
        "OpenTrust Incident: diagnose, contain, recover with the smallest safe change.",
        args,
    )


def handle_ot_synthetize(args, **kwargs):
    """Synthetize guidance. Returns a JSON string."""
    return _guidance(
        "ot_synthetize", "synthetize",
        "OpenTrust Synthetize: grilling rounds, gap analysis, task contract output.",
        args,
    )


def handle_ot_create(args, **kwargs):
    """Create guidance. Returns a JSON string."""
    return _guidance(
        "ot_create", "create",
        "OpenTrust Create: stack analysis, gap detection, recommend-only output.",
        args,
    )


def handle_ot_goal(args, **kwargs):
    """Goal guidance. Returns a JSON string."""
    return _guidance(
        "ot_goal", "goal",
        "OpenTrust Goal: autonomous multi-task loop; human gates preserved.",
        args,
    )


def handle_ot_audit(args, **kwargs):
    """Audit guidance. Returns a JSON string."""
    return _guidance(
        "ot_audit", "audit",
        "OpenTrust Audit: run the mechanical spec-anchored gate; exit 0 = aligned, 1 = findings; skip/todo is not proof.",
        args,
    )
