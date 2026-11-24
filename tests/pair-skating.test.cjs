'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const Assets=require('../asset-sets.js'),Motion=require('../motion-core.js'),Skating=require('../skating-core.js');
const pair=Assets.get('ice-pair');
const makePlan=(mode,width=1200,height=800)=>Skating.createPlan({mode,viewportWidth:width,viewportHeight:height,startX:width-240,facing:1,size:Motion.dimensions(width,pair.motion,height)});

test('Two distinct alpha PNGs supply 32 complete single-person poses each, with larger source cells',()=>{
  assert.equal(pair.master.actors.length,2);assert.equal(new Set(pair.master.actors.map(a=>a.file)).size,2);
  for(const actor of pair.master.actors){
    const png=fs.readFileSync(path.join(__dirname,'..',actor.file));
    assert.deepEqual([...png.subarray(0,8)],[137,80,78,71,13,10,26,10]);
    assert.equal(png.readUInt32BE(16),actor.width);assert.equal(png.readUInt32BE(20),actor.height);assert.equal(png[25],6);
    assert.equal(actor.width/4,actor.height/8);assert.ok(actor.width/4>200);
  }
  assert.equal(pair.master.columns,4);assert.equal(pair.master.rows,8);assert.equal(pair.master.file,undefined);
  const used=new Set();
  for(const key of Object.keys(pair.sheets))for(const cell of pair.master.frames[key]){assert.ok(cell>=0&&cell<32);used.add(cell);}
  assert.equal(used.size,32);assert.ok(!JSON.stringify(pair).includes('ice-pair-master-v1.png'));
});

test('The pair alternates joined dancing, separate synchronous spins, inward jumps and a joined finale',()=>{
  for(const [width,height] of [[1200,800],[390,700],[184,180]]){
    const plan=makePlan('routine',width,height),size=Motion.dimensions(width,pair.motion,height),phases=[];
    for(let t=0;t<plan.duration;t+=10){
      const m=Skating.atTime(plan,t);if(phases.at(-1)!==m.phase)phases.push(m.phase);
      assert.ok(m.x>=0&&m.x+size.width<=width);assert.ok(m.lift>=0&&m.lift+size.height+10<=height);
      assert.ok(m.velocity<=size.performanceSpeed+.01);
      if(m.actors){
        const [a,b]=m.actors;assert.ok(a.x>=0&&b.x+size.actorWidth<=width+.001);assert.ok(a.x<b.x);
        const cell=pair.master.frames[m.sheet][m.index];assert.ok(cell>=0&&cell<32);
      }
    }
    if(width>200){
      const order=['duet-open','duet-spin','duet-speed','duet-air-turn','duet-landing-exit','duet-rejoin','spiral','bow'];
      let last=-1;for(const phase of order){const index=phases.indexOf(phase);assert.ok(index>last,phase);last=index;}
      const duet=plan.blocks.find(b=>b.kind==='duet'&&b.part==='converge');
      const t=duet.start+duet.approach+duet.air*.5,first=Skating.atTime(plan,t),later=Skating.atTime(plan,t+10);
      assert.ok(first.lift>0&&later.lift>0);assert.ok(later.actors[0].x>first.actors[0].x);assert.ok(later.actors[1].x<first.actors[1].x);
      assert.equal(first.actors[0].facing,1);assert.equal(first.actors[1].facing,-1,'The two independent people face toward one another.');
      const spin=plan.blocks.find(b=>b.kind==='duet'&&b.part==='spin'),m=Skating.atTime(plan,spin.start+spin.duration*.5);
      assert.equal(m.lift,0);assert.ok(m.actors[1].x-m.actors[0].x>size.spacing);
    }else assert.ok(!phases.some(p=>p.startsWith('duet-')),'Very narrow screens reduce separation without merging the people.');
    const end=Skating.atTime(plan,plan.duration+1000);assert.equal(end.finished,true);assert.equal(end.actors.length,2);assert.equal(end.index,0);
  }
});

test('Separate spins and inward jumps finish, and skipped frames cannot strand either partner',()=>{
  for(const mode of ['duet','spin','jump']){
    const plan=makePlan(mode),end=Skating.atTime(plan,plan.duration+60000);
    assert.equal(end.finished,true);assert.equal(end.lift,0);assert.equal(end.actors.length,2);
    const separate=plan.blocks.filter(b=>b.kind==='duet');
    assert.equal(separate.some(b=>b.part==='spin'),mode!=='jump');
    assert.equal(separate.some(b=>b.part==='converge'&&b.jump),mode!=='spin');
    for(let i=1;i<separate.length;i++){
      const a=separate[i-1],b=separate[i];
      const before=Skating.atTime(plan,a.end-.001),after=Skating.atTime(plan,b.start+.001);
      for(let actor=0;actor<2;actor++)assert.ok(Math.abs(before.actors[actor].x-after.actors[actor].x)<.001);
    }
  }
});

test('The outward glide uses full skating strokes on smooth mirrored curves, then settles upright before spinning',()=>{
  const plan=makePlan('duet'),block=plan.blocks.find(b=>b.kind==='duet'&&b.part==='open'),cells=new Set();
  let previous,maximumDepth=0;
  for(let t=0;t<=block.duration;t+=10){
    const move=Skating.atTime(plan,block.start+t),[a,b]=move.actors;
    assert.equal(move.lift,0,'The shallow curve is a path over the ice, not another jump.');
    assert.equal(a.depth||0,b.depth||0);maximumDepth=Math.max(maximumDepth,a.depth||0);
    if(move.sheet==='glide')cells.add(pair.master.frames.glide[move.index]);
    if(move.phase==='duet-open'){
      assert.ok(a.lean<=0&&b.lean>=0);assert.ok(Math.abs(a.lean)<=2.4);
      if(previous)assert.ok(Math.abs((a.depth||0)-(previous.depth||0))<1,'No vertical step between sampled frames.');
    }
    previous=a;
  }
  assert.ok(cells.size>=6,'Outward motion uses a real multi-pose skating cycle.');assert.ok(maximumDepth>20&&maximumDepth<=32);
  const first=Skating.atTime(plan,block.start),last=Skating.atTime(plan,block.end-.001),next=Skating.atTime(plan,block.end+.001);
  assert.ok(first.actors[0].depth<.001);assert.ok(last.actors[0].depth<.001);assert.equal(next.actors[0].depth,0);
  assert.equal(pair.master.frames[last.sheet][last.index],23,'Extend gently into the upright turn stance.');
});

test('Each avatar loads its own PNG and draws a whole source cell at the same phase and scale',async()=>{
  const calls=[],urls=[];
  const canvas=()=>({style:{},dataset:{},width:0,height:0,setAttribute(){},getBoundingClientRect(){return{width:208};},getContext(){return{clearRect(){},drawImage(...args){calls.push(args);}};}});
  class Image{constructor(){this.naturalWidth=887;this.naturalHeight=1774;}set src(url){this.url=url;urls.push(url);queueMicrotask(()=>this.onload());}}
  const window={UniversalAvatarAssets:Assets,devicePixelRatio:2};
  vm.runInNewContext(fs.readFileSync(require.resolve('../mascot.js'),'utf8'),{window,document:{currentScript:{src:'https://example.test/mascot.js'},createElement:canvas},Image,URL,setTimeout,clearTimeout});
  const renderer=window.JimmyMascot.forAsset('ice-pair');await renderer.preload();const a=renderer.create(0),b=renderer.create(1);calls.length=0;
  for(const [actor,element] of [[0,a],[1,b]])renderer.paint(element,'skate-performance',0,1,{actor,selection:{sheet:'spin',index:4}});
  assert.equal(urls.length,2);assert.equal(calls.length,2);assert.equal(a.dataset.frame,b.dataset.frame);
  assert.ok(urls[0].endsWith('aurora-action-v1.png'));assert.ok(urls[1].endsWith('noel-action-v1.png'));
  assert.notEqual(calls[0][0],calls[1][0]);const cw=887/4;
  assert.equal(calls[0][1],calls[1][1]);assert.equal(calls[0][2],calls[1][2]);
  for(const c of calls){assert.equal(c[3],cw);assert.equal(c[4],cw);assert.deepEqual(c.slice(5),[0,0,416,416]);}
  await renderer.preload();assert.equal(urls.length,2,'Repeated selections reuse both decoded PNGs.');
});

test('An unavailable individual PNG rejects the pair load without substituting the old combined atlas',async()=>{
  const urls=[];class Image{set src(url){urls.push(url);queueMicrotask(()=>this.onerror());}}
  const window={UniversalAvatarAssets:Assets};
  vm.runInNewContext(fs.readFileSync(require.resolve('../mascot.js'),'utf8'),{window,document:{currentScript:{src:'https://example.test/mascot.js'}},Image,URL,setTimeout,clearTimeout});
  await assert.rejects(window.JimmyMascot.forAsset('ice-pair').preload(),/Action-PNG/);assert.equal(urls.length,2);assert.ok(urls.every(u=>!u.includes('ice-pair-master')));
});
