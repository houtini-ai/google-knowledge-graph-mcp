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

// Say it at boot rather than waiting for the first search to fail. Warn, don't
// throw: the shape check is a heuristic, and refusing to start on a key that
// might be fine is worse than a line on stderr. (stderr, never stdout - stdout
// carries the MCP JSON-RPC framing.)
if (API_KEY.startsWith('AQ.')) {
  console.error(
    '[google-knowledge-graph] Warning: the API key starts with "AQ.", which is a\n' +
    '  Google AI Studio (Gemini) key. This API needs a Google Cloud API key\n' +
    '  ("AIza...", 39 chars) with the Knowledge Graph Search API enabled.\n' +
    '  Searches will fail with "API key not valid" until that is corrected.'
  );
}

/**
 * Google AI Studio keys look nothing like Google Cloud keys, and the two are
 * easy to mix up when both are sitting in the same MCP config: a Cloud key is
 * `AIza...` and 39 characters, an AI Studio (Gemini) key is `AQ.` and longer.
 * kgsearch only accepts the Cloud one, and answers a Gemini key with a bare
 * "API key not valid" that says nothing about why.
 */
function looksLikeAiStudioKey(key: string): boolean {
  return key.startsWith('AQ.');
}

/**
 * Turn a failed response into something the reader can act on.
 *
 * The raw Google error is a wall of JSON whose most useful sentence is "API key
 * not valid" - true, but it doesn't say the key is the *wrong kind*, which is
 * the usual cause. Google's own text is still appended, so nothing is hidden.
 */
function explainApiError(status: number, statusText: string, body: string): string {
  const raw = `Knowledge Graph API request failed: ${status} ${statusText} - ${body}`;
  const isKeyProblem = status === 400 && /API_KEY_INVALID|API key not valid/i.test(body);

  if (isKeyProblem && looksLikeAiStudioKey(API_KEY!)) {
    return [
      'Knowledge Graph rejected the API key, and it looks like the wrong kind of key.',
      '',
      'The key starts with "AQ.", which is a Google AI Studio (Gemini) key. This API',
      'needs a Google Cloud API key - they start with "AIza" and are 39 characters.',
      'A Gemini key will never work here, however many times it is re-pasted.',
      '',
      'To get the right one:',
      '  1. https://console.cloud.google.com/ - pick or create a project',
      '  2. Enable "Knowledge Graph Search API" for it',
      '  3. Credentials -> Create credentials -> API key',
      '  4. Put that value in GOOGLE_KNOWLEDGE_GRAPH_API_KEY',
      '',
      'It stays free: no billing account, no quota to unlock.',
      '',
      `Google's response: ${body}`,
    ].join('\n');
  }

  if (isKeyProblem) {
    return [
      'Knowledge Graph rejected the API key.',
      '',
      'Check that it is a Google Cloud API key (starts with "AIza", 39 characters)',
      'and that "Knowledge Graph Search API" is enabled for that key\'s project at',
      'https://console.cloud.google.com/ - a valid key still fails if the API was',
      'never switched on.',
      '',
      `Google's response: ${body}`,
    ].join('\n');
  }

  if (status === 403) {
    return [
      'Knowledge Graph refused the request (403).',
      '',
      'The key is recognised but not allowed to call this API. Usually one of:',
      '  - "Knowledge Graph Search API" is not enabled for the key\'s project',
      '  - the key has an API restriction that excludes kgsearch.googleapis.com',
      '  - the key has an HTTP-referrer or IP restriction that this machine fails',
      '',
      `Google's response: ${body}`,
    ].join('\n');
  }

  if (status === 429) {
    return `Knowledge Graph rate-limited the request (429). Back off and retry.\n\nGoogle's response: ${body}`;
  }

  return raw;
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
    throw new Error(explainApiError(response.status, response.statusText, errorText));
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
