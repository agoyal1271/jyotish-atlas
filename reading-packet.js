/* Export helpers: explicit UTC dates, bounded sampling, no inferred chart facts. */
(function(root){
  'use strict';
  const DAY=86400000;
  function scope(question,from,until){
    const m=String(question).match(/\bnext\s+(\d+|one|two|three|four|five)\s+(years?|months?)\b/i);
    if(!m)return 'Timing claims are restricted to '+from+' through '+until+'. If the question implies a different horizon, disclose the mismatch.';
    const n=Number(m[1])||({one:1,two:2,three:3,four:4,five:5})[m[1].toLowerCase()];
    const start=new Date(from+'T00:00:00Z'), target=new Date(start);
    if(/^year/i.test(m[2]))target.setUTCFullYear(target.getUTCFullYear()+n);
    else target.setUTCMonth(target.getUTCMonth()+n);
    const date=target.toISOString().slice(0,10);
    return until<date?'TIMEFRAME MISMATCH: interpreting “next '+n+' '+m[2]+'” from export start '+from+' reaches '+date+', but supplied coverage ends '+until+'. Restrict timing claims to supplied coverage; the remaining window is missing.':'Requested question horizon fits within the export dates. Restrict timing claims to '+from+' through '+until+'.';
  }
  function validate(c){
    const valid=p=>p&&Number.isInteger(p.sign)&&p.sign>=0&&p.sign<12&&Number.isFinite(p.deg)&&p.deg>=0&&p.deg<30;
    const missing=[];
    if(!valid(c?.La))missing.push('Lagna sign and degree');
    for(const k of ['Su','Mo','Ma','Me','Ju','Ve','Sa','Ra','Ke'])if(!valid(c?.planets?.[k]))missing.push(k+' sign and degree');
    if(missing.length)throw Error('Chart data incomplete: '+missing.join(', ')+'. Import complete placements before preparing a personal reading.');
  }
  function schedule(start,end,read){
    if(!Number.isFinite(start)||!Number.isFinite(end)||end<=start||end-start>1830*DAY)throw Error('Choose a transit window of no more than five years.');
    const rows=[];let current=null;
    for(let time=start;time<end;time+=DAY){
      let value;try{value=read(time);}catch(e){value='DATA GAP: transit calculation unavailable';}
      if(value!==current?.value){current={start:time,end:Math.min(time+DAY,end),value};rows.push(current);}
      else current.end=Math.min(time+DAY,end);
    }
    return rows;
  }
  const api={scope,validate,schedule};root.AtlasPacket=api;
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(globalThis);
