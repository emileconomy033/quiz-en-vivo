# ¿Realmente sabemos comparar? — Método comparado, Grupo 1

Cuestionario interactivo de cuatro preguntas para las nuevas salas del Taller de Métodos y Técnicas de Investigación I (ICAP). Las salas históricas de seis preguntas conservan su estructura original.

## Qué ofrece
- Entrada por QR o enlace público; los participantes indican nombre o seudónimo y país opcional.
- Dos modalidades: encuesta libre y competencia guiada (40 segundos por pregunta).
- Salas independientes de **ensayo** y **clase oficial**.
- Panel del moderador con votos en tiempo real, porcentajes por alternativa, aciertos, desglose por pregunta y exportación CSV.
- Una respuesta por pregunta y sesión de autenticación anónima. Esto **no impide** que alguien participe de nuevo desde otro navegador/dispositivo.

## Puesta en marcha
1. Firebase: proyecto `encuesta-5cd5f`. Habilitar Authentication → Anonymous y Firestore.
2. Publicar el contenido de `firestore.rules` en Firestore → Rules. Las reglas son específicas para **seis** preguntas y las salas `practice/official`.
3. GitHub: Settings → Pages → Build and deployment → **Deploy from a branch**, rama `main`, carpeta `/(root)`, Save.
4. Abrir la URL de GitHub Pages cuando GitHub indique que la página está publicada.
5. Crear una **sesión de ensayo**, copiar el enlace o QR, ingresar desde otro navegador (o móvil) y comprobar que el panel recibe respuestas; cerrar y exportar CSV.
6. Crear otra sala `official` para la clase definitiva. No reutilizar el QR del ensayo.

**Importante:** la aplicación no ha superado todavía una prueba de extremo a extremo con dispositivos reales ni la validación de reglas en un emulador Firestore. La propiedad de la sala está ligada al identificador anónimo de Firebase del navegador que la creó; no borres los datos de ese navegador durante la actividad.

## Archivos
- `index.html`: interfaz y cuestionario de seis preguntas.
- `firebase-config.js`: configuración pública del cliente Firebase (no contiene secretos administrativos).
- `firestore.rules`: permisos de salas, participantes y votos.

## Seguridad y privacidad
Los nombres y países declarados son datos introducidos voluntariamente. Evita solicitar información sensible y utiliza nombres de prueba durante los ensayos. El panel no dispone de autenticación administrativa permanente: el moderador es la sesión anónima que creó cada sala. No publiques reglas Firestore permisivas del tipo `allow read, write: if true`.

## Panel docente y uso de resultados (versión 4)
- El moderador puede entrar en **Modo proyección**, navegar por las seis preguntas y mostrar una síntesis final.
- Durante la votación, la proyección oculta la clave y el análisis de errores. En encuesta libre se revelan al cerrar; en competencia, después de revelar cada pregunta.
- Cada distractor elegido se explica conceptualmente, no solo en relación con el ejemplo. La síntesis final utiliza las tasas de acierto y la distribución de respuestas reales. **No infiere automáticamente dominio individual**.
- Participantes: pantalla de finalización individual, posibilidad de revisar las respuestas registradas y retorno al resultado personal después del cierre. El panel grupal se visualiza en la pantalla del moderador.
- Recuperación: volver al enlace de la misma sala con el **mismo navegador, perfil y almacenamiento de Firebase** permite recuperar el rol propio. No existe recuperación segura desde otro dispositivo con autenticación anónima; no borres cookies ni datos del sitio durante la actividad.

## Actualización de reglas obligatoria
La versión 4 **requiere publicar nuevamente** el archivo `firestore.rules` en Firebase Console → Firestore Database → Rules. Esta versión restringe la lista de inscritos y la lectura de votos individuales: solo el moderador ve todas las identidades y respuestas; cada participante ve su propio registro y votos. **Subir el archivo a GitHub no despliega automáticamente las reglas a Firebase**.

## Validación
Se comprobaron estáticamente los seis ítems y la sintaxis del JavaScript. No se han ejecutado pruebas automáticas de integración contra Firestore real; se debe crear una sala de ensayo, ingresar desde otro dispositivo, completar la votación, recuperar la sesión y comprobar el CSV y la proyección. El plan gratuito de Firebase tiene cuotas; evita organizar múltiples sesiones simultáneas de gran volumen sin comprobarlas.

## Configuración del moderador y tiempos (versión 5)
- Cada pregunta de la modalidad **Competencia** admite un tiempo propio de **10 a 180 segundos** (valor predeterminado 40). El moderador lo configura antes de crear la sala. Los temporizadores se aplican también en las reglas de Firestore. Las salas antiguas, sin el campo `questionTimes`, mantienen 40 segundos.
- **Acceso del moderador**: se usa **Firebase Authentication → Email/Password** mediante una aplicación Firebase secundaria. El participante sigue utilizando la autenticación anónima normal, sin contraseña ni correo.
- **Configuración obligatoria, una sola vez**: en Firebase Console → Authentication → Sign-in method, activar **Email/Password** (sin habilitar Email link); en la pestaña **Users**, pulsar **Add user**, introducir el correo de moderador configurado en el código (`emil.economia@gmail.com`) y elegir una contraseña. La pantalla de moderador solicita solo esa contraseña, no el correo. Si se prefiere otra dirección de cuenta, actualizar `MODERATOR_EMAIL` en `index.html` y la condición de email en `firestore.rules` de forma idéntica.
- Usa una contraseña única y robusta para la cuenta del propietario y activa la verificación en dos pasos del correo. **Nunca escribir la contraseña en el código ni en la documentación del repositorio.**
- **Es imprescindible publicar nuevamente `firestore.rules`** desde Firebase Console. A partir de estas reglas, solo la cuenta autenticada por correo/contraseña permitida puede **crear salas nuevas**. Las salas preexistentes de moderadores anónimos conservan el permiso de administración para el mismo UID original.
- El moderador recupera su rol en el mismo navegador siempre que mantenga iniciada su sesión Firebase; se mantiene el acceso a salas antiguas creadas con la identidad anónima previa. Si cambia de navegador, deberá entrar como moderador con la contraseña y conservar el enlace de la sala.
- **No compartir la contraseña con participantes.** El QR solo abre la pantalla pública para ingresar al cuestionario.

## Ajuste de respuestas y diagnóstico de inscripción (noviembre 2026)
- Mientras la encuesta permanezca abierta, cada participante puede cambiar su selección tantas veces como necesite. En competencia, los cambios están permitidos **solo en la pregunta vigente y mientras quede tiempo**; el último voto confirmado por Firestore reemplaza al anterior. No hay tres intentos: no se penaliza tocar una opción por accidente.
- Si falla el ingreso, el aviso indica la etapa (consulta de sala, consulta del registro o inscripción), para identificar el permiso involucrado sin abrir indiscriminadamente Firestore.
- **Publicar las reglas actualizadas en Firebase Console es obligatorio** para permitir la actualización de votos. El archivo en GitHub es solo la versión de referencia.
- Se retiró el aviso informativo largo del pie de página a solicitud del moderador. Los controles de privacidad (reglas de Firebase, ausencia de listados individuales para participantes) siguen activos.

## Identidad visual y retroalimentación por pregunta
- Encabezado académico con logo del ICAP, adaptable a móvil. La imagen se carga desde una URL externa de recursos de identidad institucional; si esa fuente dejara de funcionar, debe sustituirse por un archivo local.
- En competencia, al pulsar **Revelar respuesta**, cada participante recibe retroalimentación individual: **acierto** con confeti verde y destello breve; **respuesta incorrecta** con un mensaje ámbar discreto y explicación conceptual; **sin respuesta** con mensaje neutral. Siempre se presenta la opción correcta.
- El contador **Aciertos: X/6** muestra solo las preguntas que ya se hayan revelado. Antes del cierre de encuesta libre no se muestra puntuación.
- La celebración respeta `prefers-reduced-motion` y no se repite por cada actualización de Firestore durante la misma sesión/pregunta.
- La proyección del moderador mantiene los resultados agregados y las explicaciones, sin efectos personales.
- No se modifican preguntas, claves ni reglas de Firestore en esta actualización.

## Versión 6 — secuencia de revelación y auditoría de sesgos

**Solo las salas nuevas** usan `quizVersion: 2`. Las salas históricas sin este campo siguen utilizando exactamente la clave y el orden previos para no reinterpretar votos almacenados.

### Auditoría de opciones
- Antes, las claves estaban en **B,C,B,B,C,D**: ninguna respuesta A; y la correcta destacaba por longitud en cinco de seis preguntas.
- Ahora las claves de nuevas sesiones están distribuidas **A,C,D,B,A,D** (A=2, B=1, C=1, D=2), manteniendo una única opción defendible por pregunta.
- Se abreviaron y equilibraron las alternativas. Los tests verifican seis preguntas, cuatro opciones y diferencias de longitud no mayores de 24 caracteres dentro de una misma pregunta.
- Es una auditoría **editorial y estructural**, no una validación psicométrica. Las preguntas deben seguir revisándose presencialmente para detectar pistas semánticas, negaciones extremas y ambigüedades.

### Tres etapas del moderador en modo competencia
1. **Mostrar distribución**: se cierran los votos y se presentan cantidades y porcentajes sin revelar qué respuesta es correcta.
2. **Revelar respuesta**: clave, celebración individual y contador de aciertos.
3. **Explicar el concepto**: explicación pedagógica antes de permitir avanzar.

El gráfico no muestra la proporción de aciertos antes de revelar la solución. Las reglas de Firestore bloquean modificaciones desde la primera etapa.

### Práctica, informes y recuperación
- **Ensayar con datos ficticios** desde «Nueva sesión», sin crear sala ni guardar respuestas en Firebase. No puede exportarse CSV de simulación. La pantalla marca expresamente el ensayo.
- **Informe PDF** abre un documento en una pestaña aparte; usar «Imprimir → Guardar como PDF». Incluye resultados de cada pregunta, distribución y lecciones; no genera un PDF en servidor.
- Firestore es el registro persistente de votos reales; el moderador también puede exportar CSV. No se implementa copia automática de datos identificativos en el dispositivo.
- El temporizador estima la diferencia horaria mediante una respuesta HTTP del sitio; **la validación decisiva del plazo es la regla de Firestore con `request.time`**. Si el sitio no ofrece fecha de respuesta, se usa el reloj local como aproximación.

### Despliegue obligatorio
**Volver a publicar el archivo `firestore.rules` en Firebase Console.** Las nuevas salas tienen los campos `quizVersion` y `revealStage`. El repositorio y GitHub Pages no aplican automáticamente los cambios en permisos.

### Prueba pendiente
Realizar un ensayo completo con computadora y al menos dos celulares (preferiblemente varias conexiones), incluir votos corregidos, límite de tiempo, los tres momentos, salida y recuperación del moderador, proyección e informe PDF. Las comprobaciones sintácticas no sustituyen una prueba integral con Firebase real.

### Minicomprobación de transferencia
En nuevas salas de competencia, después de **Explicar el concepto**, cada participante recibe una pregunta opcional sobre otro caso con tres opciones y retroalimentación. Las seis minicomprobaciones se resuelven **solo en el navegador**; no forman parte de la puntuación `X/6` ni alteran las preguntas de la clase.

### Informe visual
El informe imprimible incluye barras horizontales por opción, porcentajes y una breve interpretación de cada pregunta. El usuario puede elegir «Guardar como PDF» en el cuadro de impresión del navegador. No se envían los datos a un servicio externo de PDF.

## Corrección de navegación (18 noviembre 2026)
- En competencia versión 2, el botón **Siguiente pregunta** se habilita en cuanto el moderador termina la segunda etapa (**Revelar respuesta**). **Ampliar explicación** es ahora una etapa opcional, no un requisito para avanzar.
- En la última pregunta, se indica que debe elegirse **Cerrar y mostrar resultados**; el botón «Siguiente pregunta» deja de mostrarse para evitar confusiones.
- En el panel del moderador están disponibles **Volver al inicio** y **Crear otra dinámica**, incluso al completar una actividad.
- Después del cierre se presenta una sección de acciones rápidas: **Nuevo ensayo**, **Nueva sesión oficial** y **Volver al inicio**.
- Volver al inicio cancela las suscripciones en tiempo real de la pantalla, limpia el código de sala de la URL y deja intactos los votos persistidos en Firebase. Si la sesión aún está abierta, solicita confirmación porque salir del panel **no cierra la sala**.
- Se conserva la posibilidad de volver a abrir una sesión anterior desde la lista local del navegador, siempre que la identidad de Firebase siga siendo válida.
- Esta corrección no modifica las reglas de Firestore ni el contenido de las preguntas.

## Versión 7 — cuatro preguntas, dos expositores y una sala oficial reutilizable

### Cuestionario vigente
- Las salas **nuevas** usan `quizVersion: 3` y solo contienen las preguntas **1–4**. Las preguntas 5 y 6 se excluyeron del cuestionario vigente. Se mantienen en el código únicamente para interpretar **salas históricas** de versiones 1 y 2.
- La clave del cuestionario vigente se distribuye **A, B, C, D**, sin repetición de posición. Las alternativas también se revisaron por longitud; esta inspección no sustituye una validación pedagógica real.
- En competencia, solo se configuran cuatro tiempos; el marcador individual será `Aciertos: X/4`.

### Dos vistas de resultados
- **Guion privado del expositor**: alternativas incorrectas ordenadas de la más votada a la menos votada, con recuentos, porcentaje, explicación breve por error, respuesta correcta justificada y una orientación para trasladar el concepto.
- **Previsualizar vista del público**: reduce el texto a gráficos, porcentaje de aciertos, respuesta correcta y conclusión metodológica. La pantalla pública no debe mostrar nombres individuales.
- **Abrir pantalla pública aparte** abre otra pestaña/ventana en modo proyección; el expositor puede mantener su guion privado en la ventana original y colocar la vista pública en una segunda pantalla. La ventana pública sigue la pregunta activa del moderador.
- Si todos contestan correctamente, el guion se centra en el principio que justifica la respuesta y su aplicación a otro ejemplo.

### Segundo expositor con Firebase Authentication
1. En **Firebase → Authentication → Users**, el administrador crea la cuenta del segundo expositor con su **propio correo y contraseña**; conserva activo Email/Password.
2. El **propietario** abre la sala y escribe ese correo en «Segundo expositor autorizado → Autorizar expositor». La invitación se guarda bajo `rooms/{codigo}/access/presenter`.
3. Comparte el **código de sala** con el colega (no la contraseña). El colega entra a «Soy moderador: crear sesión», usa su propio correo y contraseña y elige «Abrir panel de exposición».
4. Ambos pueden ver el panel, navegar y revelar la exposición. **Solo el propietario puede borrar registros o gestionar la invitación**. El propietario puede revocar el acceso.
5. El sistema no envía correos de invitación automáticamente. Si tu colega aún no tiene cuenta creada, no podrá autenticarse. Eviten manipular simultáneamente el mismo control de avance.

### Única sala oficial para pruebas y clase definitiva
1. Crear **Clase oficial (reutilizable)**, ahora predeterminada. Compartir el QR solo con participantes de prueba.
2. Ejecutar la actividad real de prueba, y después **Cerrar y mostrar resultados**.
3. En el panel final, el **propietario** selecciona «Borrar datos de prueba y reutilizar esta sala oficial».
4. Confirmar escribiendo `BORRAR` y aceptando la confirmación. Se eliminan **todos los participantes y votos de esa sala**, de forma irreversible; se conserva su identificador, QR, contenido, tiempos e invitación del segundo expositor.
5. La sala vuelve a **En espera** y el mismo QR sirve para la clase definitiva. Los participantes deben registrarse nuevamente.
6. **Ojo:** esta limpieza no borra otras salas históricas ni elimina datos ya descargados por CSV o PDF. Si necesitas conservar resultados, expórtalos **antes** del borrado. No borres durante la votación; la limpieza solo está disponible cuando la sala está finalizada.

### Configuración indispensable
Subir `firestore.rules` a GitHub **no publica esas reglas** en Firebase. Antes de probar esta versión, copiar el archivo completo en **Firebase Console → Firestore Database → Rules → Publish**. Las nuevas reglas admiten salas de cuatro preguntas, invitación autenticada al segundo expositor y eliminación de votos/participantes cerrados solo por el propietario.

### Estado de pruebas
La sintaxis del JavaScript y las pruebas estáticas del repositorio comprueban versiones del currículo, claves, estructura del panel y restricciones previstas. **No se ha validado el borrado, la invitación ni la seguridad con un emulador de Firestore o varios dispositivos reales.** Hacer una prueba final con ambos expositores y al menos dos celulares antes de usarlo en clase.

### Correo del segundo expositor preconfigurado
En nuevas salas **oficiales**, la aplicación intenta autorizar automáticamente `gramirezfunes@gmail.com` como segundo expositor. No se publica ni se crea ninguna contraseña: la cuenta debe crearse por separado en Firebase Authentication → Users con Email/Password. Si la invitación falla, el creador verá una advertencia y podrá reintentar con «Autorizar expositor». Las salas ya existentes no reciben esta autorización automáticamente; el propietario debe agregar ese correo desde su panel.

## Refuerzo definitivo — sala vigente centralizada y QR único

El registro compartido **`roomDirectory/current`** de Firebase determina qué sala es válida para todos los participantes. No depende de los datos locales de cada teléfono.

- El propietario abre **Crear o recuperar sala única**. La aplicación busca primero el código central en Firebase, luego el código único del navegador. Solo crea una sala nueva si no encuentra una sala válida. El documento central se crea en la misma escritura por lotes que una sala nueva.
- El QR de esa sala conserva su **código de sala**, incluso después de eliminar los votos de ensayo. El parámetro de versión del enlace puede cambiar para ayudar a evitar copias antiguas del HTML, sin cambiar el identificador de sala.
- Si un asistente abre un enlace con código histórico, la aplicación consulta `roomDirectory/current`, actualiza el enlace a la sala válida y muestra un aviso. Antes de registrar un participante, siempre se comprueba el identificador central en el servidor.
- Durante una participación activa, la aplicación observa el código central y retira de una sala antigua al dispositivo si cambia la sala vigente.
- **Protección real desde el servidor:** las reglas para registrar participantes y crear/modificar votos exigen `activeRoom(id)`. Por tanto, un navegador con HTML antiguo tampoco puede **escribir** respuestas en salas anteriores una vez publicadas estas reglas.
- En Inicio, el moderador verá únicamente **Mi sala única vigente**, no una lista de códigos antiguos. En el panel se muestra el estado **Sala lista y disponible** solo cuando la sala está en espera y los registros visibles se han sincronizado a cero.

### Publicación obligatoria y migración

Las nuevas reglas incluyen `match /roomDirectory/{key}` y `activeRoom(id)`. **Es obligatorio copiar la última versión del archivo `firestore.rules` del repositorio y publicarla en Firebase Console antes de utilizar la sala.** Las reglas anteriores no permiten escribir `roomDirectory/current`.

Después de publicar, ingresar con el usuario propietario y pulsar **Crear o recuperar sala única** para activar el directorio. No compartir un QR hasta verificar que el panel muestra la sala vigente. Los códigos antiguos quedan históricos y no deben volver a utilizarse para nuevas actividades. **No se han borrado las salas anteriores**.

Las comprobaciones automáticas validan la estructura del directorio y las condiciones de bloqueo; todavía es imprescindible probar con Firebase real la creación/recuperación, acceso de dos celulares, corrección del voto, finalización, limpieza y nueva inscripción con el mismo QR.

## Auditoría correctiva: inscripción visible y avance dirigido (18 noviembre 2026)

**Incidencias observadas:** participantes a veces no aparecían en la lista del moderador pese a entrar desde móvil; el celular podía avanzar libremente.

**Causa confirmada del avance libre:** el formulario elegía `survey` por defecto, y la sala central conservaba esa modalidad aunque se reutilizara el mismo QR.

**Reparaciones:**
- Nuevas salas de cuatro preguntas **exclusivamente en modo competencia**, sin selector de encuesta libre.
- Si la sala única existente es versión 3 y está en espera, el propietario puede recuperarla y pasarla a competencia con **el mismo código/QR**. Si está en curso, primero debe finalizarse y limpiarse; al limpiar, regresa a espera con modo competencia.
- Las reglas actualizadas de Firestore impiden crear salas nuevas de cuatro preguntas en modo libre y rechazan votos de respuesta libre para esas salas. La lectura y corrección de respuestas sigue limitada a la pregunta que abrió el moderador y al plazo vigente.
- El panel del moderador enseña una lista nominal de **participantes registrados** y un estado de sincronización. Además de los listeners, incorpora **Actualizar participantes** y una comprobación automática con lectura del servidor cada 12 segundos durante la actividad.
- Un contador de Firestore no demuestra presencia física o conexión activa: refleja **registros confirmados**, no usuarios conectados en ese instante.
- «Sala lista y disponible» se muestra únicamente con sala en espera, modo competencia y conteos sin votos/participantes verificados. El botón Iniciar se deshabilita si los listeners aún no han sincronizado.
- Nueva versión del enlace de participación: `v=2026-11-18-comp-dirigida2`.

**Despliegue imprescindible:** copiar `firestore.rules` a Firebase Console → Firestore Rules → Publish. El cambio en el repositorio no modifica automáticamente las reglas públicas.

**Validación efectuada:** comprobaciones de sintaxis y pruebas estáticas del repositorio. **No se ha probado una votación real en el Firebase del usuario**, por lo que debe realizarse una prueba con moderador y al menos un celular.

**Prueba mínima:** recuperar sala; comprobar que el panel indique **Competencia**; ingresar con nombre desde celular; verificar que aparezca en el listado; iniciar P1 desde PC; comprobar que no existen botones Anterior/Siguiente en el celular; revelar y avanzar desde PC; verificar que el celular cambia de pregunta únicamente después del avance.

## Sala de espera con confirmación individual

- Al ingresar mediante el QR y guardarse el registro en Firebase, el móvil muestra **Inscripción confirmada** con el nombre utilizado.
- Cada participante pulsa **Estoy listo**. La confirmación persiste en el documento de registro personal mediante los campos `ready: true` y `readyAt` con hora de servidor; al recargar o abrir de nuevo con el mismo navegador, se recupera su confirmación.
- En el panel privado aparecen **Inscritos**, **Listos** y **Pendientes**, una barra de progreso y los nombres con ✓ (preparado) o ○ (pendiente). Los cambios se reflejan con el listener en tiempo real y la consulta de respaldo del servidor.
- El botón **Iniciar competencia** permanece deshabilitado si no hay participantes registrados, quedan confirmaciones pendientes o aún no se han sincronizado los datos. Cuando todos los inscritos confirman, el inicio sigue siendo manual, bajo el control de los expositores.
- El mecanismo **no garantiza conexión en línea en ese instante**: describe inscripciones guardadas y confirmaciones expresas. El grupo puede cotejar verbalmente en la videollamada quién falta por ingresar.
- Después de cerrar y limpiar la sala, los registros se eliminan. Los asistentes que regresen deberán inscribirse y confirmar nuevamente, con el mismo QR.
- **Actualizar las reglas en Firebase Console**, ya que los participantes ahora necesitan permiso limitado para actualizar exclusivamente `ready` y `readyAt` en su documento durante el estado de espera.

## Incidencia visual de sala antigua en curso (18 noviembre 2026)

En la sala `L7VAP5K`, el propietario observó «Encuesta · En curso», dos inscripciones «Emil», cero confirmados y un voto. Esta combinación indica un **ensayo antiguo todavía activo**, no una sala de competencia dirigida en espera. Cada registro con el mismo nombre puede corresponder a identidades anónimas diferentes de Firebase; «inscritos» cuenta registros persistentes, no teléfonos conectados en ese instante.

**Corrección publicada:** se muestra **«Reiniciar ensayo · conservar QR»** al propietario incluso cuando el ensayo sigue en `live` (también disponible tras `done`). Con confirmación expresa `REINICIAR`, cierra una sesión aún abierta, elimina los votos y participantes, verifica la limpieza en Firebase y devuelve la misma sala a `lobby` con `mode: 'competition'`. El código y el QR se mantienen. Un participante de una vieja encuesta v3 ya no verá el botón «Estoy listo» ni una indicación engañosa que no puede guardar durante la transición: se le comunica que el propietario debe reiniciar la sala. **No se ejecuta ningún borrado automático.**

Tras el reinicio, los participantes deberán volver a ingresar mediante el mismo QR, inscribirse y confirmar «Estoy listo». El propietario verá `1 inscrito · 1 listo · 0 pendientes` si solo ingresa un celular con una identidad nueva. La confirmación requiere las reglas de `firestore.rules` que incluyen la actualización de campos `ready`/`readyAt`; si estas reglas aún no están publicadas, Firebase rechazará la confirmación.

**Prueba pendiente:** validar este proceso con Firebase real. Las comprobaciones del repositorio no certifican que el reinicio ya se haya realizado ni que las reglas estén publicadas.

## Pantalla pública continua (QR → preguntas → resultados)

La actividad se presenta en **dos ventanas**. El propietario mantiene su panel privado de moderación, mientras que el botón **«Abrir pantalla para compartir»** abre/reutiliza una ventana identificada `comparisonPublicScreen` con URL `?room=CODIGO&view=projection`. Se debe compartir **solo esa ventana** en la videollamada.

Esta ventana es pública desde su carga, no contiene botones de navegación entre preguntas ni el guion privado y sigue el estado de la sala publicado en Firebase:

1. **Sala en espera:** QR grande, código único, participantes inscritos y listos (sin nombres).
2. **Pregunta abierta:** enunciado y cuatro opciones, sin porcentajes ni respuesta correcta.
3. **Mostrar distribución:** gráfico agregado de respuestas, sin revelar la opción correcta.
4. **Revelar respuesta:** gráfico con respuesta correcta destacada; el moderador sigue controlando el avance desde la ventana privada.
5. **Sesión cerrada:** síntesis final del grupo, en la misma pantalla pública.

La ventana pública comprueba la autenticación de expositor y la autorización de esa cuenta a la sala antes de leer resultados. Si no se puede confirmar su acceso, muestra un mensaje dentro de la pantalla pública, no un panel privado ni el formulario de participación.

**Límites:** requiere iniciar sesión como expositor en Chrome y abrir la ventana desde su panel. La sincronización se basa en listeners de Firebase; aún debe probarse end-to-end con dos ventanas y un móvil. La proyección separada no debe confundirse con compartir el escritorio completo, que puede exponer otras ventanas.

## Corrección: portada al abrir ventana para compartir (18 Nov 2026)

Se detectó que abrir la ventana pública mientras la sala anterior estaba en `live` mostraba directamente P1, saltándose el QR. Desde esta versión la portada **no depende solo de `room.status`**: utiliza `publicView`, almacenado en la sala de Firebase, con `welcome` por defecto para registros antiguos.

- **Abrir pantalla para compartir:** abre/reutiliza la misma ventana pública e inicia en portada con QR, código único, inscritos, listos y pendientes (sin nombres). Si la sala ya tenía preguntas abiertas, vuelve a mostrar portada antes de continuar. La vista inicial tiene protección para evitar mostrar fugazmente P1 en la carga.
- Los contadores se actualizan desde el listener de participantes en el servidor; no se necesita pulsar «Actualizar participantes» en la pantalla pública. El QR se conserva en un nodo reutilizable para evitar parpadeos cuando cambian los contadores.
- **Iniciar competencia:** desde la sala en espera cambia de forma atómica la sala a `live` y `publicView:'questions'`, de modo que la pantalla pública pasa automáticamente a la primera pregunta.
- **Mostrar portada y QR / Mostrar pregunta al público:** controles exclusivos del panel privado para alternar durante una sesión ya iniciada, sin avanzar preguntas ni modificar votos.
- **Reiniciar ensayo:** devuelve `publicView` a `welcome` junto con el estado de sala en espera, sin cambiar el QR.
- **Reglas:** se agregó `publicView` a los campos permitidos y se limita a `welcome` o `questions`. **Debe publicarse el último `firestore.rules` en Firebase Console**, ya que GitHub por sí mismo no despliega esos permisos.

**Límite de validación:** las comprobaciones automáticas verifican código y reglas, pero no sustituyen el ensayo con navegador principal, ventana pública y celular reales.

## Sala de espera: inscritos pendientes y duplicados (19 nov 2026)
- «Iniciar competencia» sigue exigiendo que todos hayan confirmado. Si alguien no responde, el propietario o el segundo expositor pueden usar **«Iniciar solo con los listos»** (pide confirmación y nombra a los pendientes).
- Los nombres repetidos se marcan como «posible duplicado». El propietario puede **Quitar** un registro en la sala de espera (requiere publicar `firestore.rules`: borrado de participantes en `lobby` o `done`).
- **Reiniciar ensayo · conservar QR** ahora también está disponible desde la sala de espera.
- La ventana pública solo fuerza la portada en la primera carga; recargarla durante una pregunta ya no vuelve a la portada.
- Se retiró el sondeo cada 12 s del panel (menos lecturas); «Actualizar participantes» queda como lectura manual.
- `npm test` ejecuta `scripts/verify.mjs` y una prueba de comportamiento con jsdom (`scripts/lobby.test.mjs`).

## Simplificación (19 nov 2026)
- Se retiró la **simulación con datos ficticios**: solo existe la sala real y sus ensayos con celulares.
- Si el propietario abre una sala cerrada (o en modo encuesta antiguo) **sin participantes ni votos**, se reabre sola con el mismo QR. Con datos existentes nunca borra nada: hay que usar «Reiniciar ensayo · conservar QR» con confirmación.

## Guiones del expositor (19 nov 2026)
- Cada pregunta tiene guion propio: qué evalúa, qué decir al revelar, por qué falla cada distractor, preguntas para conversar, ejemplo, puente a la siguiente y tiempo sugerido. Los textos viven en `GUION` (`index.html`).
- «Cómo leer estos resultados» adapta la sugerencia a la distribución real (consenso, distractor dominante, mayoría con dudas, grupo dividido).
- El resumen final de la pantalla pública y del panel muestra el resultado de cada pregunta con un mensaje.
- El panel incluye un «Guion de la sesión para los dos expositores» (reparto 2 y 2).

## Análisis de cada pregunta (19 nov 2026)
Tras revelar la respuesta, el panel muestra párrafos cortos: primero cada alternativa incorrecta con votos (de mayor a menor) con «X % eligió la alternativa B y falló dado que…», luego la correcta con «es la correcta porque…». Si todos acertaron, solo se explica por qué es correcta. El material de apoyo (discusión, ejemplo, puente) queda plegado.

## Cierre pedagógico, sonidos y tiempos (19 nov 2026)
- **Análisis por pregunta** más narrativo: apertura según el resultado real, recuadro «Recordemos lo que dice la teoría» (Sartori, 1999, con página), «Desambigüemos» para la alternativa en que más falló el grupo y «Para fortalecer». Las ideas fuerza se resaltan en amarillo.
- **Síntesis del grupo** con «Ideas fuerza de la sesión», indicador consolidado/por reforzar y **Conclusión de la sesión** (también en la pantalla pública). Los participantes ven «Para llevarte» al cerrar.
- **Sonidos** sintetizados (sin archivos): selección, listo, inicio, siguiente, acierto, desacierto, cuenta regresiva, revelación y logro final. Botón «Sonido» para silenciar; el navegador exige un toque inicial para activar el audio.
- **Tiempos por pregunta:** el formulario solo se aplicaba al *crear* una sala. Ahora el panel del moderador muestra los segundos guardados en Firestore y el propietario puede cambiarlos con la sala en espera. **Requiere publicar `firestore.rules`.**
- Pruebas: `npm test` (incluye `scripts/narrative.test.mjs`).
- Fuentes de las citas: Sartori (1999, pp. 31-47) y Panebianco (1999), de la literatura del curso.

## Ficha del expositor y cierre (20 nov 2026)

- Cada pregunta muestra, en el panel privado: lectura rápida, un guion **«Para decir»** (3 frases, ~30 s) que cambia según el resultado real (consenso, mayoría con dudas, error dominante, dividido, pocas respuestas) y un **respaldo teórico plegado** (cita con página, «Desambigüemos» de la alternativa dominante, pregunta para fortalecer, todas las alternativas, material de apoyo).
- La pestaña **Cierre** está bloqueada hasta revelar la última pregunta o cerrar la sesión; contiene el guion de cierre (~60 s), tres ideas para llevarse (priorizando las preguntas más débiles) y el detalle por pregunta plegado.
- La pantalla pública mantiene su versión reducida. Los participantes no ven teoría.
- Los textos hablados viven en `SPEAK` (`core`, `take`, `hint`) dentro de `index.html`; ajústalos ahí para cambiar la voz.
