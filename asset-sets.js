/* Change only ACTIVE_ASSET_SET when choosing another complete character set. */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.UniversalAvatarAssets=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const ACTIVE_ASSET_SET = 'shuffle-skeleton';
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
      introduction:'Die Eiskunstläuferin zeigt ihre kleine Kür: sanfter Anlauf, Drehsprünge, ruhige Pirouetten und elegante Gleitfiguren. Bei Fragen zum Park hilft sie euch gerne.',
      renderer:'canvas',environment:'none',poses,
      master:{file:'assets/lumi-master-v2.webp',width:1254,height:1254,columns:8,rows:8,frames:{"poses":[0,1,2,3,0,5,6,7,24,29,30,44,6,5,5,7],"glide":[8,8,9,9,10,10,11,11,12,12,13,13,14,14,15,15],"speed":[16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23],"jump":[24,25,26,27,32,33,34,35,36,37,38,39,41,42,43,44],"spin":[32,32,33,33,34,34,35,35,36,36,37,37,38,38,39,39],"spiral":[48,49,50,51,52,53,52,51,52,53,52,51,53,54,55,48],"flow":[3,42,41,41,40,40,39,32,40,40,41,41,42,42,43,47],"footwork":[56,56,57,57,58,58,59,59,60,60,61,61,62,62,63,63],"jumpBridge":[24,25,26,27,28,29,30,31,40,41,42,43,44,45,46,47]}},
      motion:{kind:'ice',desktop:192,mobile:160,stride:1.3,approachStride:1.22,speed:.75,performanceSpeed:1.25,tempo:.675,jumpTempo:.895,spinTempo:.79,acceleration:2.4,frames:16,spinDuration:3950,stopDuration:865},
      sheets:{
        poses:{file:'assets/ice-skater-poses-v1.webp',columns:4,rows:4,height:.88,reference:0},
        glide:{file:'assets/ice-skater-glide-v1.webp',columns:4,rows:4,height:.88,reference:0},
        spin:{file:'assets/ice-skater-spin-v1.webp',columns:4,rows:4,height:.88,reference:0},
        spiral:{file:'assets/ice-skater-spiral-v1.webp',columns:4,rows:4,height:.88,reference:0},
        speed:{file:'assets/ice-skater-speed-v2.webp',columns:4,rows:4,height:.68,reference:0},
        jump:{file:'assets/ice-skater-jump-v2.webp',columns:4,rows:4,height:.88,reference:15},
        flow:{file:'assets/ice-skater-flow-v2.webp',columns:4,rows:4,height:.88,reference:0},
        footwork:{file:'assets/ice-skater-footwork-v2.webp',columns:4,rows:4,height:.88,reference:0},
        jumpBridge:{file:'assets/ice-skater-jump-bridge-v3.webp',columns:4,rows:4,reference:8,
          match:[{sheet:'jump',frame:11,source:8},{sheet:'speed',frame:0,source:0}],axis:'center'}
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
  sets['ice-pair']={
    id:'ice-pair',name:'Aurora & Noel',role:'Eiskunstlauf-Paar',plural:true,
    subtitle:'Zwei Kufenpaare. Eine gemeinsame Kür.',
    introduction:'Die blonde Aurora und Noel mit blond-rotem Haar tanzen in bunten Glitzerkostümen: zwei eigenständige Eiskunstläufer mit synchronen Pirouetten, Gleitfiguren und Sprüngen aufeinander zu.',
    renderer:'canvas',environment:'none',poses,
    master:{columns:4,rows:8,required:true,
      actors:[
        {id:'aurora',name:'Aurora',file:'assets/aurora-action-v1.png',width:887,height:1774},
        {id:'noel',name:'Noel',file:'assets/noel-action-v1.png',width:887,height:1774}
      ],
      frames:{
        poses:[0,1,2,2,0,0,0,3,20,21,22,27,2,0,0,3],
        glide:[4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11],
        speed:[4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11],
        spin:[12,12,13,13,14,14,15,15,16,16,17,17,18,18,19,19],
        jump:[20,21,22,23,12,13,14,15,16,17,18,19,24,25,26,27],
        jumpBridge:[20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27],
        flow:[27,27,26,26,25,25,24,24,24,24,25,25,26,26,27,27],
        spiral:[28,28,29,29,30,30,30,30,30,30,30,30,31,31,28,28],
        footwork:[4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11]
      }},
    motion:{...sets['ice-skater'].motion,duet:true,desktop:192,mobile:160,spacing:.58},
    sheets:Object.fromEntries(Object.keys(sets['ice-skater'].sheets).map(key=>[key,{file:'assets/aurora-action-v1.png',columns:4,rows:8}])),
    personality:{
      idle:[
        'Zwei Kufenpaare, ein gemeinsamer Takt.',
        'Ein Lächeln für dich – von uns beiden!',
        'Unser schönster Trick? Aufeinander achten.',
        'Ein kleiner Knicks und eine Verbeugung für dich.',
        'Heute glitzert unser Paartanz ein bisschen heller.',
        'Wir sammeln schöne gemeinsame Momente.'
      ],
      walk:[
        'Ein Schwung, zwei Spuren – wir gleiten gemeinsam.',
        'Unsere Kufen zeichnen einen kleinen Tanz.',
        'Hand in Hand geht es sanft durch die Kurve.',
        'Wir haben den gleichen Rhythmus im Herzen.'
      ],
      jump:[
        'Wir nehmen gemeinsam Anlauf und springen aufeinander zu!',
        'Gleichzeitig abheben, weich landen und wieder zusammenfinden.',
        'Ein kleiner Flug für uns beide!'
      ],
      spin:[
        'Zwei Pirouetten, genau im selben Takt.',
        'Wir drehen getrennt und bleiben trotzdem ein Team.',
        'Einmal rundherum – und dann wieder zueinander.'
      ],
      routine:[
        'Erst gemeinsam, dann im gleichen Takt aufeinander zu!',
        'Unsere Kür beginnt: zwei Tänzer, eine kleine Geschichte.',
        'Achte auf unsere synchronen Pirouetten!',
        'Wir gleiten auseinander und finden tänzerisch wieder zusammen.'
      ]
    }
  };
  const fineFrames={...sets['ice-pair'].master.frames};
  sets['ice-pair-fine']={
    id:'ice-pair-fine',name:'Lina & Elio',role:'Feines Eiskunstlauf-Paar',plural:true,
    subtitle:'Leichte Schritte. Ein gemeinsamer Rhythmus.',
    introduction:'Lina mit blondem Dutt und Elio mit blond-rotem Haar zeigen eine feine Kür in Perlmutt, Flieder und Taubenblau: sanfte Gleitfiguren, kleine Drehsprünge und eine zweite Folge mit Solopirouetten und tänzerischem Umkreisen.',
    renderer:'canvas',environment:'none',poses,
    master:{columns:4,rows:8,required:true,normalize:true,
      actors:[
        {id:'lina',name:'Lina',file:'assets/lina-action-v1.png',width:887,height:1774,heightRatio:.83,
          frames:{...fineFrames,poses:[0,1,2,2,20,21,22,3,24,25,26,31,2,20,21,23],
            jump:[24,25,26,27,12,13,14,15,16,17,18,19,28,29,30,31],
            jumpBridge:[24,24,25,25,26,26,27,27,28,28,29,29,30,30,31,31],
            flow:[31,31,30,30,29,29,28,28,28,28,29,29,30,30,31,31],
            spiral:[27,27,28,28,29,29,30,30,30,30,30,30,31,31,27,27]}},
        {id:'elio',name:'Elio',file:'assets/elio-action-v1.png',width:887,height:1774,heightRatio:.85,
          rowBounds:[0,257,502,729,960,1183,1400,1602,1774],mirrorCells:[17,18,19],
          scaleGroups:[{from:4,to:11,reference:4},{from:12,to:19,reference:12},{from:20,to:31,reference:23}]}
      ],frames:fineFrames,
      variants:{encore:{columns:4,rows:8,normalize:true,
        actors:[
          {id:'lina',name:'Lina',file:'assets/lina-encore-v1.png',width:887,height:1774,heightRatio:.83,reference:31},
          {id:'elio',name:'Elio',file:'assets/elio-encore-v1.png',width:887,height:1774,heightRatio:.85,reference:31,
            frames:{spin:[0,1,2,3,4,5,6,7,8,7,6,5,4,3,2,1],
              glide:[16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23],
              flow:[24,24,25,25,26,26,27,27,28,28,29,29,30,30,31,31],
              poses:[31,31,27,31,31,31,31,31,31,31,31,31,31,31,31,31]},
            mirrorFrames:{spin:[9,10,11,12,13,14,15]}}
        ],frames:{spin:Array.from({length:16},(_,i)=>i),
          glide:[16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23],
          flow:[24,24,25,25,26,26,27,27,28,28,29,29,30,30,31,31],
          poses:[31,31,27,31,31,31,31,31,31,31,31,31,31,31,31,31]}}}},
    motion:{...sets['ice-pair'].motion,encore:true,tempo:.74,jumpTempo:1.04,spinTempo:.74,
      speed:.66,performanceSpeed:1.05,stride:1.6,approachStride:1.45,jumpHeight:.28,softJump:true,edgeLean:1.1,arcDepth:.04,groundInset:.12},
    sheets:Object.fromEntries(Object.keys(sets['ice-skater'].sheets).map(key=>[key,{file:'assets/lina-action-v1.png',columns:4,rows:8}])),
    personality:{
      idle:['Ein leiser Schwung, ein gemeinsames Lächeln.','Kleine Bewegungen können viel erzählen.','Wir bringen dir einen stillen Moment voller Leichtigkeit.','Ein freundlicher Gruß von Lina und Elio.'],
      walk:['Zwei feine Spuren im selben Takt.','Ganz leicht abstoßen und miteinander weitergleiten.','Unsere Schritte passen aufeinander auf.'],
      jump:['Ein kleiner Sprung, eine weiche Landung.','Zusammen abheben und sanft wieder ankommen.','Ein kurzer Flug für uns beide.'],
      spin:['Lina dreht sich, Elio tanzt um sie herum.','Eine Pirouette, noch eine – und dann wieder gemeinsam.','Wir finden nach jeder Drehung wieder zusammen.'],
      routine:['Jetzt tanzen wir unsere feine kleine Kür.','Heute wechseln sich Paartanz und Solopirouetten ab.','Ein wenig Leichtigkeit, nur für euch.']
    }
  };
  const doubled=from=>Array.from({length:16},(_,i)=>from+Math.floor(i/2));
  const skeletonFrames={running:Array.from({length:16},(_,i)=>i),tstep:doubled(16),slide:doubled(24),
    poses:Array(16).fill(0),groove:Array.from({length:16},(_,i)=>i)};
  sets['shuffle-skeleton']={
    id:'shuffle-skeleton',name:'Skelly',role:'Shuffle-Skelett',subtitle:'Kleine Knochen. Großer Groove.',
    introduction:'Das freundliche Cartoon-Skelett mit großen Augen, Sonnenbrille und Neon-Sneakern tanzt Melbourne Shuffle: Running Man auf der Stelle, T-Steps, Slides, Kicks und ganze Drehungen.',
    renderer:'canvas',environment:'none',poses,
    master:{columns:4,rows:8,required:true,normalize:true,
      actors:[{id:'skelly',name:'Skelly',file:'assets/skelly-shuffle-v1.png',width:887,height:1774,heightRatio:.84,reference:0}],
      frames:skeletonFrames,
      variants:{encore:{columns:4,rows:8,normalize:true,
        actors:[{id:'skelly',name:'Skelly',file:'assets/skelly-tricks-v1.png',width:887,height:1774,heightRatio:.84,reference:24}],
        frames:{spin:doubled(0),kicks:doubled(8),groove:doubled(16),
          poses:[24,25,26,27,28,29,31,30,8,9,10,24,30,28,29,31]}}}},
    motion:{kind:'shuffle',desktop:192,mobile:160,stride:1.1,speed:.68,acceleration:2.6,frames:16},
    sheets:Object.fromEntries(['running','tstep','slide','spin','kicks','groove','poses'].map(sheet=>[sheet,{file:'assets/skelly-shuffle-v1.png',columns:4,rows:8}])),
    personality:{
      idle:['Ich habe den Rhythmus in den Knochen!','Meine Sneaker leuchten schon mal vor.','Keine Angst, ich bin nur zum Tanzen hier.','Ein Lächeln passt zu jedem Beat.','Mein Lieblingssport? Knochenlocker bleiben!','Heute lasse ich die gute Laune hüpfen.'],
      walk:['Ein T-Step nach links – und die Sorgen rutschen weiter.','Meine Schuhe wissen schon, wo der Beat wohnt.','Ich gleite kurz um die Ecke.','Kleine Schritte, ganz viel Groove!'],
      jump:['Ein kleiner Kick für die gute Laune!','Die Knochen bleiben dran. Versprochen!','Knie hoch, Fuß raus, Grinsen an.'],
      spin:['Einmal rundherum – die Brille bleibt oben!','Auch mein Rücken kann tanzen.','Eine ganze Drehung voller guter Laune.'],
      routine:['Running Man an, Alltag aus!','Bereit? Ich shuffle eine kleine Runde für dich!','Erst die Füße, dann wackelt das ganze Grinsen.','Mein Knochenkonzert beginnt mit einem T-Step.','Der Running Man läuft. Ich bleibe trotzdem hier!']
    }
  };
  function freeze(value){if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;}
  freeze(sets);
  function get(id=ACTIVE_ASSET_SET){if(!Object.hasOwn(sets,id))throw Error('Unbekanntes Asset-Set: '+id);return sets[id];}
  const wrap=(frame,count)=>((Math.floor(frame)%count)+count)%count;
  function frameFor(asset,state='idle',frame=0,details={}){
    if(asset.motion.kind==='shuffle'){
      if(details.selection&&Object.hasOwn(asset.sheets,details.selection.sheet))return {sheet:details.selection.sheet,index:wrap(details.selection.index,16),
        ...(details.selection.atlas==='encore'?{atlas:'encore'}:{})};
      if(state==='walk')return {sheet:'slide',index:wrap(frame,16)};
      if(state==='idle')return {sheet:'groove',index:details.frozen?0:wrap(Math.max(0,details.elapsed||0)*8,16),atlas:'encore'};
      return {sheet:'poses',index:state==='jump'?[8,9,10,11][Math.min(3,Math.max(0,Math.floor(frame)))]:asset.poses[state]??0,atlas:'encore'};
    }
    const ice=asset.motion.kind==='ice',elapsed=Math.max(0,details.elapsed||0)*(ice?asset.motion.tempo||1:1);
    if(ice&&details.selection&&Object.hasOwn(asset.sheets,details.selection.sheet))return {sheet:details.selection.sheet,index:wrap(details.selection.index,16),
      ...(asset.master?.variants?.[details.selection.atlas]?.frames?.[details.selection.sheet]?{atlas:details.selection.atlas}:{})};
    if(ice&&state==='spin'){
      const spinElapsed=Math.max(0,details.elapsed||0)*(asset.motion.spinTempo||asset.motion.tempo||1);
      if(spinElapsed<.2)return {sheet:'spin',index:0};
      if(spinElapsed<2.35)return {sheet:'spin',index:wrap((spinElapsed-.2)*32/2.15,16)};
      return spinElapsed<2.45?{sheet:'spin',index:0}:{sheet:'poses',index:spinElapsed<2.65?12:0};
    }
    if(ice&&state==='skate-stop')return elapsed<.26?{sheet:'glide',index:elapsed<.13?15:0}:{sheet:'poses',index:0};
    if(state==='walk'){
      if(!ice)return {sheet:'walk',index:wrap(frame,8)};
      if(details.style==='speed')return elapsed<.27?{sheet:'jumpBridge',index:Math.min(2,Math.floor(elapsed/.27*3))}:{sheet:'speed',index:wrap(frame,16)};
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
  function layoutFor(asset,sheet,index,width,anchors){
    const spec=asset.sheets[sheet],frames=anchors[sheet];
    if(!frames)return {x:0,y:0,width,height:width,scale:1};
    function scaleFor(key,seen=new Set()){
      if(seen.has(key))throw Error('Zirkuläre Größenreferenz.');
      seen.add(key);
      const info=asset.sheets[key],reference=anchors[key][info.reference||0];
      const span=Math.max(.3,reference.bottom-reference.top);
      const matches=(Array.isArray(info.match)?info.match:info.match?[info.match]:[]).filter(match=>anchors[match.sheet]);
      if(matches.length){
        const sum=matches.reduce((total,match)=>{
          const target=anchors[match.sheet][match.frame],from=anchors[key][match.source??info.reference??0];
          const ratio=(target.bottom-target.top)*scaleFor(match.sheet,new Set(seen))/Math.max(.3,from.bottom-from.top);
          return total+Math.log(ratio);
        },0);
        return Math.exp(sum/matches.length);
      }
      return (info.height||.88)/span;
    }
    // One fixed anatomical scale per atlas. A bent pose must never be enlarged
    // to the height of a standing pose. References compare like-for-like crouched
    // and closed airborne poses; their geometric mean avoids favoring one atlas.
    const scale=scaleFor(sheet),anchor=frames[index];
    const centered=spec.axis==='center'||sheet==='spin'||sheet==='jump';
    return {x:(centered?.5-.5*scale:.52-anchor.head*scale)*width,
      y:(.945-anchor.bottom*scale)*width,width:width*scale,height:width*scale,scale};
  }
  return {activeId:ACTIVE_ASSET_SET,active:get(),sets,get,frameFor,layoutFor};
});

