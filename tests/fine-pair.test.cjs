'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const Assets=require('../asset-sets.js'),Motion=require('../motion-core.js'),Skating=require('../skating-core.js');
const pair=Assets.get('ice-pair-fine');
const planFor=(mode='feature',w=1200,h=800)=>Skating.createPlan({mode,viewportWidth:w,viewportHeight:h,startX:w-240,facing:1,size:Motion.dimensions(w,pair.motion,h)});

test('The minimalist pair has four distinct whole-person action PNGs and valid independent mappings',()=>{
  assert.equal(Assets.activeId,'ice-pair-fine');
  const files=new Set();
  for(const atlas of [pair.master,pair.master.variants.encore]){
    assert.equal(atlas.actors.length,2);assert.equal(atlas.columns,4);assert.equal(atlas.rows,8);
    for(const actor of atlas.actors){
      files.add(actor.file);const png=fs.readFileSync(path.join(__dirname,'..',actor.file));
      assert.deepEqual([...png.subarray(0,8)],[137,80,78,71,13,10,26,10]);assert.equal(png[25],6);
      assert.equal(png.readUInt32BE(16),actor.width);assert.equal(png.readUInt32BE(20),actor.height);
      for(const cells of Object.values(actor.frames||atlas.frames)){
        assert.equal(cells.length,16);for(const c of cells)assert.ok(Number.isInteger(c)&&c>=0&&c<32);
      }
      if(actor.rowBounds){assert.equal(actor.rowBounds.length,9);assert.equal(actor.rowBounds[0],0);assert.equal(actor.rowBounds.at(-1),actor.height);for(let i=1;i<9;i++)assert.ok(actor.rowBounds[i]>actor.rowBounds[i-1]);}
    }
  }
  assert.equal(files.size,4);assert.equal(new Set(pair.master.variants.encore.frames.spin).size,16);
  assert.ok(![...files].some(f=>/aurora|noel/.test(f)));
});

test('Lina stays on one spot for three turns while Elio completes two oval circuits with correct front/back ordering',()=>{
  for(const [w,h] of [[1200,800],[390,700],[184,180]]){
    const plan=planFor('feature',w,h),size=Motion.dimensions(w,pair.motion,h),orbit=plan.blocks.find(b=>b.part==='orbit');
    const woman=Skating.atTime(plan,orbit.start).actors[0],side=new Set(),layers=new Set(),frames=new Set();
    for(let i=0;i<=1600;i++){
      const m=Skating.atTime(plan,orbit.start+orbit.duration*Math.min(i/1600,.999999));
      assert.equal(m.phase,'feature-orbit');assert.equal(m.actors[0].x,woman.x);assert.equal(m.actors[0].depth||0,0);
      assert.equal(m.atlas,'encore');frames.add(m.index);
      for(const a of m.actors){assert.ok(a.x>=0&&a.x+size.actorWidth<=w+.001);assert.ok(m.lift+(a.depth||0)>=-.001);assert.ok(m.lift+(a.depth||0)+size.height+10<=h);}
      const b=m.actors[1];side.add(Math.sign(b.x-woman.x));layers.add(b.layer);assert.equal(b.selection.atlas,'encore');
      if(b.depth>0)assert.ok(b.layer<m.actors[0].layer);else assert.ok(b.layer>m.actors[0].layer);
    }
    assert.ok(side.has(-1)&&side.has(1));assert.deepEqual(layers,new Set([1,3]));assert.equal(frames.size,16);
    for(const fraction of [.5,1]){
      const m=Skating.atTime(plan,orbit.start+orbit.duration*fraction-.0001);
      assert.ok(Math.abs(m.actors[1].x-(woman.x+orbit.radius))<.001);
    }
  }
});

test('The feature sequence joins smoothly, synchronizes again and finishes with Elio standing beside Lina',()=>{
  const plan=planFor();
  for(let i=1;i<plan.blocks.length;i++){
    const b=plan.blocks[i],before=Skating.atTime(plan,b.start-.0001),after=Skating.atTime(plan,b.start+.0001);
    for(let a=0;a<2;a++){
      assert.ok(Math.abs(before.actors[a].x-after.actors[a].x)<.01,`Continuous x before ${b.part||b.kind}`);
      assert.ok(Math.abs((before.lift+(before.actors[a].depth||0))-(after.lift+(after.actors[a].depth||0)))<.01,`Continuous height before ${b.part||b.kind}`);
    }
  }
  const sync=plan.blocks.find(b=>b.kind==='pass'&&b.phases[0].atlas==='encore');
  const m=Skating.atTime(plan,sync.start+sync.duration*.5);assert.equal(m.atlas,'encore');assert.equal(m.sheet,'glide');assert.equal(m.actors[0].facing,m.actors[1].facing);
  const finish=plan.blocks.at(-1),rest=Skating.atTime(plan,finish.start+finish.duration*.6);
  assert.equal(rest.phase,'feature-finish');assert.equal(rest.actors[1].selection.sheet,'poses');assert.equal(rest.actors[1].selection.index,0);
  const end=Skating.atTime(plan,plan.duration+60000);assert.equal(end.finished,true);assert.equal(end.lift,0);assert.equal(end.actors.length,2);
  for(let i=0;i<2;i++)assert.ok(Math.abs(Skating.atTime(plan,plan.duration-.0001).actors[i].x-end.actors[i].x)<.001);
  assert.throws(()=>Skating.createPlan({mode:'feature',viewportWidth:1200,viewportHeight:800,size:Motion.dimensions(1200,Assets.get('ice-pair').motion)}),/Unbekannte/);
});

test('The new pair has smaller, gently eased jumps without changing the existing pair profile',()=>{
  const fine=planFor('jump'),old=Skating.createPlan({mode:'jump',viewportWidth:1200,viewportHeight:800,size:Motion.dimensions(1200,Assets.get('ice-pair').motion)});
  assert.ok(fine.jumpHeight<old.jumpHeight*.7);assert.equal(old.jumpHeight,192*.43);assert.equal(fine.edgeLean,1.1);assert.equal(old.edgeLean,2.4);
  const first=Skating.jumpAt(.240001,54,1,true),apex=Skating.jumpAt(.53,54,1,true),last=Skating.jumpAt(.819999,54,1,true);
  assert.ok(first.lift<.00001&&last.lift<.00001);assert.ok(Math.abs(apex.lift-54)<.00001);
  const open=fine.blocks.find(b=>b.part==='open');for(let i=0;i<20;i++)assert.equal(Skating.atTime(fine,open.start+open.duration*i/20).actors[0].depth,0);
});

test('Both atlases preload once, render whole figures independently and keep one anatomical scale for bent poses',async()=>{
  const raw=new Uint8ClampedArray(80*160*4),calls=[],saved=[],urls=[];
  for(let i=0;i<raw.length;i+=4){raw[i]=raw[i+1]=raw[i+2]=250;raw[i+3]=30;}
  for(let row=0;row<8;row++)for(let col=0;col<4;col++){
    const top=row===1?8:3;for(let y=top;y<18;y++)for(let x=6;x<14;x++){const p=((row*20+y)*80+col*20+x)*4;raw[p]=160;raw[p+1]=130;raw[p+2]=120;raw[p+3]=255;}
  }
  const mini={...pair,id:'mini',master:{...pair.master,actors:pair.master.actors.map(a=>({...a,width:80,height:160,rowBounds:undefined})),variants:{encore:{...pair.master.variants.encore,actors:pair.master.variants.encore.actors.map(a=>({...a,width:80,height:160}))}}}};
  const catalog={active:mini,get:()=>mini,frameFor:Assets.frameFor};
  function canvas(){return {style:{},dataset:{},width:0,height:0,setAttribute(){},getBoundingClientRect(){return{width:192};},getContext(){return{clearRect(){},drawImage(...args){calls.push(args);},getImageData(){return{data:raw.slice()};},putImageData(pixels){saved.push(pixels.data);}};}};}
  class Image{constructor(){this.naturalWidth=80;this.naturalHeight=160;}set src(url){urls.push(url);queueMicrotask(()=>this.onload());}}
  const window={UniversalAvatarAssets:catalog,devicePixelRatio:1};
  vm.runInNewContext(fs.readFileSync(require.resolve('../mascot.js'),'utf8'),{window,document:{currentScript:{src:'https://example.test/mascot.js'},createElement:canvas},Image,URL,setTimeout,clearTimeout});
  const renderer=window.JimmyMascot;await renderer.preload();assert.equal(urls.length,4);assert.equal(saved.length,4);assert.ok(saved.every(p=>p[3]===0));
  const a=renderer.create(0),b=renderer.create(1);calls.length=0;
  renderer.paint(a,'idle',0,1,{actor:0});a._frameKey=null;renderer.paint(a,'idle',0,1,{actor:0});const standing=calls.at(-1);
  renderer.paint(a,'walk',0,1,{actor:0,selection:{sheet:'glide',index:0}});const bent=calls.at(-1);
  assert.equal(standing[7],bent[7]);assert.equal(standing[8],bent[8],'A bent body is not rescaled to standing height.');
  calls.length=0;for(const [i,e] of [[0,a],[1,b]])renderer.paint(e,'spin',0,1,{actor:i,selection:{atlas:'encore',sheet:'spin',index:4}});
  assert.equal(calls.length,2);assert.notEqual(calls[0][0],calls[1][0]);assert.ok(a.dataset.sourceFile.endsWith('lina-encore-v1.png'));assert.ok(b.dataset.sourceFile.endsWith('elio-encore-v1.png'));
  await renderer.preload();assert.equal(urls.length,4);
  assert.equal(Assets.frameFor(pair,'idle',0,{selection:{atlas:'encore',sheet:'speed',index:0}}).atlas,undefined);
});
