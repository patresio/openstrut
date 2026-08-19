/**
 * Spec-anchored audit runner.
 *
 * auditChange({ changeDir, testRoot }) reads the OpenSpec change
 * (all specs/<capability>/spec.md files and tasks.md), scans the test tree for
 * @spec:AC-xxx annotations and returns the traceability findings plus counts.
 *
 * The gate decision is `ok`: true only when there are zero findings and no
 * operational errors (unreadable files, missing specs).
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { parseSpec, parseTasks, parseTestAnnotations } from './parse.js';
import { trace } from './trace.js';

const TEST_FILE_SUFFIXES = ['.test.js', '.test.mjs'];

/**
 * Recursively collects spec.md files under a directory.
 *
 * @param {string} specsDir
 * @returns {string[]}
 */
function collectSpecFiles(specsDir) {
  const files = [];
  walkForFiles(specsDir, files, name => name === 'spec.md');
  return files;
}

/**
 * Recursively collects test files under testRoot/tests matching the audit
 * test glob (tests/**\/ *.test.js|*.test.mjs). Fixture directories are
 * excluded so audit fixtures never contaminate a real change audit.
 *
 * @param {string} testRoot
 * @returns {string[]}
 */
function collectTestFiles(testRoot) {
  const files = [];
  walkForFiles(path.join(testRoot, 'tests'), files, name =>
    TEST_FILE_SUFFIXES.some(suffix => name.endsWith(suffix)),
  ['fixtures']);
  return files;
}

/**
 * Walks a directory tree collecting file paths that match a name predicate.
 * Directories whose name is in skipDirNames are not descended into.
 * Missing directories yield an empty list (never throws).
 *
 * @param {string} dir
 * @param {string[]} out
 * @param {(name: string) => boolean} match
 * @param {string[]} [skipDirNames]
 */
function walkForFiles(dir, out, match, skipDirNames = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (err) {
    return;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!skipDirNames.includes(entry.name)) walkForFiles(full, out, match, skipDirNames);
    } else if (entry.isFile() && match(entry.name)) out.push(full);
  }
}

/**
 * Resolves the git repository root containing a directory, or null.
 *
 * @param {string} dir
 * @returns {string | null}
 */
function gitRootOf(dir) {
  try {
    return execSync('git rev-parse --show-toplevel', {
      cwd: dir,
      encoding: 'utf8',
      stdio: 'pipe',
    }).trim();
  } catch (err) {
    return null;
  }
}

/**
 * Audits an OpenSpec change directory.
 *
 * @param {{
 *   changeDir: string,
 *   testRoot?: string,
 * }} opts
 * @returns {{
 *   ok: boolean,
 *   findings: Array<{ code: string, severity: string, message: string, ref: string }>,
 *   counts: { stories: number, criteria: number, tasks: number, tests: number },
 *   errors: string[],
 * }}
 */
export function auditChange({ changeDir, testRoot }) {
  const errors = [];
  const counts = { stories: 0, criteria: 0, tasks: 0, tests: 0 };

  // 1. Specs — glob specs/**/spec.md under the change directory
  const spec = { stories: [], assumptions: [], questions: [] };
  const specFiles = collectSpecFiles(path.join(changeDir, 'specs'));
  if (specFiles.length === 0) {
    errors.push(`No spec files found under ${path.join(changeDir, 'specs')}`);
  }
  for (const file of specFiles) {
    try {
      const parsed = parseSpec(fs.readFileSync(file, 'utf8'));
      spec.stories.push(...parsed.stories);
      spec.assumptions.push(...parsed.assumptions);
      spec.questions.push(...parsed.questions);
    } catch (err) {
      errors.push(`Cannot read spec file ${file}: ${err.message}`);
    }
  }

  // 2. Tasks — tasks.md at the change root
  let tasks = [];
  try {
    tasks = parseTasks(fs.readFileSync(path.join(changeDir, 'tasks.md'), 'utf8'));
  } catch (err) {
    errors.push(`Cannot read tasks.md: ${err.message}`);
  }

  // 3. Tests — scan the test tree for @spec annotations
  const resolvedTestRoot = testRoot ?? gitRootOf(changeDir) ?? changeDir;
  const testFiles = collectTestFiles(resolvedTestRoot);
  const testCodes = [];
  for (const file of testFiles) {
    try {
      testCodes.push(...parseTestAnnotations(fs.readFileSync(file, 'utf8')));
    } catch (err) {
      errors.push(`Cannot read test file ${file}: ${err.message}`);
    }
  }

  counts.stories = new Set(spec.stories.map(s => s.id)).size;
  counts.criteria = new Set(spec.stories.flatMap(s => s.criteria.map(c => c.id))).size;
  counts.tasks = tasks.length;
  counts.tests = testFiles.length;

  const findings = trace(spec, tasks, testCodes);

  return {
    ok: errors.length === 0 && findings.length === 0,
    findings,
    counts,
    errors,
  };
}