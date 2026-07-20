"""
OpenTrust Tools for Hermes-Agent

This module implements the OpenTrust tools for Hermes-Agent,
providing context-aware guidance for each phase of the workflow.
"""

import json
from pathlib import Path


def handle_ot_explore(session, task, project):
    """
    Handle ot_explore tool call.
    
    Args:
        session: Hermes session object
        task: Task object
        project: Project object
        
    Returns:
        dict: Tool result
    """
    return {
        "content": [
            {
                "type": "text",
                "text": (
                    f"OpenTrust Explore Phase:\n"
                    f"• Task: {task.get('name', 'unknown')}\n"
                    f"• Project: {project.get('name', 'unknown')}\n"
                    f"• Phase: Explore (Read Only)\n"
                    f"• Allowed: reading, searching, git history, diagnostics\n"
                    f"• Forbidden: edits, installations, branch changes, commits"
                )
            }
        ]
    }


def handle_ot_propose(session, task, project):
    """
    Handle ot_propose tool call.
    
    Args:
        session: Hermes session object
        task: Task object
        project: Project object
        
    Returns:
        dict: Tool result
    """
    return {
        "content": [
            {
                "type": "text",
                "text": (
                    f"OpenTrust Propose Phase:\n"
                    f"• Task: {task.get('name', 'unknown')}\n"
                    f"• Project: {project.get('name', 'unknown')}\n"
                    f"• Phase: Propose (Read Only)\n"
                    f"• Allowed: writing proposal documents, comparing alternatives\n"
                    f"• Forbidden: implementation, file creation outside proposal\n"
                    f"• Output: Approved plan with Acceptance Criteria"
                )
            }
        ]
    }


def handle_ot_apply(session, task, project):
    """
    Handle ot_apply tool call.
    
    Args:
        session: Hermes session object
        task: Task object
        project: Project object
        
    Returns:
        dict: Tool result
    """
    return {
        "content": [
            {
                "type": "text",
                "text": (
                    f"OpenTrust Apply Phase:\n"
                    f"• Task: {task.get('name', 'unknown')}\n"
                    f"• Project: {project.get('name', 'unknown')}\n"
                    f"• Phase: Apply (Mutation)\n"
                    f"• Allowed: implementation within approved scope\n"
                    f"• Required: Task Plan, TDD-First gate for behavioral changes\n"
                    f"• Rule: One microincrement at a time, validate after each"
                )
            }
        ]
    }


def handle_ot_review(session, task, project):
    """
    Handle ot_review tool call.
    
    Args:
        session: Hermes session object
        task: Task object
        project: Project object
        
    Returns:
        dict: Tool result
    """
    return {
        "content": [
            {
                "type": "text",
                "text": (
                    f"OpenTrust Review Phase:\n"
                    f"• Task: {task.get('name', 'unknown')}\n"
                    f"• Project: {project.get('name', 'unknown')}\n"
                    f"• Phase: Review (Read Only)\n"
                    f"• Allowed: reading diff, running tests, inspecting evidence\n"
                    f"• Forbidden: editing code during review\n"
                    f"• Output: Review report with findings or approval"
                )
            }
        ]
    }


def handle_ot_ship(session, task, project):
    """
    Handle ot_ship tool call.
    
    Args:
        session: Hermes session object
        task: Task object
        project: Project object
        
    Returns:
        dict: Tool result
    """
    return {
        "content": [
            {
                "type": "text",
                "text": (
                    f"OpenTrust Ship Phase:\n"
                    f"• Task: {task.get('name', 'unknown')}\n"
                    f"• Project: {project.get('name', 'unknown')}\n"
                    f"• Phase: Ship (Delivery)\n"
                    f"• Allowed: archive, commit, push, PR\n"
                    f"• Required: all tests pass, review approved, diff inspected\n"
                    f"• Retrieval: Must not include private retrieval content in commits"
                )
            }
        ]
    }


def handle_ot_status(session, task, project):
    """
    Handle ot_status tool call.
    
    Args:
        session: Hermes session object
        task: Task object
        project: Project object
        
    Returns:
        dict: Tool result
    """
    return {
        "content": [
            {
                "type": "text",
                "text": (
                    f"OpenTrust Status:\n"
                    f"• Task: {task.get('name', 'unknown')}\n"
                    f"• Project: {project.get('name', 'unknown')}\n"
                    f"• Status: Active\n"
                    f"• Phase: Unknown\n"
                    f"• Next Action: Check task plan"
                )
            }
        ]
    }


def handle_ot_incident(session, task, project):
    """
    Handle ot_incident tool call.
    
    Args:
        session: Hermes session object
        task: Task object
        project: Project object
        
    Returns:
        dict: Tool result
    """
    return {
        "content": [
            {
                "type": "text",
                "text": (
                    f"OpenTrust Incident Response:\n"
                    f"• Task: {task.get('name', 'unknown')}\n"
                    f"• Project: {project.get('name', 'unknown')}\n"
                    f"• Phase: Incident\n"
                    f"• Priority: diagnosis, containment, recovery\n"
                    f"• Rule: smallest safe change"
                )
            }
        ]
    }


def handle_ot_synthetize(session, task, project):
    """
    Handle ot_synthetize tool call.
    
    Args:
        session: Hermes session object
        task: Task object
        project: Project object
        
    Returns:
        dict: Tool result
    """
    return {
        "content": [
            {
                "type": "text",
                "text": (
                    f"OpenTrust Synthetize:\n"
                    f"• Task: {task.get('name', 'unknown')}\n"
                    f"• Project: {project.get('name', 'unknown')}\n"
                    f"• Mode: 4-round Grilling + gap analysis + task contract\n"
                    f"• Output: Task contract with retrieval context"
                )
            }
        ]
    }


def handle_ot_create(session, task, project):
    """
    Handle ot_create tool call.
    
    Args:
        session: Hermes session object
        task: Task object
        project: Project object
        
    Returns:
        dict: Tool result
    """
    return {
        "content": [
            {
                "type": "text",
                "text": (
                    f"OpenTrust Create:\n"
                    f"• Task: {task.get('name', 'unknown')}\n"
                    f"• Project: {project.get('name', 'unknown')}\n"
                    f"• Mode: stack analysis → gap detection → recommendations\n"
                    f"• Output: Creation recommendations (recommend-only)"
                )
            }
        ]
    }


def handle_ot_goal(session, task, project):
    """
    Handle ot_goal tool call.
    
    Args:
        session: Hermes session object
        task: Task object
        project: Project object
        
    Returns:
        dict: Tool result
    """
    return {
        "content": [
            {
                "type": "text",
                "text": (
                    f"OpenTrust Goal:\n"
                    f"• Task: {task.get('name', 'unknown')}\n"
                    f"• Project: {project.get('name', 'unknown')}\n"
                    f"• Mode: multi-task autonomous loop\n"
                    f"• Limits: max 5 tasks, 3 worktrees, 4h runtime, 3 retries\n"
                    f"• Rule: human gates preserved"
                )
            }
        ]
    }
