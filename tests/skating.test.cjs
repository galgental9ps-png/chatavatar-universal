'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const Skating=require('../skating-core.js'),Assets=require('../asset-sets.js'),Motion=require('../motion-core.js');
const asset=Assets.get('ice-skater');

function plan(mode='routine',width=1200,height=800,start=100,facing=1){
  return Skating.createPlan({mode,startX:start,facing,viewportWidth:width,viewportHeight:height,size:Motion.dimensions(width,asset.motion,height)});
}

test('The routine links full-body acceleration, two airborne jumps, footwork, spiral and spin entry/exit within the screen',()=>{
  for(const [width,height] of [[1200,800],[390,700],[184,180]]){
    const choreography=plan('routine',width,height),size=Motion.dimensions(width,asset.motion,height),seen=new Set();
    let peak=0;
    for(let t=0;t<=choreography.duration;t+=10){
      const move=Skating.atTime(choreography,t);seen.add(move.phase);peak=Math.max(peak,move.velocity);
      assert.ok(move.x>=0&&move.x+size.width<=width);assert.ok(move.lift>=0&&move.lift+size.height+10<=height);
      assert.ok(asset.sheets[move.sheet]);assert.ok(Number.isInteger(move.index)&&move.index>=0&&move.index<16);
      assert.deepEqual(Assets.frameFor(asset,'skate-performance',0,{selection:move}),{sheet:move.sheet,index:move.index});
    }
    for(const phase of ['speed','takeoff','air-turn','double-turn','landing-preparation','landing','crossovers','lunge','spiral','spin-entry','spin','spin-exit','bow'])assert.ok(seen.has(phase),phase);
    if(width===1200)assert.ok(peak>218*.62*2,'The routine should move at least twice as fast as the earlier glide.');
    const end=Skating.atTime(choreography,choreography.duration+1000);assert.equal(end.finished,true);assert.equal(end.lift,0);assert.equal(end.index,0);
  }
});

test('Passes keep position and velocity continuous across trick changes and turns change facing only on a stationary back view',()=>{
  const choreography=plan('routine',1200,800,970,1);let before=Skating.atTime(choreography,0),reversals=0;
  for(let t=10;t<=choreography.duration;t+=10){
    const move=Skating.atTime(choreography,t);
    assert.ok(Math.abs(move.x-before.x)<7,'No horizontal teleport between poses.');
    if(move.facing!==before.facing){
      reversals++;assert.equal(move.phase,'spin');assert.equal(move.velocity,0);assert.equal(move.lift,0);assert.ok([7,8].includes(move.index));
    }
    before=move;
  }
  assert.equal(reversals,4);
  for(const block of choreography.blocks){
    const near=Skating.atTime(choreography,Math.max(0,block.end-.001)),after=Skating.atTime(choreography,block.end+.001);
    assert.ok(Math.abs(near.x-after.x)<.001);assert.ok(near.velocity<.001&&after.velocity<.001);
  }
});

test('Jump anticipation stays grounded, the upright turn lifts the whole figure and the landing absorbs at the baseline',()=>{
  const indices=new Set();let maximum=0;
  for(let i=0;i<1000;i++){
    const p=i/1000,move=Skating.jumpAt(p,96,2);indices.add(move.sheet+':'+move.index);maximum=Math.max(maximum,move.lift);
    if(p<=.24||p>=.82)assert.equal(move.lift,0);else assert.ok(move.lift>0);
    assert.ok(['jump','jumpBridge'].includes(move.sheet));assert.equal(move.rotation,undefined);
  }
  assert.equal(indices.size,24);assert.ok(maximum>95.9);assert.equal(Skating.jumpAt(1,96).index,15);
});

test('The descent opens the landing pose before contact, then cushions through the knee bend',()=>{
  const descent=Skating.jumpAt(.78,96),contact=Skating.jumpAt(.82,96),absorb=Skating.jumpAt(.9,96),exit=Skating.jumpAt(1,96);
  assert.equal(descent.sheet,'jumpBridge');assert.equal(descent.phase,'landing-preparation');assert.ok(descent.index>=8&&descent.index<=10);assert.ok(descent.lift>0);
  assert.equal(contact.sheet,'jumpBridge');assert.equal(contact.index,11);assert.equal(contact.lift,0);
  assert.equal(absorb.index,13);assert.equal(absorb.lift,0);assert.equal(exit.index,15);
  for(let i=0;i<8;i++)assert.equal(Skating.jumpAt((i+.1)/8*.24,96).index,i);
});

test('Matching crouched and airborne reference poses keeps one fixed anatomical scale for the whole bridge',()=>{
  const jump=Array.from({length:16},()=>({top:.05,bottom:.93,head:.5}));jump[11]={top:.04,bottom:.94,head:.5};
  const bridge=Array.from({length:16},()=>({top:.94-.68/(.9/.84),bottom:.94,head:.5}));bridge[8]={top:.1,bottom:.94,head:.5};
  const speed=Array.from({length:16},()=>({top:.12,bottom:.94,head:.5}));
  const anchors={jump,jumpBridge:bridge,speed},width=218;
  const air=Assets.layoutFor(asset,'jump',11,width,anchors),closed=Assets.layoutFor(asset,'jumpBridge',8,width,anchors),crouch=Assets.layoutFor(asset,'jumpBridge',0,width,anchors);
  const span=(frame,layout)=>(frame.bottom-frame.top)*layout.width;
  assert.ok(Math.abs(span(jump[11],air)-span(bridge[8],closed))<1e-8);
  assert.ok(Math.abs(span(speed[0],Assets.layoutFor(asset,'speed',0,width,anchors))-span(bridge[0],crouch))<1e-8);
  for(let i=0;i<16;i++)assert.equal(Assets.layoutFor(asset,'jumpBridge',i,width,anchors).scale,closed.scale);
  assert.ok(span(bridge[0],crouch)<span(bridge[8],closed)*.8);
  assert.equal(crouch.width,crouch.height);assert.ok(Math.abs(crouch.x+crouch.width/2-width/2)<1e-8);
});

test('Both standalone tricks finish after a skipped interval and a spin remains on its original baseline',()=>{
  for(const mode of ['spin','jump']){
    const choreography=plan(mode),end=Skating.atTime(choreography,choreography.duration);
    assert.equal(end.finished,true);assert.equal(end.lift,0);
    assert.equal(Skating.atTime(choreography,choreography.duration+60000).finished,true);
    if(mode==='spin')for(let t=0;t<choreography.duration;t+=20)assert.equal(Skating.atTime(choreography,t).x,100);
  }
});
