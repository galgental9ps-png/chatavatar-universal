'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const Assets=require('../asset-sets.js'),Motion=require('../motion-core.js'),Shuffle=require('../shuffle-core.js');
const asset=Assets.get('shuffle-skeleton');
const planFor=(mode='routine',width=1200,height=800)=>Shuffle.createPlan({mode,startX:width-210,viewportWidth:width,size:Motion.dimensions(width,asset.motion,height)});

test('The child-friendly skeleton has four independent whole-body atlases and no paired canvas',()=>{
  assert.equal(Assets.activeId,asset.id);assert.equal(asset.motion.duet,undefined);
  for(const atlas of [asset.master,...Object.values(asset.master.variants)]){
    assert.equal(atlas.actors.length,1);
    const actor=atlas.actors[0],png=fs.readFileSync(path.join(__dirname,'..',actor.file));
    assert.equal(png.readUInt32BE(16),actor.width);assert.equal(png.readUInt32BE(20),actor.height);
    assert.equal(png[25],6,'The generated PNG keeps its real alpha channel.');
    for(const cells of Object.values(atlas.frames)){
      assert.equal(cells.length,16);for(const cell of cells)assert.ok(cell>=0&&cell<atlas.columns*atlas.rows);
    }
  }
  assert.equal(Assets.frameFor(asset,'idle',5,{elapsed:40,frozen:true}).index,0);
});

test('Running Man alternates complete leg phases, stays on the spot and adds small side travel before returning',()=>{
  const running=planFor('running-man'),seen=new Set();
  let drift=0;
  for(let t=0;t<running.duration;t+=17){const m=Shuffle.atTime(running,t);drift=Math.max(drift,Math.abs(m.x-running.from));assert.equal(m.lift,0);if(m.sheet==='running'){seen.add(m.index);assert.equal(m.atlas,'running');}}
  assert.equal(seen.size,16);
  assert.ok(drift>30&&drift<60);assert.equal(Shuffle.atTime(running,running.duration).x,running.from);
  for(const block of running.blocks.filter(b=>b.sheet==='running'&&b.from===b.to))for(let t=block.start;t<block.end;t+=53)assert.equal(Shuffle.atTime(running,t).x,block.from);
  const cells=asset.master.variants.running.frames.running;
  assert.ok(cells.slice(0,6).every(c=>c<8),'The first leg follows its planted and sliding phases.');
  assert.ok(cells.slice(7,14).every(c=>c>=8),'The opposite leg uses the explicitly redrawn second half.');
});

test('Both closed and open-arm full spins progress through front, side and back views in one direction',()=>{
  const spin=planFor('spin'),block=spin.blocks.find(b=>b.sheet==='spin'),views=[];
  for(const block of spin.blocks.filter(b=>b.sheet==='spin'))for(let i=0;i<32;i++){
    const move=Shuffle.atTime(spin,block.start+(i+.1)*block.duration/32);assert.equal(move.facing,1);assert.equal(move.x,spin.from);
    views.push(asset.master.variants[move.atlas].frames.spin[move.index]);
  }
  assert.deepEqual(views.filter((v,i)=>!i||v!==views[i-1]),Array.from({length:32},(_,i)=>i%8));
});

test('Shuffle routines keep lateral steps grounded, continuous and inside desktop and mobile viewports',()=>{
  for(const width of [184,390,1200,1920])for(const mode of ['routine','freestyle','t-step','slides','kicks','heeltoe','charleston','hands']){
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
    if(mode==='freestyle'){
      for(const sheet of ['running','tstep','slide','spin','kicks','heeltoe','charleston','hands'])assert.ok(phases.has(sheet));
      assert.equal(plan.blocks.filter(b=>b.sheet==='spin').reduce((n,b)=>n+b.cycles,0),5);
    }
    assert.equal(Shuffle.atTime(plan,plan.duration+60000).finished,true);
  }
});

test('The first shuffle sequence retains its published poses, timing and order beside the new freestyle',()=>{
  const first=planFor('routine');assert.equal(first.duration,20000);
  assert.deepEqual(first.blocks.map(b=>b.sheet),['groove','running','tstep','running','slide','spin','kicks','running','groove']);
  assert.deepEqual(first.blocks.map(b=>b.duration),[1000,4000,2000,2000,2000,2000,2000,4000,1000]);
  for(const block of first.blocks.filter(b=>b.sheet==='running')){assert.equal(block.atlas,undefined);assert.equal(block.to,block.from);}
  const second=planFor('freestyle');assert.equal(second.duration,26000);
  assert.ok(second.blocks.some(b=>b.sheet==='running'&&b.atlas==='running'&&b.from!==b.to));
});

test('A solo action renderer preloads both atlases once and draws one full figure in the hero and moving canvas',async()=>{
  const urls=[],draws=[];
  function element(){return {width:192,height:192,dataset:{},style:{},setAttribute(){},getContext(){return {clearRect(){},drawImage(...args){draws.push(args);}};}};}
  class Image{set src(url){this.naturalWidth=url.includes('running-v2')?1254:887;this.naturalHeight=url.includes('running-v2')?1254:1774;urls.push(url);queueMicrotask(()=>this.onload());}}
  const window={UniversalAvatarAssets:{...Assets,active:asset},devicePixelRatio:1};
  vm.runInNewContext(fs.readFileSync(require.resolve('../mascot.js'),'utf8'),{window,document:{currentScript:{src:'https://example.test/mascot.js'},createElement:element},Image,URL,setTimeout,clearTimeout});
  await window.JimmyMascot.preload();assert.equal(urls.length,4);
  for(const actor of [undefined,0]){draws.length=0;const canvas=window.JimmyMascot.create(actor);assert.equal(draws.length,1);assert.equal(canvas.dataset.sourceFile,'assets/skelly-tricks-v1.png');}
  await window.JimmyMascot.preload();assert.equal(urls.length,4);
});
