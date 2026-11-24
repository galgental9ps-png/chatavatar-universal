'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const Themes=require('../demo-themes.js'),Assets=require('../asset-sets.js');
test('Every available avatar has its own complete scene and music choice',()=>{
 assert.deepEqual(Object.keys(Themes.themes).sort(),Object.keys(Assets.sets).sort());const files=new Set();
 for(const [id,t] of Object.entries(Themes.themes)){
   assert.ok(Object.isFrozen(t)&&Object.isFrozen(t.scene));assert.equal(Themes.get(id),t);
   assert.equal(t.track,['shuffle-skeleton','rave-grandpa'].includes(id)?2:0);assert.equal(t.headline.length,2);assert.ok(t.scene.alt.length>40);
   const bytes=fs.readFileSync(path.join(__dirname,'..',t.scene.file));assert.equal(bytes.readUInt32BE(16),2172);assert.equal(bytes.readUInt32BE(20),724);files.add(t.scene.file);
 }
 assert.equal(files.size,6);assert.equal(Themes.get('missing').id,'ice-pair-fine');
});
test('Theme changes replace the page identity, accessible scene and browser color together',()=>{
 const nodes=new Map();
 const node=()=>({textContent:'',children:[],replaceChildren(...children){this.children=children;}});
 for(const selector of ['meta[name="theme-color"]','#hero-title','#winter-title','[data-theme-eyebrow]','.stage-top span:first-child','.stage-top span:last-child','.winter-heading .eyebrow','.winter-intro','[data-scene-caption]','.winter-scene-image'])nodes.set(selector,node());
 const doc={documentElement:{dataset:{}},querySelector:s=>nodes.get(s),createElement:node};
 for(const id of ['shuffle-skeleton','ice-skater','jimmy','ice-pair','ice-pair-fine']){
   const t=Themes.apply(id,doc);assert.equal(doc.documentElement.dataset.avatarTheme,id);
   assert.equal(nodes.get('meta[name="theme-color"]').content,t.color);assert.equal(nodes.get('.winter-scene-image').src,t.scene.file);
   assert.equal(nodes.get('.winter-scene-image').alt,t.scene.alt);assert.equal(nodes.get('#hero-title').children[0],t.headline[0]);
   assert.equal(nodes.get('#hero-title').children[2].textContent,t.headline[1]);assert.equal(nodes.get('[data-scene-caption]').textContent,t.scene.caption);
 }
});
