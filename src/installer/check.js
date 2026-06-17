/**
 * Check command — read-only drift detection.
 *
 * Reuses the shared classifyArtifact function so that all six artifact states
 * (including invalid-target) are consistently reported. Applies the same symlink
 * and package-root safety checks as plan and install.
 *
 * Manifest state is explicitly classified and returned.
 *
 * A missing or invalid manifest causes drifted = true even when all managed file
 * contents happen to match the packaged source. Without valid ownership metadata
 * the installation cannot be claimed as managed and healthy.
 *
 * This command never writes to disk.
 */

import { INVENTORY } from './inventory.js';
import { getManifestState, checksumFile } from './manifest.js';
import { classifyArtifact } from './classify.js';
import {
  resolveTarget,
  validateTargetRootNotSymlinked,
  validateTargetNotPackageRoot,
} from './target.js';

/**
 * Checks installed artifacts against the packaged version.
 *
 * @param {{
 *   target?: string,
 *   packageRoot: string,
 *   packageVersion: string,
 *   packageName?: string
 * }} opts
 */
export function check(opts) {
  const targetRoot = resolveTarget({ target: opts.target });

  // Safety: reject symlinked target root or ancestors
  validateTargetRootNotSymlinked(targetRoot);

  // Safety: reject package directory as target
  validateTargetNotPackageRoot(targetRoot, opts.packageRoot);

  // Get explicit manifest state
  const manifestStateResult = getManifestState(targetRoot);
  const manifest = manifestStateResult.state === 'valid' ? manifestStateResult.manifest : null;

  // Classify all artifacts (full six-state classification, read-only)
  const classifiedArtifacts = INVENTORY.map(entry =>
    classifyArtifact({
      source: entry.source,
      target: entry.target,
      packageRoot: opts.packageRoot,
      targetRoot,
      manifest,
      checksumFile,
    })
  );

  // Map class → status (they share the same vocabulary)
  const checkedArtifacts = classifiedArtifacts.map(a => ({
    target: a.target,
    status: a.class,
    reason: a.reason ?? null,
  }));

  // Drift: any artifact not identical OR manifest state not valid
  // A missing manifest means no ownership metadata — always drift.
  const artifactsDrifted = checkedArtifacts.some(a => a.status !== 'identical');
  const manifestDrifted = manifestStateResult.state !== 'valid';
  const drifted = artifactsDrifted || manifestDrifted;

  return {
    targetRoot,
    packageVersion: opts.packageVersion,
    manifestState: manifestStateResult.state,
    manifestStateReason: manifestStateResult.reason ?? null,
    manifestVersion: manifestStateResult.manifest?.manifestVersion ?? null,
    manifestInstalledVersion: manifestStateResult.manifest?.packageVersion ?? null,
    artifacts: checkedArtifacts,
    drifted,
  };
}
