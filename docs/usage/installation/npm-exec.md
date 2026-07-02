# npm exec Usage

The current release is intended to run directly from the tarball with `npm exec`.

## Why `npm exec`

`npm exec --package=<tarball>` lets the client run the package binary without publishing the package to a registry and without installing it globally first.

## Binary

The package binary is:

```text
opencode-engineering-harness
```

## Basic Form

```bash
npm exec \
  --yes \
  --package="$tarball" \
  -- opencode-engineering-harness \
  <command> \
  [options]
```

## Commands

```bash
npm exec --yes --package="$tarball" -- opencode-engineering-harness --help
npm exec --yes --package="$tarball" -- opencode-engineering-harness --version
npm exec --yes --package="$tarball" -- opencode-engineering-harness plan --target "$HOME/.config/opencode"
npm exec --yes --package="$tarball" -- opencode-engineering-harness install --target "$HOME/.config/opencode"
npm exec --yes --package="$tarball" -- opencode-engineering-harness check --target "$HOME/.config/opencode"
```

## About `npx`

`npx` is acceptable only as an npm-exec-style launcher for the local tarball.

Prefer `npm exec` in documentation because it is explicit about the package source.

Do not use:

```bash
npx @patrese/opencode-engineering-harness
```

unless a future release is intentionally published to a registry.

## Target Selection

Use explicit target for predictable installs:

```bash
--target "$HOME/.config/opencode"
```

If omitted, the CLI resolves target by:

1. `$XDG_CONFIG_HOME/opencode`
2. `$HOME/.config/opencode`
