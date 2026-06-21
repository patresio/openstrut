/**
 * Skill inventory loader for HARNESS-011.
 *
 * Derives valid skill names from the directory names under global/skills/
 * at startup. This is deterministic and filesystem-derived — adding a new
 * skill directory automatically makes it available without a code change.
 */

import fs from 'node:fs';
import path from 'node:path';

/**
 * Loads the skill inventory from the harness global/skills/ directory.
 *
 * @param {string} harnessRoot - Absolute path to the harness package root.
 * @returns {string[]} Sorted list of valid skill names.
 */
export function loadSkillInventory(harnessRoot) {
  const skillsDir = path.join(harnessRoot, 'global', 'skills');
  if (!fs.existsSync(skillsDir)) return [];
  return fs
    .readdirSync(skillsDir, { withFileTypes: true })
    .filter(e => e.isDirectory())
    .map(e => e.name)
    .sort();
}
