# Google Knowledge Graph Search MCP - Handover & Testing

## PROJECT STATUS: ✅ Fully Tested & Working - Production Ready

**Working Directory:** `C:\MCP\google-knowledge-graph-search-mcp\`

## Test Results

### ✅ Search Function - WORKING
- Successfully searches for entities by query string
- Returns structured data with MIDs, names, descriptions, images
- Type filtering works correctly
- Limit parameter working

### ✅ Lookup Function - WORKING (Fixed MID Format)
- Successfully looks up entities by Machine IDs
- **Fixed Issue:** API returns MIDs as "kg:/m/XXXXX" but lookup requires "/m/XXXXX"
- **Solution:** Strip "kg:" prefix from MIDs in both search and lookup responses

## What Was Built

A complete MCP server for Google's **free public** Knowledge Graph Search API that enables searching for structured entity information (people, places, organizations, concepts) from Google's knowledge base.

### Key Components

1. **src/client.ts** - API client for kgsearch.googleapis.com
   - `searchEntities()` - Search by query string
   - `lookupEntities()` - Lookup by Machine IDs (MIDs)
   - Handles JSON-LD response format correctly

2. **src/index.ts** - MCP server implementation
   - Two tools: `search_knowledge_graph` and `lookup_knowledge_graph_entities`
   - Uses @modelcontextprotocol/sdk
   - CommonJS format (like Gemini MCP)

3. **dist/** - Compiled JavaScript (built successfully with `npm run build`)

### API Details

- **Endpoint:** `https://kgsearch.googleapis.com/v1/entities:search`
- **Free Public API** (not the Enterprise API)
- **Response Format:** `{ itemListElement: [ { result: {...}, resultScore: number } ] }`
- **Authentication:** API key via query parameter

## Testing Instructions

### Step 1: Add API Key to Configuration

Add this to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "google-knowledge-graph": {
      "command": "node",
      "args": ["C:\\MCP\\google-knowledge-graph-search-mcp\\dist\\index.js"],
      "env": {
        "GOOGLE_KNOWLEDGE_GRAPH_API_KEY": "YOUR_API_KEY_HERE"
      }
    }
  }
}
```

**Config Location:**
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

### Step 2: Restart Claude Desktop

Completely quit and restart Claude Desktop after adding the configuration.

### Step 3: Test the Tools

Try these queries with Claude:

**Test 1: Basic Search**
```
Search the knowledge graph for "Taylor Swift"
```

**Test 2: Entity Type Filter**
```
Search knowledge graph for "Python" with types ["ComputerLanguage"]
```

**Test 3: Multiple Results**
```
Search knowledge graph for "Paris" limit 5
```

**Test 4: Lookup by MID** (if you get MIDs from search results)
```
Look up knowledge graph entity with MID /m/0dl567
```

## Expected Response Format

The MCP should return structured JSON like:

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

## Troubleshooting

### MCP Not Appearing in Claude

1. **Check JSON syntax** - One syntax error breaks all MCPs
2. **Verify path** - Must use double backslashes: `C:\\MCP\\...`
3. **Check build** - Ensure `dist/index.js` exists
4. **Restart completely** - Close Claude Desktop fully, not just minimize

### API Errors

1. **"API key required" error** - Check environment variable spelling
2. **401 Unauthorized** - API key invalid or expired
3. **No results** - Try different query or check entity types

### Build Issues

If you need to rebuild:
```bash
cd C:\MCP\google-knowledge-graph-search-mcp
npm install --production=false
npm run build
```

## Code Architecture

### Client (src/client.ts)

- **Environment Variable:** Reads `GOOGLE_KNOWLEDGE_GRAPH_API_KEY` or `GOOGLE_CLOUD_API_KEY`
- **URL Building:** Constructs query with parameters (query, ids, languages, types, limit)
- **Response Parsing:** Extracts `item.result` from each `itemListElement` and adds `resultScore`

### Server (src/index.ts)

- **Tool 1:** `search_knowledge_graph` - Search by text query
  - Parameters: query (required), languages, types, limit
- **Tool 2:** `lookup_knowledge_graph_entities` - Lookup by MIDs
  - Parameters: ids (required), languages

## Verification Checklist

- [x] TypeScript compiles successfully
- [x] dist/index.js generated
- [x] API client uses correct endpoint (kgsearch.googleapis.com)
- [x] Response parsing matches API format (itemListElement)
- [x] Environment variable handling correct
- [x] Tested with actual API key
- [x] Verified search results in Claude Desktop
- [x] Verified lookup by MID works
- [x] Fixed MID format issue (strip "kg:" prefix)

## Test Results Summary

**Test 1: Basic Search ✅**
```
Query: "Taylor Swift"
Result: Found entity with MID /m/0dl567, description, image, Wikipedia URL
Score: 26166.71
```

**Test 2: Type-Filtered Search ✅**
```
Query: "Python programming"
Types: ["ComputerLanguage"]
Result: Found Python language entity with detailed description
Score: 128103.13
```

**Test 3: MID Lookup (After Fix) ✅**
```
MIDs: ["/m/0dl567", "/m/05z1_"]
Result: Successfully retrieved both entities
Fix Applied: Strip "kg:" prefix from API responses
```

## Known Working Example

The API is confirmed working with this format:
```javascript
https://kgsearch.googleapis.com/v1/entities:search?query=Taylor+Swift&limit=1&key=API_KEY
```

Response structure:
```javascript
{
  itemListElement: [
    {
      result: {
        "@id": "/m/0dl567",
        name: "Taylor Swift",
        "@type": ["Person", "Thing"],
        description: "...",
        // ... more fields
      },
      resultScore: 4258.07
    }
  ]
}
```

## Next Steps After Testing

1. **Document findings** - Note any issues or quirks
2. **Update README** - Add working examples from tests
3. **Consider publishing** - To npm as `@houtini/google-knowledge-graph-mcp`
4. **Write article** - MCP development article for the articles project

## Files Reference

- `src/client.ts` - API client implementation
- `src/index.ts` - MCP server with tool handlers
- `dist/index.js` - Compiled entry point
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript config (CommonJS)
- `README.md` - Full documentation
- `PROJECT_SUMMARY.md` - Architecture overview

## Quick Commands

```bash
# Rebuild if needed
npm run build

# Check if tools compile
node dist/index.js --help

# View config location
echo %APPDATA%\Claude\claude_desktop_config.json
```

---

**Ready for testing!** Just need to add the API key to Claude Desktop config and restart.
