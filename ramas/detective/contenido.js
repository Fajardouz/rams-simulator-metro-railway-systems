"use strict";
/* ============================================================
   RAMA: DETECTIVE DE FALLAS (Sesión 2 · Los minutos que cuestan)
   Este es el único archivo que hay que editar para alimentar esta rama.

   Recorrido del participante:
   1. Caso 1 (para todas las especialidades): los mismos eventos se ven dos veces.
      Ronda 1 con reportes incompletos (campo r1) y ronda 2 con datos completos.
   2. Caso 2 (uno por especialidad): un patrón más escondido y un "señuelo",
      un equipo que aparece mucho pero que no es la prioridad.
   3. Reporte para mantenimiento: con lo que encontró en el caso 2.

   Formato de cada caso (CASOS):
   - id, rol (null = todas las especialidades; "cco" | "cot" | "aux"), titulo, intro
   - columnas: [{k:"campo", n:"Encabezado"}]   columnas de la tabla, en orden
   - filtros:  ["campo", ...]                  "franja" se calcula sola con la hora
   - contar:   [{n:"Texto del botón", ks:["campo", ...]}]   formas de contar eventos
   - registros: [{fecha, hora, ...campos de las columnas}]
   - ronda1 (opcional): {pregunta, ops:[{t, q:"best"|"ok"|"bad", fb}]}; cada registro necesita r1
   - preguntas: [{texto, ops:[{t, ok:true|false}], fb}]   las opciones se muestran al azar
   - reporte (opcional): {intro, campos:[{n:"Dato", ops:[...], ok:"opción correcta", fb:"por qué"}]}
   Todos los datos son HIPOTÉTICOS, con fines de formación.
   ============================================================ */
var DETECTIVE = {
  titulo: "Detective de fallas",
  actividad: "Detective de fallas",
  descripcion: "Una falla que se repite es una señal. Busque el patrón en los reportes de dos semanas, separe lo urgente de lo que solo aparece mucho y escriba el reporte para mantenimiento.",
  leccion: "Los mismos eventos, con datos o sin datos, cuentan historias distintas. Lo que más se repite no siempre es lo más grave, y una falla que reportan personas distintas en el mismo lugar puede estar en la infraestructura. Solo se ve si cada reporte dice qué, dónde, cuándo y qué se observó.",

  ROLES: {
    cco: {nombre:"Controlador CCO", desc:"Revisará las alarmas de la línea."},
    cot: {nombre:"Conductor a bordo", desc:"Revisará los reportes de los conductores."},
    aux: {nombre:"Auxiliar de estación", desc:"Revisará los reportes de equipos de estación."}
  },

  FRANJAS: [
    {nombre:"Hora punta mañana (05:00 a 09:00)", desde:"05:00", hasta:"08:59"},
    {nombre:"Hora valle (09:00 a 17:00)", desde:"09:00", hasta:"16:59"},
    {nombre:"Hora punta tarde (17:00 a 20:00)", desde:"17:00", hasta:"19:59"},
    {nombre:"Noche (20:00 en adelante)", desde:"20:00", hasta:"23:59"},
    {nombre:"Madrugada (00:00 a 05:00)", desde:"00:00", hasta:"04:59"}
  ],

  CASOS: [

  /* ---------- CASO 1 · todas las especialidades ---------- */
  {id:"comun-pdap", rol:null, titulo:"Caso 1 · Las puertas de la mañana",
   intro:"Usted va a revisar los reportes de fallas de equipos de estación de dos semanas. En la ronda 1 los verá tal como llegaron. En la ronda 2 verá los mismos eventos con datos completos.",
   columnas:[{k:"fecha",n:"Fecha"},{k:"hora",n:"Hora"},{k:"estacion",n:"Estación"},{k:"equipo",n:"Equipo"},{k:"ubic",n:"Ubicación"},{k:"obs",n:"Lo que se observó"},{k:"accion",n:"Qué se hizo"},{k:"efecto",n:"Efecto"}],
   filtros:["estacion","equipo","franja"],
   contar:[{n:"Contar por equipo y estación", ks:["equipo","estacion"]},{n:"Contar por franja horaria", ks:["franja"]}],
   registros: [
    {fecha:"2027/03/01", hora:"07:34", estacion:"E04", equipo:"PDAP 3", ubic:"Andén vía 1", obs:"No cerró en el primer ciclo; cerró al segundo intento.", accion:"Ninguna; se normalizó sola.", efecto:"Tren retenido 1 min.", r1:"Una puerta falló en la mañana. Ya funciona."},
    {fecha:"2027/03/01", hora:"11:10", estacion:"E02", equipo:"BCA 2", ubic:"Acceso norte", obs:"Rechazó una tarjeta válida.", accion:"Se pidió al pasajero usar otro BCA.", efecto:"Ninguno.", r1:"Un torniquete no dejó pasar a alguien."},
    {fecha:"2027/03/02", hora:"07:52", estacion:"E04", equipo:"PDAP 3", ubic:"Andén vía 1", obs:"No cerró; alarma de obstáculo sin obstáculo visible.", accion:"Se reabrió y cerró desde el pupitre local.", efecto:"Tren retenido 2 min.", r1:"Problema con puertas en hora punta."},
    {fecha:"2027/03/02", hora:"15:30", estacion:"E07", equipo:"Escalera 1", ubic:"Vestíbulo a andén vía 2", obs:"Se detuvo; un pasajero activó la parada de emergencia.", accion:"Se verificó y se rearmó según procedimiento.", efecto:"Ninguno.", r1:"Se paró una escalera."},
    {fecha:"2027/03/03", hora:"18:05", estacion:"E09", equipo:"PDAP 7", ubic:"Andén vía 2", obs:"Pasajero bloqueó la puerta con una maleta.", accion:"Se retiró la maleta e informó al pasajero.", efecto:"Tren retenido 1 min.", r1:"Puerta bloqueada en la tarde."},
    {fecha:"2027/03/04", hora:"07:41", estacion:"E04", equipo:"PDAP 3", ubic:"Andén vía 1", obs:"No cerró en el primer ciclo; vibración fuerte al paso del tren.", accion:"Cerró al segundo intento.", efecto:"Tren retenido 1 min.", r1:"Falló una puerta. Ya está bien."},
    {fecha:"2027/03/04", hora:"12:20", estacion:"E02", equipo:"Ascensor 1", ubic:"Calle a vestíbulo", obs:"Puerta de cabina lenta al cerrar.", accion:"Se reportó a mantenimiento.", efecto:"Ninguno.", r1:"El ascensor está raro."},
    {fecha:"2027/03/05", hora:"19:15", estacion:"E01", equipo:"BCA 5", ubic:"Acceso sur", obs:"Pantalla apagada.", accion:"Se aisló el BCA.", efecto:"Ninguno.", r1:"Torniquete apagado."},
    {fecha:"2027/03/08", hora:"08:03", estacion:"E04", equipo:"PDAP 3", ubic:"Andén vía 1", obs:"No cerró en dos ciclos; alarma en CCO.", accion:"Se aisló según procedimiento.", efecto:"Tren retenido 3 min.", r1:"Puerta aislada en la mañana."},
    {fecha:"2027/03/08", hora:"10:45", estacion:"E05", equipo:"PDAP 1", ubic:"Andén vía 2", obs:"Prueba de mantenimiento programada.", accion:"Ninguna.", efecto:"Ninguno.", r1:"Movimiento de puertas."},
    {fecha:"2027/03/09", hora:"17:40", estacion:"E07", equipo:"Escalera 1", ubic:"Vestíbulo a andén vía 2", obs:"Ruido metálico al subir.", accion:"Se reportó a mantenimiento.", efecto:"Ninguno.", r1:"Escalera con ruido."},
    {fecha:"2027/03/09", hora:"07:29", estacion:"E04", equipo:"PDAP 3", ubic:"Andén vía 1", obs:"No cerró en el primer ciclo; luego cerró.", accion:"Ninguna.", efecto:"Tren retenido 1 min.", r1:"Otra vez la puerta."},
    {fecha:"2027/03/10", hora:"13:05", estacion:"E03", equipo:"BCA 1", ubic:"Acceso norte", obs:"Rechazó varias tarjetas seguidas.", accion:"Se reinició según procedimiento.", efecto:"Fila de 5 min.", r1:"Problema con tarjetas."},
    {fecha:"2027/03/10", hora:"20:30", estacion:"E09", equipo:"PDAP 7", ubic:"Andén vía 2", obs:"Pasajero sostuvo la puerta.", accion:"Se informó al pasajero.", efecto:"Ninguno.", r1:"Puerta abierta en la noche."},
    {fecha:"2027/03/11", hora:"07:48", estacion:"E04", equipo:"PDAP 3", ubic:"Andén vía 1", obs:"No cerró; alarma de obstáculo sin obstáculo visible.", accion:"Se aisló según procedimiento.", efecto:"Tren retenido 2 min.", r1:"Puerta con alarma."},
    {fecha:"2027/03/11", hora:"16:10", estacion:"E06", equipo:"Ascensor 2", ubic:"Vestíbulo a andén vía 1", obs:"Se detuvo entre pisos; sin pasajeros.", accion:"Se reportó a mantenimiento.", efecto:"Ninguno.", r1:"El ascensor se paró."},
    {fecha:"2027/03/12", hora:"18:22", estacion:"E02", equipo:"BCA 2", ubic:"Acceso norte", obs:"Rechazó una tarjeta con saldo.", accion:"El pasajero usó otro BCA.", efecto:"Ninguno.", r1:"Torniquete no dejó pasar."},
    {fecha:"2027/03/12", hora:"09:40", estacion:"E08", equipo:"Escalera 2", ubic:"Calle a vestíbulo", obs:"Se detuvo por un objeto atascado.", accion:"Se retiró el objeto y se rearmó según procedimiento.", efecto:"Ninguno.", r1:"Escalera detenida."},
    {fecha:"2027/03/15", hora:"21:05", estacion:"E01", equipo:"PDAP 2", ubic:"Andén vía 1", obs:"Luz de estado intermitente.", accion:"Se reportó a mantenimiento.", efecto:"Ninguno.", r1:"Luz rara en una puerta."},
    {fecha:"2027/03/16", hora:"14:35", estacion:"E05", equipo:"BCA 3", ubic:"Acceso sur", obs:"Atasco de tarjeta.", accion:"Se retiró la tarjeta.", efecto:"Ninguno.", r1:"Tarjeta atascada."}
  ],
   ronda1:{
     pregunta:"Con estos reportes, ¿puede identificar una falla que se repite y saber dónde revisar?",
     ops:[
       {t:"Sí: hay un problema con las puertas en la mañana.", q:"ok", fb:"Se intuye algo, pero ¿cuál puerta?, ¿en qué estación? Con esa información mantenimiento no sabe a dónde ir."},
       {t:"Sí: los torniquetes de toda la línea están fallando.", q:"bad", fb:"No hay datos para afirmarlo: algunos reportes ni siquiera dicen qué equipo o en qué estación."},
       {t:"No se puede saber: faltan el equipo exacto, la estación, la ubicación y la hora.", q:"best", fb:"Exacto. Hay pistas sueltas, pero sin datos no se pueden juntar los eventos para encontrar un patrón."}
     ]},
   preguntas:[
     {texto:"¿Qué falla se repite?",
      ops:[{t:"La PDAP 3 del andén vía 1 en la Estación E04.", ok:true},{t:"El BCA 2 de la Estación E02.", ok:false},{t:"La escalera 1 de la Estación E07.", ok:false},{t:"Ninguna: las fallas están repartidas al azar.", ok:false}],
      fb:"La PDAP 3 de E04 aparece en 6 de los 20 registros. Ningún otro equipo se repite tanto."},
     {texto:"¿Qué tienen en común esos eventos?",
      ops:[{t:"Todos ocurren en hora punta de la mañana y la puerta no cierra en el primer ciclo.", ok:true},{t:"Todos ocurren en la noche, después del cierre.", ok:false},{t:"Todos ocurren después de una prueba de mantenimiento.", ok:false},{t:"Todos los reportó la misma persona.", ok:false}],
      fb:"Todos los eventos de la PDAP 3 ocurren entre las 07:29 y las 08:03, con el mismo síntoma. Varios mencionan vibración o alarma de obstáculo sin un obstáculo visible."},
     {texto:"¿Por qué en la ronda 1 no se veía el patrón?",
      ops:[{t:"Porque a los reportes les faltaban el equipo, la estación, la ubicación y la hora.", ok:true},{t:"Porque había muy pocos reportes.", ok:false},{t:"Porque los reportes eran falsos.", ok:false},{t:"Porque el patrón no existía en la ronda 1.", ok:false}],
      fb:"Eran los mismos 20 eventos. La diferencia fue la calidad de los reportes."}
   ]},

  /* ---------- CASO 2 · CONDUCTORES ---------- */
  {id:"cot-tramo", rol:"cot", titulo:"Caso 2 · Lo que sienten los conductores",
   intro:"Estos son los reportes de los conductores de las últimas dos semanas. Hay una falla que es más importante que las demás, pero no es la que más aparece.",
   columnas:[{k:"fecha",n:"Fecha"},{k:"hora",n:"Hora"},{k:"tren",n:"Tren"},{k:"lugar",n:"Dónde"},{k:"sistema",n:"Sistema"},{k:"obs",n:"Lo que se observó"},{k:"efecto",n:"Efecto"}],
   filtros:["tren","lugar","sistema","franja"],
   contar:[{n:"Contar por tren", ks:["tren"]},{n:"Contar por sistema", ks:["sistema"]},{n:"Contar por lugar", ks:["lugar"]}],
   registros:[
    {fecha:"2027/03/01", hora:"08:15", tren:"Tren 112", lugar:"E02 · vía 1", sistema:"Aire acondicionado", obs:"Coche 2 caliente; los pasajeros se quejan.", efecto:"Ninguno en la circulación."},
    {fecha:"2027/03/01", hora:"16:40", tren:"Tren 106", lugar:"E03 · vía 2", sistema:"Puertas", obs:"Una puerta del coche 1 tardó en cerrar; cerró al segundo intento.", efecto:"Retraso de 1 min."},
    {fecha:"2027/03/02", hora:"06:40", tren:"Tren 104", lugar:"Entre E07 y E08 · vía 1", sistema:"Marcha", obs:"Golpe fuerte bajo el tren al pasar por el tramo.", efecto:"Ninguno; el tren siguió normal."},
    {fecha:"2027/03/02", hora:"13:05", tren:"Tren 112", lugar:"E09 · vía 2", sistema:"Aire acondicionado", obs:"Coche 2 sin enfriar.", efecto:"Ninguno en la circulación."},
    {fecha:"2027/03/03", hora:"09:30", tren:"Tren 103", lugar:"E05 · vía 1", sistema:"Frenos", obs:"Aviso de freno que se borró en segundos.", efecto:"Ninguno."},
    {fecha:"2027/03/03", hora:"19:10", tren:"Tren 112", lugar:"E06 · vía 1", sistema:"Aire acondicionado", obs:"Coche 2 caliente en hora punta.", efecto:"Ninguno en la circulación."},
    {fecha:"2027/03/04", hora:"07:20", tren:"Tren 110", lugar:"E09 · vía 2", sistema:"Puertas", obs:"Indicador de puertas tardó en confirmar.", efecto:"Retraso de 40 s."},
    {fecha:"2027/03/05", hora:"14:12", tren:"Tren 109", lugar:"Entre E07 y E08 · vía 1", sistema:"Marcha", obs:"Sacudida lateral fuerte al pasar.", efecto:"Ninguno; el tren siguió normal."},
    {fecha:"2027/03/05", hora:"17:45", tren:"Tren 112", lugar:"E01 · vía 2", sistema:"Aire acondicionado", obs:"Coche 2 sin enfriar; quejas por interfono.", efecto:"Ninguno en la circulación."},
    {fecha:"2027/03/06", hora:"11:00", tren:"Tren 107", lugar:"E04 · vía 1", sistema:"Iluminación", obs:"Dos luces apagadas en el coche 3.", efecto:"Ninguno."},
    {fecha:"2027/03/07", hora:"10:25", tren:"Tren 112", lugar:"E08 · vía 2", sistema:"Aire acondicionado", obs:"Coche 2 caliente.", efecto:"Ninguno en la circulación."},
    {fecha:"2027/03/08", hora:"08:05", tren:"Tren 104", lugar:"E10 · vía 1", sistema:"Comunicaciones", obs:"Ruido en la radio durante unos segundos.", efecto:"Ninguno."},
    {fecha:"2027/03/09", hora:"07:55", tren:"Tren 115", lugar:"Entre E07 y E08 · vía 1", sistema:"Marcha", obs:"Ruido metálico y golpe fuerte al pasar.", efecto:"Ninguno; el tren siguió normal."},
    {fecha:"2027/03/09", hora:"15:20", tren:"Tren 112", lugar:"E03 · vía 1", sistema:"Aire acondicionado", obs:"Coche 2 sin enfriar.", efecto:"Ninguno en la circulación."},
    {fecha:"2027/03/10", hora:"18:20", tren:"Tren 102", lugar:"Entre E07 y E08 · vía 1", sistema:"Marcha", obs:"Golpe fuerte; un pasajero de pie perdió el equilibrio, sin lesiones.", efecto:"Ninguno; el tren siguió normal."},
    {fecha:"2027/03/11", hora:"12:40", tren:"Tren 101", lugar:"E06 · vía 2", sistema:"Puertas", obs:"Una puerta reabrió por detección de obstáculo; había una mochila.", efecto:"Retraso de 30 s."},
    {fecha:"2027/03/11", hora:"20:15", tren:"Tren 112", lugar:"E05 · vía 2", sistema:"Aire acondicionado", obs:"Coche 2 caliente.", efecto:"Ninguno en la circulación."},
    {fecha:"2027/03/12", hora:"10:05", tren:"Tren 108", lugar:"Entre E07 y E08 · vía 1", sistema:"Marcha", obs:"Sacudida fuerte, más que la semana pasada.", efecto:"Ninguno; el tren siguió normal."},
    {fecha:"2027/03/12", hora:"16:55", tren:"Tren 113", lugar:"E11 · vía 1", sistema:"Frenos", obs:"Frenado algo brusco al llegar a la estación.", efecto:"Ninguno."},
    {fecha:"2027/03/13", hora:"21:30", tren:"Tren 111", lugar:"Entre E07 y E08 · vía 1", sistema:"Marcha", obs:"Golpe fuerte y ruido metálico al pasar.", efecto:"Ninguno; el tren siguió normal."},
    {fecha:"2027/03/14", hora:"09:50", tren:"Tren 105", lugar:"E02 · vía 2", sistema:"Iluminación", obs:"Luz de cabina parpadea.", efecto:"Ninguno."},
    {fecha:"2027/03/14", hora:"14:35", tren:"Tren 112", lugar:"E07 · vía 1", sistema:"Aire acondicionado", obs:"Coche 2 sin enfriar.", efecto:"Ninguno en la circulación."}
   ],
   preguntas:[
     {texto:"¿Cuál es la falla más importante de estas dos semanas?",
      ops:[{t:"El golpe o sacudida fuerte entre E07 y E08, vía 1, que reportan varios trenes.", ok:true},{t:"El aire acondicionado del Tren 112, porque es lo que más se repite.", ok:false},{t:"Las puertas, porque aparecen en varios trenes.", ok:false},{t:"Ninguna: ningún evento afectó la circulación.", ok:false}],
      fb:"El aire del Tren 112 aparece 8 veces, pero afecta la comodidad. El golpe aparece 6 veces, en el mismo tramo, y puede ser un problema de seguridad: en uno de los eventos un pasajero perdió el equilibrio."},
     {texto:"Si al contar por tren cada tren reporta el golpe una sola vez, ¿por qué es un patrón?",
      ops:[{t:"Porque seis trenes distintos sienten lo mismo en el mismo lugar: lo más probable es que el problema esté en la vía, no en los trenes.", ok:true},{t:"No es un patrón: cada tren lo vivió solo una vez.", ok:false},{t:"Porque todos los trenes tienen el mismo defecto.", ok:false},{t:"Porque los conductores se pusieron de acuerdo.", ok:false}],
      fb:"Contar por tren lo esconde; contar por lugar lo muestra. Cuando trenes distintos reportan lo mismo en el mismo punto, la pista apunta a la infraestructura."},
     {texto:"¿Qué dicen las fechas de esos eventos?",
      ops:[{t:"Que se está agravando: 2 eventos la primera semana y 4 la segunda, y un conductor dice que es más fuerte que antes.", ok:true},{t:"Que está mejorando.", ok:false},{t:"Que solo pasa en hora punta.", ok:false},{t:"Nada: las fechas no importan.", ok:false}],
      fb:"Cada vez es más frecuente y más fuerte. Una falla que se agrava hay que atenderla antes de que se convierta en un incidente."},
     {texto:"Como conductor, ¿qué hace la próxima vez que sienta el golpe en ese tramo?",
      ops:[{t:"Reportarlo al CCO con tren, tramo, vía, hora y lo que sintió, aunque el tren siga normal.", ok:true},{t:"No reportarlo: ya lo reportaron otros.", ok:false},{t:"Reducir la velocidad en ese tramo por su cuenta, sin avisar.", ok:false},{t:"Reportarlo solo si el tren se detiene.", ok:false}],
      fb:"Cada reporte suma evidencia y muestra que el problema sigue. Cualquier restricción de velocidad la decide el CCO, no cada conductor por su cuenta."}
   ],
   reporte:{intro:"Con lo que encontró, arme el reporte que le enviaría a mantenimiento sobre la falla más importante.",
    campos:[
     {n:"Dónde", ops:["Entre E07 y E08 · vía 1","Tren 112","Entre E07 y E08 · vía 2","En toda la línea"], ok:"Entre E07 y E08 · vía 1", fb:"El lugar es la clave: es lo único que tienen en común los seis eventos."},
     {n:"Qué se repite", ops:["Golpe o sacudida fuerte al pasar","Aire acondicionado sin enfriar","Puertas que tardan en cerrar","Frenado brusco"], ok:"Golpe o sacudida fuerte al pasar", fb:"Es el síntoma que describen los seis conductores."},
     {n:"Quién lo reporta", ops:["Seis trenes distintos","Siempre el mismo tren","Un solo conductor","Solo los pasajeros"], ok:"Seis trenes distintos", fb:"Que sean trenes distintos es lo que apunta a la vía."},
     {n:"Tendencia", ops:["Aumenta: 2 eventos la primera semana y 4 la segunda","Disminuye","Se mantiene igual","Pasó una sola vez"], ok:"Aumenta: 2 eventos la primera semana y 4 la segunda", fb:"La tendencia define la urgencia."},
     {n:"Qué pide revisar", ops:["Inspeccionar la vía en ese tramo con prioridad","Revisar los seis trenes en el taller","Arreglar primero el aire del Tren 112","Esperar a que haya un incidente"], ok:"Inspeccionar la vía en ese tramo con prioridad", fb:"Seis trenes distintos en el mismo tramo apuntan a la vía, no a los trenes. El aire del 112 también se reporta, pero con menor prioridad."}
    ]}
  },

  /* ---------- CASO 2 · CCO ---------- */
  {id:"cco-comunicacion", rol:"cco", titulo:"Caso 2 · Las alarmas de la línea",
   intro:"Estas son las alarmas que atendió el CCO en las últimas dos semanas. Hay una falla que es más importante que las demás, pero no es la que más aparece.",
   columnas:[{k:"fecha",n:"Fecha"},{k:"hora",n:"Hora"},{k:"alarma",n:"Alarma"},{k:"tren",n:"Tren"},{k:"lugar",n:"Dónde"},{k:"accion",n:"Qué se hizo"},{k:"efecto",n:"Efecto"}],
   filtros:["alarma","tren","lugar","franja"],
   contar:[{n:"Contar por alarma", ks:["alarma"]},{n:"Contar por tren", ks:["tren"]},{n:"Contar por lugar", ks:["lugar"]}],
   registros:[
    {fecha:"2027/03/01", hora:"01:10", alarma:"Puerta de cuarto técnico abierta", tren:"—", lugar:"E05 · cuarto técnico", accion:"Se confirmó con mantenimiento: trabajo programado autorizado.", efecto:"Ninguno."},
    {fecha:"2027/03/01", hora:"07:48", alarma:"PDAP abierta", tren:"Tren 106", lugar:"E04 · vía 1", accion:"Se normalizó al segundo ciclo.", efecto:"Tren retenido 1 min."},
    {fecha:"2027/03/02", hora:"06:35", alarma:"Tren no comunicante", tren:"Tren 109", lugar:"Entre E10 y E11 · vía 2", accion:"La comunicación volvió en 20 s; el tren continuó.", efecto:"Tren detenido 1 min."},
    {fecha:"2027/03/02", hora:"23:40", alarma:"Puerta de cuarto técnico abierta", tren:"—", lugar:"E05 · cuarto técnico", accion:"Se confirmó con mantenimiento: trabajo programado autorizado.", efecto:"Ninguno."},
    {fecha:"2027/03/03", hora:"12:15", alarma:"Interfono de estación", tren:"—", lugar:"E09 · vestíbulo", accion:"Pasajero pidió información; se atendió.", efecto:"Ninguno."},
    {fecha:"2027/03/04", hora:"00:55", alarma:"Puerta de cuarto técnico abierta", tren:"—", lugar:"E05 · cuarto técnico", accion:"Se confirmó con mantenimiento: trabajo programado autorizado.", efecto:"Ninguno."},
    {fecha:"2027/03/04", hora:"18:30", alarma:"Falla de puerta del tren", tren:"Tren 108", lugar:"E03 · vía 2", accion:"El conductor cerró al segundo intento.", efecto:"Retraso de 1 min."},
    {fecha:"2027/03/05", hora:"15:05", alarma:"Tren no comunicante", tren:"Tren 103", lugar:"Entre E10 y E11 · vía 2", accion:"La comunicación volvió en 25 s; el tren continuó.", efecto:"Tren detenido 1 min."},
    {fecha:"2027/03/05", hora:"23:50", alarma:"Puerta de cuarto técnico abierta", tren:"—", lugar:"E05 · cuarto técnico", accion:"Se confirmó con mantenimiento: trabajo programado autorizado.", efecto:"Ninguno."},
    {fecha:"2027/03/06", hora:"10:40", alarma:"Escalera detenida", tren:"—", lugar:"E07 · vestíbulo", accion:"Parada de emergencia activada por un pasajero; se rearmó.", efecto:"Ninguno."},
    {fecha:"2027/03/07", hora:"01:30", alarma:"Puerta de cuarto técnico abierta", tren:"—", lugar:"E05 · cuarto técnico", accion:"Se confirmó con mantenimiento: trabajo programado autorizado.", efecto:"Ninguno."},
    {fecha:"2027/03/08", hora:"16:20", alarma:"Detector de humo", tren:"—", lugar:"E02 · andén vía 1", accion:"Se verificó en sitio: polvo por limpieza. Sin fuego.", efecto:"Ninguno."},
    {fecha:"2027/03/09", hora:"07:50", alarma:"Tren no comunicante", tren:"Tren 115", lugar:"Entre E10 y E11 · vía 2", accion:"La comunicación volvió en 30 s; el tren continuó.", efecto:"Tren detenido 2 min."},
    {fecha:"2027/03/09", hora:"23:35", alarma:"Puerta de cuarto técnico abierta", tren:"—", lugar:"E05 · cuarto técnico", accion:"Se confirmó con mantenimiento: trabajo programado autorizado.", efecto:"Ninguno."},
    {fecha:"2027/03/10", hora:"17:55", alarma:"Tren no comunicante", tren:"Tren 102", lugar:"Entre E10 y E11 · vía 2", accion:"La comunicación volvió en 40 s; el tren continuó.", efecto:"Tren detenido 2 min."},
    {fecha:"2027/03/11", hora:"09:15", alarma:"PDAP abierta", tren:"Tren 101", lugar:"E06 · vía 1", accion:"Un pasajero sostuvo la puerta; se normalizó.", efecto:"Tren retenido 30 s."},
    {fecha:"2027/03/11", hora:"01:05", alarma:"Puerta de cuarto técnico abierta", tren:"—", lugar:"E05 · cuarto técnico", accion:"Se confirmó con mantenimiento: trabajo programado autorizado.", efecto:"Ninguno."},
    {fecha:"2027/03/12", hora:"11:25", alarma:"Tren no comunicante", tren:"Tren 108", lugar:"Entre E10 y E11 · vía 2", accion:"La comunicación volvió en 45 s; el tren continuó.", efecto:"Tren detenido 2 min."},
    {fecha:"2027/03/12", hora:"14:00", alarma:"Interfono de tren", tren:"Tren 113", lugar:"E08 · vía 1", accion:"Pasajero indispuesto; atendido en E08 por el personal de estación.", efecto:"Tren retenido 3 min."},
    {fecha:"2027/03/13", hora:"20:45", alarma:"Tren no comunicante", tren:"Tren 111", lugar:"Entre E10 y E11 · vía 2", accion:"La comunicación volvió en 50 s; el tren continuó.", efecto:"Tren detenido 2 min."},
    {fecha:"2027/03/14", hora:"00:40", alarma:"Puerta de cuarto técnico abierta", tren:"—", lugar:"E05 · cuarto técnico", accion:"Se confirmó con mantenimiento: trabajo programado autorizado.", efecto:"Ninguno."}
   ],
   preguntas:[
     {texto:"¿Cuál es la falla más importante de estas dos semanas?",
      ops:[{t:"Los trenes que pierden comunicación entre E10 y E11, vía 2.", ok:true},{t:"La puerta del cuarto técnico de E05, porque es la alarma que más se repite.", ok:false},{t:"Las PDAP, porque aparecen en varias estaciones.", ok:false},{t:"Ninguna: todas se normalizaron solas.", ok:false}],
      fb:"La alarma del cuarto técnico aparece 8 veces, pero en todos los casos se confirmó un trabajo programado autorizado. La pérdida de comunicación aparece 6 veces, siempre en el mismo tramo, y detiene trenes."},
     {texto:"Seis trenes distintos pierden comunicación, cada uno una vez. ¿Qué sugiere eso?",
      ops:[{t:"Que el problema probablemente está en los equipos de comunicación de la vía en ese tramo, no en los trenes.", ok:true},{t:"Que los seis trenes tienen la radio dañada.", ok:false},{t:"Que no es un patrón, porque cada tren falló solo una vez.", ok:false},{t:"Que los conductores operan mal.", ok:false}],
      fb:"Contar por tren lo esconde; contar por lugar lo muestra. Lo que comparten los seis eventos es el tramo."},
     {texto:"¿Qué dicen la duración y las fechas de esos eventos?",
      ops:[{t:"Que se está agravando: la comunicación tarda cada vez más en volver (de 20 a 50 segundos) y los eventos son más frecuentes.", ok:true},{t:"Que está mejorando.", ok:false},{t:"Que solo pasa de noche.", ok:false},{t:"Nada: duran menos de un minuto.", ok:false}],
      fb:"Una falla que dura cada vez más y aparece más seguido hay que atenderla antes de que deje un tren detenido mucho tiempo."},
     {texto:"¿Por qué la alarma del cuarto técnico no es la prioridad, aunque sea la que más aparece?",
      ops:[{t:"Porque en cada evento se confirmó un trabajo programado y autorizado: la alarma funcionó como debía.", ok:true},{t:"Porque ocurre de noche y de noche no importa.", ok:false},{t:"Porque las alarmas de cuartos técnicos nunca importan.", ok:false},{t:"Porque ya se acostumbraron a ella.", ok:false}],
      fb:"Lo que la explica es el registro: alguien verificó cada vez. Sin ese dato, también habría que investigarla. Acostumbrarse a una alarma nunca es una razón."}
   ],
   reporte:{intro:"Con lo que encontró, arme el reporte que le enviaría a mantenimiento sobre la falla más importante.",
    campos:[
     {n:"Dónde", ops:["Entre E10 y E11 · vía 2","E05 · cuarto técnico","Entre E10 y E11 · vía 1","En toda la línea"], ok:"Entre E10 y E11 · vía 2", fb:"El tramo es lo único que comparten los seis eventos."},
     {n:"Qué se repite", ops:["Tren no comunicante por unos segundos","Puerta de cuarto técnico abierta","PDAP abierta","Detector de humo"], ok:"Tren no comunicante por unos segundos", fb:"Es la alarma de los seis eventos."},
     {n:"Quién lo presenta", ops:["Seis trenes distintos","Siempre el mismo tren","Solo los trenes de la mañana","Ningún tren"], ok:"Seis trenes distintos", fb:"Que sean trenes distintos apunta a los equipos de la vía."},
     {n:"Tendencia", ops:["Aumenta: cada vez más seguido y la comunicación tarda más en volver","Disminuye","Se mantiene igual","Pasó una sola vez"], ok:"Aumenta: cada vez más seguido y la comunicación tarda más en volver", fb:"La tendencia define la urgencia."},
     {n:"Qué pide revisar", ops:["Revisar con prioridad los equipos de comunicación de la vía en ese tramo","Revisar las radios de los seis trenes","Desactivar la alarma del cuarto técnico","Esperar a que un tren quede detenido mucho tiempo"], ok:"Revisar con prioridad los equipos de comunicación de la vía en ese tramo", fb:"El patrón apunta al tramo. Desactivar una alarma sería un cambio sin control."}
    ]}
  },

  /* ---------- CASO 2 · ESTACIÓN ---------- */
  {id:"aux-escalera", rol:"aux", titulo:"Caso 2 · Los equipos de la estación",
   intro:"Estos son los reportes de equipos de estación de las últimas dos semanas. Hay una falla que es más importante que las demás, pero no es la que más aparece. Pista: la hora también es un dato.",
   columnas:[{k:"fecha",n:"Fecha"},{k:"hora",n:"Hora"},{k:"estacion",n:"Estación"},{k:"equipo",n:"Equipo"},{k:"obs",n:"Lo que se observó"},{k:"accion",n:"Qué se hizo"},{k:"efecto",n:"Efecto"}],
   filtros:["estacion","equipo","franja"],
   contar:[{n:"Contar por equipo y estación", ks:["equipo","estacion"]},{n:"Contar por franja horaria", ks:["franja"]},{n:"Contar por equipo y franja", ks:["equipo","estacion","franja"]}],
   registros:[
    {fecha:"2027/03/01", hora:"07:10", estacion:"E02", equipo:"BCA 4", obs:"Rechazó la tarjeta de un pasajero.", accion:"En taquilla: la tarjeta no tenía saldo.", efecto:"Ninguno."},
    {fecha:"2027/03/01", hora:"17:35", estacion:"E06", equipo:"Escalera 3", obs:"Se detuvo sola en subida, con mucha gente.", accion:"Se señalizó; mantenimiento la puso en marcha 40 min después.", efecto:"Escalera fuera de servicio 40 min."},
    {fecha:"2027/03/02", hora:"10:20", estacion:"E02", equipo:"BCA 4", obs:"No leyó una tarjeta.", accion:"En taquilla: tarjeta dañada.", efecto:"Ninguno."},
    {fecha:"2027/03/02", hora:"14:05", estacion:"E08", equipo:"Ascensor 1", obs:"Puerta tardó en cerrar.", accion:"Cerró al segundo intento.", efecto:"Ninguno."},
    {fecha:"2027/03/03", hora:"08:45", estacion:"E02", equipo:"BCA 4", obs:"Rechazó la tarjeta de un pasajero.", accion:"En taquilla: la tarjeta no tenía saldo.", efecto:"Ninguno."},
    {fecha:"2027/03/03", hora:"12:30", estacion:"E06", equipo:"Escalera 1", obs:"Un pasajero activó la parada de emergencia.", accion:"Se verificó y se rearmó según procedimiento.", efecto:"Ninguno."},
    {fecha:"2027/03/04", hora:"18:10", estacion:"E06", equipo:"Escalera 3", obs:"Se detuvo sola en subida; olor a caliente cerca del rellano superior.", accion:"Se señalizó; mantenimiento la puso en marcha al día siguiente.", efecto:"Escalera fuera de servicio hasta el cierre."},
    {fecha:"2027/03/04", hora:"16:15", estacion:"E02", equipo:"BCA 4", obs:"Rechazó una tarjeta.", accion:"En taquilla: tarjeta de otro sistema.", efecto:"Ninguno."},
    {fecha:"2027/03/05", hora:"09:40", estacion:"E09", equipo:"PDAP 2", obs:"No cerró al primer ciclo.", accion:"Se normalizó sola.", efecto:"Tren retenido 1 min."},
    {fecha:"2027/03/06", hora:"11:50", estacion:"E02", equipo:"BCA 4", obs:"No leyó una tarjeta.", accion:"En taquilla: la tarjeta no tenía saldo.", efecto:"Ninguno."},
    {fecha:"2027/03/07", hora:"17:50", estacion:"E06", equipo:"Escalera 3", obs:"Se detuvo sola en subida con pasajeros.", accion:"Se señalizó; mantenimiento la rearmó 30 min después.", efecto:"Escalera fuera de servicio 30 min."},
    {fecha:"2027/03/08", hora:"07:55", estacion:"E02", equipo:"BCA 4", obs:"Rechazó una tarjeta.", accion:"En taquilla: la tarjeta no tenía saldo.", efecto:"Ninguno."},
    {fecha:"2027/03/08", hora:"13:20", estacion:"E04", equipo:"Ascensor 2", obs:"Botón de llamada del piso 1 no responde.", accion:"Reportado a mantenimiento.", efecto:"Ascensor fuera de servicio 2 h."},
    {fecha:"2027/03/09", hora:"10:10", estacion:"E06", equipo:"Escalera 3", obs:"Funcionando normal durante la ronda.", accion:"Ninguna.", efecto:"Ninguno."},
    {fecha:"2027/03/10", hora:"18:25", estacion:"E06", equipo:"Escalera 3", obs:"Se detuvo sola en subida; los pasajeros terminaron caminando.", accion:"Se señalizó; mantenimiento la rearmó 45 min después.", efecto:"Escalera fuera de servicio 45 min."},
    {fecha:"2027/03/10", hora:"15:45", estacion:"E02", equipo:"BCA 4", obs:"No leyó una tarjeta.", accion:"En taquilla: tarjeta dañada.", efecto:"Ninguno."},
    {fecha:"2027/03/11", hora:"08:30", estacion:"E07", equipo:"BCA 1", obs:"Se bloqueó el torniquete.", accion:"Se reinició según procedimiento.", efecto:"Acceso con un BCA menos 15 min."},
    {fecha:"2027/03/12", hora:"17:20", estacion:"E06", equipo:"Escalera 3", obs:"Se detuvo sola en subida, en plena hora punta.", accion:"Se señalizó; mantenimiento la rearmó 1 h después.", efecto:"Escalera fuera de servicio 1 h."},
    {fecha:"2027/03/13", hora:"09:05", estacion:"E02", equipo:"BCA 4", obs:"Rechazó la tarjeta de un pasajero.", accion:"En taquilla: la tarjeta no tenía saldo.", efecto:"Ninguno."},
    {fecha:"2027/03/13", hora:"14:40", estacion:"E10", equipo:"Escalera 2", obs:"Ruido en el pasamanos.", accion:"Reportado a mantenimiento.", efecto:"Ninguno."},
    {fecha:"2027/03/14", hora:"18:40", estacion:"E06", equipo:"Escalera 3", obs:"Se detuvo sola en subida; olor a caliente otra vez.", accion:"Se señalizó y se dejó fuera de servicio.", efecto:"Escalera fuera de servicio hasta el cierre."}
   ],
   preguntas:[
     {texto:"¿Cuál es la falla más importante de estas dos semanas?",
      ops:[{t:"La escalera 3 de E06, que se detiene sola.", ok:true},{t:"El BCA 4 de E02, porque es lo que más se repite.", ok:false},{t:"Los ascensores, porque aparecen en varias estaciones.", ok:false},{t:"Ninguna: todos los equipos volvieron a funcionar.", ok:false}],
      fb:"El BCA 4 aparece 8 veces, pero en todos los casos el problema era la tarjeta del pasajero. La escalera 3 se detiene sola 6 veces, con pasajeros encima, y queda fuera de servicio."},
     {texto:"¿Qué tienen en común las paradas de la escalera 3?",
      ops:[{t:"Todas ocurren en hora punta de la tarde, en subida y con mucha gente; en la ronda de la mañana funcionaba normal.", ok:true},{t:"Todas ocurren en la noche.", ok:false},{t:"Todas las causó un pasajero con el botón de emergencia.", ok:false},{t:"No tienen nada en común.", ok:false}],
      fb:"Filtrar por franja lo muestra: la escalera falla cuando trabaja con más carga. Ese dato orienta a mantenimiento sobre qué revisar."},
     {texto:"¿Por qué el BCA 4 no es la prioridad, aunque sea el que más aparece?",
      ops:[{t:"Porque en cada caso se verificó en taquilla que el problema era la tarjeta: el equipo funcionó bien.", ok:true},{t:"Porque los BCA nunca fallan.", ok:false},{t:"Porque nadie se quejó.", ok:false},{t:"Porque está en otra estación.", ok:false}],
      fb:"Lo que lo explica es el registro: alguien verificó cada vez. Sin ese dato, también habría que investigarlo."},
     {texto:"Hay dos reportes de olor a caliente en la escalera 3. ¿Qué hace la próxima vez?",
      ops:[{t:"Señalizarla fuera de servicio, no ponerla en marcha y reportar el olor, la hora y el sentido de la escalera.", ok:true},{t:"Ponerla en marcha con la llave para ver si funciona.", ok:false},{t:"No mencionar el olor si no hay humo.", ok:false},{t:"Esperar a que la reporte otro compañero.", ok:false}],
      fb:"El olor es un dato que mantenimiento necesita. Una escalera con síntomas no se pone en marcha por cuenta propia."}
   ],
   reporte:{intro:"Con lo que encontró, arme el reporte que le enviaría a mantenimiento sobre la falla más importante.",
    campos:[
     {n:"Qué equipo", ops:["Escalera 3 de E06","BCA 4 de E02","Escalera 1 de E06","Ascensor 2 de E04"], ok:"Escalera 3 de E06", fb:"El equipo exacto, con su estación."},
     {n:"Qué se repite", ops:["Se detiene sola en subida, con olor a caliente dos veces","Rechaza tarjetas","Un pasajero activa la parada de emergencia","Ruido en el pasamanos"], ok:"Se detiene sola en subida, con olor a caliente dos veces", fb:"El síntoma y el detalle del olor."},
     {n:"Cuándo pasa", ops:["En hora punta de la tarde, con mucha gente","A cualquier hora","Solo en la noche","Solo en la mañana"], ok:"En hora punta de la tarde, con mucha gente", fb:"La franja horaria es la pista del caso."},
     {n:"Cuántas veces", ops:["6 veces en dos semanas","Una vez","Todos los días","No se sabe"], ok:"6 veces en dos semanas", fb:"La frecuencia define la urgencia."},
     {n:"Qué pide revisar", ops:["Revisar la escalera bajo carga, por el olor a caliente, antes de volver a ponerla en servicio","Cambiar el BCA 4","Rearmarla cada vez que se detenga","Nada, porque mantenimiento siempre la pone en marcha"], ok:"Revisar la escalera bajo carga, por el olor a caliente, antes de volver a ponerla en servicio", fb:"Rearmarla cada vez no resuelve la causa: la falla vuelve en la siguiente hora punta."}
    ]}
  }

  ]
};
