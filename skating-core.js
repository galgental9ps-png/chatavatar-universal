/* Complete-frame skating choreography. All movement is sampled from elapsed time. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.UniversalSkating = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
  const smooth = value => { const t = clamp(value, 0, 1); return t * t * t * (10 + t * (-15 + 6 * t)); };
  const wrap = value => ((Math.floor(value) % 16) + 16) % 16;
  const phase = (name, duration, extra = {}) => ({ name, duration, ...extra });

  function createPlan({ mode = 'routine', startX = 0, facing = 1, viewportWidth, viewportHeight, size }) {
    if (!['routine', 'jump', 'spin', 'duet','feature'].includes(mode)||mode==='duet'&&!size.duet||mode==='feature'&&(!size.duet||!size.encore)) throw Error('Unbekannte Eiskunstlauf-Folge.');
    const max = Math.max(0, viewportWidth - size.width), margin = Math.min(12, max / 2);
    const left = margin, right = max - margin;
    const tempo = clamp(size.tempo || 1, .25, 2), topSpeed = Math.max(1, size.performanceSpeed || size.width * 1.2);
    const jumpTempo=clamp(size.jumpTempo||tempo,.25,2),spinTempo=clamp(size.spinTempo||tempo,.25,2);
    let x = clamp(startX, left, right), direction = facing < 0 ? -1 : 1, time = 0;
    const travelDirection=x > (left + right) / 2 ? -1 : 1;
    const blocks = [];
    const add = block => { block.start = time; time += block.duration; block.end = time; blocks.push(block); };
    const pass = (phases, target) => {
      const to = clamp(target, left, right);
      const paced = phases.map(item => ({ ...item, duration: item.duration / (item.name==='jump'?jumpTempo:tempo) }));
      // A quintic glide reaches 1.875 times its average speed. Give wide screens
      // a longer approach instead of speeding up the whole routine or stretching a jump.
      const minimum = 1875 * Math.abs(to - x) / topSpeed;
      const extra = Math.max(0, minimum - paced.reduce((sum, item) => sum + item.duration, 0));
      const cruise = paced.find(item => ['speed', 'spiral', 'glide'].includes(item.name));
      if (cruise) cruise.duration += extra;
      let offset = 0;
      const steps = paced.map(item => { const result = { ...item, start: offset }; offset += item.duration; return result; });
      direction = Math.sign(to - x) || direction;
      add({ kind: 'pass', from: x, to, facing: direction, duration: offset, phases: steps }); x = to;
    };
    const turn = (spinDuration, turns, reverse = true, entry = 400, exit = 450) => {
      entry /= tempo; spinDuration /= spinTempo; exit /= tempo;
      add({ kind: 'turn', from: x, to: x, fromFacing: direction, toFacing: reverse ? -direction : direction,
        entry, spinDuration, exit, turns, duration: entry + spinDuration + exit });
      if (reverse) direction = -direction;
    };
    const edge = () => direction > 0 ? right : left;
    const duet = ({spin=true,jump=true}={}) => {
      const center=(left+right)/2;
      pass([phase('glide',950)],center);
      const actorWidth=size.actorWidth||size.height,spacing=size.spacing||0;
      const joined=[center,center+spacing],outer=[margin,viewportWidth-actorWidth-margin];
      // Both avatars remain independent on small screens; only their distance
      // is reduced when the viewport cannot accommodate a wider separation.
      if(outer[1]-outer[0]<=spacing+actorWidth*.15){turn(1800,2,false,500,550);return;}
      const travel=Math.max(...joined.map((value,i)=>Math.abs(value-outer[i])));
      const pacedTravel=Math.max(1900/tempo,1875*travel/topSpeed);
      const addDuet=(part,fromActors,toActors,duration,extra={})=>add({kind:'duet',part,from:center,to:center,
        facing:1,fromActors,toActors,duration,centerBias:-spacing/2,...extra});
      addDuet('open',joined,outer,pacedTravel);
      if(spin)addDuet('spin',outer,outer,2800/spinTempo);
      const air=1470/jumpTempo,landing=600/tempo;
      const approach=Math.max(1700/tempo,pacedTravel-(jump?air+landing:0));
      addDuet('converge',outer,joined,approach+(jump?air+landing:0),{approach,air,landing,jump});
      addDuet('rejoin',joined,joined,650/tempo);
      direction=1;
    };
    if(size.duet){
      direction=travelDirection;
      if(mode==='feature'){
        const center=(left+right)/2,aw=size.actorWidth||size.height;
        pass([phase('glide',1200)],center);
        const joined=[center,center+(size.spacing||0)],woman=(viewportWidth-aw)/2;
        const radius=Math.max(0,Math.min(aw*.86,(viewportWidth-aw)/2-margin));
        const depth=Math.min(aw*.12,Math.max(0,(size.ground||10)-10),Math.max(0,viewportHeight-size.height-(size.ground||10)-12));
        const orbit=[woman,woman+radius];
        const addFeature=(part,fromActors,toActors,duration,extra={})=>add({kind:'feature',part,
          from:part==='finish'?x:center,to:part==='finish'?x:center,facing:part==='finish'?direction:1,fromActors,toActors,depth,duration,...extra});
        addFeature('entry',joined,orbit,1100/tempo);
        addFeature('orbit',orbit,orbit,Math.max(9000/tempo,4*Math.PI*radius*1000/topSpeed),{woman,radius});
        // Re-form the pair at Lina's current spot, rather than sliding her
        // standing illustration back to the old group center after her turn.
        const exitX=clamp(woman,left,right),reunited=[exitX,exitX+(size.spacing||0)];
        addFeature('exit',orbit,reunited,1100/tempo,{to:exitX});
        x=exitX;
        direction=travelDirection;
        pass([phase('glide',2200,{atlas:'encore'})],edge());
        addFeature('finish',[x,x+(size.spacing||0)],[x,x+(size.spacing||0)],1800/tempo);
      }else{
      if(mode==='routine'){
        pass([phase('glide',1600),phase('footwork',1100)],edge());
        turn(1300,2);
      }
      duet({spin:mode!=='jump',jump:mode!=='spin'});
      if(mode==='routine'){
        pass([phase('glide',700),phase('spiral',2700),phase('footwork',1500)],edge());
        turn(1500,2);
        pass([phase('glide',1000)],x+direction*Math.min(size.width*1.2,(right-left)*.35));
      }
      add({kind:'bow',from:x,to:x,facing:direction,duration:1050/tempo});
      }
    }else{
      if(mode!=='spin'&&direction!==travelDirection)turn(850,1,true,300,350);
      if (mode === 'spin') {
        direction = facing < 0 ? -1 : 1;
        turn(1950, 2, false, 500, 550);
      } else if (mode === 'jump') {
        pass([phase('speed', 1200), phase('jump', 1470, { turns: 1 }), phase('landing', 500)],
          x + direction * Math.min(right - left, size.width * 3.3));
      } else {
        pass([phase('speed', 1900),
          phase('jump', 1470, { turns: 1 }), phase('landing', 350)], edge());
        turn(1500, 2);
        pass([phase('spiral', 2300), phase('footwork', 1100), phase('glide', 300)], edge());
        turn(1000, 1, true, 350, 400);
        pass([phase('speed', 1500), phase('jump', 1550, { turns: 2 }), phase('landing', 400)], edge());
        turn(1750, 2);
        pass([phase('glide', 1000)], x + direction * Math.min(size.width * 1.3, (right - left) * .35));
        add({ kind: 'bow', from: x, to: x, facing: direction, duration: 1050 / tempo });
      }
    }
    const headroom=Math.max(0,viewportHeight-size.height-(size.ground||10)-12);
    return { mode, blocks, duration: time, size: size.width,duet:!!size.duet,spacing:size.spacing||0,actorWidth:size.actorWidth||size.width,ground:size.ground||10,
      edgeLean:size.edgeLean??2.4,softJump:!!size.softJump,
      arcDepth:Math.min((size.actorWidth||size.width)*(size.arcDepth??.14),32,headroom*.25),
      stride:size.stride||size.width*1.3,approachStride:size.approachStride||size.stride||size.width*1.3,maxLift:headroom,
      jumpHeight: Math.min(size.height * (size.jumpHeight??.43),headroom) };
  }

  function jumpAt(progress, height, turns = 1, soft = false) {
    const p = clamp(progress, 0, 1);
    if (p < .24) return { sheet: 'jumpBridge', index: Math.min(7, Math.floor(p / .24 * 8)), lift: 0, phase: 'takeoff' };
    if (p < .82) {
      const air = (p - .24) / .58,lift=soft?height*Math.sin(Math.PI*air)**2:4 * height * air * (1 - air);
      if(air>=.78)return {sheet:'jumpBridge',index:Math.min(10,8+Math.floor((air-.78)/.22*3)),lift,phase:'landing-preparation'};
      return { sheet: 'jump', index: 4 + Math.floor(air / .78 * 8 * turns) % 8,
        lift, phase: turns > 1 ? 'double-turn' : 'air-turn' };
    }
    return { sheet: 'jumpBridge', index: Math.min(15, 11 + Math.floor((p - .82) / .18 * 5)), lift: 0, phase: 'landing' };
  }

  function samplePass(block, elapsed, plan) {
    const progress = clamp(elapsed / block.duration, 0, 1), eased = smooth(progress);
    const distance = Math.abs(block.to - block.from) * eased;
    const base = { x: block.from + (block.to - block.from) * eased, facing: block.facing, lift: 0,
      velocity: Math.abs(block.to - block.from) * 30 * progress ** 2 * (1 - progress) ** 2 / (block.duration / 1000) };
    const itemIndex=block.phases.findIndex(item=>elapsed<item.start+item.duration);
    const item=block.phases[itemIndex<0?block.phases.length-1:itemIndex];
    const p = clamp((elapsed - item.start) / item.duration, 0, 1);
    const strideFrame = wrap(distance / Math.max(1, plan.stride || plan.size * 1.3) * 16);
    let frame;
    switch (item.name) {
      case 'gather': frame = { sheet: 'jumpBridge', index: Math.min(2, Math.floor(p * 3)), phase: 'gather' }; break;
      case 'speed': {
        const stride=Math.max(1,plan.approachStride||plan.stride||plan.size*1.3);
        let index=wrap(distance/stride*16);
        if(block.phases[itemIndex+1]?.name==='jump'){
          const settle=Math.min(450,item.duration*.25),start=item.start+item.duration-settle;
          if(elapsed>=start){
            const startDistance=Math.abs(block.to-block.from)*smooth(start/block.duration);
            const from=wrap(startDistance/stride*16);
            index=Math.floor(from+(15-from)*smooth((elapsed-start)/settle));
          }
        }
        frame={sheet:'speed',index,phase:'speed'};break;
      }
      case 'footwork': frame = { sheet: 'footwork', index: Math.min(15, Math.floor(p * 16)), phase: p > .45 && p < .8 ? 'lunge' : 'crossovers' }; break;
      case 'jump': frame = jumpAt(p, Math.min(plan.maxLift,plan.jumpHeight * (item.turns > 1 ? 1.08 : 1)), item.turns,plan.softJump); break;
      case 'landing': frame = { sheet: 'jumpBridge', index: 15, phase: 'landing-exit' }; break;
      case 'spiral': {
        let index;
        if (p < .24) index = Math.min(5, Math.floor(p / .24 * 6));
        else if (p < .76) index = 6 + Math.floor((p - .24) / .52 * 12) % 6;
        else index = Math.min(15, 12 + Math.floor((p - .76) / .24 * 4));
        frame = { sheet: 'spiral', index, phase: 'spiral' }; break;
      }
      default: frame = { sheet: 'glide', index: strideFrame, phase: 'glide' };
    }
    return { ...base, ...frame,...(item.atlas?{atlas:item.atlas}:{}) };
  }

  function sampleTurn(block, elapsed) {
    if (elapsed < block.entry) return { x: block.from, facing: block.fromFacing, lift: 0, velocity: 0,
      sheet: 'flow', index: Math.min(7, Math.floor(elapsed / block.entry * 8)), phase: 'spin-entry' };
    if (elapsed < block.entry + block.spinDuration) {
      const p = (elapsed - block.entry) / block.spinDuration;
      const angle = block.turns * 16 * smooth(p);
      // Change travel direction only while her back faces us. Reverse the view indices
      // after the reflection so the illustrated turn keeps the same visual direction.
      const reversed = block.toFacing !== block.fromFacing && angle >= 8;
      return { x: block.from, facing: reversed ? block.toFacing : block.fromFacing, lift: 0, velocity: 0,
        sheet: 'spin', index: wrap(reversed ? -Math.floor(angle) : angle), phase: 'spin' };
    }
    return { x: block.from, facing: block.toFacing, lift: 0, velocity: 0, sheet: 'flow',
      index: Math.min(15, 8 + Math.floor((elapsed - block.entry - block.spinDuration) / block.exit * 8)), phase: 'spin-exit' };
  }

  function sampleDuet(block,elapsed,plan){
    const p=clamp(elapsed/block.duration,0,1),eased=smooth(p);
    const positions=block.fromActors.map((from,i)=>from+(block.toActors[i]-from)*eased);
    const travel=Math.max(...block.fromActors.map((from,i)=>Math.abs(block.toActors[i]-from)));
    const base={x:positions.reduce((sum,value)=>sum+value,0)/2+block.centerBias,
      facing:1,lift:0,velocity:travel*30*p*p*(1-p)*(1-p)/(block.duration/1000)};
    let frame,facings=[1,-1],partnerSelection;
    if(block.part==='open'){
      facings=[-1,1];
      const settle=Math.min(850,block.duration*.28),moving=block.duration-settle;
      if(elapsed<moving){
        const distance=Math.abs(positions[0]-block.fromActors[0]);
        frame={sheet:'glide',index:wrap(distance/Math.max(1,plan.stride)*16),phase:'duet-open'};
      }else{
        frame={sheet:'jumpBridge',index:Math.min(7,Math.floor(smooth((elapsed-moving)/settle)*8)),phase:'duet-open'};
      }
    }else if(block.part==='spin'){
      frame={sheet:'spin',index:wrap(32*smooth(p)),phase:'duet-spin'};
    }else if(block.part==='rejoin'){
      const index=Math.min(15,Math.floor(16*smooth(p)));
      frame={sheet:'spin',index,phase:'duet-rejoin',safeExit:p>.9};
      if(index>=8){facings=[1,1];partnerSelection={sheet:'spin',index:wrap(-index)};}
    }else if(!block.jump){
      const distance=Math.abs(positions[0]-block.fromActors[0]);
      frame={sheet:'glide',index:wrap(distance/Math.max(1,plan.stride)*16),phase:'duet-return'};
    }else if(elapsed<block.approach){
      const distance=Math.abs(positions[0]-block.fromActors[0]);
      const settle=450,remaining=block.approach-elapsed;
      const cycle=wrap(distance/Math.max(1,plan.approachStride)*16);
      let index=cycle;
      if(remaining<settle){
        const startP=(block.approach-settle)/block.duration;
        const startDistance=Math.abs(block.toActors[0]-block.fromActors[0])*smooth(startP);
        const from=wrap(startDistance/Math.max(1,plan.approachStride)*16);
        index=Math.floor(from+(15-from)*smooth(1-remaining/settle));
      }
      frame={sheet:'speed',index,phase:'duet-speed'};
    }else if(elapsed<block.approach+block.air){
      const move=jumpAt((elapsed-block.approach)/block.air,Math.min(plan.maxLift,plan.jumpHeight),1,plan.softJump);
      frame={...move,phase:'duet-'+move.phase};
    }else{
      frame={sheet:'jumpBridge',index:15,phase:'duet-landing-exit',safeExit:true};
    }
    const curved=block.part==='open'||block.part==='converge'&&!block.jump;
    const arc=curved?Math.sin(Math.PI*smooth(p))**2:0;
    const depth=block.part==='open'?0:Math.min((plan.arcDepth||0)*arc,Math.max(0,plan.maxLift-(frame.lift||0)));
    return {...base,...frame,actors:positions.map((x,i)=>({x,facing:facings[i],depth,
      lean:Math.sign(block.toActors[i]-block.fromActors[i])*(plan.edgeLean??2.4)*arc,
      ...(i===1&&partnerSelection?{selection:partnerSelection}:{})})),finished:false};
  }

  function sampleFeature(block,elapsed,plan){
    const p=clamp(elapsed/block.duration,0,1),eased=smooth(p);
    const base={x:block.from,facing:block.facing,lift:0,velocity:0,atlas:'encore',finished:false};
    if(block.part==='orbit'){
      // Three axial turns for Lina; Elio completes two actual oval circuits.
      // Depth ordering makes the far half pass behind her, rather than through her.
      const angle=4*Math.PI*p,depth=block.depth*Math.sin(angle);
      return {...base,sheet:'spin',index:wrap(48*p),phase:'feature-orbit',
        actors:[{x:block.woman,facing:1,layer:2},
          {x:block.woman+block.radius*Math.cos(angle),facing:1,depth,layer:depth>0?1:3,
            selection:{atlas:'encore',sheet:'spin',index:wrap(32*p)}}]};
    }
    const finish=block.part==='finish';
    const positions=block.fromActors.map((from,i)=>from+(block.toActors[i]-from)*eased);
    const index=finish?Math.min(15,8+Math.floor(8*eased)):block.part==='entry'?Math.max(0,7-Math.floor(8*eased)):Math.min(7,Math.floor(8*eased));
    return {...base,x:block.from+(block.to-block.from)*eased,sheet:'flow',index,phase:'feature-'+block.part,safeExit:finish&&p>.9,
      actors:positions.map((x,i)=>{
        const travel=block.toActors[i]-block.fromActors[i],closing=block.part==='exit'&&Math.abs(travel)>.01;
        // Whoever actually travels uses a complete skating step, paced by
        // distance. The stationary dancer only opens out of the pirouette.
        const selection=closing?{atlas:'encore',sheet:'glide',index:Math.min(15,Math.floor(Math.abs(x-block.fromActors[i])/Math.abs(travel)*16))}:
          finish&&i===1?{atlas:'encore',sheet:'poses',index:0}:undefined;
        return {x,facing:closing?Math.sign(travel):finish?block.facing:1,...(selection?{selection}:{})};
      })};
  }

  function atTime(plan, milliseconds) {
    const time = Math.max(0, milliseconds), last = plan.blocks.at(-1);
    const joined=move=>plan.duet?{...move,actors:move.actors||[{x:move.x,facing:move.facing},{x:move.x+plan.spacing,facing:move.facing}]}:move;
    if (time >= plan.duration) return joined({ x: last.to, facing: last.toFacing || last.facing, lift: 0, velocity: 0,
      sheet: 'poses', index: 0, phase: 'finished', finished: true });
    const block = plan.blocks.find(block => time < block.end), elapsed = time - block.start;
    if(block.kind==='duet')return sampleDuet(block,elapsed,plan);
    if(block.kind==='feature')return sampleFeature(block,elapsed,plan);
    if (block.kind === 'pass') return joined({ ...samplePass(block, elapsed, plan), finished: false });
    if (block.kind === 'turn') return joined({ ...sampleTurn(block, elapsed), finished: false });
    return joined({ x: block.from, facing: block.facing, lift: 0, velocity: 0,
      ...(elapsed < block.duration * 2 / 3 ? { sheet: 'flow', index: Math.max(8, 15 - Math.floor(elapsed / (block.duration * 2 / 3) * 8)) } : { sheet: 'poses', index: 15 }),
      phase: 'bow', finished: false });
  }
  return { createPlan, atTime, jumpAt, smooth };
});
