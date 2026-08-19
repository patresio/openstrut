"""
OpenTrust Plugin for Hermes-Agent (native contract).

Registers 11 OpenTrust workflow-guidance tools with the native Hermes
plugin API: ``ctx.register_tool(name=, toolset=, schema=, handler=)``.

Skills are registered dynamically by the resource loader (no magic
count): installed plugins load from ``<plugin_dir>/skills``; development
plugins resolve ``$OPENSTRUST_ROOT/global/skills`` explicitly. Resource
location never uses repo-relative traversal or legacy session injection.
"""

from __future__ import annotations

from .resource_loader import load_skills
from .tools import (
    SCHEMAS,
    handle_ot_apply,
    handle_ot_audit,
    handle_ot_create,
    handle_ot_explore,
    handle_ot_goal,
    handle_ot_incident,
    handle_ot_propose,
    handle_ot_review,
    handle_ot_ship,
    handle_ot_status,
    handle_ot_synthetize,
)

__version__ = "1.0.0"
__author__ = "OpenTrust Team"
__description__ = "OpenTrust multi-platform agent harness"

TOOLSET = "opentrust"


def register(ctx):
    """Register OpenTrust tools and skills with the Hermes context."""
    ctx.register_tool(
        name="ot_explore",
        toolset=TOOLSET,
        schema=SCHEMAS["ot_explore"],
        handler=handle_ot_explore,
    )
    ctx.register_tool(
        name="ot_propose",
        toolset=TOOLSET,
        schema=SCHEMAS["ot_propose"],
        handler=handle_ot_propose,
    )
    ctx.register_tool(
        name="ot_apply",
        toolset=TOOLSET,
        schema=SCHEMAS["ot_apply"],
        handler=handle_ot_apply,
    )
    ctx.register_tool(
        name="ot_review",
        toolset=TOOLSET,
        schema=SCHEMAS["ot_review"],
        handler=handle_ot_review,
    )
    ctx.register_tool(
        name="ot_ship",
        toolset=TOOLSET,
        schema=SCHEMAS["ot_ship"],
        handler=handle_ot_ship,
    )
    ctx.register_tool(
        name="ot_status",
        toolset=TOOLSET,
        schema=SCHEMAS["ot_status"],
        handler=handle_ot_status,
    )
    ctx.register_tool(
        name="ot_incident",
        toolset=TOOLSET,
        schema=SCHEMAS["ot_incident"],
        handler=handle_ot_incident,
    )
    ctx.register_tool(
        name="ot_synthetize",
        toolset=TOOLSET,
        schema=SCHEMAS["ot_synthetize"],
        handler=handle_ot_synthetize,
    )
    ctx.register_tool(
        name="ot_create",
        toolset=TOOLSET,
        schema=SCHEMAS["ot_create"],
        handler=handle_ot_create,
    )
    ctx.register_tool(
        name="ot_goal",
        toolset=TOOLSET,
        schema=SCHEMAS["ot_goal"],
        handler=handle_ot_goal,
    )
    ctx.register_tool(
        name="ot_audit",
        toolset=TOOLSET,
        schema=SCHEMAS["ot_audit"],
        handler=handle_ot_audit,
    )

    # Register skills dynamically (no magic count).
    load_skills(ctx)

    print("OpenTrust Plugin: Registered successfully")
