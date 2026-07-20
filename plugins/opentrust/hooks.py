"""
OpenTrust Hooks for Hermes-Agent

This module implements the OpenTrust hooks for Hermes-Agent,
providing bootstrap injection at session start and cleanup at session end.
"""

import json
from pathlib import Path
from typing import Any, Dict


def load_agents() -> Dict[str, Any]:
    """
    Load agents from global/agents/.
    
    Returns:
        Dict[str, Any]: Agent definitions
    """
    agents_dir = Path(__file__).parent.parent.parent / "global" / "agents"
    agents = {}
    
    try:
        if agents_dir.exists():
            for file in agents_dir.glob("*.md"):
                agent_name = file.stem
                content = file.read_text(encoding="utf-8")
                agents[agent_name] = {
                    "name": agent_name,
                    "content": content,
                    "type": "lead" if "lead" in agent_name else "subagent"
                }
    except Exception as e:
        print(f"Failed to load agents: {e}")
    
    return agents


def load_skills() -> Dict[str, Any]:
    """
    Load skills from global/skills/.
    
    Returns:
        Dict[str, Any]: Skill definitions
    """
    skills_dir = Path(__file__).parent.parent.parent / "global" / "skills"
    skills = {}
    
    try:
        if skills_dir.exists():
            for file in skills_dir.glob("*.md"):
                skill_name = file.stem
                content = file.read_text(encoding="utf-8")
                skills[skill_name] = {
                    "name": skill_name,
                    "content": content,
                    "type": "skill"
                }
    except Exception as e:
        print(f"Failed to load skills: {e}")
    
    return skills


def load_context() -> Dict[str, Any]:
    """
    Load context definitions from global/context/.
    
    Returns:
        Dict[str, Any]: Context definitions (CTX + B)
    """
    context_dir = Path(__file__).parent.parent.parent / "global" / "context"
    context = {
        "contexts": {},
        "bundles": {}
    }
    
    try:
        # Load CTX definitions
        contexts_dir = context_dir / "contexts"
        if contexts_dir.exists():
            for file in contexts_dir.glob("*.md"):
                context_name = file.stem
                content = file.read_text(encoding="utf-8")
                context["contexts"][context_name] = {
                    "name": context_name,
                    "content": content,
                    "type": "context"
                }
        
        # Load B definitions
        bundles_dir = context_dir / "bundles"
        if bundles_dir.exists():
            for file in bundles_dir.glob("*.md"):
                bundle_name = file.stem
                content = file.read_text(encoding="utf-8")
                context["bundles"][bundle_name] = {
                    "name": bundle_name,
                    "content": content,
                    "type": "bundle"
                }
    except Exception as e:
        print(f"Failed to load context: {e}")
    
    return context


def load_commands() -> Dict[str, Any]:
    """
    Load commands from global/commands/.
    
    Returns:
        Dict[str, Any]: Command definitions
    """
    commands_dir = Path(__file__).parent.parent.parent / "global" / "commands"
    commands = {}
    
    try:
        if commands_dir.exists():
            for file in commands_dir.glob("*.md"):
                command_name = file.stem
                content = file.read_text(encoding="utf-8")
                commands[command_name] = {
                    "name": command_name,
                    "content": content,
                    "type": "command"
                }
    except Exception as e:
        print(f"Failed to load commands: {e}")
    
    return commands


def on_session_start(session: Any, project: Any) -> None:
    """
    Inject OpenTrust context at session start.
    
    Args:
        session: Hermes session object
        project: Hermes project object
    """
    print("OpenTrust Bootstrap: Starting...")
    
    # Load OpenTrust content
    agents = load_agents()
    skills = load_skills()
    context = load_context()
    commands = load_commands()
    
    # Inject context into session
    session.context.agents = agents
    session.context.skills = skills
    session.context.context = context
    session.context.commands = commands
    
    print("OpenTrust Bootstrap: Completed successfully")
    print(f"  • {len(agents)} agents loaded")
    print(f"  • {len(skills)} skills loaded")
    print(f"  • {len(context['contexts'])} contexts loaded")
    print(f"  • {len(context['bundles'])} bundles loaded")
    print(f"  • {len(commands)} commands loaded")


def on_session_end(session: Any, project: Any) -> None:
    """
    Cleanup OpenTrust context at session end.
    
    Args:
        session: Hermes session object
        project: Hermes project object
    """
    print("OpenTrust Cleanup: Starting...")
    
    # Clear context from session
    if hasattr(session.context, 'agents'):
        del session.context.agents
    if hasattr(session.context, 'skills'):
        del session.context.skills
    if hasattr(session.context, 'context'):
        del session.context.context
    if hasattr(session.context, 'commands'):
        del session.context.commands
    
    print("OpenTrust Cleanup: Completed successfully")
