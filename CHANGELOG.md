# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

[1.0.0]: https://github.com/houtini/google-knowledge-graph-mcp/releases/tag/v1.0.0
