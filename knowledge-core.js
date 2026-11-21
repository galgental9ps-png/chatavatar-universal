/* Chatavatar knowledge engine. No network calls, generated answers or dependencies. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.JimmyKnowledge = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const MAX_BYTES = 4 * 1024 * 1024;
  const clean = (v, n = 12000) => String(v == null ? '' : v).replace(/\u0000/g, '').trim().slice(0, n);
  const list = (v) => Array.isArray(v) ? v.map(x => clean(x, 200)).filter(Boolean).slice(0, 80) : [];
  const normalize = (s) => clean(s).toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
  const slug = s => normalize(s).replace(/ /g, '-').slice(0, 90) || 'eintrag';
  function safeUrl(value) {
    try { const u = new URL(clean(value, 2000)); return ['https:', 'http:', 'mailto:', 'tel:'].includes(u.protocol) ? u.href : ''; }
    catch { return ''; }
  }
  function date(value) {
    const s = clean(value, 10);
    if (!s) return '';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s) || Number.isNaN(Date.parse(s + 'T12:00:00Z')) || new Date(s + 'T12:00:00Z').toISOString().slice(0, 10) !== s) throw Error('Datum muss gültig und im Format JJJJ-MM-TT sein.');
    return s;
  }
  function validate(input) {
    if (!input || typeof input !== 'object' || Array.isArray(input)) throw Error('Ein Wissenspaket muss ein JSON-Objekt sein.');
    if (input.schemaVersion !== 1) throw Error('Unterstützt wird schemaVersion: 1.');
    if (!input.organization || !clean(input.organization.name, 200)) throw Error('Der Name der Organisation fehlt.');
    if (!Array.isArray(input.entries) || !input.entries.length || input.entries.length > 1500) throw Error('Das Paket braucht 1 bis 1500 Wissenseinträge.');
    const categories = (Array.isArray(input.categories) ? input.categories : []).map(c => ({ id: clean(c.id, 80), label: clean(c.label, 80), icon: clean(c.icon, 8) || '•' }));
    if (!categories.length || categories.some(c => !c.id || !c.label) || new Set(categories.map(c => c.id)).size !== categories.length) throw Error('Kategorien brauchen eindeutige IDs und Namen.');
    const ids = new Set(), cats = new Set(categories.map(c => c.id));
    const entries = input.entries.map((e, i) => {
      if (!e || typeof e !== 'object') throw Error('Ungültiger Eintrag ' + (i + 1));
      const id = clean(e.id, 100), question = clean(e.question, 220), answer = clean(e.answer);
      if (!id || ids.has(id)) throw Error('Fehlende oder doppelte Eintrags-ID: ' + (id || i + 1));
      ids.add(id);
      if (!question || !answer) throw Error('Frage und Antwort fehlen bei ' + id);
      if (!cats.has(e.category)) throw Error('Unbekannte Kategorie bei ' + id);
      const out = { id, category: clean(e.category, 80), question, answer, keywords: list(e.keywords), suggestions: list(e.suggestions), links: [], sourceUrl: safeUrl(e.sourceUrl), verifiedAt: date(e.verifiedAt), reviewAfter: date(e.reviewAfter), validFrom: date(e.validFrom), validUntil: date(e.validUntil), enabled: e.enabled !== false, priority: Math.max(0, Math.min(100, Number(e.priority) || 0)) };
      if (out.validFrom && out.validUntil && out.validFrom > out.validUntil) throw Error('Gültigkeitsende liegt vor dem Beginn bei ' + id);
      out.links = (Array.isArray(e.links) ? e.links : []).slice(0, 10).map(l => ({ label: clean(l.label, 100) || 'Mehr erfahren', url: safeUrl(l.url) })).filter(l => l.url);
      return out;
    });
    for (const e of entries) for (const id of e.suggestions) if (!ids.has(id)) throw Error('Unbekannte Folgefrage ' + id + ' bei ' + e.id);
    const org = input.organization, avatar = input.avatar || {};
    return { schemaVersion: 1, id: clean(input.id, 100) || slug(org.name), updatedAt: date(input.updatedAt), organization: { name: clean(org.name, 200), shortName: clean(org.shortName, 40) || clean(org.name, 40), website: safeUrl(org.website), greeting: clean(org.greeting, 1000) || 'Hallo! Wobei kann ich helfen?', fallback: clean(org.fallback, 1000) || 'Dazu habe ich noch keine hinterlegte Antwort. Bitte kontaktieren Sie die Organisation direkt.' }, avatar: { name: clean(avatar.name, 80) || 'Jimmy', subtitle: clean(avatar.subtitle, 120) || 'Dein digitaler Parkbegleiter', color: /^#[0-9a-f]{6}$/i.test(avatar.color) ? avatar.color : '#165dde' }, categories, suggested: list(input.suggested).filter(id => ids.has(id)), entries };
  }
  const todayBerlin = () => new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  const active = (e, today = todayBerlin()) => e.enabled !== false && (!e.validFrom || e.validFrom <= today) && (!e.validUntil || e.validUntil >= today);
  const stale = (e, today = todayBerlin()) => Boolean(e.reviewAfter && e.reviewAfter < today);
  const STOP = new Set('ich sie du die der das und oder ist sind ein eine einen einem einer im in zu zum zur von für fuer den dem des bitte habe haben hat gibt was wie wann wo kann man wir uns über ueber möchte moechte wissen'.split(' '));
  function search(pack, query, options = {}) {
    const q = normalize(query), tokens = q.split(' ').filter(x => x.length > 1 && !STOP.has(x));
    return pack.entries.filter(e => active(e, options.today) && (!options.category || e.category === options.category)).map(e => {
      if (!q) return { entry: e, score: e.priority };
      const title = normalize(e.question), tags = normalize(e.keywords.join(' ')), body = normalize(e.answer);
      let score = title === q ? 1000 : 0;
      if (title.includes(q)) score += 100;
      if (tags.includes(q)) score += 80;
      for (const t of tokens) score += (title.includes(t) ? 16 : 0) + (tags.includes(t) ? 13 : 0) + (body.includes(t) ? 2 : 0);
      return { entry: e, score };
    }).filter(r => !q || (tokens.length && r.score >= 5) || r.score >= 80).sort((a, b) => b.score - a.score || b.entry.priority - a.entry.priority || a.entry.question.localeCompare(b.entry.question, 'de')).slice(0, options.limit || 12).map(r => r.entry);
  }
  function parseCsv(text) {
    const rows = []; let row = [], cell = '', quoted = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (c === '"') { if (quoted && text[i + 1] === '"') { cell += '"'; i++; } else quoted = !quoted; }
      else if ((c === ',' || c === ';') && !quoted) { row.push(cell.trim()); cell = ''; }
      else if ((c === '\n' || c === '\r') && !quoted) { if (c === '\r' && text[i + 1] === '\n') i++; row.push(cell.trim()); if (row.some(Boolean)) rows.push(row); row = []; cell = ''; }
      else cell += c;
    }
    if (quoted) throw Error('Nicht geschlossenes Anführungszeichen in der CSV.');
    row.push(cell.trim()); if (row.some(Boolean)) rows.push(row);
    return rows;
  }
  function importText(text, filename, base) {
    if (typeof text !== 'string' || new TextEncoder().encode(text).length > MAX_BYTES) throw Error('Dateien dürfen maximal 4 MB groß sein.');
    text = text.replace(/^\uFEFF/, '').trim();
    if (!text) throw Error('Die Datei ist leer.');
    if (/\.json$/i.test(filename)) return { mode: 'replace', pack: validate(JSON.parse(text)) };
    const pack = validate(base), additions = [];
    if (/\.csv$/i.test(filename)) {
      const rows = parseCsv(text), header = (rows.shift() || []).map(normalize);
      const q = header.findIndex(x => ['frage', 'question'].includes(x)), a = header.findIndex(x => ['antwort', 'answer'].includes(x));
      const source = header.findIndex(x => ['quelle', 'sourceurl'].includes(x));
      if (q < 0 || a < 0) throw Error('Die CSV braucht Spalten Frage und Antwort.');
      for (const row of rows) if (row[q] && row[a]) additions.push({ question: row[q], answer: row[a], sourceUrl: row[source] || '' });
    } else if (/\.(md|txt|markdown)$/i.test(filename)) {
      let question = '', answer = [];
      const flush = () => { if (question && answer.join('\n').trim()) additions.push({ question, answer: answer.join('\n').trim() }); answer = []; };
      for (const line of text.split(/\r?\n/)) {
        const m = line.match(/^#{1,3}\s+(.+)$/);
        if (m) { flush(); question = m[1]; }
        else { if (!question) question = filename.replace(/\.[^.]+$/, ''); answer.push(line); }
      }
      flush();
    } else throw Error('Bitte JSON, Markdown (.md), Text (.txt) oder CSV verwenden. PDF/Word zuerst als Text exportieren.');
    if (!additions.length) throw Error('Keine Frage-Antwort-Einträge gefunden.');
    if (!pack.categories.some(c => c.id === 'import')) pack.categories.push({ id: 'import', label: 'Importierte Inhalte', icon: '↥' });
    const ids = new Set(pack.entries.map(e => e.id));
    for (const [i, e] of additions.entries()) {
      let id = 'import-' + slug(e.question), suffix = 1;
      while (ids.has(id)) id = 'import-' + slug(e.question) + '-' + suffix++;
      ids.add(id); pack.entries.push({ ...e, id, category: 'import', keywords: [], suggestions: [], links: [], verifiedAt: '', reviewAfter: '', enabled: false, priority: 0 });
    }
    return { mode: 'append', count: additions.length, pack: validate(pack) };
  }
  const bundle = pack => '/* Generated offline fallback; never put secrets in knowledge. */\nglobalThis.JimmyDefaultKnowledge = ' + JSON.stringify(validate(pack), null, 2).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029') + ';\n';
  return { MAX_BYTES, validate, normalize, slug, safeUrl, active, stale, search, importText, parseCsv, todayBerlin, bundle };
});

