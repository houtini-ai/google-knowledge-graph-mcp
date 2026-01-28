# Google Knowledge Graph Search MCP - Project Summary

**Created:** January 28, 2026  
**Status:** ✅ Built Successfully - Ready for Testing  
**Location:** `C:\MCP\google-knowledge-graph-search-mcp\`

## What We Built

A Model Context Protocol (MCP) server that provides access to Google's Enterprise Knowledge Graph Search API. This enables AI assistants like Claude to search for and retrieve structured information about real-world entities from Google's knowledge database.

## Architecture

- **Language:** TypeScript (compiled to CommonJS)
- **Framework:** @modelcontextprotocol/sdk v1.0.4
- **Pattern:** Based on successful Gemini MCP architecture
- **Dependencies:** Minimal (MCP SDK + Zod for validation)

## Available Tools

### 1. `search_knowledge_graph`
Search for entities by query string.

**Parameters:**
- `query` (required): Search query
- `languages` (optional): Language codes array (default: ["en"])
- `types` (optional): Schema.org types filter
- `limit` (optional): Max results 1-500 (default: 20)
- `edition` (optional): "basic" or "advanced" (default: "basic")

**Example Usage:**
```
Search knowledge graph for "SpaceX" with types ["Organization"]
```

### 2. `lookup_knowledge_graph_entities`
Lookup entities by their Machine IDs (MIDs).

**Parameters:**
- `ids` (required): Array of MIDs (e.g., ["/m/02mjmr", "c-abc123"])
- `languages` (optional): Language codes
- `edition` (optional): "basic" or "advanced"

**Example Usage:**
```
Look up entity /m/02mjmr (Elon Musk)
```

## API Information

### Google Cloud Setup Required

This MCP uses the **Google Cloud Enterprise Knowledge Graph API**, which requires:

1. **Google Cloud Project**: Must have active GCP project
2. **API Enabled**: Enterprise Knowledge Graph API must be enabled
3. **API Key**: Need valid API key from Google Cloud Console
4. **Billing** (Optional): Free tier available (100,000 calls/day)

**Get Started:**
- Console: https://console.cloud.google.com
- API Library: https://console.cloud.google.com/apis/library/enterpriseknowledgegraph.googleapis.com
- Credentials: https://console.cloud.google.com/apis/credentials

### API Editions

- **Basic Edition**: Public knowledge graph data, 100k free calls/day
- **Advanced Edition**: Enterprise features, private data, 60 requests/min

## File Structure

```
google-knowledge-graph-search-mcp/
├── src/
│   ├── index.ts           # Main MCP server implementation
│   └── client.ts          # Google API client
├── dist/                   # Compiled JavaScript (generated)
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── README.md               # Comprehensive documentation
├── LICENSE                 # MIT License
├── TEST_CONFIG.md          # Testing instructions
└── .env.example            # Environment variable template
```

## Environment Variables

Required:
- `GOOGLE_CLOUD_API_KEY` - Your Google Cloud API key

Optional:
- `GOOGLE_CLOUD_PROJECT_ID` - Your GCP project ID (defaults to "global")

## Installation Options

### Option 1: Local Development (Current)
```json
{
  "mcpServers": {
    "google-knowledge-graph": {
      "command": "node",
      "args": ["C:\\MCP\\google-knowledge-graph-search-mcp\\dist\\index.js"],
      "env": {
        "GOOGLE_CLOUD_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

### Option 2: Future NPM Package
Once published to npm as `@houtini/google-knowledge-graph-mcp`:
```json
{
  "mcpServers": {
    "google-knowledge-graph": {
      "command": "npx",
      "args": ["@houtini/google-knowledge-graph-mcp"],
      "env": {
        "GOOGLE_CLOUD_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

## Build Commands

```bash
# Install dependencies
npm install --production=false

# Build TypeScript
npm run build

# Development mode (watch)
npm run dev
```

## Key Features

✅ **Search Entities**: Query by name, get structured data  
✅ **Lookup by MID**: Direct access via Machine IDs  
✅ **Multi-Language**: Support for multiple languages  
✅ **Type Filtering**: Filter by schema.org entity types  
✅ **Rich Metadata**: Names, descriptions, images, URLs  
✅ **Error Handling**: Comprehensive error messages  
✅ **TypeScript**: Full type safety and IntelliSense  

## Testing Checklist

- [ ] Add configuration to `claude_desktop_config.json`
- [ ] Get Google Cloud API key
- [ ] Enable Enterprise Knowledge Graph API
- [ ] Restart Claude Desktop
- [ ] Test search: "Search knowledge graph for Tesla"
- [ ] Test lookup: "Look up entity /m/02mjmr"
- [ ] Test type filtering: "Find Person entities for Einstein"

## Common Use Cases

1. **Entity Research**: Get authoritative information about people, places, organizations
2. **Fact Checking**: Verify entity information against Google's knowledge base
3. **Content Enrichment**: Add structured data to articles and documents
4. **SEO Research**: Understand how Google structures entity data
5. **Data Integration**: Connect your systems to Google's knowledge graph

## Known Limitations

- **Requires API Key**: Not free/open like web search
- **Geographic Scope**: Enterprise API primarily focused on widely-known entities
- **Rate Limits**: Basic edition: 100k/day, Advanced: 60/min
- **Billing Required**: Some features may require active billing

## Next Steps

1. **Testing**: Validate with real API key and queries
2. **Documentation**: Add more examples and use cases
3. **Publishing**: Prepare for npm publication as `@houtini/google-knowledge-graph-mcp`
4. **Article**: Write MCP article documenting the build process
5. **GitHub**: Push to public repository

## Comparison with Other MCPs

### vs SearchAPI MCP
- SearchAPI: Web search results (HTML snippets)
- Knowledge Graph: Structured entity data (JSON-LD)

### vs Brave Search MCP
- Brave: General web search
- Knowledge Graph: Specific entity information

### vs Firecrawl MCP
- Firecrawl: Web page scraping
- Knowledge Graph: Curated entity database

## Resources

- **MCP Specification**: https://modelcontextprotocol.io
- **Google Cloud Docs**: https://cloud.google.com/enterprise-knowledge-graph/docs
- **Schema.org**: https://schema.org/docs/full.html (entity types)
- **Houtini**: https://houtini.ai

## License

MIT License - Free for commercial and personal use

## Author

**Richard Baxter** (Houtini)  
Email: richard@houtini.ai  
Website: https://houtini.ai

---

**Status**: ✅ Built and ready for testing with valid Google Cloud API key
