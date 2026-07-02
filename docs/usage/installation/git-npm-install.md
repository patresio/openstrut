# Installation Guide — Git Bare Local + npm

This guide shows how to install `@patrese/opencode-engineering-harness` from the git bare repository at `/srv/git/opencode-engineering-harness.git`.

## Installation Method 1: npm from Git Bare (Recommended)

Install directly from the local git bare repository:

```bash
npm install -g /srv/git/opencode-engineering-harness.git
```

Verify installation:

```bash
opencode-engineering-harness --version
opencode-engineering-harness --help
```

## Installation Method 2: npm from Local Checkout

Clone and link for development:

```bash
git clone /srv/git/opencode-engineering-harness.git ~/opencode-harness
cd ~/opencode-harness
npm install -g .
```

## Installation Method 3: npm from Tarball

After building a release tarball:

```bash
npm install -g ./opencode-engineering-harness-0.1.0.tgz
```

Build tarball without publishing:

```bash
npm pack --dry-run  # preview
npm pack            # create tarball
```

## Quick Start

After installation, set up global OpenCode config:

```bash
# Review what will be installed
opencode-engineering-harness plan

# Install managed artifacts into $XDG_CONFIG_HOME/opencode or $HOME/.config/opencode
opencode-engineering-harness install

# Verify installation
opencode-engineering-harness check
```

## Use Installed Agents

After installation, the following are available to OpenCode:

- `AGENTS.md` — global engineering execution rules
- `agents/` — custom agents (sdd, code-reviewer, project-rules-auditor)
- `commands/` — workflow commands (eng-plan, eng-spec-change, etc.)
- `skills/` — reusable engineering skills (engineering-tdd-first, etc.)
- `templates/project/` — project initialization templates

## Advanced: Custom Install Target

Install to a custom target directory:

```bash
opencode-engineering-harness install --target /custom/config/root
```

Useful for CI/CD or isolated validation.

## Uninstall

Currently not supported. To revert:

```bash
# Remove the installation manifest
rm -rf ~/.config/opencode/.engineering-harness

# Remove managed files manually or use a fresh config directory
```

## Support

For issues or questions, see:
- `README.md` — project overview
- `CONTRIBUTING.md` — contribution policy
- `docs/ARCHITECTURE.md` — system design
