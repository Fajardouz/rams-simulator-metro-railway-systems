"use strict";
/* ============================================================
   LISTA DE RAMAS DEL PORTAL
   Para agregar una rama nueva:
   1. Copie una carpeta de /ramas (por ejemplo "teoria") con otro nombre.
   2. Cambie su contenido.js.
   3. Agréguela aquí abajo.
   ============================================================ */
var RAMAS = [
  {carpeta:"ramas/teoria",          titulo:"Ejercicios teóricos RAMS",          descripcion:"Ciclo de vida en V, conceptos RAMS e indicadores. Arrastre cada pieza a su lugar."},
  {carpeta:"ramas/casos-seguridad", titulo:"Casos aplicados de seguridad",       descripcion:"Usted toma las decisiones en una situación de operación y ve sus consecuencias en minutos, barreras y registro."},
  {carpeta:"ramas/fracas",          titulo:"Reportes de falla (FRACAS)",         descripcion:"Cómo se reporta, analiza y cierra una falla: pasos del ciclo FRACAS y un reporte real para corregir."},
  {carpeta:"ramas/detective",       titulo:"Detective de fallas",                descripcion:"Busque la falla que se repite en los reportes de dos semanas y descubra por qué solo aparece cuando los reportes traen datos."},
  {carpeta:"ramas/taller-reporte",  titulo:"Taller de reporte",                  descripcion:"Lea lo que pasó en su turno, diligencie el reporte de la falla y vea qué puede hacer mantenimiento con lo que usted escribió."}
];

/* ============================================================
   SESIONES DEL CURSO
   La página de inicio muestra las sesiones. Cada sesión enlaza sus actividades.
   - href: carpeta de la rama + parámetros opcionales:
       ver=id1,id2  muestra solo esos ejercicios o casos (ids de su contenido.js)
     El número de sesión (s=) se agrega solo, para que "Inicio" vuelva a la sesión.
   - Una sesión sin actividades se muestra como "en preparación".
   Para agregar una actividad a una sesión, agregue una línea a su lista "actividades".
   ============================================================ */
var SESIONES = [
  {n:1, titulo:"¿Por qué existe RAMS?", tema:"Las cuatro dimensiones de RAMS, la falla segura y la regla de prioridad.",
   actividades:[
     {titulo:"Las letras de RAMS y conceptos clave", descripcion:"Relacione cada letra con su significado y repase los conceptos básicos.", href:"ramas/teoria/index.html?ver=letras-rams,conceptos"}
   ]},
  {n:2, titulo:"Los minutos que cuestan", tema:"Vida de una falla, perturbaciones del servicio, disponibilidad y papel de cada rol.",
   actividades:[
     {titulo:"La misma falla, tres respuestas", descripcion:"Tren detenido por falla de tracción: cada decisión suma o ahorra minutos, y el contrato cuenta desde el reporte.", href:"ramas/casos-seguridad/index.html?ver=cco-traccion,cot-traccion,aux-traccion"},
     {titulo:"Detective de fallas", descripcion:"Busque la falla que se repite en dos semanas de reportes.", href:"ramas/detective/index.html"}
   ]},
  {n:3, titulo:"Las barreras invisibles", tema:"Peligro, riesgo, barreras de seguridad, modos degradados y factores humanos.",
   actividades:[
     {titulo:"Casos de barreras y modos degradados", descripcion:"Puertas, interfono de emergencia, tren no comunicante y objeto en la vía: decida sin saltarse las barreras.", href:"ramas/casos-seguridad/index.html?ver=cco-puerta,cco-pei,cot-estado-puerta,cot-no-comunicante,aux-pdap,aux-via"}
   ]},
  {n:4, titulo:"Del papel al riel", tema:"Ciclo de vida, verificación y validación, y demostración de la seguridad.",
   actividades:[
     {titulo:"Ciclo de vida en V", descripcion:"Ubique cada fase del ciclo de vida del sistema ferroviario.", href:"ramas/teoria/index.html?ver=ciclo-v"}
   ]},
  {n:5, titulo:"Después del reporte", tema:"Reporte de fallas y cuasi-incidentes, ciclo de mejora y control de cambios.",
   actividades:[
     {titulo:"Taller de reporte", descripcion:"Diligencie el reporte de una falla de su turno y vea qué puede hacer mantenimiento con él.", href:"ramas/taller-reporte/index.html"}
   ]},
  {n:6, titulo:"Caso integrador y evaluación", tema:"Simulador de casos de la especialidad, caso integrador y evaluación final.",
   actividades:[
     {titulo:"Simulador de casos", descripcion:"Resuelva los casos de su especialidad y cierre cada uno con su registro.", href:"ramas/casos-seguridad/index.html"}
   ]}
];

/* Material complementario: aparece debajo de las sesiones. */
var COMPLEMENTARIO = [
  {titulo:"Indicadores RAM", descripcion:"MTBF, MTTR, tasa de fallas y disponibilidad.", href:"ramas/teoria/index.html?ver=indicadores"},
  {titulo:"Reportes de falla (FRACAS)", descripcion:"Pasos del ciclo FRACAS y un reporte para corregir. Nivel de análisis.", href:"ramas/fracas/index.html"}
];
