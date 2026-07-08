/**
 * Tests for src/manifest/serialize.js
 *
 * Verifies deterministic YAML serialization rules from
 * docs/design/006-change-execution-manifest.md §5.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { serializeManifest } from '../../src/manifest/serialize.js';

// ─── Canonical input ──────────────────────────────────────────────────────────

function validInput() {
  return {
    change: {
      id: 'force-password-change-first-login',
      path: 'openspec/changes/force-password-change-first-login',
      approval: {
        status: 'approved',
        approved_by: 'patrese',
        approved_at: '2026-06-18T00:00:00Z',
      },
    },
    tasks: [
      {
        id: 'T001',
        title: 'Modelar estado de primeiro acesso',
        heading: 'T001 — Modelar estado de primeiro acesso',
        agent: 'build',
        skills: ['opentrust-tdd'],
        dependsOn: [],
        parallelGroup: null,
      },
    ],
  };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('serializeManifest', () => {
  it('produces identical output on two calls with the same input', () => {
    const input = validInput();
    const out1 = serializeManifest(input);
    const out2 = serializeManifest(input);
    assert.equal(out1, out2, 'Output must be byte-for-byte identical');
  });

  it('output ends with exactly one LF newline', () => {
    const out = serializeManifest(validInput());
    assert.ok(out.endsWith('\n'), 'Must end with newline');
    assert.ok(!out.endsWith('\n\n'), 'Must not end with double newline');
  });

  it('output contains no CRLF line endings', () => {
    const out = serializeManifest(validInput());
    assert.ok(!out.includes('\r'), 'Must use LF only, no CRLF');
  });

  it('output contains schema_version: 1 on the first line', () => {
    const out = serializeManifest(validInput());
    const firstLine = out.split('\n')[0];
    assert.equal(firstLine, 'schema_version: 1');
  });

  it('output contains manifest.status: waiting_for_execution_approval', () => {
    const out = serializeManifest(validInput());
    assert.ok(out.includes('status: waiting_for_execution_approval'), `Got:\n${out}`);
  });

  it('skills are sorted alphabetically', () => {
    const input = validInput();
    input.tasks[0].skills = ['opentrust-spec-change', 'opentrust-tdd'];
    const out = serializeManifest(input);
    // opentrust-spec-change < opentrust-tdd alphabetically
    const bddIdx = out.indexOf('opentrust-spec-change');
    const tddIdx = out.indexOf('opentrust-tdd');
    assert.ok(bddIdx < tddIdx, `bdd-discovery must appear before tdd-first\n${out}`);
  });

  it('depends_on is empty list when task has no dependencies', () => {
    const out = serializeManifest(validInput());
    assert.ok(out.includes('depends_on: []'), `Got:\n${out}`);
  });

  it('parallel_group is null when none declared', () => {
    const out = serializeManifest(validInput());
    assert.ok(out.includes('parallel_group: null'), `Got:\n${out}`);
  });

  it('status: pending for each task', () => {
    const out = serializeManifest(validInput());
    assert.ok(out.includes('status: pending'), `Got:\n${out}`);
  });

  it('does not contain generated_at', () => {
    const out = serializeManifest(validInput());
    assert.ok(!out.includes('generated_at'), 'Must not contain generated_at');
  });

  it('uses two-space indentation', () => {
    const out = serializeManifest(validInput());
    // The 'change:' block should be at top level (0 indent)
    // 'id:' under change should be at 2 spaces
    assert.ok(out.includes('\n  id:'), 'Must use 2-space indentation');
  });

  it('source.heading contains the full task heading', () => {
    const out = serializeManifest(validInput());
    assert.ok(out.includes('T001 — Modelar estado de primeiro acesso'), `Got:\n${out}`);
  });

  it('produces a task entry with all required fields in order', () => {
    const out = serializeManifest(validInput());
    // Verify key order within a task: id, title, source, agent, skills, depends_on, parallel_group, status
    const idIdx       = out.indexOf('    id:');
    const titleIdx    = out.indexOf('    title:');
    const sourceIdx   = out.indexOf('    source:');
    const agentIdx    = out.indexOf('    agent:');
    const skillsIdx   = out.indexOf('    skills:');
    const depsIdx     = out.indexOf('    depends_on:');
    const pgIdx       = out.indexOf('    parallel_group:');
    const statusIdx   = out.indexOf('    status: pending');
    assert.ok(idIdx < titleIdx, 'id before title');
    assert.ok(titleIdx < sourceIdx, 'title before source');
    assert.ok(sourceIdx < agentIdx, 'source before agent');
    assert.ok(agentIdx < skillsIdx, 'agent before skills');
    assert.ok(skillsIdx < depsIdx, 'skills before depends_on');
    assert.ok(depsIdx < pgIdx, 'depends_on before parallel_group');
    assert.ok(pgIdx < statusIdx, 'parallel_group before status');
  });
  it('yamlQuoted escapes correctly', () => {
    // Testing via serializeManifest
    const input2 = {
      change: {
        id: '123',
        path: 'openspec/changes/123',
        approval: { status: 'yes', approved_by: '  user  ', approved_at: '2026-06-18' }
      },
      tasks: [{
        id: 'T001',
        title: 'título com dois-pontos: exemplo # comentário',
        heading: 'T001 — autenticação',
        agent: 'true',
        skills: ['null', 'false', 'no', 'texto com "aspas"', "texto com 'aspas simples'", 'texto contendo \\', 'texto contendo \t'],
        dependsOn: [],
        parallelGroup: ' Unicode: autenticação — usuário ',
      }]
    };
    const out = serializeManifest(input2);
    // 123 is quoted
    assert.ok(out.includes('id: "123"'), 'id 123 should be quoted');
    assert.ok(out.includes('status: "yes"'), 'yes should be quoted');
    assert.ok(out.includes('approved_by: "  user  "'), 'leading/trailing space should be quoted');
    assert.ok(out.includes('approved_at: "2026-06-18"'), 'date should be quoted because it starts with digit');
    assert.ok(out.includes('title: "título com dois-pontos: exemplo # comentário"'), 'colons and hashes should be quoted');
    assert.ok(out.includes('agent: "true"'), 'true should be quoted');
    assert.ok(out.includes('- "null"'), 'null in list should be quoted');
    assert.ok(out.includes('- "false"'), 'false should be quoted');
    assert.ok(out.includes('- "no"'), 'no should be quoted');
    assert.ok(out.includes('- "texto com \\"aspas\\""'), 'double quotes should be escaped');
    assert.ok(out.includes('- "texto contendo \\\\"'), 'backslash should be escaped');
    assert.ok(out.includes('- "texto contendo \\t"'), 'tab should be escaped');
    assert.ok(out.includes('parallel_group: " Unicode: autenticação — usuário "'), 'unicode and spaces quoted');
  });
});
