(function(){
  const media=matchMedia('(prefers-color-scheme: light)');
  let mode='system';try{mode=localStorage.getItem('ja_theme')||'system';}catch(e){}
  if(!['light','dark','system'].includes(mode))mode='system';
  function apply(){
    const light=mode==='light'||mode==='system'&&media.matches;
    document.documentElement.classList.toggle('light',light);
    document.documentElement.dataset.appearance=mode;
    document.documentElement.style.colorScheme=light?'light':'dark';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content',light?'#F9F6F0':'#0B0D14');
    document.querySelectorAll('[data-appearance]').forEach(el=>el.value=mode);
  }
  window.AtlasAppearance={set(value){mode=['light','dark','system'].includes(value)?value:'system';try{localStorage.setItem('ja_theme',mode);}catch(e){}apply();},apply};
  media.addEventListener('change',apply);
  document.addEventListener('change',e=>{if(e.target.matches('[data-appearance]'))AtlasAppearance.set(e.target.value);});
  document.addEventListener('DOMContentLoaded',apply);apply();
})();
