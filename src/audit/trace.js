/**
 * Spec-anchored traceability engine.
 *
 * trace(spec, tasks, testCodes) compares the parsed spec, tasks and test
 * annotations and returns the set of traceability findings. Each finding
 * carries a stable code (for CI / gates), a severity, a human message and a
 * reference to the offending id.
 *
 * Findings:
 *   - AC_SEM_TESTE: an AC-xxx criterion has no matching @spec test annotation
 *   - TESTE_ORFAO: a test annotation references a criterion that no longer
 *     exists in the spec (drift)
 *   - TASK_CONCLUIDA_SEM_PROVA: a task marked [concluida] whose AC refs are
 *     not covered by any test annotation
 *   - REF_QUEBRADA: a task Refs entry references a nonexistent US/AC id
 *   - TASK_STATUS_INVALIDO: a task carries an unrecognized status token
 *
 * Pure function: no file I/O, no side effects, deterministic output.
 */

const AC_ID_RE = /^AC-\d{3,}$/;

/**
 * @typedef {{
 *   code: string,
 *   severity: string,
 *   message: string,
 *   ref: string,
 * }} Finding
 */

/**
 * Computes traceability findings for a parsed spec, tasks and test codes.
 *
 * @param {import('./parse.js').ReturnType<typeof import('./parse.js').parseSpec>} spec
 * @param {Array<{ id: string | null, refs: string[], status: string | null, invalidStatus: boolean }>} tasks
 * @param {string[]} testCodes
 * @returns {Finding[]}
 */
export function trace(spec, tasks, testCodes) {
  const findings = [];
  const testSet = new Set(testCodes);

  const storyIds = new Set(spec.stories.map(s => s.id));
  const acIds = new Set();
  for (const story of spec.stories) {
    for (const criterion of story.criteria) acIds.add(criterion.id);
  }

  // AC_SEM_TESTE — every criterion needs at least one annotated test
  for (const story of spec.stories) {
    for (const criterion of story.criteria) {
      if (!testSet.has(criterion.id)) {
        findings.push({
          code: 'AC_SEM_TESTE',
          severity: 'error',
          message: `Criterion ${criterion.id} (${story.id}) has no annotated test`,
          ref: criterion.id,
        });
      }
    }
  }

  // TESTE_ORFAO — a test annotation points to a criterion that vanished
  for (const code of testCodes) {
    if (!acIds.has(code)) {
      findings.push({
        code: 'TESTE_ORFAO',
        severity: 'error',
        message: `Test annotation ${code} does not exist in the spec`,
        ref: code,
      });
    }
  }

  for (const task of tasks) {
    const taskLabel = task.id ?? '(no id)';

    // TASK_STATUS_INVALIDO — unrecognized status token
    if (task.invalidStatus) {
      findings.push({
        code: 'TASK_STATUS_INVALIDO',
        severity: 'error',
        message: `Task ${taskLabel} has an invalid status token`,
        ref: taskLabel,
      });
    }

    // REF_QUEBRADA — refs must point to an existing US/AC
    for (const ref of task.refs) {
      if (!storyIds.has(ref) && !acIds.has(ref)) {
        findings.push({
          code: 'REF_QUEBRADA',
          severity: 'error',
          message: `Task ${taskLabel} references unknown ${ref}`,
          ref,
        });
      }
    }

    // TASK_CONCLUIDA_SEM_PROVA — completed tasks need covered AC refs
    if (task.status === 'concluida') {
      const acRefs = task.refs.filter(r => AC_ID_RE.test(r));
      const covered = acRefs.some(r => testSet.has(r));
      if (!covered) {
        findings.push({
          code: 'TASK_CONCLUIDA_SEM_PROVA',
          severity: 'error',
          message: `Task ${taskLabel} is marked [concluida] but none of its AC refs are covered by a test`,
          ref: taskLabel,
        });
      }
    }
  }

  return findings;
}