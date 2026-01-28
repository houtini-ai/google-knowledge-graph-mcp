export interface KnowledgeGraphEntity {
  '@context'?: any;
  '@type'?: string | string[];
  '@id'?: string;
  name?: string;
  description?: string;
  detailedDescription?: {
    articleBody?: string;
    url?: string;
    license?: string;
  };
  image?: {
    contentUrl?: string;
    url?: string;
  };
  url?: string;
  resultScore?: number;
  [key: string]: any;
}

export interface SearchOptions {
  query?: string;
  ids?: string[];
  languages?: string[];
  types?: string[];
  limit?: number;
  indent?: boolean;
  prefix?: boolean;
}

const API_KEY = process.env.GOOGLE_KNOWLEDGE_GRAPH_API_KEY || process.env.GOOGLE_CLOUD_API_KEY;
const BASE_URL = 'https://kgsearch.googleapis.com/v1/entities:search';

if (!API_KEY) {
  throw new Error('GOOGLE_KNOWLEDGE_GRAPH_API_KEY or GOOGLE_CLOUD_API_KEY environment variable is required');
}

/**
 * Build URL for Knowledge Graph Search API
 * Docs: https://developers.google.com/knowledge-graph/reference/rest/v1/
 */
function buildSearchUrl(options: SearchOptions): string {
  const params = new URLSearchParams({
    key: API_KEY!,
  });

  // Query parameter (for text search)
  if (options.query) {
    params.append('query', options.query);
  }

  // IDs parameter (for entity lookup by MID)
  if (options.ids && options.ids.length > 0) {
    params.append('ids', options.ids.join(','));
  }

  // Languages parameter
  if (options.languages && options.languages.length > 0) {
    params.append('languages', options.languages.join(','));
  }

  // Types parameter (schema.org types)
  if (options.types && options.types.length > 0) {
    params.append('types', options.types.join(','));
  }

  // Limit parameter (default: 20, max: 500)
  if (options.limit) {
    params.append('limit', String(options.limit));
  }

  // Indent parameter (for pretty-printed JSON)
  if (options.indent) {
    params.append('indent', 'True');
  }

  // Prefix parameter (for prefix matching)
  if (options.prefix !== undefined) {
    params.append('prefix', String(options.prefix));
  }

  return `${BASE_URL}?${params.toString()}`;
}

/**
 * Search Knowledge Graph by query string
 */
export async function searchEntities(options: SearchOptions): Promise<KnowledgeGraphEntity[]> {
  if (!options.query && !options.ids) {
    throw new Error('Either query or ids parameter is required');
  }

  const url = buildSearchUrl(options);

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Knowledge Graph API request failed: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data: any = await response.json();

  // API returns { itemListElement: [ { result: {...}, resultScore: number } ] }
  if (data.itemListElement && Array.isArray(data.itemListElement)) {
    return data.itemListElement.map((item: any) => ({
      ...item.result,
      resultScore: item.resultScore,
    }));
  }

  return [];
}

/**
 * Lookup entities by Machine IDs (MIDs)
 */
export async function lookupEntities(ids: string[], languages?: string[]): Promise<KnowledgeGraphEntity[]> {
  return searchEntities({
    ids,
    languages,
  });
}
