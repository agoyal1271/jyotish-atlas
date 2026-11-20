const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('index.html','utf8');
const start=html.indexOf('const AV_REFS='),end=html.indexOf('function computeSAV(',start);
assert.ok(start>=0&&end>start);
const ctx=vm.createContext({});vm.runInContext(html.slice(start,end)+';this.computeBAV=computeBAV;this.contributors=bmBAVContributors;',ctx);
const keys=['Su','Mo','Ma','Me','Ju','Ve','Sa'],planets=Object.fromEntries(keys.map((k,i)=>[k,{sign:i}]));
const chart={planets},pos={La:8,...Object.fromEntries(keys.map(k=>[k,planets[k].sign]))};
for(const k of keys)for(let sign=0;sign<12;sign++){
 const contributions=ctx.contributors(k,chart,8,sign);
 assert.equal(contributions.length,8);assert.equal(contributions.reduce((n,x)=>n+x.bindu,0),ctx.computeBAV(k,pos)[sign]);
}
assert.equal(ctx.contributors('Ra',chart,8,0),null);
assert.equal(ctx.contributors('Ju',{planets:{}},8,0),null);
console.log('Gochara BAV contributor bindus match production totals for every planet and sign.');
