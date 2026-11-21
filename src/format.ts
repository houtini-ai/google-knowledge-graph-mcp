import type { KnowledgeGraphEntity } from './client.js';

/**
 * One detailed description (usually a Wikipedia extract) as returned to the
 * caller. `url` is the page the text was taken from, `license` its licence.
 */
export interface DetailedDescription {
  language?: string;
  articleBody?: string;
  url?: string;
  license?: string;
}

export interface EntityOutput {
  mid: string;
  googleSearchUrl?: string;
  name: unknown;
  type: string[];
  description?: unknown;
  detailedDescription?: DetailedDescription | DetailedDescription[];
  image?: string;
  imageSourceUrl?: string;
  imageLicense?: string;
  url?: string;
  resultScore?: number;
}

function toDetailed(raw: any): DetailedDescription | undefined {
  if (!raw || typeof raw !== 'object') {
    return undefined;
  }
  const out: DetailedDescription = {
    language: raw.inLanguage || raw['@language'] || undefined,
    articleBody: raw.articleBody || undefined,
    url: raw.url || undefined,
    license: raw.license || undefined,
  };
  return out.articleBody || out.url ? out : undefined;
}

/**
 * With one language the API returns `detailedDescription` as an object; with
 * several (`languages=de&languages=en`) it returns a list of objects, one per
 * language, each tagged with `inLanguage`. Reading `.articleBody` off the list
 * yields undefined, which used to drop the description silently whenever more
 * than one language was requested. Keep the shape the API chose: an object for
 * one language, a list for several - the same rule `name` and `description`
 * already follow.
 */
export function normaliseDetailedDescription(
  raw: unknown,
): DetailedDescription | DetailedDescription[] | undefined {
  if (Array.isArray(raw)) {
    const list = raw
      .map(toDetailed)
      .filter((d): d is DetailedDescription => d !== undefined);
    return list.length ? list : undefined;
  }
  return toDetailed(raw);
}

/**
 * Google search results page for one entity. `kgmid` makes Google show the
 * knowledge panel of exactly that entity, so a hit can be checked by eye -
 * the API itself returns no link to the entity. MIDs only contain `/`, letters,
 * digits and `_`, which are all valid in a query string, so the link stays
 * readable rather than percent-encoded.
 */
export function googleSearchUrl(mid: string): string | undefined {
  return /^\/[mg]\/[0-9A-Za-z_]+$/.test(mid)
    ? `https://www.google.com/search?kgmid=${mid}`
    : undefined;
}

/**
 * Map one raw API result onto the tool's output. Shared by search and lookup
 * so both tools report the same fields.
 */
export function formatEntity(e: KnowledgeGraphEntity): EntityOutput {
  const rawMid = e['@id'] || '';
  const mid = rawMid.replace(/^kg:/, '');
  const image: any = Array.isArray(e.image) ? e.image[0] : e.image;

  return {
    mid,
    googleSearchUrl: googleSearchUrl(mid),
    name: e.name || '',
    type: Array.isArray(e['@type']) ? e['@type'] : [e['@type'] || 'Thing'],
    description: e.description || undefined,
    detailedDescription: normaliseDetailedDescription(e.detailedDescription),
    image: image?.contentUrl || undefined,
    imageSourceUrl: image?.url || undefined,
    imageLicense: image?.license || undefined,
    url: e.url || undefined,
    resultScore: e.resultScore || undefined,
  };
}
