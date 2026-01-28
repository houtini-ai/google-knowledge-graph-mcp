# Google Knowledge Graph MCP Test Configuration

**IMPORTANT**: Add this to your `claude_desktop_config.json` to test the MCP.

Remember to replace `YOUR_API_KEY_HERE` with your actual Google Cloud API key.

## Configuration

```json
{
  "mcpServers": {
    "google-knowledge-graph": {
      "command": "node",
      "args": ["C:\\MCP\\google-knowledge-graph-search-mcp\\dist\\index.js"],
      "env": {
        "GOOGLE_CLOUD_API_KEY": "YOUR_API_KEY_HERE"
      }
    }
  }
}
```

## Get Your API Key

1. Go to https://console.cloud.google.com/apis/credentials
2. Create a new API key or use an existing one
3. Enable the Enterprise Knowledge Graph API: https://console.cloud.google.com/apis/library/enterpriseknowledgegraph.googleapis.com

## Testing

After adding to Claude Desktop config and restarting:

1. Ask Claude: "Search the knowledge graph for SpaceX"
2. Ask Claude: "Look up entity with MID /m/02mjmr" (Elon Musk)
3. Try different entity types: "Find Person entities for Marie Curie"

## Troubleshooting

- Make sure API key is valid
- Ensure API is enabled in Google Cloud Console
- Check that billing is set up (required for some features)
- Restart Claude Desktop after config changes
