'use strict';
const fs = require('node:fs'), path = require('node:path');
const root = path.join(__dirname,'..'), dest = path.join(root,'_site');
fs.rmSync(dest,{recursive:true,force:true});fs.mkdirSync(dest);
for(const name of ['index.html','demo.css','demo.js','winter-scene.css','winter-scene.js','Bittersweet Beauty.mp3','Glacial Arpeggios.mp3','jimmy-theme.css','avatar.js','avatar.css','asset-sets.js','mascot.js','mascot.css','motion-core.js','skating-core.js','shuffle-core.js','personality-core.js','assets','favicon.svg','admin.html','admin.js','app.css','knowledge-core.js','github-publisher.js','embed.html','embed.js','embed-beispiel.html','body-end.html','.nojekyll','knowledge','docs']) fs.cpSync(path.join(root,name),path.join(dest,name),{recursive:true});
console.log('Statische Seite in _site vorbereitet.');

