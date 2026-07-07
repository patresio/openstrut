# Retrieval Provider Contract

## Overview

This document defines the contract between OpenTrust and the Retrieval Provider, a local MCP-compatible service that responds to selector queries with synthesized knowledge.

Only the Knowledge team (knowledge-lead) is authorized to call the Retrieval Provider. All other teams request retrieval by specifying selectors in their task contracts.

## Provider Specification

```yaml
provider:
  name: OpenTrust Retrieval Provider
  interface: MCP (Model Context Protocol)
  configuration: .opentrust/local/retrieval-provider.json (gitignored)

  selectors:
    context: CTX01..CTX32
    skill: SK01..SK39
    agent: AG01..AG21
    bundle: B01..B24
    doc: DOC01..DOC16

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
| `none` | No retrieval needed | Agent works from its built-in knowledge |
| `operational-reference-map` | Provider unavailable | Agent uses reference-map definitions as fallback |
| `both` | Provider + map | Full retrieval with map fallback |

The task contract's `# Retrieval Context` section declares which mode to use.

## Configuration

The Retrieval Provider is configured per-environment via a gitignored file:

```
.opentrust/local/retrieval-provider.json
```

This file contains connection details, authentication (if any), and environment-specific settings. It is not committed to version control.

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
