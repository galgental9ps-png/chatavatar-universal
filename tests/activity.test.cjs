'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const Motion=require('../motion-core.js'),Personality=require('../personality-core.js'),Assets=require('../asset-sets.js');

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
  const context={URL,Map,Set,Promise,Math,Number,String,Error,Infinity,innerWidth:1200,innerHeight:800,performance:{now:()=>clock},
    document:{currentScript:{src:'https://demo.example/avatar.js',dataset:{manual:'true'}},body:new Element('body'),hidden:false,createElement:tag=>new Element(tag),addEventListener(){},removeEventListener(){}},
    matchMedia:()=>media,requestAnimationFrame:()=>1,cancelAnimationFrame(){},CustomEvent:class{},
    setTimeout:(fn,delay)=>{timers.set(++id,{fn,delay});return id;},clearTimeout:timer=>timers.delete(timer),
    JimmyMotion:Motion,JimmyPersonality:Personality,UniversalAvatarAssets:{...Assets,active:Assets.get(assetId)},
    JimmyMascot:{preload:()=>Promise.resolve(),create:()=>new Element('span'),paint(){}},
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
  const frames=new Set();let stopped=false;
  for(let i=0;i<650;i++){advance(20);frames.add(avatar.frame);assert.equal(avatar.y,10);assert.ok(avatar.x>=100&&avatar.x<=982);if(avatar.state==='skate-stop'){stopped=true;break;}}
  assert.ok(stopped);assert.ok(frames.size>=12);avatar.nextWalk=Infinity;advance(600);
  assert.equal(avatar.state,'idle');assert.equal(avatar.x,100);
});

test('A pirouette stays upright on the baseline, finishes by itself, and never becomes an endless gesture',async()=>{
  const {avatar,advance}=await mascot('ice-skater');const x=avatar.x;
  assert.equal(avatar.hop(),true);assert.equal(avatar.state,'spin');
  for(let i=0;i<145;i++){advance(20);assert.equal(avatar.y,10);assert.equal(avatar.x,x);}
  assert.equal(avatar.state,'idle');
  for(const key of ['opened','paused','hidden','drag']){avatar[key]=true;assert.equal(avatar.spin(),false);avatar[key]=false;}
});

test('Opening an answer during a pirouette settles the new asset without an overlay surface',async()=>{
  const {avatar,advance}=await mascot('ice-skater');avatar.spin();advance(900);avatar.open();advance(1000);
  assert.equal(avatar.opened,true);assert.notEqual(avatar.state,'spin');assert.equal(avatar.y,10);
  assert.equal(avatar.asset.environment,'none');assert.equal(avatar.host.dataset.asset,'ice-skater');
});
