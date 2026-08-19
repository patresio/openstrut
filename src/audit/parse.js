/**
 * Parsers for spec-anchored audit documents.
 *
 * parseSpec(src): extracts US-xxx stories with AC-xxx criteria, plus ASM-xxx
 *   assumptions and Q-xxx open questions from an OpenSpec spec.md.
 *
 * parseTasks(src): extracts T-xxx task blocks from a tasks.md, including the
 *   onp-spec-style Refs: field, Arquivos:/Files: field, and a bracketed status
 *   token ([pendente], [em-andamento], [concluida]). Accents and case are
 *   tolerated; an unknown status token is flagged via invalidStatus.
 *
 * parseTestAnnotations(src): collects @spec:AC-xxx codes from test source.
 *
 * All functions are pure (no file I/O) and never throw on malformed input;
 * malformed documents produce reduced output for callers to validate.
 */

const STATUS_PENDENTE = 'pendente';
const STATUS_EM_ANDAMENTO = 'em-andamento';
const STATUS_CONCLUIDA = 'concluida';
const KNOWN_STATUSES = new Set([STATUS_PENDENTE, STATUS_EM_ANDAMENTO, STATUS_CONCLUIDA]);

const STORY_HEADING_RE = /^#{1,6}\s+US-(\d{3,})\s*[:—–-]?\s*(.*)$/;
const AC_LINE_RE = /^[\s>]*(?:[-*]\s+)?\*{0,2}(AC-\d{3,})\*{0,2}\s*[:.)]?\s*(.*)$/;
const ASM_LINE_RE = /^[\s>]*(?:[-*]\s+)?\*{0,2}(ASM-\d{3,})\*{0,2}\s*[:.)]?\s*(.*)$/;
const Q_LINE_RE = /^[\s>]*(?:[-*]\s+)?\*{0,2}(Q-\d{3,})\*{0,2}\s*[:.)]?\s*(.*)$/;
const TASK_HEADING_RE = /^(T-?\d{3,})\s*[—–-]\s*(.+)$/;
const REFS_RE = /^Refs[ \t]*:[ \t]*(.*)$/m;
const FILES_RE = /^(?:Arquivos|Files)[ \t]*:[ \t]*(.*)$/m;
const STATUS_TOKEN_RE = /\[([^\]]+)\]/;
const SPEC_ANNOTATION_RE = /@spec:(AC-\d{3,})/g;

/**
 * Normalizes a raw status token into the canonical dash-separated lowercase
 * form without accents: "Concluída", "EM_ANDAMENTO", "em andamento" all map
 * to the same canonical key.
 *
 * @param {string} raw
 * @returns {string}
 */
function normalizeStatusToken(raw) {
  return raw
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\s_]+/g, '-');
}

/**
 * Strips a trailing bracketed status token from an entry line.
 *
 * @param {string} text
 * @returns {string}
 */
function stripBracketedStatus(text) {
  return text.replace(/\[[^\]]+\]\s*$/, '').trim();
}

/**
 * Extracts the status of an assumptions/questions entry from a bracketed token.
 * Permissive: returns the normalized token or null when absent.
 *
 * @param {string} text
 * @returns {string | null}
 */
function statusFromEntry(text) {
  const m = STATUS_TOKEN_RE.exec(text);
  if (!m) return null;
  return normalizeStatusToken(m[1]) || null;
}

/**
 * Normalizes a section heading for accent-insensitive matching.
 *
 * @param {string} name
 * @returns {string}
 */
function normalizeSectionName(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Extracts a comma-separated list value from a raw field body.
 *
 * @param {string | undefined} raw
 * @returns {string[]}
 */
function extractCommaList(raw) {
  if (raw === undefined || raw === null) return [];
  return raw.split(',').map(s => s.trim()).filter(Boolean);
}

/**
 * Parses an OpenSpec spec.md into stories, assumptions and questions.
 *
 * @param {string} src
 * @returns {{
 *   stories: Array<{ id: string, title: string, criteria: Array<{ id: string, text: string, parentStoryId: string }> }>,
 *   assumptions: Array<{ id: string, text: string, status: string | null }>,
 *   questions: Array<{ id: string, text: string, status: string | null }>,
 * }}
 */
export function parseSpec(src) {
  const stories = [];
  const assumptions = [];
  const questions = [];
  let currentStory = null;
  let section = null;

  for (const rawLine of src.split('\n')) {
    const line = rawLine.trimEnd();
    const headingMatch = /^(#{1,6})\s+(.*)$/.exec(line.trimStart());

    if (headingMatch) {
      const headingText = headingMatch[2].trim();
      const storyMatch = STORY_HEADING_RE.exec(line.trimStart());

      if (storyMatch) {
        const id = `US-${storyMatch[1]}`;
        currentStory = { id, title: storyMatch[2].trim(), criteria: [] };
        stories.push(currentStory);
        section = 'stories';
        continue;
      }

      const norm = normalizeSectionName(headingText);
      if (norm === 'suposicoes' || norm === 'assumptions') {
        section = 'assumptions';
        continue;
      }
      if (norm === 'perguntas' || norm === 'perguntas em aberto' || norm === 'open questions') {
        section = 'questions';
        continue;
      }
      section = null;
      continue;
    }

    if (section === 'assumptions') {
      const m = ASM_LINE_RE.exec(line);
      if (m) {
        assumptions.push({
          id: m[1],
          text: stripBracketedStatus(m[2].trim()),
          status: statusFromEntry(m[2]),
        });
      }
    } else if (section === 'questions') {
      const m = Q_LINE_RE.exec(line);
      if (m) {
        questions.push({
          id: m[1],
          text: stripBracketedStatus(m[2].trim()),
          status: statusFromEntry(m[2]),
        });
      }
    } else if (section === 'stories' && currentStory) {
      const m = AC_LINE_RE.exec(line);
      if (m) {
        currentStory.criteria.push({
          id: m[1],
          text: m[2].trim(),
          parentStoryId: currentStory.id,
        });
      }
    }
  }

  return { stories, assumptions, questions };
}

/**
 * Parses task blocks from a tasks.md document using the ## T-xxx — heading
 * convention, extended with onp-spec-style Refs:/Arquivos: fields and a
 * bracketed status token.
 *
 * @param {string} src
 * @returns {Array<{
 *   id: string | null,
 *   title: string,
 *   refs: string[],
 *   status: 'pendente' | 'em-andamento' | 'concluida' | null,
 *   statusDeclared: boolean,
 *   invalidStatus: boolean,
 *   files: string[],
 * }>}
 */
export function parseTasks(src) {
  const sections = src.split(/^(?=## )/m).filter(s => s.startsWith('## '));

  /** @type {ReturnType<typeof parseTasks>} */
  const tasks = [];

  for (const section of sections) {
    const lines = section.split('\n');
    const headingLine = lines[0].trim();
    const headingText = headingLine.replace(/^##\s+/, '').trim();
    const body = lines.slice(1).join('\n');

    const idMatch = TASK_HEADING_RE.exec(headingText);
    const rawTitle = idMatch ? idMatch[2].trim() : headingText;
    const title = rawTitle.replace(/\s*\[[^\]]+\]\s*$/, '').trim();

    const statusResult = extractStatus(headingText + '\n' + body);

    tasks.push({
      id: idMatch ? idMatch[1] : null,
      title,
      refs: extractCommaList(REFS_RE.exec(body)?.[1]),
      status: statusResult.status,
      statusDeclared: statusResult.statusDeclared,
      invalidStatus: statusResult.invalidStatus,
      files: extractCommaList(FILES_RE.exec(body)?.[1]),
    });
  }

  return tasks;
}

/**
 * Extracts the status of a task from the first bracketed token found in its
 * heading or body. Unknown tokens are reported via invalidStatus.
 *
 * @param {string} text
 * @returns {{ status: string | null, statusDeclared: boolean, invalidStatus: boolean }}
 */
function extractStatus(text) {
  const m = STATUS_TOKEN_RE.exec(text);
  if (!m) return { status: null, statusDeclared: false, invalidStatus: false };
  const norm = normalizeStatusToken(m[1]);
  if (KNOWN_STATUSES.has(norm)) {
    return { status: norm, statusDeclared: true, invalidStatus: false };
  }
  return { status: null, statusDeclared: true, invalidStatus: true };
}

/**
 * Collects the unique @spec:AC-xxx codes referenced in test source.
 *
 * @param {string} src
 * @returns {string[]}
 */
export function parseTestAnnotations(src) {
  const codes = [];
  const seen = new Set();
  for (const m of src.matchAll(SPEC_ANNOTATION_RE)) {
    if (!seen.has(m[1])) {
      seen.add(m[1]);
      codes.push(m[1]);
    }
  }
  return codes;
}