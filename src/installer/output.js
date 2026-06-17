/**
 * Output formatting and exit codes for the OpenCode Engineering Harness CLI.
 *
 * Exit codes:
 *   0  — OK: successful operation, no conflicts
 *   1  — DRIFT: check detected drift or missing/invalid manifest
 *   2  — CONFLICT: installation or plan blocked by a conflict
 *   3  — INVALID: invalid invocation, unknown option, or unsafe target
 *   4  — FAILURE: unexpected internal failure
 *
 * JSON contract:
 *   All --json output consists of exactly one valid JSON document written to
 *   stdout. Human-readable text is never mixed with JSON output. Errors in
 *   --json mode are also returned as a single JSON document.
 *
 * Stack traces are never exposed by default.
 */

export const EXIT = {
  OK: 0,
  DRIFT: 1,
  CONFLICT: 2,
  INVALID: 3,
  FAILURE: 4,
};

// ─── Plan ────────────────────────────────────────────────────────────────────

/**
 * @param {ReturnType<import('./plan.js').computePlan>} result
 * @param {{ json?: boolean }} opts
 */
export function formatPlan(result, opts = {}) {
  const status = result.conflicts.length > 0
    ? 'conflicts'
    : (result.changesRequired ? 'changes-required' : 'up-to-date');

  const exitCode = result.conflicts.length > 0 ? EXIT.CONFLICT : EXIT.OK;

  if (opts.json) {
    const obj = {
      command: 'plan',
      packageVersion: result.packageVersion,
      target: result.targetRoot,
      status,
      manifestState: result.manifestState,
      changesRequired: result.changesRequired,
      artifacts: result.artifacts.map(a => ({
        target: a.target,
        class: a.class,
        reason: a.reason ?? null,
      })),
      conflicts: result.conflicts.map(a => ({
        target: a.target,
        class: a.class,
        reason: a.reason ?? null,
      })),
      errors: [],
    };
    return { exitCode, output: JSON.stringify(obj, null, 2) };
  }

  const lines = [
    `Plan    ${result.packageName}@${result.packageVersion}`,
    `Target  ${result.targetRoot}`,
    `Manifest state: ${result.manifestState}${result.manifestStateReason ? ` (${result.manifestStateReason})` : ''}`,
    '',
  ];

  for (const a of result.artifacts) {
    const prefix = prefixForClass(a.class);
    lines.push(`${prefix}  ${a.target}${a.reason ? `  (${a.reason})` : ''}`);
  }

  if (result.conflicts.length > 0) {
    lines.push('');
    lines.push(`${result.conflicts.length} conflict(s) must be resolved before installing.`);
  } else if (!result.changesRequired) {
    lines.push('');
    lines.push('All artifacts are up to date.');
  }

  return { exitCode, output: lines.join('\n') };
}

// ─── Install ─────────────────────────────────────────────────────────────────

/**
 * @param {ReturnType<import('./install.js').install>} result
 * @param {{ json?: boolean }} opts
 */
export function formatInstall(result, opts = {}) {
  const exitCode = result.success
    ? EXIT.OK
    : (result.conflicts.length > 0 ? EXIT.CONFLICT : EXIT.FAILURE);

  if (result.dryRun) {
    const status = result.conflicts.length > 0
      ? 'conflicts'
      : ((result.changesRequired ?? false) ? 'changes-required' : 'up-to-date');

    if (opts.json) {
      const obj = {
        command: 'install',
        dryRun: true,
        target: result.targetRoot,
        status,
        changesRequired: result.changesRequired ?? false,
        artifacts: (result.artifacts ?? []).map(a => ({
          target: a.target,
          class: a.class,
          reason: a.reason ?? null,
        })),
        conflicts: result.conflicts.map(a => ({
          target: a.target,
          class: a.class,
          reason: a.reason ?? null,
        })),
        errors: result.error ? [result.error] : [],
      };
      return {
        exitCode: result.conflicts.length > 0 ? EXIT.CONFLICT : EXIT.OK,
        output: JSON.stringify(obj, null, 2),
      };
    }

    const lines = [
      `Install (dry run)  →  ${result.targetRoot}`,
      `Status: ${status}`,
      '',
    ];
    for (const a of result.artifacts ?? []) {
      lines.push(`${prefixForClass(a.class)}  ${a.target}${a.reason ? `  (${a.reason})` : ''}`);
    }
    if (result.conflicts.length > 0) {
      lines.push('');
      lines.push(`${result.conflicts.length} conflict(s) — install would be blocked.`);
    } else if (!result.changesRequired) {
      lines.push('');
      lines.push('Dry run complete. No changes required.');
    } else {
      lines.push('');
      lines.push('Dry run complete. Run without --dry-run to install.');
    }
    return {
      exitCode: result.conflicts.length > 0 ? EXIT.CONFLICT : EXIT.OK,
      output: lines.join('\n'),
    };
  }

  // Normal install output
  if (opts.json) {
    const obj = {
      command: 'install',
      dryRun: false,
      target: result.targetRoot,
      status: result.success ? 'ok' : 'failed',
      installed: result.installed,
      skipped: result.skipped,
      conflicts: result.conflicts.map(a => ({
        target: a.target,
        class: a.class,
        reason: a.reason ?? null,
      })),
      rolledBack: result.rolledBack,
      rollbackFailures: result.rollbackFailures ?? [],
      errors: result.error ? [result.error] : [],
    };
    return { exitCode, output: JSON.stringify(obj, null, 2) };
  }

  const lines = [];
  if (!result.success) {
    lines.push(`Installation failed: ${result.error ?? 'unknown error'}`);
    if (result.conflicts.length > 0) {
      lines.push('');
      lines.push('Conflicts:');
      for (const c of result.conflicts) {
        lines.push(`  ${c.target}  (${c.reason ?? c.class})`);
      }
    }
    if (result.rolledBack.length > 0) {
      lines.push('');
      lines.push(`Rolled back ${result.rolledBack.length} file(s).`);
    }
    if ((result.rollbackFailures ?? []).length > 0) {
      lines.push('');
      lines.push('Rollback failures (manual recovery required):');
      for (const f of result.rollbackFailures) {
        lines.push(`  ${f.path}: ${f.error}`);
      }
    }
    return { exitCode, output: lines.join('\n') };
  }

  lines.push(`Installed to ${result.targetRoot}`);
  for (const p of result.installed) lines.push(`  + ${p}`);
  if (result.skipped.length > 0) {
    lines.push(`  ${result.skipped.length} artifact(s) unchanged.`);
  }
  return { exitCode, output: lines.join('\n') };
}

// ─── Check ───────────────────────────────────────────────────────────────────

/**
 * @param {ReturnType<import('./check.js').check>} result
 * @param {{ json?: boolean }} opts
 */
export function formatCheck(result, opts = {}) {
  const exitCode = result.drifted ? EXIT.DRIFT : EXIT.OK;

  if (opts.json) {
    const obj = {
      command: 'check',
      packageVersion: result.packageVersion,
      manifestState: result.manifestState,
      manifestStateReason: result.manifestStateReason ?? null,
      manifestVersion: result.manifestVersion,
      manifestInstalledVersion: result.manifestInstalledVersion,
      target: result.targetRoot,
      status: result.drifted ? 'drift' : 'ok',
      artifacts: result.artifacts.map(a => ({
        target: a.target,
        status: a.status,
        reason: a.reason ?? null,
      })),
      errors: [],
    };
    return { exitCode, output: JSON.stringify(obj, null, 2) };
  }

  const lines = [
    `Check   target:    ${result.targetRoot}`,
    `        package:   ${result.packageVersion}`,
    `        installed: ${result.manifestInstalledVersion ?? 'unknown'}`,
    `        manifest:  ${result.manifestState}${result.manifestStateReason ? ` (${result.manifestStateReason})` : ''}`,
    '',
  ];

  for (const a of result.artifacts) {
    const prefix = prefixForStatus(a.status);
    lines.push(`${prefix} ${a.target}${a.reason ? `  (${a.reason})` : ''}`);
  }

  if (!result.drifted) {
    lines.push('');
    lines.push('All managed artifacts match the installed version.');
  } else {
    lines.push('');
    lines.push('Drift detected. Run `install` to update managed artifacts.');
  }
  return { exitCode, output: lines.join('\n') };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function prefixForClass(cls) {
  const map = {
    'missing': '+ install  ',
    'identical': '  ok       ',
    'managed-outdated': '↑ update   ',
    'managed-locally-modified': '! conflict ',
    'unmanaged-conflict': '! conflict ',
    'invalid-target': '✗ invalid  ',
  };
  return map[cls] ?? '? unknown  ';
}

function prefixForStatus(status) {
  const map = {
    'missing': '! missing  ',
    'identical': '  ok       ',
    'managed-outdated': '↑ outdated ',
    'managed-locally-modified': '~ modified ',
    'unmanaged-conflict': '! conflict ',
    'invalid-target': '✗ invalid  ',
  };
  return map[status] ?? '? unknown  ';
}
