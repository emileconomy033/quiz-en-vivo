import {pageWith} from './lib.mjs';import {JSDOM} from 'jsdom';import {readFileSync} from 'node:fs';import assert from 'node:assert/strict';
const rules=readFileSync(new URL('../firestore.rules',import.meta.url),'utf8');
const dom=new JSDOM(pageWith('contenido/actividad.js'),{runScripts:'dangerously',url:'https://example.test/?room=ABC123',pretendToBeVisual:true});
const w=dom.window,d=w.document;await new Promise(r=>setTimeout(r,300));
w.firebase={firestore:{FieldValue:{serverTimestamp:()=>'TS'}}};w.confirm=()=>true;w.alert=()=>{};
const ev=s=>w.eval(s);
const type=(el,v)=>{el.value=v;el.dispatchEvent(new w.Event('input',{bubbles:true}))};
const tick=ms=>new Promise(r=>setTimeout(r,ms));
const hostLobby=(extra='')=>ev(`isHost=true;uid='o';roomId='EDT001';room={owner:'o',status:'lobby',mode:'competition',quizVersion:3,idx:-1,reveal:false,revealStage:0,publicView:'welcome',questionTimes:[40,40,40]${extra}};
people=[];votes=Array.from({length:N},()=>[]);loadedPeople=true;loadedVotes=new Set(QUIZ.map((_,i)=>i));globalThis.__upd=[];rref=()=>({update:async c=>{globalThis.__upd.push(c)},collection:()=>({doc:()=>({delete:async()=>{}})})});section('host');render()`);

hostLobby();
let panel=d.getElementById('editorPanel');
assert(!panel.classList.contains('hidden'),'el editor aparece para el propietario');
assert.equal(panel.querySelectorAll('details.ed-q').length,3,'una ficha por pregunta');
assert.equal(d.getElementById('editorSave').disabled,true,'guardar deshabilitado sin cambios');

// Agregar una pregunta nueva y llenarla
const addQ=[...panel.querySelectorAll('button')].find(b=>b.textContent==='+ Agregar pregunta');addQ.click();
let qs=panel.querySelectorAll('details.ed-q');assert.equal(qs.length,4);
const last=()=>panel.querySelectorAll('details.ed-q')[3];
type(last().querySelectorAll('textarea')[0],'¿Cuál es la capital de Francia?');
let alts=()=>last().querySelectorAll('.ed-alt');
type(alts()[0].querySelector('input[type=text]'),'Lyon');type(alts()[1].querySelector('input[type=text]'),'París');
[...last().querySelectorAll('button')].find(b=>b.textContent==='+ Agregar alternativa').click();
type(alts()[2].querySelector('input[type=text]'),'Marsella');
assert.equal(alts().length,3);
alts()[1].querySelector('input[type=radio]').dispatchEvent(new w.Event('change'));
assert(alts()[1].querySelector('input[type=radio]').checked,'París marcada como correcta');
// Recuadros según lo que responda el grupo
const labels=[...last().querySelectorAll('.ed-guide label')].map(l=>l.textContent);
assert(labels.some(t=>t.includes('Si la mayoría acierta (la B)')),'recuadro para cuando acierta: '+labels.join('|'));
assert(labels.some(t=>t.includes('Si la mayoría elige la A')&&t.includes('Lyon')),'recuadro para la alternativa A');
assert(labels.some(t=>t.includes('Si la mayoría elige la C')&&t.includes('Marsella')),'recuadro para la alternativa C');
assert(!labels.some(t=>t.includes('Si la mayoría elige la B')),'la correcta no tiene recuadro de error');
const area=txt=>[...last().querySelectorAll('.ed-guide label')].find(l=>l.textContent.includes(txt)).querySelector('textarea');
type(area('Si la mayoría acierta'),'Confirmemos y subamos de nivel.');
type(area('Si la mayoría elige la A'),'Lyon es grande, pero no es la capital.');
type(area('Si la mayoría elige la C'),'Marsella es un puerto importante.');
type(area('Si las respuestas quedan repartidas'),'Pidamos a dos personas que defiendan su respuesta.');
type(last().querySelectorAll('textarea')[1],'París es la capital.');

// Validación: alternativa vacía
[...last().querySelectorAll('button')].find(b=>b.textContent==='+ Agregar alternativa').click();
assert(d.getElementById('editorSave').disabled===false,'hay cambios por guardar');
d.getElementById('editorSave').click();await tick(30);
assert(d.getElementById('editorNote').textContent.includes('No se pudo guardar'),'error visible: '+d.getElementById('editorNote').textContent);
assert.equal(ev('globalThis.__upd.length'),0,'no se guarda con una alternativa vacía');
// quitar la alternativa vacía y guardar
const del=[...alts()].pop().querySelector('button');del.click();
assert.equal(alts().length,3);
d.getElementById('editorSave').click();await tick(30);
const upd=ev('globalThis.__upd');assert.equal(upd.length,1,'se guarda una vez');
assert.equal(upd[0].questionTimes.length,4,'los tiempos siguen el número de preguntas');
const saved=JSON.parse(upd[0].activity);
assert.equal(saved.preguntas.length,4);
assert.equal(saved.preguntas[3].q,'¿Cuál es la capital de Francia?');assert.equal(saved.preguntas[3].correct,1);
assert.deepEqual(saved.preguntas[3].hint,['Lyon es grande, pero no es la capital.',null,'Marsella es un puerto importante.']);
assert.equal(saved.preguntas[3].ifCorrect,'Confirmemos y subamos de nivel.');
assert.equal(saved.preguntas[3].ifSplit,'Pidamos a dos personas que defiendan su respuesta.');

// La sala trae la actividad: todos los clientes la aplican
hostLobby();
ev(`globalThis.__str=${JSON.stringify(upd[0].activity)};room.activity=__str;room.questionTimes=[40,40,40,40];applyRoomActivity(room)`);
assert.equal(ev('N'),4);assert.equal(ev('QUIZ[3].a[1]'),'París');
assert.equal(ev('applyRoomActivity(room)'),false,'sin cambios no vuelve a aplicar');

// Participante: ve la pregunta nueva con tres alternativas
ev(`isHost=false;uid='p1';myRegistration={name:'P',ready:true};room={owner:'z',status:'live',mode:'competition',quizVersion:3,idx:3,reveal:false,revealStage:0,publicView:'questions',questionTimes:[40,40,40,40],activity:__str,openedAt:{toMillis:()=>Date.now()}};votes=Array.from({length:N},()=>[]);localChoice.clear();wantedChoice.clear();voteRef=()=>({set:()=>Promise.resolve()});renderParticipant()`);
assert.equal(d.querySelectorAll('#compChoices button').length,3);
assert(d.getElementById('compQuestion')?.textContent.includes('capital de Francia')||d.body.textContent.includes('capital de Francia'),'el celular muestra la pregunta nueva');

// Guion: lo escrito en los recuadros aparece según el resultado
ev(`isHost=true;uid='o';votes[3]=[];for(let k=0;k<10;k++)votes[3].push({uid:'u'+k,choice:k<9?1:0})`);
assert(ev(`speakScript(3).paras.join(' ')`).includes('Confirmemos y subamos de nivel.'),'si la mayoría acierta, usa el recuadro');
ev(`votes[3]=[];for(let k=0;k<10;k++)votes[3].push({uid:'u'+k,choice:k<6?2:1})`);
assert(ev(`speakScript(3).paras.join(' ')`).includes('Marsella es un puerto importante.'),'si la mayoría elige la C, usa su recuadro');
ev(`votes[3]=[];for(let k=0;k<10;k++)votes[3].push({uid:'u'+k,choice:k<4?1:k<7?0:2})`);
assert(ev(`speakScript(3).paras.join(' ')`).includes('Pidamos a dos personas que defiendan su respuesta.'),'si se reparten, usa su recuadro');

// Otro cliente (no propietario): el editor queda oculto
ev(`isHost=true;uid='otro';room={owner:'o',status:'lobby',mode:'competition',quizVersion:3,idx:-1,reveal:false,revealStage:0,publicView:'welcome',questionTimes:[40,40,40,40],activity:__str};render()`);
assert(d.getElementById('editorPanel').classList.contains('hidden'),'solo el propietario ve el editor');
// Sala en curso: editor bloqueado
hostLobby(',activity:__str');ev(`room.status='live';room.idx=0;room.questionTimes=[40,40,40,40];render()`);
assert.equal(d.getElementById('editorSave').disabled,true);
assert([...d.querySelectorAll('#editorPanel input,#editorPanel textarea')].every(x=>x.disabled),'con la sala en curso no se edita');

// Volver a la actividad del archivo
ev(`room.status='lobby';room.idx=-1;room.activity=__str;globalThis.__upd=[];render()`);
ev('draft=null;renderEditor()');
const back=[...d.querySelectorAll('#editorPanel button')].find(b=>b.textContent.includes('Volver a la actividad del archivo'));
back.click();await tick(30);
const u2=ev('globalThis.__upd');assert.equal(u2[0].activity,'');assert.equal(u2[0].questionTimes.length,3);
ev(`room.activity='';applyRoomActivity(room)`);assert.equal(ev('N'),3);

// Reglas
assert(rules.includes("'openedAt','createdAt','activity'"));
assert(rules.includes("affectedKeys().hasOnly(['status','idx','reveal','revealStage','openedAt','mode','publicView','questionTimes','activity'])"));
assert(rules.includes("hasAny(['activity'])")&&rules.includes('request.resource.data.activity.size() <= 200000'));
console.log('EDITOR OK');process.exit(0);
