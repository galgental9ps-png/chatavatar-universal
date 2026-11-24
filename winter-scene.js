/* Background music for the demo page; the winter panorama is decorative. */
(function () {
  'use strict';
  const audio=document.getElementById('demo-music');
  if(!audio)return;
  const buttons=Array.from(document.querySelectorAll('[data-music-toggle]'));
  const nextButtons=Array.from(document.querySelectorAll('[data-music-next]'));
  const trackLabels=Array.from(document.querySelectorAll('[data-music-track]'));
  const tracks=[
    {src:'Bittersweet%20Beauty.mp3',title:'Bittersweet Beauty'},
    {src:'Glacial%20Arpeggios.mp3',title:'Glacial Arpeggios'},
    {src:'Hoffnungsvoll.mp3',title:'Hoffnungsvoll'}
  ];
  const trackFor=id=>window.DemoAvatarThemes?.get(id)?.track??(['shuffle-skeleton','rave-grandpa'].includes(id)?2:0);
  let index=trackFor(window.UniversalAvatarAssets?.activeId||document.documentElement?.dataset.avatarTheme),mayAutoStart=true,starting=false,userPaused=false,resumeOnVisible=false,failed=false,playRequest=0;
  const unavailable=new Set();
  audio.src=tracks[index].src;
  audio.volume=.28;audio.loop=false;
  function renderMusic(){
    const playing=!failed&&!audio.paused&&!audio.ended;
    for(const button of buttons){
      const action=failed?'Musik nicht verfügbar':playing?'Musik pausieren':'Musik einschalten';
      button.dataset.state=failed?'unavailable':playing?'playing':'paused';
      button.setAttribute('aria-pressed',String(playing));button.setAttribute('aria-label',action);button.title=action;button.disabled=failed;
      const label=button.querySelector('[data-music-label]');
      if(label)label.textContent=button.classList.contains('music-toggle--compact')?'Musik':action;
    }
    for(const button of nextButtons)button.disabled=failed;
    for(const label of trackLabels)label.textContent=tracks[index].title;
  }
  function removeActivation(){document.removeEventListener('click',activate,true);document.removeEventListener('keydown',activate,true);}
  function stopPlayback(){playRequest++;starting=false;audio.pause();}
  async function playMusic(){
    if(starting||failed||userPaused||document.hidden)return;
    const request=++playRequest;starting=true;
    try{
      await audio.play();
      if(request!==playRequest)return;
      if(userPaused||document.hidden)audio.pause();
      else{mayAutoStart=false;removeActivation();}
    }catch(error){
      // A blocked autoplay remains available from either visible music button.
    }finally{if(request===playRequest){starting=false;renderMusic();}}
  }
  function nextTrack(shouldPlay,selected){
    stopPlayback();
    index=selected??(index+1)%tracks.length;
    while(unavailable.has(index)&&unavailable.size<tracks.length)index=(index+1)%tracks.length;
    audio.src=tracks[index].src;audio.load();renderMusic();
    if(shouldPlay&&!userPaused){
      if(document.hidden)resumeOnVisible=true;
      else playMusic();
    }
  }
  function activate(event){
    if(!mayAutoStart||userPaused||event.target.closest?.('[data-music-toggle],[data-music-next]'))return;
    if(event.type==='keydown'&&(!['Enter',' '].includes(event.key)||event.ctrlKey||event.metaKey||event.altKey))return;
    playMusic();
  }
  for(const button of buttons)button.addEventListener('click',()=>{
    mayAutoStart=false;removeActivation();
    if(!audio.paused||starting){userPaused=true;resumeOnVisible=false;stopPlayback();renderMusic();}
    else{userPaused=false;playMusic();}
  });
  for(const button of nextButtons)button.addEventListener('click',()=>{
    mayAutoStart=false;removeActivation();nextTrack(!userPaused);
  });
  audio.addEventListener('play',renderMusic);audio.addEventListener('pause',renderMusic);
  audio.addEventListener('ended',()=>{if(!failed)nextTrack(!userPaused);});
  audio.addEventListener('error',()=>{
    unavailable.add(index);
    if(unavailable.size<tracks.length){nextTrack(!userPaused);return;}
    failed=true;stopPlayback();removeActivation();renderMusic();
  });
  document.addEventListener('click',activate,true);document.addEventListener('keydown',activate,true);
  document.addEventListener('jimmy:asset-change',event=>{
    if(!event.detail?.id)return;
    const selected=trackFor(event.detail.id);
    if(selected!==index)nextTrack(!userPaused,selected);
  });
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){resumeOnVisible=(!audio.paused||starting)&&!userPaused;stopPlayback();}
    else if(resumeOnVisible&&!userPaused){resumeOnVisible=false;playMusic();}
  });
  renderMusic();playMusic();
})();
