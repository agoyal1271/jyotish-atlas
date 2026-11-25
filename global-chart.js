/* One chart context for every reading tool. Calculation modules retain their own controls,
   but the controls are synchronized and removed from the visual flow. */
(function(){
  const selectors=['bbChart','arChart','kdChart','opChart','lpChart','olChart','pbChart','jrChart'];
  const gates=['d1gBody','pbEmpty','bbEmpty','arEmpty','kdEmpty','opEmpty','lpEmpty','olEmpty','jrEmpty','synthChartBar'];
  let menu, syncing=false;
  const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const currentPeriod=c=>{const now=Date.now(),md=c?.dashas?.mahas?.find(x=>x.start<=now&&(!x.end||now<x.end));const ad=md?.antars?.find(x=>x.start<=now&&(!x.end||now<x.end));return{md,ad};};
  const chartFacts=c=>{
    if(!c?.La)return null;
    const lagna=SIGNS[c.La.sign]||'Lagna unavailable';
    const moon=c.planets?.Mo;const nak=moon?nakInfo(moon.sign*30+moon.deg)?.n||'Moon detail unavailable':'Moon unavailable';
    const p=currentPeriod(c),phase=p.md?`${GBYK[p.md.lord]?.name||p.md.lord} MD${p.ad?` · ${GBYK[p.ad.lord]?.name||p.ad.lord} AD`:''}`:'Daśā dates unavailable';
    return {lagna,nak,phase};
  };
  const gate=()=>`<div class="celestial-gate"><div><div class="celestial-gate-mark" aria-hidden="true">✦</div><h3>Begin with your Kundali</h3><p>Your chart becomes the shared lens for every decoder, timeline and reading in Atlas.</p><div class="celestial-gate-actions"><button type="button" class="gate-primary" data-global-chart-action="create">Create Your Kundali</button><button type="button" class="gate-secondary" data-global-chart-action="demo">Explore with Demo Chart</button><button type="button" class="gate-secondary" data-global-chart-action="import">Import text or file</button></div></div></div>`;
  function positionMenu(){const pill=document.getElementById('activeChartPill');if(!pill||!menu)return;const box=pill.getBoundingClientRect();menu.style.top=`${box.bottom+8}px`;menu.style.left=`${Math.max(12,box.right-Math.min(340,window.innerWidth-24))}px`;}
  function closeMenu(){if(menu)menu.hidden=true;document.getElementById('activeChartPill')?.setAttribute('aria-expanded','false');}
  function renderMenu(){
    if(!menu)return;const charts=JA.getCharts?.()||[],active=JA.getActiveIndex?.();
    menu.innerHTML=`<p>Switch active Kundali</p>${charts.map((c,i)=>`<div class="gcm-chart"><button type="button" data-chart-index="${i}" ${i===active?'aria-current="true"':''}><span>${i===active?'✦':'○'}</span><span>${escape(c.name||`Chart ${i+1}`)}</span></button><button type="button" class="gcm-remove" data-remove-index="${i}" aria-label="Remove ${escape(c.name||`Chart ${i+1}`)}" title="Remove chart">×</button></div>`).join('')}<button type="button" class="gcm-new" data-global-chart-action="create">＋ Create from birth details</button><button type="button" data-global-chart-action="import">⇧ Import chart text / .txt / .pdf</button><button type="button" data-global-chart-action="demo">Explore with Demo Chart</button>${charts.length?'<button type="button" data-global-chart-action="manage">Manage saved charts</button>':''}`+
      `<p>Your data</p>${backupDue()?'<div class="gcm-backup-note">Your charts and journal live only in this browser. A backup file keeps them safe.</div>':''}`+
      `<button type="button" data-global-chart-action="backup">⇩ Back up my data</button><button type="button" data-global-chart-action="restore">⇧ Restore from a backup</button>`+
      `<p class="gcm-backup-when">${lastBackupText()}</p>`;
    positionMenu();
  }

  /* ---- Backup and restore ----
     Everything lives in this browser's storage. A backup is one JSON file with the charts,
     the journal and any other saved data (keys starting "jyotish_"). Restoring MERGES: it adds
     charts and journal entries this browser doesn't have and never deletes or overwrites. */
  const BACKUP_FORMAT='jyotish-atlas-backup', LAST_BACKUP='ja.lastBackup', FIRST_DATA='ja.firstDataSeen';
  const DAY=86400000;
  const read=k=>{try{return localStorage.getItem(k);}catch(e){return null;}};
  const write=(k,v)=>{try{localStorage.setItem(k,v);return true;}catch(e){return false;}};
  function dataKeys(){const out=[];try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.startsWith('jyotish_'))out.push(k);}}catch(e){}return out;}
  function hasData(){return (JA.getCharts?.()||[]).length>0||Object.keys(JSON.parse(read('jyotish_journal_v1')||'{}')).length>0;}
  function backupDue(){
    if(!hasData())return false;
    const now=Date.now(),first=Date.parse(read(FIRST_DATA)||''),last=Date.parse(read(LAST_BACKUP)||'');
    if(!Number.isFinite(first)){write(FIRST_DATA,new Date(now).toISOString());return false;}
    return Number.isFinite(last)?now-last>30*DAY:now-first>7*DAY;
  }
  function lastBackupText(){const last=Date.parse(read(LAST_BACKUP)||'');return Number.isFinite(last)?`Last backup ${new Date(last).toLocaleDateString()}`:'Not backed up yet';}
  function exportData(){
    const data={};dataKeys().forEach(k=>{try{data[k]=JSON.parse(read(k));}catch(e){data[k]=read(k);}});
    const file={format:BACKUP_FORMAT,version:1,exportedAt:new Date().toISOString(),data};
    const blob=new Blob([JSON.stringify(file,null,2)],{type:'application/json'});
    const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`jyotish-atlas-backup-${new Date().toISOString().slice(0,10)}.json`;
    document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
    write(LAST_BACKUP,new Date().toISOString());updatePill();
    JA.toast?.(`Backup saved: ${(data.jyotish_charts_v1||[]).length} charts, ${Object.keys(data.jyotish_journal_v1||{}).length} journal entries`,'ok');
  }
  // Pure merge, exported for tests: returns the merged store and what was added.
  function mergeBackup(current,incoming){
    const out={...current},added={charts:0,journal:0,other:0};
    const same=(a,b)=>a&&b&&a.name===b.name&&JSON.stringify(a.La)===JSON.stringify(b.La)&&JSON.stringify(a.planets)===JSON.stringify(b.planets);
    for(const [k,v] of Object.entries(incoming||{})){
      // Chart names are shown in many places, not all escaped: strip markup characters from
      // names arriving in a file so a crafted backup can't inject HTML.
      if(k==='jyotish_charts_v1'&&Array.isArray(v)){const have=Array.isArray(out[k])?out[k].slice():[];v.forEach(raw=>{const c=raw&&{...raw,name:String(raw.name||'Imported chart').replace(/[<>"'&`]/g,'').slice(0,80)};if(c&&c.La&&c.planets&&!have.some(h=>same(h,c))){have.push(c);added.charts++;}});out[k]=have;}
      else if(k==='jyotish_journal_v1'&&v&&typeof v==='object'){const have={...(out[k]||{})};Object.entries(v).forEach(([id,e])=>{if(!(id in have)){have[id]=e;added.journal++;}});out[k]=have;}
      else if(k.startsWith('jyotish_')&&!(k in out)){out[k]=v;added.other++;}
    }
    return {store:out,added};
  }
  function importData(file){
    const reader=new FileReader();
    reader.onload=()=>{
      let parsed;try{parsed=JSON.parse(reader.result);}catch(e){JA.toast?.('That file isn’t a Jyotish Atlas backup. Choose the .json file saved by “Back up my data”.','warn');return;}
      if(!parsed||parsed.format!==BACKUP_FORMAT||!parsed.data){JA.toast?.('That file isn’t a Jyotish Atlas backup. Choose the .json file saved by “Back up my data”.','warn');return;}
      const current={};dataKeys().forEach(k=>{try{current[k]=JSON.parse(read(k));}catch(e){current[k]=read(k);}});
      const {store,added}=mergeBackup(current,parsed.data);
      let ok=true;for(const [k,v] of Object.entries(store)) ok=write(k,typeof v==='string'?v:JSON.stringify(v))&&ok;
      if(!ok){JA.toast?.('Couldn’t restore everything: this browser’s storage is full.','warn');return;}
      const total=added.charts+added.journal+added.other;
      if(!total){JA.toast?.('Nothing new to restore: this browser already has everything in that backup.','ok');return;}
      JA.toast?.(`Restored ${added.charts} charts and ${added.journal} journal entries. Reloading…`,'ok');
      setTimeout(()=>location.reload(),1400); // the chart store reads storage once at start-up
    };
    reader.readAsText(file);
  }
  function chooseBackupFile(){
    const input=document.createElement('input');input.type='file';input.accept='application/json,.json';
    input.addEventListener('change',()=>{if(input.files&&input.files[0])importData(input.files[0]);});
    input.click();
  }
  window.AtlasBackup={exportData,chooseBackupFile,mergeBackup};
  function updatePill(){
    const pill=document.getElementById('activeChartPill');if(!pill)return;const c=JA.getActiveChart?.();
    if(!c){
      pill.hidden=false;
      pill.innerHTML='<span class="global-chart-dot">✦</span><span class="global-chart-copy"><span class="global-chart-name">No active Kundali</span><span class="global-chart-meta">Create, import, or explore a demo chart</span></span><span class="global-chart-caret">▾</span>';
      pill.title='Choose or create a Kundali';pill.setAttribute('aria-haspopup','menu');pill.setAttribute('aria-expanded','false');renderMenu();return;
    }
    const facts=chartFacts(c);pill.hidden=false;
    const due=backupDue();
    pill.classList.toggle('backup-due',due);
    pill.innerHTML=`<span class="global-chart-dot">✦</span>${due?'<span class="global-chart-backup" title="Your data hasn’t been backed up recently">Back up</span>':''}<span class="global-chart-copy"><span class="global-chart-name">${escape(c.name||'Untitled Kundali')}</span><span class="global-chart-meta">${escape(facts.lagna)} Lagna · ${escape(facts.nak)} · ${escape(facts.phase)}</span></span><span class="global-chart-caret">▾</span>`;
    pill.title='Change active Kundali';pill.setAttribute('aria-haspopup','menu');pill.setAttribute('aria-expanded',String(!menu?.hidden));
    renderMenu();
  }
  function syncTools(){
    const active=JA.getActiveIndex?.();const has=Number.isInteger(active)&&active>=0;
    selectors.forEach(id=>{const el=document.getElementById(id);if(!el)return;el.closest('.bb-sel-grp')?.classList.add('global-chart-bound');if(has){el.value=String(active);if(id!=='pbChart')el.dispatchEvent(new Event('change',{bubbles:true}));}});
    gates.forEach(id=>{const el=document.getElementById(id);if(!el)return;if(!has){el.innerHTML=gate();el.style.display='';}else if(el.querySelector('.celestial-gate')){el.style.display='none';}});
  }
  function afterChartChange(){if(syncing)return;syncing=true;try{updatePill();syncTools();}finally{syncing=false;}}
  function init(){
    menu=document.createElement('div');menu.className='global-chart-menu';menu.id='globalChartMenu';menu.hidden=true;menu.setAttribute('role','menu');document.body.append(menu);
    const pill=document.getElementById('activeChartPill');
    if(pill)pill.dataset.globalChartPill='true';
    pill?.addEventListener('click',e=>{e.preventDefault();if(menu.hidden){renderMenu();menu.hidden=false;pill.setAttribute('aria-expanded','true');}else closeMenu();});
    menu.addEventListener('click',e=>{const chart=e.target.closest('[data-chart-index]'),remove=e.target.closest('[data-remove-index]'),action=e.target.closest('[data-global-chart-action]');if(chart){JA.activateChart?.(+chart.dataset.chartIndex,{stay:true});closeMenu();return;}if(remove){JA.removeChart?.(+remove.dataset.removeIndex);closeMenu();return;}if(action){closeMenu();if(action.dataset.globalChartAction==='create')JA.openBirthModal?.(action);if(action.dataset.globalChartAction==='import')JA.openImportModal?.(action);if(action.dataset.globalChartAction==='demo')document.getElementById('demoFirst')?.click();if(action.dataset.globalChartAction==='manage')AtlasNavigate?.('charts');if(action.dataset.globalChartAction==='backup')exportData();if(action.dataset.globalChartAction==='restore')chooseBackupFile();}});
    document.addEventListener('click',e=>{if(!e.target.closest('#activeChartPill')&&!e.target.closest('#globalChartMenu'))closeMenu();});window.addEventListener('resize',positionMenu);
    document.addEventListener('click',e=>{const action=e.target.closest('[data-global-chart-action]');if(!action||action.closest('#globalChartMenu'))return;if(action.dataset.globalChartAction==='create')JA.openBirthModal?.(action);if(action.dataset.globalChartAction==='import')JA.openImportModal?.(action);if(action.dataset.globalChartAction==='demo')document.getElementById('demoFirst')?.click();});
    const prior=JA.onChartsChange;JA.onChartsChange=function(){prior?.();afterChartChange();};afterChartChange();
    // One gentle reminder per session when a backup is due (see backupDue).
    try{if(backupDue()&&!sessionStorage.getItem('ja.backupNudged')){sessionStorage.setItem('ja.backupNudged','1');setTimeout(()=>JA.toast?.('Your charts live only in this browser. Open the chart menu and choose “Back up my data” to keep a copy.','ok'),2500);}}catch(e){}
    // The core chart store emits this after every activation path. Queue one final binding pass
    // after legacy render callbacks have completed, preventing any tool-local select from
    // silently restoring its first option.
    window.addEventListener('atlas-active-chart-change',()=>queueMicrotask(()=>{try{afterChartChange();}catch(e){console.error('Global active-chart binding failed:',e);}}));
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
