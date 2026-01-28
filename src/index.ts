#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { searchEntities, lookupEntities, SearchOptions } from './client.js';

const server = new Server(
  {
    name: 'google-knowledge-graph-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'search_knowledge_graph',
        description: 'Search Google Knowledge Graph for entities by name or topic. Returns structured information about real-world entities like people, places, organizations, and concepts from Google\'s public knowledge base.',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query for entities (e.g., "Taylor Swift", "Eiffel Tower", "Python programming")',
            },
            languages: {
              type: 'array',
              items: { type: 'string' },
              description: 'Language codes (ISO 639, e.g., ["en", "es", "fr"]). Default: ["en"]',
            },
            types: {
              type: 'array',
              items: { type: 'string' },
              description: 'Filter by schema.org types (e.g., ["Person", "Organization", "Place"])',
            },
            limit: {
              type: 'number',
              minimum: 1,
              maximum: 500,
              description: 'Maximum results to return (1-500). Default: 20',
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'lookup_knowledge_graph_entities',
        description: 'Look up specific Knowledge Graph entities by their Machine IDs (MIDs). Use this when you already know the entity IDs from a previous search. MIDs look like /m/0dl567 or /g/11b6vwtjpg.',
        inputSchema: {
          type: 'object',
          properties: {
            ids: {
              type: 'array',
              items: { type: 'string' },
              minItems: 1,
              description: 'Entity Machine IDs (MIDs) to lookup (e.g., ["/m/0dl567"])',
            },
            languages: {
              type: 'array',
              items: { type: 'string' },
              description: 'Language codes for results. Default: ["en"]',
            },
          },
          required: ['ids'],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;

    if (name === 'search_knowledge_graph') {
      const { query, languages, types, limit } = args as any;

      const options: SearchOptions = {
        query,
        languages: languages || ['en'],
        types,
        limit: limit || 20,
      };

      const entities = await searchEntities(options);

      const output = {
        entities: entities.map(e => {
          const rawMid = e['@id'] || '';
          const mid = rawMid.replace(/^kg:/, '');
          
          return {
            mid,
            name: e.name || '',
            type: Array.isArray(e['@type']) ? e['@type'] : [e['@type'] || 'Thing'],
            description: e.description || undefined,
            detailedDescription: e.detailedDescription?.articleBody || undefined,
            image: e.image?.contentUrl || undefined,
            url: e.url || undefined,
            resultScore: e.resultScore || undefined,
          };
        }),
        count: entities.length,
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(output, null, 2),
          },
        ],
      };
    }

    if (name === 'lookup_knowledge_graph_entities') {
      const { ids, languages } = args as any;

      const entities = await lookupEntities(ids, languages || ['en']);

      const output = {
        entities: entities.map(e => {
          const rawMid = e['@id'] || '';
          const mid = rawMid.replace(/^kg:/, '');
          
          return {
            mid,
            name: e.name || '',
            type: Array.isArray(e['@type']) ? e['@type'] : [e['@type'] || 'Thing'],
            description: e.description || undefined,
            detailedDescription: e.detailedDescription?.articleBody || undefined,
            image: e.image?.contentUrl || undefined,
            url: e.url || undefined,
            resultScore: e.resultScore || undefined,
          };
        }),
        count: entities.length,
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(output, null, 2),
          },
        ],
      };
    }

    throw new Error(`Unknown tool: ${name}`);
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);

  process.on('SIGINT', async () => {
    await server.close();
    process.exit(0);
  });
}

main().catch((error) => {
  process.stderr.write(`Fatal error: ${error}\n`);
  process.exit(1);
});
