# AGENTS.md

Instructions for AI coding agents (OpenCode, Codex, Cursor, Claude Code and others) working in this repo. Human-facing docs live in README.md and CONTRIBUTING.md.

## What this is

An MCP server (stdio) for Google's free public Knowledge Graph Search API. Two tools: `search_knowledge_graph` (query search) and `lookup_knowledge_graph_entities` (lookup by MID). Published to npm as `@houtini/google-knowledge-graph-mcp` and to the MCP Registry as `io.github.houtini-ai/google-knowledge-graph`.

Scope: the free public API only, never the Enterprise API. Keep it small: two runtime dependencies, no new ones without a reason.

## Commands

- Install: `npm install`
- Build: `npm run build` (tsc to `dist/`)
- Type-check only: `npm run type-check`
- Run: `node dist/index.js` (needs `GOOGLE_KNOWLEDGE_GRAPH_API_KEY` in the environment)

There is no automated test suite yet. Do not claim tests pass. Verify a change with `npm run type-check`, then `npm run build`, then a real call through an MCP client (see "Trying a change" below).

## Layout

- `src/index.ts` - MCP server: tool definitions (JSON schema) and the request handlers that shape the output.
- `src/client.ts` - Knowledge Graph HTTP client, API-key check, and `explainApiError` (turns Google's error JSON into an actionable message).
- `src/version.ts` - reads the version from package.json at runtime. Never hardcode a version string in source.
- `server.json` - MCP Registry manifest.

## Rules that bite

- **stdout is the protocol.** It carries MCP JSON-RPC. Never `console.log`; diagnostics go to stderr (`console.error`, `process.stderr.write`).
- **CommonJS output.** `tsconfig.json` compiles to `module: commonjs`; `version.ts` relies on `__dirname`. Keep relative imports with the `.js` suffix (`./client.js`), as the existing code does.
- **The API key travels in the URL query** (Google's requirement). Never log a request URL, a key, or the environment. Error messages may include Google's response body, never the URL.
- **Key kinds:** a Google Cloud key (`AIza...`, 39 chars) works; a Google AI Studio key (`AQ.`) never does. Keep `explainApiError` and the boot-time warning in step with that.
- **Env vars:** `GOOGLE_KNOWLEDGE_GRAPH_API_KEY`, or `GOOGLE_CLOUD_API_KEY` as the fallback. Never read or write `.env`; `.env.example` is the documented shape.
- **Tool contract:** tool names and input schemas are public API for every client that has this server installed. Renaming or removing a field is a breaking change: call it out, don't slip it in.

## Trying a change

Build, then point an MCP client at your local `dist/index.js`. In OpenCode, the project `opencode.json` in this repo defines a `google-knowledge-graph-dev` server for exactly this, disabled by default: set `"enabled": true` and export `GOOGLE_KNOWLEDGE_GRAPH_API_KEY` in your shell first. Then ask for a search ("look up the Eiffel Tower in the knowledge graph") and a lookup by the MID it returns.

## Releases (maintainer only)

Agents do not publish, tag, push or bump versions unless explicitly asked. For reference, a release is:

1. Bump `version` in `package.json` and `server.json` together (they must match).
2. Add a CHANGELOG.md entry (Keep a Changelog format).
3. `npm publish`, then run the `publish-mcp.yml` GitHub Action (workflow_dispatch) for the MCP Registry. Never publish to the registry from a local login.

## Git

Work on the current branch. Don't commit, push or open PRs unless asked. Keep commits focused, with a plain one-line summary (`fix: ...`, `docs: ...` as in the existing history).
