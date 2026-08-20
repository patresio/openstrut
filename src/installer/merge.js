/**
 * Deep-merges source JSON into target JSON.
 * - Source scalars/arrays win (so packaged config fixes reach installed machines)
 * - Target-only keys not present in source are preserved (user customizations)
 * - Nested objects are merged recursively
 * - Arrays in source replace arrays in target
 * @param {object} source - The new/harness version
 * @param {object} target - The user's existing version
 * @returns {object} Merged result (new object, does not mutate inputs)
 */
export function mergeJson(source, target) {
  const result = { ...target };

  for (const key of Object.keys(source)) {
    const sourceVal = source[key];
    const targetVal = target[key];

    if (sourceVal && typeof sourceVal === 'object' && !Array.isArray(sourceVal)) {
      if (targetVal && typeof targetVal === 'object' && !Array.isArray(targetVal)) {
        result[key] = mergeJson(sourceVal, targetVal);
      } else {
        result[key] = mergeJson(sourceVal, {});
      }
    } else if (Array.isArray(sourceVal)) {
      // Arrays in source replace arrays in target
      result[key] = [...sourceVal];
    } else {
      // Scalars in source win over target values
      result[key] = sourceVal;
    }
  }

  return result;
}

/**
 * Returns keys present in source but missing in target (at the top level).
 * @param {object} source
 * @param {object} target
 * @returns {string[]} Missing key names
 */
export function findMissingKeys(source, target) {
  return Object.keys(source).filter(key => !(key in target));
}

/**
 * Top-level keys of opencode.json that the harness manages.
 * Source wins for these keys; obsolete ones (present in target but absent
 * from source) are removed so stale harness-managed settings do not persist.
 */
export const MANAGED_KEYS = [
  '$schema',
  'model',
  'small_model',
  'provider',
  'mcp',
  'default_agent',
  'instructions',
  'references',
  'watcher',
  'permission',
  'agent',
  'plugin',
];

/**
 * Removes obsolete managed keys from target (present in target but absent
 * from source). Non-managed keys are always preserved.
 * @param {object} source - The new/harness version
 * @param {object} target - The user's existing version
 * @param {string[]} [managedKeys] - Keys the harness manages
 * @returns {object} Reconciled target (new object, does not mutate inputs)
 */
export function reconcileManagedKeys(source, target, managedKeys = MANAGED_KEYS) {
  const result = { ...target };
  for (const key of managedKeys) {
    if (!(key in source) && key in result) {
      delete result[key];
    }
  }
  return result;
}

/**
 * Top-level keys of opencode.json that the user controls.
 * The user's values win for these keys so a harness update never reverts
 * user preferences (e.g. disabling snapshots or autoupdate).
 */
export const USER_KEYS = [
  'share',
  'snapshot',
  'autoupdate',
  'compaction',
];

/**
 * Restores user values for user-controlled keys after a source-wins merge.
 * Keys absent from target keep the merged (source) value.
 * @param {object} merged - Result of mergeJson(source, reconciledTarget)
 * @param {object} target - The user's existing version
 * @param {string[]} [userKeys] - Keys the user controls
 * @returns {object} Merged result with user values restored (new object)
 */
export function preserveUserKeys(merged, target, userKeys = USER_KEYS) {
  const result = { ...merged };
  for (const key of userKeys) {
    if (key in target) {
      result[key] = target[key];
    }
  }
  return result;
}
