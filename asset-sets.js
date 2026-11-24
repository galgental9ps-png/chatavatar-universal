/* Change only ACTIVE_ASSET_SET when choosing another complete character set. */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.UniversalAvatarAssets=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const ACTIVE_ASSET_SET = 'ice-skater';
  const poses={idle:0,wave:1,talk:2,point:3,think:13,held:14,rest:15,celebrate:12,fall:10,land:11};
  const sets={
    jimmy:{
      id:'jimmy',name:'Jimmy',role:'Park-Affe',subtitle:'Dein Parkbegleiter · Demo',
      introduction:'Der fröhliche Park-Affe hilft euch bei Öffnungszeiten, Eintritt, Geburtstagen und Attraktionen.',
      renderer:'background',environment:'none',poses,
      motion:{kind:'walk',desktop:192,mobile:152,stride:.43,speed:.44,acceleration:3.2,frames:8},
      sheets:{poses:{file:'assets/jimmy-poses-v1.webp',columns:4,rows:4},walk:{file:'assets/jimmy-walk-v3.webp',columns:4,rows:2}}
    },
    'ice-skater':{
      id:'ice-skater',name:'Lumi',role:'Eiskunstläuferin',subtitle:'Deine anmutige Begleiterin',
      introduction:'Die Eiskunstläuferin zeigt ihre kleine Kür: schneller Anlauf, Drehsprünge, Pirouetten und elegante Gleitfiguren. Bei Fragen zum Park hilft sie euch gerne.',
      renderer:'canvas',environment:'none',poses,
      motion:{kind:'ice',desktop:218,mobile:174,stride:1.3,speed:1.15,acceleration:2.4,frames:16,spinDuration:3000,stopDuration:600},
      sheets:{
        poses:{file:'assets/ice-skater-poses-v1.webp',columns:4,rows:4,height:.88,reference:0},
        glide:{file:'assets/ice-skater-glide-v1.webp',columns:4,rows:4,height:.88,reference:0},
        spin:{file:'assets/ice-skater-spin-v1.webp',columns:4,rows:4,height:.88,reference:0},
        spiral:{file:'assets/ice-skater-spiral-v1.webp',columns:4,rows:4,height:.88,reference:0},
        speed:{file:'assets/ice-skater-speed-v2.webp',columns:4,rows:4,height:.68,reference:0},
        jump:{file:'assets/ice-skater-jump-v2.webp',columns:4,rows:4,height:.88,reference:15},
        flow:{file:'assets/ice-skater-flow-v2.webp',columns:4,rows:4,height:.88,reference:0},
        footwork:{file:'assets/ice-skater-footwork-v2.webp',columns:4,rows:4,height:.88,reference:0}
      },
      personality:{
        idle:[
          'Ein ruhiger Atemzug, ein sanfter Schwung – und los geht’s.',
          'Heute funkelt die gute Laune wie frisches Eis.',
          'Eine kleine Verbeugung für dich!',
          'Ich sammle schöne Kurven statt gerader Wege.',
          'Mein Kleid hat heute ein bisschen Sternenstaub dabei.',
          'Ein Lächeln gehört für mich zu jeder Kür.',
          'Eine schöne Bewegung darf sich Zeit lassen.',
          'Kleine Schritte können der Anfang einer großen Kür sein.'
        ],
        walk:[
          'Ein sanfter Abstoß – den Rest übernehmen die Kufen.',
          'Ich ziehe eine kleine Spur ins Eis.',
          'Einmal elegant am Bildschirmrand entlang.',
          'Gleiten fühlt sich für mich ein bisschen wie Schweben an.',
          'Meine Kufen zeichnen heute kleine Bögen.',
          'Arme weich, Blick nach vorn – ich genieße die Runde.'
        ],
        jump:[
          'Tief in die Knie, Schwung holen – und drehen!',
          'Anlauf, ein kleiner Flug und eine weiche Landung.',
          'Meine Kufen haben gerade kurz Pause. Ich drehe weiter!',
          'Und jetzt ein Drehsprung für dich!'
        ],
        spin:[
          'Eine kleine Pirouette für dich!',
          'Einmal rundherum – und die Welt glitzert weiter.',
          'Mein Rock dreht eine kleine Ehrenrunde.',
          'Ein leiser Kreis auf einer schmalen Kufe.'
        ],
        routine:[
          'Bereit für meine kleine Kür? Dann nehme ich jetzt Anlauf!',
          'Erst Schwung, dann ein Sprung – und elegant weiter.',
          'Ich tanze dir eine kleine Runde über den Bildschirm.',
          'Heute gehört ein bisschen Tempo zu meiner Kür.',
          'Kleine Kufen, große Vorfreude. Meine Kür beginnt!',
          'Achte mal auf die Landung – die soll ganz weich sein.'
        ]
      }
    }
  };
  function freeze(value){if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;}
  freeze(sets);
  function get(id=ACTIVE_ASSET_SET){if(!Object.hasOwn(sets,id))throw Error('Unbekanntes Asset-Set: '+id);return sets[id];}
  const wrap=(frame,count)=>((Math.floor(frame)%count)+count)%count;
  function frameFor(asset,state='idle',frame=0,details={}){
    const elapsed=Math.max(0,details.elapsed||0),ice=asset.motion.kind==='ice';
    if(ice&&details.selection&&Object.hasOwn(asset.sheets,details.selection.sheet))return {sheet:details.selection.sheet,index:wrap(details.selection.index,16)};
    if(ice&&state==='spin'){
      if(elapsed<.2)return {sheet:'spin',index:0};
      if(elapsed<2.35)return {sheet:'spin',index:wrap((elapsed-.2)*32/2.15,16)};
      return elapsed<2.45?{sheet:'spin',index:0}:{sheet:'poses',index:elapsed<2.65?12:0};
    }
    if(ice&&state==='skate-stop')return elapsed<.26?{sheet:'glide',index:elapsed<.13?15:0}:{sheet:'poses',index:0};
    if(state==='walk'){
      if(!ice)return {sheet:'walk',index:wrap(frame,8)};
      if(details.style==='speed')return elapsed<.27?{sheet:'jump',index:Math.min(2,Math.floor(elapsed/.27*3))}:{sheet:'speed',index:wrap(frame,16)};
      if(details.style==='footwork')return {sheet:'footwork',index:wrap(elapsed*12,16)};
      if(details.style==='spiral'){
        let index;
        if(elapsed<.6)index=Math.min(5,Math.floor(elapsed/.6*6));
        else if(details.remaining<.6)index=Math.min(15,12+Math.floor((.6-Math.max(0,details.remaining))/.6*4));
        else index=6+wrap((elapsed-.6)*9,6);
        return {sheet:'spiral',index};
      }
      return {sheet:'glide',index:wrap(frame,16)};
    }
    return {sheet:'poses',index:state==='jump'?[8,9,10,11][Math.min(3,Math.max(0,Math.floor(frame)))]:asset.poses[state]??0};
  }
  return {activeId:ACTIVE_ASSET_SET,active:get(),sets,get,frameFor};
});
