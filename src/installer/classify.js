/**
 * Artifact classification for the OpenCode Engineering Harness installer.
 *
 * Classification states (six total):
 *   missing               — target file does not exist; safe to install
 *   identical             — target matches packaged source checksum; no-op
 *   managed-outdated      — target matches old installed checksum; safe to update
 *   managed-locally-modified — target was installed but differs from recorded checksum; conflict
 *   unmanaged-conflict    — differing target exists without harness ownership; conflict
 *   invalid-target        — unsafe path (symlink), dir/file mismatch, or source missing; stop
 */

import fs from 'node:fs';
import path from 'node:path';
import { checksumFile } from './manifest.js';
import { isSymlink, validateRelativePath, findSymlinkedAncestorUnder } from './target.js';

/**
 * @typedef {'missing'|'identical'|'managed-outdated'|'managed-locally-modified'|'unmanaged-conflict'|'invalid-target'} ArtifactClass
 *
 * @typedef {{
 *   source: string,
 *   target: string,
 *   absoluteTarget: string,
 *   class: ArtifactClass,
 *   sourceChecksum: string,
 *   targetChecksum: string|null,
 *   reason?: string
 * }} ClassifiedArtifact
 */

/**
 * Classifies a single artifact against the current target state.
 * Performs full symlink safety checks on the target path and its managed
 * parent directories (under the target root).
 *
 * @param {{
 *   source: string,
 *   target: string,
 *   packageRoot: string,
 *   targetRoot: string,
 *   manifest: import('./manifest.js').Manifest|null,
 *   checksumFile: (p: string) => string
 * }} params
 * @returns {ClassifiedArtifact}
 */
export function classifyArtifact({ source, target, packageRoot, targetRoot, manifest, checksumFile: computeChecksum }) {
  const absSource = path.join(packageRoot, source);
  const absTarget = path.join(targetRoot, target);

  // Source must exist in the package
  if (!fs.existsSync(absSource)) {
    return {
      source, target, absoluteTarget: absTarget,
      class: 'invalid-target',
      sourceChecksum: '',
      targetChecksum: null,
      reason: `Source not found in package: ${source}`,
    };
  }

  // Validate relative path does not escape target root
  try {
    validateRelativePath(targetRoot, target);
  } catch (err) {
    return {
      source, target, absoluteTarget: absTarget,
      class: 'invalid-target',
      sourceChecksum: '',
      targetChecksum: null,
      reason: err.message,
    };
  }

  const sourceChecksum = computeChecksum(absSource);

  // Check managed parent directories under target root for symlinks
  const parentDir = path.dirname(absTarget);
  if (parentDir !== targetRoot) {
    const parentResult = findSymlinkedAncestorUnder(targetRoot, parentDir);
    if (parentResult.symlinked) {
      return {
        source, target, absoluteTarget: absTarget,
        class: 'invalid-target',
        sourceChecksum,
        targetChecksum: null,
        reason: `Managed parent directory "${parentResult.at}" is a symbolic link`,
      };
    }
  }

  // Detect symlinked target file
  if (isSymlink(absTarget)) {
    return {
      source, target, absoluteTarget: absTarget,
      class: 'invalid-target',
      sourceChecksum,
      targetChecksum: null,
      reason: 'Target file is a symbolic link; harness does not install through symlinks',
    };
  }

  // Detect target is a directory when a file is expected
  if (fs.existsSync(absTarget)) {
    const stat = fs.statSync(absTarget);
    if (stat.isDirectory()) {
      return {
        source, target, absoluteTarget: absTarget,
        class: 'invalid-target',
        sourceChecksum,
        targetChecksum: null,
        reason: `Target path exists as a directory: ${absTarget}`,
      };
    }
  }

  // Target missing — safe to install
  if (!fs.existsSync(absTarget)) {
    return {
      source, target, absoluteTarget: absTarget,
      class: 'missing',
      sourceChecksum,
      targetChecksum: null,
    };
  }

  const targetChecksum = computeChecksum(absTarget);

  // Identical to packaged version
  if (targetChecksum === sourceChecksum) {
    return {
      source, target, absoluteTarget: absTarget,
      class: 'identical',
      sourceChecksum,
      targetChecksum,
    };
  }

  // Check manifest ownership
  const manifestEntry = manifest?.artifacts?.find(a => a.relativePath === target);

  if (manifestEntry) {
    if (targetChecksum === manifestEntry.installedChecksum) {
      // Matches old installed checksum — safe to update to new source
      return {
        source, target, absoluteTarget: absTarget,
        class: 'managed-outdated',
        sourceChecksum,
        targetChecksum,
      };
    } else {
      // Installed by harness but locally modified since
      return {
        source, target, absoluteTarget: absTarget,
        class: 'managed-locally-modified',
        sourceChecksum,
        targetChecksum,
        reason: 'File was installed by the harness but has been locally modified',
      };
    }
  }

  // No manifest ownership — unmanaged conflict
  return {
    source, target, absoluteTarget: absTarget,
    class: 'unmanaged-conflict',
    sourceChecksum,
    targetChecksum,
    reason: 'A differing file exists at the target without harness ownership evidence',
  };
}

/**
 * Returns true if the classified artifact class blocks installation.
 *
 * @param {ArtifactClass} cls
 * @returns {boolean}
 */
export function isBlockingConflict(cls) {
  return cls === 'managed-locally-modified' ||
    cls === 'unmanaged-conflict' ||
    cls === 'invalid-target';
}

/**
 * Returns true if the classified artifact requires a write operation.
 *
 * @param {ArtifactClass} cls
 * @returns {boolean}
 */
export function requiresWrite(cls) {
  return cls === 'missing' || cls === 'managed-outdated';
}
