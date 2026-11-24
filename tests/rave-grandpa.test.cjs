'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const Assets=require('../asset-sets.js'),Motion=require('../motion-core.js'),Shuffle=require('../shuffle-core.js'),Themes=require('../demo-themes.js');
const opa=Assets.get('rave-grandpa');
const planFor=(mode='routine',width=1200,height=800)=>Shuffle.createPlan({mode,startX:width-230,viewportWidth:width,size:Motion.dimensions(width,opa.motion,height)});
test('Every Rave-Opa move uses one master PNG with 96 complete source poses and one shared size reference',()=>{
 assert.equal(Assets.activeId,opa.id);assert.equal(opa.motion.kind,'shuffle');assert.equal(opa.motion.power,true);
 const files=new Set();
 for(const atlas of [opa.master,...Object.values(opa.master.variants||{})]){
   assert.equal(atlas.actors.length,1);const actor=atlas.actors[0],png=fs.readFileSync(path.join(__dirname,'..',actor.file));
   assert.equal(png.readUInt32BE(16),actor.width);assert.equal(png.readUInt32BE(20),actor.height);assert.equal(png[25],6);files.add(actor.file);
   for(const frames of Object.values(atlas.frames)){assert.equal(frames.length,16);for(const cell of frames)assert.ok(Number.isInteger(cell)&&cell>=0&&cell<atlas.columns*atlas.rows);}
 }
 assert.equal(files.size,1);assert.equal(opa.master.variants,undefined);
 assert.deepEqual([...files],['assets/rave-opa-master-v2.png']);
 assert.equal(new Set(Object.values(opa.master.frames).flat()).size,96);
 const actor=opa.master.actors[0];assert.equal(actor.cellRects.length,96);assert.equal(actor.scaleGroups,undefined);
 for(const rect of actor.cellRects){const [x,y,w,h]=rect;assert.ok(rect.every(Number.isInteger));assert.ok(x>=0&&y>=0&&w>0&&h>0&&x+w<=actor.width&&y+h<=actor.height);}
 assert.equal(new Set(Object.values(opa.sheets).map(s=>s.file)).size,1);assert.equal(Themes.get(opa.id).track,2);
 assert.ok(Themes.get(opa.id).scene.file.includes('warehouse'));
});
test('Both techno sequences include actual running, heel-toe, hand moves, kicks and complete spins within the viewport',()=>{
 for(const width of [184,390,1200,1920])for(const mode of ['routine','freestyle','running-man','spin','hands','charleston']){
   const plan=planFor(mode,width,320),size=Motion.dimensions(width,opa.motion,320),sheets=new Set(),spinViews=new Set();
   for(let t=0;t<plan.duration;t+=17){
     const move=Shuffle.atTime(plan,t),selection=Assets.frameFor(opa,'dance-performance',0,{selection:move});
     const atlas=selection.atlas?opa.master.variants[selection.atlas]:opa.master;
     assert.ok(atlas.frames[selection.sheet][selection.index]>=0);assert.equal(move.lift,0);assert.ok(move.x>=0&&move.x<=width-size.width+.001);sheets.add(move.sheet);
     if(move.sheet==='spin'){spinViews.add(atlas.frames[selection.sheet][move.index]);assert.equal(move.facing,1);}
   }
   if(['routine','freestyle'].includes(mode)){for(const key of ['running','heeltoe','tstep','hands','kicks','slide','spin'])assert.ok(sheets.has(key));assert.equal(spinViews.size,16);}
   assert.equal(Shuffle.atTime(plan,plan.duration+60000).finished,true);
 }
});
test('The Opa has a faster dance clock while Skelly retains both accepted sequences exactly',()=>{
 const size=Motion.dimensions(1200,opa.motion);assert.equal(size.bpm,144);assert.equal(size.power,true);
 const old=Assets.get('shuffle-skeleton'),skelly=Shuffle.createPlan({mode:'routine',startX:970,viewportWidth:1200,size:Motion.dimensions(1200,old.motion)});
 assert.equal(skelly.duration,20000);assert.equal(skelly.blocks[1].atlas,undefined);
 const a=planFor('freestyle'),b=Shuffle.createPlan({mode:'freestyle',startX:970,viewportWidth:1200,size:Motion.dimensions(1200,old.motion)});
 assert.ok(Math.abs(a.duration*1.2-b.duration)<.001);
 assert.ok(planFor('routine').blocks.filter(x=>x.sheet==='running').every(x=>x.atlas==='running'));
});

test('The Opa plants alternating sneakers on each beat and raises the knee between beats without changing tempo or travel',()=>{
 for(const mode of ['routine','freestyle','running-man']){
  const plan=planFor(mode),linear={...plan,power:false},running=plan.blocks.find(b=>b.sheet==='running');
  const cell=beats=>opa.master.frames.running[Shuffle.atTime(plan,running.start+beats*plan.beat).index];
  assert.deepEqual([0,1,2,3].map(cell),[4,12,4,12]);
  assert.deepEqual([.5,1.5,2.5,3.5].map(cell),[8,0,8,0]);
  assert.equal(Shuffle.atTime(plan,running.start+plan.beat/8).index,4,'The planted pose holds briefly on the beat.');
  for(let t=0;t<plan.duration;t+=11){
   const a=Shuffle.atTime(plan,t),b=Shuffle.atTime(linear,t);
   assert.equal(a.x,b.x);assert.equal(a.velocity,b.velocity);assert.equal(a.lift,0);
   assert.ok(Math.abs(a.lean)<=.65);assert.equal(a.finished,b.finished);
  }
  assert.equal(Shuffle.atTime(plan,plan.duration).lean,0);
 }
});

test('Groove weight shifts settle on every beat and action boundary while spins and Skelly remain steady',()=>{
 const plan=planFor('freestyle');
 for(let t=0;t<plan.duration;t+=plan.beat)assert.ok(Math.abs(Shuffle.atTime(plan,t).lean)<1e-10);
 for(const block of plan.blocks){
  const before=Shuffle.atTime(plan,block.end-.001),after=Shuffle.atTime(plan,block.end+.001);
  assert.ok(Math.abs(before.lean-after.lean)<.00002);
  if(block.sheet==='spin')for(let i=0;i<32;i++){
   const move=Shuffle.atTime(plan,block.start+(i+.1)*block.duration/32);
   assert.equal(move.lean,0);assert.equal(move.index,Math.floor((i+.1)*block.cycles/2)%16);
  }
 }
 const old=Assets.get('shuffle-skeleton'),skelly=Shuffle.createPlan({mode:'freestyle',startX:970,viewportWidth:1200,size:Motion.dimensions(1200,old.motion)});
 for(let t=0;t<skelly.duration;t+=17){
  const block=skelly.blocks.find(b=>t<b.end),move=Shuffle.atTime(skelly,t);
  assert.equal(move.index,Math.floor((t-block.start)/block.duration*block.cycles*16)%16);assert.equal(move.lean,undefined);
 }
 assert.equal(Assets.frameFor(opa,'idle',0,{elapsed:1,frozen:true}).index,0);
 assert.equal(Assets.frameFor(opa,'idle',0,{elapsed:60/144}).index,4);
});

test('Both full routines, all gestures and both spin styles render from a single decoded PNG',async()=>{
 const urls=[],draws=[];
 const element=()=>({width:192,height:192,dataset:{},style:{},setAttribute(){},getContext(){return {clearRect(){},drawImage(source){draws.push(source);}};}});
 class Image{set src(url){this.naturalWidth=1024;this.naturalHeight=1536;urls.push(url);queueMicrotask(()=>this.onload());}}
 const window={UniversalAvatarAssets:{...Assets,active:opa},devicePixelRatio:1};
 vm.runInNewContext(fs.readFileSync(require.resolve('../mascot.js'),'utf8'),{window,document:{currentScript:{src:'https://example.test/mascot.js'},createElement:element},Image,URL,setTimeout,clearTimeout});
 const renderer=window.JimmyMascot;await renderer.preload();assert.equal(urls.length,1);
 const canvas=renderer.create(),used=new Set();
 for(const mode of ['routine','freestyle','running-man','spin','hands','charleston']){
  const plan=planFor(mode);
  for(let t=0;t<plan.duration;t+=37){
   const move=Shuffle.atTime(plan,t),selection=Assets.frameFor(opa,'dance-performance',0,{selection:move});
   assert.equal(selection.atlas,undefined);
   renderer.paint(canvas,'dance-performance',0,1,{selection:move});used.add(canvas.dataset.sourceFile);
   assert.equal(canvas.dataset.atlas,'main');
  }
 }
 for(const state of Object.keys(opa.poses)){
  renderer.paint(canvas,state,0,1,{elapsed:1});used.add(canvas.dataset.sourceFile);assert.equal(canvas.dataset.atlas,'main');
 }
 assert.deepEqual([...used],['assets/rave-opa-master-v2.png']);assert.equal(new Set(draws).size,1);
 assert.equal(Assets.frameFor(opa,'dance-performance',0,{selection:{sheet:'spin',atlas:'moves',index:0}}).sheet,'spin-open');
 await renderer.preload();assert.equal(urls.length,1);
});
