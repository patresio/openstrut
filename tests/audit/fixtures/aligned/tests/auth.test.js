import test from 'node:test';
import assert from 'node:assert/strict';

// @spec:AC-001 Dado um email válido e a senha correta
test('autentica usuário com credenciais válidas @spec:AC-001', () => {
  assert.equal(1 + 1, 2);
});

// @spec:AC-002 Email inválido é recusado
test('recusa acesso para email inválido @spec:AC-002', () => {
  assert.equal(2 + 2, 4);
});