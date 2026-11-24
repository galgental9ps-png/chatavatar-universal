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
    if (!['routine', 'jump', 'spin'].includes(mode)) throw Error('Unbekannte Eiskunstlauf-Folge.');
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
    return { mode, blocks, duration: time, size: size.width,stride:size.stride||size.width*1.3,approachStride:size.approachStride||size.stride||size.width*1.3,maxLift:Math.max(0,viewportHeight-size.height-22),
      jumpHeight: Math.min(size.height * .43, Math.max(0, viewportHeight - size.height - 22)) };
  }

  function jumpAt(progress, height, turns = 1) {
    const p = clamp(progress, 0, 1);
    if (p < .24) return { sheet: 'jumpBridge', index: Math.min(7, Math.floor(p / .24 * 8)), lift: 0, phase: 'takeoff' };
    if (p < .82) {
      const air = (p - .24) / .58,lift=4 * height * air * (1 - air);
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
      case 'jump': frame = jumpAt(p, Math.min(plan.maxLift,plan.jumpHeight * (item.turns > 1 ? 1.08 : 1)), item.turns); break;
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
    return { ...base, ...frame };
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

  function atTime(plan, milliseconds) {
    const time = Math.max(0, milliseconds), last = plan.blocks.at(-1);
    if (time >= plan.duration) return { x: last.to, facing: last.toFacing || last.facing, lift: 0, velocity: 0,
      sheet: 'poses', index: 0, phase: 'finished', finished: true };
    const block = plan.blocks.find(block => time < block.end), elapsed = time - block.start;
    if (block.kind === 'pass') return { ...samplePass(block, elapsed, plan), finished: false };
    if (block.kind === 'turn') return { ...sampleTurn(block, elapsed), finished: false };
    return { x: block.from, facing: block.facing, lift: 0, velocity: 0,
      ...(elapsed < block.duration * 2 / 3 ? { sheet: 'flow', index: Math.max(8, 15 - Math.floor(elapsed / (block.duration * 2 / 3) * 8)) } : { sheet: 'poses', index: 15 }),
      phase: 'bow', finished: false };
  }
  return { createPlan, atTime, jumpAt, smooth };
});
