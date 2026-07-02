# Installation Guide

The package `@patrese/opencode-engineering-harness` can be installed using npm.

## Current Release

- package: `@patrese/opencode-engineering-harness`
- version: `0.1.0`
- distribution: git bare + npm (recommended) or SSH/SCP tarball
- port: SSH only (22) — no HTTP ports required

## Recommended Flow (Any Machine): `npm pack` + Transfer

This works on any machine with Node.js ≥ 20, regardless of git access:

```bash
# On the machine with the source repository
cd /srv/projects/opencode-engineering-harness
npm pack            # creates patrese-opencode-engineering-harness-0.1.0.tgz
```

Transfer the `.tgz` file (SCP, rsync, USB) to the target machine, then:

```bash
# On the target machine
npm install -g ./patrese-opencode-engineering-harness-0.1.0.tgz
```

Verify installation:

```bash
opencode-engineering-harness --version
opencode-engineering-harness --help
```

## Alternative: npm from Git Bare (Homelab Only)

Install directly from the local git bare repository:

```bash
npm install -g /srv/git/opencode-engineering-harness.git
```

Verify installation:

```bash
opencode-engineering-harness --version
opencode-engineering-harness --help
```

Install managed artifacts:

```bash
opencode-engineering-harness plan
opencode-engineering-harness install
opencode-engineering-harness check
```

## Alternative: SSH/SCP Tarball

If npm from git bare is unavailable:

1. Copy release files from homelab with SCP.
2. Verify `SHA256SUMS`.
3. Install from tarball:

```bash
npm install -g ./opencode-engineering-harness-0.1.0.tgz
```

## Next Steps (After v0.1.0)

Once package is published to a registry or HTTP distribution is enabled:

- do not install from untrusted registries;
- do not run HTTP servers without network security review;
- verify tarball checksums before installation.

## Detailed Guides

- [Git Bare + npm Install](git-npm-install.md)
- [SSH Tarball Install](ssh-tarball.md)
- [npm exec Usage](npm-exec.md)
- [Verification](verification.md)

## Do Not (v0.1.0)

- do not copy agents, skills, or commands manually;
- do not publish this private package to npm without explicit approval;
- do not install from a registry unless a future release explicitly documents it.
