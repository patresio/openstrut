/**
 * Install command — mutating installation of managed artifacts.
 *
 * Atomicity guarantee:
 *   Per-file atomic replacement with best-effort cross-file rollback.
 *   Each individual file rename is atomic on POSIX filesystems.
 *   Abrupt process or machine termination may still require a subsequent
 *   `check` or recovery operation.
 *
 * Write sequence:
 * 1. Validate plan: resolve target, check symlinks, check package root, check manifest.
 *    No writes occur before a clean plan.
 * 2. For each artifact requiring installation:
 *    a. If the target exists, copy it to a collision-resistant backup path
 *       in the same directory (same filesystem, enabling atomic rename-back).
 *    b. Write new content to a collision-resistant temporary path.
 *    c. Atomically rename the temporary path to the final target path.
 *    d. Record the completed operation.
 * 3. Write the updated manifest atomically.
 * 4. Remove all backup files created in step 2a.
 *
 * Rollback (on any failure during steps 2–3):
 * 1. Process completed operations in reverse order.
 * 2. For each 'replaced' operation: atomically rename the backup back to final.
 * 3. For each 'created' operation: remove the installed file.
 * 4. Remove any remaining temporary and backup files.
 * 5. Leave the previous manifest unchanged (it was not yet replaced).
 * 6. Report: original error, restored paths, removed paths, rollback failures.
 * 7. Return success: false with a nonzero exit code.
 *
 * Safety:
 * - Blocking conflicts (managed-locally-modified, unmanaged-conflict, invalid-target)
 *   prevent any write from occurring.
 * - An invalid or unsafe manifest is a blocking conflict.
 * - A missing manifest is not a conflict; it is created during install.
 * - Symlinked target root or managed paths are rejected before any write.
 * - The package source directory may not be used as target.
 * - Manifests never store file contents, backups, secrets, or tokens.
 * - Temporary and backup filenames are collision-resistant.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { INVENTORY } from './inventory.js';
import {
  getManifestState,
  writeManifest,
  checksumFile,
} from './manifest.js';
import { classifyArtifact, isBlockingConflict, requiresWrite } from './classify.js';
import {
  resolveTarget,
  validateTargetRootNotSymlinked,
  validateTargetNotPackageRoot,
  MANIFEST_DIR,
} from './target.js';

/** @returns {string} 16 hex characters of cryptographic randomness */
function randomHex() {
  return crypto.randomBytes(8).toString('hex');
}

function pruneEmptyParents(startPath, stopPath) {
  let current = path.dirname(startPath);
  while (current.startsWith(stopPath) && current !== stopPath) {
    try {
      if (fs.readdirSync(current).length > 0) break;
      fs.rmdirSync(current);
      current = path.dirname(current);
    } catch {
      break;
    }
  }
}

function isCurrentInventoryTarget(relativePath) {
  return INVENTORY.some(entry => entry.target === relativePath);
}

/**
 * Installs managed artifacts into the target configuration root.
 *
 * @param {{
 *   target?: string,
 *   packageRoot: string,
 *   packageVersion: string,
 *   packageName: string,
 *   dryRun?: boolean,
 *   force?: boolean
 * }} opts
 */
export function install(opts) {
  const targetRoot = resolveTarget({ target: opts.target });

  // Safety: reject symlinked target root or ancestors
  validateTargetRootNotSymlinked(targetRoot);

  // Safety: reject package directory as target
  validateTargetNotPackageRoot(targetRoot, opts.packageRoot);

  // Get explicit manifest state before any writes
  const manifestStateResult = getManifestState(targetRoot);
  const manifest = manifestStateResult.state === 'valid' ? manifestStateResult.manifest : null;

  // Block on invalid or unsafe manifest
  if (manifestStateResult.state === 'invalid' || manifestStateResult.state === 'unsafe') {
    const manifestConflict = {
      source: `${MANIFEST_DIR}/${manifestStateResult.state}`,
      target: `${MANIFEST_DIR}/installation.json`,
      absoluteTarget: '',
      class: 'invalid-target',
      sourceChecksum: '',
      targetChecksum: null,
      reason: `Manifest is ${manifestStateResult.state}: ${manifestStateResult.reason}`,
    };
    return {
      targetRoot,
      dryRun: opts.dryRun ?? false,
      installed: [],
      skipped: [],
      artifacts: [],
      conflicts: [manifestConflict],
      changesRequired: false,
      rolledBack: [],
      rollbackFailures: [],
      success: false,
      error: `Installation blocked: manifest is ${manifestStateResult.state}. ${manifestStateResult.reason}`,
    };
  }

  // Classify all artifacts
  const classified = INVENTORY.map(entry =>
    classifyArtifact({
      source: entry.source,
      target: entry.target,
      packageRoot: opts.packageRoot,
      targetRoot,
      manifest,
      checksumFile,
    })
  );

  const conflicts = classified.filter(a => isBlockingConflict(a.class, { force: opts.force }));

  // Dry-run path: return install-shaped result with full classification, no writes
  if (opts.dryRun) {
    const changesRequired = classified.some(a => requiresWrite(a.class));
    return {
      targetRoot,
      dryRun: true,
      installed: [],
      skipped: classified.filter(a => !requiresWrite(a.class)).map(a => a.target),
      artifacts: classified,
      conflicts,
      changesRequired,
      manifestState: manifestStateResult.state,
      rolledBack: [],
      rollbackFailures: [],
      success: conflicts.length === 0,
      error: conflicts.length > 0
        ? `Dry-run blocked by ${conflicts.length} conflict(s). Resolve conflicts before installing.`
        : undefined,
    };
  }

  // Block on conflicts before any write
  if (conflicts.length > 0) {
    return {
      targetRoot,
      dryRun: false,
      installed: [],
      skipped: [],
      artifacts: classified,
      conflicts,
      changesRequired: classified.some(a => requiresWrite(a.class)),
      rolledBack: [],
      rollbackFailures: [],
      success: false,
      error: `Installation blocked by ${conflicts.length} conflict(s). Resolve conflicts before installing.`,
    };
  }

  /**
   * @typedef {{
   *   type: 'created'|'replaced'|'removed',
   *   final: string,
   *   backup: string|null
   * }} WriteOp
   */

  /** @type {WriteOp[]} */
  const operations = [];
  const installed = [];
  const skipped = [];

  try {
    if (manifest) {
      for (const entry of manifest.artifacts) {
        if (isCurrentInventoryTarget(entry.relativePath)) continue;
        const absTarget = path.resolve(targetRoot, entry.relativePath);
        if (!absTarget.startsWith(targetRoot + path.sep)) continue;
        if (!fs.existsSync(absTarget)) continue;
        const stat = fs.lstatSync(absTarget);
        if (!stat.isFile() || stat.isSymbolicLink()) continue;
        if (checksumFile(absTarget) !== entry.installedChecksum) continue;
        const backup = absTarget + '.' + randomHex() + '.harness-backup';
        fs.renameSync(absTarget, backup);
        operations.push({ type: 'removed', final: absTarget, backup });
      }
    }

    for (const artifact of classified) {
      if (!requiresWrite(artifact.class)) {
        skipped.push(artifact.target);
        continue;
      }

      const absSource = path.join(opts.packageRoot, artifact.source);
      const absTarget = artifact.absoluteTarget;
      const existed = fs.existsSync(absTarget);


      // Create parent directory
      fs.mkdirSync(path.dirname(absTarget), { recursive: true, mode: 0o755 });

      // Create backup of existing file before overwriting
      let backup = null;
      if (existed && isCurrentInventoryTarget(artifact.target)) {
        backup = absTarget + '.' + randomHex() + '.harness-backup';
        fs.copyFileSync(absTarget, backup);
      }

      // Write new content to a collision-resistant temporary path
      const tmpPath = absTarget + '.' + randomHex() + '.harness-tmp';
      const content = fs.readFileSync(absSource);
      fs.writeFileSync(tmpPath, content, { mode: 0o644 });

      // Atomic rename to final path
      fs.renameSync(tmpPath, absTarget);

      operations.push({ type: existed ? 'replaced' : 'created', final: absTarget, backup });
      installed.push(artifact.target);
    }

    // Write manifest atomically (last step)
    const newArtifacts = classified
      .filter(a => a.class !== 'invalid-target')
      .map(a => ({
        relativePath: a.target,
        sourceChecksum: a.sourceChecksum,
        installedChecksum: checksumFile(a.absoluteTarget),
      }));

    writeManifest(targetRoot, {
      packageName: opts.packageName,
      packageVersion: opts.packageVersion,
      installedAt: new Date().toISOString(),
      targetRoot,
      artifacts: newArtifacts,
    });

    // Success: remove backup files
    for (const op of operations) {
      if (op.backup) {
        try { fs.unlinkSync(op.backup); } catch { /* ignore */ }
      }
      if (op.type === 'removed') pruneEmptyParents(op.final, targetRoot);
    }

    return {
      targetRoot,
      dryRun: false,
      installed,
      skipped,
      artifacts: classified,
      conflicts: [],
      changesRequired: installed.length > 0,
      rolledBack: [],
      rollbackFailures: [],
      success: true,
    };

  } catch (installErr) {
    // Rollback: process operations in reverse order
    const rolledBack = [];
    const rollbackFailures = [];

    for (let i = operations.length - 1; i >= 0; i--) {
      const op = operations[i];
      try {
        if ((op.type === 'replaced' || op.type === 'removed') && op.backup) {
          // Atomically restore from backup (same filesystem)
          fs.mkdirSync(path.dirname(op.final), { recursive: true, mode: 0o755 });
          try {
            fs.renameSync(op.backup, op.final);
          } catch {
            // Cross-device fallback (rare but possible)
            fs.copyFileSync(op.backup, op.final);
            try { fs.unlinkSync(op.backup); } catch { /* ignore */ }
          }
          rolledBack.push(op.final);
        } else if (op.type === 'created') {
          // Remove newly created file
          fs.unlinkSync(op.final);
          rolledBack.push(op.final);
        }
      } catch (rollbackErr) {
        rollbackFailures.push({ path: op.final, error: rollbackErr.message });
      }
    }

    // Clean up any remaining backup files
    for (const op of operations) {
      if (op.backup) {
        try {
          if (fs.existsSync(op.backup)) fs.unlinkSync(op.backup);
        } catch { /* ignore */ }
      }
    }

    return {
      targetRoot,
      dryRun: false,
      installed: [],
      skipped,
      artifacts: classified,
      conflicts: [],
      changesRequired: true,
      rolledBack,
      rollbackFailures,
      success: false,
      error: installErr.message,
    };
  }
}
