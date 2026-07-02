# Agent Delegation Testing — AG16 & AG17

## How OpenCode Routes to Subagents

OpenCode uses the `description` field in agent frontmatter to match user
prompts to subagents. When a prompt matches an agent description above a
confidence threshold, OpenCode suggests using that subagent.

The routing flow:

1. `build` (primary agent) receives the user prompt.
2. OpenCode checks `build`'s task allowlist for candidate subagents.
3. For each allowed subagent, OpenCode reads the agent file's `description`.
4. If the prompt semantically matches the description, OpenCode offers the
   subagent to `build` via the `task` tool.
5. `build` can accept and delegate, or handle the work directly.

## Prerequisites

The live `~/.config/opencode/opencode.json` must have the subagent names in
`build.agent.permission.task`:

```json
"task": {
    "*": "deny",
    "documentation-generator": "allow",
    "harness-generator": "allow",
    "explore": "allow",
    "scout": "allow",
    "code-reviewer": "allow",
    "project-rules-auditor": "allow"
}
```

The agent files (`agents/documentation-generator.md`,
`agents/harness-generator.md`) must exist in the installed OpenCode config.

## Test Scenarios

### Scenario 1: Documentation Request

**Prompt**: "Gere documentação completa do projeto — AGENTS.md, ADR, PRD,
especificações técnicas e runbooks seguindo as melhores práticas do Barsa."

**Expected match**: `documentation-generator` (AG16)

**Why**: Description contains "Gera documentação completa do projeto —
docs/, PRD, ADR, AGENTS, specs, protocolos de XP/cowork e artefatos de
desenvolvimento seguindo melhores práticas do Barsa."

**Result**: [✓] Infrastructure verified — AG16 installed, description aligned,
task allowlist permits delegation. Requires UI prompt to confirm routing.

### Scenario 2: Harness Generation Request

**Prompt**: "Analise este projeto (stack, metodologia) e meu contexto pessoal
(Obsidian, PARA, GTD) para gerar agents, skills e workflows customizados."

**Expected match**: `harness-generator` (AG17)

**Why**: Description contains "Analisa projetos (stack, docs, metodologia)
e contexto pessoal (Obsidian, auto-estima, organização, produtividade) para
gerar agents, skills e workflows customizados seguindo as melhores práticas
do Barsa."

**Result**: [✓] Infrastructure verified — AG17 installed, description aligned,
task allowlist permits delegation. Requires UI prompt to confirm routing.

### Scenario 3: Ambiguous — Technical Spec

**Prompt**: "Crie uma especificação técnica detalhada para este projeto
incluindo arquitetura, API e modelo de dados."

**Expected match**: Possibly `documentation-generator` (AG16) or
`documentation-generator` with skill `engineering-sdd-change`.

**Why**: AG16's description covers "especificações" broadly. If the prompt
mentions "spec" or "especificação técnica", OpenCode should route to AG16.

**Result**: [~] Ambiguous — depends on OpenCode matching confidence.
Consider adding "especificação técnica" to AG16 description if routing fails.

### Scenario 4: Ambiguous — Project Analysis

**Prompt**: "Analise a stack do projeto e veja se precisamos de agents
customizados."

**Expected match**: `harness-generator` (AG17)

**Why**: "Analisa projetos (stack, docs, metodologia)" matches the
analysis intent.

**Result**: [✓] Infrastructure verified. "Analisa projetos" in description
matches "analise a stack do projeto". Requires UI prompt to confirm routing.

### Scenario 5: Non-Matching — Pure Coding

**Prompt**: "Implemente a função de login no backend."

**Expected match**: No subagent — `build` handles directly.

**Why**: Does not match documentation or harness generation descriptions.
Should not trigger delegation.

**Result**: [✓] No matching description — "login" and "backend" absent from
both AG16 and AG17 descriptions. Build handles directly.

## Testing Protocol

1. Ensure the harness is installed (`~/.config/opencode/` has agents).
2. For each scenario, submit the prompt to `build`.
3. Observe whether OpenCode offers the expected subagent.
4. Record the result.

## Description Optimization Notes

Current descriptions are broad and semantically aligned with common prompts.
If testing reveals poor matching:

- Add more key terms from expected prompts.
- Use consistent verb patterns across agents.
- Avoid overlapping descriptions between agents.

Current AG16 description:

> Gera documentação completa do projeto — docs/, PRD, ADR, AGENTS, specs,
> protocolos de XP/cowork e artefatos de desenvolvimento seguindo melhores
> práticas do Barsa.

Current AG17 description:

> Analisa projetos (stack, docs, metodologia) e contexto pessoal (Obsidian,
> auto-estima, organização, produtividade) para gerar agents, skills e
> workflows customizados seguindo as melhores práticas do Barsa.

Both use Portuguese, include "Barsa" as a key identifier, and cover
distinct domains (documentation vs harness generation). This separation
should produce reliable routing.
