#!/usr/bin/env bash
set -euo pipefail

REPO="patresio/openstrut"

# Colors
BOLD='\033[1m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

info()  { printf "${BOLD}%s${NC}\n" "$*"; }
ok()    { printf "${GREEN}OK${NC} %s\n" "$*"; }
err()   { printf "${RED}ERROR${NC} %s\n" "$*"; exit 1; }

info "OpenStrut Installer"
info "====================="
echo

# Check Node.js
if ! command -v node &>/dev/null; then
  err "Node.js >=20 is required but not found. Install it from https://nodejs.org"
fi
NODE_VER=$(node --version | sed 's/v//' | cut -d. -f1)
if [ "$NODE_VER" -lt 20 ]; then
  err "Node.js >=20 required, found $(node --version)"
fi
ok "Node.js $(node --version)"

# Determine latest release tag
info "Fetching latest release..."
LATEST=$(curl -sfL "https://api.github.com/repos/${REPO}/releases/latest" | \
  grep '"tag_name"' | head -1 | sed 's/.*"tag_name": "\(.*\)",/\1/')
if [ -z "$LATEST" ]; then
  err "Could not determine latest release tag"
fi
ok "Latest release: ${LATEST}"

# Create tmp dir
TMPDIR=$(mktemp -d)
trap 'rm -rf "$TMPDIR"' EXIT

# Download tarball
TARBALL="openstrut-${LATEST}.tgz"
DOWNLOAD_URL="https://github.com/${REPO}/releases/download/${LATEST}/${TARBALL}"
info "Downloading ${DOWNLOAD_URL}..."
curl -sfL "$DOWNLOAD_URL" -o "${TMPDIR}/${TARBALL}"
ok "Downloaded ${TARBALL}"

# Extract
EXTRACT_DIR="${TMPDIR}/package"
mkdir -p "$EXTRACT_DIR"
tar -xzf "${TMPDIR}/${TARBALL}" -C "$TMPDIR"
ok "Extracted"

# Install via npm
info "Installing globally via npm..."
npm install -g "${TMPDIR}/package" --no-save --no-audit --no-fund
ok "Global npm install complete"

# Run harness installer
if command -v openstrut &>/dev/null; then
  info "Running harness installer..."
  openstrut install
else
  # Fallback: use npx or direct path
  node "${TMPDIR}/package/bin/openstrut.js" install
fi

echo
info "========================================"
info "Installation complete!"
info "Run 'openstrut check' to verify."
