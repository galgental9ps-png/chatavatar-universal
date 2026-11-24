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
    for(const phase of ['speed','takeoff','air-turn','double-turn','landing','crossovers','lunge','spiral','spin-entry','spin','spin-exit','bow'])assert.ok(seen.has(phase),phase);
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
    const p=i/1000,move=Skating.jumpAt(p,96,2);indices.add(move.index);maximum=Math.max(maximum,move.lift);
    if(p<=.2||p>=.78)assert.equal(move.lift,0);else assert.ok(move.lift>0);
    assert.equal(move.sheet,'jump');assert.equal(move.rotation,undefined);
  }
  assert.equal(indices.size,16);assert.ok(maximum>95.9);assert.equal(Skating.jumpAt(1,96).index,15);
});

test('Both standalone tricks finish after a skipped interval and a spin remains on its original baseline',()=>{
  for(const mode of ['spin','jump']){
    const choreography=plan(mode),end=Skating.atTime(choreography,choreography.duration);
    assert.equal(end.finished,true);assert.equal(end.lift,0);
    assert.equal(Skating.atTime(choreography,choreography.duration+60000).finished,true);
    if(mode==='spin')for(let t=0;t<choreography.duration;t+=20)assert.equal(Skating.atTime(choreography,t).x,100);
  }
});
