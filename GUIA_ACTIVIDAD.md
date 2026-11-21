# Guía para crear una actividad

Todo se define en [`contenido/actividad.js`](contenido/actividad.js). La plataforma no necesita cambios de código para una actividad nueva. Si el archivo tiene un error, la página muestra un mensaje claro y `npm test` lo detecta antes de publicar.

El texto admite `**frase**` para resaltar una idea (amarillo en el guion hablado, negrita en el respaldo).

## 1. Marca (`marca`)

| Campo | Para qué sirve |
|---|---|
| `tituloPagina` | Título de la pestaña del navegador. |
| `etiqueta` | Línea pequeña sobre el título (curso, evento, institución). |
| `titulo`, `subtitulo` | Encabezado principal. |
| `kicker` | Rótulo en MAYÚSCULAS de la pantalla pública. |
| `tituloInforme` | Título del informe PDF. |
| `archivo` | Prefijo de los archivos CSV y QR descargados. |
| `logo` | `{ src, alt, ancho, alto }` o `null` si no hay logo. `src` puede ser una URL o un archivo del repositorio (por ejemplo `contenido/logo.png`). |
| `colores` | `primario`, `primarioOscuro`, `acento`, `acentoOscuro`, `tinta` en formato `#rrggbb`. Opcionales. |
| `paises` | Lista para el selector opcional de país, o `null` para la lista estándar. |

## 2. Preguntas (`preguntas`, de 1 a 20)

**Obligatorio por pregunta:** `q` (enunciado), `a` (de 2 a 6 alternativas) y `correct` (posición de la correcta, empezando en 0).

**Recomendado:** `topic` (etiqueta corta) y `why` (explicación breve).

**Opcional, solo para los expositores** (si falta, la plataforma usa frases genéricas y no muestra el bloque):

| Campo | Qué aparece |
|---|---|
| `mis` | Por alternativa, por qué atrae. `null` en la correcta. |
| `recall`, `cite` | Recuadro «Qué dice la teoría» y su cita. |
| `dis` | Por alternativa, un «Desambigüemos…». `null` en la correcta. |
| `hint` | Por alternativa, una frase hablada de por qué tienta y por qué falla. Se usa en el guion «Para decir» cuando esa alternativa fue la más elegida. |
| `core` | Idea con la que termina el guion «Para decir». |
| `take` | Idea para llevarse en el cierre (si falta se usa `key`, luego `why`). |
| `strengthen`, `discuss`, `example`, `bridge`, `transfer`, `question`, `time`, `refs` | Material de apoyo plegado. |

Los arreglos por alternativa (`mis`, `dis`, `hint`, `trap`) deben tener **una entrada por alternativa**, en el mismo orden que `a`.

## 3. Cierre (`cierre`, todo opcional)

- `frase`: última frase del guion de cierre.
- `fraseCorta`: línea final de la pantalla pública.
- `fraseFinal`: frase sugerida para despedir la sesión.

## 4. Minicomprobación (`transferencia`, opcional)

Una por pregunta, en el mismo orden: `{ q, a: [...], correct, why }`. Aparece tras la explicación como comprobación opcional. Déjala vacía (`[]`) si no la necesitas.

## Cómo se comporta el guion «Para decir»

Se adapta al resultado real de cada pregunta:

| Resultado | Qué dice el guion |
|---|---|
| 75 % o más acertó | Confirma el criterio y aclara la duda que quedó. |
| 55 a 75 % | Reconoce la mayoría y se detiene en la alternativa errónea más elegida. |
| Una alternativa errónea concentró 40 % o más | Nombra esa intuición y la desarma con `hint`. |
| Respuestas repartidas | Propone reconstruir el criterio paso a paso. |
| Menos de 5 respuestas | Tono neutro, sin diagnosticar al grupo. |

## Cambiar de actividad

1. Guarda la actual si quieres conservarla: cópiala a `ejemplos/`.
2. Edita `contenido/actividad.js`, o actívala desde un ejemplo: `npm run actividad -- ejemplos/plantilla-en-blanco.js`.
3. `npm test` y publica.

**Importante:** una sala está atada al número de preguntas con que se creó. Si la actividad nueva tiene otro número de preguntas, el panel crea una sala nueva y cambia el QR. Si tiene el mismo número, usa «Reiniciar ensayo · conservar QR» para borrar los datos de la sesión anterior y conservar el QR.
