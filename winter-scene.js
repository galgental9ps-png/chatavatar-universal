/* Background music for the demo page; the winter panorama is decorative. */
(function () {
  'use strict';
  const audio=document.getElementById('demo-music');
  if(!audio)return;
  const buttons=Array.from(document.querySelectorAll('[data-music-toggle]'));
  let mayAutoStart=true,starting=false,userPaused=false,resumeOnVisible=false,failed=false;
  audio.volume=.28;
  function renderMusic(){
    const playing=!failed&&!audio.paused&&!audio.ended;
    for(const button of buttons){
      const action=failed?'Musik nicht verfügbar':playing?'Musik pausieren':'Musik einschalten';
      button.dataset.state=failed?'unavailable':playing?'playing':'paused';
      button.setAttribute('aria-pressed',String(playing));button.setAttribute('aria-label',action);button.title=action;button.disabled=failed;
      const label=button.querySelector('[data-music-label]');
      if(label)label.textContent=button.classList.contains('music-toggle--compact')?'Musik':action;
    }
  }
  function removeActivation(){document.removeEventListener('click',activate,true);document.removeEventListener('keydown',activate,true);}
  async function playMusic(){
    if(starting||failed||userPaused||document.hidden)return;
    starting=true;
    try{
      await audio.play();
      if(userPaused||document.hidden)audio.pause();
      else{mayAutoStart=false;removeActivation();}
    }catch(error){
      // A blocked autoplay remains available from either visible music button.
    }finally{starting=false;renderMusic();}
  }
  function activate(event){
    if(!mayAutoStart||userPaused||event.target.closest?.('[data-music-toggle]'))return;
    if(event.type==='keydown'&&(!['Enter',' '].includes(event.key)||event.ctrlKey||event.metaKey||event.altKey))return;
    playMusic();
  }
  for(const button of buttons)button.addEventListener('click',()=>{
    mayAutoStart=false;removeActivation();
    if(!audio.paused||starting){userPaused=true;resumeOnVisible=false;audio.pause();renderMusic();}
    else{userPaused=false;playMusic();}
  });
  audio.addEventListener('play',renderMusic);audio.addEventListener('pause',renderMusic);
  audio.addEventListener('error',()=>{failed=true;audio.pause();removeActivation();renderMusic();});
  document.addEventListener('click',activate,true);document.addEventListener('keydown',activate,true);
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){resumeOnVisible=(!audio.paused||starting)&&!userPaused;audio.pause();}
    else if(resumeOnVisible&&!userPaused){resumeOnVisible=false;playMusic();}
  });
  renderMusic();playMusic();
})();
