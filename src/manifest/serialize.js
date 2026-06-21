/**
 * Deterministic YAML serializer for the Change Execution Manifest.
 *
 * Hand-rolled — no external YAML library dependency.
 * The same input always produces byte-for-byte identical output.
 *
 * Rules (from docs/design/006-change-execution-manifest.md §5):
 *   - Fixed key order per schema
 *   - Tasks ordered by dependency graph then by ID (caller provides sorted input)
 *   - Skills in alphabetical order
 *   - [] for empty lists, null for no parallel group
 *   - Line endings: LF
 *   - Encoding: UTF-8 (JS string — caller writes with 'utf8')
 *   - Indentation: 2 spaces
 *   - Single trailing newline
 *   - No generated_at, no comments, no stochastic content
 */

/**
 * @typedef {{
 *   change: {
 *     id: string,
 *     path: string,
 *     approval: { status: string, approved_by: string, approved_at: string },
 *   },
 *   tasks: Array<{
 *     id: string,
 *     title: string,
 *     heading: string,
 *     agent: string,
 *     skills: string[],
 *     dependsOn: string[],
 *     parallelGroup: string | null,
 *   }>,
 * }} ManifestInput
 */

/**
 * Serializes the manifest to a deterministic YAML string.
 *
 * @param {ManifestInput} input
 * @returns {string} UTF-8 YAML string ending with a single LF.
 */
export function serializeManifest(input) {
  const lines = [];

  lines.push('schema_version: 1');
  lines.push('');

  // ── change ──────────────────────────────────────────────────────────────────
  lines.push('change:');
  lines.push(`  id: ${yamlScalar(input.change.id)}`);
  lines.push(`  path: ${yamlScalar(input.change.path)}`);
  lines.push('  approval:');
  lines.push(`    status: ${yamlScalar(input.change.approval.status)}`);
  lines.push(`    approved_by: ${yamlScalar(input.change.approval.approved_by)}`);
  lines.push(`    approved_at: ${yamlScalar(input.change.approval.approved_at)}`);
  lines.push('');

  // ── manifest ────────────────────────────────────────────────────────────────
  lines.push('manifest:');
  lines.push('  status: waiting_for_execution_approval');
  lines.push('');

  // ── tasks ────────────────────────────────────────────────────────────────────
  lines.push('tasks:');
  for (const task of input.tasks) {
    const sortedSkills = [...task.skills].sort();

    lines.push(`  - id: ${yamlScalar(task.id)}`);
    lines.push(`    title: ${yamlScalar(task.title)}`);
    lines.push('    source:');
    lines.push(`      file: tasks.md`);
    lines.push(`      heading: ${yamlQuoted(task.heading)}`);
    lines.push(`    agent: ${yamlScalar(task.agent)}`);

    // skills
    if (sortedSkills.length === 0) {
      lines.push('    skills: []');
    } else {
      lines.push('    skills:');
      for (const skill of sortedSkills) {
        lines.push(`      - ${yamlScalar(skill)}`);
      }
    }

    // depends_on
    if (task.dependsOn.length === 0) {
      lines.push('    depends_on: []');
    } else {
      lines.push('    depends_on:');
      for (const dep of task.dependsOn) {
        lines.push(`      - ${yamlScalar(dep)}`);
      }
    }

    // parallel_group
    if (task.parallelGroup === null) {
      lines.push('    parallel_group: null');
    } else {
      lines.push(`    parallel_group: ${yamlScalar(task.parallelGroup)}`);
    }

    lines.push('    status: pending');
  }

  // Join with LF and ensure exactly one trailing newline
  return lines.join('\n') + '\n';
}

/**
 * Emits a YAML scalar value. Wraps in double quotes if the value contains
 * characters that would be ambiguous in plain YAML.
 *
 * @param {string} value
 * @returns {string}
 */
function yamlScalar(value) {
  if (value === null || value === undefined) return 'null';
  if (needsQuoting(String(value))) return yamlQuoted(String(value));
  return String(value);
}

/**
 * Returns a YAML double-quoted string, escaping internal double quotes and
 * backslashes.
 *
 * @param {string} value
 * @returns {string}
 */
function yamlQuoted(value) {
  const escaped = String(value)
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
  return `"${escaped}"`;
}

/**
 * Returns true if the scalar value requires quoting in YAML.
 *
 * @param {string} value
 * @returns {boolean}
 */
function needsQuoting(value) {
  // Quote if: empty, contains special chars, starts with YAML indicator chars,
  // looks like a boolean/null/number, has control chars, or has leading/trailing spaces.
  if (value === '') return true;
  if (/[:#\[\]{},&*?|<>=!%@`"'\\]/.test(value)) return true;
  if (/^[-?]/.test(value)) return true;
  if (/^(true|false|null|yes|no|on|off)$/i.test(value)) return true;
  if (/^[0-9]/.test(value)) return true; // Any string starting with digit
  if (/[\n\r\t\v\f\b]/.test(value)) return true;
  if (/^\s|\s$/.test(value)) return true;
  return false;
}
