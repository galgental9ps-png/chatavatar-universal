'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const Assets=require('../asset-sets.js'),Motion=require('../motion-core.js'),Skating=require('../skating-core.js');
const pair=Assets.get('ice-pair');
const makePlan=(mode,width=1200,height=800)=>Skating.createPlan({mode,viewportWidth:width,viewportHeight:height,startX:width-240,facing:1,size:Motion.dimensions(width,pair.motion,height)});

test('One alpha PNG supplies the complete pair and all isolated whole-body poses',()=>{
  const png=fs.readFileSync(path.join(__dirname,'..',pair.master.file));
  assert.deepEqual([...png.subarray(0,8)],[137,80,78,71,13,10,26,10]);
  assert.equal(png.readUInt32BE(16),pair.master.width);assert.equal(png.readUInt32BE(20),pair.master.height);assert.equal(png[25],6);
  assert.equal(pair.master.columns,8);assert.equal(pair.master.rows,8);
  const used=new Set();
  for(const key of Object.keys(pair.sheets))for(const cell of pair.master.frames[key]){assert.ok(cell>=0&&cell<64);used.add(cell);}
  assert.equal(used.size,64);assert.equal(new Set(Object.values(pair.sheets).map(s=>s.file)).size,1);
});

test('The pair alternates joined dancing, separate synchronous spins, inward jumps and a joined finale',()=>{
  for(const [width,height] of [[1200,800],[390,700],[184,180]]){
    const plan=makePlan('routine',width,height),size=Motion.dimensions(width,pair.motion,height),phases=[];
    for(let t=0;t<plan.duration;t+=10){
      const m=Skating.atTime(plan,t);if(phases.at(-1)!==m.phase)phases.push(m.phase);
      assert.ok(m.x>=0&&m.x+size.width<=width);assert.ok(m.lift>=0&&m.lift+size.height+10<=height);
      assert.ok(m.velocity<=size.performanceSpeed+.01);
      if(m.actors){
        const [a,b]=m.actors;assert.ok(a.x>=0&&b.x+size.width<=width);assert.ok(a.x<b.x);
        const cell=pair.master.frames[m.sheet][m.index];assert.ok(cell>=16&&cell<=47,'Only non-overlapping full bodies may be separated.');
      }
    }
    if(width>200){
      const order=['duet-open','duet-spin','duet-speed','duet-air-turn','duet-landing-exit','duet-rejoin','spiral','bow'];
      let last=-1;for(const phase of order){const index=phases.indexOf(phase);assert.ok(index>last,phase);last=index;}
      const duet=plan.blocks.find(b=>b.kind==='duet'&&b.part==='converge');
      const t=duet.start+duet.approach+duet.air*.5,first=Skating.atTime(plan,t),later=Skating.atTime(plan,t+10);
      assert.ok(first.lift>0&&later.lift>0);assert.ok(later.actors[0].x>first.actors[0].x);assert.ok(later.actors[1].x<first.actors[1].x);
      assert.equal(first.actors[0].facing,first.actors[1].facing,'The source already contains opposite inward-facing bodies.');
      const spin=plan.blocks.find(b=>b.kind==='duet'&&b.part==='spin'),m=Skating.atTime(plan,spin.start+spin.duration*.5);
      assert.equal(m.lift,0);assert.ok(m.actors[1].x-m.actors[0].x>size.width*.8);
    }else assert.ok(!phases.some(p=>p.startsWith('duet-')),'Very narrow screens keep the entire pair together.');
    const end=Skating.atTime(plan,plan.duration+1000);assert.equal(end.finished,true);assert.equal(end.actors,undefined);assert.equal(end.index,0);
  }
});

test('Separate spins and inward jumps finish, and skipped frames cannot strand either partner',()=>{
  for(const mode of ['duet','spin','jump']){
    const plan=makePlan(mode),end=Skating.atTime(plan,plan.duration+60000);
    assert.equal(end.finished,true);assert.equal(end.lift,0);assert.equal(end.actors,undefined);
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

test('Both partners use the same source cell and scale, each drawn as one complete figure',async()=>{
  const calls=[],urls=[];
  const canvas=()=>({style:{},dataset:{},width:0,height:0,setAttribute(){},getBoundingClientRect(){return{width:208};},getContext(){return{clearRect(){},drawImage(...args){calls.push(args);}};}});
  class Image{constructor(){this.naturalWidth=this.naturalHeight=pair.master.width;}set src(url){urls.push(url);queueMicrotask(()=>this.onload());}}
  const window={UniversalAvatarAssets:Assets,devicePixelRatio:2};
  vm.runInNewContext(fs.readFileSync(require.resolve('../mascot.js'),'utf8'),{window,document:{currentScript:{src:'https://example.test/mascot.js'},createElement:canvas},Image,URL,setTimeout,clearTimeout});
  const renderer=window.JimmyMascot.forAsset('ice-pair');await renderer.preload();const a=renderer.create(),b=renderer.create();calls.length=0;
  for(const [actor,element] of [[0,a],[1,b]])renderer.paint(element,'skate-performance',0,1,{actor,selection:{sheet:'spin',index:4}});
  assert.equal(urls.length,1);assert.equal(calls.length,2);assert.equal(a.dataset.frame,b.dataset.frame);
  const cw=pair.master.width/8;assert.equal(calls[1][1]-calls[0][1],cw/2);assert.equal(calls[0][2],calls[1][2]);
  for(const c of calls){assert.equal(c[3],cw/2);assert.equal(c[4],cw);assert.deepEqual(c.slice(5),[104,0,208,416]);}
  assert.throws(()=>renderer.paint(a,'walk',0,1,{actor:0,selection:{sheet:'glide',index:0}}),/vollständiges Paar/);
});

test('An unavailable pair PNG rejects loading instead of substituting an unrelated atlas row',async()=>{
  const urls=[];class Image{set src(url){urls.push(url);queueMicrotask(()=>this.onerror());}}
  const window={UniversalAvatarAssets:Assets};
  vm.runInNewContext(fs.readFileSync(require.resolve('../mascot.js'),'utf8'),{window,document:{currentScript:{src:'https://example.test/mascot.js'}},Image,URL,setTimeout,clearTimeout});
  await assert.rejects(window.JimmyMascot.forAsset('ice-pair').preload(),/Master-Atlas/);assert.equal(urls.length,1);
});
