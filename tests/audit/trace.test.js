/**
 * Tests for src/audit/trace.js
 *
 * Covers the five traceability findings:
 *   - AC_SEM_TESTE: criterion without an annotated test
 *   - TESTE_ORFAO: test annotation pointing to a criterion that no longer exists
 *   - TASK_CONCLUIDA_SEM_PROVA: completed task without any covered AC
 *   - REF_QUEBRADA: task ref pointing to a nonexistent US/AC
 *   - TASK_STATUS_INVALIDO: task with an unrecognized status token
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { parseSpec, parseTasks } from '../../src/audit/parse.js';
import { trace } from '../../src/audit/trace.js';

const SPEC_SRC = `# Spec

## US-001: Autenticar

- AC-001: Dado um email válido, autentica.
- AC-002: Dado um email inválido, recusa.
`;

function buildTasks(src) {
  return parseTasks(src);
}

function codes(findings) {
  return findings.map(f => f.code);
}

function findByCode(findings, code) {
  return findings.filter(f => f.code === code);
}

describe('trace', () => {
  it('flags an AC without a test annotation (AC_SEM_TESTE)', () => {
    const spec = parseSpec(SPEC_SRC);
    const tasks = [];
    const findings = trace(spec, tasks, []);
    const acSemTeste = findByCode(findings, 'AC_SEM_TESTE');
    assert.equal(acSemTeste.length, 2);
    assert.deepEqual(acSemTeste.map(f => f.ref), ['AC-001', 'AC-002']);
    assert.ok(acSemTeste.every(f => f.severity === 'error'));
  });

  it('does not flag an AC that has a matching test annotation', () => {
    const spec = parseSpec(SPEC_SRC);
    const findings = trace(spec, [], ['AC-001']);
    const acSemTeste = findByCode(findings, 'AC_SEM_TESTE');
    assert.deepEqual(acSemTeste.map(f => f.ref), ['AC-002']);
  });

  it('flags an orphan test annotation (TESTE_ORFAO)', () => {
    const spec = parseSpec(SPEC_SRC);
    const findings = trace(spec, [], ['AC-001', 'AC-999']);
    const orfaos = findByCode(findings, 'TESTE_ORFAO');
    assert.equal(orfaos.length, 1);
    assert.equal(orfaos[0].ref, 'AC-999');
    assert.equal(orfaos[0].severity, 'error');
  });

  it('flags a completed task with no covered AC (TASK_CONCLUIDA_SEM_PROVA)', () => {
    const spec = parseSpec(SPEC_SRC);
    const tasks = buildTasks(`## T001 — Implementar [concluida]

Refs: US-001, AC-001
`);
    // AC-001 exists in the spec but has no test annotation
    const findings = trace(spec, tasks, []);
    const semProva = findByCode(findings, 'TASK_CONCLUIDA_SEM_PROVA');
    assert.equal(semProva.length, 1);
    assert.equal(semProva[0].ref, 'T001');
    assert.equal(semProva[0].severity, 'error');
  });

  it('does not flag a completed task when an AC ref is covered', () => {
    const spec = parseSpec(SPEC_SRC);
    const tasks = buildTasks(`## T001 — Implementar [concluida]

Refs: AC-001
`);
    const findings = trace(spec, tasks, ['AC-001']);
    assert.equal(findByCode(findings, 'TASK_CONCLUIDA_SEM_PROVA').length, 0);
  });

  it('does not flag a pending task without proof', () => {
    const spec = parseSpec(SPEC_SRC);
    const tasks = buildTasks(`## T001 — Implementar [pendente]

Refs: AC-001
`);
    const findings = trace(spec, tasks, []);
    assert.equal(findByCode(findings, 'TASK_CONCLUIDA_SEM_PROVA').length, 0);
  });

  it('flags a broken task ref (REF_QUEBRADA)', () => {
    const spec = parseSpec(SPEC_SRC);
    const tasks = buildTasks(`## T001 — Tarefa [pendente]

Refs: US-001, US-999
`);
    const findings = trace(spec, tasks, []);
    const quebradas = findByCode(findings, 'REF_QUEBRADA');
    assert.equal(quebradas.length, 1);
    assert.equal(quebradas[0].ref, 'US-999');
    assert.equal(quebradas[0].severity, 'error');
  });

  it('flags an invalid task status (TASK_STATUS_INVALIDO)', () => {
    const spec = parseSpec(SPEC_SRC);
    const tasks = buildTasks(`## T001 — Tarefa [feito]

Refs: AC-001
`);
    const findings = trace(spec, tasks, ['AC-001']);
    const invalidos = findByCode(findings, 'TASK_STATUS_INVALIDO');
    assert.equal(invalidos.length, 1);
    assert.equal(invalidos[0].ref, 'T001');
    assert.equal(invalidos[0].severity, 'error');
  });

  it('returns no findings when the change is aligned', () => {
    const spec = parseSpec(SPEC_SRC);
    const tasks = buildTasks(`## T001 — Implementar [concluida]

Refs: US-001, AC-001

## T002 — Tratar email inválido [pendente]

Refs: AC-002
`);
    const findings = trace(spec, tasks, ['AC-001', 'AC-002']);
    assert.deepEqual(findings, []);
  });

  it('detects all five findings at once', () => {
    const spec = parseSpec(`# Spec

## US-001: Autenticar

- AC-001: Dado um email válido, autentica.
- AC-002: Dado um email inválido, recusa.
`);
    const tasks = buildTasks(`## T001 — Implementar [concluida]

Refs: AC-001

## T002 — Notificar [feito]

Refs: US-999

## T003 — Validar token [em-andamento]

Refs: AC-002
`);
    const findings = trace(spec, tasks, ['AC-999']);
    assert.ok(codes(findings).includes('AC_SEM_TESTE'));
    assert.ok(codes(findings).includes('TESTE_ORFAO'));
    assert.ok(codes(findings).includes('TASK_CONCLUIDA_SEM_PROVA'));
    assert.ok(codes(findings).includes('REF_QUEBRADA'));
    assert.ok(codes(findings).includes('TASK_STATUS_INVALIDO'));
  });
});