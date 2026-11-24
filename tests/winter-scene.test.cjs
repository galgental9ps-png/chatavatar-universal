'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..'),flush=()=>new Promise(resolve=>setImmediate(resolve));
class Events{
 constructor(){this.listeners=new Map();}
 addEventListener(type,fn){if(!this.listeners.has(type))this.listeners.set(type,new Set());this.listeners.get(type).add(fn);}
 removeEventListener(type,fn){this.listeners.get(type)?.delete(fn);}
 emit(type,event={}){for(const fn of [...this.listeners.get(type)||[]])fn({type,...event});}
}
async function music({blocked=true}={}){
 const audio=new Events();Object.assign(audio,{paused:true,ended:false,allowed:!blocked,calls:0});
 audio.play=function(){this.calls++;if(!this.allowed)return Promise.reject(Object.assign(Error('User activation required'),{name:'NotAllowedError'}));this.paused=false;this.emit('play');return Promise.resolve();};
 audio.pause=function(){this.paused=true;this.emit('pause');};
 const buttons=[true,false].map(compact=>{
   const button=new Events(),label={textContent:''};
   Object.assign(button,{dataset:{},attributes:{},classList:{contains:()=>compact},querySelector:()=>label,setAttribute(name,value){this.attributes[name]=value;},closest:()=>button,label});return button;
 });
 const document=new Events();Object.assign(document,{hidden:false,getElementById:id=>id==='demo-music'?audio:null,querySelectorAll:()=>buttons});
 vm.runInNewContext(fs.readFileSync(path.join(root,'winter-scene.js'),'utf8'),{document,window:{},Promise});await flush();
 return {audio,buttons,document};
}

test('A blocked autoplay stays silent until an ordinary page click unlocks the uploaded music',async()=>{
 const {audio,buttons,document}=await music();assert.equal(audio.calls,1);assert.equal(audio.paused,true);assert.equal(buttons[1].label.textContent,'Musik einschalten');
 audio.allowed=true;document.emit('click',{target:{closest:()=>null}});await flush();
 assert.equal(audio.paused,false);assert.equal(buttons[0].attributes['aria-pressed'],'true');assert.equal(buttons[1].label.textContent,'Musik pausieren');assert.equal(audio.volume,.28);
});

test('Both music buttons work, and a manual pause survives later clicks and tab changes',async()=>{
 const {audio,buttons,document}=await music({blocked:false});assert.equal(audio.paused,false);
 buttons[0].emit('click');await flush();assert.equal(audio.paused,true);assert.equal(buttons[1].attributes['aria-pressed'],'false');
 const calls=audio.calls;document.emit('click',{target:{closest:()=>null}});document.hidden=true;document.emit('visibilitychange');document.hidden=false;document.emit('visibilitychange');await flush();
 assert.equal(audio.calls,calls);assert.equal(audio.paused,true);
 buttons[1].emit('click');await flush();assert.equal(audio.paused,false);assert.equal(buttons[0].attributes['aria-pressed'],'true');
});

test('Leaving the demo pauses its soundtrack, and returning resumes only a previously playing track',async()=>{
 const {audio,document}=await music({blocked:false});assert.equal(audio.paused,false);
 document.hidden=true;document.emit('visibilitychange');assert.equal(audio.paused,true);
 document.hidden=false;document.emit('visibilitychange');await flush();assert.equal(audio.paused,false);
});

test('An unavailable track leaves a truthful disabled control instead of claiming music is playing',async()=>{
 const {audio,buttons}=await music({blocked:false});audio.emit('error');
 assert.equal(buttons[0].disabled,true);assert.equal(buttons[1].label.textContent,'Musik nicht verfügbar');assert.equal(buttons[0].attributes['aria-pressed'],'false');
});

test('The published site includes the actual MP3 and the demo-only winter files',()=>{
 execFileSync(process.execPath,['tools/build-site.cjs'],{cwd:root});
 for(const name of ['Bittersweet Beauty.mp3','winter-scene.css','winter-scene.js'])assert.ok(fs.statSync(path.join(root,'_site',name)).size>0);
 assert.equal(fs.statSync(path.join(root,'_site','Bittersweet Beauty.mp3')).size,fs.statSync(path.join(root,'Bittersweet Beauty.mp3')).size);
 assert.ok(fs.readFileSync(path.join(root,'_site','index.html'),'utf8').includes('Bittersweet%20Beauty.mp3'));
 assert.ok(!fs.readFileSync(path.join(root,'avatar.js'),'utf8').includes('winter-scene'));
});
