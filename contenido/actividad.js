/*
 * ACTIVIDAD — todo lo que cambia de una sesión a otra vive en este archivo.
 * El motor (index.html) no contiene texto de ninguna actividad. Guía completa: GUIA_ACTIVIDAD.md
 *
 * Marcado de resaltado en los textos: **frase** se muestra resaltada.
 * Campos obligatorios por pregunta: q, a, correct. Todo lo demás es opcional (si falta, la plataforma usa frases genéricas).
 */

window.ACTIVIDAD = {

  /* ===== Marca y apariencia ===== */
  marca: {
    tituloPagina: 'Quiz en vivo',                       // pestaña del navegador
    etiqueta: 'Nombre del curso, evento o institución',  // línea pequeña sobre el título
    titulo: 'Título de tu actividad',
    subtitulo: 'Una frase que explique de qué trata la actividad.',
    kicker: 'EVENTO · GRUPO',                           // rótulo de la pantalla pública (MAYÚSCULAS)
    tituloInforme: 'Informe de la actividad',           // título del informe PDF
    archivo: 'actividad',                               // prefijo de los archivos CSV y QR descargados
    logo: null,                                         // o { src: 'logo.png', alt: 'Nombre', ancho: 175, alto: 98 }
    colores: {                                          // opcionales; formato #rrggbb
      primario: '#2e7764', primarioOscuro: '#2b554e',
      acento: '#2b6a8f', acentoOscuro: '#245a7a', tinta: '#1b2b3b'
    },
    paises: null                                        // o una lista, p. ej. ['Guatemala', 'México']; null = lista estándar
  },

  /* ===== Cierre (todo opcional) ===== */
  cierre: {
    frase: 'Gracias por participar. Lo más valioso de hoy fue la conversación que abrieron las respuestas del grupo.', // última frase del guion de cierre
    fraseCorta: '',   // línea final de la pantalla pública
    fraseFinal: ''    // frase sugerida para despedir la sesión (guion de los expositores)
  },

  /* ===== Preguntas (de 1 a 20) ===== */
  preguntas: [
    {
      // --- Obligatorio ---
      topic: 'Tema 1',                                    // etiqueta corta
      q: 'Escribe aquí el enunciado de la primera pregunta.',
      a: [                                                // de 2 a 6 alternativas
        'Alternativa correcta de ejemplo.',
        'Alternativa incorrecta de ejemplo (1).',
        'Alternativa incorrecta de ejemplo (2).',
        'Alternativa incorrecta de ejemplo (3).'
      ],
      correct: 0,                                         // posición de la correcta, empezando en 0

      // --- Opcional: explicación que ven los participantes ---
      why: 'Explica brevemente por qué esa alternativa es la correcta.',

      // --- Opcional: apoyo para los expositores (nunca lo ven los participantes) ---
      principle: '',     // idea central, en una frase (si falta se usa «why»)
      mis: null,         // por alternativa, por qué atrae al grupo; null en la correcta. Ej.: [null, 'Confunde X con Y.', ...]
      recall: '',        // recordatorio teórico: «Recordemos a **autor**: ...»
      cite: '',          // cita con página, p. ej. 'Autor (2020, p. 12).'
      dis: null,         // por alternativa, «Desambigüemos: ...»; null en la correcta
      hint: null,        // por alternativa, frase hablada de por qué tienta y por qué falla; null en la correcta
      core: '',          // idea que se dice al final del guion de la pregunta
      take: '',          // idea para llevarse al cierre
      strengthen: '',    // «Para fortalecer: ...»
      discuss: [],       // preguntas para conversar con el grupo
      example: '',       // ejemplo para aclarar
      bridge: '',        // puente hacia la siguiente pregunta
      transfer: '',      // cómo trasladarlo a otro contexto
      question: '',      // pregunta guía
      time: '', refs: ''
    },
    {
      topic: 'Tema 2',
      q: 'Escribe aquí el enunciado de la segunda pregunta.',
      a: ['Alternativa incorrecta de ejemplo (1).', 'Alternativa correcta de ejemplo.', 'Alternativa incorrecta de ejemplo (2).', 'Alternativa incorrecta de ejemplo (3).'],
      correct: 1,
      why: 'Explica brevemente por qué esa alternativa es la correcta.'
    },
    {
      topic: 'Tema 3',
      q: 'Escribe aquí el enunciado de la tercera pregunta.',
      a: ['Alternativa incorrecta de ejemplo (1).', 'Alternativa incorrecta de ejemplo (2).', 'Alternativa correcta de ejemplo.'],
      correct: 2,
      why: 'Explica brevemente por qué esa alternativa es la correcta.'
    }
  ],

  /* ===== Minicomprobación opcional tras la explicación (una por pregunta, en el mismo orden) ===== */
  transferencia: []
  // Ejemplo: [{ q: 'Caso nuevo...', a: ['Opción 1', 'Opción 2', 'Opción 3'], correct: 1, why: 'Porque...' }, ...]
};
