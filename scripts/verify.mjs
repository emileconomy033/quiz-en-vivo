import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Script, runInNewContext} from 'node:vm';

const html=readFileSync('index.html','utf8');
const rules=readFileSync('firestore.rules','utf8');
const config=readFileSync('firebase-config.js','utf8');
const match=html.match(/<script>\s*([\s\S]*?)\s*<\/script>/);
assert(match,'Se requiere el JavaScript principal');
new Script(match[1],{filename:'index.html'});
new Script(config,{filename:'firebase-config.js'});
const source=match[1],start=source.indexOf('const APP='),end=source.indexOf('const $=',start);
assert(start>=0&&end>start,'No se encontró el bloque de contenido y currículo');
const curriculum=source.slice(start,end);
function loadActivity(code){
  const ctx={window:{}};
  runInNewContext(code,ctx);
  return runInNewContext(curriculum+';activateQuizVersion();globalThis.out={QUIZ,PEDAGOGY,TRANSFER}',ctx);
}
const current=loadActivity(readFileSync('ejemplos/metodo-comparado-grupo1.js','utf8'));
assert.equal(current.QUIZ.length,4,'La edición de ejemplo tiene cuatro preguntas');
assert.equal(current.PEDAGOGY.length,4);
assert.deepEqual(Array.from(current.QUIZ.map(q=>q.correct)),[0,1,2,3],'Las claves del ejemplo se distribuyen A/B/C/D');
for(let i=0;i<4;i++){
  const q=current.QUIZ[i],p=current.PEDAGOGY[i];
  assert.equal(q.a.length,4);
  assert.equal(p.mis.length,4);
  assert(q.a.every(x=>x.length>20));
  assert(Math.max(...q.a.map(x=>x.length))-Math.min(...q.a.map(x=>x.length))<=24,'Sesgo de longitud en pregunta '+(i+1));
  assert(p.mis.every((x,j)=>j===q.correct||typeof x==='string'&&x.length>15));
}
// Plantilla activa: contenido mínimo válido y con pregunta de 3 alternativas
const blank=loadActivity(readFileSync('contenido/actividad.js','utf8'));
assert(blank.QUIZ.length>=1&&blank.QUIZ.every(q=>q.a.length>=2&&q.a.length<=6),'La plantilla activa debe ser válida');
// Cualquier actividad: 7 preguntas con 6 alternativas, solo campos obligatorios
const big={marca:{},preguntas:Array.from({length:7},(_,i)=>({q:'Pregunta '+i,a:['a','b','c','d','e','f'],correct:i%6}))};
const bigLoaded=loadActivity('window.ACTIVIDAD='+JSON.stringify(big));
assert.equal(bigLoaded.QUIZ.length,7);assert.equal(bigLoaded.PEDAGOGY[0].mis.length,6);
// Contenido inválido: errores claros
for(const [bad,msg] of [[{preguntas:[]},'preguntas'],[{preguntas:[{q:'x',a:['solo una'],correct:0}]},'alternativas'],[{preguntas:[{q:'x',a:['a','b'],correct:5}]},'correct'],[{preguntas:[{q:'x',a:['a','b'],correct:0,dis:['x']}]},'dis'],[{preguntas:Array.from({length:21},()=>({q:'x',a:['a','b'],correct:0}))},'20']])
  assert.throws(()=>loadActivity('window.ACTIVIDAD='+JSON.stringify(bad)),e=>String(e.message).includes(msg),'validación: '+msg);
assert(!html.includes('123Moderador'),'No incluir contraseñas en el repositorio');
for(const id of ['moderatorEmail','moderatorPassword','presenterEntry','presenterRoomCode','presenterInviteEmail','savePresenter','removePresenter','hostNotesView','hostPublicView','projection','resetOfficial'])
 assert(html.includes('id="'+id+'"'),'Falta control '+id);
assert(source.includes('signInWithEmailAndPassword'));
assert(source.includes('function normalizeExplanation('));
assert(source.includes('Para decir')&&source.includes('function hostCard'));
assert(source.includes("hostReadingView==='public'"));
assert(source.includes("const wrongOnes=q.a.map"));
assert(source.includes("sort((a,b)=>b.count-a.count"));
assert(source.includes('if(compact)'),'La vista pública debe ser abreviada');
assert(source.includes('function subscribe()'));
assert(source.includes("observedVersion!==room.quizVersion"),'Al cambiar la versión deben recrearse los listeners');
assert(source.includes('if(typed!==\'REINICIAR\')return'),'Requerir reinicio confirmado');
assert(source.includes('room.owner!==uid')&&source.includes("!['lobby','live','done'].includes(room.status)"),'El reinicio debe estar restringido al propietario y sala abierta/finalizada');
assert(source.includes("status:'lobby',idx:-1,reveal:false,revealStage:0,openedAt:null"),'Se requiere restablecer sala sin cambiar código');
assert(rules.includes('t.size() >= 1 && t.size() <= 20'));
assert(rules.includes('request.resource.data.quizVersion in [2,3]'));
assert(rules.includes("request.resource.data.idx < resource.data.get('questionTimes',[1,2,3,4,5,6]).size()"));
assert(rules.includes('function coPresenter(id)'));
assert(rules.includes("match /access/{key}"));
assert(rules.includes("allow delete: if owner(id) && parent(id).data.status in ['lobby','done']"));
assert(rules.includes("parent(id).data.get('revealStage',0) == 0"));
assert(!rules.includes('if true;'));
assert(html.includes('id="openAudienceWindow"'),'Falta abrir ventana pública independiente');
assert(source.includes("url.searchParams.set('view','projection')"),'No se abre la vista de público por separado');
assert(source.includes("get('view')==='projection'"),'La pantalla pública no recupera su estado');
assert(source.includes('function refreshPresenterInvite()'),'Falta recuperar la invitación del segundo expositor');
assert(source.includes("if(room?.status==='live'"),'Advertencia de salida durante sesiones abiertas');
assert(source.includes('const difficult=[...meaningful]'),'El cierre público debe ser breve y descriptivo');
assert(source.includes('function normalizeExplanation(text)'),'Debe mejorar la lectura de distractores');
assert(html.includes('Aciertos: 0'),'Debe existir puntuación inicial');
// Regressions reported during live mobile rehearsals
assert(source.includes('let joiningInProgress=false;'),'Ingreso doble sin protección');
assert(source.includes("if(joiningInProgress)return;"),'Un doble toque puede lanzar dos inscripciones');
assert(source.includes("await ref.get({source:'server'})"),'Ingreso sin comprobar estado actual en servidor');
assert(source.includes("await person.get({source:'server'})"),'Inscripción anterior no contrastada con servidor');
assert(source.includes("clearVoteProblem();alertText('');subscribe()"),'Alertas de entrada previas permanecen después del ingreso');
assert(source.includes("function timingReady()"),'No se valida apertura de pregunta');
assert(source.includes("if(!timingReady())return 0"),'Temporizador no sincronizado aparenta tiempo completo');
assert(source.includes("room.idx!==i||room.reveal||stageNow()>0||!timingReady()"),'Se permite votar en estado no confirmado');
assert(source.includes("lastVoteProblem?.i===room.idx"),'El rechazo de voto no aparece junto a la pregunta de competencia');
assert(source.includes("lastVoteProblem?.i===surveyAt"),'El rechazo de voto no aparece en la encuesta libre');
assert(html.includes('id="surveyVoteError"'),'Falta alerta contextual en móvil');
assert(source.includes("e.code==='permission-denied'"),'No se diferencia plazo agotado de rechazo por permisos');
assert(source.includes("if(!timingReady()){$('clock').textContent='Preparando…'"),'Temporizador de móviles durante transición incorrecto');
assert(source.includes("if(pendingVotes.has(i)){wantedChoice.set(i,choice);return}"),"Doble toque puede duplicar envíos de voto");
assert(source.includes("onSnapshot({includeMetadataChanges:true},s=>"),'La app debe recibir la confirmación de Firestore');
assert(source.includes("if(s.metadata?.hasPendingWrites)return"),'Un voto local pendiente no debe considerarse confirmado');
assert(source.includes("pendingVotes.has(room.idx)?'Enviando respuesta"),'El celular debe indicar envío pendiente');
assert(source.includes("if(enteredCode")||source.includes('if(!enteredCode||!enteredName)'),'El formulario debe validar antes de tocar la sesión actual');
assert(source.includes("finally{joiningInProgress=false;$('join').disabled=false}"),'El botón de entrada debe restablecerse al terminar');
const fnStart=source.indexOf('function questionSeconds(i)'),fnEnd=source.indexOf('function chart(',fnStart);
assert(fnStart>=0&&fnEnd>fnStart,'No se encontraron las funciones de tiempo');
const clockFns=source.slice(fnStart,fnEnd);
const clockProbe=new Function('room','clockOffsetMs','now','const DEFAULT_SECONDS=40;const Date={now:()=>now};'+clockFns+';return {timingReady,remaining,questionSeconds};');
const stillOpening=clockProbe({idx:0,questionTimes:[20,25,30,35],openedAt:null},0,100000);
assert.equal(stillOpening.timingReady(),false);
assert.equal(stillOpening.remaining(),0,'No debe permitir votar si falta la hora de apertura');
const opened=clockProbe({idx:0,questionTimes:[20,25,30,35],openedAt:{toMillis:()=>90000}},0,100000);
assert.equal(opened.timingReady(),true);
assert.equal(opened.questionSeconds(0),20);
assert.equal(opened.remaining(),10,'El plazo debe depender de la hora de apertura confirmada');
const expired=clockProbe({idx:0,questionTimes:[20,25,30,35],openedAt:{toMillis:()=>90000}},0,110000);
assert.equal(expired.remaining(),0,'El plazo debe bloquear al caducar');
const clockCorrected=clockProbe({idx:1,questionTimes:[20,25,30,35],openedAt:{toMillis:()=>90000}},5000,100000);
assert.equal(clockCorrected.remaining(),10,'El reloj debe utilizar el desfase estimado');
// Single reusable official room and synchronized public/private reveal
assert(!html.includes('id="sessionKind"'),'No deben existir las opciones ensayo separado/oficial');
assert(!html.includes('id="newPractice"')&&!html.includes('id="newOfficial"'),'No deben proponerse salas separadas al terminar');
assert(html.includes('id="roomReadiness"'),'Indicador de preparación ausente');
assert(source.includes("const UNIQUE_ROOM_KEY='comparisonPermanentRoomId'"),'No existe la referencia persistente de sala única');
assert(source.includes("localStorage.getItem(UNIQUE_ROOM_KEY)"),'El flujo debe intentar recuperar sala existente');
assert(source.includes("localStorage.setItem(UNIQUE_ROOM_KEY,id)"),'Debe conservar el QR creado');
assert(source.includes("sessionKind:'official'"),'Las salas nuevas deben ser de tipo oficial reutilizable');
assert(source.includes("readyEl.textContent=simulationMode?"),'Indicador de sala lista no es dinámico');
assert(source.includes("loadedPeople&&loadedVotes.size===N"),'Estado de limpieza sin esperar confirmación de listeners');
assert(source.includes("room.status==='lobby'&&room.mode==='competition'&&empty&&!cleanupInProgress"),'No indicar lista con registros pendientes');
assert(source.includes("remainsPeople=await ref.collection('participants')"),'No se verifica la eliminación de participantes');
assert(source.includes("const pending=await ref.collection('answers')"),'No se verifica la eliminación de votos');
assert(source.includes("function chart(target,i,showAnswer,compact=false)"));
assert(source.includes("'RESPUESTA CORRECTA'"),'La respuesta debe proyectarse visiblemente');
assert(html.includes('answer-reveal-banner'),'Falta resalte de respuesta correcta en presentación');
assert(source.includes("if(isHost&&room.idx>=0&&room.idx!==previousIdx)"),'Panel expositor no sigue el avance');
assert(source.includes("chart('projectionTempChart',i,stage>=2,true)"),'La proyección revela la clave solo después de la decisión del moderador');
assert(source.includes("const ACTIVE_ROOM_PATH='roomDirectory/current'"),'Falta documento central de sala vigente');
assert(source.includes('async function fetchActiveRoomId()'),'La app no obtiene el código vigente');
assert(source.includes('await fetchActiveRoomId()'),'Los móviles deben consultar sala vigente');
assert(source.includes("enteredCode!==activeId"),'Los participantes pueden entrar por QR obsoleto');
assert(source.includes("setRoomLocation(activeId)"),'No redirige los enlaces anteriores');
assert(source.includes("anonDb.doc(ACTIVE_ROOM_PATH).onSnapshot("),'Participantes ya inscritos no detectan cambios de sala');
assert(source.includes("batch.set(currentRef,{roomId:id"),'Creación de sala y registro central no están en la misma transacción de escritura');
assert(source.includes("currentSnap.exists?code(currentSnap.data().roomId)"),'La cuenta no prioriza el código central');
assert(source.includes("if(!active)return;"),'El acceso a la sala exige directorio central');
assert(html.includes('Mi sala única vigente'),'La portada ofrece salas históricas');
assert(rules.includes('match /roomDirectory/{key}'),'No hay reglas para la sala central');
assert(rules.includes("getAfter(/databases/$(database)/documents/rooms/$(request.resource.data.roomId))"),'No se verifica propietario de sala activa');
assert(rules.includes('function activeRoom(id)'),'Sin comprobación de código vigente en servidor');
assert(rules.includes('allow create: if signed() && activeRoom(id) && request.auth.uid == pid'),'Puede registrarse en una sala antigua');
assert(rules.includes('allow update: if signed() && activeRoom(id) && request.auth.uid == pid'),'Puede actualizar votos de sala antigua');
assert(rules.includes('allow create: if signed() && activeRoom(id) && request.auth.uid == pid && participant(id)'),'Puede votar en sala antigua');
for(const banned of [
 'Interpretación descriptiva basada únicamente en respuestas registradas',
 'Los porcentajes no equivalen por sí solos a dominio del concepto',
 'Muestra pequeña: estos porcentajes describen',
 'Precaución: al menos una pregunta',
 'Estos resultados describen respuestas; no miden',
 'Informe descriptivo: no atribuye dominio conceptual',
 'Sigue las instrucciones del README'
])assert(!html.includes(banned),'Reapareció nota editorial: '+banned);
assert(html.includes('id="mode" type="hidden" value="competition"'),'La sala debe ser de competencia dirigida');
assert(!html.includes('<option value="survey">'),'No debe ser posible escoger encuesta libre');
assert(source.includes("mode:'competition',sessionKind:'official'"),'Nueva sala sin competencia dirigida');
assert(source.includes("existingRoom?.mode==='survey'&&existingRoom.quizVersion===3&&existingRoom.status==='lobby'"),'No se corrige la sala anterior en espera');
assert(source.includes("update({mode:'competition'})"),'No se migra la modalidad anterior');
assert(source.includes("ref.update({status:'lobby',idx:-1,reveal:false,revealStage:0,openedAt:null,publicView:'welcome',...(room.quizVersion===3?{mode:'competition'}:{})})"),'El borrado de prueba debe dejar la sala dirigida y con portada pública');
assert(source.includes("if(room.mode==='survey'&&room.quizVersion===3)"),'Un participante de sala antigua aún puede pasar preguntas sin moderador');
assert(source.includes('function renderAttendance()'),'Falta lista visible de participantes');
assert(source.includes('function refreshAttendees()'),'Falta actualización por consulta directa al servidor');
assert(!source.includes("attendancePollTimer=setInterval")&&source.includes("No se pudo sincronizar la lista de participantes"),"El sondeo periódico debe estar retirado y el error del listener debe mostrarse");
assert(source.includes("attendanceConnection=s.metadata?.fromCache?'cache':'live'"),'No distinguir cache de datos confirmados');
assert(source.includes("['live','server'].includes(attendanceConnection)"),'No anunciar sala lista con contador de caché');
assert(source.includes("attendanceRefreshInProgress=true"),'La actualización no debe multiplicar consultas concurrentes');
assert(rules.includes("request.resource.data.quizVersion == 3 && request.resource.data.mode == 'competition'"),'Reglas permiten nuevas salas de encuesta libre');
assert(rules.includes("resource.data.mode == 'survey' && request.resource.data.mode == 'competition'"),'Reglas no permiten migración controlada');
assert(rules.includes("parent(id).data.get('quizVersion',1) != 3 && parent(id).data.mode == 'survey'"),'Reglas permiten voto libre en sala oficial actual');
// Readiness lobby: per-user server confirmation and live moderator counters.
for(const id of ['waitTitle','waitingIdentity','confirmReady','waitingReadyStatus','attendanceCount','readyCount','pendingCount','readyProgress','readyProgressFill','attendanceNames']){
 assert(html.includes('id="'+id+'"'),'Falta control de espera o asistencia '+id);
}
assert(source.includes("function renderWaitingConfirmation()"),'El móvil no muestra inscripción confirmada');
assert(source.includes("myRegistration?.ready===true"),'El estado listo no depende del registro real');
assert(source.includes("collection('participants').doc(anonUid).update({ready:true,readyAt:firebase.firestore.FieldValue.serverTimestamp()})"),'No se guarda la confirmación en Firebase');
assert(source.includes("myRegistration=saved.exists?{...saved.data(),name:registeredName}:{name:registeredName,ready:false}"),'No restaura el estado listo previo');
assert(source.includes("myRegistration=mine.data()"),'No recupera la confirmación tras recargar');
assert(source.includes("myRegistration=snapshot.data()"),'No escucha la confirmación desde Firebase');
assert(source.includes("snapshot.metadata?.hasPendingWrites"),'No distingue escritura pendiente de confirmación persistida');
assert(source.includes("const registered=people.length,ready=people.filter(p=>p.ready===true).length"),'Faltan contadores dinámicos listos/pendientes');
assert(source.includes("const chip=add('span',(isReady?'✓ ':'○ ')"),'Faltan nombres separados por preparación');
assert(source.includes("const quorumReady=people.length>0&&confirmedCount===people.length"),'Se permite iniciar con participantes pendientes');
assert(source.includes("people.some(p=>p.ready!==true)"),'El controlador de inicio no verifica preparación');
// (retirado con la simulación) assert(source.includes("name:'Participante ficticio '+(i+1),country:'',ready:true"),'Simulación se bloquea por pendientes ficticios');
assert(rules.includes("request.resource.data.diff(resource.data).affectedKeys().hasOnly(['ready','readyAt'])"),'Las reglas permiten editar otros datos del participante');
assert(rules.includes("resource.data.get('ready',false) == false"),'No se comprueba la primera confirmación');
assert(rules.includes("request.resource.data.readyAt == request.time"),'No se vincula la confirmación a la hora del servidor');
assert(html.includes('id="showCreate">Acceso para expositores</button>'),'Debe haber una entrada inequívoca para ambos expositores');
assert(html.includes('<h2>Mi sala · propietario</h2>'),'El propietario debe tener su propia ruta');
assert(html.includes('<h2>Entrar a la sala existente</h2>'),'El invitado debe identificar la sala existente');
assert(html.includes('Abrir mi sala · crear solo si no existe'),'La acción del propietario debe distinguir recuperación y creación');
assert(source.includes("fetchActiveRoomId().then(id=>"),'El invitado debe recuperar automáticamente el código vigente');
assert(source.includes("activeId&&activeId!==codeValue"),'El invitado no puede acceder a una sala obsoleta');
assert(source.includes("people=[];votes=Array.from({length:N},()=>[]);subscribe()"),'El segundo expositor necesita listeners compatibles con cuatro preguntas');
assert(!html.includes('Soy moderador: crear sesión'),'No debe persistir el texto ambiguo anterior');
assert(html.includes('id="resetOfficial">Reiniciar ensayo · conservar QR'),'Debe mostrarse la acción de recuperar una sala antigua activa');
assert(source.includes("if(room.status==='live')await ref.update({status:'done',reveal:true,revealStage:3,publicView:'welcome'})"),'Solo una sala en curso se cierra antes de borrar; desde la espera no debe quedar cerrada');
assert(source.includes("if(typed!=='REINICIAR')return"),'La acción destructiva debe requerir confirmación escrita');
assert(source.includes("['lobby','live','done'].includes(room.status)"),"El propietario debe poder reiniciar también desde la sala de espera");
assert(source.includes("if(room.mode==='survey'&&room.quizVersion===3)"),'Una encuesta antigua debe bloquear las respuestas libres');
assert(source.includes("$('confirmReady').classList.add('hidden')"),'No debe mostrarse confirmar listo cuando el ensayo antiguo está en marcha');
assert(source.includes("status:'lobby',idx:-1,reveal:false,revealStage:0,openedAt:null"),'Debe conservar QR y restablecer a espera');
// A single share window follows the entire public activity, without private controls.
assert(html.includes('id="openAudienceWindow">Abrir pantalla para compartir'),'No hay acceso único para abrir ventana pública');
assert(!html.includes('id="projectionButton"'),'No deben existir dos métodos que confundan la proyección');
for(const id of ['projectHeading','projectStage','projectChart','projectIndicator'])assert(html.includes('id="'+id+'"'),'Pantalla pública incompleta: '+id);
for(const id of ['projectPrev','projectNext','projectExit'])assert(!html.includes('id="'+id+'"'),'La proyección pública no debe tener navegación de moderador: '+id);
assert(source.includes("room.status==='lobby'"),'Falta estado de espera público');
assert(source.includes("new QRCode(cachedPublicQr,{text:link(),width:330,height:330"),'QR grande no se genera en la pantalla pública');
assert(source.includes("room.status==='done'"),'No existe cierre público');
assert(source.includes("'project-answers'"),'No se muestran alternativas durante pregunta activa');
assert(source.includes("const i=Math.max(0,Math.min(N-1,room.idx)),stage=stageNow()"),'Proyección no sigue la pregunta activa');
assert(source.includes("if(stage===0)"),'No se ocultan datos antes de revelación');
assert(source.includes("chart('projectionTempChart',i,stage>=2,true)"),'No protege la clave hasta revelación');
assert(source.includes("if(wantsPublicProjection)"),'La ventana pública no tiene ruta autenticada independiente');
assert(source.includes("if(!allowed)throw Error('Esta cuenta no está autorizada a proyectar la sala.')"),'La proyección debe validar permisos');
assert(source.includes("window.open(url.toString(),'comparisonPublicScreen')"),'La nueva ventana no se reutiliza');
assert(source.includes("document.title='Pantalla pública"),'El título debe distinguir la ventana pública');
assert(html.includes('id="showPublicWelcome"'),'Falta control de portada pública');
assert(html.includes('id="showPublicQuestion"'),'Falta control de preguntas públicas');
assert(source.includes("const showWelcomeNow=publicIntroUntilWelcome||room.publicView!=='questions'||room.status==='lobby'"),'La pantalla no conserva el QR hasta orden del expositor');
assert(source.includes("setPublicView('welcome')"),'El moderador no puede mostrar portada');
assert(source.includes("setPublicView('questions')"),'El moderador no puede autorizar preguntas públicas');
assert(source.includes("await rref().update({publicView:next})"),'La vista pública no se comparte entre ventanas usando Firebase');
assert(source.includes("publicView:'welcome',revealStage:0,status:'lobby'"),'Sala nueva sin portada inicial');
assert(source.includes("publicView:'welcome',...(room.quizVersion===3?{mode:'competition'}:{})"),'Reinicio no restaura portada');
assert(source.includes("document.createTextNode(' pendientes')"),'Faltan pendientes en pantalla pública');
assert(source.includes("let cachedPublicQr=null,cachedPublicQrRoom=''"),'El QR no debe parpadear con actualizaciones');
assert(source.includes("cachedPublicQrRoom!==roomId"),'El QR no responde a cambio de sala');
assert(rules.includes("request.resource.data.get('publicView','welcome') in ['welcome','questions']"),'Reglas no restringen el estado de proyección');
assert(rules.includes("affectedKeys().hasOnly(['status','idx','reveal','revealStage','openedAt','mode','publicView','questionTimes'])"),'Reglas no admiten el estado público o permiten otros campos');
assert(source.includes("url.searchParams.set('intro','1')"),'Abrir la ventana pública debe priorizar portada desde el inicio');
assert(source.includes("if(room?.publicView==='questions')setPublicView('welcome')"),'Reabrir pantalla pública debe restaurar portada');
assert(source.includes("let publicIntroUntilWelcome=new URLSearchParams(location.search).get('intro')==='1'"),'No hay bloqueo preventivo contra revelar pregunta anterior');
assert(source.includes("if(publicIntroUntilWelcome&&room.publicView!=='questions')publicIntroUntilWelcome=false"),'El bloqueo debe liberarse incluso para salas antiguas');
assert(source.includes("const showWelcomeNow=publicIntroUntilWelcome||room.publicView!=='questions'||room.status==='lobby'"),'El QR no tiene prioridad mientras inicia la ventana pública');
assert(source.includes("const change={status:'live',idx:room.mode==='survey'?-1:0,reveal:false,publicView:'questions'"),'Iniciar competencia debe cambiar automáticamente de QR a P1');
console.log('OK: portada inicial, inscripción en vivo y transición automática a P1 al comenzar.');

// Regresiones del ensayo del 18-nov: lobby bloqueado por registros pendientes o duplicados
assert(source.includes("id=\"startAnyway\"")||html.includes("id=\"startAnyway\""),"Falta iniciar solo con los listos");
assert(source.includes("async function startCompetition(force)")&&source.includes("confirm('Iniciar sin "),"El inicio forzado debe pedir confirmación explícita");
assert(source.includes("async function removeParticipant(p)")&&source.includes("posible duplicado"),"Falta marcar y quitar duplicados");
assert(rules.includes("allow delete: if owner(id) && parent(id).data.status in ['lobby','done']"),"Regla: el propietario debe poder quitar participantes en lobby");
assert(source.includes("function withTimeout("),"Falta tiempo límite en confirmaciones");
console.log("OK: regresiones del lobby (inicio con listos, duplicados, reinicio en espera).");