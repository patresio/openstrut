# Docker Runtime Analysis — HARNESS-018

## Scope

This document records why Docker containers are currently present during harness work, what the relevant image contains, and whether it appears viable to keep.

No containers were stopped, removed, rebuilt, or modified during this analysis.

## Observed Containers

`docker ps` showed multiple running containers using image digest `b2eb3410175d` and named with Docker-generated names such as:

- `dazzling_brown`
- `loving_jackson`
- `epic_mayer`
- `keen_sinoussi`
- `peaceful_swartz`
- `cool_chebyshev`
- `stupefied_hofstadter`
- `modest_gates`

The image resolves to:

```text
mcp/desktop-commander@sha256:b2eb3410175d5b794d2fa95a52993bcfc7dcc30b2f4807bb9b8937bcb467e52d
```

No ports were exposed for these Desktop Commander containers.

## Image Contents

`docker image inspect` and `docker history` show:

- base: Alpine-based Node image;
- Node version: `24.15.0`;
- Yarn version: `1.22.22`;
- entrypoint: `docker-entrypoint.sh`;
- command: `node dist/index.js`;
- environment: `MCP_CLIENT_DOCKER=true`;
- image label revision: `9c44119a480ec6460f82d59aeb90cf274bc3dd7b`;
- image size: about `2.02GB`;
- large layer from `npm install --ignore-scripts` around `1.05GB`.

## Mounts

At least one inspected Desktop Commander container has mounts:

```text
/srv/docs/biblioteca/docs:/srv/docs/biblioteca/docs
/srv/docs/biblioteca/BibliotecaOrganizada:/srv/docs/biblioteca/BibliotecaOrganizada
```

This indicates the container is being used as an MCP filesystem/tool bridge to local documentation/library material.

## Why It Is Being Used

The active tool layer exposes Desktop Commander-style file/process/search tools via MCP. The Docker container likely exists because Desktop Commander is running as an MCP server in a Docker-isolated runtime.

It supports operations such as:

- reading local files through MCP;
- running controlled processes;
- inspecting mounted documentation sources;
- serving tools to OpenCode through the MCP gateway.

## Viability Assessment

### Keep, short term

Keep it for now if:

- OpenCode sessions depend on Desktop Commander MCP tools;
- Barsa ingestion or documentation inspection still needs mounted `/srv/docs/biblioteca` paths;
- no equivalent host-native MCP server is configured;
- containers are intentionally managed by the MCP gateway.

### Risks

- Multiple duplicate Desktop Commander containers are running from the same image.
- Image is large (`2.02GB`).
- Containers are long-lived and Docker-named, suggesting lifecycle cleanup may be weak.
- Mounted documentation/library paths expose broad read access inside the container.
- Project policy says runtime prompts should use Barsa MCP logical routing, not local library paths.

### Remove or reduce later

Do not remove immediately without confirming MCP gateway ownership. Instead:

1. identify which process launched the containers;
2. confirm whether OpenCode currently needs Desktop Commander MCP;
3. check if duplicate containers are stale;
4. replace local library mounts with Barsa MCP retrieval where possible;
5. keep only one active Desktop Commander instance if needed;
6. document startup/cleanup in ops docs.

## Recommendation

Migrate away from Desktop Commander library mounts as a runtime retrieval interface.

Keep Docker only for MCP tools that still need isolated command/file operations, and remove `/srv/docs/biblioteca` mounts from the expected harness workflow once Barsa MCP covers retrieval.

Open follow-up:

- audit MCP gateway lifecycle;
- remove duplicate stale Desktop Commander containers if confirmed safe;
- migrate library retrieval to Barsa MCP logical routing;
- keep Desktop Commander only for generic file/process tooling when needed;
- avoid adding any workflow that depends on `/srv/docs/biblioteca` mounts.

## Decision Status

No destructive action approved. Analysis only.
