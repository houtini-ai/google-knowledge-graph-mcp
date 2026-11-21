// Offline tests for the entity mapping - no API key needed, they import the
// built dist/format.js directly. Run with `npm test` (builds first).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatEntity, normaliseDetailedDescription } from '../dist/format.js';

const single = {
  '@id': 'kg:/m/0dl567',
  '@type': ['Thing', 'Person'],
  name: 'Taylor Swift',
  description: 'Amerikanische Sängerin und Gitarristin',
  detailedDescription: {
    articleBody: 'Taylor Alison Swift ist eine US-amerikanische Sängerin.',
    url: 'https://de.wikipedia.org/wiki/Taylor_Swift',
    license: 'https://en.wikipedia.org/wiki/Wikipedia:Text_of_Creative_Commons_Attribution-ShareAlike_3.0_Unported_License',
  },
  image: { contentUrl: 'https://example.org/ts.jpg', url: 'https://commons.wikimedia.org/wiki/File:TS.jpg', license: 'http://creativecommons.org/licenses/by-sa/2.0' },
  url: 'http://www.taylorswift.com/',
  resultScore: 1234.5,
};

// Shape the API uses when more than one language is requested: every
// language-dependent field becomes a list, detailedDescription a list of
// objects tagged with inLanguage.
const multi = {
  ...single,
  name: [
    { '@language': 'de', '@value': 'Taylor Swift' },
    { '@language': 'en', '@value': 'Taylor Swift' },
  ],
  description: [
    { '@language': 'de', '@value': 'Amerikanische Sängerin und Gitarristin' },
    { '@language': 'en', '@value': 'American singer-songwriter' },
  ],
  detailedDescription: [
    { inLanguage: 'de', articleBody: 'Taylor Alison Swift ist eine US-amerikanische Sängerin.', url: 'https://de.wikipedia.org/wiki/Taylor_Swift', license: 'CC BY-SA 3.0' },
    { inLanguage: 'en', articleBody: 'Taylor Alison Swift is an American singer-songwriter.', url: 'https://en.wikipedia.org/wiki/Taylor_Swift', license: 'CC BY-SA 3.0' },
  ],
};

test('single language: detailed description keeps text, source url and licence', () => {
  const out = formatEntity(single);
  assert.equal(out.mid, '/m/0dl567');
  assert.deepEqual(out.detailedDescription, {
    language: undefined,
    articleBody: single.detailedDescription.articleBody,
    url: single.detailedDescription.url,
    license: single.detailedDescription.license,
  });
  assert.equal(out.image, 'https://example.org/ts.jpg');
  assert.equal(out.imageSourceUrl, 'https://commons.wikimedia.org/wiki/File:TS.jpg');
  assert.equal(out.imageLicense, 'http://creativecommons.org/licenses/by-sa/2.0');
});

test('several languages: detailed description is a list, one entry per language', () => {
  const out = formatEntity(multi);
  assert.ok(Array.isArray(out.detailedDescription), 'expected a list');
  assert.equal(out.detailedDescription.length, 2);
  assert.deepEqual(out.detailedDescription.map((d) => d.language), ['de', 'en']);
  assert.match(out.detailedDescription[1].articleBody, /American singer-songwriter/);
  assert.equal(out.detailedDescription[0].url, 'https://de.wikipedia.org/wiki/Taylor_Swift');
  assert.deepEqual(out.description, multi.description);
});

test('entity without any description stays without one', () => {
  const out = formatEntity({ '@id': 'kg:/g/11tmg04l98', '@type': ['Person', 'Thing'], name: 'David Wulf' });
  assert.equal(out.googleSearchUrl, 'https://www.google.com/search?kgmid=/g/11tmg04l98');
  assert.equal(out.description, undefined);
  assert.equal(out.detailedDescription, undefined);
  assert.equal(out.image, undefined);
});

test('google link only for well-formed MIDs', () => {
  assert.equal(formatEntity(single).googleSearchUrl, 'https://www.google.com/search?kgmid=/m/0dl567');
  assert.equal(formatEntity({ '@id': '' }).googleSearchUrl, undefined);
  assert.equal(formatEntity({ '@id': 'kg:/x/1 2&a=b' }).googleSearchUrl, undefined);
});

test('empty or malformed detailed descriptions are dropped, not emitted as empty objects', () => {
  assert.equal(normaliseDetailedDescription(undefined), undefined);
  assert.equal(normaliseDetailedDescription([]), undefined);
  assert.equal(normaliseDetailedDescription([{}, null, 'x']), undefined);
  assert.equal(normaliseDetailedDescription({ license: 'only a licence' }), undefined);
});
