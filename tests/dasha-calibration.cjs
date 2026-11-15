const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('index.html','utf8');
const start=html.indexOf('function dpFunctionalReliefs('),end=html.indexOf('// Layer 2: functional quality score',start);
assert.ok(start>=0&&end>start,'Dasha calibration helpers must be present.');
const ctx=vm.createContext({
  SIGN_LORD:["Me","Ve","Me","Mo","Su","Me","Ve","Ma","Ju","Sa","Sa","Ju"],
  houseFromSigns:(a,b)=>(b-a+12)%12+1,
  dignityOf:(k,s)=>({score:k==='Me'?1.5:k==='Ju'?0:0}),
  aspectsFromHouse:(k,h)=>k==='Me'?[7]:k==='Ju'?[9]:[],
  charaKarakas:()=>[{k:'Ve'},{k:'Ma'}],
  vargaSign:(s,d,n)=>s,
  functionalNature:k=>({houses:k==='Ma'?[6,10]:[]})
});
vm.runInContext(html.slice(start,end)+';this.rules={dpFunctionalReliefs,dpCareerDelivery};',ctx);
const high={planets:{Ma:{sign:6,deg:10,ishta:48.38,kashta:10.07},Me:{sign:5,deg:10}}};
const ishta=ctx.rules.dpFunctionalReliefs('Ma',high,5,-1,2);
assert.ok(ishta.ishtaApplied>=.69&&ishta.total<=.85,'high Ishta / low Kashta should substantially temper functional friction');
const aspectChart={planets:{Ma:{sign:6,deg:10},Me:{sign:5,deg:10}}};
const aspect=ctx.rules.dpFunctionalReliefs('Ma',aspectChart,5,-1,7);
assert.equal(aspect.lagnaAspectApplied,.7,'own/exalted Lagna lord aspect must cancel 70% of a functional penalty');
const d10Chart={La:{sign:0,deg:5},planets:{Ma:{sign:8,deg:10},Ju:{sign:8,deg:8}}};
const career=ctx.rules.dpCareerDelivery(d10Chart,0,'Ma','Ju');
assert.ok(career.score>0&&career.items[0].d10H===9&&career.items[0].jupiterSupport,'AmK in D-10 H9 with Jupiter should lift career delivery');
assert.ok(html.includes("[3,6,10,11].includes(hk)"),'Nodes must receive their upachaya modifier in H10 too.');
console.log('Dasha calibration: node H10, Ishta/Kashta, Lagna aspect and D-10 career checks passed.');
