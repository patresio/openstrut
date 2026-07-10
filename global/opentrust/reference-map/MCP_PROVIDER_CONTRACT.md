# Retrieval Provider Contract

## Overview

This document is a historical reference for environments that still maintain an external retrieval provider. The active runtime must not depend on a live provider; selector meaning comes from the local catalog under `global/context/`.

If a provider exists, it may be used only to refresh the local catalog offline. Runtime execution must continue to work without it.

## Provider Specification

```yaml
provider:
  name: OpenTrust Retrieval Provider
  interface: MCP (Model Context Protocol)
  configuration: .opentrust/local/retrieval-provider.json (gitignored)

  selectors:
    context: CTX01..CTX32
    skill: SK01..SK39
    agent_map: AG01..AG21
    bundle: B01..B24
    doc: DOC_*

  query_formats:
    single: CTX{id}
    multi: CTX{id1},CTX{id2}
    bundle: B{id}
    combined: CTX{id}+B{id}

  response_policy:
    - synthesize only
    - include source IDs in response metadata
    - no raw book dumps or long excerpts
    - respect selector boundaries (do not return content outside requested selectors)
    - maximum 2000 tokens per synthesis response
```

## Query and Response

### Request

```
CTX14     → "Return synthesis for context CTX14"
B08       → "Return synthesis for bundle B08"
CTX14+B08 → "Return synthesis combining CTX14 and B08"
```

### Response Format

```json
{
  "selectors": ["CTX14", "B08"],
  "synthesis": "Concise synthesized summary...",
  "sources": ["CTX14", "B08"],
  "token_count": 284,
  "provider": "opentrust-retrieval-provider"
}
```

## Fallback Modes

| Mode | When | Behavior |
|------|------|----------|
| `none` | No external refresh needed | Agent works from local catalog and repository evidence |
| `local-context-catalog` | Default | Agent uses `global/context/` definitions |

The task contract's `# Retrieval Context` section declares whether local catalog context is required.

## Configuration

If a provider is used for offline refresh, its configuration stays environment-specific and must not become a runtime dependency.

## Security

1. The Retrieval Provider runs locally — no external network calls
2. No credentials or tokens are stored in versioned files
3. The provider responds only to selector queries, not arbitrary prompts
4. Configuration is environment-specific and gitignored

## Contract Version

| Field | Value |
|-------|-------|
| Version | 1.0.0 |
| Status | Draft |
| Last updated | 2026-07-07 |
