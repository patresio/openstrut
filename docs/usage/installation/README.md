# Installation

The current release is installed from an SSH-only tarball copied from the homelab.

## Current Release

- package: `@patrese/opencode-engineering-harness`
- version: `0.1.0`
- tag: `v0.1.0`
- distribution: SSH/SCP only
- port: `22`

## Install Paths

The package installs managed artifacts into an OpenCode config root, normally:

```text
$HOME/.config/opencode
```

or, when set:

```text
$XDG_CONFIG_HOME/opencode
```

## Recommended Flow

1. Copy release files from homelab with SCP.
2. Verify `SHA256SUMS`.
3. Run `plan` from the tarball.
4. Review planned changes.
5. Run `install` from the tarball.
6. Run `check` from the tarball.
7. Verify OpenCode sees the installed agents.

## Detailed Guides

- [SSH Tarball Install](ssh-tarball.md)
- [npm exec Usage](npm-exec.md)
- [Verification](verification.md)

## Do Not

- do not copy agents, skills, or commands manually;
- do not open HTTP ports;
- do not start an HTTP server;
- do not publish this private package to npm;
- do not install from a registry unless a future release explicitly documents it.
