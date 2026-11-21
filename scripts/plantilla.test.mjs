import {pageWith} from './lib.mjs';import {JSDOM} from 'jsdom';import assert from 'node:assert/strict';
/* La plataforma debe funcionar con CUALQUIER actividad: aquí, 7 preguntas con 5 alternativas y solo los campos obligatorios. */
const N=7,act={marca:{titulo:'Taller de prueba',tituloPagina:'Prueba · Taller',kicker:'PRUEBA',etiqueta:'Curso X',colores:{primario:'#aa3300'},paises:['Chile','Perú'],archivo:'prueba'},
 preguntas:Array.from({length:N},(_,i)=>({q:'¿Pregunta número '+(i+1)+'?',a:['uno','dos','tres','cuatro','cinco'],correct:i%5,topic:'Tema '+(i+1),why:'Porque sí '+(i+1)+'.'}))};
const html=pageWith('window.ACTIVIDAD='+JSON.stringify(act)+';');
const dom=new JSDOM(html,{runScripts:'dangerously',url:'https://example.test/?room=ABC123',pretendToBeVisual:true});
const w=dom.window,d=w.document;await new Promise(r=>setTimeout(r,300));
w.firebase={firestore:{FieldValue:{serverTimestamp:()=>'TS'}}};w.confirm=()=>true;w.alert=()=>{};
const ev=s=>w.eval(s);

// Marca
assert.equal(d.title,'Prueba · Taller');
assert.equal(d.getElementById('brandTitle').textContent,'Taller de prueba');
assert.equal(d.getElementById('brandKicker').textContent,'PRUEBA');
assert.equal(d.documentElement.style.getPropertyValue('--primario'),'#aa3300');
assert(!d.getElementById('brandLogo'),'sin logo configurado no queda imagen rota');
assert.deepEqual([...d.querySelectorAll('#country option')].map(o=>o.textContent),['Prefiero no indicar','Chile','Perú']);
assert(d.getElementById('sessionScript').textContent.includes('Vamos a responder 7 preguntas'));
assert.equal(ev('N'),N);assert.equal(ev('QUIZ.length'),N);

// Panel del moderador con 7 preguntas
ev(`isHost=true;uid='o';roomId='GEN001';room={owner:'o',status:'lobby',mode:'competition',quizVersion:3,idx:-1,reveal:false,revealStage:0,publicView:'welcome',questionTimes:[20,20,20,20,20,20,25]};
people=[];votes=Array.from({length:N},()=>[]);loadedPeople=true;loadedVotes=new Set([0,1,2,3,4,5,6]);rref=()=>({update:async c=>{globalThis.__w=c},collection:()=>({doc:()=>({delete:async()=>{}})})});section('host');render()`);
assert.equal(d.querySelectorAll('#timesPanel input').length,N,'un campo de tiempo por pregunta');
assert.deepEqual([...d.querySelectorAll('#timesPanel input')].map(i=>i.value),['20','20','20','20','20','20','25']);
d.getElementById('roomTime2').value='33';d.getElementById('saveTimes').click();await new Promise(r=>setTimeout(r,30));
assert.deepEqual([...ev('globalThis.__w.questionTimes')],[20,20,33,20,20,20,25]);
assert.equal(d.querySelectorAll('#questionTabs button').length,N+1,'7 pestañas + Cierre');

// Ficha y guion con contenido mínimo (sin teoría, sin pistas)
ev(`room.status='live';room.idx=4;room.reveal=true;room.revealStage=3;people=Array.from({length:10},(_,k)=>({uid:'p'+k,name:'P'+k,ready:true}));
votes[4]=[];for(let k=0;k<10;k++)votes[4].push({uid:'p'+k,choice:k<7?QUIZ[4].correct:(QUIZ[4].correct+1)%5});activeTab=4;render()`);
let t=d.getElementById('hostChart').textContent;
for(const s of ['Pregunta 5 · Tema 5','Para decir','Respaldo teórico','70.0 % acertó','Por qué la E es la correcta','E. cinco'])assert(t.includes(s),'ficha mínima: falta «'+s+'»');
assert(!t.includes('Qué dice la teoría'),'sin recall no hay recuadro teórico');
ev(`for(let i=0;i<N;i++){votes[i]=[];for(let k=0;k<10;k++)votes[i].push({uid:'p'+k,choice:k<(i%2?3:8)?QUIZ[i].correct:(QUIZ[i].correct+1)%5})}`);
for(let i=0;i<N;i++){const sc=ev(`speakScript(${i})`);assert(sc.paras.length>=1&&sc.seconds>0,'guion P'+(i+1))}

// Cierre genérico
ev(`room.status='done';activeTab=N;render()`);
t=d.getElementById('hostChart').textContent;
for(const s of ['Conclusión de la sesión','Para decir en el cierre','Tres ideas para llevarnos','Gracias por participar'])assert(t.includes(s),'cierre genérico: falta «'+s+'»');
assert.equal(d.querySelectorAll('#hostChart ol.takeaways li').length,3);
assert(!/Sartori|Panebianco/.test(t),'ningún texto de otra actividad');

// Participante: 5 alternativas, letras hasta E
ev(`isHost=false;uid='p1';myRegistration={name:'P',ready:true};room={owner:'z',status:'live',mode:'competition',quizVersion:3,idx:0,reveal:false,revealStage:0,publicView:'questions',questionTimes:[20,20,20,20,20,20,25],openedAt:{toMillis:()=>Date.now()}};votes=Array.from({length:N},()=>[]);localChoice.clear();wantedChoice.clear();voteRef=()=>({set:()=>Promise.resolve()});renderParticipant()`);
const btns=[...d.querySelectorAll('#compChoices button')];
assert.equal(btns.length,5);assert(btns[4].textContent.includes('E'),'quinta alternativa rotulada E');

// Sala creada para otra actividad: aviso claro al propietario
ev(`room={owner:'o',status:'lobby',mode:'competition',quizVersion:3,idx:-1,reveal:false,revealStage:0,publicView:'welcome',questionTimes:[20,20,20,20]};isHost=true;uid='o';roomId='OLD001';render()`);
assert(d.getElementById('alert').textContent.includes('otra actividad'),'aviso de sala de otra actividad');
assert.equal(ev('roomMatchesActivity(room)'),false);

// Plantilla activa: arranca sin errores
const dom2=new JSDOM(pageWith('contenido/actividad.js'),{runScripts:'dangerously',url:'https://example.test/',pretendToBeVisual:true});
await new Promise(r=>setTimeout(r,300));
assert.equal(dom2.window.document.getElementById('brandTitle').textContent,'Título de tu actividad');
assert.equal(dom2.window.eval('N'),3);
console.log('PLANTILLA OK');process.exit(0);
