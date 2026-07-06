# ADR-004: MCP Trust Boundary and Retrieval

**Status:** Accepted  
**Date:** 2026-06-17  
**Author:** Build Agent (derived from HARNESS-008/009/015 design)

## Context
The harness uses MCP servers for knowledge retrieval (Barsa MCP) and tool orchestration (homelab-ai-coding). MCP servers have access to tool execution and file paths. Remote URLs, env-based configuration, and Docker-backed containers introduce trust and security considerations.

## Decision
- **Barsa MCP** is the canonical retrieval boundary for books, docs, and curated operational knowledge.
- Local filesystem paths are **ingestion provenance only**, never runtime retrieval interface.
- MCP servers are configured by environment variables only (no hardcoded URLs/keys).
- Maximum 2 active MCP servers globally to reduce attack surface.
- Docker containers with broad library mounts are **not** part of runtime retrieval; they are research/analysis tools only.
- MCP write operations require explicit `ask` permission at agent level.
- No MCP server has filesystem access beyond its documented scope.
- External directory (`~/.local/share/opencode/references/`) is read-only for agent sessions.

## Consequences
- MCP URLs and credentials remain external to package and version control.
- Library content is accessed through Barsa retrieval, not Docker mounts.
- Docker Desktop Commander lifecycle is managed separately from harness.

## Alternatives
- Direct filesystem access to library paths (rejected: violates Barsa boundary).
- Embed MCP credentials in package (rejected: secret exposure risk).
- Unlimited MCP servers (rejected: increased attack surface, context bloat).
