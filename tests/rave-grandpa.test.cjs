'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const Assets=require('../asset-sets.js'),Motion=require('../motion-core.js'),Shuffle=require('../shuffle-core.js'),Themes=require('../demo-themes.js');
const opa=Assets.get('rave-grandpa');
const planFor=(mode='routine',width=1200,height=800)=>Shuffle.createPlan({mode,startX:width-230,viewportWidth:width,size:Motion.dimensions(width,opa.motion,height)});
test('Rave-Opa is a separate complete set with four own action PNGs and a warehouse world',()=>{
 assert.equal(Assets.activeId,opa.id);assert.equal(opa.motion.kind,'shuffle');assert.equal(opa.motion.power,true);
 const files=new Set();
 for(const atlas of [opa.master,...Object.values(opa.master.variants)]){
   assert.equal(atlas.actors.length,1);const actor=atlas.actors[0],png=fs.readFileSync(path.join(__dirname,'..',actor.file));
   assert.equal(png.readUInt32BE(16),actor.width);assert.equal(png.readUInt32BE(20),actor.height);assert.equal(png[25],6);files.add(actor.file);
   for(const frames of Object.values(atlas.frames)){assert.equal(frames.length,16);for(const cell of frames)assert.ok(Number.isInteger(cell)&&cell>=0&&cell<atlas.columns*atlas.rows);}
 }
 assert.equal(files.size,4);assert.equal(opa.master.variants.running.columns,2);assert.equal(Themes.get(opa.id).track,2);
 assert.ok(Themes.get(opa.id).scene.file.includes('warehouse'));
});
test('Both techno sequences include actual running, heel-toe, hand moves, kicks and complete spins within the viewport',()=>{
 for(const width of [184,390,1200,1920])for(const mode of ['routine','freestyle','running-man','spin','hands','charleston']){
   const plan=planFor(mode,width,320),size=Motion.dimensions(width,opa.motion,320),sheets=new Set(),spinViews=new Set();
   for(let t=0;t<plan.duration;t+=17){
     const move=Shuffle.atTime(plan,t),selection=Assets.frameFor(opa,'dance-performance',0,{selection:move});
     const atlas=selection.atlas?opa.master.variants[selection.atlas]:opa.master;
     assert.ok(atlas.frames[selection.sheet][selection.index]>=0);assert.equal(move.lift,0);assert.ok(move.x>=0&&move.x<=width-size.width+.001);sheets.add(move.sheet);
     if(move.sheet==='spin'){spinViews.add(atlas.frames.spin[move.index]);assert.equal(move.facing,1);}
   }
   if(['routine','freestyle'].includes(mode)){for(const key of ['running','heeltoe','tstep','hands','kicks','slide','spin'])assert.ok(sheets.has(key));assert.equal(spinViews.size,8);}
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
