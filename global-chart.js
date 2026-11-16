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
    menu.innerHTML=`<p>Switch active Kundali</p>${charts.map((c,i)=>`<div class="gcm-chart"><button type="button" data-chart-index="${i}" ${i===active?'aria-current="true"':''}><span>${i===active?'✦':'○'}</span><span>${escape(c.name||`Chart ${i+1}`)}</span></button><button type="button" class="gcm-remove" data-remove-index="${i}" aria-label="Remove ${escape(c.name||`Chart ${i+1}`)}" title="Remove chart">×</button></div>`).join('')}<button type="button" class="gcm-new" data-global-chart-action="create">＋ Create from birth details</button><button type="button" data-global-chart-action="import">⇧ Import chart text / .txt / .pdf</button><button type="button" data-global-chart-action="demo">Explore with Demo Chart</button>${charts.length?'<button type="button" data-global-chart-action="manage">Manage saved charts</button>':''}`;
    positionMenu();
  }
  function updatePill(){
    const pill=document.getElementById('activeChartPill');if(!pill)return;const c=JA.getActiveChart?.();
    if(!c){
      pill.hidden=false;
      pill.innerHTML='<span class="global-chart-dot">✦</span><span class="global-chart-copy"><span class="global-chart-name">No active Kundali</span><span class="global-chart-meta">Create, import, or explore a demo chart</span></span><span class="global-chart-caret">▾</span>';
      pill.title='Choose or create a Kundali';pill.setAttribute('aria-haspopup','menu');pill.setAttribute('aria-expanded','false');renderMenu();return;
    }
    const facts=chartFacts(c);pill.hidden=false;
    pill.innerHTML=`<span class="global-chart-dot">✦</span><span class="global-chart-copy"><span class="global-chart-name">${escape(c.name||'Untitled Kundali')}</span><span class="global-chart-meta">${escape(facts.lagna)} Lagna · ${escape(facts.nak)} · ${escape(facts.phase)}</span></span><span class="global-chart-caret">▾</span>`;
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
    menu.addEventListener('click',e=>{const chart=e.target.closest('[data-chart-index]'),remove=e.target.closest('[data-remove-index]'),action=e.target.closest('[data-global-chart-action]');if(chart){JA.activateChart?.(+chart.dataset.chartIndex,{stay:true});closeMenu();return;}if(remove){JA.removeChart?.(+remove.dataset.removeIndex);closeMenu();return;}if(action){closeMenu();if(action.dataset.globalChartAction==='create')JA.openBirthModal?.(action);if(action.dataset.globalChartAction==='import')JA.openImportModal?.(action);if(action.dataset.globalChartAction==='demo')document.getElementById('demoFirst')?.click();if(action.dataset.globalChartAction==='manage')AtlasNavigate?.('charts');}});
    document.addEventListener('click',e=>{if(!e.target.closest('#activeChartPill')&&!e.target.closest('#globalChartMenu'))closeMenu();});window.addEventListener('resize',positionMenu);
    document.addEventListener('click',e=>{const action=e.target.closest('[data-global-chart-action]');if(!action||action.closest('#globalChartMenu'))return;if(action.dataset.globalChartAction==='create')JA.openBirthModal?.(action);if(action.dataset.globalChartAction==='import')JA.openImportModal?.(action);if(action.dataset.globalChartAction==='demo')document.getElementById('demoFirst')?.click();});
    const prior=JA.onChartsChange;JA.onChartsChange=function(){prior?.();afterChartChange();};afterChartChange();
    // The core chart store emits this after every activation path. Queue one final binding pass
    // after legacy render callbacks have completed, preventing any tool-local select from
    // silently restoring its first option.
    window.addEventListener('atlas-active-chart-change',()=>queueMicrotask(afterChartChange));
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
