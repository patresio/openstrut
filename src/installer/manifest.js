/**
 * Installation manifest management for the OpenCode Engineering Harness.
 *
 * Manifest location: <target>/.engineering-harness/installation.json
 *
 * The manifest records:
 *   - manifest schema version
 *   - package name and version
 *   - installation timestamp
 *   - target root path
 *   - managed relative paths, source checksums, installed checksums
 *
 * The manifest never stores file contents, backup data, API keys, tokens,
 * environment values, private endpoints, or secrets.
 *
 * Manifest states (returned by getManifestState):
 *   missing  — no manifest file exists; fresh installation is allowed
 *   valid    — file exists, JSON parses, schema version is supported
 *   invalid  — file exists but JSON is malformed or schema is unsupported
 *   unsafe   — manifest path or its directory is a symbolic link
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { manifestPath, MANIFEST_DIR, isSymlink, findSymlinkedAncestor } from './target.js';

/** Current manifest schema version. */
const MANIFEST_VERSION = '1';

/**
 * @typedef {{ relativePath: string, sourceChecksum: string, installedChecksum: string }} ManifestArtifact
 * @typedef {{
 *   manifestVersion: string,
 *   packageName: string,
 *   packageVersion: string,
 *   installedAt: string,
 *   targetRoot: string,
 *   artifacts: ManifestArtifact[]
 * }} Manifest
 *
 * @typedef {'missing'|'valid'|'invalid'|'unsafe'} ManifestState
 *
 * @typedef {{
 *   state: ManifestState,
 *   manifest: Manifest|null,
 *   reason?: string
 * }} ManifestStateResult
 */

/**
 * Computes the SHA-256 hex digest of a file.
 *
 * @param {string} absPath
 * @returns {string}
 */
export function checksumFile(absPath) {
  const content = fs.readFileSync(absPath);
  return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * Computes the SHA-256 hex digest of a Buffer or string.
 *
 * @param {Buffer|string} content
 * @returns {string}
 */
export function checksumBuffer(content) {
  return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * Reads and returns the manifest state with full classification.
 *
 * States:
 *   missing  — manifest file does not exist
 *   valid    — manifest parses and its schema version is supported
 *   invalid  — manifest is malformed JSON or uses an unsupported schema version
 *   unsafe   — the manifest directory or file is (or contains) a symbolic link
 *
 * @param {string} targetRoot
 * @returns {ManifestStateResult}
 */
export function getManifestState(targetRoot) {
  const mPath = manifestPath(targetRoot);
  const mDir = path.dirname(mPath);

  // Check for symlinked manifest directory
  const dirResult = findSymlinkedAncestor(mDir);
  if (dirResult.symlinked) {
    return {
      state: 'unsafe',
      manifest: null,
      reason: `Manifest directory path contains a symbolic link at: ${dirResult.at}`,
    };
  }

  // Check for symlinked manifest file itself
  if (isSymlink(mPath)) {
    return {
      state: 'unsafe',
      manifest: null,
      reason: 'The manifest file itself is a symbolic link',
    };
  }

  // Check existence
  if (!fs.existsSync(mPath)) {
    return { state: 'missing', manifest: null };
  }

  // Read
  let raw;
  try {
    raw = fs.readFileSync(mPath, 'utf8');
  } catch (err) {
    return {
      state: 'invalid',
      manifest: null,
      reason: `Cannot read manifest file: ${err.message}`,
    };
  }

  // Parse JSON
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    return {
      state: 'invalid',
      manifest: null,
      reason: `Manifest JSON parse error: ${err.message}`,
    };
  }

  // Validate structure
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return { state: 'invalid', manifest: null, reason: 'Manifest root is not a JSON object' };
  }
  if (!parsed.manifestVersion) {
    return { state: 'invalid', manifest: null, reason: 'Manifest is missing the manifestVersion field' };
  }
  if (parsed.manifestVersion !== MANIFEST_VERSION) {
    return {
      state: 'invalid',
      manifest: null,
      reason: `Unsupported manifest schema version: "${parsed.manifestVersion}" (expected "${MANIFEST_VERSION}")`,
    };
  }
  if (!Array.isArray(parsed.artifacts)) {
    return { state: 'invalid', manifest: null, reason: 'Manifest artifacts field is missing or not an array' };
  }

  return { state: 'valid', manifest: /** @type {Manifest} */ (parsed) };
}

/**
 * Convenience wrapper: returns the parsed Manifest if valid, null otherwise.
 * Use getManifestState() when explicit state handling is required.
 *
 * @param {string} targetRoot
 * @returns {Manifest|null}
 */
export function readManifest(targetRoot) {
  const { state, manifest } = getManifestState(targetRoot);
  return state === 'valid' ? manifest : null;
}

/**
 * Writes the installation manifest atomically using a collision-resistant
 * temporary filename. The manifest file is written to a temp path first,
 * then atomically renamed into place.
 *
 * @param {string} targetRoot
 * @param {Omit<Manifest, 'manifestVersion'>} data
 */
export function writeManifest(targetRoot, data) {
  const mPath = manifestPath(targetRoot);
  const dir = path.dirname(mPath);

  fs.mkdirSync(dir, { recursive: true, mode: 0o700 });

  const manifest = {
    manifestVersion: MANIFEST_VERSION,
    ...data,
  };

  // Safety check: no sensitive fields
  const forbidden = ['key', 'token', 'secret', 'password', 'apiKey', 'api_key'];
  const serialized = JSON.stringify(manifest, null, 2);
  for (const key of forbidden) {
    if (new RegExp(`"${key}"\\s*:`).test(serialized)) {
      throw new Error(`BUG: manifest attempted to include sensitive field "${key}"`);
    }
  }

  // Collision-resistant temp filename
  const randomSuffix = crypto.randomBytes(8).toString('hex');
  const tmpPath = mPath + '.' + randomSuffix + '.harness-tmp';
  fs.writeFileSync(tmpPath, serialized + '\n', { mode: 0o600 });
  fs.renameSync(tmpPath, mPath);
}

/**
 * Returns the manifest artifact entry for a given relative target path.
 *
 * @param {Manifest|null} manifest
 * @param {string} relativePath
 * @returns {ManifestArtifact|undefined}
 */
export function findManifestEntry(manifest, relativePath) {
  if (!manifest) return undefined;
  return manifest.artifacts.find(a => a.relativePath === relativePath);
}
