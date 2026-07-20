"""
OpenTrust Plugin for Hermes-Agent

This plugin bootstraps OpenTrust context at session start,
injecting 40 agents, 11 skills, 10 commands, and 32 CTX + 24 B context selectors.

Usage:
    Add to plugins/ directory in Hermes-Agent:
    plugins/opentrust/

    The plugin will be automatically loaded by Hermes-Agent.
"""

from .tools import (
    handle_ot_explore,
    handle_ot_propose,
    handle_ot_apply,
    handle_ot_review,
    handle_ot_ship,
    handle_ot_status,
    handle_ot_incident,
    handle_ot_synthetize,
    handle_ot_create,
    handle_ot_goal,
)

from .hooks import on_session_start, on_session_end

__version__ = "1.0.0"
__author__ = "OpenTrust Team"
__description__ = "OpenTrust multi-platform agent harness"

__all__ = [
    "register",
    "on_session_start",
    "on_session_end",
    "handle_ot_explore",
    "handle_ot_propose",
    "handle_ot_apply",
    "handle_ot_review",
    "handle_ot_ship",
    "handle_ot_status",
    "handle_ot_incident",
    "handle_ot_synthetize",
    "handle_ot_create",
    "handle_ot_goal",
]


def register(ctx):
    """
    Register OpenTrust plugin with Hermes-Agent.
    
    This function is called by Hermes-Agent when loading the plugin.
    It registers tools, hooks, and skills with the Hermes context.
    
    Args:
        ctx: Hermes-Agent context object
    """
    # Register tools
    ctx.register_tool("ot_explore", handle_ot_explore)
    ctx.register_tool("ot_propose", handle_ot_propose)
    ctx.register_tool("ot_apply", handle_ot_apply)
    ctx.register_tool("ot_review", handle_ot_review)
    ctx.register_tool("ot_ship", handle_ot_ship)
    ctx.register_tool("ot_status", handle_ot_status)
    ctx.register_tool("ot_incident", handle_ot_incident)
    ctx.register_tool("ot_synthetize", handle_ot_synthetize)
    ctx.register_tool("ot_create", handle_ot_create)
    ctx.register_tool("ot_goal", handle_ot_goal)
    
    # Register hooks
    ctx.register_hook("on_session_start", on_session_start)
    ctx.register_hook("on_session_end", on_session_end)
    
    # Register skills
    ctx.register_skill("opentrust_task_contract", "skills/opentrust_task_contract.md")
    ctx.register_skill("opentrust_reference_research", "skills/opentrust_reference_research.md")
    ctx.register_skill("opentrust_delivery", "skills/opentrust_delivery.md")
    ctx.register_skill("opentrust_observability", "skills/opentrust_observability.md")
    ctx.register_skill("opentrust_spec_change", "skills/opentrust_spec_change.md")
    ctx.register_skill("opentrust_meeting_facilitator", "skills/opentrust_meeting_facilitator.md")
    ctx.register_skill("opentrust_decision_logger", "skills/opentrust_decision_logger.md")
    ctx.register_skill("opentrust_context_retrieval", "skills/opentrust_context_retrieval.md")
    ctx.register_skill("opentrust_workflow_orchestrator", "skills/opentrust_workflow_orchestrator.md")
    ctx.register_skill("opentrust_quality_gate", "skills/opentrust_quality_gate.md")
    ctx.register_skill("opentrust_security_review", "skills/opentrust_security_review.md")
    
    print("OpenTrust Plugin: Registered successfully")
    print("  • 10 tools registered")
    print("  • 2 hooks registered")
    print("  • 11 skills registered")
