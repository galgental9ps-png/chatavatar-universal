'use strict';
(async function () {
  const $ = id => document.getElementById(id), K = JimmyKnowledge;
  $('hero-magician').append(JimmyMascot.create());
  let pack, limit = 8, toastTimer;
  const instance = JimmyChatAvatar.instance;
  await instance.ready;
  if (!instance.pack) { $('knowledge-count').textContent = 'Parkwissen konnte nicht geladen werden'; $('question-grid').textContent = 'Bitte laden Sie die Seite erneut.'; return; }
  pack = instance.pack;
  $('knowledge-count').textContent = K.search(pack, '', { limit: 1500 }).length + ' hinterlegte Antworten';
  $('knowledge-date').textContent = pack.updatedAt.split('-').reverse().join('.');
  pack.categories.forEach(c => { const o = document.createElement('option'); o.value = c.id; o.textContent = c.label; $('knowledge-category').append(o); });
  function answer(id) { instance.open(); if (id) instance.answer(id); }
  document.querySelectorAll('[data-answer]').forEach(b => b.onclick = () => answer(b.dataset.answer));
  $('start-avatar').onclick = () => answer();
  $('walk-demo').onclick = () => {
    if (instance.paused) { instance.paused = false; instance.setState('idle'); }
    if (instance.hidden) { instance.hidden = false; instance.character.hidden = false; instance.launcher.hidden = true; }
    const max = Math.max(0, innerWidth - (innerWidth <= 540 ? 152 : 192) - 8);
    instance.walkTo(instance.x > max / 2 ? 8 : max);
  };
  function draw() {
    const results = K.search(pack, $('knowledge-search').value, { category: $('knowledge-category').value, limit: 1500 });
    $('question-grid').replaceChildren();
    for (const entry of results.slice(0,limit)) { const b = document.createElement('button'); b.className = 'question'; const text = document.createElement('span'), arrow = document.createElement('span'); text.textContent = entry.question; arrow.textContent = ''; b.append(text,arrow); b.onclick = () => answer(entry.id); $('question-grid').append(b); }
    if (!results.length) { const p = document.createElement('p'); p.className = 'empty-state'; p.textContent = pack.organization.fallback; $('question-grid').append(p); }
    $('load-more').hidden = results.length <= limit;
  }
  $('knowledge-search').oninput = $('knowledge-category').onchange = () => { limit = 8; draw(); };
  $('load-more').onclick = () => { limit += 12; draw(); }; draw();
  const defaultBase = 'https://galgental9ps-png.github.io/chatavatar-universal/';
  const base = location.protocol === 'file:' ? defaultBase : new URL('.', location.href).href;
  $('embed-code').textContent = '<script\n  src="' + base + 'avatar.js"\n  defer><' + '/script>';
  $('copy-code').onclick = async () => {
    try { await navigator.clipboard.writeText($('embed-code').textContent); $('copy-code').textContent = 'Kopiert ✓'; clearTimeout(toastTimer); $('toast').textContent = 'Einbindungscode kopiert.'; $('toast').hidden = false; toastTimer = setTimeout(() => { $('toast').hidden = true; $('copy-code').textContent = 'Kopieren ⧉'; }, 3000); }
    catch { const range = document.createRange(); range.selectNodeContents($('embed-code')); getSelection().removeAllRanges(); getSelection().addRange(range); $('copy-code').textContent = 'Mit Strg+C kopieren'; }
  };
})();
