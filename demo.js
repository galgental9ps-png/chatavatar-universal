'use strict';
(async function () {
  const $ = id => document.getElementById(id), K = JimmyKnowledge;
  let pack, limit = 8, toastTimer;
  const instance = JimmyChatAvatar.instance;
  await instance.ready;
  if (!instance.pack) { $('knowledge-count').textContent = 'Parkwissen konnte nicht geladen werden'; $('question-grid').textContent = 'Bitte laden Sie die Seite erneut.'; return; }
  const picker=$('asset-set'),assetStatus=$('asset-status');
  let heroFigure,heroRenderer;
  const drawHero=()=>{if(heroFigure)heroRenderer.paint(heroFigure);};
  function renderAsset(){
    const asset=instance.asset,name=instance.displayName();
    document.title=name+' · Atelier Chatavatar';
    document.querySelector('meta[name="description"]').content=name+' – dein animierter Chatavatar für Jimmy’s Fun Park mit Besuchsinfos, Geburtstagsplanung und eigenem Wissensstudio.';
    $('discover-title').textContent='Wobei '+(asset.plural?'dürfen ':'darf ')+name+' helfen?';
    document.querySelector('.knowledge-section .eyebrow').textContent=asset.plural?'UNSERE KLEINE WISSENSWELT':name.toUpperCase()+'S KLEINE WISSENSWELT';
    const invitation=document.querySelector('.invitation h2');invitation.replaceChildren(name+(asset.plural?' kommen':' kommt'),document.createElement('br'),'auch ');const emphasis=document.createElement('em');emphasis.textContent='zu euch.';invitation.append(emphasis);
    document.querySelector('.page-footer > span').textContent=name+' · Atelier Chatavatar · Parkwissen als Demo';
    $('hero-magician').dataset.asset=asset.id;
    heroRenderer=instance.renderer;heroFigure=heroRenderer.create();$('hero-magician').replaceChildren(heroFigure);
    drawHero();
    document.querySelector('.name-tag b').textContent=name;
    document.querySelector('.name-tag small').textContent=asset.role;
    const intro=document.querySelector('.intro');intro.replaceChildren();const strong=document.createElement('strong');strong.textContent=name;intro.append('Darf ich vorstellen? ',strong,'. '+asset.introduction+' Ein Klick auf die Figur genügt.');
    $('start-avatar').textContent=name+' ausprobieren';
    const dancer=instance.isDancer();
    $('walk-demo').textContent=dancer?'T-Steps':asset.plural?'Gemeinsam gleiten':name+(instance.isSkater()?' gleiten lassen':' eine Runde laufen lassen');
    $('hop-demo').textContent=dancer?'Kicks':asset.motion.duet?'Synchrone Pirouetten':instance.isSkater()?'Pirouette':name+' springen lassen';
    $('routine-demo').textContent=dancer?'Shuffle tanzen':asset.motion.duet?'Paartanz vorführen':'Kür vorführen';
    $('jump-demo').textContent=asset.motion.duet?'Aufeinander zuspringen':'Drehsprung';
    $('spiral-demo').textContent=dancer?'Slides':asset.motion.duet?'Gemeinsame Gleitfigur':'Gleitfigur';
    $('duet-demo').textContent=dancer?'Spins':'Synchronfolge vorführen';
    $('encore-demo').textContent=dancer?'Running Man':'Pirouetten & Umkreisen';
    $('duet-demo').hidden=!asset.motion.duet&&!dancer;
    $('encore-demo').hidden=!asset.motion.encore&&!dancer;
    $('quip-demo').textContent=dancer?'Ein Knochenwitz':instance.isSkater()?'Ein kleiner Gruß':'Ein Affenspruch';
    $('spiral-demo').hidden=!instance.isSkater()&&!dancer;
    $('routine-demo').hidden=!instance.isSkater()&&!dancer;
    $('jump-demo').hidden=!instance.isSkater();
    picker.value=asset.id;
  }
  for(const asset of Object.values(UniversalAvatarAssets.sets)){
    const option=document.createElement('option');option.value=asset.id;option.textContent=asset.name+' · '+asset.role;picker.append(option);
  }
  renderAsset();picker.disabled=false;
  window.addEventListener('resize',drawHero);
  instance.host.addEventListener('jimmy:asset-change',renderAsset);
  picker.addEventListener('change',async()=>{
    picker.disabled=true;picker.closest('.asset-switch').setAttribute('aria-busy','true');assetStatus.textContent='Figur wird geladen …';
    try{await instance.setAsset(picker.value);assetStatus.textContent=instance.displayName()+(instance.asset.plural?' sind jetzt da.':' ist jetzt da.');}
    catch(error){picker.value=instance.asset.id;assetStatus.textContent='Die Figur konnte nicht geladen werden. Bitte erneut versuchen.';}
    finally{picker.disabled=false;picker.closest('.asset-switch').removeAttribute('aria-busy');}
  });
  pack = instance.pack;
  $('knowledge-count').textContent = K.search(pack, '', { limit: 1500 }).length + ' hinterlegte Antworten';
  $('knowledge-date').textContent = pack.updatedAt.split('-').reverse().join('.');
  pack.categories.forEach(c => { const o = document.createElement('option'); o.value = c.id; o.textContent = c.label; $('knowledge-category').append(o); });
  function answer(id) { instance.open(); if (id) instance.answer(id); }
  document.querySelectorAll('[data-answer]').forEach(b => b.onclick = () => answer(b.dataset.answer));
  $('start-avatar').onclick = () => answer();
  function prepareDemo(moving = true) {
    if (moving && instance.motion.matches) {
      $('toast').textContent = 'Bewegungen sind in den Geräteeinstellungen reduziert. Die Figur bleibt deshalb ruhig.';
      $('toast').hidden = false;
      clearTimeout(toastTimer); toastTimer = setTimeout(() => { $('toast').hidden = true; }, 5000);
      return false;
    }
    if (moving && instance.paused) { instance.paused = false; instance.setState('idle'); }
    instance.opened = false; instance.panel.hidden = true; instance.character.setAttribute('aria-expanded', 'false');
    if (instance.hidden) { instance.hidden = false; instance.character.hidden = false; instance.launcher.hidden = true; }
    return true;
  }
  $('walk-demo').onclick = () => {
    if (!prepareDemo()) return;
    if(instance.isDancer()){instance.perform('t-step');return;}
    const max = Math.max(0, innerWidth - instance.size().width - 8);
    instance.walkTo(instance.x > max / 2 ? 8 : max,{style:instance.isSkater()?'speed':'auto'});
  };
  $('hop-demo').onclick = () => { if (prepareDemo()) instance.isSkater()?instance.spin():instance.hop(); };
  $('routine-demo').onclick=()=>{if(prepareDemo())instance.perform();};
  $('jump-demo').onclick=()=>{if(prepareDemo())instance.skateJump();};
  $('duet-demo').onclick=()=>{if(prepareDemo())instance.isDancer()?instance.spin():instance.duet();};
  $('encore-demo').onclick=()=>{if(prepareDemo())instance.isDancer()?instance.perform('running-man'):instance.encore();};
  $('spiral-demo').onclick=()=>{if(!prepareDemo())return;if(instance.isDancer()){instance.perform('slides');return;}const max=Math.max(0,innerWidth-instance.size().width-8);instance.walkTo(instance.x>max/2?8:max,{style:'spiral'});};
  $('quip-demo').onclick = () => { if (prepareDemo(false)) instance.showQuip('idle', { replace: true, userInitiated: true }); };
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
