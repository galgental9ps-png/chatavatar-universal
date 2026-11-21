'use strict';
const fs = require('node:fs'), path = require('node:path'), K = require('../knowledge-core.js');
const pack = K.validate(JSON.parse(fs.readFileSync(path.join(__dirname,'../knowledge/jimmys-funpark.json'),'utf8')));
fs.writeFileSync(path.join(__dirname,'../knowledge/jimmys-funpark.bundle.js'),K.bundle(pack));
console.log('Offlinepaket aktualisiert: '+pack.entries.length+' Antworten.');

