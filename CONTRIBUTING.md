# Contributing to Google Knowledge Graph MCP

Thanks for your interest in improving this MCP server.

## Reporting Issues

If you find a bug or have a feature request:

1. Check existing issues first to avoid duplicates
2. Create a new issue with:
   - Clear description of the problem
   - Steps to reproduce (if bug)
   - Expected vs actual behaviour
   - Your environment (Node version, OS, MCP client)

## Pull Requests

I'm happy to review PRs that:

- Fix bugs or improve error handling
- Add useful features that fit the scope
- Improve documentation or examples
- Add tests

**Before submitting:**

1. Test your changes locally
2. Ensure TypeScript compiles without errors: `npm run build`
3. Update README if adding features
4. Keep commits focused and well-described

## Development Setup

```bash
# Clone the repo
git clone https://github.com/houtini/google-knowledge-graph-mcp.git
cd google-knowledge-graph-mcp

# Install dependencies
npm install

# Build
npm run build

# Test locally in Claude Desktop
# Add to claude_desktop_config.json pointing to your local dist/index.js
```

## Code Style

- TypeScript with strict mode enabled
- CommonJS module format (MCP SDK compatibility)
- Clear variable names
- Comments for non-obvious logic
- Error handling for API failures

## Testing Changes

1. Build the project: `npm run build`
2. Configure Claude Desktop to use your local build
3. Restart Claude Desktop
4. Test your changes with real queries
5. Verify error cases work as expected

## Project Scope

This MCP focuses on the **free public** Knowledge Graph Search API. Features should:

- Work with the public API (not Enterprise API)
- Provide value for research/content workflows
- Maintain simplicity and reliability
- Avoid unnecessary dependencies

## Questions?

Open an issue or email richard@houtini.ai

---

**Note:** This is a side project maintained by one person. Response times may vary, but I'll do my best to review contributions promptly.
