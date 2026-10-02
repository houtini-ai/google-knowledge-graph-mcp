# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.8] - 2026-10-02

### Fixed
- Tool arguments are now validated against the advertised schema: an empty `ids` array, an out-of-range `limit` or a non-string `query` return a clear error instead of reaching Google as a malformed request
- API requests now time out after 30 seconds with a clear error instead of hanging forever

### Changed
- Documentation truth pass: troubleshooting now describes the 400 "API key not valid" response (not 401), stale version footer removed, clone URLs corrected to the houtini-ai organisation, and this changelog backfilled for 1.0.1-1.0.7

### Added
- AGENTS.md with instructions for AI coding agents, and an `opencode.json` dev server config

## [1.0.7] - 2026-08-08

### Added
- Actionable error messages when Google rejects the API key, including detection of Google AI Studio keys used by mistake
- GitHub Actions workflow to publish to the MCP Registry

## [1.0.6] - 2026-08-08

### Fixed
- Version drift in the MCP handshake: the server version is now read from package.json at runtime
- Unique logo artwork

### Changed
- Documentation: Claude Code CLI installation instructions, table of contents, Glama badge

## [1.0.5] - 2026-02-23

### Fixed
- Server version reported at registration now matches package.json

## [1.0.4] - 2026-02-23

### Fixed
- Version mismatch in server registration
- Dependency updates to reduce reported vulnerabilities

## [1.0.3] - 2026-01-29

### Changed
- README badge updates (MCP Registry, Snyk)

## [1.0.2] - 2026-01-29

### Added
- MCP Registry support via `server.json`

## [1.0.1] - 2026-01-28

### Changed
- Upgraded dependencies and fixed TypeScript types
- Corrected repository URLs to the houtini-ai organisation

## [1.0.0] - 2026-01-28

### Added
- Initial release of Google Knowledge Graph Search MCP
- `search_knowledge_graph` tool for entity search by query
- `lookup_knowledge_graph_entities` tool for MID-based lookup
- Support for language filtering
- Support for entity type filtering
- Configurable result limits (1-500)
- TypeScript definitions and source maps
- Comprehensive README with usage examples
- MIT licence

### Technical
- Built on @modelcontextprotocol/sdk v1.0.4
- Uses Google's free public Knowledge Graph Search API
- CommonJS module format for MCP compatibility
- Full TypeScript support with strict mode
- Error handling for API failures

[1.0.0]: https://github.com/houtini-ai/google-knowledge-graph-mcp/releases/tag/v1.0.0
