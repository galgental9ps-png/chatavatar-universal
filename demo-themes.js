/* Demo-only worlds. The embedded avatar keeps its independent knowledge API. */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.DemoAvatarThemes=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const themes={
    'rave-grandpa':{id:'rave-grandpa',color:'#0b0c0e',track:2,
      headline:['Alter Hase.','Harter Beat.'],eyebrow:'DEIN RAVE-OPA IST BEREIT',stage:'ERNSTER BLICK. SCHNELLE SNEAKER.',symbol:'✦',
      scene:{file:'assets/rave-opa-warehouse-v1.png',alt:'Minimalistische dunkle Techno-Warehouse-Halle mit rechteckigen Betonträgern, orangefarbenen und limettengrünen Lichtlinien und freier Tanzfläche bis zum Rand.',
        eyebrow:'EIN TAKT. JEDE MENGE FUSSARBEIT.',title:['Willkommen im','Warehouse.'],intro:'Dunkler Beton. Warmes Neon. Platz für deinen nächsten Move.',caption:'Der Rave-Opa bittet zum Mitfeiern.'}},
    'shuffle-skeleton':{id:'shuffle-skeleton',color:'#07090c',track:2,
      headline:['Kleine Knochen.','Großer Beat.'],eyebrow:'DEIN KLEINER PARTYBEGLEITER',stage:'KNOCHENLOCKER. VOLLER GROOVE.',symbol:'♪',
      scene:{file:'assets/skelly-neon-bunker-v1.png',alt:'Minimalistischer schwarzer Techno-Bunker mit Gewölben, feinen cyan- und magentafarbenen Neonlinien und durchgehender Tanzfläche.',
        eyebrow:'EIN PLATZ ZUM MITFEIERN',title:['Dein kleiner','Neon-Bunker.'],intro:'Ein Beat. Ein Grinsen. Dein nächster Move.',caption:'Komm dazu. Die Tanzfläche ist frei.'}},
    jimmy:{id:'jimmy',color:'#f3f8ee',track:0,
      headline:['Ein Klick.','Voller Vorfreude.'],eyebrow:'DEIN FRÖHLICHER PARKBEGLEITER',stage:'KLEINE PFOTEN. GROSSE VORFREUDE.',symbol:'✦',
      scene:{file:'assets/jimmy-jungle-scene-v1.png',alt:'Warme moderne Dschungel-Spielwelt mit grünen Kletterbögen, Blättern, einer kleinen korallfarbenen Rutsche und freier Spielfläche.',
        eyebrow:'EIN KLEINES PARKABENTEUER',title:['Ein kleiner','Dschungelmoment.'],intro:'Warme Farben. Kleine Abenteuer. Jede Menge Vorfreude.',caption:'Ein bisschen Abenteuer passt in jeden Tag.'}},
    'ice-skater':{id:'ice-skater',color:'#eef6fc',track:0,
      headline:['Ein Schwung.','Voller Leichtigkeit.'],eyebrow:'DEIN MOMENT AUF DEM EIS',stage:'LEICHTE KUFEN. KLARE SPUREN.',symbol:'✧',
      scene:{file:'assets/lumi-blue-ice-scene-v1.png',alt:'Weite eisblaue Glas-Eisfläche bis zum Bildrand mit zarten Laufspuren und transparenten Kristallwänden vor einem hellen Berghorizont.',
        eyebrow:'EIN EISBLAUER AUGENBLICK',title:['Ein Hauch von','Eisblau.'],intro:'Klares Licht. Sanfte Spuren. Eine kleine Kür für dich.',caption:'Ein leiser Schwung über gläsernes Eis.'}},
    'ice-pair':{id:'ice-pair',color:'#160d23',track:0,
      headline:['Zwei Herzen.','Ein Rhythmus.'],eyebrow:'EIN PAARTANZ VOLLER GLANZ',stage:'ZWEI TÄNZER. EIN FUNKELNDER TAKT.',symbol:'✦',
      scene:{file:'assets/aurora-noel-crystal-scene-v1.png',alt:'Glamouröse violette Eis-Bühne mit feinen magenta-, türkis- und roségoldfarbenen Kristallen und durchgehender spiegelnder Eisfläche.',
        eyebrow:'EIN FUNKELNDER GEMEINSAMER MOMENT',title:['Eine Bühne.','Voller Glanz.'],intro:'Violett. Kristalllicht. Zwei Kufenpaare im selben Takt.',caption:'Eine kleine Bühne für große gemeinsame Momente.'}},
    'ice-pair-fine':{id:'ice-pair-fine',color:'#f5f6fb',track:0,
      headline:['Ein Moment.','Voller Magie.'],eyebrow:'EINE KÜR VOLLER LEICHTIGKEIT',stage:'FEINE SCHRITTE. EIN GEMEINSAMER RHYTHMUS.',symbol:'✧',
      scene:{file:'assets/glass-ice-scene-v1.png',alt:'Weite weiße Eisfläche in feiner Glasoptik, durchgehend bis zum Bildrand, mit zarten Eiskristallen am hellen Horizont.',
        eyebrow:'EIN KLEINER WINTERMOMENT',title:['Ein Hauch von','Winterzauber.'],intro:'Leise Klänge. Gläsernes Eis. Ein Moment nur für euch.',caption:'Ein leiser Moment zum Verweilen.'}}
  };
  function freeze(v){if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}
  freeze(themes);
  const get=id=>Object.hasOwn(themes,id)?themes[id]:themes['ice-pair-fine'];
  function apply(id,doc){
    const theme=get(id);doc.documentElement.dataset.avatarTheme=theme.id;
    const text=(selector,value)=>{const n=doc.querySelector(selector);if(n)n.textContent=value;};
    function heading(selector,parts){const n=doc.querySelector(selector);if(!n)return;const em=doc.createElement('em');em.textContent=parts[1];n.replaceChildren(parts[0],doc.createElement('br'),em);}
    const meta=doc.querySelector('meta[name="theme-color"]');if(meta)meta.content=theme.color;
    heading('#hero-title',theme.headline);heading('#winter-title',theme.scene.title);
    text('[data-theme-eyebrow]',theme.eyebrow);text('.stage-top span:first-child',theme.stage);text('.stage-top span:last-child',theme.symbol);
    text('.winter-heading .eyebrow',theme.scene.eyebrow);text('.winter-intro',theme.scene.intro);text('[data-scene-caption]',theme.scene.caption);
    const image=doc.querySelector('.winter-scene-image');if(image){image.src=theme.scene.file;image.alt=theme.scene.alt;}
    return theme;
  }
  return {themes,get,apply};
});
