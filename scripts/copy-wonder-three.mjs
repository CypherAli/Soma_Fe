import fs from 'node:fs/promises';
const out='public/wonder/vendor';await fs.mkdir(out,{recursive:true});
for(const name of ['three.module.js','three.core.js'])await fs.copyFile('node_modules/three/build/'+name,out+'/'+name);
const room=await fs.readFile('node_modules/three/examples/jsm/environments/RoomEnvironment.js','utf8');
await fs.writeFile(out+'/RoomEnvironment.js',room.replace("from 'three'","from './three.module.js'"));
await fs.copyFile('node_modules/three/LICENSE',out+'/THREE-LICENSE.txt');
