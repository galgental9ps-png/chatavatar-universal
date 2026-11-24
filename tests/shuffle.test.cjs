'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const Assets=require('../asset-sets.js'),Motion=require('../motion-core.js'),Shuffle=require('../shuffle-core.js');
const asset=Assets.get('shuffle-skeleton');
const planFor=(mode='routine',width=1200,height=800)=>Shuffle.createPlan({mode,startX:width-210,viewportWidth:width,size:Motion.dimensions(width,asset.motion,height)});

test('The child-friendly skeleton has two independent sharp whole-body PNG atlases and no paired canvas',()=>{
  assert.equal(Assets.activeId,asset.id);assert.equal(asset.motion.duet,undefined);
  for(const atlas of [asset.master,asset.master.variants.encore]){
    assert.equal(atlas.actors.length,1);
    const actor=atlas.actors[0],png=fs.readFileSync(path.join(__dirname,'..',actor.file));
    assert.equal(png.readUInt32BE(16),actor.width);assert.equal(png.readUInt32BE(20),actor.height);
    assert.equal(png[25],6,'The generated PNG keeps its real alpha channel.');
    for(const cells of Object.values(atlas.frames)){
      assert.equal(cells.length,16);for(const cell of cells)assert.ok(cell>=0&&cell<32);
    }
  }
  assert.equal(Assets.frameFor(asset,'idle',5,{elapsed:40,frozen:true}).index,0);
});

test('Running Man stays on the spot and full spins progress through all eight front, side and back views',()=>{
  const running=planFor('running-man'),seen=new Set();
  for(let t=0;t<running.duration;t+=17){const m=Shuffle.atTime(running,t);assert.equal(m.x,running.from);assert.equal(m.lift,0);if(m.sheet==='running')seen.add(m.index);}
  assert.equal(seen.size,16);
  const spin=planFor('spin'),block=spin.blocks.find(b=>b.sheet==='spin'),views=[];
  for(let i=0;i<64;i++){
    const move=Shuffle.atTime(spin,block.start+(i+.1)*block.duration/64);
    assert.equal(move.facing,1);assert.equal(move.x,spin.from);
    views.push(asset.master.variants.encore.frames.spin[move.index]);
  }
  assert.deepEqual(views.filter((v,i)=>!i||v!==views[i-1]),Array.from({length:32},(_,i)=>i%8));
});

test('Shuffle routines keep lateral steps grounded, continuous and inside desktop and mobile viewports',()=>{
  for(const width of [184,390,1200,1920])for(const mode of ['routine','t-step','slides','kicks']){
    const plan=planFor(mode,width,300),size=Motion.dimensions(width,asset.motion,300),phases=new Set();
    for(let t=0;t<=plan.duration;t+=13){
      const m=Shuffle.atTime(plan,t);assert.ok(m.x>=0&&m.x<=width-size.width+.0001);assert.equal(m.lift,0);
      const frame=Assets.frameFor(asset,'dance-performance',0,{selection:m});
      const atlas=frame.atlas?asset.master.variants[frame.atlas]:asset.master;
      assert.ok(atlas.frames[frame.sheet][frame.index]>=0);phases.add(m.sheet);
    }
    for(let i=1;i<plan.blocks.length;i++){
      const t=plan.blocks[i].start,a=Shuffle.atTime(plan,t-.001),b=Shuffle.atTime(plan,t+.001);
      assert.ok(Math.abs(a.x-b.x)<.001);assert.ok(a.velocity<.001&&b.velocity<.001);
    }
    if(mode==='routine')for(const sheet of ['running','tstep','slide','spin','kicks'])assert.ok(phases.has(sheet));
    assert.equal(Shuffle.atTime(plan,plan.duration+60000).finished,true);
  }
});

test('A solo action renderer preloads both atlases once and draws one full figure in the hero and moving canvas',async()=>{
  const urls=[],draws=[];
  function element(){return {width:192,height:192,dataset:{},style:{},setAttribute(){},getContext(){return {clearRect(){},drawImage(...args){draws.push(args);}};}};}
  class Image{constructor(){this.naturalWidth=887;this.naturalHeight=1774;}set src(url){urls.push(url);queueMicrotask(()=>this.onload());}}
  const window={UniversalAvatarAssets:{...Assets,active:asset},devicePixelRatio:1};
  vm.runInNewContext(fs.readFileSync(require.resolve('../mascot.js'),'utf8'),{window,document:{currentScript:{src:'https://example.test/mascot.js'},createElement:element},Image,URL,setTimeout,clearTimeout});
  await window.JimmyMascot.preload();assert.equal(urls.length,2);
  for(const actor of [undefined,0]){draws.length=0;const canvas=window.JimmyMascot.create(actor);assert.equal(draws.length,1);assert.equal(canvas.dataset.sourceFile,'assets/skelly-tricks-v1.png');}
  await window.JimmyMascot.preload();assert.equal(urls.length,2);
});
