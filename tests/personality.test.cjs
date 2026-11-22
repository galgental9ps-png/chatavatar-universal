'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const P=require('../personality-core.js');

test('Sixty distinct short asides have a complete shuffled cycle without boundary repeats',()=>{
  const all=Object.values(P.quips).flat();
  assert.equal(all.length,60);assert.equal(new Set(all).size,60);
  for(const [kind,pool] of Object.entries(P.quips)){
    const deck=P.createDeck(()=>.5),first=Array.from({length:pool.length},()=>deck.next(kind));
    assert.equal(new Set(first).size,pool.length);
    assert.deepEqual(new Set(first),new Set(pool));
    const next=deck.next(kind);assert.notEqual(next,first.at(-1));
    for(const line of pool)assert.ok(line.length<=130);
  }
});

test('Changing an action preserves the remaining lines in the other action pools',()=>{
  const deck=P.createDeck(()=>0),idle=deck.next('idle'),jump=deck.next('jump');
  assert.ok(P.quips.idle.includes(idle));assert.ok(P.quips.jump.includes(jump));
  assert.notEqual(deck.next('idle'),idle);
  assert.ok(P.quips.walk.includes(deck.next('walk')));
  assert.ok(P.quips.idle.includes(deck.next('unknown')));
});
