const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('global-chart.js','utf8');
const ctx=vm.createContext({});
vm.runInContext(source.slice(source.indexOf('  function mergeBackup'),source.indexOf('  function importData'))+';this.mergeBackup=mergeBackup;',ctx);
const chart=(name,sign)=>({name,La:{sign,deg:1},planets:{Su:{sign,deg:2}}});
const current={jyotish_charts_v1:[chart('Mine',0)],jyotish_journal_v1:{a:{text:'one'}}};
const {store,added}=ctx.mergeBackup(current,{jyotish_charts_v1:[chart('Mine',0),chart('Sister',4)],jyotish_journal_v1:{a:{text:'changed'},b:{text:'two'}},jyotish_new_v1:[1]});
// Adds what is missing, never duplicates or overwrites.
assert.equal(added.charts,1);assert.equal(added.journal,1);assert.equal(added.other,1);
assert.deepEqual(store.jyotish_charts_v1.map(c=>c.name),['Mine','Sister']);
assert.equal(store.jyotish_journal_v1.a.text,'one');
assert.equal(store.jyotish_journal_v1.b.text,'two');
// The input store is not mutated.
assert.equal(current.jyotish_charts_v1.length,1);
// Malformed charts are skipped; names lose markup characters.
const r2=ctx.mergeBackup({},{jyotish_charts_v1:[{name:'x'},{...chart('<img src=x onerror=alert(1)>',2)}]});
assert.equal(r2.added.charts,1);
assert.ok(!/[<>"']/.test(r2.store.jyotish_charts_v1[0].name));
// Re-importing the same backup adds nothing.
assert.equal(ctx.mergeBackup(store,{jyotish_charts_v1:store.jyotish_charts_v1,jyotish_journal_v1:store.jyotish_journal_v1}).added.charts,0);
console.log('Backup merge: adds missing charts and journal entries, never overwrites, strips markup from names.');
