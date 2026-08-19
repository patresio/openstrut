## T001 — Implementar autenticação por email [concluida]

Agent: build
Skills:
- opentrust-tdd
Depends on: none
Parallel group: none
Refs: US-001, AC-001
Arquivos: src/auth.js

## T002 — Recusar email inválido [pendente]

Agent: build
Skills: none
Depends on:
- T001
Parallel group: none
Refs: AC-002
Arquivos: src/auth.js, src/errors.js