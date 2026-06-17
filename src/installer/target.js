/**
 * Target directory resolution for the OpenCode Engineering Harness installer.
 *
 * Resolution order:
 * 1. Explicit --target <dir>
 * 2. $XDG_CONFIG_HOME/opencode
 * 3. $HOME/.config/opencode
 * 4. $USERPROFILE/.config/opencode  (Windows fallback when HOME is unset)
 * 5. Error: cannot resolve safely
 *
 * Safety invariants:
 * - Filesystem root is always rejected.
 * - Empty or blank targets are always rejected.
 * - The package root and its subdirectories are always rejected.
 * - Any path segment that is a symbolic link causes rejection.
 */

import path from 'node:path';
import fs from 'node:fs';

/** Manifest directory name within the target root. */
export const MANIFEST_DIR = '.engineering-harness';

/** Manifest filename within MANIFEST_DIR. */
export const MANIFEST_FILE = 'installation.json';

/**
 * Resolves and validates the target OpenCode configuration root.
 *
 * @param {{ target?: string }} opts
 * @returns {string} Absolute, normalized target path
 * @throws {Error} When the target cannot be resolved safely
 */
export function resolveTarget(opts = {}) {
  if (opts.target !== undefined) {
    // Explicit target provided — never fall back to default
    const raw = opts.target;
    if (!raw || !raw.trim()) {
      throw new Error(
        '--target was provided but the value is empty or blank. ' +
        'Provide a non-empty directory path.'
      );
    }
    const resolved = path.resolve(raw.trim());
    validateTargetPath(resolved);
    return resolved;
  }

  const defaultPath = defaultTarget();
  if (!defaultPath) {
    throw new Error(
      'Cannot resolve OpenCode configuration root. ' +
      'Provide --target <directory>, set $XDG_CONFIG_HOME, or ensure $HOME is set.'
    );
  }

  const resolved = path.resolve(defaultPath);
  validateTargetPath(resolved);
  return resolved;
}

/**
 * Returns the default target path derived from the environment.
 * Precedence: $XDG_CONFIG_HOME/opencode → $HOME/.config/opencode → $USERPROFILE/.config/opencode
 *
 * @returns {string|undefined}
 */
function defaultTarget() {
  const xdg = process.env.XDG_CONFIG_HOME;
  if (xdg && xdg.trim()) {
    return path.join(xdg.trim(), 'opencode');
  }
  const home = process.env.HOME ?? process.env.USERPROFILE;
  if (home && home.trim()) {
    return path.join(home.trim(), '.config', 'opencode');
  }
  return undefined;
}

/**
 * Validates a resolved target path, throwing for unsafe or invalid values.
 *
 * @param {string} resolved - Absolute normalized path
 */
export function validateTargetPath(resolved) {
  if (!resolved || resolved.trim() === '') {
    throw new Error('Rejected empty target path.');
  }

  if (resolved === '/') {
    throw new Error(`Rejected unsafe target: "${resolved}"`);
  }

  // Reject any path that is exactly the filesystem root
  if (resolved === path.parse(resolved).root) {
    throw new Error(`Refused to target filesystem root: "${resolved}"`);
  }

  // Detect paths with fewer than two meaningful components after root
  const parts = resolved.split(path.sep).filter(Boolean);
  if (parts.length < 2) {
    throw new Error(`Target path too short, likely unsafe: "${resolved}"`);
  }

  // path.resolve already normalizes, but guard against any residual traversal
  if (resolved.includes('..')) {
    throw new Error(`Target path contains traversal after resolution: "${resolved}"`);
  }
}

/**
 * Rejects installation into the package root or any of its subdirectories,
 * and also rejects a target that contains the package root (ancestor).
 *
 * @param {string} targetRoot  - Resolved absolute target root
 * @param {string} packageRoot - Resolved absolute package root
 */
export function validateTargetNotPackageRoot(targetRoot, packageRoot) {
  const normalTarget = path.resolve(targetRoot);
  const normalPkg = path.resolve(packageRoot);

  if (normalTarget === normalPkg) {
    throw new Error(
      `Refused to target the package root directory itself: "${normalTarget}"`
    );
  }
  if (normalTarget.startsWith(normalPkg + path.sep)) {
    throw new Error(
      `Refused to target a subdirectory of the package root: "${normalTarget}"`
    );
  }
  if (normalPkg.startsWith(normalTarget + path.sep)) {
    throw new Error(
      `Refused to target a directory that is an ancestor of the package root: "${normalTarget}"`
    );
  }
}

/**
 * Validates that a managed relative path does not escape the target root.
 *
 * @param {string} targetRoot  - Resolved absolute target root
 * @param {string} relativePath - Relative path from the artifact entry
 * @throws {Error} If the resolved path escapes the target root
 */
export function validateRelativePath(targetRoot, relativePath) {
  if (path.isAbsolute(relativePath)) {
    throw new Error(`Managed path must be relative, got: "${relativePath}"`);
  }

  const joined = path.resolve(targetRoot, relativePath);
  if (!joined.startsWith(targetRoot + path.sep) && joined !== targetRoot) {
    throw new Error(
      `Path traversal detected: "${relativePath}" escapes target root "${targetRoot}"`
    );
  }
}

/**
 * Returns true if the given path itself (not ancestors) is a symlink.
 * Returns false if the path does not exist.
 *
 * @param {string} absPath
 * @returns {boolean}
 */
export function isSymlink(absPath) {
  try {
    return fs.lstatSync(absPath).isSymbolicLink();
  } catch {
    return false;
  }
}

/**
 * Walks every existing segment from the filesystem root down to absPath
 * (inclusive) and returns the first segment that is a symbolic link.
 *
 * Returns { symlinked: false } when no symlink is found among existing segments.
 * Returns { symlinked: true, at: '<path>' } for the first symlinked segment.
 *
 * This is the full-path ancestor check used to validate the target root and
 * the manifest directory before any operation.
 *
 * @param {string} absPath
 * @returns {{ symlinked: boolean, at?: string }}
 */
export function findSymlinkedAncestor(absPath) {
  const normalPath = path.resolve(absPath);
  const root = path.parse(normalPath).root;
  const remainder = normalPath.slice(root.length);
  const parts = remainder.split(path.sep).filter(Boolean);

  let current = root;
  for (const part of parts) {
    current = path.join(current, part);
    try {
      if (fs.lstatSync(current).isSymbolicLink()) {
        return { symlinked: true, at: current };
      }
    } catch {
      // Path does not exist yet — stop walking
      break;
    }
  }
  return { symlinked: false };
}

/**
 * Walks every existing segment from targetRoot down to absPath (inclusive)
 * and returns the first segment under targetRoot that is a symbolic link.
 *
 * This is the narrower managed-path check used to validate individual artifact
 * target paths under the already-validated target root.
 *
 * @param {string} targetRoot
 * @param {string} absPath
 * @returns {{ symlinked: boolean, at?: string }}
 */
export function findSymlinkedAncestorUnder(targetRoot, absPath) {
  const normalRoot = path.resolve(targetRoot);
  const normalPath = path.resolve(absPath);

  if (!normalPath.startsWith(normalRoot)) {
    return { symlinked: false };
  }

  const remainder = normalPath.slice(normalRoot.length);
  const parts = remainder.split(path.sep).filter(Boolean);

  let current = normalRoot;
  for (const part of parts) {
    current = path.join(current, part);
    try {
      if (fs.lstatSync(current).isSymbolicLink()) {
        return { symlinked: true, at: current };
      }
    } catch {
      break;
    }
  }
  return { symlinked: false };
}

/**
 * Validates that the target root and all existing ancestor path segments are
 * not symbolic links. Call this before any operation on the target root.
 *
 * @param {string} targetRoot
 * @throws {Error}
 */
export function validateTargetRootNotSymlinked(targetRoot) {
  const result = findSymlinkedAncestor(targetRoot);
  if (result.symlinked) {
    throw new Error(
      `Refused to use target: path segment "${result.at}" is a symbolic link`
    );
  }
}

/**
 * Returns the path to the installation manifest file.
 *
 * @param {string} targetRoot
 * @returns {string}
 */
export function manifestPath(targetRoot) {
  return path.join(targetRoot, MANIFEST_DIR, MANIFEST_FILE);
}
