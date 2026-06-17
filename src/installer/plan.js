/**
 * Plan command — read-only inspection of what would be installed.
 *
 * Applies target-root symlink checking, package-root rejection,
 * manifest state reporting, and full artifact classification.
 *
 * A malformed (invalid) or unsafe manifest is treated as a blocking conflict.
 * A missing manifest is not a conflict — it means fresh installation is needed.
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
 * Computes the installation plan without performing any writes.
 *
 * @param {{
 *   target?: string,
 *   packageRoot: string,
 *   packageVersion: string,
 *   packageName: string
 * }} opts
 */
export function computePlan(opts) {
  const targetRoot = resolveTarget({ target: opts.target });

  // Safety: reject target root containing symlinks
  validateTargetRootNotSymlinked(targetRoot);

  // Safety: reject package directory as target
  validateTargetNotPackageRoot(targetRoot, opts.packageRoot);

  // Get explicit manifest state
  const manifestStateResult = getManifestState(targetRoot);
  const manifest = manifestStateResult.state === 'valid' ? manifestStateResult.manifest : null;

  // Classify all managed artifacts
  const artifacts = INVENTORY.map(entry =>
    classifyArtifact({
      source: entry.source,
      target: entry.target,
      packageRoot: opts.packageRoot,
      targetRoot,
      manifest,
      checksumFile,
    })
  );

  // Blocking conflicts from artifact classification
  const conflicts = artifacts.filter(a =>
    a.class === 'managed-locally-modified' ||
    a.class === 'unmanaged-conflict' ||
    a.class === 'invalid-target'
  );

  // An invalid or unsafe manifest is a blocking conflict independent of artifact state
  let manifestConflict = null;
  if (manifestStateResult.state === 'invalid' || manifestStateResult.state === 'unsafe') {
    manifestConflict = {
      source: `.engineering-harness/${manifestStateResult.state}`,
      target: '.engineering-harness/installation.json',
      absoluteTarget: '',
      class: /** @type {import('./classify.js').ArtifactClass} */ ('invalid-target'),
      sourceChecksum: '',
      targetChecksum: null,
      reason: `Manifest is ${manifestStateResult.state}: ${manifestStateResult.reason}`,
    };
    conflicts.push(manifestConflict);
  }

  const changesRequired = artifacts.some(a =>
    a.class === 'missing' || a.class === 'managed-outdated'
  );

  return {
    packageVersion: opts.packageVersion,
    packageName: opts.packageName,
    targetRoot,
    manifestState: manifestStateResult.state,
    manifestStateReason: manifestStateResult.reason ?? null,
    artifacts,
    conflicts,
    changesRequired,
  };
}
