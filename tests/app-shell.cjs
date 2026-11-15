const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('app-shell.js','utf8');
function element(id){return {id,hidden:false,dataset:{workspace:id},attrs:{},classList:{toggle(){}},setAttribute(k,v){this.attrs[k]=v},removeAttribute(k){delete this.attrs[k]},querySelector(){return null},focus(){this.focused=true},scrollIntoView(){this.scrolled=true},closest(){return this.view||this}};}
const ids=['atlasExperience','charts','synth','starthere','grahas','promptbuilder'];
const views=ids.map(element),elements=Object.fromEntries(views.map(v=>[v.id,v]));
elements.dashaPanel=element('dashaPanel');elements.dashaPanel.view=elements.charts;
elements.workspaceLessons=element('workspaceLessons');elements.workspaceTitle=element('workspaceTitle');
const links=ids.map(element),main={scrollTop:0,prepend(){}},select={},location={hash:''},historyCalls=[];
const ctx=vm.createContext({document:{getElementById:id=>elements[id],documentElement:{classList:{remove(){}}},querySelectorAll:()=>[]},main,views,select,links,active:null,positions:new Map(),labels:new Map(ids.map(x=>[x,x])),lessons:[['starthere','Start'],['grahas','Planets']],location,history:{pushState:(a,b,h)=>{location.hash=h;historyCalls.push(h)},replaceState:(a,b,h)=>location.hash=h}});
vm.runInContext(source.slice(source.indexOf('  function resolve'),source.indexOf('  window.AtlasNavigate'))+';this.open=open;',ctx);
function only(id){assert.deepEqual(views.filter(v=>!v.hidden).map(v=>v.id),[id]);}
ctx.open('charts');only('charts');assert.equal(location.hash,'#charts');
main.scrollTop=300;ctx.open('synth');only('synth');assert.equal(main.scrollTop,0);
ctx.open('charts');only('charts');assert.equal(main.scrollTop,300);
ctx.open('dashaPanel');only('charts');assert.equal(elements.dashaPanel.scrolled,true);
ctx.open('grahas');only('grahas');assert.equal(select.value,'starthere');assert.equal(elements.workspaceLessons.hidden,false);
const before=historyCalls.length;ctx.open('promptbuilder',{historyMode:'none'});only('promptbuilder');assert.equal(historyCalls.length,before);
assert.equal(ctx.open('unknown'),false);only('promptbuilder');
assert.equal(elements.promptbuilder.focused,true);
const html=fs.readFileSync('index.html','utf8');
assert.ok(html.includes('AtlasNavigate(STEPS[idx].id)'));
assert.ok(html.includes('run:()=>AtlasNavigate(id)'));
assert.ok(!/getElementById\(["'](?:charts|synth|promptbuilder)["']\)\??\.scrollIntoView/.test(html));
console.log('Workspace isolation, nested routes, history, scroll restoration, focus and legacy navigation checks passed.');
