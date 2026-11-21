/* Ejemplo de una sola pregunta: «Muchas variables, pocos casos» (¿problema que se resuelve o tensión que se administra?).
 * Citas con autor y año; verifica las páginas con la lectura del curso antes de usarla.
 * Para usarla: npm run actividad -- ejemplos/muchas-variables-pocos-casos.js */
window.ACTIVIDAD = {
 "marca": {
  "tituloPagina": "Muchas variables, pocos casos · Grupo 1",
  "etiqueta": "ICAP · Taller de Métodos y Técnicas de Investigación I · Grupo 1",
  "titulo": "«Muchas variables, pocos casos»",
  "subtitulo": "Un problema que el método puede resolver o una tensión que solo se administra.",
  "kicker": "MÉTODO COMPARADO · MUCHAS VARIABLES, POCOS CASOS",
  "tituloInforme": "Informe académico · Método comparado",
  "archivo": "metodo-comparado",
  "logo": {
   "src": "https://images.seeklogo.com/logo-png/57/1/icap-logo-png_seeklogo-572338.png",
   "alt": "ICAP — Instituto Centroamericano de Administración Pública",
   "ancho": 175,
   "alto": 98
  },
  "colores": {
   "primario": "#2e7764",
   "primarioOscuro": "#2b554e",
   "acento": "#2b6a8f",
   "acentoOscuro": "#245a7a",
   "tinta": "#1b2b3b"
  },
  "paises": [
   "Guatemala",
   "Nicaragua",
   "Costa Rica",
   "El Salvador",
   "Honduras",
   "Panamá",
   "Belice",
   "México",
   "Colombia",
   "Otro país"
  ]
 },
 "cierre": {
  "frase": "Por eso la pregunta útil no es «¿resolvimos el problema?», sino **«¿qué sacrificamos y podemos defenderlo?»**. Declarar el costo convierte la simplificación en una decisión de diseño; ocultarlo, en un error.",
  "fraseCorta": "Seguimos con la pregunta que ordena el diseño: **¿qué estamos sacrificando y por qué esta pregunta puede permitírselo?**",
  "fraseFinal": "No se elimina la tensión: se elige qué perder, y se declara."
 },
 "preguntas": [
  {
   "topic": "Variables y casos",
   "q": "Un equipo quiere explicar un resultado con muchas variables posibles, pero solo cuenta con cinco casos. Reduce las variables a dos y afirma que el problema de «muchas variables, pocos casos» quedó resuelto. ¿Qué afirmación es la más rigurosa?",
   "a": [
    "Quedó resuelto, porque con menos variables ya hay más casos por cada variable.",
    "No tiene solución posible: con pocos casos no hay comparación válida.",
    "La tensión se administró, no se eliminó: simplificar cuesta complejidad, y ese costo debe declararse y justificarse.",
    "Hay que sumar casos de cualquier tipo, porque más casos siempre fortalecen la explicación."
   ],
   "correct": 2,
   "why": "Reducir variables o sumar casos desplaza la tensión y tiene un costo (complejidad, generalización o validez). Es una solución solo si ese costo se declara y se justifica.",
   "principle": "Reducir variables o sumar casos no elimina la tensión entre variables y casos: la desplaza, y su costo debe declararse.",
   "mis": [
    "Reduccionismo: simplificar el modelo no aumenta la información disponible, solo cambia lo que se pierde.",
    "Escepticismo excesivo: pocos casos permiten explorar y formular hipótesis, aunque no demostrarlas.",
    null,
    "Cantidad sin criterio: sumar casos que ya no son comparables diluye el concepto y la explicación."
   ],
   "recall": "Recordemos el problema que describe **Lijphart** (1971): cuando hay **más variables que casos**, los datos no alcanzan para descartar explicaciones rivales. Los remedios que se proponen (sumar casos, reducir variables, centrarse en casos comparables o en variables clave) **tienen un costo**, y es el mismo intercambio de Sartori en la escala de abstracción: se gana alcance **perdiendo atributos** (1999, p. 45).",
   "cite": "Lijphart (1971); Sartori (1999, p. 45).",
   "dis": [
    "Desambigüemos: **menos variables no equivale a más información**. Se gana manejabilidad, pero se puede perder justo la variable que explicaba; el número de casos sigue siendo el mismo.",
    "Desambigüemos: **pocos casos no es imposible, es limitado**. Permite generar hipótesis y explorar condiciones, aunque no probar causalidad; lo honesto es decir qué se puede y qué no se puede afirmar.",
    null,
    "Desambigüemos: **más casos no es más validez** si los nuevos casos ya no cumplen los atributos definitorios: es el riesgo de estirar el concepto (Sartori, 1999, p. 39)."
   ],
   "hint": [
    "Suena lógico: menos variables, más casos por variable. Pero el problema no se resolvió, se movió: simplificamos el modelo y quizá dejamos fuera la variable que explicaba.",
    "Es la reacción contraria, y también exagera. Con pocos casos se puede explorar y formular hipótesis; lo que no se puede es dar por demostrado lo que solo es plausible.",
    null,
    "Sumar casos parece la salida natural, pero si los nuevos casos ya no son comparables, el concepto se estira y la explicación se diluye."
   ],
   "core": "La idea para llevarnos: **la tensión no se elimina, se elige qué sacrificar**, y se declara.",
   "key": "La **tensión se administra, no se elimina**: cada remedio sacrifica complejidad, alcance o validez.",
   "take": "**La tensión se administra, no se elimina**: cada remedio sacrifica complejidad, generalización o validez; es una solución solo si el costo se declara y se justifica (Lijphart, 1971; Sartori, 1999, p. 45).",
   "strengthen": "Para fortalecer: antes de simplificar, escribe **qué pierdes** (complejidad, generalización o validez) y **por qué tu pregunta puede permitírselo**.",
   "dato": "Si el sacrificio es tan grande que la respuesta **ya no contesta la pregunta original**, no hay solución: hay un problema disfrazado.",
   "discuss": [
    "En su propia investigación, ¿qué estarían dispuestos a sacrificar: complejidad, generalización o validez? ¿Por qué?",
    "Si resolver la tensión implica sacrificar una de las tres, ¿sigue siendo una «solución»? ¿Cuándo sí y cuándo no?"
   ],
   "example": "Para explicar por qué ciertas reformas funcionan con solo seis países, reducir a dos variables hace manejable el análisis, pero puede dejar fuera la que explicaba el resultado. Declarar esa pérdida vuelve la simplificación una decisión de diseño; ocultarla la vuelve un error.",
   "transfer": "Antes de simplificar un diseño, lista lo que sacrificas y justifica por qué tu pregunta puede permitírselo.",
   "question": "¿Qué estoy perdiendo al resolver esta tensión y puedo defenderlo?",
   "time": "3 a 4 minutos de discusión",
   "refs": "Lijphart (1971); Sartori (1999). Verificar páginas con la lectura del curso."
  }
 ],
 "transferencia": []
};
