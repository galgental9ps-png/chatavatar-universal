'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const K = require('../knowledge-core.js');
const { Publisher } = require('../github-publisher.js');
const raw = JSON.parse(fs.readFileSync(require.resolve('../knowledge/jimmys-funpark.json'), 'utf8'));
const data = () => K.validate(structuredClone(raw));

test('Jimmy package has valid references, official sources and a matching offline fallback', () => {
  const pack = data(); assert.equal(pack.entries.length, 84);
  for (const e of pack.entries) { assert.match(e.sourceUrl, /^https:\/\/www\.jimmys-funpark\.de\//); assert.equal(e.verifiedAt, '2026-11-22'); }
  const sandbox = {}; vm.runInNewContext(fs.readFileSync(require.resolve('../knowledge/jimmys-funpark.bundle.js'), 'utf8'), sandbox);
  assert.deepEqual(JSON.parse(JSON.stringify(sandbox.JimmyDefaultKnowledge)), pack);
});
test('Search finds accented topics and does not fabricate an answer for unrelated questions', () => {
  const p = data(); assert.equal(K.search(p, 'Öffnungszeiten')[0].id, 'zeiten'); assert.equal(K.search(p, 'oeffnungszeiten')[0].id, 'zeiten');
  assert.ok(K.search(p, 'Socken').some(e => e.id === 'socken')); assert.ok(K.search(p, 'Kindergeburtstag').some(e => e.id === 'geburtstag'));
  assert.deepEqual(K.search(p, 'Quantencomputer Raketenstart'), []);
});
test('Disabled, future and expired entries are never visitor suggestions', () => {
  const p = data(), entry = p.entries[0]; entry.enabled = false; assert.ok(!K.search(p, '', { limit: 1500 }).includes(entry));
  entry.enabled = true; entry.validFrom = '2027-01-01'; assert.equal(K.active(entry, '2026-11-15'), false);
  entry.validFrom = ''; entry.validUntil = '2026-11-14'; assert.equal(K.active(entry, '2026-11-15'), false);
  entry.validUntil = '2026-11-15'; assert.equal(K.active(entry, '2026-11-15'), true);
  entry.reviewAfter = '2026-11-14'; assert.equal(K.stale(entry, '2026-11-15'), true);
});
test('Validation rejects broken references, duplicate IDs, invalid dates and schema versions', () => {
  let p = data(); p.entries[0].suggestions.push('missing'); assert.throws(() => K.validate(p), /Unbekannte Folgefrage/);
  p = data(); p.entries[1].id = p.entries[0].id; assert.throws(() => K.validate(p), /doppelte/);
  p = data(); p.entries[0].verifiedAt = '2026-02-30'; assert.throws(() => K.validate(p), /Datum/);
  p = data(); p.schemaVersion = 2; assert.throws(() => K.validate(p), /schemaVersion/);
});
test('Untrusted links and extra properties cannot introduce executable content', () => {
  const p = data(); p.entries[0].links.push({ label: 'Bad', url: 'javascript:alert(1)' }); p.entries[0].sourceUrl = 'data:text/html,test';
  p.token = 'secret'; const out = K.validate(p); assert.equal(out.token, undefined); assert.equal(out.entries[0].sourceUrl, ''); assert.ok(!out.entries[0].links.some(l => l.url.startsWith('javascript:')));
  const bundled = K.bundle({ ...p, organization: { ...p.organization, greeting: '</script><script>alert(1)</script>' } }); assert.ok(!bundled.includes('</script>'));
});
test('Text/Markdown imports become disabled drafts with unique IDs', () => {
  const base = data(); const r = K.importText('## Neue Frage?\nEine geprüfte Antwort.\n\n## Zweite Frage?\nMehr Wissen.', 'wissen.md', base);
  assert.equal(r.count, 2); assert.equal(r.pack.entries.length, raw.entries.length + 2); assert.equal(r.pack.entries.at(-1).enabled, false); assert.equal(r.pack.entries.at(-1).verifiedAt, '');
  const repeated = K.importText('## Neue Frage?\nZweite Version.', 'wissen.md', r.pack); assert.equal(new Set(repeated.pack.entries.map(e => e.id)).size, raw.entries.length + 3);
  assert.throws(() => K.importText('x', 'dokument.pdf', base), /PDF/); assert.throws(() => K.importText('x'.repeat(K.MAX_BYTES + 1), 'wissen.txt', base), /4 MB/);
});
test('CSV handles Unicode, quotes, delimiters inside cells and multiline answers', () => {
  const r = K.importText('"Frage";"Antwort";"Quelle"\n"Was heißt das?";"Ein Satz; mit Komma, und \\"Zitat\\".";"https://example.org"'.replace(/\\"/g, '""'), 'daten.csv', data());
  assert.equal(r.count, 1); assert.match(r.pack.entries.at(-1).answer, /Ein Satz; mit Komma/);
  const rows = K.parseCsv('Frage,Antwort\n"Eine Frage?","Zeile 1\nZeile 2"'); assert.equal(rows[1][1], 'Zeile 1\nZeile 2');
});
function mockPublisher(remoteSha = 'initial') {
  const calls = [], pack = data();
  const fetcher = async (url, options) => {
    calls.push({ url, ...options }); let body;
    if (url.includes('/contents/')) body = { sha: remoteSha, encoding: 'base64', content: Buffer.from(JSON.stringify(pack)).toString('base64') };
    else if (url.includes('/git/ref/')) body = { object: { sha: 'head' } };
    else if (url.endsWith('/git/commits/head')) body = { tree: { sha: 'old-tree' } };
    else if (url.endsWith('/git/trees')) body = { sha: 'new-tree', tree: [{ path: 'knowledge/jimmys-funpark.json', sha: 'new-knowledge' }] };
    else if (url.endsWith('/git/commits')) body = { sha: 'new-commit' };
    else if (url.includes('/git/refs/')) body = { object: { sha: 'new-commit' } };
    else throw Error('Unexpected request: ' + url);
    return { ok: true, status: 200, json: async () => body };
  };
  return { publisher: new Publisher({ repo: 'owner/repo', token: 'test-token-1234', fetcher }), calls };
}
test('GitHub publish is one atomic commit for JSON and offline data, without forced branch updates', async () => {
  const { publisher, calls } = mockPublisher(); await publisher.load(); const pack = data(); await publisher.publish(pack, K.bundle(pack));
  const tree = JSON.parse(calls.find(c => c.url.endsWith('/git/trees')).body); assert.equal(tree.tree.length, 2); assert.deepEqual(tree.tree.map(e => e.path), ['knowledge/jimmys-funpark.json', 'knowledge/jimmys-funpark.bundle.js']);
  const update = calls.at(-1); assert.equal(update.method, 'PATCH'); assert.equal(JSON.parse(update.body).force, false); assert.equal(publisher.sha, 'new-knowledge');
  assert.ok(!tree.tree[0].content.includes('test-token-1234')); publisher.disconnect(); assert.equal(publisher.token, '');
});
test('Concurrent remote knowledge edits stop publication before any write', async () => {
  const { publisher, calls } = mockPublisher('changed-remote'); publisher.sha = 'old-sha'; await assert.rejects(() => publisher.publish(data(), K.bundle(data())), /seit dem Laden geändert/); assert.ok(calls.every(c => c.method === 'GET'));
});

