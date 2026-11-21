# Quiz en vivo

Plataforma de preguntas en vivo para clases, talleres y eventos. Los participantes entran con un QR desde el celular; dos expositores conducen la sesión desde un panel privado, con pantalla pública para proyectar. Funciona con **cualquier tema**: lo único que cambia de una actividad a otra es un archivo de contenido.

- **Participantes:** responden desde el teléfono, ven si acertaron y su puntaje personal. No ven teoría.
- **Expositores:** panel privado con ficha por pregunta (lectura rápida, guion «Para decir» que se adapta al resultado real y respaldo plegado) y pestaña «Cierre».
- **Pantalla pública:** versión reducida de los resultados y del cierre.
- **Técnica:** un solo `index.html` + Firebase (Auth anónima, Firestore) + GitHub Pages. Sin servidor propio.

## Crear una actividad nueva (15 minutos)

1. Abre [`contenido/actividad.js`](contenido/actividad.js) y reemplaza marca, preguntas y cierre. La guía campo por campo está en [`GUIA_ACTIVIDAD.md`](GUIA_ACTIVIDAD.md).
2. `npm install` (una sola vez) y `npm test`. Las pruebas validan el contenido y avisan con mensajes claros si falta algo.
3. Publica: `git add -A && git commit -m "Nueva actividad" && git push`. GitHub Pages actualiza el sitio.
4. En el panel del propietario, abre la sala. Si la actividad nueva tiene un número distinto de preguntas que la sala anterior, la plataforma crea una sala nueva (cambia el QR) y te lo avisa.

Actividades guardadas como ejemplo en [`ejemplos/`](ejemplos/):

| Archivo | Qué es |
|---|---|
| `metodo-comparado-grupo1.js` | Edición completa «¿Realmente sabemos comparar?» (ICAP, Grupo 1) con todos los campos opcionales. |
| `plantilla-en-blanco.js` | Plantilla comentada, lista para llenar. |

Para activar una de ellas: `npm run actividad -- ejemplos/metodo-comparado-grupo1.js`.

## Archivos

| Archivo | Función |
|---|---|
| `index.html` | Motor de la plataforma. No contiene texto de ninguna actividad. |
| `contenido/actividad.js` | **La actividad activa**: marca, preguntas, explicaciones, guiones y cierre. |
| `firebase-config.js` | Conexión a Firebase y ajustes de la plataforma (`APP_CONFIG`). |
| `firestore.rules` | Reglas de seguridad de Firestore. Se publican a mano en la consola de Firebase. |
| `scripts/` | Pruebas automáticas (`npm test`). |
| `docs/` | Historial técnico de la primera edición. |
| `CLAUDE.md` | Contexto técnico para retomar el proyecto (también útil para personas). |

## Puesta en marcha desde cero (otro proyecto de Firebase)

Ver «Firebase» en [`CLAUDE.md`](CLAUDE.md): proyecto, Authentication (anónimo y correo/contraseña), Firestore, publicación de reglas y dominios autorizados.
