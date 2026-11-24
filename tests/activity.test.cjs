'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const Motion=require('../motion-core.js'),Personality=require('../personality-core.js'),Assets=require('../asset-sets.js');
const Skating=require('../skating-core.js'),Shuffle=require('../shuffle-core.js');

class Element {
  constructor(tag){this.tagName=tag;this.children=[];this.dataset={};this.attributes={};this.style={setProperty(){}};this.hidden=false;this.textContent='';}
  append(...nodes){this.children.push(...nodes);}
  replaceChildren(...nodes){this.children=[...nodes];}
  attachShadow(){return new Element('shadow');}
  setAttribute(key,value){this.attributes[key]=value;}
  addEventListener(){}
  removeEventListener(){}
  matches(){return false;}
  querySelector(){return null;}
  focus(){}
  dispatchEvent(){}
  remove(){}
}
async function mascot(assetId='jimmy'){
  let clock=0,id=0;
  const timers=new Map(),media={matches:false,addEventListener(){},removeEventListener(){}};
  const renderers=new Map();
  const forAsset=id=>{if(!renderers.has(id)){const asset=Assets.get(id);renderers.set(id,{asset,preload:()=>Promise.resolve(),create:()=>new Element(asset.renderer==='canvas'?'canvas':'span'),paint(){}});}return renderers.get(id);};
  const context={URL,Map,Set,Promise,Math,Number,String,Error,Infinity,innerWidth:1200,innerHeight:800,performance:{now:()=>clock},
    document:{currentScript:{src:'https://demo.example/avatar.js',dataset:{manual:'true'}},body:new Element('body'),hidden:false,createElement:tag=>new Element(tag),addEventListener(){},removeEventListener(){}},
    matchMedia:()=>media,requestAnimationFrame:()=>1,cancelAnimationFrame(){},CustomEvent:class{},
    setTimeout:(fn,delay)=>{timers.set(++id,{fn,delay});return id;},clearTimeout:timer=>timers.delete(timer),
    JimmyMotion:Motion,UniversalSkating:Skating,UniversalShuffle:Shuffle,JimmyPersonality:Personality,UniversalAvatarAssets:{...Assets,active:Assets.get(assetId)},
    JimmyMascot:{...forAsset(assetId),forAsset},
    JimmyKnowledge:{validate:x=>x,active:()=>true,search:()=>[]},
    addEventListener(){},removeEventListener(){}
  };
  context.window=context;
  vm.runInNewContext(fs.readFileSync(require.resolve('../avatar.js'),'utf8'),context);
  const avatar=context.JimmyChatAvatar.create({knowledge:{avatar:{name:'Jimmy',color:'#087b71',subtitle:'Parkbegleiter'},organization:{shortName:'Jimmy',greeting:'Hallo',fallback:'Frag das Park-Team'},categories:[],entries:[],suggested:[]}});
  await avatar.ready;
  const advance=(milliseconds)=>{for(let elapsed=0;elapsed<milliseconds;elapsed+=20){clock+=20;avatar.tick(clock);}};
  return {avatar,context,media,timers,advance,setClock:value=>{clock=value;}};
}

test('The separated pair shares one clock, rejoins when interrupted and leaves no partner after an asset switch',async()=>{
  const {avatar,advance,media}=await mascot('ice-pair');
  assert.equal(avatar.duet(),true);const opening=avatar.program.blocks.find(b=>b.kind==='duet'&&b.part==='open');
  advance(opening.start+500);assert.equal(avatar.partner.hidden,false);assert.equal(avatar.programFrame.actors.length,2);
  avatar.open();assert.equal(avatar.program,null);assert.equal(avatar.partner.hidden,false);assert.equal(avatar.y,10);
  avatar.close();assert.equal(avatar.duet(),true);advance(avatar.program.blocks.find(b=>b.kind==='duet').start+200);
  await avatar.setAsset('ice-skater');assert.equal(avatar.partner.hidden,true);assert.equal(avatar.program,null);assert.equal(avatar.asset.id,'ice-skater');
  assert.equal(avatar.duet(),false);
  await avatar.setAsset('ice-pair');media.matches=true;assert.equal(avatar.duet(),false);assert.equal(avatar.partner.hidden,false);
  avatar.minimize();assert.equal(avatar.partner.hidden,true);assert.equal(avatar.character.hidden,true);
  media.matches=false;avatar.destroy();assert.equal(avatar.destroyed,true);
});

test('A full hop uses all four action frames and lands inside the viewport',async()=>{
  const {avatar,advance}=await mascot();const frames=new Set();
  avatar.x=1000;avatar.nextQuip=avatar.nextWalk=avatar.nextGesture=Infinity;
  assert.equal(avatar.hop(),true);
  for(let i=0;i<60;i++){frames.add(avatar.frame);advance(20);assert.ok(avatar.x>=0&&avatar.x<=1008);assert.ok(avatar.y>=10&&avatar.y<=76);}
  assert.deepEqual(frames,new Set([0,1,2,3]));assert.equal(avatar.state,'idle');assert.equal(avatar.y,10);
});

test('Reading, pause, dragging, hidden pages and reduced motion prevent automatic hops and asides',async()=>{
  const {avatar,context,media}=await mascot();
  for(const key of ['opened','paused','hidden','drag']){avatar[key]=true;assert.equal(avatar.hop(),false);assert.equal(avatar.showQuip(),false);avatar[key]=false;}
  context.document.hidden=true;assert.equal(avatar.hop(),false);assert.equal(avatar.showQuip(),false);context.document.hidden=false;
  media.matches=true;assert.equal(avatar.hop(),false);media.matches=false;
  avatar.opened=true;avatar.nextHop=0;avatar.nextQuip=0;avatar.tick(50000);assert.equal(avatar.state,'idle');assert.equal(avatar.tip.hidden,true);
});

test('Bubble replacement cancels old expiry and expiry never interrupts an airborne action',async()=>{
  const {avatar,timers}=await mascot();
  assert.equal(avatar.showQuip('idle'),true);
  const old=avatar.bubbleTimer;
  assert.equal(avatar.showQuip('walk',{replace:true}),true);
  assert.equal(timers.has(old),false);
  assert.equal(avatar.hop(),true);
  timers.get(avatar.bubbleTimer).fn();
  assert.equal(avatar.state,'jump');assert.equal(avatar.tip.hidden,true);
});

test('Opening an answer during a hop settles the figure and stops ambient activity',async()=>{
  const {avatar,advance}=await mascot();
  avatar.hop();advance(460);assert.ok(avatar.y>10);
  avatar.open();assert.equal(avatar.y,10);assert.equal(avatar.opened,true);assert.equal(avatar.tip.hidden,true);
  advance(1200);assert.equal(avatar.y,10);assert.notEqual(avatar.state,'jump');
});

test('Due ambient hops run automatically and destruction removes pending bubble timers',async()=>{
  const {avatar,timers,advance}=await mascot();
  avatar.nextQuip=avatar.nextWalk=avatar.nextGesture=Infinity;avatar.nextHop=0;
  advance(20);assert.equal(avatar.state,'jump');
  avatar.destroy();assert.equal(timers.size,0);assert.equal(avatar.hop(),false);assert.equal(avatar.showQuip(),false);
});

test('The skating set glides with sixteen frames and stops gracefully before returning to idle',async()=>{
  const {avatar,advance}=await mascot('ice-skater');
  avatar.nextQuip=avatar.nextGesture=avatar.nextHop=Infinity;
  assert.equal(avatar.displayName(),'Lumi');assert.equal(avatar.walkTo(100,{style:'spiral'}),true);assert.equal(avatar.skateStyle,'spiral');
  const frames=new Set();let stopped=false;const max=1200-avatar.size().width;
  for(let i=0;i<650;i++){advance(20);frames.add(avatar.frame);assert.equal(avatar.y,10);assert.ok(avatar.x>=100&&avatar.x<=max);assert.ok(avatar.velocity<=avatar.size().speed);if(avatar.state==='skate-stop'){stopped=true;break;}}
  assert.ok(stopped);assert.ok(frames.size>=12);avatar.nextWalk=Infinity;advance(avatar.asset.motion.stopDuration+80);
  assert.equal(avatar.state,'idle');assert.equal(avatar.x,100);
});

test('A pirouette stays upright on the baseline, finishes by itself, and never becomes an endless gesture',async()=>{
  const {avatar,advance}=await mascot('ice-skater');
  avatar.x=600;const origin=avatar.x;
  assert.equal(avatar.spin(),true);assert.equal(avatar.state,'skate-performance');
  const duration=avatar.program.duration;
  for(let elapsed=0;elapsed<duration+60;elapsed+=20){advance(20);assert.equal(avatar.y,10);assert.equal(avatar.x,origin);}
  assert.equal(avatar.state,'idle');
  for(const key of ['opened','paused','hidden','drag']){avatar[key]=true;assert.equal(avatar.spin(),false);avatar[key]=false;}
});

test('Opening an answer during a pirouette settles the new asset without an overlay surface',async()=>{
  const {avatar,advance}=await mascot('ice-skater');avatar.spin();advance(900);avatar.open();advance(1000);
  assert.equal(avatar.opened,true);assert.equal(avatar.program,null);assert.notEqual(avatar.state,'skate-performance');assert.equal(avatar.y,10);
  assert.equal(avatar.asset.environment,'none');assert.equal(avatar.host.dataset.asset,'ice-skater');
});

test('The skater builds speed, performs an airborne turn and absorbs the landing without stopping its path',async()=>{
  const {avatar,advance}=await mascot('ice-skater');avatar.x=100;avatar.facing=1;
  assert.equal(avatar.hop(),true);
  const duration=avatar.program.duration,phases=new Set(),sheets=new Set();let lift=0,speed=0,airTravel=0,lastX=avatar.x;
  for(let elapsed=0;elapsed<duration+60;elapsed+=20){
    advance(20);if(avatar.programFrame){phases.add(avatar.programFrame.phase);sheets.add(avatar.programFrame.sheet);}
    lift=Math.max(lift,avatar.y-10);speed=Math.max(speed,avatar.velocity);if(avatar.y>10)airTravel+=Math.abs(avatar.x-lastX);lastX=avatar.x;
  }
  assert.ok(sheets.has('speed')&&sheets.has('jump'));assert.ok(phases.has('takeoff')&&phases.has('air-turn')&&phases.has('landing'));
  assert.ok(lift>70);assert.ok(speed>150&&speed<=avatar.size().performanceSpeed+.001);assert.ok(airTravel>60);assert.equal(avatar.y,10);assert.equal(avatar.program,null);
});

test('A complete routine runs automatically, includes several tricks and returns to a finite resting state',async()=>{
  const {avatar,advance}=await mascot('ice-skater');avatar.nextRoutine=0;advance(20);
  assert.equal(avatar.program.mode,'routine');const duration=avatar.program.duration,phases=new Set();
  for(let elapsed=0;elapsed<duration+80;elapsed+=20){advance(20);if(avatar.programFrame)phases.add(avatar.programFrame.phase);assert.ok(avatar.x>=0&&avatar.x<=1200-avatar.size().width);assert.ok(avatar.y>=10&&avatar.y<800-avatar.size().height);}
  for(const phase of ['speed','air-turn','double-turn','landing','spiral','lunge','spin-entry','spin','spin-exit','bow'])assert.ok(phases.has(phase),phase);
  assert.equal(avatar.program,null);assert.equal(avatar.state,'idle');assert.equal(avatar.y,10);
});

test('A requested trick waits for a safe exit and reading or reduced motion cancels the whole routine',async()=>{
  const {avatar,advance,media}=await mascot('ice-skater');avatar.x=100;avatar.skateJump();
  while(avatar.y===10)advance(20);
  assert.equal(avatar.spin(),true);assert.equal(avatar.program.mode,'jump');assert.equal(avatar.pendingProgram,'spin');
  const deadline=avatar.program.duration;
  for(let elapsed=0;elapsed<=deadline&&avatar.program.mode==='jump';elapsed+=20)advance(20);
  assert.equal(avatar.program.mode,'spin');assert.equal(avatar.y,10);
  avatar.open();assert.equal(avatar.program,null);assert.equal(avatar.pendingProgram,null);assert.equal(avatar.y,10);
  avatar.opened=false;avatar.perform();media.matches=true;avatar.onMotion();
  assert.equal(avatar.program,null);assert.equal(avatar.paused,true);assert.equal(avatar.perform(),false);
});

test('A slow rendered frame does not stretch the whole routine, while a hidden document freezes its clock',async()=>{
  const {avatar,advance,context,setClock}=await mascot('ice-skater');avatar.perform();advance(200);
  const before=avatar.programElapsed;context.document.hidden=true;avatar.onVisibility();advance(5000);
  assert.equal(avatar.programElapsed,before);context.document.hidden=false;avatar.onVisibility();advance(40);
  const late=avatar.program.duration+10000;setClock(late);avatar.tick(late);
  assert.equal(avatar.program,null);assert.equal(avatar.y,10);assert.equal(avatar.state,'idle');
});

test('A live asset switch safely lands an airborne skater and updates the renderer without replacing her knowledge',async()=>{
  const {avatar,advance,timers}=await mascot('ice-skater'),pack=avatar.pack,oldQuips=avatar.quips;
  avatar.x=100;avatar.skateJump();while(avatar.y===10)advance(20);
  assert.ok(avatar.y>10);assert.equal(await avatar.setAsset('jimmy'),true);
  assert.equal(avatar.displayName(),'Jimmy');assert.equal(avatar.isSkater(),false);assert.equal(avatar.visual.tagName,'span');
  assert.equal(avatar.program,null);assert.equal(avatar.pendingProgram,null);assert.equal(avatar.y,10);assert.equal(avatar.velocity,0);assert.equal(avatar.state,'idle');
  assert.equal(avatar.pack,pack);assert.notEqual(avatar.quips,oldQuips);assert.equal(timers.size,0);assert.equal(avatar.character.attributes['aria-label'],'Jimmy öffnen. Zum Versetzen ziehen.');
  assert.equal(await avatar.setAsset('ice-skater'),true);assert.equal(avatar.visual.tagName,'canvas');assert.equal(avatar.displayName(),'Lumi');assert.equal(avatar.host.dataset.asset,'ice-skater');
});

test('Switching keeps the reading state, current answer and user pause preferences',async()=>{
  const {avatar}=await mascot();avatar.open();avatar.paused=true;avatar.voice=true;avatar.current='saved-answer';
  await avatar.setAsset('ice-skater');
  assert.equal(avatar.opened,true);assert.equal(avatar.paused,true);assert.equal(avatar.voice,true);assert.equal(avatar.current,'saved-answer');assert.equal(avatar.perform(),false);
  assert.equal(avatar.panel.attributes['aria-label'],'Antworten von Lumi');
});

test('An unavailable new asset leaves the current figure intact and an invalid selection cannot change it',async()=>{
  const {avatar,context}=await mascot('ice-skater'),visual=avatar.visual,pack=avatar.pack;
  context.JimmyMascot.forAsset('jimmy').preload=()=>Promise.reject(Error('Network unavailable'));
  await assert.rejects(avatar.setAsset('jimmy'),/Network unavailable/);await assert.rejects(avatar.setAsset('unknown'),/Unbekanntes/);
  assert.equal(avatar.visual,visual);assert.equal(avatar.pack,pack);assert.equal(avatar.asset.id,'ice-skater');
});

test('A slow earlier selection cannot overwrite a newer selection or revive a destroyed figure',async()=>{
  const {avatar,context}=await mascot('ice-skater');let finish;
  context.JimmyMascot.forAsset('jimmy').preload=()=>new Promise(resolve=>{finish=resolve;});
  const pending=avatar.setAsset('jimmy');await Promise.resolve();assert.equal(await avatar.setAsset('ice-skater'),false);finish();
  assert.equal(await pending,false);assert.equal(avatar.asset.id,'ice-skater');
  const later=avatar.setAsset('jimmy');await Promise.resolve();avatar.destroy();finish();assert.equal(await later,false);assert.equal(avatar.asset.id,'ice-skater');
});

test('The fine pair alternates both routines and cancels the orbit cleanly when reading or switching assets',async()=>{
  const {avatar,advance,media}=await mascot('ice-pair-fine');avatar.nextRoutine=0;advance(20);
  assert.equal(avatar.partner.attributes['aria-label'],'Elio öffnen. Zum Versetzen ziehen.');
  assert.equal(avatar.program.mode,'feature');const duration=avatar.program.duration;
  advance(duration+100);assert.equal(avatar.program,null);assert.equal(avatar.y,avatar.size().ground);
  avatar.nextRoutine=0;advance(20);assert.equal(avatar.program.mode,'routine');
  avatar.open();assert.equal(avatar.program,null);assert.equal(avatar.partner.hidden,false);avatar.close();
  assert.equal(avatar.encore(),true);advance(avatar.program.blocks.find(b=>b.part==='orbit').start+500);
  assert.equal(avatar.programFrame.atlas,'encore');assert.equal(avatar.partner.hidden,false);
  await avatar.setAsset('ice-pair');assert.equal(avatar.program,null);assert.equal(avatar.encore(),false);assert.equal(avatar.partner.hidden,false);
  assert.equal(avatar.partner.attributes['aria-label'],'Noel öffnen. Zum Versetzen ziehen.');
  await avatar.setAsset('ice-pair-fine');media.matches=true;assert.equal(avatar.encore(),false);avatar.minimize();assert.equal(avatar.partner.hidden,true);
});

test('The fixed blade line is used at startup, during manual gliding and after viewport changes',async()=>{
  const {avatar,context,advance}=await mascot('ice-pair-fine');
  assert.equal(avatar.y,avatar.size().ground);assert.ok(avatar.y>10);
  assert.equal(avatar.walkTo(120),true);advance(300);assert.equal(avatar.y,avatar.size().ground);
  context.innerWidth=390;avatar.onResize();assert.equal(avatar.y,avatar.size().ground);assert.equal(avatar.walkTo(8),true);
  advance(200);assert.equal(avatar.y,avatar.size().ground);
  context.innerWidth=1200;avatar.onResize();assert.equal(avatar.y,avatar.size().ground);assert.equal(avatar.encore(),true);
  advance(avatar.program.duration+100);assert.equal(avatar.program,null);assert.equal(avatar.y,avatar.size().ground);
});

test('On a very narrow viewport each moving partner renders their own closing skating steps',async()=>{
  const {avatar,context,advance}=await mascot('ice-pair-fine');context.innerWidth=184;context.innerHeight=180;avatar.onResize();
  assert.equal(avatar.encore(),true);const exit=avatar.program.blocks.find(b=>b.part==='exit');
  advance(exit.start+exit.duration*.5);assert.equal(avatar.programFrame.phase,'feature-exit');
  const draws=[];avatar.renderer.paint=(element,state,frame,facing,details)=>draws.push({element,details});avatar.drawFrame();
  assert.equal(avatar.programFrame.actors[0].selection.sheet,'glide');
  for(const [i,element] of [[0,avatar.visual],[1,avatar.partnerVisual]]){
    const draw=draws.find(d=>d.element===element),selection=avatar.programFrame.actors[i].selection||avatar.programFrame;
    assert.equal(draw.details.selection,selection);assert.equal(draw.details.selection.sheet,avatar.programFrame.actors[i].selection?'glide':'flow');
  }
});

test('The skeleton automatically shuffles, freezes while reading and switches to the existing pair cleanly',async()=>{
  const {avatar,advance,media,context}=await mascot('shuffle-skeleton');
  avatar.nextRoutine=0;advance(20);assert.equal(avatar.program.kind,'shuffle');assert.equal(avatar.state,'dance-performance');
  const duration=avatar.program.duration;advance(duration+40);assert.equal(avatar.program,null);assert.equal(avatar.y,10);
  avatar.nextRoutine=0;advance(20);assert.equal(avatar.program.mode,'freestyle');advance(avatar.program.duration+40);assert.equal(avatar.program,null);
  avatar.nextRoutine=0;advance(20);assert.equal(avatar.program.mode,'routine');avatar.cancelProgram();
  avatar.perform('running-man');advance(1400);assert.equal(avatar.programFrame.sheet,'running');const x=avatar.x;
  advance(400);assert.equal(avatar.x,x);advance(2000);assert.ok(Math.abs(avatar.x-x)<60);avatar.open();assert.equal(avatar.program,null);assert.equal(avatar.opened,true);
  assert.equal(avatar.perform(),false);avatar.opened=false;assert.equal(avatar.spin(),true);
  context.document.hidden=true;const before=avatar.programElapsed;advance(1000);assert.equal(avatar.programElapsed,before);context.document.hidden=false;
  media.matches=true;avatar.onMotion();assert.equal(avatar.program,null);assert.equal(avatar.perform(),false);
  media.matches=false;avatar.onMotion();await avatar.setAsset('ice-pair-fine');assert.equal(avatar.isDancer(),false);assert.equal(avatar.partner.hidden,false);
  assert.equal(avatar.encore(),true);avatar.open();await avatar.setAsset('shuffle-skeleton');assert.equal(avatar.partner.hidden,true);assert.equal(avatar.pack.entries.length,0);
});
