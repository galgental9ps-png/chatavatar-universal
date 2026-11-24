/* Chatavatar: one script, a walking mascot, curated knowledge. */
(function () {
  'use strict';
  if (window.JimmyChatAvatar) return;
  const script = document.currentScript;
  const BASE = new URL('.', script.src).href;
  const VERSION = 'avatar-worlds-25';
  const deps = new Map();
  function loadScript(url) {
    if (!deps.has(url)) deps.set(url, new Promise((resolve, reject) => { const s = document.createElement('script'); s.src = url; s.onload = resolve; s.onerror = () => reject(Error('Datei konnte nicht geladen werden: ' + url)); document.head.append(s); }));
    return deps.get(url);
  }
  const assetReady = window.UniversalAvatarAssets ? Promise.resolve() : loadScript(BASE + 'asset-sets.js?v=' + VERSION);
  const engineReady = assetReady.then(() => Promise.all([
    window.JimmyKnowledge ? Promise.resolve() : loadScript(BASE + 'knowledge-core.js'),
    window.JimmyMotion ? Promise.resolve() : loadScript(BASE + 'motion-core.js?v=' + VERSION),
    window.UniversalSkating ? Promise.resolve() : loadScript(BASE + 'skating-core.js?v=' + VERSION),
    window.UniversalShuffle ? Promise.resolve() : loadScript(BASE + 'shuffle-core.js?v=' + VERSION),
    window.JimmyMascot ? Promise.resolve() : loadScript(BASE + 'mascot.js?v=' + VERSION),
    window.JimmyPersonality ? Promise.resolve() : loadScript(BASE + 'personality-core.js?v=' + VERSION)
  ]));
  function el(tag, cls, text) { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  class Mascot {
    constructor(options = {}) {
      this.options = options; this.x = Math.max(8, innerWidth - 210); this.y = 10; this.state = 'idle'; this.facing = 1; this.opened = false; this.paused = false; this.voice = false; this.hidden = false; this.destroyed = false; this.category = ''; this.timers = new Set(); this.frame = 0; this.walkDistance = 0; this.velocity = 0; this.fallVelocity = 0; this.nextWalk = performance.now() + 4500; this.nextHop = performance.now() + 12000 + Math.random() * 5000; this.nextQuip = performance.now() + 9500; this.nextGesture = performance.now() + 9000 + Math.random() * 5000; this.jumpElapsed = 0; this.last = 0; this.stateUntil = Infinity;
      this.asset=window.UniversalAvatarAssets?.active;this.stateStarted=performance.now();this.skateTrips=0;this.skateStyle='glide';
      this.program=null;this.programElapsed=0;this.programFrame=null;this.nextRoutine=performance.now()+3500;
      this.motion = matchMedia('(prefers-reduced-motion: reduce)');
      this.onMotion = () => { this.paused = this.motion.matches; this.settleJump(); this.hideTip(); this.setState('idle'); this.render(); };
      this.motion.addEventListener('change', this.onMotion); this.paused = this.motion.matches;
      this.host = el('div'); this.host.id = options.id || 'jimmy-widget'; this.shadow = this.host.attachShadow({ mode: 'open' });
      for (const file of ['avatar.css', 'mascot.css']) { const css = el('link'); css.rel = 'stylesheet'; css.href = BASE + file + '?v=' + VERSION; this.shadow.append(css); }
      this.character = el('button', 'character'); this.character.type = 'button'; this.character.setAttribute('aria-label', 'Parkbegleiter öffnen. Zum Versetzen ziehen.'); this.character.setAttribute('aria-expanded', 'false');
      this.sprite = el('span', 'sprite'); this.sprite.setAttribute('aria-hidden', 'true'); this.character.append(this.sprite);
      this.tip = el('button', 'tip'); this.tip.hidden = true;
      this.panel = el('section', 'panel'); this.panel.hidden = true; this.panel.setAttribute('role', 'region'); this.panel.setAttribute('aria-label', 'Antworten von Jimmy');
      this.launcher = el('button', 'launcher', 'Parkbegleiter rufen'); this.launcher.hidden = true;
      this.shadow.append(this.tip, this.character, this.panel, this.launcher); document.body.append(this.host);
      this.tip.addEventListener('click', () => { const entry=this.tipEntry;this.open();if(entry)this.answer(entry); });
      this.launcher.addEventListener('click', () => { this.hidden = false; this.launcher.hidden = true; this.character.hidden = false; this.open(); });
      this.onKey = e => { if (e.key === 'Escape' && this.opened) this.close(); };
      this.onResize = () => { this.cancelProgram();if(this.asset?.motion.groundInset&&!this.drag&&['idle','walk','skate-stop'].includes(this.state))this.y=this.size().ground;this.position(); }; this.onVisibility = () => { this.last = 0; };
      document.addEventListener('keydown', this.onKey); window.addEventListener('resize', this.onResize); document.addEventListener('visibilitychange', this.onVisibility);
      this.bindDrag(); this.position(); this.ready = this.init();
      this.tick = this.tick.bind(this); this.raf = requestAnimationFrame(this.tick);
    }
    later(fn, delay) { const id = setTimeout(() => { this.timers.delete(id); if (!this.destroyed) fn(); }, delay); this.timers.add(id); return id; }
    cancelLater(id) { if (id == null) return; clearTimeout(id); this.timers.delete(id); }
    async init() {
      try {
        await engineReady; if (this.destroyed) return;
        this.asset=window.UniversalAvatarAssets.active;
        this.y=this.size().ground;
        this.host.dataset.asset=this.character.dataset.asset=this.asset.id;
        this.renderer=window.JimmyMascot.forAsset?.(this.asset.id)||window.JimmyMascot;
        await this.renderer.preload(); if (this.destroyed) return;
        this.quips = window.JimmyPersonality.createDeck(Math.random,this.asset.personality);
        this.visual = this.renderer.create(this.asset.master?.actors?0:undefined); this.sprite.replaceChildren(this.visual); this.preparePartner();this.drawFrame();
        this.position();
        const K = window.JimmyKnowledge; let data = this.options.knowledge;
        if (!data) {
          if (location.protocol === 'file:' && !this.options.knowledgeUrl) {
            if (!window.JimmyDefaultKnowledge) await loadScript(BASE + 'knowledge/jimmys-funpark.bundle.js');
            data = window.JimmyDefaultKnowledge; this.offline = true;
          } else {
            const url = this.options.knowledgeUrl || BASE + 'knowledge/jimmys-funpark.json';
            const response = await fetch(url, { cache: 'no-cache', credentials: 'omit', signal: AbortSignal.timeout(12000) });
            if (!response.ok) throw Error('Wissensdaten nicht erreichbar (HTTP ' + response.status + ').');
            const raw = await response.text(); if (raw.length > K.MAX_BYTES) throw Error('Wissenspaket ist zu groß.'); data = JSON.parse(raw);
          }
        }
        if (this.destroyed) return;
        this.setKnowledge(data); this.greetingTimer = this.later(() => this.showTip(), 1800); return this;
      } catch (err) {
        if (this.destroyed) return;
        this.character.hidden = true; this.tip.hidden = true;
        this.error = el('div', 'error'); this.error.append(el('strong', '', 'Die Figur konnte nicht starten'), el('p', '', err.message));
        const close = el('button', 'back', 'Schließen'); close.onclick = () => this.destroy(); this.error.append(close); this.shadow.append(this.error);
        this.host.dispatchEvent(new CustomEvent('jimmy:error', { detail: { message: err.message }, bubbles: true }));
      }
    }
    setKnowledge(input) {
      this.pack = window.JimmyKnowledge.validate(input); this.host.style.setProperty('--ca-blue', this.pack.avatar.color); this.category = ''; this.current = '';
      this.character.setAttribute('aria-label', this.displayName() + ' öffnen. Zum Versetzen ziehen.'); this.launcher.textContent = this.displayName() + ' rufen';
      this.panel.setAttribute('aria-label','Antworten von '+this.displayName());
      if (this.error) { this.error.remove(); this.error = null; this.character.hidden = this.hidden; }
      this.render(); this.host.dispatchEvent(new CustomEvent('jimmy:ready', { bubbles: true })); return this;
    }
    displayName(){return this.asset?.name||this.pack?.avatar.name||'Chatavatar';}
    async setAsset(id){
      await this.ready;
      const asset=window.UniversalAvatarAssets.get(id),request=this.assetRequest=(this.assetRequest||0)+1;
      if(this.destroyed||asset===this.asset)return false;
      if(!this.pack)throw Error('Die Figur ist noch nicht bereit.');
      const renderer=window.JimmyMascot.forAsset(asset.id);
      await renderer.preload();
      if(this.destroyed||request!==this.assetRequest)return false;
      this.settleJump();this.timers.forEach(clearTimeout);this.timers.clear();this.hideTip();
      if(this.voice&&'speechSynthesis' in window)speechSynthesis.cancel();
      this.asset=asset;this.renderer=renderer;this.quips=window.JimmyPersonality.createDeck(Math.random,asset.personality);
      this.drag=null;this.frame=0;this.walkDistance=0;this.velocity=0;this.fallVelocity=0;this.targetX=this.x;this.y=this.size().ground;
      this.host.dataset.asset=this.character.dataset.asset=asset.id;
      this.visual=renderer.create(asset.master?.actors?0:undefined);this.sprite.replaceChildren(this.visual);this.preparePartner();
      this.character.setAttribute('aria-label',asset.name+' öffnen. Zum Versetzen ziehen.');this.launcher.textContent=asset.name+' rufen';
      this.panel.setAttribute('aria-label','Antworten von '+asset.name);
      const now=performance.now();this.nextRoutine=now+3500;this.nextWalk=now+4500;this.nextHop=now+12000;this.nextGesture=now+9000;this.nextQuip=now+9500;
      this.setState('idle');this.position();this.drawFrame();this.render();
      this.host.dispatchEvent(new CustomEvent('jimmy:asset-change',{detail:{id:asset.id},bubbles:true}));
      return true;
    }
    isSkater(){return this.asset?.motion.kind==='ice';}
    isDancer(){return this.asset?.motion.kind==='shuffle';}
    programEngine(){return this.isDancer()?window.UniversalShuffle:window.UniversalSkating;}
    preparePartner(){
      if(!this.asset?.motion.duet){if(this.partner)this.partner.hidden=true;return;}
      if(!this.partner){
        this.partner=el('button','character duet-partner');this.partner.type='button';this.partner.hidden=true;
        this.partner.setAttribute('aria-expanded','false');
        this.partnerSprite=el('span','sprite');this.partnerSprite.setAttribute('aria-hidden','true');
        this.partner.append(this.partnerSprite);this.shadow.append(this.partner);this.bindDrag(this.partner);
      }
      this.partner.setAttribute('aria-label',(this.asset.master?.actors[1]?.name||this.displayName())+' öffnen. Zum Versetzen ziehen.');
      this.partner.dataset.asset=this.asset.id;this.partnerVisual=this.renderer.create(1);this.partnerSprite.replaceChildren(this.partnerVisual);
      this.partner.hidden=this.hidden;
    }
    size(){return window.JimmyMotion?window.JimmyMotion.dimensions(innerWidth,this.asset?.motion,innerHeight):{width:innerWidth<=540?152:192,height:innerWidth<=540?152:192,ground:10};}
    bindDrag(character=this.character) {
      character.addEventListener('pointerdown', e => {
        if (e.button !== 0) return;
        this.drag = { pointer: e.pointerId, startX: e.clientX, startY: e.clientY, x: this.x, y: this.y, moved: false }; character.setPointerCapture(e.pointerId);
      });
      character.addEventListener('pointermove', e => {
        if (!this.drag || e.pointerId !== this.drag.pointer) return;
        const dx = e.clientX - this.drag.startX, dy = e.clientY - this.drag.startY;
        if (Math.hypot(dx, dy) > 6) this.drag.moved = true;
        if (this.drag.moved) { this.cancelProgram(false);this.setState('held'); this.hideTip(); this.x = this.drag.x + dx; this.y = this.drag.y - dy; this.position(); }
      });
      const release = e => {
        if (!this.drag || e.pointerId !== this.drag.pointer) return;
        this.ignoreClick = this.drag.moved; const moved = this.drag.moved; this.drag = null; this.fallVelocity = 0; this.velocity = 0;
        this.setState(moved && this.y > this.size().ground ? 'fall' : 'idle'); this.nextWalk = performance.now() + 5500;this.nextRoutine=this.nextWalk;
      };
      character.addEventListener('pointerup', release); character.addEventListener('pointercancel', release);character.addEventListener('lostpointercapture',release);
      character.addEventListener('click', () => { if (this.ignoreClick) { this.ignoreClick = false; return; } this.opened ? this.close() : this.open(); });
    }
    setState(state) {
      if (state !== this.state) { this.state = state; this.frame = 0; this.stateStarted = performance.now(); }
      const durations = { wave: 1300, talk: 3200, point: 1600, think: 3000, celebrate: 1800, land: 220, rest: 4500,spin:this.asset?.motion.spinDuration||2750,'skate-stop':this.asset?.motion.stopDuration||420 };
      this.stateUntil = durations[state] ? performance.now() + durations[state] : Infinity;
      this.character.dataset.state = state; this.drawFrame();
    }
    drawFrame() {
      const actors=this.actorPositions();
      const details={elapsed:Math.max(0,performance.now()-this.stateStarted)/1000,frozen:this.paused||this.motion.matches,style:this.skateStyle,selection:this.programFrame,remaining:Math.abs((this.targetX??this.x)-this.x)/Math.max(1,this.size().speed)};
      if (this.visual) this.renderer.paint(this.visual, this.state, this.motion.matches ? 0 : this.frame,actors?actors[0].facing:this.facing,{...details,...(actors?{actor:0,selection:actors[0].selection||details.selection}:{})});
      if(this.partner){
        this.partner.hidden=!actors||this.hidden;
        if(actors&&this.partnerVisual)this.renderer.paint(this.partnerVisual,this.state,this.frame,actors[1].facing,{...details,actor:1,selection:actors[1].selection||details.selection});
        this.partner.dataset.state=this.state;this.partner.dataset.paused=String(this.paused);
      }
      this.character.dataset.paused = String(this.paused);
    }
    actorPositions(){
      if(!this.asset?.motion.duet)return null;
      return this.programFrame?.actors||[{x:this.x,facing:this.facing},{x:this.x+this.size().spacing,facing:this.facing}];
    }
    position() {
      const dimensions=this.size(),size=dimensions.height,width=dimensions.width;
      this.character.style.width=this.character.style.height=size+'px';
      this.x = Math.max(0, Math.min(Math.max(0, innerWidth - width), this.x)); this.y = Math.max(5, Math.min(Math.max(5, innerHeight - size), this.y));
      const ratio=window.devicePixelRatio||1;
      const actors=this.actorPositions();
      const place=(element,x,actor)=>{
        element.style.width=element.style.height=size+'px';element.style.bottom='0';
        if(actor){
          // Continuous compositor movement avoids whole-pixel stepping during
          // slow curved glides. Lean around the blades, never rotate a pirouette.
          const y=this.y+(actor.depth||0),lean=actor.lean||0;
          element.style.transformOrigin='50% 94%';
          element.style.zIndex=actor.layer?String(actor.layer):'';
          element.style.transform='translate3d('+x.toFixed(3)+'px,'+(-y).toFixed(3)+'px,0) rotate('+lean.toFixed(3)+'deg)';
        }else if(this.isDancer())element.style.transform='translate3d('+x.toFixed(3)+'px,'+(-this.y).toFixed(3)+'px,0)';
        else element.style.transform='translate('+Math.round(x*ratio)/ratio+'px,'+(-Math.round(this.y*ratio)/ratio)+'px)';
      };
      place(this.character,actors?actors[0].x:this.x,actors?.[0]);
      if(actors&&this.partner)place(this.partner,actors[1].x,actors[1]);
      const contentWidth=document.documentElement?.clientWidth||innerWidth;
      this.tip.style.left = Math.max(10, Math.min(contentWidth - (innerWidth <= 540 ? 220 : 246), this.x - 25)) + 'px';
      this.tip.style.bottom = Math.min(innerHeight - 110, this.y + size - 12) + 'px';
    }
    settleJump() {
      if(this.program)this.cancelProgram();
      if (!['jump','spin','skate-stop','skate-performance','dance-performance'].includes(this.state)) return;
      this.y = this.size().ground;
      this.jumpElapsed = 0; this.velocity = 0; this.fallVelocity = 0; this.position();
    }
    hop() {
      if(this.isDancer())return this.perform('kicks');
      if(this.isSkater())return this.skateJump();
      if (!this.pack || this.destroyed || document.hidden || this.paused || this.motion.matches || this.opened || this.hidden || this.drag || ['jump', 'fall', 'held'].includes(this.state) || this.y > this.size().ground+1) return false;
      const M = window.JimmyMotion, size = this.size(), max = Math.max(0, innerWidth - size.width);
      this.jumpHeight = Math.min(size.height * .34, Math.max(0, innerHeight - size.height - size.ground - 6));
      if (this.jumpHeight < 8) return false;
      this.jumpFromX = this.x;
      let target = M.clamp(this.x + this.facing * size.width * .38, 0, max);
      if (Math.abs(target - this.x) < 12) target = M.clamp(this.x - this.facing * size.width * .38, 0, max);
      this.jumpTargetX = target;
      if (target !== this.x) this.facing = target < this.x ? -1 : 1;
      this.jumpElapsed = 0; this.velocity = 0; this.fallVelocity = 0;
      this.cancelLater(this.greetingTimer);
      this.showQuip('jump', { animate: false, replace: true });
      this.setState('jump'); return true;
    }
    canPerform(){return (this.isSkater()||this.isDancer())&&this.pack&&!this.destroyed&&!document.hidden&&!this.paused&&!this.motion.matches&&!this.opened&&!this.hidden&&!this.drag&&(this.program||this.y<=this.size().ground+1)&&!['jump','fall','held'].includes(this.state);}
    cancelProgram(settle=true){
      if(!this.program)return;
      this.program=null;this.programFrame=null;this.programElapsed=0;this.pendingProgram=null;this.velocity=0;if(this.partner)this.partner.hidden=true;
      if(settle)this.y=this.size().ground;
      this.character.dataset.move='';this.character.dataset.program='';
      this.nextRoutine=performance.now()+4500;this.setState('idle');if(settle)this.position();
    }
    perform(mode='routine',options={}){
      const engine=this.programEngine();
      if(!this.canPerform()||!engine)return false;
      if(this.program){if(this.program.mode===mode)return false;this.pendingProgram=mode;return true;}
      this.cancelProgram();this.hideTip();this.cancelLater(this.greetingTimer);
      this.program=engine.createPlan({mode,startX:this.x,facing:this.facing,viewportWidth:innerWidth,viewportHeight:innerHeight,size:this.size(),...options});
      this.lastProgramMode=mode;
      this.programElapsed=0;this.velocity=0;this.fallVelocity=0;
      this.programFrame=engine.atTime(this.program,0);
      this.facing=this.programFrame.facing;this.character.dataset.program=mode;
      this.nextRoutine=Infinity;this.nextGesture=performance.now()+this.program.duration+8000;
      this.setState(this.isDancer()?'dance-performance':'skate-performance');
      this.showQuip(mode==='spin'?'spin':mode==='jump'||mode==='kicks'?'jump':'routine',{animate:false,replace:true});
      return true;
    }
    spin(){return this.perform('spin');}
    skateJump(){return this.perform('jump');}
    duet(){return this.asset?.motion.duet?this.perform('duet'):false;}
    encore(){return this.asset?.motion.encore?this.perform('feature'):false;}
    walkTo(target,{style='auto'}={}) {
      if (!this.pack || this.destroyed || this.motion.matches || this.paused || this.hidden || this.drag || this.y > this.size().ground+1) return false;
      this.cancelProgram();
      if(this.isDancer()){
        this.opened=false;this.panel.hidden=true;this.character.setAttribute('aria-expanded','false');
        return this.perform('slides',{targetX:Number(target)||0});
      }
      const M = window.JimmyMotion, size = this.size();
      this.targetX = M.clamp(Number(target) || 0, 0, Math.max(0, innerWidth - size.width));
      if (Math.abs(this.targetX - this.x) < 20) return false;
      this.opened = false; this.panel.hidden = true; this.character.setAttribute('aria-expanded', 'false');
      if (this.tipKind !== 'quip') this.hideTip();
      this.facing = this.targetX < this.x ? -1 : 1; this.velocity = 0; this.walkDistance = 0; this.turnUntil = performance.now() + 140;
      this.skateTrips++;this.skateStyle=this.isSkater()?(style==='auto'?['speed','footwork','spiral'][this.skateTrips%3]:style):'glide';
      if(Math.abs(this.targetX-this.x)<size.width*.8)this.skateStyle='glide';
      const travel=Math.abs(this.targetX-this.x),stride=this.isSkater()&&this.skateStyle==='speed'?size.approachStride:size.stride;
      this.walkStride=this.isSkater()?travel/Math.max(1,Math.round(travel/stride)):stride;
      this.nextRoutine=Infinity;this.setState('walk'); return true;
    }
    tick(now) {
      if (this.destroyed) return;
      const elapsed=this.last?Math.max(0,now-this.last):0;
      const dt = Math.min(.05, elapsed / 1000); this.last = now;
      if (!document.hidden && !this.paused && !this.opened && !this.hidden && !this.drag && this.pack && !this.character.matches(':focus-visible')&&!this.partner?.matches(':focus-visible')) {
        const M = window.JimmyMotion, size = this.size();
        if (now >= this.nextQuip && this.tip.hidden && (['idle','walk'].includes(this.state)||this.isDancer()&&this.program))
          this.showQuip(this.isDancer()&&this.program?'party':this.state==='walk'?'walk':'idle');
        if(this.program){
          this.programElapsed+=elapsed;
          const move=this.programEngine().atTime(this.program,this.programElapsed);
          this.programFrame=move;this.frame=move.index;this.facing=move.facing;this.x=move.x;
          this.y=size.ground+move.lift;this.velocity=move.velocity;this.character.dataset.move=move.phase;
          const requested=this.pendingProgram;
          if(requested&&(move.finished||move.safeExit||move.phase==='landing-exit'||move.sheet==='flow'&&move.index>=14)){
            this.cancelProgram();this.perform(requested);
          }else if(move.finished){this.cancelProgram();this.nextRoutine=now+4500+Math.random()*2500;this.nextWalk=this.nextRoutine;}
          this.position();
        } else if (this.state === 'jump') {
          this.jumpElapsed += dt * 1000;
          this.jumpHeight = Math.min(this.jumpHeight, Math.max(0, innerHeight - size.height - size.ground - 6));
          const jump = M.jumpAtTime(this.jumpElapsed, this.jumpHeight);
          this.x = M.clamp(this.jumpFromX + (this.jumpTargetX - this.jumpFromX) * jump.progress, 0, Math.max(0, innerWidth - size.width));
          this.y = size.ground + jump.lift; this.frame = jump.frame;
          if (jump.finished) {
            this.y = size.ground; this.setState('idle');
            this.nextHop = now + 16000 + Math.random() * 12000;
            this.nextWalk = now + 900 + Math.random() * 1500;
          }
          this.position();
        } else if (this.y > size.ground || this.state === 'fall') {
          const fall = M.fallStep({ y: this.y, velocity: this.fallVelocity }, dt, size.ground);
          this.y = fall.y; this.fallVelocity = fall.velocity;
          if (fall.landed) this.setState('land');
          this.position();
        } else if (this.state === 'walk') {
          this.targetX = M.clamp(this.targetX, 0, Math.max(0, innerWidth - size.width));
          if (now >= this.turnUntil) {
            const next = M.walkStep({ x: this.x, target: this.targetX, velocity: this.velocity, distance: this.walkDistance }, dt, size);
            this.x = next.x; this.velocity = next.velocity; this.walkDistance = next.distance;
            this.frame = M.frameAtDistance(this.walkDistance, this.walkStride||size.stride,size.frames);
            if (next.arrived) {
              this.x = this.targetX; this.velocity = 0; this.setState(this.isSkater()?'skate-stop':'idle'); this.nextWalk = now + 2500 + Math.random() * 3500;this.nextRoutine=this.nextWalk;
              this.tipCount = (this.tipCount || 0) + 1; if (this.tipCount % 3 === 0) this.showTip();
            }
            this.position();
          }
        } else if((this.isSkater()||this.isDancer())&&this.state==='idle'&&now>=this.nextRoutine){
          const mode=this.isDancer()?(this.lastProgramMode==='routine'?'freestyle':'routine'):
            this.asset.motion.encore&&this.lastProgramMode!=='feature'?'feature':'routine';
          if(!this.perform(mode))this.nextRoutine=now+3000;
        } else if (!this.isSkater()&&!this.isDancer()&&this.state === 'idle' && now >= this.nextHop) {
          if (!this.hop()) this.nextHop = now + 5000;
        } else if (!this.isSkater()&&!this.isDancer()&&this.state === 'idle' && this.tip.hidden && now >= this.nextGesture) {
          const gestures = ['wave', 'think', 'celebrate', 'rest'];
          this.setState(gestures[Math.floor(Math.random() * gestures.length)]);
          this.nextGesture = now + 9000 + Math.random() * 8000;
        } else if (!this.isSkater()&&!this.isDancer()&&now > this.nextWalk && this.state === 'idle') {
          const max = Math.max(0, innerWidth - size.width - 8);
          const distance = Math.min(max, 140 + Math.random() * 250);
          const target = this.x > max / 2 ? Math.max(8, this.x - distance) : Math.min(max, this.x + distance);
          if (!this.walkTo(target)) this.nextWalk = now + 5000;
        }
      }
      if (!document.hidden && !this.paused && !this.drag && now > this.stateUntil) this.setState('idle');
      this.drawFrame();
      this.raf = requestAnimationFrame(this.tick);
    }
    showTip() {
      if (!this.pack || this.destroyed || document.hidden || this.opened || this.hidden || this.drag || this.paused || this.state !== 'idle' || !this.tip.hidden) return false;
      const ids = this.pack.suggested, id = ids[(this.tipIndex || 0) % Math.max(1, ids.length)]; this.tipIndex = (this.tipIndex || 0) + 1;
      const e = this.pack.entries.find(e => e.id === id && window.JimmyKnowledge.active(e)); if (!e) return;
      this.showBubble(e.question, 'Anklicken · Ich helfe euch', { entry: e.id, kind: 'knowledge', duration: 8500 });
      this.setState('wave'); return true;
    }
    hideTip() { this.cancelLater(this.bubbleTimer); this.bubbleTimer = null; this.tip.hidden = true; this.tipEntry = ''; this.tipKind = ''; }
    showBubble(text, caption, { entry = '', kind = 'quip', duration = 6500 } = {}) {
      this.hideTip(); this.tipEntry = entry; this.tipKind = kind;
      this.tip.replaceChildren(el('div', '', text), el('span', '', caption));
      this.tip.hidden = false; this.position();
      this.bubbleTimer = this.later(() => this.hideTip(), duration);
    }
    showQuip(kind = 'idle', { animate = true, replace = false, userInitiated = false } = {}) {
      if (!this.quips || !this.pack || this.destroyed || document.hidden || this.opened || this.hidden || this.drag || (this.paused && !userInitiated) || (!this.tip.hidden && !replace)) return false;
      this.cancelLater(this.greetingTimer);
      const line = this.quips.next(kind);
      this.showBubble(line, 'Anklicken · Fragen an '+this.displayName());
      this.nextQuip = performance.now() + 18000 + Math.random() * 10000;
      if (animate && !this.paused && !this.motion.matches && this.state === 'idle') this.setState('talk');
      if (this.voice) this.speak(line);
      return true;
    }
    open() { if (!this.pack) return; this.settleJump(); this.hideTip(); this.hidden = false; this.character.hidden = false; this.launcher.hidden = true; this.opened = true; this.panel.hidden = false; this.character.setAttribute('aria-expanded', 'true'); this.setState('wave'); this.render(); this.panel.querySelector('.close')?.focus({ preventScroll: true }); }
    close() { this.opened = false; this.panel.hidden = true; this.character.setAttribute('aria-expanded', 'false'); this.nextWalk = performance.now() + 5000;this.nextRoutine=this.nextWalk; this.setState('idle'); this.character.focus({ preventScroll: true }); }
    minimize() { this.settleJump(); this.hideTip(); this.opened = false; this.hidden = true; this.panel.hidden = true; this.character.hidden = true;if(this.partner)this.partner.hidden=true; this.launcher.hidden = false; this.character.setAttribute('aria-expanded', 'false'); this.launcher.focus(); }
    buttonFor(entry) {
      const b = el('button', 'choice'); b.type = 'button'; b.append(el('span', '', entry.question)); b.onclick = () => this.answer(entry.id); return b;
    }
    answer(id) { const entry = this.pack?.entries.find(e => e.id === id && window.JimmyKnowledge.active(e)); if (!entry) return; this.current = id; this.render(); this.setState('talk'); this.speak(entry.answer); this.panel.querySelector('.answer-title')?.focus({ preventScroll: true }); this.host.dispatchEvent(new CustomEvent('jimmy:answer', { detail: { id }, bubbles: true })); }
    speak(text) { if (!this.voice || !('speechSynthesis' in window)) return; speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang = 'de-DE'; u.rate = .98; speechSynthesis.speak(u); }
    render() {
      if (!this.pack) return;
      const K = window.JimmyKnowledge, pack = this.pack; this.panel.replaceChildren();
      const head = el('header', 'head'), who = el('div', 'who'); who.append(el('strong', '', this.displayName()), el('small', '', this.asset?.subtitle||pack.avatar.subtitle)); head.append(el('div', 'badge', pack.organization.shortName.slice(0, 4)), who);
      const minimize = el('button', 'icon', '−'); minimize.title = 'Figur ausblenden'; minimize.setAttribute('aria-label', 'Figur ausblenden'); minimize.onclick = () => this.minimize();
      const close = el('button', 'icon close', '×'); close.setAttribute('aria-label', 'Antwortfenster schließen'); close.onclick = () => this.close(); head.append(minimize, close);
      const body = el('div', 'body');
      if (this.offline) body.append(el('div', 'warning', 'Lokale Dateiversion. Online-Änderungen sind hier erst nach erneutem Download enthalten.'));
      const current = pack.entries.find(e => e.id === this.current && K.active(e));
      if (current) {
        const back = el('button', 'back', 'Alle Themen'); back.onclick = () => { this.current = ''; this.render(); this.panel.querySelector('input')?.focus(); }; body.append(back);
        const h = el('h2', 'answer-title', current.question); h.tabIndex = -1; body.append(h);
        const content = el('div', 'answer', current.answer); content.setAttribute('aria-live', 'polite'); body.append(content);
        if (K.stale(current)) body.append(el('p', 'warning', 'Prüfung fällig: Diese Information kann sich geändert haben. Bitte prüfen Sie die verlinkte Park-Webseite.'));
        const links = el('div', 'links'); for (const l of current.links) { const a = el('a', '', l.label); a.href = l.url; a.target = '_blank'; a.rel = 'noopener noreferrer'; links.append(a); } body.append(links);
        const source = el('div', 'source', current.verifiedAt ? 'Geprüft: ' + current.verifiedAt.split('-').reverse().join('.') + ' · ' : 'Noch ohne Prüfdatum · ');
        if (current.sourceUrl) { const a = el('a', '', 'Quelle ansehen'); a.href = current.sourceUrl; a.target = '_blank'; a.rel = 'noopener noreferrer'; source.append(a); } else source.append('Vom Betreiber hinterlegt'); body.append(source);
        const follow = current.suggestions.map(id => pack.entries.find(e => e.id === id && K.active(e))).filter(Boolean);
        if (follow.length) { body.append(el('p', 'eyebrow', 'Das könnte euch auch interessieren')); const choices = el('div', 'choices'); follow.forEach(e => choices.append(this.buttonFor(e))); body.append(choices); }
      } else {
        body.append(el('p', 'greeting', this.asset?.plural?'Hallo, wir sind '+this.displayName()+'! Wir begleiten dich durch das hinterlegte Parkwissen. Was möchtest du entdecken?':this.isSkater()?'Hallo, ich bin '+this.displayName()+'! Ich begleite dich durch das hinterlegte Parkwissen. Was möchtest du entdecken?':pack.organization.greeting)); const cats = el('div', 'cats');
        const all = [{ id: '', label: 'Alle Themen', icon: '✦' }, ...pack.categories];
        for (const c of all) { if (c.id && !pack.entries.some(e => e.category === c.id && K.active(e))) continue; const b = el('button', 'cat', c.icon + ' ' + c.label); b.setAttribute('aria-pressed', String(this.category === c.id)); b.onclick = () => { this.category = c.id; this.render(); }; cats.append(b); } body.append(cats);
        const form = el('form', 'search'), input = el('input'); input.type = 'search'; input.placeholder = 'Suchen: Öffnungszeiten, Geburtstag, Socken …'; input.setAttribute('aria-label', 'Hinterlegtes Wissen durchsuchen'); input.maxLength = 200; const go = el('button', '', 'Suchen'); go.type = 'submit'; go.setAttribute('aria-label', 'Suchen'); form.append(input, go); body.append(form);
        const title = el('p', 'eyebrow', this.category ? 'Passende Antworten' : 'Wie kann ich helfen?'), choices = el('div', 'choices'); body.append(title, choices);
        const draw = query => { choices.replaceChildren(); let entries = !query && !this.category ? pack.suggested.map(id => pack.entries.find(e => e.id === id && K.active(e))).filter(Boolean) : K.search(pack, query, { category: this.category, limit: 20 }); if (!entries.length && !query) entries = K.search(pack, '', { category: this.category, limit: 12 }); entries.forEach(e => choices.append(this.buttonFor(e))); if (!entries.length) choices.append(el('p', 'empty', pack.organization.fallback)); title.textContent = query ? 'Gefundene Themen · ' + entries.length : this.category ? 'Passende Antworten' : 'Wie kann ich helfen?'; };
        form.onsubmit = e => { e.preventDefault(); draw(input.value); }; input.oninput = () => draw(input.value); draw('');
      }
      const foot = el('footer', 'foot'); foot.append(el('span', '', '✦ Hinterlegtes Parkwissen · Demo'));
      const voice = el('button', '', this.voice ? 'Ton an' : 'Vorlesen'); voice.setAttribute('aria-label', 'Vorlesen ' + (this.voice ? 'ausschalten' : 'einschalten')); voice.setAttribute('aria-pressed', String(this.voice)); voice.disabled = !('speechSynthesis' in window); voice.onclick = () => { this.voice = !this.voice; if (!this.voice && 'speechSynthesis' in window) speechSynthesis.cancel(); if (this.voice && current) this.speak(current.answer); this.render(); };
      const pause = el('button', '', this.paused ? 'Weiterlaufen' : 'Pause'); pause.setAttribute('aria-pressed', String(this.paused)); pause.onclick = () => { this.paused = !this.paused; this.settleJump(); this.hideTip(); this.setState('idle'); this.nextWalk = performance.now() + 3000; this.nextHop = performance.now() + 12000; this.render(); }; foot.append(voice, pause); this.panel.append(head, body, foot);
    }
    destroy() { this.cancelProgram();this.destroyed = true; cancelAnimationFrame(this.raf); this.timers.forEach(clearTimeout); document.removeEventListener('keydown', this.onKey); window.removeEventListener('resize', this.onResize); document.removeEventListener('visibilitychange', this.onVisibility); this.motion.removeEventListener('change', this.onMotion); if (this.voice && 'speechSynthesis' in window) speechSynthesis.cancel(); this.host.remove(); }
  }
  window.JimmyChatAvatar = { create: options => new Mascot(options), baseUrl: BASE, instance: null, ready: engineReady };
  window.UniversalChatAvatar=window.JimmyChatAvatar;
  const auto = () => { if (script.dataset.manual !== 'true') window.JimmyChatAvatar.instance = new Mascot({ knowledgeUrl: script.dataset.knowledge || undefined }); };
  if (document.body) auto(); else document.addEventListener('DOMContentLoaded', auto, { once: true });
})();


