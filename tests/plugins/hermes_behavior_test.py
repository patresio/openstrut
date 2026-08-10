"""
Behavioral test for the OpenTrust Hermes plugin against the REAL Hermes
contract (validated in G5, Hermes v0.20.0).

Runs register(ctx) with a fake ctx that records calls, then asserts:

1. register(ctx) executes without raising.
2. Exactly the 10 ot_* tools are registered with the native signature
   (name=, toolset=, schema=, handler=).
3. Skills are discovered dynamically from */SKILL.md (no magic count),
   each registered via ctx.register_skill(name, Path):
   - dev mode: $OPENSTRUST_ROOT/global/skills (explicit source)
   - installed mode: <plugin_dir>/skills (self-sufficient, no env var)
4. No legacy session.context injection and no fake on_session_start hook.
5. Resource resolution never uses parent.parent.parent or ../../global.

Run directly:  python3 tests/plugins/hermes_behavior_test.py
"""

from __future__ import annotations

import json
import os
import shutil
import sys
import tempfile
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
PLUGIN_DIR = REPO_ROOT / "plugins" / "opentrust"
GLOBAL_SKILLS = REPO_ROOT / "global" / "skills"

sys.path.insert(0, str(REPO_ROOT))

EXPECTED_TOOLS = [
    "ot_explore", "ot_propose", "ot_apply", "ot_review", "ot_ship",
    "ot_status", "ot_incident", "ot_synthetize", "ot_create", "ot_goal",
]


class FakeCtx:
    """Minimal Hermes plugin context recording native API calls."""

    def __init__(self):
        self.tools = []
        self.hooks = []
        self.skills = []
        self.commands = []
        self.cli_commands = []

    def register_tool(self, *args, **kwargs):
        self.tools.append({"args": args, "kwargs": kwargs})

    def register_hook(self, *args, **kwargs):
        self.hooks.append({"args": args, "kwargs": kwargs})

    def register_skill(self, *args, **kwargs):
        self.skills.append({"args": args, "kwargs": kwargs})

    def register_command(self, *args, **kwargs):
        self.commands.append({"args": args, "kwargs": kwargs})

    def register_cli_command(self, *args, **kwargs):
        self.cli_commands.append({"args": args, "kwargs": kwargs})


def canonical_skill_names() -> list[str]:
    if not GLOBAL_SKILLS.exists():
        return []
    return sorted(
        p.name for p in GLOBAL_SKILLS.iterdir()
        if p.is_dir() and (p / "SKILL.md").exists()
    )


def assert_register_contract(ctx, label: str, plugin_dir: Path) -> list[str]:
    """Assert the native registration contract; return registered skill names."""
    failures = []

    def check(cond, msg):
        status = "PASS" if cond else "FAIL"
        print(f"  [{status}] {label}: {msg}")
        if not cond:
            failures.append(msg)

    # 1. Tools with native signature
    tool_names = []
    for rec in ctx.tools:
        kw = rec["kwargs"]
        name = kw.get("name") or (rec["args"][0] if rec["args"] else None)
        if name:
            tool_names.append(name)
        check("toolset" in kw, f"tool {name}: uses toolset= keyword")
        check("schema" in kw, f"tool {name}: uses schema= keyword")
        check("handler" in kw, f"tool {name}: uses handler= keyword")
    check(set(tool_names) == set(EXPECTED_TOOLS),
          f"registered tools == 10 ot_* ({sorted(tool_names)})")

    # 2. Skills registered with existing Path to SKILL.md
    registered_skill_names = []
    for rec in ctx.skills:
        kw = rec["kwargs"]
        name = kw.get("name") or (rec["args"][0] if rec["args"] else None)
        registered_skill_names.append(name)
        skill_path = kw.get("path") or (rec["args"][1] if len(rec["args"]) > 1 else None)
        check(skill_path is not None and Path(skill_path).exists(),
              f"skill {name}: registered with existing Path ({skill_path})")
        if skill_path:
            check(Path(skill_path).name == "SKILL.md",
                  f"skill {name}: path basename is SKILL.md")
    check(len(registered_skill_names) >= 11,
          f"registered >=11 skills dynamically (found {len(registered_skill_names)})")
    check(len(registered_skill_names) == len(set(registered_skill_names)),
          "registered skill names are unique")

    # 3. No legacy session.context / fake on_session_start
    init_src = (plugin_dir / "__init__.py").read_text(encoding="utf-8")
    loader_src = (plugin_dir / "resource_loader.py").read_text(encoding="utf-8")
    check("session.context" not in init_src,
          "no session.context injection (legacy API)")
    check("on_session_start" not in init_src,
          "no fake on_session_start hook registration")
    allowed_events = {"post_tool_call", "on_session_end", "pre_tool_call",
                      "agent_start", "agent_end", "agent_step"}
    for rec in ctx.hooks:
        ev = rec["kwargs"].get("event") or (rec["args"][0] if rec["args"] else None)
        check(ev in allowed_events, f"hook event '{ev}' is a real Hermes event")

    # 4. Resource resolution self-sufficiency (no repo-relative traversal)
    for fname in ("__init__.py", "tools.py", "resource_loader.py"):
        fpath = plugin_dir / fname
        if not fpath.exists():
            continue
        src = fpath.read_text(encoding="utf-8")
        check("parent.parent.parent" not in src,
              f"{fname}: no parent.parent.parent resource resolution")
        check("../../global" not in src,
              f"{fname}: no ../../global relative path")
    check("OPENSTRUST_ROOT" in loader_src,
          "resource_loader supports OPENSTRUST_ROOT dev source")
    check("Path(__file__)" in loader_src,
          "resource_loader resolves from plugin dir (Path(__file__))")

    if failures:
        raise AssertionError(f"{label}: {len(failures)} failures:\n" + "\n".join(failures))
    return registered_skill_names


def run_dev_mode() -> list[str]:
    """Dev mode: OPENSTRUST_ROOT points at the repo (explicit source)."""
    print(f"\nMode: dev (OPENSTRUST_ROOT={REPO_ROOT})")
    os.environ["OPENSTRUST_ROOT"] = str(REPO_ROOT)
    import plugins.opentrust as plugin  # noqa: PLC0415

    ctx = FakeCtx()
    plugin.register(ctx)
    names = assert_register_contract(ctx, "dev", PLUGIN_DIR)
    return names


def run_installed_mode() -> list[str]:
    """Installed mode: plugin copied to tmp with skills/ populated; no env var."""
    print("\nMode: installed (skills/ populated, OPENSTRUST_ROOT unset)")
    tmp = Path(tempfile.mkdtemp(prefix="opentrust-installed-"))
    try:
        # Import path is tmp/plugins/opentrust so `import plugins.opentrust`
        # resolves to the copied plugin (not the repo one).
        installed = tmp / "plugins" / "opentrust"
        shutil.copytree(PLUGIN_DIR, installed)
        # Populate skills/ as the installer does (from canonical source).
        skills_dst = installed / "skills"
        skills_dst.mkdir()
        for name in canonical_skill_names():
            shutil.copytree(GLOBAL_SKILLS / name, skills_dst / name)
        sys.path.insert(0, str(tmp))
        try:
            # Reset module cache so the copied plugin is imported.
            for mod in list(sys.modules):
                if mod == "plugins" or mod.startswith("plugins.opentrust"):
                    del sys.modules[mod]
            os.environ.pop("OPENSTRUST_ROOT", None)
            import plugins.opentrust as plugin  # noqa: PLC0415

            ctx = FakeCtx()
            plugin.register(ctx)
            names = assert_register_contract(ctx, "installed", installed)
            return names
        finally:
            sys.path.remove(str(tmp))
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


def main() -> int:
    failures = []

    try:
        os.environ.pop("OPENSTRUST_ROOT", None)
        # Clean plugin module cache before both modes.
        for mod in list(sys.modules):
            if mod == "plugins" or mod.startswith("plugins.opentrust"):
                del sys.modules[mod]

        canonical = canonical_skill_names()
        print(f"Hermes plugin behavioral contract")
        print(f"  canonical global/skills skills: {len(canonical)}")
        if len(canonical) < 11:
            print(f"RESULT: 1 failure (canonical skills < 11)")
            return 1

        dev_names = run_dev_mode()
        installed_names = run_installed_mode()

        # Cross-mode consistency
        if set(dev_names) != set(canonical):
            failures.append(f"dev mode skills != canonical ({len(dev_names)} vs {len(canonical)})")
        if set(installed_names) != set(canonical):
            failures.append(f"installed mode skills != canonical ({len(installed_names)} vs {len(canonical)})")

        for f in failures:
            print(f"  [FAIL] {f}")
        print(f"RESULT: {len(failures)} failures")
        return 1 if failures else 0
    except AssertionError as exc:
        print(f"RESULT: failure - {exc}")
        return 1
    except Exception as exc:  # pragma: no cover - diagnostic
        print(f"RESULT: error - {exc!r}")
        return 1


if __name__ == "__main__":
    sys.exit(main())
