import {pageWith} from './lib.mjs';import {JSDOM} from 'jsdom';import {readFileSync} from 'node:fs';import assert from 'node:assert/strict';
const html=pageWith('ejemplos/metodo-comparado-grupo1.js');
const dom=new JSDOM(html,{runScripts:'dangerously',url:'https://example.test/?room=ABC123',pretendToBeVisual:true});
const w=dom.window;await new Promise(r=>setTimeout(r,300));
w.firebase={firestore:{FieldValue:{serverTimestamp:()=>'TS'}}};let written=null;w.confirm=()=>true;w.alert=()=>{};
w.eval(`activateQuizVersion(3);isHost=true;uid='o';roomId='ABC123';room={owner:'o',status:'lobby',mode:'competition',quizVersion:3,idx:-1,reveal:false,revealStage:0,publicView:'welcome',questionTimes:[40,40,40,40]};
people=[{uid:'a',name:'Ana',ready:true},{uid:'b',name:'ana',ready:false},{uid:'c',name:'Luis',ready:true}];loadedPeople=true;loadedVotes=new Set([0,1,2,3]);
globalThis.__written=null;rref=()=>({update:async c=>{globalThis.__written=c},collection:()=>({doc:id=>({delete:async()=>{globalThis.__deleted=id}})})});render();`);
const d=w.document;
assert.equal(d.getElementById('start').disabled,true,'start strict disabled');
assert.equal(d.getElementById('startAnyway').classList.contains('hidden'),false,'startAnyway visible');
assert.equal(d.getElementById('startAnyway').disabled,false);
const chips=[...d.querySelectorAll('#attendanceNames span')].map(s=>s.textContent);console.log(chips);
assert(chips.filter(c=>c.includes('posible duplicado')).length===2);
assert(d.querySelectorAll('#attendanceNames button').length===3,'Quitar buttons');
assert(!d.getElementById('resetOfficial').classList.contains('hidden'),'reset visible in lobby');
console.log('guide:',d.getElementById('stageGuide').textContent);
d.getElementById('startAnyway').click();await new Promise(r=>setTimeout(r,50));
const wr=w.eval('globalThis.__written');console.log(wr&&Object.keys(wr),wr?.status,wr?.publicView);assert.equal(wr.status,'live');assert.equal(wr.publicView,'questions');
// remove participant
d.querySelector('#attendanceNames button').click();await new Promise(r=>setTimeout(r,50));console.log('deleted uid:',w.eval('globalThis.__deleted'));
// all ready -> strict start enabled, override hidden
w.eval(`room.status='lobby';people.forEach(p=>p.ready=true);globalThis.__written=null;render()`);
assert.equal(d.getElementById('start').disabled,false);assert(d.getElementById('startAnyway').classList.contains('hidden'));
d.getElementById('start').click();await new Promise(r=>setTimeout(r,50));assert.equal(w.eval('globalThis.__written').status,'live');
// participant not owner sees no Quitar
w.eval(`room.status='lobby';uid='x';render()`);assert.equal(d.querySelectorAll('#attendanceNames button').length,0);
// sala finalizada: la pantalla pública no debe aparentar sala de espera con QR
w.eval("uid='o';room.status='done';room.publicView='welcome';projecting=true;renderProjection()");
assert(d.getElementById('projectChart').textContent.includes('La sala está cerrada'),'pública cerrada');
assert(d.getElementById('projectStage').textContent==='Sala cerrada');
// reapertura automática: solo con sala cerrada Y vacía, una vez, y solo el propietario
let reopened=0;d.getElementById('resetOfficial').onclick=()=>{reopened++};
w.eval("projecting=false;uid='o';roomId='EMPTY1';room.owner='o';room.status='done';room.mode='competition';people=[];votes=Array.from({length:N},()=>[]);loadedPeople=true;loadedVotes=new Set([0,1,2,3]);render();render()");
assert.equal(reopened,1,'reabre una sola vez');
w.eval("roomId='FULL01';people=[{uid:'a',name:'Ana',ready:true}];render()");assert.equal(reopened,1,'no actúa con participantes');
w.eval("roomId='VOTES1';people=[];votes[0]=[{uid:'a',choice:1}];render()");assert.equal(reopened,1,'no actúa con votos');
w.eval("roomId='OTHER1';votes=Array.from({length:N},()=>[]);room.owner='z';render()");assert.equal(reopened,1,'solo propietario');
assert(!d.body.innerHTML.includes('teacherSimulation'),'sin simulación');
// guiones: cada distractor recibe SU explicación aunque las alternativas estén reordenadas
const tr=w.eval('PEDAGOGY.slice(0,4).map(p=>p.trap)');
assert(tr[0][1].includes('idénticos')&&tr[0][2].includes('país')&&tr[0][3].includes('manzana'),'trap P1');
assert(tr[1][0].includes('prohibición')&&tr[1][2].includes('denominación')&&tr[1][3].includes('valores'),'trap P2');
assert(tr[2][0].includes('Sartori')&&tr[2][1].includes('fijos')&&tr[2][3].includes('Invierte'),'trap P3');
assert(tr[3][0].includes('razón')&&tr[3][1].includes('desempeño')&&tr[3][2].includes('unidad de medida')&&tr[3][3]===null,'trap P4');
assert.deepEqual([...w.eval('QUIZ.map(q=>q.correct)')],[0,1,2,3]);
w.eval(`roomId='GUION1';room.owner='o';uid='o';room.status='live';room.idx=3;room.reveal=true;room.revealStage=3;projecting=false;activeTab=3;hostReadingView='notes';people=[{uid:'a',name:'A',ready:true},{uid:'b',name:'B',ready:true},{uid:'c',name:'C',ready:true}];
votes=Array.from({length:N},()=>[]);votes[3]=[{uid:'a',choice:3},{uid:'b',choice:0},{uid:'c',choice:0}];loadedPeople=true;loadedVotes=new Set([0,1,2,3]);render()`);
const txt=d.getElementById('hostChart').textContent;
for(const s of ['Para decir','Preguntas para conversar','Ejemplo para aclarar','Puente a lo siguiente','3 respuestas de 3 inscritos','Error más frecuente: A (66.7 %)','Desambigüemos','una razón 40/20','Por qué la D es la correcta','1 · 33.3 % ✓ correcta'])assert(txt.includes(s),'falta: '+s);
assert(!txt.includes('Error más frecuente: B'),'sin inventar errores');w.eval("votes[3]=[{uid:'a',choice:3},{uid:'b',choice:3},{uid:'c',choice:3}];render()");const all=d.getElementById('hostChart').textContent;assert(all.includes('Por qué la D es la correcta')&&!all.includes('Error más frecuente'),'todos correctos');
w.eval(`projecting=true;room.status='done';room.publicView='questions';renderProjection()`);
const fin=d.getElementById('projectChart').textContent;assert(fin.includes('P4')&&fin.includes('100.0')&&fin.includes('Amplio acuerdo del grupo'),'final público con mensaje');
const ls=d.getElementById('finalLearning').textContent;assert(ls==='','la síntesis larga se reemplazó por la pestaña Cierre');
console.log('JSDOM OK');process.exit(0);
