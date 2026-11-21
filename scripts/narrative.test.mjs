import {pageWith} from './lib.mjs';import {JSDOM} from 'jsdom';import {readFileSync} from 'node:fs';import assert from 'node:assert/strict';
const html=pageWith('ejemplos/metodo-comparado-grupo1.js');
const rules=readFileSync(new URL('../firestore.rules',import.meta.url),'utf8');
const dom=new JSDOM(html,{runScripts:'dangerously',url:'https://example.test/?room=ABC123',pretendToBeVisual:true});
const w=dom.window,d=w.document;await new Promise(r=>setTimeout(r,300));
w.firebase={firestore:{FieldValue:{serverTimestamp:()=>'TS'}}};w.confirm=()=>true;w.alert=()=>{};
const ev=s=>w.eval(s);

// 1) Cada explicación «Desambigüemos» queda asociada a SU alternativa aunque se reordenen
ev('activateQuizVersion(3)');
const probe=ev(`QUIZ.map((q,i)=>({a:q.a,c:q.correct,dis:PEDAGOGY[i].dis,key:PEDAGOGY[i].key,recall:PEDAGOGY[i].recall,closing:PEDAGOGY[i].closing,strengthen:PEDAGOGY[i].strengthen}))`);
probe.forEach((p,i)=>{
  assert.equal(p.dis.length,4);assert.equal(p.dis[p.c],null,'la correcta no lleva desambiguación (P'+(i+1)+')');
  p.dis.forEach((t,j)=>{if(j!==p.c)assert(typeof t==='string'&&t.startsWith('Desambigüemos'),'dis P'+(i+1)+'/'+j)});
  assert(p.key&&p.recall&&p.closing&&p.strengthen,'campos teóricos P'+(i+1));
  assert(/Sartori \(1999|Sartori, 1999|\(1999, p/.test(p.recall+p.dis.join(' ')),'cita con página P'+(i+1));
});
const idx=(i,frag)=>probe[i].a.findIndex(t=>t.includes(frag));
assert(probe[0].dis[idx(0,'idénticos')].includes('idéntico'));
assert(probe[0].dis[idx(0,'mismo país')].includes('país'));
assert(probe[1].dis[idx(1,'garantiza equivalencia')].includes('perro-gato'));
assert(probe[2].dis[idx(2,'aumentar los casos')].includes('más casos'));
assert(probe[3].dis[idx(3,'doble')].includes('40/20'),'P4 razón 40/20 en su alternativa');
assert(probe[3].dis[idx(3,'ambos están medidos en minutos')].includes('unidad'));

// 2) Análisis narrativo del moderador
ev(`isHost=true;uid='o';roomId='NAR001';room={owner:'o',status:'live',mode:'competition',quizVersion:3,idx:3,reveal:true,revealStage:3,publicView:'questions',questionTimes:[40,40,40,40]};
people=[{uid:'a',name:'A',ready:true},{uid:'b',name:'B',ready:true},{uid:'c',name:'C',ready:true}];
votes=Array.from({length:N},()=>[]);votes[3]=[{uid:'a',choice:3},{uid:'b',choice:0},{uid:'c',choice:0}];
votes[1]=[{uid:'a',choice:1},{uid:'b',choice:1},{uid:'c',choice:1}];
loadedPeople=true;loadedVotes=new Set([0,1,2,3]);activeTab=3;hostReadingView='notes';rref=()=>({update:async c=>{globalThis.__w=c}});render()`);
const analysis=d.getElementById('hostChart');
const at=analysis.textContent;
for(const s of ['Pregunta 4 · ','Para decir','Respaldo teórico','Error más frecuente: A','pocas respuestas (3)','Sartori (1999, pp. 36-38)'])
  assert(at.includes(s),'ficha del expositor: falta «'+s+'»');
assert(analysis.querySelector('details.support')&&!analysis.querySelector('details.support').open,'el respaldo teórico va plegado');
const sp=analysis.querySelectorAll('.speak mark.hl').length;assert(sp>=1&&sp<=3,'resaltado sobrio en el guion: '+sp);
assert(!at.includes('Síntesis de aprendizajes')&&d.getElementById('finalLearning').textContent==='','la síntesis ya no sale durante las preguntas');

// 2b) El guion cambia según el resultado real
ev("globalThis.__mk=(i,counts)=>{votes[i]=[];counts.forEach((c,j)=>{for(let k=0;k<c;k++)votes[i].push({uid:'u'+j+'_'+k,choice:j})})}");
const C=ev('QUIZ[3].correct');const W=[0,1,2,3].filter(j=>j!==C);
const dist=(c,a,b,e)=>{const x=[0,0,0,0];x[C]=c;x[W[0]]=a;x[W[1]]=b;x[W[2]]=e;return x};
const kinds={ok:dist(9,1,0,0),most:dist(6,4,0,0),dominant:dist(3,7,0,0),split:dist(4,3,3,0),small:dist(2,1,0,0)};
const said={};
for(const [k,x] of Object.entries(kinds)){ev('__mk(3,'+JSON.stringify(x)+')');assert.equal(ev('scenarioFor(3).kind'),k,'escenario '+k);said[k]=ev("speakScript(3).paras.join(' ')");}
assert.equal(new Set(Object.values(said)).size,5,'cada escenario produce un guion distinto');
assert(said.ok.includes('Muy buen resultado')||said.ok.includes('Casi todos'),'ok');
assert(said.dominant.includes('intuición compartida')||said.dominant.includes('se inclinó'),'dominante');
const hintTop=ev('PEDAGOGY[3].hint['+W[0]+']');assert(hintTop&&said.dominant.includes(hintTop),'el guion usa la explicación de la alternativa dominante');
ev('__mk(3,[0,0,0,0])');assert.equal(ev('scenarioFor(3).kind'),'none');
for(const x of Object.values(kinds)){ev('__mk(3,'+JSON.stringify(x)+')');assert(ev('speakScript(3).seconds')<=75,'el guion cabe en tiempo de habla');}
ev("votes[3]=[{uid:'a',choice:3},{uid:'b',choice:0},{uid:'c',choice:0}]");

// 3) Cierre: solo al terminar, con guion + ideas
ev('activeTab=4;render()');
const tabBtns=[...d.querySelectorAll('#questionTabs button')];
assert.equal(tabBtns.length,5);assert.equal(tabBtns[4].disabled,false,'el cierre se habilita al revelar P4');
const cl=d.getElementById('hostChart').textContent;
for(const s of ['Conclusión de la sesión','Para decir en el cierre','Tres ideas para llevarnos','Detalle por pregunta','Sartori','Panebianco'])assert(cl.includes(s),'cierre: falta «'+s+'»');
assert.equal(d.querySelectorAll('#hostChart ol.takeaways li').length,3);
ev('room.idx=1;room.revealStage=1;render()');
assert.equal(ev('activeTab'),3,'sin P4 revelada, el cierre vuelve a la última pregunta');
assert([...d.querySelectorAll('#questionTabs button')][4].disabled,'cierre bloqueado antes de tiempo');
ev('room.idx=3;room.revealStage=3;render()');
const closeSc=ev('closingScript([{i:0,n:20,c:18},{i:1,n:20,c:6}])');assert(closeSc.paras.some(p=>p.includes('Lo más firme')),'cierre menciona lo más firme y lo más difícil');
const closeSmall=ev('closingScript([{i:0,n:3,c:0}])');assert(closeSmall.paras[0].includes('todavía es pronto'),'cierre neutro con pocas respuestas');

assert(cl.includes('verdad aplicada fuera de su rango'),'cierre incluye la reflexión sobre los errores');
ev('activeTab=1;render()');
assert(d.getElementById('hostChart').textContent.includes('equivalencia funcional'),'dato no intuitivo visible en P2');
ev('activeTab=4;render()');

// 4) Cierre en la pantalla pública
ev(`room.status='done';projecting=true;renderProjection()`);
const pub=d.getElementById('projectChart').textContent;
assert(pub.includes('Conclusión de la sesión'),'cierre público');
assert(!pub.includes('Desambigüemos')&&!pub.includes('Panebianco')&&!pub.includes('Para decir'),'la pantalla pública debe ser una versión reducida');
const stripCite=x=>x.replace(/^\d+\. /,'').replace(/ \(Sartori[^)]*\)\.?$/,'').replace(/[ .]+$/,'');
const pubIdeas=[...d.querySelectorAll('#projectChart .key-idea-row')].map(r=>stripCite(r.textContent));
const tmp=d.createElement('div');tmp.append(ev('closingNode(false)'));
const privIdeas=[...tmp.querySelectorAll('ol.takeaways li')].map(r=>stripCite(r.textContent));
assert.equal(pubIdeas.length,3);assert.deepEqual(pubIdeas,privIdeas,'las ideas de la pantalla pública coinciden con las del panel privado');
ev('projecting=false');

// 5) Cierre personal
ev(`isHost=false;uid='a';roomId='NAR001';myRegistration={name:'A',ready:true};room.status='done';render()`);
const personal=d.getElementById('ranking').textContent;
assert(personal.includes('Gracias por participar')&&!personal.includes('Sartori')&&!personal.includes('Para llevarte'),'el participante no ve teoría al cerrar');

// 6) Sonidos: osciladores creados al jugar y silencio al apagar
let osc=0;
w.AudioContext=function(){this.state='running';this.currentTime=0;this.destination={};this.resume=()=>Promise.resolve();
  this.createOscillator=()=>({type:'',frequency:{setValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){},start(){osc++},stop(){}});
  this.createGain=()=>({gain:{setValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){}})};
for(const n of ['select','ready','start','next','correct','wrong','timeup','tick','reveal','achievement','finish']){const before=osc;ev(`SFX.play('${n}')`);assert(osc>before,'sonido «'+n+'» no genera audio');}
const beforeOnce=osc;ev(`SFX.once('k1','correct');SFX.once('k1','correct')`);assert(osc>beforeOnce,'once suena una vez');const afterOnce=osc;ev(`SFX.once('k1','correct')`);assert.equal(osc,afterOnce,'once no repite');
assert(!d.getElementById('soundToggle')&&!html.includes('sound-toggle'),'no debe haber botón de sonido');

// 7) Revelación personal: cita + sonido de acierto/desacierto
ev(`room.status='live';room.idx=3;room.reveal=true;room.revealStage=3;uid='a';votes[3]=[{uid:'a',choice:0}];drawPersonalReveal()`);
const pr=d.getElementById('personalReveal').textContent;
assert(!pr.includes('Recordemos')&&!pr.includes('Desambigüemos')&&!pr.includes('Principio metodológico')&&!pr.includes('Sartori'),'el participante no ve teoría');
assert(pr.includes('Respuesta correcta'),'el participante ve su resultado');

// 7b) Selección instantánea: la opción tocada se marca antes de que Firebase confirme
ev(`room={owner:'z',status:'live',mode:'competition',quizVersion:3,idx:0,reveal:false,revealStage:0,publicView:'questions',questionTimes:[40,40,40,40],openedAt:{toMillis:()=>Date.now()}};
isHost=false;uid='p1';roomId='SEL001';votes=Array.from({length:N},()=>[]);localChoice.clear();wantedChoice.clear();
globalThis.__sets=[];voteRef=()=>({set:(v)=>new Promise(r=>setTimeout(()=>{globalThis.__sets.push(v.choice);r()},80))});renderParticipant()`);
const btn=j=>d.querySelectorAll('#compChoices button')[j];
btn(2).click();
assert(btn(2).classList.contains('selected'),'se marca al instante, sin esperar a Firebase');
btn(3).click();btn(1).click();
assert(btn(1).classList.contains('selected')&&!btn(2).classList.contains('selected'),'varios toques seguidos: gana el último');
assert.equal(d.querySelectorAll('#compChoices button:disabled').length,0,'los botones no se bloquean mientras se envía');
await new Promise(r=>setTimeout(r,400));
const sent=[...ev('globalThis.__sets')];
assert.equal(sent[sent.length-1],1,'al servidor llega la última elección: '+sent);

// 8) Tiempos: el panel muestra lo que Firestore aplica y se puede guardar
ev(`isHost=true;uid='o';roomId='TIM001';people=[];votes=Array.from({length:N},()=>[]);room={owner:'o',status:'lobby',mode:'competition',quizVersion:3,idx:-1,reveal:false,revealStage:0,publicView:'welcome',questionTimes:[25,30,45,60]};loadedPeople=true;loadedVotes=new Set([0,1,2,3]);globalThis.__w=null;rref=()=>({update:async c=>{globalThis.__w=c},collection:()=>({doc:()=>({delete:async()=>{}})})});render()`);
assert.deepEqual([0,1,2,3].map(k=>d.getElementById('roomTime'+k).value),['25','30','45','60'],'el panel debe mostrar los tiempos guardados en la sala');
assert.equal(d.getElementById('saveTimes').disabled,false);
assert.deepEqual([0,1,2,3].map(k=>ev(`questionSeconds(${k})`)),[25,30,45,60],'questionSeconds debe leer los tiempos de la sala');
d.getElementById('roomTime0').value='15';d.getElementById('roomTime0').dispatchEvent(new w.Event('input'));d.getElementById('roomTime3').value='90';
d.getElementById('saveTimes').click();await new Promise(r=>setTimeout(r,30));
assert.deepEqual([...ev('globalThis.__w.questionTimes')],[15,30,45,90],'se guardan los segundos editados');
ev(`globalThis.__w=null`);d.getElementById('roomTime1').value='5';d.getElementById('saveTimes').click();await new Promise(r=>setTimeout(r,30));
assert.equal(ev('globalThis.__w'),null,'no guarda tiempos fuera de 10-180');
ev(`room.status='live';render()`);assert.equal(d.getElementById('saveTimes').disabled,true,'no editable con la sala en curso');
assert(d.getElementById('timesNote').textContent.includes('P1 25 s'),'muestra tiempos vigentes');

// 9) Reglas: solo el propietario cambia questionTimes y solo en lobby
assert(rules.includes("'mode','publicView','questionTimes'"));
assert(rules.includes("hasAny(['questionTimes'])"));
assert(rules.includes("owner(id) && resource.data.status == 'lobby' && request.resource.data.status == 'lobby'"));
console.log('NARRATIVE OK');process.exit(0);
