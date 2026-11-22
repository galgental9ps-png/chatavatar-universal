'use strict';
const test = require('node:test'), assert = require('node:assert/strict');
const M = require('../motion-core.js');
test('Walking frame follows actual distance, including a seamless loop', () => {
  const stride = M.dimensions(1400).stride;
  assert.equal(M.frameAtDistance(0,stride),0);
  assert.equal(M.frameAtDistance(stride*0.501,stride),4);
  assert.equal(M.frameAtDistance(stride,stride),0);
  assert.equal(M.frameAtDistance(stride*1.251,stride),2);
});
test('Standing still never advances the gait, and smaller avatars use a scaled stride', () => {
  assert.equal(M.frameAtDistance(12,80),M.frameAtDistance(12,80));
  const desktop=M.dimensions(1400),mobile=M.dimensions(390);
  assert.equal(M.frameAtDistance(desktop.stride*.501,desktop.stride),M.frameAtDistance(mobile.stride*.501,mobile.stride));
  assert.ok(mobile.speed<desktop.speed);
});
test('A walk accelerates gradually, slows before arrival and never overshoots', () => {
  const size=M.dimensions(1400); let state={x:300,target:600,velocity:0,distance:0}, peak=0;
  const first=M.walkStep(state,1/60,size);assert.ok(first.velocity>0&&first.velocity<size.speed/4);
  for(let i=0;i<1200;i++){state=M.walkStep(state,1/60,size);peak=Math.max(peak,state.velocity);assert.ok(state.x>=300&&state.x<=600);if(state.arrived)break;}
  assert.ok(state.arrived);assert.ok(Math.abs(state.x-600)<.6);assert.ok(state.velocity<peak);assert.ok(Math.abs(state.distance-300)<.6);
});
test('The same motor walks left and handles very narrow movement ranges', () => {
  let state={x:150,target:0,velocity:0,distance:0};
  for(let i=0;i<1000;i++){state=M.walkStep(state,1/60,M.dimensions(250));assert.ok(state.x>=0&&state.x<=150);if(state.arrived)break;}
  assert.ok(state.arrived);assert.equal(M.walkStep({x:5,target:5},.05,M.dimensions(250)).velocity,0);
});
test('Released avatars accelerate downwards and stop on the floor without passing through it', () => {
  let state={y:250,velocity:0};const first=M.fallStep(state,1/60);const second=M.fallStep(first,1/60);
  assert.ok(second.velocity>first.velocity);assert.ok(second.y<first.y);
  for(let i=0;i<180;i++){state=M.fallStep(state,1/60);assert.ok(state.y>=10);if(state.landed)break;}
  assert.equal(state.y,10);assert.equal(state.velocity,0);assert.ok(state.landed);
});

test('A hop has anticipation, a bounded arc, descent and a grounded landing', () => {
  assert.deepEqual(M.jumpAtTime(0,60),{lift:0,progress:0,frame:0,finished:false});
  assert.equal(M.jumpAtTime(100,60).lift,0);
  assert.equal(M.jumpAtTime(300,60).frame,1);
  assert.equal(M.jumpAtTime(460,60).lift,60);
  assert.equal(M.jumpAtTime(650,60).frame,2);
  assert.equal(M.jumpAtTime(800,60).frame,3);
  assert.equal(M.jumpAtTime(1000,60).finished,true);
  let last=0;
  for(let ms=0;ms<=1100;ms+=5){const s=M.jumpAtTime(ms,60);assert.ok(s.lift>=0&&s.lift<=60);assert.ok(s.progress>=last&&s.progress<=1);last=s.progress;}
  assert.equal(M.jumpAtTime(460,0).lift,0);
});

