/* Sound and a self-contained winter stage, only loaded on the demo page. */
(function () {
  'use strict';
  const audio=document.getElementById('demo-music');
  if(!audio)return;
  const buttons=Array.from(document.querySelectorAll('[data-music-toggle]'));
  let mayAutoStart=true,starting=false,userPaused=false,resumeOnVisible=false,failed=false;
  audio.volume=.28;
  function renderMusic(){
    const playing=!failed&&!audio.paused&&!audio.ended;
    for(const button of buttons){
      const action=failed?'Musik nicht verfügbar':playing?'Musik pausieren':'Musik einschalten';
      button.dataset.state=failed?'unavailable':playing?'playing':'paused';
      button.setAttribute('aria-pressed',String(playing));button.setAttribute('aria-label',action);button.title=action;button.disabled=failed;
      const label=button.querySelector('[data-music-label]');
      if(label)label.textContent=button.classList.contains('music-toggle--compact')?'Musik':action;
    }
  }
  function removeActivation(){document.removeEventListener('click',activate,true);document.removeEventListener('keydown',activate,true);}
  async function playMusic(){
    if(starting||failed||userPaused||document.hidden)return;
    starting=true;
    try{
      await audio.play();
      if(userPaused||document.hidden)audio.pause();
      else{mayAutoStart=false;removeActivation();}
    }catch(error){
      // A blocked autoplay remains available from either visible music button.
    }finally{starting=false;renderMusic();}
  }
  function activate(event){
    if(!mayAutoStart||userPaused||event.target.closest?.('[data-music-toggle]'))return;
    if(event.type==='keydown'&&(!['Enter',' '].includes(event.key)||event.ctrlKey||event.metaKey||event.altKey))return;
    playMusic();
  }
  for(const button of buttons)button.addEventListener('click',()=>{
    mayAutoStart=false;removeActivation();
    if(!audio.paused||starting){userPaused=true;resumeOnVisible=false;audio.pause();renderMusic();}
    else{userPaused=false;playMusic();}
  });
  audio.addEventListener('play',renderMusic);audio.addEventListener('pause',renderMusic);
  audio.addEventListener('error',()=>{failed=true;audio.pause();removeActivation();renderMusic();});
  document.addEventListener('click',activate,true);document.addEventListener('keydown',activate,true);
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){resumeOnVisible=(!audio.paused||starting)&&!userPaused;audio.pause();}
    else if(resumeOnVisible&&!userPaused){resumeOnVisible=false;playMusic();}
  });
  renderMusic();playMusic();
})();

(async function () {
  'use strict';
  const section=document.getElementById('winterzauber'),scene=document.getElementById('winter-scene'),runway=document.getElementById('winter-runway'),runner=document.getElementById('winter-skater');
  if(!section||!window.JimmyChatAvatar?.instance)return;
  const instance=window.JimmyChatAvatar.instance;
  await instance.ready;
  if(!instance.pack||!instance.isSkater())return;
  const asset=window.UniversalAvatarAssets.active,motion=matchMedia('(prefers-reduced-motion: reduce)');
  section.hidden=false;scene.setAttribute('aria-label',asset.name+' zeigt ihre kleine Kür auf einem verzauberten zugefrorenen See im Mondlicht.');
  const figure=window.JimmyMascot.create();runner.append(figure);runner.dataset.asset=asset.id;
  let active=false,raf=0,last=0,elapsed=0,plan=null,x=0,facing=1,size,width=0,height=0;
  function drawIdle(){
    runner.dataset.state='idle';scene.dataset.phase='idle';
    runner.style.transform='translate('+Math.round(x*(devicePixelRatio||1))/(devicePixelRatio||1)+'px,0px)';
    window.JimmyMascot.paint(figure,'idle',0,facing);
  }
  function makePlan(){return window.UniversalSkating.createPlan({mode:'routine',startX:x,facing,viewportWidth:width,viewportHeight:height,size});}
  function measure(){
    const nextWidth=runway.clientWidth,nextHeight=runway.clientHeight;if(!nextWidth||!nextHeight)return;
    const ratio=width>size?.width?x/(width-size.width):.5;
    width=nextWidth;height=nextHeight;size=window.JimmyMotion.dimensions(width,asset.motion,height);
    runner.style.width=runner.style.height=size.width+'px';
    x=Math.max(0,Math.min(width-size.width,(width-size.width)*ratio));plan=null;elapsed=0;last=0;drawIdle();
  }
  function tick(now){
    raf=0;
    if(!active||document.hidden||motion.matches){last=0;return;}
    if(instance.paused||instance.opened){
      if(plan){plan=null;elapsed=0;drawIdle();}last=0;raf=requestAnimationFrame(tick);return;
    }
    if(!plan){plan=makePlan();elapsed=0;}
    elapsed+=last?Math.max(0,now-last):0;last=now;
    const move=window.UniversalSkating.atTime(plan,elapsed),ratio=devicePixelRatio||1;
    x=move.x;facing=move.facing;runner.dataset.state=move.finished?'idle':'skate-performance';scene.dataset.phase=move.phase;
    runner.style.transform='translate('+Math.round(x*ratio)/ratio+'px,'+(-Math.round(move.lift*ratio)/ratio)+'px)';
    window.JimmyMascot.paint(figure,move.finished?'idle':'skate-performance',move.index,facing,{selection:move});
    if(move.finished&&elapsed>=plan.duration+2400){plan=null;elapsed=0;}
    raf=requestAnimationFrame(tick);
  }
  function update(){
    cancelAnimationFrame(raf);raf=0;last=0;
    if(active&&!document.hidden){
      if(motion.matches){plan=null;elapsed=0;drawIdle();}else raf=requestAnimationFrame(tick);
    }
    scene.dataset.active=String(active&&!document.hidden);
  }
  measure();new ResizeObserver(measure).observe(runway);
  new IntersectionObserver(entries=>{active=entries[0].isIntersecting&&entries[0].intersectionRatio>=.2;update();},{threshold:[0,.2,.5]}).observe(scene);
  document.addEventListener('visibilitychange',update);motion.addEventListener('change',update);
  scene.dataset.ready='true';
})();
