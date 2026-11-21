'use strict';
(async function () {
  const K = JimmyKnowledge, $ = id => document.getElementById(id), DRAFT = 'jimmy-chatavatar-draft-v1';
  let pack, selected = '', preview, publisher = null, dirty = false, formDirty = false, toastTimer, oldDraft;
  const clone = value => JSON.parse(JSON.stringify(value));
  function toast(message, error = false) { clearTimeout(toastTimer); $('toast').textContent = message; $('toast').classList.toggle('error', error); $('toast').hidden = false; toastTimer = setTimeout(() => { $('toast').hidden = true; }, error ? 10000 : 5500); }
  function fail(err) { toast(err.message || String(err), true); }
  function download(name, data, type = 'application/json') { const url = URL.createObjectURL(new Blob([data], { type: type + ';charset=utf-8' })), a = document.createElement('a'); a.href = url; a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(url), 2000); }
  function saveDraft() {
    pack.updatedAt = K.todayBerlin(); dirty = true;
    try { localStorage.setItem(DRAFT, JSON.stringify(pack)); $('save-status').textContent = 'Im Browser gespeichert'; }
    catch { $('save-status').textContent = 'Nur im Arbeitsspeicher'; toast('Der Browser kann den Entwurf nicht speichern. Bitte JSON exportieren.', true); }
    if (preview?.pack) preview.setKnowledge(pack);
  }
  try { oldDraft = localStorage.getItem(DRAFT); } catch { /* Private browsing may block persistence. */ }
  try {
    if (location.protocol === 'file:') pack = K.validate(JimmyDefaultKnowledge);
    else { const r = await fetch('knowledge/jimmys-funpark.json', { cache: 'no-cache', signal: AbortSignal.timeout(12000) }); if (!r.ok) throw Error('HTTP ' + r.status); pack = K.validate(await r.json()); }
  } catch (err) { pack = K.validate(JimmyDefaultKnowledge); $('startup-warning').hidden = false; $('startup-warning').textContent = 'Der veröffentlichte Stand konnte nicht geladen werden (' + err.message + '). Angezeigt wird das mitgelieferte Offlinepaket. Bitte vor dem Veröffentlichen den aktuellen Stand von GitHub laden.'; }
  if (oldDraft) $('draft-banner').hidden = false;
  selected = pack.entries[0].id;
  const titles = { knowledge: 'Wissensdaten', import: 'Wissen hochladen', organization: 'Organisation & Figur', github: 'GitHub-Zugang', embed: 'In HTML einbinden' };
  function tab(name) { if (!titles[name]) name = 'knowledge'; document.querySelectorAll('[data-view]').forEach(e => { e.hidden = e.dataset.view !== name; }); document.querySelectorAll('[data-tab]').forEach(e => e.classList.toggle('active', e.dataset.tab === name)); $('view-title').textContent = titles[name]; history.replaceState(null, '', '#' + name); if (name === 'organization') renderOrganization(); if (name === 'embed') renderEmbed(); }
  document.querySelectorAll('[data-tab]').forEach(b => { b.onclick = () => tab(b.dataset.tab); }); document.querySelectorAll('[data-goto]').forEach(b => { b.onclick = () => tab(b.dataset.goto); });
  function option(value, text, chosen = false) { const o = document.createElement('option'); o.value = value; o.textContent = text; o.selected = chosen; return o; }
  function renderList() {
    const category = $('category-filter').value, query = K.normalize($('entry-search').value), list = $('entry-list'); list.replaceChildren();
    const entries = pack.entries.filter(e => (!category || e.category === category) && (!query || K.normalize(e.question + ' ' + e.answer + ' ' + e.keywords.join(' ')).includes(query)));
    for (const e of entries) {
      const b = document.createElement('button'); b.className = 'entry-item' + (e.id === selected ? ' active' : ''); b.type = 'button'; b.setAttribute('aria-pressed', String(e.id === selected));
      const title = document.createElement('strong'); title.textContent = e.question; const small = document.createElement('small'); small.textContent = (e.enabled ? '' : 'Entwurf · ') + (pack.categories.find(c => c.id === e.category)?.label || e.category); if (!e.enabled) small.className = 'draft'; b.append(title, small);
      b.onclick = () => { if (formDirty && !confirm('Nicht gespeicherte Formularänderungen verwerfen?')) return; selected = e.id; renderList(); renderForm(); }; list.append(b);
    }
    if (!entries.length) { const p = document.createElement('p'); p.className = 'empty-list'; p.textContent = 'Keine passenden Einträge.'; list.append(p); }
  }
  function render() {
    $('total-count').textContent = pack.entries.length; $('side-count').textContent = pack.entries.length; $('active-count').textContent = pack.entries.filter(e => K.active(e)).length; $('review-count').textContent = pack.entries.filter(e => !e.verifiedAt || K.stale(e)).length;
    const value = $('category-filter').value; $('category-filter').replaceChildren(option('', 'Alle Kategorien'), ...pack.categories.map(c => option(c.id, c.label, c.id === value)));
    if (!pack.entries.some(e => e.id === selected)) selected = pack.entries[0].id;
    renderList(); renderForm(); renderOrganization();
  }
  function addLink(link = {}) {
    const row = document.createElement('div'); row.className = 'link-row';
    const label = document.createElement('input'); label.className = 'field'; label.placeholder = 'Buttontext'; label.value = link.label || ''; label.maxLength = 100; label.setAttribute('aria-label', 'Linkbeschriftung');
    const url = document.createElement('input'); url.className = 'field'; url.type = 'url'; url.placeholder = 'https://…'; url.value = link.url || ''; url.setAttribute('aria-label', 'Linkziel');
    const remove = document.createElement('button'); remove.type = 'button'; remove.textContent = '×'; remove.setAttribute('aria-label', 'Link entfernen'); remove.onclick = () => { row.remove(); formDirty = true; };
    label.oninput = url.oninput = () => { formDirty = true; }; row.append(label, url, remove); $('entry-links').append(row);
  }
  function renderForm() {
    const e = pack.entries.find(e => e.id === selected); if (!e) return;
    const form = $('entry-form'), f = form.elements; form.reset(); $('entry-id').textContent = e.id;
    for (const key of ['question', 'answer', 'sourceUrl', 'verifiedAt', 'reviewAfter', 'validFrom', 'validUntil', 'priority']) f[key].value = e[key] || (key === 'priority' ? 0 : '');
    f.keywords.value = e.keywords.join(', '); f.category.replaceChildren(...pack.categories.map(c => option(c.id, c.label, c.id === e.category)));
    f.suggestions.replaceChildren(...pack.entries.filter(x => x.id !== e.id).map(x => option(x.id, x.question, e.suggestions.includes(x.id))));
    f.enabled.checked = e.enabled; f.featured.checked = pack.suggested.includes(e.id); $('entry-links').replaceChildren(); e.links.forEach(addLink); formDirty = false;
  }
  function collectEntry() {
    const form = $('entry-form'); if (!form.reportValidity()) throw Error('Bitte die markierten Felder prüfen.');
    const old = pack.entries.find(e => e.id === selected), f = form.elements;
    const result = { ...old, question: f.question.value, answer: f.answer.value, category: f.category.value, priority: Number(f.priority.value), keywords: f.keywords.value.split(',').map(s => s.trim()).filter(Boolean), suggestions: [...f.suggestions.selectedOptions].map(o => o.value), enabled: f.enabled.checked, links: [] };
    for (const key of ['sourceUrl', 'verifiedAt', 'reviewAfter', 'validFrom', 'validUntil']) result[key] = f[key].value;
    for (const row of $('entry-links').children) { const [label, url] = row.querySelectorAll('input'); if (url.value.trim()) { if (!K.safeUrl(url.value)) throw Error('Links brauchen ein gültiges HTTP(S)-, E-Mail- oder Telefonziel.'); result.links.push({ label: label.value || 'Mehr erfahren', url: url.value }); } }
    const next = clone(pack); next.entries = next.entries.map(e => e.id === selected ? result : e); next.suggested = next.suggested.filter(id => id !== selected); if (f.featured.checked) next.suggested.push(selected);
    return K.validate(next);
  }
  $('entry-form').oninput = () => { formDirty = true; $('save-status').textContent = 'Formular noch ungespeichert'; };
  $('entry-form').onsubmit = e => { e.preventDefault(); try { pack = collectEntry(); formDirty = false; saveDraft(); render(); toast('Antwort im Browser gespeichert. Für alle Einbindungen anschließend auf GitHub speichern.'); } catch (err) { fail(err); } };
  $('add-link').onclick = () => { if ($('entry-links').children.length >= 10) return toast('Maximal zehn Links je Antwort.', true); addLink(); formDirty = true; };
  $('entry-search').oninput = renderList; $('category-filter').onchange = renderList;
  $('new-entry').onclick = () => {
    if (formDirty && !confirm('Nicht gespeicherte Formularänderungen verwerfen?')) return;
    let id = 'neu-' + Date.now(); selected = id;
    pack.entries.unshift({ id, category: pack.categories[0].id, question: 'Ihre neue Frage?', answer: 'Hier Ihre geprüfte Antwort eintragen.', keywords: [], suggestions: [], links: [], sourceUrl: '', verifiedAt: '', reviewAfter: '', validFrom: '', validUntil: '', enabled: false, priority: 0 }); saveDraft(); render(); $('entry-form').elements.question.focus();
  };
  $('delete-entry').onclick = () => { if (pack.entries.length === 1) return toast('Mindestens ein Eintrag muss erhalten bleiben.', true); if (!confirm('Diesen Wissenseintrag im Browserentwurf löschen?')) return; pack.entries = pack.entries.filter(e => e.id !== selected).map(e => ({ ...e, suggestions: e.suggestions.filter(id => id !== selected) })); pack.suggested = pack.suggested.filter(id => id !== selected); selected = pack.entries[0].id; saveDraft(); render(); };
  async function getPreview() { if (!preview) { preview = JimmyChatAvatar.create({ knowledge: pack, id: 'studio-avatar' }); await preview.ready; } return preview; }
  $('open-preview').onclick = async () => { if (formDirty) toast('Die Vorschau zeigt den gespeicherten Entwurf. Für die aktuelle Formularantwort „Antwort testen“ verwenden.'); const p = await getPreview(); p.setKnowledge(pack); p.open(); };
  $('test-entry').onclick = async () => { try { const temp = collectEntry(); temp.entries.find(e => e.id === selected).enabled = true; const p = await getPreview(); p.setKnowledge(temp); p.open(); p.answer(selected); } catch (err) { fail(err); } };
  const exported = () => { if (formDirty) toast('Exportiert wird der gespeicherte Entwurf. Aktuelle Formularänderungen bitte zuerst speichern.'); download('jimmys-funpark.json', JSON.stringify(K.validate(pack), null, 2) + '\n'); };
  $('export-knowledge').onclick = exported;
  $('restore-draft').onclick = () => { try { pack = K.validate(JSON.parse(oldDraft)); selected = pack.entries[0].id; $('draft-banner').hidden = true; dirty = true; render(); toast('Browserentwurf wiederhergestellt.'); } catch (err) { fail(err); } };
  $('discard-draft').onclick = () => { try { localStorage.removeItem(DRAFT); } catch { /* no-op */ } $('draft-banner').hidden = true; oldDraft = null; };
  async function importFiles(files) {
    try {
      let next = clone(pack); const names = [];
      for (const file of files) {
        if (file.size > K.MAX_BYTES) throw Error(file.name + ': maximal 4 MB erlaubt.');
        const text = await file.text(); const result = K.importText(text, file.name, next);
        if (result.mode === 'replace' && !confirm(file.name + ' ersetzt den aktuellen Browserentwurf. Fortfahren?')) return;
        next = result.pack; names.push(file.name);
      }
      pack = K.validate(next); selected = pack.entries[0].id; saveDraft(); render(); tab('knowledge'); toast('Importiert: ' + names.join(', ') + '. Neue Texteinträge bitte prüfen und aktivieren.');
    } catch (err) { fail(err); }
    finally { $('import-file').value = ''; }
  }
  $('import-file').onchange = e => importFiles([...e.target.files]);
  $('drop-zone').ondragover = e => e.preventDefault(); $('drop-zone').ondrop = e => { e.preventDefault(); importFiles([...e.dataTransfer.files]); };
  $('load-raw').onclick = () => { $('raw-json').value = JSON.stringify(pack, null, 2); };
  $('apply-raw').onclick = () => { try { const result = K.importText($('raw-json').value, 'wissen.json', pack); if (!confirm('Der JSON-Inhalt ersetzt den aktuellen Browserentwurf. Fortfahren?')) return; pack = result.pack; selected = pack.entries[0].id; saveDraft(); render(); toast('JSON-Paket übernommen.'); } catch (err) { fail(err); } };
  function renderOrganization() { if (!pack) return; const f = $('organization-form').elements; for (const key of ['name', 'shortName', 'website', 'greeting', 'fallback']) f[key].value = pack.organization[key]; f.avatarName.value = pack.avatar.name; f.subtitle.value = pack.avatar.subtitle; f.color.value = pack.avatar.color; }
  $('organization-form').onsubmit = e => { e.preventDefault(); try { const f = e.target.elements, next = clone(pack); for (const key of ['name', 'shortName', 'website', 'greeting', 'fallback']) next.organization[key] = f[key].value; next.avatar = { name: f.avatarName.value, subtitle: f.subtitle.value, color: f.color.value }; pack = K.validate(next); saveDraft(); render(); toast('Organisation im Browser gespeichert.'); } catch (err) { fail(err); } };
  $('new-category-form').onsubmit = e => { e.preventDefault(); const label = e.target.elements.label.value.trim(); if (!label) return; let id = K.slug(label), suffix = 1; while (pack.categories.some(c => c.id === id)) id = K.slug(label) + '-' + suffix++; pack.categories.push({ id, label, icon: '✦' }); saveDraft(); render(); e.target.reset(); toast('Kategorie hinzugefügt.'); };
  $('github-form').onsubmit = async e => {
    e.preventDefault();
    if ((dirty || formDirty) && !confirm('Der aktuelle GitHub-Stand ersetzt den angezeigten Entwurf. Vorher bei Bedarf JSON exportieren. GitHub jetzt laden?')) return;
    const token = $('github-token').value; $('github-token').value = ''; const button = e.target.querySelector('[type=submit]'); button.disabled = true;
    let candidate;
    try {
      candidate = new JimmyGitHub.Publisher({ repo: $('github-repo').value.trim(), branch: $('github-branch').value.trim(), token });
      const next = K.validate(await candidate.load()); publisher?.disconnect(); publisher = candidate; pack = next; selected = pack.entries[0].id; dirty = false; formDirty = false; render(); $('save-status').textContent = 'GitHub-Stand geladen'; $('publish-github').disabled = false; $('github-status').textContent = 'Verbunden mit ' + publisher.repo + ' · ' + publisher.branch + '. Der aktuelle GitHub-Stand ist geladen.'; toast('GitHub-Verbindung hergestellt. Wissensdaten können jetzt zentral gespeichert werden.');
    } catch (err) { candidate?.disconnect(); fail(err); }
    finally { button.disabled = false; }
  };
  $('disconnect-github').onclick = () => { publisher?.disconnect(); publisher = null; $('github-token').value = ''; $('publish-github').disabled = true; $('github-status').textContent = 'Getrennt. Kein GitHub-Zugangstoken gespeichert.'; };
  $('publish-github').onclick = async () => {
    if (!publisher) return;
    if (formDirty) return toast('Bitte zuerst die Formularänderungen im Browser speichern.', true);
    const button = $('publish-github'); button.disabled = true; const connected = publisher;
    try {
      const snapshot = K.validate(clone(pack)); snapshot.updatedAt = K.todayBerlin();
      $('github-status').textContent = 'Wissensdaten werden auf GitHub gespeichert …';
      const result = await connected.publish(snapshot, K.bundle(snapshot));
      if (JSON.stringify(pack.entries) === JSON.stringify(snapshot.entries)) { dirty = false; $('save-status').textContent = 'Auf GitHub gespeichert'; }
      const link = document.createElement('a'); link.href = result.url; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = 'Commit ansehen ↗'; $('github-status').replaceChildren(document.createTextNode('Auf GitHub gespeichert. GitHub Pages muss die Änderung noch veröffentlichen. '), link); toast('Auf GitHub gespeichert. Nach dem Pages-Deployment Webseiten neu laden.');
    } catch (err) { $('github-status').textContent = err.message; fail(err); }
    finally { button.disabled = !publisher; }
  };
  function renderEmbed() {
    try {
      const value = $('embed-base').value.trim(), url = new URL(value.endsWith('/') ? value : value + '/');
      if (!['https:', 'http:'].includes(url.protocol)) throw Error();
      const base = url.href.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
      $('embed-snippet').textContent = '<script src="' + base + 'avatar.js" defer><' + '/script>';
      $('embed-custom').textContent = '<script src="' + base + 'avatar.js"\n  data-knowledge="https://ihre-domain.de/wissen/firma.json"\n  defer><' + '/script>';
    } catch { $('embed-snippet').textContent = 'Bitte eine gültige HTTP(S)-Basisadresse eingeben.'; }
  }
  $('embed-base').oninput = renderEmbed;
  if (location.protocol !== 'file:') $('embed-base').value = new URL('.', location.href).href;
  $('copy-embed').onclick = async () => { try { await navigator.clipboard.writeText($('embed-snippet').textContent); toast('Einbindungscode kopiert.'); } catch { const range = document.createRange(); range.selectNodeContents($('embed-snippet')); getSelection().removeAllRanges(); getSelection().addRange(range); toast('Code markiert. Mit Strg+C kopieren.'); } };
  window.addEventListener('beforeunload', e => { if (formDirty) { e.preventDefault(); e.returnValue = ''; } publisher?.disconnect(); });
  render(); tab(location.hash.slice(1) || 'knowledge');
})();

