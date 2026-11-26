/* Bounded, sampled calculations for evidence views; never a probability or exact ingress. */
(function(root){
  const DAY=86400000, keys=['Ju','Sa','Ra','Ke'];
  function transitTimeline(start,end,read,targets){
    if(!Number.isFinite(start)||!Number.isFinite(end)||end<=start)return {rows:[],reason:'Period boundaries are unavailable.'};
    if(end-start>5*366*DAY)return {rows:[],reason:'Select a period of five years or less to see daily sampled contacts.'};
    const rows=[],states=new Map();
    for(let t=start;t<end;t+=DAY){
      let sky;try{sky=read(new Date(t));if(!sky)throw Error('missing');}catch(e){sky=null;}
      for(const k of keys){const p=sky?.[k];let value='';
        if(!Number.isInteger(p?.sign))value='Data unavailable';
        else {const offsets=k==='Ju'?[0,4,6,8]:k==='Sa'?[0,2,6,9]:[0,4,6,8];const contacts=targets.filter(x=>offsets.includes((x.sign-p.sign+12)%12)).map(x=>x.label);value=`sign ${p.sign} | ${contacts.join(', ')||'no selected contacts'}`;}
        const previous=states.get(k);if(previous&&previous.value===value)previous.end=Math.min(t+DAY,end);else{const row={planet:k,start:t,end:Math.min(t+DAY,end),value};rows.push(row);states.set(k,row);}
      }
    }
    return {rows,reason:null};
  }
  function sensitivity(utc,minutes,recalculate,vargas){
    const t=Date.parse(utc);if(!Number.isFinite(t)||!Number.isFinite(minutes)||minutes<=0||minutes>120)return null;
    const step=60000,samples=[];for(let delta=-minutes;delta<=minutes;delta+=1)samples.push(recalculate(new Date(t+delta*step)));
    const changes={};for(const n of vargas){const values=new Set(samples.map(x=>x.vargas[n]));changes[n]=[...values];}
    const planetChanges={};for(const n of vargas)for(const k of Object.keys(samples[0].planetVargas?.[n]||{})){const values=[...new Set(samples.map(x=>x.planetVargas[n][k]))];if(values.length>1)(planetChanges[n]??={})[k]=values;}
    return {minutes,samples:samples.length,changes,planetChanges,moonSigns:[...new Set(samples.map(x=>x.moonSign))],moonStars:[...new Set(samples.map(x=>x.moonStar))]};
  }
  const api={transitTimeline,sensitivity};root.AtlasDashaExtra=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(globalThis);
