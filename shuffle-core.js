/* Whole-body Melbourne Shuffle poses, sampled from one elapsed-time clock. */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.UniversalShuffle=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  const smooth=p=>p*p*p*(10+p*(-15+6*p));
  function createPlan({mode='routine',startX=0,viewportWidth,size,targetX}){
    if(!['routine','freestyle','running-man','t-step','slides','spin','kicks','heeltoe','charleston','hands'].includes(mode))throw Error('Unbekannte Shuffle-Folge.');
    const max=Math.max(0,viewportWidth-size.width),x0=clamp(startX,0,max),blocks=[];
    const beat=60000/clamp(size.bpm||120,100,170);
    let x=x0,time=0;
    const add=(sheet,beats,{to=x,cycles=beats/2,atlas}={})=>{
      const duration=beats*beat,next=clamp(to,0,max);
      blocks.push({sheet,atlas,cycles,from:x,to:next,start:time,end:time+duration,duration});
      time+=duration;x=next;
    };
    const side=()=>x>max/2?-1:1;
    const travel=()=>Math.min(size.width*.8,max*.32);
    const groove=()=>{const beats=mode==='routine'?2:1;add('groove',beats,{cycles:beats/2,atlas:'encore'});};
    const running=(beats,to=x)=>add('running',beats,{cycles:beats/2,to,atlas:'running'});
    const drift=()=>x+side()*Math.min(size.width*.28,max*.16);
    const spin=(beats=2,open=false)=>add('spin',beats,{cycles:beats/2,atlas:open?'moves':'encore'});
    groove();
    if(mode==='routine'&&size.power){
      running(8,drift());
      add('heeltoe',4,{cycles:2,atlas:'moves'});spin(4);
      add('tstep',4,{to:x+side()*travel(),cycles:2});
      add('kicks',4,{cycles:2,atlas:'encore'});
      add('hands',4,{cycles:2,atlas:'moves'});
      running(8,drift());
      add('slide',4,{to:x+side()*travel(),cycles:2});spin(4,true);
    }else if(mode==='routine'){
      // Keep the first published sequence, its source poses and timing intact.
      add('running',8,{cycles:4});
      add('tstep',4,{to:x+side()*travel(),cycles:2});
      add('running',4,{cycles:2});
      add('slide',4,{to:x+side()*travel(),cycles:2});
      add('spin',4,{cycles:2,atlas:'encore'});
      add('kicks',4,{cycles:2,atlas:'encore'});
      add('running',8,{cycles:4});
    }else if(mode==='freestyle'){
      running(4,drift());spin();
      running(4,x+(x>x0?-1:1)*Math.min(size.width*.36,max*.2));
      add('heeltoe',4,{cycles:2,atlas:'moves'});spin(2,true);
      add('tstep',4,{to:x+side()*travel(),cycles:2});
      add('hands',4,{cycles:2,atlas:'moves'});
      running(4,drift());
      add('charleston',4,{cycles:2,atlas:'moves'});spin(4,true);
      add('slide',4,{to:x+side()*travel(),cycles:2});
      add('kicks',2,{cycles:1,atlas:'encore'});
      add('hands',2,{cycles:1,atlas:'moves'});
      running(4,drift());spin();
    }else if(mode==='running-man'){
      running(4);running(4,drift());running(4,x0);running(4);
    }
    else if(mode==='t-step'){
      add('tstep',4,{to:x+side()*travel(),cycles:2});
      add('tstep',4,{to:x0,cycles:2});
    }else if(mode==='slides'){
      const target=targetX==null?x+side()*travel()*1.5:clamp(targetX,0,max);
      const beats=Math.max(4,Math.ceil(Math.abs(target-x)/Math.max(1,size.width*.45)*2)/2);
      add('slide',beats,{to:target,cycles:beats/2});
    }else if(mode==='spin'){spin(4);spin(4,true);}
    else add(mode,8,{cycles:4,atlas:mode==='kicks'?'encore':'moves'});
    groove();
    return {kind:'shuffle',mode,blocks,duration:time,from:x0,to:x};
  }
  function atTime(plan,milliseconds){
    const t=clamp(Number(milliseconds)||0,0,plan.duration),finished=milliseconds>=plan.duration;
    const block=plan.blocks.find(b=>t<b.end)||plan.blocks.at(-1);
    const p=clamp((t-block.start)/block.duration,0,1),distance=block.to-block.from;
    const index=finished?0:Math.floor(p*block.cycles*16)%16;
    return {x:block.from+distance*smooth(p),lift:0,facing:1,
      velocity:Math.abs(distance)*30*p*p*(1-p)*(1-p)/(block.duration/1000),
      sheet:block.sheet,index,...(block.atlas?{atlas:block.atlas}:{}),phase:'shuffle-'+block.sheet,
      safeExit:block.sheet==='groove'||index===0,finished};
  }
  return {createPlan,atTime};
});
