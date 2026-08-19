/**
 * Tests for src/audit/parse.js
 *
 * Covers:
 *   - parseSpec: US-xxx stories with AC-xxx criteria (bullet and bold),
 *     ASM-xxx assumptions (## Suposições / ## Assumptions),
 *     Q-xxx open questions (## Perguntas / ## Open Questions)
 *   - parseTasks: T-xxx headings, Refs: comma-separated codes, Arquivos:/Files:,
 *     bracketed status tokens (accents/case tolerated, unknown → invalidStatus)
 *   - parseTestAnnotations: @spec:AC-xxx codes (deduplicated)
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseSpec, parseTasks, parseTestAnnotations } from '../../src/audit/parse.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES = path.join(__dirname, 'fixtures');

// ─── parseSpec ────────────────────────────────────────────────────────────────

describe('parseSpec', () => {
  it('parses stories with criteria, parent story ids, bullet form', () => {
    const src = `# Spec

## US-001: Autenticar

- AC-001: Dado um email válido, autentica.
- AC-002: Dado um email inválido, recusa.
`;
    const spec = parseSpec(src);
    assert.equal(spec.stories.length, 1);
    const story = spec.stories[0];
    assert.equal(story.id, 'US-001');
    assert.equal(story.title, 'Autenticar');
    assert.equal(story.criteria.length, 2);
    assert.equal(story.criteria[0].id, 'AC-001');
    assert.equal(story.criteria[0].parentStoryId, 'US-001');
    assert.ok(story.criteria[0].text.includes('email válido'));
    assert.equal(story.criteria[1].id, 'AC-002');
    assert.equal(story.criteria[1].parentStoryId, 'US-001');
  });

  it('parses criteria in bold form (**AC-003:**)', () => {
    const src = `# Spec

## US-001: Story

**AC-003:** Given a condition, then an outcome.
`;
    const spec = parseSpec(src);
    assert.equal(spec.stories[0].criteria.length, 1);
    assert.equal(spec.stories[0].criteria[0].id, 'AC-003');
    assert.ok(spec.stories[0].criteria[0].text.includes('Given a condition'));
  });

  it('parses criteria under a ### heading story', () => {
    const src = `# Spec

### US-010: Nested story

- AC-010: Criterion in a nested story.
`;
    const spec = parseSpec(src);
    assert.equal(spec.stories.length, 1);
    assert.equal(spec.stories[0].id, 'US-010');
    assert.equal(spec.stories[0].criteria[0].id, 'AC-010');
  });

  it('parses assumptions from ## Suposições', () => {
    const src = `## Suposições

- ASM-001: O serviço de email permanece estável. [aberta]
`;
    const spec = parseSpec(src);
    assert.equal(spec.assumptions.length, 1);
    assert.equal(spec.assumptions[0].id, 'ASM-001');
    assert.equal(spec.assumptions[0].status, 'aberta');
    assert.ok(spec.assumptions[0].text.includes('serviço de email'));
  });

  it('parses assumptions from ## Assumptions', () => {
    const src = `## Assumptions

- ASM-002: The email service is available.
`;
    const spec = parseSpec(src);
    assert.equal(spec.assumptions.length, 1);
    assert.equal(spec.assumptions[0].id, 'ASM-002');
    assert.equal(spec.assumptions[0].status, null);
  });

  it('parses questions from ## Perguntas', () => {
    const src = `## Perguntas

- Q-001: Qual o tempo de expiração? [aberta]
`;
    const spec = parseSpec(src);
    assert.equal(spec.questions.length, 1);
    assert.equal(spec.questions[0].id, 'Q-001');
    assert.equal(spec.questions[0].status, 'aberta');
  });

  it('parses questions from ## Open Questions', () => {
    const src = `## Open Questions

- Q-002: What is the token validity window?
`;
    const spec = parseSpec(src);
    assert.equal(spec.questions.length, 1);
    assert.equal(spec.questions[0].id, 'Q-002');
    assert.equal(spec.questions[0].status, null);
  });

  it('parses the aligned fixture spec.md', () => {
    const src = fs.readFileSync(
      path.join(FIXTURES, 'aligned', 'openspec', 'changes', 'sample-auth', 'specs', 'auth', 'spec.md'),
      'utf8'
    );
    const spec = parseSpec(src);
    assert.equal(spec.stories.length, 1);
    assert.equal(spec.stories[0].id, 'US-001');
    assert.equal(spec.stories[0].criteria.length, 2);
    assert.deepEqual(spec.stories[0].criteria.map(c => c.id), ['AC-001', 'AC-002']);
    assert.equal(spec.assumptions.length, 1);
    assert.equal(spec.assumptions[0].id, 'ASM-001');
    assert.equal(spec.questions.length, 1);
    assert.equal(spec.questions[0].id, 'Q-001');
  });

  it('returns empty collections for a document without spec markers', () => {
    const spec = parseSpec('# Just a title\n\nSome text.\n');
    assert.deepEqual(spec.stories, []);
    assert.deepEqual(spec.assumptions, []);
    assert.deepEqual(spec.questions, []);
  });
});

// ─── parseTasks ───────────────────────────────────────────────────────────────

describe('parseTasks', () => {
  it('parses id, title, refs and status from a heading', () => {
    const src = `## T001 — Implementar autenticação [concluida]

Refs: US-001, AC-001
Arquivos: src/auth.js
`;
    const tasks = parseTasks(src);
    assert.equal(tasks.length, 1);
    const t = tasks[0];
    assert.equal(t.id, 'T001');
    assert.equal(t.title, 'Implementar autenticação');
    assert.deepEqual(t.refs, ['US-001', 'AC-001']);
    assert.equal(t.status, 'concluida');
    assert.equal(t.statusDeclared, true);
    assert.equal(t.invalidStatus, false);
    assert.deepEqual(t.files, ['src/auth.js']);
  });

  it('tolerates accent and case in status tokens', () => {
    const src = `## T001 — Tarefa [Concluída]
`;
    const tasks = parseTasks(src);
    assert.equal(tasks[0].status, 'concluida');
    assert.equal(tasks[0].invalidStatus, false);
  });

  it('normalizes em-andamento variants (em_andamento, Em Andamento)', () => {
    const src = `## T001 — Tarefa [EM_ANDAMENTO]

## T002 — Tarefa [Em andamento]
`;
    const tasks = parseTasks(src);
    assert.equal(tasks[0].status, 'em-andamento');
    assert.equal(tasks[1].status, 'em-andamento');
  });

  it('reads status from a bracketed token in the body', () => {
    const src = `## T001 — Tarefa

Status: [pendente]
Refs: AC-001
`;
    const tasks = parseTasks(src);
    assert.equal(tasks[0].status, 'pendente');
    assert.equal(tasks[0].statusDeclared, true);
  });

  it('marks unknown status tokens as invalid', () => {
    const src = `## T001 — Tarefa [feito]
`;
    const tasks = parseTasks(src);
    assert.equal(tasks[0].status, null);
    assert.equal(tasks[0].statusDeclared, true);
    assert.equal(tasks[0].invalidStatus, true);
  });

  it('leaves status null and undeclared when no token is present', () => {
    const src = `## T001 — Tarefa

Refs: AC-001
`;
    const tasks = parseTasks(src);
    assert.equal(tasks[0].status, null);
    assert.equal(tasks[0].statusDeclared, false);
    assert.equal(tasks[0].invalidStatus, false);
  });

  it('parses a single-code Refs value into a one-element array', () => {
    const src = `## T001 — Tarefa

Refs: AC-001
`;
    const tasks = parseTasks(src);
    assert.deepEqual(tasks[0].refs, ['AC-001']);
  });

  it('leaves refs empty when Refs is absent', () => {
    const src = `## T001 — Tarefa
`;
    const tasks = parseTasks(src);
    assert.deepEqual(tasks[0].refs, []);
  });

  it('parses the aligned fixture tasks.md', () => {
    const src = fs.readFileSync(
      path.join(FIXTURES, 'aligned', 'openspec', 'changes', 'sample-auth', 'tasks.md'),
      'utf8'
    );
    const tasks = parseTasks(src);
    assert.equal(tasks.length, 2);
    assert.equal(tasks[0].id, 'T001');
    assert.equal(tasks[0].status, 'concluida');
    assert.deepEqual(tasks[0].refs, ['US-001', 'AC-001']);
    assert.equal(tasks[1].id, 'T002');
    assert.equal(tasks[1].status, 'pendente');
    assert.deepEqual(tasks[1].refs, ['AC-002']);
  });

  it('returns an empty array for a document without ## headings', () => {
    assert.deepEqual(parseTasks('# Title\n'), []);
  });
});

// ─── parseTestAnnotations ─────────────────────────────────────────────────────

describe('parseTestAnnotations', () => {
  it('extracts @spec:AC-xxx codes from test source', () => {
    const src = `test('foo @spec:AC-001', () => {});
// @spec:AC-002
test('bar @spec:AC-002', () => {});`;
    assert.deepEqual(parseTestAnnotations(src), ['AC-001', 'AC-002']);
  });

  it('deduplicates repeated annotations', () => {
    const src = `// @spec:AC-001
test('a @spec:AC-001', () => {});
test('b @spec:AC-001', () => {});`;
    assert.deepEqual(parseTestAnnotations(src), ['AC-001']);
  });

  it('returns an empty array when no annotations are present', () => {
    assert.deepEqual(parseTestAnnotations("test('no tag', () => {});"), []);
  });
});