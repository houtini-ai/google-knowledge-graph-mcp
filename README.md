# Google Knowledge Graph Search MCP

[![npm version](https://img.shields.io/npm/v/@houtini/google-knowledge-graph-mcp.svg)](https://www.npmjs.com/package/@houtini/google-knowledge-graph-mcp)
[![Known Vulnerabilities](https://snyk.io/test/github/houtini-ai/google-knowledge-graph-search-mcp/badge.svg)](https://snyk.io/test/github/houtini-ai/google-knowledge-graph-search-mcp)
[![MCP Registry](https://img.shields.io/badge/MCP-Registry-blue?style=flat-square)](https://registry.modelcontextprotocol.io/servers/io.github.houtini/google-knowledge-graph)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MCP](https://img.shields.io/badge/MCP-Compatible-blue)](https://modelcontextprotocol.io)

Model Context Protocol server that connects Claude (or any MCP client) to Google's free public Knowledge Graph API. Search for real-world entities - people, places, organisations, concepts - and get structured data back.

**What is this?** An MCP server. If you don't know what that means, you probably don't need this. If you're using Claude Desktop or another MCP-compatible client and want to search Google's knowledge database, this is for you.

## Why This Exists

I built this because I needed a way for Claude to verify entity information during research workflows. Google's Knowledge Graph contains structured data about millions of real-world entities - the same data that powers those knowledge panels in Google Search results.

The Knowledge Graph Search API is completely free. No billing account, no usage costs, just a Google Cloud API key. Most developers don't seem to know this exists, which is odd given how useful it is.

This MCP gives Claude (or any MCP client) access to that database.

## What You Get

Two tools for searching Google's knowledge graph:

**1. Search by query** - `search_knowledge_graph`
Search for entities by name or description. Returns structured data including entity types, descriptions, Wikipedia URLs, and relevance scores.

**2. Lookup by MID** - `lookup_knowledge_graph_entities`  
If you already have Machine IDs (Google's internal entity identifiers), look them up directly. Useful for entity resolution workflows.

Both return JSON with:
- Entity names and types
- Detailed descriptions (usually from Wikipedia)
- Official images and URLs
- Result scores (relevance ranking)
- Machine IDs for further lookups

## Installation

### NPX (Easiest)

Add this to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "google-knowledge-graph": {
      "command": "npx",
      "args": ["-y", "@houtini/google-knowledge-graph-mcp"],
      "env": {
        "GOOGLE_KNOWLEDGE_GRAPH_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

### Local Install

If you prefer running from source:

```bash
git clone https://github.com/houtini/google-knowledge-graph-search-mcp.git
cd google-knowledge-graph-search-mcp
npm install
npm run build
```

Then configure Claude Desktop:

```json
{
  "mcpServers": {
    "google-knowledge-graph": {
      "command": "node",
      "args": ["C:\\path\\to\\google-knowledge-graph-search-mcp\\dist\\index.js"],
      "env": {
        "GOOGLE_KNOWLEDGE_GRAPH_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

**Windows users:** Use double backslashes in paths: `C:\\MCP\\...`

**Config location:**
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Linux: `~/.config/Claude/claude_desktop_config.json`

## Getting Your API Key

Google's Knowledge Graph Search API is free. Genuinely free - no billing account required.

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select an existing one)
3. Enable "Knowledge Graph Search API" in the API Library
4. Navigate to "Credentials" and create an API key
5. (Optional but recommended) Restrict the key to Knowledge Graph Search API only

That's it. No credit card, no billing setup.

## Usage Examples

Once installed and Claude Desktop is restarted, you can:

**Basic entity search:**
```
Search the knowledge graph for "Marie Curie"
```

**Entity type filtering:**
```
Search knowledge graph for "Python" with types ["ComputerLanguage"]
```

**Multiple results:**
```
Search knowledge graph for "Paris" limit 5
```

**Lookup by MID:**
```
Look up knowledge graph entity /m/0dl567
```

The MCP returns structured JSON that Claude can parse. You'll get entity names, types, descriptions, URLs, and relevance scores.

## What Gets Returned

Example response structure:

```json
{
  "entities": [
    {
      "mid": "/m/0dl567",
      "name": "Taylor Swift",
      "type": ["Person", "Thing"],
      "description": "American singer-songwriter",
      "detailedDescription": "Taylor Alison Swift is an American singer-songwriter...",
      "image": "https://...",
      "url": "http://en.wikipedia.org/wiki/Taylor_Swift",
      "resultScore": 4258.07
    }
  ],
  "count": 1
}
```

## Parameters

### search_knowledge_graph

- **query** (required): Search term
- **languages** (optional): Language codes array, e.g. `["en"]`
- **types** (optional): Entity types to filter by, e.g. `["Person", "Organization"]`
- **limit** (optional): Max results (default 20, max 500)

### lookup_knowledge_graph_entities

- **ids** (required): Array of Machine IDs (MIDs), e.g. `["/m/0dl567"]`
- **languages** (optional): Language codes array

## Common Entity Types

The Knowledge Graph uses schema.org types. Common ones:

- `Person` - Individual people
- `Organization` - Companies, institutions
- `Place` - Locations, geographical entities
- `Event` - Historical or current events
- `CreativeWork` - Books, films, music, art
- `Product` - Commercial products
- `ComputerLanguage` - Programming languages
- `SportsTeam` - Sports teams
- `Country` - Nations and countries
- `City` - Cities and municipalities

You can combine types for more specific searches.

## Troubleshooting

**MCP not appearing in Claude:**
1. Check your JSON syntax - one error breaks everything
2. Verify the path uses correct escaping (`\\` on Windows)
3. Completely restart Claude Desktop (quit, not just minimise)
4. Check the API key environment variable spelling

**"API key required" error:**
- The environment variable isn't being read
- Check spelling: `GOOGLE_KNOWLEDGE_GRAPH_API_KEY`
- Restart Claude Desktop after config changes

**No results returned:**
- Try different query terms
- Remove entity type filters to broaden search
- Check result limit isn't set too low

**401 Unauthorized:**
- API key is invalid or expired
- Knowledge Graph Search API isn't enabled in your Google Cloud project

## Building From Source

```bash
npm install
npm run build
```

The build process compiles TypeScript to CommonJS in `dist/`. No special configuration needed.

## Technical Details

- **API Endpoint:** `https://kgsearch.googleapis.com/v1/entities:search`
- **Response Format:** JSON-LD with `itemListElement` array
- **Authentication:** API key via query parameter
- **Rate Limits:** Free tier quotas apply (generally 100,000 queries/day)
- **Module Format:** CommonJS (compatible with Node.js MCP hosts)

## Why CommonJS?

The MCP SDK uses CommonJS patterns. I've stuck with that for compatibility. If you're building your own MCP and want ES modules, that's fine - just different choices.

## Contributing

If you find issues or have improvements:

1. Check existing issues first
2. Test your changes locally
3. Submit a PR with clear description

I'm particularly interested in hearing about:
- Entity types that need better handling
- Response parsing edge cases
- Real-world usage patterns

## Licence

MIT - do what you want with it.

## Author

Built by Richard Baxter ([Houtini](https://houtini.ai)) as part of a collection of MCP servers for AI-assisted development and research workflows.

**Other Houtini MCPs:**
- `@houtini/gemini-mcp` - Google AI chat with grounding and deep research
- `@houtini/geo-analyzer` - Content optimisation for AI search engines
- `@houtini/brevo-mcp` - Email marketing automation

## Related

- [Model Context Protocol](https://modelcontextprotocol.io) - Protocol specification
- [Google Knowledge Graph API](https://developers.google.com/knowledge-graph/) - Official API docs
- [Claude Desktop](https://claude.ai/download) - Primary MCP client

---

**Version:** 1.0.0  
**Status:** Production ready, tested with Claude Desktop
