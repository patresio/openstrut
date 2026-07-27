/**
 * Deep-merges source JSON into target JSON.
 * - Source keys are added to target
 * - Target keys not in source are preserved
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
    } else if (!(key in target)) {
      // Scalar keys not in target are added
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
