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
