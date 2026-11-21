# Contexto técnico — Quiz en vivo

Plataforma reutilizable de preguntas en vivo. Nació como la actividad «¿Realmente sabemos comparar?» (ICAP, Taller de Métodos y Técnicas de Investigación I, Grupo 1, noviembre 2026). Esa edición está conservada en `ejemplos/metodo-comparado-grupo1.js` y en el repositorio `emileconomy033/metodo-comparado-quiz` (etiqueta `edicion-metodo-comparado-grupo1`). El historial técnico completo está en `docs/`.

## Arquitectura

- **`index.html`** (un solo archivo, funciones largas en una línea): motor completo. No contiene texto de ninguna actividad.
- **`contenido/actividad.js`** define `window.ACTIVIDAD` (`marca`, `cierre`, `preguntas`, `transferencia`). El motor la lee y la valida con `validarActividad`. Guía de campos: `GUIA_ACTIVIDAD.md`.
- **`firebase-config.js`** define `window.FIREBASE_CONFIG` (pública) y `window.APP_CONFIG` (`moderadorEmail`, `segundoExpositorEmail`, `segundosPorPregunta`).
- **`firestore.rules`**: reglas. Se **publican a mano** en la consola de Firebase (Firestore → Reglas → Publicar); no hay despliegue automático.
- **`scripts/`**: `npm test` = `verify.mjs` (aserciones estáticas y de contenido) + `lobby.test.mjs` y `narrative.test.mjs` (JSDOM con la edición de ejemplo) + `plantilla.test.mjs` (JSDOM con una actividad distinta: 7 preguntas, 5 alternativas, solo campos obligatorios). `lib.mjs` incrusta el contenido en el HTML para las pruebas.
- Variables CSS de marca: `--primario`, `--primario-oscuro`, `--acento`, `--acento-oscuro`, `--tinta`.

## Modelo de datos (Firestore)

- `roomDirectory/current` → `{roomId, updatedAt}`: una **sala permanente** única; los participantes la consultan para entrar.
- `rooms/{id}` → `owner, mode ('competition'), sessionKind, questionTimes[], quizVersion (3 = versión del motor, no del contenido), publicView, revealStage, status ('lobby'|'live'|'done'), idx, reveal, openedAt`.
- `rooms/{id}/participants/{uid}`, `rooms/{id}/answers/{qid}/votes/{uid}`, `rooms/{id}/access/presenter` (correo del segundo expositor).
- `questionTimes.length` define cuántas preguntas tiene la sala (1 a 20). El panel avisa y crea sala nueva si no coincide con la actividad cargada.
- Etapas de revelado: `revealStage` 0 abierta, 1 distribución, 2 respuesta, 3 explicación. El plazo de voto lo valida la regla con `request.time <= openedAt + questionTimes[qid]`.

## Firebase (proyecto actual: `encuesta-5cd5f`)

1. Proyecto Firebase con **Authentication** habilitando *Anónimo* (participantes) y *Correo/contraseña* (propietario, con el usuario ya creado).
2. **Firestore** en modo producción y publicar `firestore.rules`.
3. **Authentication → Configuración → Dominios autorizados:** incluir el dominio de GitHub Pages (`emileconomy033.github.io`; es el mismo dominio para todos los repositorios de la cuenta).
4. El correo del propietario debe coincidir en tres lugares: usuario de Authentication, `APP_CONFIG.moderadorEmail` y la función `moderator()` de `firestore.rules`.
5. Publicación web: GitHub Pages desde la rama `main`, carpeta raíz.

## Dos expositores

El propietario (correo/contraseña) controla todo. El segundo expositor entra con su correo (registrado en `access/presenter`) y puede avanzar la sesión y cambiar la vista pública, no crear ni reiniciar la sala.

## Decisiones y trampas aprendidas

- **Reiniciar desde la sala de espera no debe cerrar la sala** (`status:'done'` dejaba la sala sin QR). Solo se cierra si estaba `live`.
- Las reglas de Firestore no admiten bucles: `validTimes` repite la comprobación para los índices 0 a 19.
- El voto es optimista (`localChoice`/`wantedChoice`, gana el último toque) y el servidor decide con el último valor aceptado.
- Los participantes **no ven teoría**; la pantalla pública solo muestra una versión reducida del cierre; el guion completo está en el panel privado.
- `verify.mjs` toma el fragmento del motor entre `const APP=` y `const $=` y lo ejecuta en un contexto vacío: el código nuevo que use globales del navegador debe ir **después** de `const $=`.
- Los sonidos se sintetizan con WebAudio (sin archivos). No hay botón de sonido: se baja el volumen del dispositivo.
- Cambiar el número de preguntas de la actividad exige sala nueva (cambia el QR).

## Cómo trabajar

- Contenido nuevo: solo `contenido/actividad.js` (ver guía). No tocar `index.html`.
- Antes de publicar: `npm test`.
- Si se modifican reglas: `firestore.rules` + publicar en la consola + dejar constancia en el commit.
