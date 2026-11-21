'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),K=require('../knowledge-core.js');
const pack=K.validate(require('../knowledge/jimmys-funpark.json'));
const entry=id=>pack.entries.find(e=>e.id===id);
test('Opening times and phone availability remain distinct',()=>{
  assert.match(entry('zeiten').answer,/14:30/);assert.match(entry('zeiten').answer,/Dienstag Ruhetag/);
  assert.match(entry('telefonzeiten').answer,/9:30/);assert.match(entry('telefonzeiten').answer,/keine zusätzlichen Spielzeiten/);
});
test('Plain group entry does not become the catering package',()=>{
  assert.match(entry('gruppe-eintritt').answer,/15 €/);assert.match(entry('kiga-paket').answer,/18,50 €/);
  assert.notEqual(entry('gruppe-eintritt').sourceUrl,entry('kiga-paket').sourceUrl);
});
test('An expired event and conflicting booking date cannot become a live booking promise',()=>{
  assert.equal(K.active(entry('krabbel'),'2027-01-16'),false);
  assert.match(entry('krabbel-anmeldung').answer,/16\.10\.2026/);
  assert.ok(entry('krabbel-anmeldung').links.every(l=>!l.url.includes('buchung.php')));
  assert.match(entry('auslastung').answer,/keinen Zugriff/);
});
test('Price entries have near-term reviews and food questions link to staff clarification',()=>{
  assert.equal(entry('preise').reviewAfter,'2026-11-29');assert.equal(entry('party-preise').reviewAfter,'2026-11-29');
  assert.ok(entry('allergene').suggestions.includes('kontakt'));assert.match(entry('essen-mitbringen').answer,/Babynahrung/);
});
