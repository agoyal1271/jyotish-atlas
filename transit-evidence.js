/* Pure, shared transit evidence. Bands are display conventions, not probabilities.
 * SAV reference: Phaladeepika ch.23 v.20 (>28); BAV: >4 supportive, 4 mixed.
 * Use unreduced natal sign totals. Never project D1 SAV into divisional houses.
 */
(function(root){
  'use strict';
  function avEvidence(g){
    const sav=Number.isInteger(g?.savSign)&&g.savSign>=0?g.savSign:null;
    const bav=Number.isInteger(g?.bavSign)&&g.bavSign>=0&&g.bavSign<=8?g.bavSign:null;
    const s=sav===null?null:Math.sign(sav-28), b=bav===null?null:Math.sign(bav-4);
    const tone=s===null||b===null?'incomplete':s>0&&b>0?'supportive':s<0&&b<0?'demanding':'mixed';
    const label=tone==='supportive'?'Supportive Ashtakavarga evidence':tone==='demanding'?'Lower Ashtakavarga support':tone==='incomplete'?'Incomplete Ashtakavarga evidence':'Mixed Ashtakavarga evidence';
    return {sav,bav,tone,text:`${label}. SAV ${sav===null?'unavailable':sav+' ('+(s>0?'above':s<0?'below':'at')+' 28)' }; own BAV ${bav===null?'unavailable':bav+'/8 ('+(b>0?'supportive':b<0?'lower support':'mixed')+')'}.`};
  }
  function commonHouses(jupiterHouse,saturnHouse){
    if(![jupiterHouse,saturnHouse].every(h=>Number.isInteger(h)&&h>=1&&h<=12))return [];
    const houses=(h,offsets)=>offsets.map(d=>(h-1+d)%12+1);
    const sa=new Set(houses(saturnHouse,[0,2,6,9]));
    return houses(jupiterHouse,[0,4,6,8]).filter(h=>sa.has(h)).sort((a,b)=>a-b);
  }
  const api={avEvidence,commonHouses};
  root.AtlasTransit=api;
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
