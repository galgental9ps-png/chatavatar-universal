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
    if(!['routine','running-man','t-step','slides','spin','kicks'].includes(mode))throw Error('Unbekannte Shuffle-Folge.');
    const max=Math.max(0,viewportWidth-size.width),x0=clamp(startX,0,max),blocks=[];
    let x=x0,time=0;
    const add=(sheet,beats,{to=x,cycles=beats/2,atlas}={})=>{
      const duration=beats*500,next=clamp(to,0,max);
      blocks.push({sheet,atlas,cycles,from:x,to:next,start:time,end:time+duration,duration});
      time+=duration;x=next;
    };
    const side=()=>x>max/2?-1:1;
    const travel=()=>Math.min(size.width*.8,max*.32);
    const groove=()=>add('groove',2,{cycles:1,atlas:'encore'});
    groove();
    if(mode==='routine'){
      add('running',8,{cycles:4});
      add('tstep',4,{to:x+side()*travel(),cycles:2});
      add('running',4,{cycles:2});
      add('slide',4,{to:x+side()*travel(),cycles:2});
      add('spin',4,{cycles:2,atlas:'encore'});
      add('kicks',4,{cycles:2,atlas:'encore'});
      add('running',8,{cycles:4});
    }else if(mode==='running-man')add('running',16,{cycles:8});
    else if(mode==='t-step'){
      add('tstep',4,{to:x+side()*travel(),cycles:2});
      add('tstep',4,{to:x0,cycles:2});
    }else if(mode==='slides'){
      const target=targetX==null?x+side()*travel()*1.5:clamp(targetX,0,max);
      const beats=Math.max(4,Math.ceil(Math.abs(target-x)/Math.max(1,size.width*.45)*2)/2);
      add('slide',beats,{to:target,cycles:beats/2});
    }else add(mode,8,{cycles:4,atlas:'encore'});
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
