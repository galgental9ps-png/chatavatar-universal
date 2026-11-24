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
 const audio=new Events();Object.assign(audio,{paused:true,ended:false,allowed:!blocked,calls:0,loop:true,src:'Bittersweet%20Beauty.mp3',loads:0});
 audio.play=function(){this.calls++;if(!this.allowed)return Promise.reject(Object.assign(Error('User activation required'),{name:'NotAllowedError'}));this.paused=false;this.emit('play');return Promise.resolve();};
 audio.pause=function(){this.paused=true;this.emit('pause');};
 audio.load=function(){this.loads++;this.paused=true;this.ended=false;};
 const buttons=[true,false].map(compact=>{
   const button=new Events(),label={textContent:''};
   Object.assign(button,{dataset:{},attributes:{},classList:{contains:()=>compact},querySelector:()=>label,setAttribute(name,value){this.attributes[name]=value;},closest:()=>button,label});return button;
 });
 const next=new Events(),track={textContent:''};
 const document=new Events();Object.assign(document,{hidden:false,getElementById:id=>id==='demo-music'?audio:null,querySelectorAll:selector=>selector==='[data-music-toggle]'?buttons:selector==='[data-music-next]'?[next]:selector==='[data-music-track]'?[track]:[]});
 vm.runInNewContext(fs.readFileSync(path.join(root,'winter-scene.js'),'utf8'),{document,window:{},Promise,Set});await flush();
 return {audio,buttons,document,next,track};
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

test('An unavailable track is skipped once; if both fail, music controls truthfully become unavailable',async()=>{
 const {audio,buttons,track,next}=await music({blocked:false});audio.emit('error');await flush();
 assert.equal(track.textContent,'Glacial Arpeggios');assert.equal(buttons[0].disabled,false);
 audio.emit('error');await flush();
 assert.equal(buttons[0].disabled,true);assert.equal(buttons[1].label.textContent,'Musik nicht verfügbar');assert.equal(buttons[0].attributes['aria-pressed'],'false');
 assert.equal(next.disabled,true);
});

test('Track endings alternate both uploaded songs and wrap to the first without a native single-track loop',async()=>{
 const {audio,track}=await music({blocked:false});assert.equal(audio.loop,false);assert.equal(track.textContent,'Bittersweet Beauty');
 audio.paused=true;audio.ended=true;audio.emit('ended');await flush();
 assert.equal(audio.src,'Glacial%20Arpeggios.mp3');assert.equal(track.textContent,'Glacial Arpeggios');assert.equal(audio.paused,false);
 audio.paused=true;audio.ended=true;audio.emit('ended');await flush();
 assert.equal(audio.src,'Bittersweet%20Beauty.mp3');assert.equal(track.textContent,'Bittersweet Beauty');assert.equal(audio.paused,false);assert.equal(audio.loads,2);
});

test('Skipping while paused selects the next song without undoing the manual pause',async()=>{
 const {audio,buttons,next,track,document}=await music({blocked:false});buttons[0].emit('click');await flush();
 const calls=audio.calls;next.emit('click');await flush();assert.equal(audio.calls,calls);assert.equal(audio.paused,true);assert.equal(track.textContent,'Glacial Arpeggios');
 document.emit('click',{target:{closest:()=>null}});document.hidden=true;document.emit('visibilitychange');document.hidden=false;document.emit('visibilitychange');await flush();assert.equal(audio.paused,true);
 buttons[1].emit('click');await flush();assert.equal(audio.paused,false);assert.equal(audio.src,'Glacial%20Arpeggios.mp3');
});

test('A track ending as the tab becomes hidden waits for return before starting the next song',async()=>{
 const {audio,document,track}=await music({blocked:false});document.hidden=true;
 audio.paused=true;audio.ended=true;audio.emit('ended');await flush();assert.equal(track.textContent,'Glacial Arpeggios');assert.equal(audio.paused,true);
 document.hidden=false;document.emit('visibilitychange');await flush();assert.equal(audio.paused,false);
});

test('The published site includes both actual MP3s and the demo-only winter files',()=>{
 execFileSync(process.execPath,['tools/build-site.cjs'],{cwd:root});
 for(const name of ['Bittersweet Beauty.mp3','Glacial Arpeggios.mp3','winter-scene.css','winter-scene.js'])assert.ok(fs.statSync(path.join(root,'_site',name)).size>0);
 assert.equal(fs.statSync(path.join(root,'_site','Bittersweet Beauty.mp3')).size,fs.statSync(path.join(root,'Bittersweet Beauty.mp3')).size);
 assert.equal(fs.statSync(path.join(root,'_site','Glacial Arpeggios.mp3')).size,fs.statSync(path.join(root,'Glacial Arpeggios.mp3')).size);
 assert.ok(fs.readFileSync(path.join(root,'_site','index.html'),'utf8').includes('Bittersweet%20Beauty.mp3'));
 assert.ok(!/id="demo-music"[^>]*\bloop\b/.test(fs.readFileSync(path.join(root,'_site','index.html'),'utf8')));
 assert.ok(!fs.readFileSync(path.join(root,'avatar.js'),'utf8').includes('winter-scene'));
});
