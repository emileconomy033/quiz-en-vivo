/* Uso: npm run actividad -- ejemplos/metodo-comparado-grupo1.js
   Copia el archivo indicado a contenido/actividad.js (la actividad que carga la plataforma). */
import {copyFileSync,existsSync} from 'node:fs';
const src=process.argv[2];
if(!src||!existsSync(src)){console.error('Indica un archivo de actividad existente, p. ej.: npm run actividad -- ejemplos/plantilla-en-blanco.js');process.exit(1)}
copyFileSync(src,'contenido/actividad.js');
console.log('Actividad activa:',src,'→ contenido/actividad.js. Ejecuta «npm test» y publica.');
