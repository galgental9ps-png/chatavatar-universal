'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const Assets=require('../asset-sets.js'),Motion=require('../motion-core.js'),P=require('../personality-core.js');

test('A single active selection resolves complete sets while preserving the monkey set',()=>{
  assert.equal(Assets.activeId,'ice-skater');assert.equal(Assets.active.name,'Lumi');assert.equal(Assets.get('jimmy').motion.kind,'walk');
  assert.throws(()=>Assets.get('missing'),/Unbekanntes/);
  for(const asset of Object.values(Assets.sets)){
    assert.ok(Object.isFrozen(asset));assert.equal(asset.environment,'none');
    for(const sheet of Object.values(asset.sheets))assert.ok(fs.existsSync(path.join(__dirname,'..',sheet.file)));
    for(const state of ['idle','wave','talk','point','jump','held','rest','celebrate','fall','land','spin','skate-stop'])for(let i=0;i<80;i++){
      const pose=Assets.frameFor(asset,state,i%16,{elapsed:i/20,style:i%2?'spiral':'glide',remaining:i/30});
      assert.ok(asset.sheets[pose.sheet],state);assert.ok(pose.index>=0&&pose.index<asset.sheets[pose.sheet].columns*asset.sheets[pose.sheet].rows,state);
    }
  }
});

test('The skater uses complete glide, spiral and upright-turn frames rather than a walking sheet',()=>{
  const asset=Assets.get('ice-skater'),seen=new Set();
  for(let i=0;i<16;i++){
    assert.deepEqual(Assets.frameFor(asset,'walk',i,{elapsed:1,style:'glide'}),{sheet:'glide',index:i});
    const pose=Assets.frameFor(asset,'spin',0,{elapsed:.2+(i+.05)/32*2.15});assert.equal(pose.sheet,'spin');seen.add(pose.index);
  }
  assert.equal(seen.size,16);
  assert.equal(Assets.frameFor(asset,'walk',0,{elapsed:1,style:'spiral',remaining:2}).sheet,'spiral');
  assert.equal(Assets.frameFor(asset,'spin',0,{elapsed:2.74}).sheet,'poses');
});

test('Skating accelerates gently, stays within its target and uses a scaled sixteen-frame stride',()=>{
  const size=Motion.dimensions(1400,Assets.get('ice-skater').motion),regular=Motion.dimensions(1400);
  assert.ok(size.acceleration<regular.acceleration);assert.equal(size.frames,16);
  let state={x:200,target:800,velocity:0,distance:0};
  for(let i=0;i<1200;i++){state=Motion.walkStep(state,1/60,size);assert.ok(state.x>=200&&state.x<=800);if(state.arrived)break;}
  assert.ok(state.arrived);assert.equal(Motion.frameAtDistance(size.stride,size.stride,size.frames),0);
  assert.ok(Motion.dimensions(200,Assets.active.motion,180).height+10<=180);
});

test('Changing the set changes the asides along with the artwork',()=>{
  const pool=Assets.get('ice-skater').personality,deck=P.createDeck(()=>.5,pool);
  for(const kind of Object.keys(pool))assert.ok(pool[kind].includes(deck.next(kind)));
  assert.ok(!Object.values(pool).flat().some(line=>/Banane|Schwanz/.test(line)));
});

test('Each pirouette view renders one opaque complete illustration without rotating a flat image',async()=>{
  const calls=[];
  function canvas(){return {style:{},dataset:{},width:0,height:0,setAttribute(){},getContext(){return {clearRect(){},drawImage(...args){calls.push({args,alpha:this.globalAlpha});},globalAlpha:1};}};}
  class Image{constructor(){this.width=this.height=this.naturalWidth=this.naturalHeight=400;}set src(value){this.url=value;queueMicrotask(()=>this.onload());}}
  const window={UniversalAvatarAssets:Assets,devicePixelRatio:1};
  vm.runInNewContext(fs.readFileSync(require.resolve('../mascot.js'),'utf8'),{window,document:{currentScript:{src:'https://example.test/mascot.js'},createElement:canvas},Image,URL,setTimeout,clearTimeout});
  await window.JimmyMascot.preload();const element=window.JimmyMascot.create();
  for(let i=0;i<16;i++){
    calls.length=0;window.JimmyMascot.paint(element,'spin',0,1,{elapsed:.2+(i+.05)/32*2.15});
    assert.equal(calls.length,1);assert.equal(calls[0].alpha,1);assert.equal(element.dataset.sheet,'spin');assert.equal(element.dataset.frame,String(i));
    assert.equal(element.style.transform,undefined);
  }
});
