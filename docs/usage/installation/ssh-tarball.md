# SSH Tarball Install

Use this guide from the client computer.

## Inputs

Set these values on the client:

```bash
export HOMELAB_SSH_HOST="<IP_TAILSCALE_OU_HOSTNAME>"
export HOMELAB_SSH_USER="patrese"
export RELEASE_VERSION="0.1.0"
```

Known homelab addresses from the release run:

```text
hostname: homelab
LAN IP: 192.168.0.101
Tailscale IP: 100.100.141.105
```

Choose the reachable hostname or IP for your client network.

## Copy Release Files

```bash
client_release_dir="$HOME/.cache/opencode-engineering-harness/releases/v$RELEASE_VERSION"

mkdir -p "$client_release_dir"

scp \
  "$HOMELAB_SSH_USER@$HOMELAB_SSH_HOST:/home/patrese/.local/share/opencode-engineering-harness/releases/v$RELEASE_VERSION/*" \
  "$client_release_dir/"
```

This uses SSH/SCP over port `22`. No extra firewall rule is required.

## Verify Checksum

```bash
cd "$client_release_dir"

sha256sum -c SHA256SUMS
```

Expected:

```text
patrese-opencode-engineering-harness-0.1.0.tgz: OK
```

## Discover Tarball

```bash
tarball="$(
  find "$client_release_dir" \
    -maxdepth 1 \
    -type f \
    -name '*.tgz' \
    -print \
    -quit
)"

test -n "$tarball"
```

## Plan Install

```bash
npm exec \
  --yes \
  --package="$tarball" \
  -- opencode-engineering-harness \
  plan \
  --target "$HOME/.config/opencode"
```

Review the output before installing.

## Install

```bash
npm exec \
  --yes \
  --package="$tarball" \
  -- opencode-engineering-harness \
  install \
  --target "$HOME/.config/opencode"
```

## Check

```bash
npm exec \
  --yes \
  --package="$tarball" \
  -- opencode-engineering-harness \
  check \
  --target "$HOME/.config/opencode"
```

Expected success line:

```text
All managed artifacts match the installed version.
```
