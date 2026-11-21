import {readFileSync} from 'node:fs';
/* Devuelve index.html con el contenido de la actividad incrustado, para probarlo en JSDOM sin red. */
export function pageWith(activityFile='ejemplos/metodo-comparado-grupo1.js',extraCode=''){
  const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
  const code=typeof activityFile==='string'&&/\.js$/.test(activityFile)&&!activityFile.includes('\n')?readFileSync(new URL('../'+activityFile,import.meta.url),'utf8'):activityFile;
  const tag='<script src="contenido/actividad.js"></script>';
  if(!html.includes(tag))throw new Error('index.html debe cargar contenido/actividad.js');
  return html.replace(tag,()=>'<script>'+code+extraCode+'</script>');
}
