/**
 * Parsers for OpenSpec change documents.
 *
 * parseFrontmatter(src): extracts the five canonical approval fields from
 *   YAML-style frontmatter delimited by --- lines. Returns null when no
 *   valid frontmatter block is present.
 *
 * parseTasks(src): extracts task blocks introduced by ## T\d{3,} — headings.
 *   Returns an array of task objects. Fields not present in the source are
 *   returned with *Declared=false and value null / [].
 *
 * Neither function modifies files. Neither function throws; malformed input
 * produces null or reduced output for callers to validate.
 */

/**
 * @typedef {{
 *   change_id: string,
 *   status: string,
 *   approved_by: string,
 *   approved_at: string,
 * } | null} Frontmatter
 */

/**
 * @typedef {{
 *   id: string | null,
 *   title: string,
 *   heading: string,
 *   agent: string | null,
 *   agentDeclared: boolean,
 *   skills: string[],
 *   skillsDeclared: boolean,
 *   dependsOn: string[],
 *   dependsOnDeclared: boolean,
 *   parallelGroup: string | null,
 *   parallelGroupDeclared: boolean,
 * }} Task
 */

const KNOWN_FRONTMATTER_KEYS = new Set([
  'change_id', 'status', 'approved_by', 'approved_at',
]);

/**
 * Parses the YAML frontmatter from a markdown document.
 *
 * @param {string} src
 * @returns {Frontmatter}
 */
export function parseFrontmatter(src) {
  // Must start (possibly after newline) with ---
  const openPattern = /^---[ \t]*\r?\n/m;
  const openMatch = openPattern.exec(src);
  if (!openMatch) return null;

  // Find the closing ---
  const afterOpen = src.slice(openMatch.index + openMatch[0].length);
  const closePattern = /^---[ \t]*(\r?\n|$)/m;
  const closeMatch = closePattern.exec(afterOpen);
  if (!closeMatch) return null;

  const block = afterOpen.slice(0, closeMatch.index);

  // Hand-rolled line-by-line key: value parser for our five known fields
  const result = {};
  for (const rawLine of block.split('\n')) {
    const line = rawLine.trimEnd();
    if (!line.trim()) continue;
    const colonIdx = line.indexOf(':');
    if (colonIdx < 0) continue;
    const key = line.slice(0, colonIdx).trim();
    if (!KNOWN_FRONTMATTER_KEYS.has(key)) continue;
    if (key in result) {
      throw new Error('BLOCKED — DUPLICATE APPROVAL FIELD');
    }
    const value = line.slice(colonIdx + 1).trim();
    result[key] = value;
  }

  // Only return a result if at least one known key was found
  if (Object.keys(result).length === 0) return null;

  return {
    change_id: result.change_id ?? null,
    status: result.status ?? null,
    approved_by: result.approved_by ?? null,
    approved_at: result.approved_at ?? null,
  };
}

// Matches T\d+ (any length) — validation enforces the minimum 3-digit rule.
// This allows the validator to distinguish "no ID" from "invalid format ID".
const TASK_ID_RE = /^(T[0-9]+)\s*[—–-]\s*(.+)$/;

function checkDuplicateField(body, label) {
  const re = new RegExp(`^${escapeRegex(label)}[ \\t]*:`, 'gm');
  const matches = [...body.matchAll(re)];
  if (matches.length > 1) {
    throw new Error('BLOCKED — DUPLICATE TASK FIELD');
  }
}

/**
 * Parses task blocks from a tasks.md document.
 *
 * @param {string} src
 * @returns {Task[]}
 */
export function parseTasks(src) {
  // Split on ## headings
  const sections = src.split(/^(?=## )/m).filter(s => s.startsWith('## '));

  /** @type {Task[]} */
  const tasks = [];

  for (const section of sections) {
    const lines = section.split('\n');
    const headingLine = lines[0].trim();

    // Strip the ## prefix
    const headingText = headingLine.replace(/^##\s+/, '').trim();

    // Try to extract T-prefixed ID
    const idMatch = TASK_ID_RE.exec(headingText);
    const id = idMatch ? idMatch[1] : null;
    const title = idMatch ? idMatch[2].trim() : headingText;
    const heading = headingText;

    // Parse key-value fields from the body (lines after the heading)
    const body = lines.slice(1).join('\n');

    checkDuplicateField(body, 'Agent');
    checkDuplicateField(body, 'Skills');
    checkDuplicateField(body, 'Depends on');
    checkDuplicateField(body, 'Parallel group');

    const agent = extractScalar(body, 'Agent');
    const agentDeclared = agent !== null || fieldPresent(body, 'Agent');

    const { values: skills, declared: skillsDeclared } = extractListOrNone(body, 'Skills');
    const { values: dependsOn, declared: dependsOnDeclared } = extractListOrNone(body, 'Depends on');
    const { value: parallelGroup, declared: parallelGroupDeclared } = extractParallelGroup(body);

    tasks.push({
      id,
      title,
      heading,
      agent: agent ?? null,
      agentDeclared,
      skills,
      skillsDeclared,
      dependsOn,
      dependsOnDeclared,
      parallelGroup,
      parallelGroupDeclared,
    });
  }

  return tasks;
}

/**
 * Checks if a field label is present anywhere in the body text.
 *
 * @param {string} body
 * @param {string} label
 * @returns {boolean}
 */
function fieldPresent(body, label) {
  const re = new RegExp(`^${escapeRegex(label)}[ \\t]*:`, 'm');
  return re.test(body);
}

/**
 * Extracts a scalar value from "Label: value" on a single line.
 * Returns null if the label is not present; returns empty string if present
 * but value is blank.
 *
 * @param {string} body
 * @param {string} label
 * @returns {string | null}
 */
function extractScalar(body, label) {
  const re = new RegExp(`^${escapeRegex(label)}[ \\t]*:[ \\t]*(.*)$`, 'm');
  const m = re.exec(body);
  if (!m) return null;
  return m[1].trim() || null;
}

/**
 * Extracts a value that is either:
 *   - "Label: none" → { declared: true, value: null }
 *   - "Label: something" → { declared: true, value: 'something' }
 *   - absent → { declared: false, value: null }
 *
 * Used for Parallel group.
 *
 * @param {string} body
 * @returns {{ declared: boolean, value: string | null }}
 */
function extractParallelGroup(body) {
  const re = /^Parallel group[ \t]*:[ \t]*(.*)$/m;
  const m = re.exec(body);
  if (!m) return { declared: false, value: null };
  const raw = m[1].trim();
  if (!raw || raw.toLowerCase() === 'none') return { declared: true, value: null };
  return { declared: true, value: raw };
}

/**
 * Extracts a list-or-none field:
 *   - "Label: none" → { declared: true, values: [] }
 *   - "Label:\n- item1\n- item2" → { declared: true, values: ['item1','item2'] }
 *   - "Label: item" (inline scalar, not none) → { declared: true, values: ['item'] }
 *   - absent → { declared: false, values: [] }
 *
 * @param {string} body
 * @param {string} label
 * @returns {{ declared: boolean, values: string[] }}
 */
function extractListOrNone(body, label) {
  const headerRe = new RegExp(`^${escapeRegex(label)}[ \\t]*:[ \\t]*(.*)$`, 'm');
  const headerMatch = headerRe.exec(body);
  if (!headerMatch) return { declared: false, values: [] };

  const inline = headerMatch[1].trim();

  // Explicit "none" → empty list
  if (inline.toLowerCase() === 'none') {
    return { declared: true, values: [] };
  }

  // Inline non-empty non-list value (e.g. "Skills: engineering-tdd-first")
  if (inline.length > 0 && !inline.startsWith('-')) {
    return { declared: true, values: [inline] };
  }

  // Empty inline (e.g. "Skills:\n- item") or inline starts with '-':
  // scan subsequent lines for list items.
  const headerLineEnd = headerMatch.index + headerMatch[0].length;
  const afterHeader = body.slice(headerLineEnd);
  const values = [];
  let seenFirstItem = false;
  for (const line of afterHeader.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('-')) {
      values.push(trimmed.slice(1).trim());
      seenFirstItem = true;
    } else if (trimmed === '') {
      // Skip blank lines before the first item; stop after we've seen items
      if (seenFirstItem) break;
    } else {
      // Non-blank, non-list line (e.g. next field "Depends on:") — stop
      break;
    }
  }

  if (values.length > 0) return { declared: true, values };
  // Fallback: inline started with '-' but no subsequent lines found
  return { declared: true, values: inline ? [inline] : [] };
}

/**
 * Escape special regex chars in a literal string.
 *
 * @param {string} s
 * @returns {string}
 */
function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
