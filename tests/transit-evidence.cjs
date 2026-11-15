const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const A=require('../transit-evidence.js');
assert.equal(A.avEvidence({savSign:32,bavSign:5}).tone,'supportive');
assert.equal(A.avEvidence({savSign:32,bavSign:2}).tone,'mixed');
assert.equal(A.avEvidence({savSign:25,bavSign:6}).tone,'mixed');
assert.equal(A.avEvidence({savSign:28,bavSign:4}).tone,'mixed');
assert.equal(A.avEvidence({savSign:23,bavSign:2}).tone,'demanding');
assert.equal(A.avEvidence({savSign:32}).tone,'incomplete');
assert.equal(A.avEvidence({savSign:0,bavSign:0}).sav,0);
assert.deepEqual(A.commonHouses(1,1),[1,7]);
assert.deepEqual(A.commonHouses(1,2),[]);
assert.deepEqual(A.commonHouses(12,12),[6,12]);
assert.deepEqual(A.commonHouses(null,1),[]);
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
for(const match of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g))new vm.Script(match[1]);
// Exercise the actual production transit scorer with controlled chart inputs.
const start=html.indexOf('function dpLayer3('),end=html.indexOf('// Scan an antardasha',start);
const ctx={AtlasTransit:A,functionalNature:()=>({tier:'benefic'}),GBYK:{Ju:{name:'Jupiter'},Sa:{name:'Saturn'}},nakIndexOf:()=>0,taraFrom:()=>({q:0}),nakInfo:()=>({n:'test'})};
vm.createContext(ctx);vm.runInContext(html.slice(start,end),ctx);
for(const special of ['sade-sati','dhaiya']){
 const result=ctx.dpLayer3({planets:{Mo:{sign:0,deg:5}}},0,{}, {Sa:{h:1,hLa:1,sign:0,deg:10,satSpecial:special,savSign:32,bavSign:5},Ju:{h:3,hLa:1,sign:0,deg:10,good:false,savSign:32,bavSign:5}});
 assert.equal(result.saScore,0,'special condition must not force a penalty');
 assert.equal(result.doubleTransit,true,'joint activation is independent of favourable scores');
 assert.equal(result.avEvidence[1].tone,'supportive');
 assert.equal(result.doubleTransitHouses.includes(7),true);
}
console.log('Transit evidence, production scoring and inline syntax checks passed.');
