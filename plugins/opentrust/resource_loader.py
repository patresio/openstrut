"""
OpenTrust Hermes plugin resource loader.

Resolves plugin resources (skills) with a strict resolution order so the
plugin is self-sufficient when installed and explicit about its source
during development:

1. Installed (self-sufficient): <plugin_dir>/skills — populated by the
   openstrut installer with global/skills/*/SKILL.md at install time.
2. Development: $OPENSTRUST_ROOT/global/skills — explicit source when the
   plugin runs from the repository without an installed skills/ tree.

Resource location is always derived from the plugin directory itself or
from the OPENSTRUST_ROOT environment variable; the loader never walks
up the directory tree and never uses repository-relative paths.

Skills are discovered dynamically from <skills_dir>/*/SKILL.md with no
magic count — every subdirectory that contains a SKILL.md is registered.
"""

from __future__ import annotations

import os
from pathlib import Path

PLUGIN_DIR = Path(__file__).resolve().parent

# Name of the skills directory shipped inside the plugin (installed mode).
LOCAL_SKILLS_DIRNAME = "skills"


def local_skills_dir() -> Path:
    """Return the plugin-local skills directory (installed mode)."""
    return PLUGIN_DIR / LOCAL_SKILLS_DIRNAME


def dev_skills_dir() -> Path | None:
    """Return $OPENSTRUST_ROOT/global/skills when present (dev mode)."""
    root = os.environ.get("OPENSTRUST_ROOT")
    if not root:
        return None
    candidate = Path(root) / "global" / LOCAL_SKILLS_DIRNAME
    return candidate if candidate.is_dir() else None


def resolve_skills_dir() -> Path | None:
    """Return the skills directory to load from, or None when unavailable."""
    local = local_skills_dir()
    if local.is_dir():
        return local
    return dev_skills_dir()


def discover_skills(skills_dir: Path | None) -> list[str]:
    """Return sorted skill names whose subdirectory contains SKILL.md.

    No magic number: every <dir>/<name>/SKILL.md is discovered.
    """
    if skills_dir is None or not skills_dir.is_dir():
        return []
    return sorted(
        child.name
        for child in skills_dir.iterdir()
        if child.is_dir() and (child / "SKILL.md").is_file()
    )


def load_skills(ctx) -> list[str]:
    """Register every discovered skill via ctx.register_skill(name, Path).

    Returns the list of registered skill names (empty when no skills dir
    is available). Uses the canonical Hermes plugin skill API:
    ``ctx.register_skill(child.name, skill_md)``.
    """
    skills_dir = resolve_skills_dir()
    names = discover_skills(skills_dir)
    for name in names:
        ctx.register_skill(name, skills_dir / name / "SKILL.md")  # type: ignore[operator]
    return names
