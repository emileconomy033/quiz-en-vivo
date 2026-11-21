# Auditoría funcional — 18 de noviembre de 2026

**Aplicación:** ¿Realmente sabemos comparar? · ICAP Grupo 1  
**Repositorio:** `emileconomy033/metodo-comparado-quiz`  
**Alcance:** cuatro preguntas en nuevas salas (versión 3); compatibilidad histórica de seis preguntas (versiones 1 y 2); moderador, segundo expositor y participantes anónimos.

## 1. Hallazgos y reparaciones realizadas

| Hallazgo | Evidencia en código anterior | Reparación publicada | Estado |
| --- | --- | --- | --- |
| Al pulsar «Participar» varias veces podían abrirse solicitudes de ingreso simultáneas | El manejador no tenía bloqueo de petición | `joiningInProgress`, desactivación temporal del botón y validación previa a cambios de sesión | Corregido y comprobado estáticamente |
| «No fue posible ingresar (validación inicial)» seguía apareciendo cuando el participante ya estaba respondiendo | El error se mostraba globalmente y no se limpiaba después del ingreso exitoso | Limpieza explícita de alertas, navegación no destructiva y comprobación en servidor | Corregido y comprobado estáticamente |
| Una respuesta enviada podía parecer guardada antes de ser aceptada por Firebase | El listener consumía el eco local de Firestore con escrituras pendientes | `includeMetadataChanges:true` y descarte de `metadata.hasPendingWrites`; solo se confirma después del reconocimiento del servidor | Corregido y comprobado estáticamente |
| Al abrirse una pregunta, el temporizador podía iniciar con los segundos completos cuando `openedAt` aún estaba sin confirmar | `remaining()` devolvía la duración inicial si faltaba la marca de tiempo | Mostrar «Preparando…» y bloquear el voto hasta que exista `openedAt` válido | Corregido y probado con reloj simulado |
| La respuesta rechazada aparecía lejos de las opciones en el móvil | Mensaje solo en la alerta superior global | Error contextual en encuesta o competencia, conservado hasta que se confirme un nuevo voto | Corregido y comprobado estáticamente |
| Errores indistinguibles de permisos o plazo | Excepciones genéricas | Al fallar el voto se relee la sala y se informa si cambió de etapa, terminó el tiempo o Firestore rechazó permisos | Implementado; necesita Firebase real |
| Dispositivos podían usar una versión en caché distinta de la del moderador | El QR heredaba parámetros y no añadía identificador de versión | Los enlaces QR nuevos llevan `v=2026-11-18-qa1` | Implementado; necesita prueba en dispositivos |

**Distinción importante:** no es posible atribuir todos los rechazos históricos a una sola causa. En particular, no se pudo consultar la versión de reglas actualmente desplegada en Firebase Console.

## 2. Componentes revisados
- **Currículo:** nuevas salas usan cuatro preguntas; A/B/C/D una correcta por posición. Salas previas preservan seis preguntas.
- **Inscripción:** consulta real de sala, lectura o creación del registro propio y posterior suscripción.
- **Votación:** una respuesta por pregunta y participante; se puede actualizar mientras el servidor acepte el plazo.
- **Competencia:** cierre por `request.time` y `openedAt` en Firestore; avance y revelación en etapas.
- **Encuesta libre:** corrección hasta el cierre; finalización individual.
- **Moderación:** acceso con email/contraseña; invitación para segundo expositor; separación de permisos.
- **Presentación:** guion privado, vista pública abreviada y proyección en ventana distinta.
- **Histórico:** borrado de registros solo por el propietario y después de cerrar la sala oficial; no reutiliza datos antiguos.
- **Exportación:** CSV y versión imprimible como PDF.

## 3. Nivel de evidencia

**Verificado:** sintaxis del JavaScript principal, correspondencia estructural con reglas, comprobaciones del currículo versionado, lógica horaria con reloj simulado, controles contra doble ingreso y votos locales pendientes.

**No verificado todavía:** reglas efectivamente publicadas en Firebase, éxito del voto con usuario real en una sala nueva, sincronización simultánea de varios celulares, eliminación real de datos de prueba, recuperación con segundo expositor y funcionamiento del QR en varios dispositivos.

### Para comprobar las reglas publicadas
Abrir `https://console.firebase.google.com/project/encuesta-5cd5f/firestore/rules` y comparar con `firestore.rules` de `main`. Debe incluir `quizVersion in [2,3]`, `match /answers/{qid}/votes/{pid}`, validación del horario y `function coPresenter(id)`. **Publicar** si hay diferencias. Subirlas a GitHub no actualiza la consola.

## 4. Prueba real de aceptación (con una sola sala oficial)

1. Entrar como propietario en un navegador limpio y crear **Clase oficial (reutilizable)** en **Competencia**. Anotar código y abrir panel.
2. Entrar desde celular A mediante el QR, con nombre; observar «Esperando al moderador» y la cantidad de participantes.
3. Entrar desde celular B con otro navegador/perfil y nombre diferente.
4. Abrir la primera pregunta (p. ej. 30 segundos). Ver «Preparando…» si la hora aún no está confirmada.
5. Votar en A y modificar respuesta antes de que acabe el plazo. Debe conservarse la **última** opción aceptada.
6. Dejar vencer el tiempo en B e intentar responder: la interfaz debe bloquear; Firestore debe rechazar cualquier intento tardío.
7. Mostrar distribución sin clave, luego revelar la clave y finalmente avanzar. Ver contador de aciertos y retroalimentación personal.
8. Repetir hasta la cuarta pregunta, cerrar y comprobar que ambos celulares pueden ver su resultado.
9. Comprobar CSV, PDF y dos vistas de proyección desde el ordenador del propietario.
10. Acceder con cuenta del segundo expositor, comprobar que puede proyectar y que **no puede borrar datos**.
11. Guardar copia de resultados de prueba solo si es necesaria; después, propietario pulsa «Borrar datos de prueba y reutilizar esta sala oficial». Confirmar `BORRAR`.
12. Confirmar sala en estado de espera, cero participantes, cero votos y **mismo QR**. Reingresar desde un celular y repetir una votación corta.

**Criterio de aprobación:** cero errores de permisos imprevistos, cuatro preguntas, tiempos validados desde Firestore, datos reales separados de simulación y limpieza completa con propietario identificado.

## 5. Limitaciones y precauciones
- El enlace al cuestionario puede contener una versión cacheada; actualizar los navegadores antes del ensayo definitivo.
- Las comprobaciones automáticas no sustituyen las pruebas de reglas en el emulador oficial o una sala real.
- El borrado de datos es irreversible para los registros de la sala; no afecta archivos CSV/PDF descargados ni otras salas.
- El servidor valida el plazo final. Con red lenta, una pulsación muy cercana al cierre puede ser rechazada aunque el botón estuviera visible; la interfaz deja un margen preventivo pequeño.
