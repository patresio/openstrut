# Autenticação

## US-001: Autenticar usuário por email e senha

Como usuário, quero entrar com email e senha para acessar minha conta.

- AC-001: Dado um email válido, quando informo a senha correta, então o sistema autentica e redireciona.
- AC-002: Dado um email inválido, quando tento autenticar, então o sistema recusa o acesso.

## Suposições

- ASM-001: O serviço de email externo permanece estável durante a entrega. [aberta]

## Perguntas em aberto

- Q-001: Qual o tempo de expiração da sessão? [aberta]