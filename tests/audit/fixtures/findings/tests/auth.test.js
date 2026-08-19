import test from 'node:test';
import assert from 'node:assert/strict';

// @spec:AC-004 Token expirado é recusado
test('recusa token expirado @spec:AC-004', () => {
  assert.equal(1, 1);
});

// @spec:AC-999 Critério removido da spec (órfão)
test('comportamento legado @spec:AC-999', () => {
  assert.equal(2, 2);
});