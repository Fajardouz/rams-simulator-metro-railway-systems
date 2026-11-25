"use strict";
/* ============================================================
   RAMA: DETECTIVE DE FALLAS
   Este es el único archivo que hay que editar para alimentar esta rama.

   Idea: los mismos eventos se muestran dos veces.
   - Ronda 1: solo el texto de un reporte incompleto (campo r1). Con eso no se puede encontrar el patrón.
   - Ronda 2: el mismo evento con datos completos. Filtrando y contando, el patrón aparece.

   Cada registro:
     fecha, hora (HH:MM), estacion, equipo, ubic (ubicación), obs (lo que se observó),
     accion (qué se hizo), efecto (efecto en el servicio), r1 (texto del reporte incompleto de la ronda 1).
   Las franjas horarias se calculan solas a partir de la hora (vea FRANJAS).
   Los datos son ficticios, con fines de formación.
   ============================================================ */
var DETECTIVE = {
  titulo: "Detective de fallas",
  actividad: "Detective de fallas",
  descripcion: "Una falla que se repite es una señal. Busque el patrón en los reportes y descubra por qué solo se ve cuando los reportes traen datos.",

  FRANJAS: [
    {nombre:"Hora punta mañana (06:00 a 09:00)", desde:"06:00", hasta:"08:59"},
    {nombre:"Hora valle (09:00 a 17:00)", desde:"09:00", hasta:"16:59"},
    {nombre:"Hora punta tarde (17:00 a 20:00)", desde:"17:00", hasta:"19:59"},
    {nombre:"Noche (20:00 en adelante)", desde:"20:00", hasta:"23:59"}
  ],

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

  ronda1: {
    pregunta: "Con estos reportes, ¿puede identificar una falla que se repite y saber dónde revisar?",
    ops: [
      {t:"Sí: hay un problema con las puertas en la mañana.", q:"ok", fb:"Se intuye algo, pero ¿cuál puerta?, ¿en qué estación? Con esa información mantenimiento no sabe a dónde ir."},
      {t:"Sí: los torniquetes de toda la línea están fallando.", q:"bad", fb:"No hay datos para afirmarlo: algunos reportes ni siquiera dicen qué equipo o en qué estación."},
      {t:"No se puede saber: faltan el equipo exacto, la estación, la ubicación y la hora.", q:"best", fb:"Exacto. Hay pistas sueltas, pero sin datos no se pueden juntar los eventos para encontrar un patrón."}
    ]
  },

  preguntas: [
    {texto:"¿Qué falla se repite?",
     ops:[{t:"La PDAP 3 del andén vía 1 en la Estación E04.", ok:true},
          {t:"El BCA 2 de la Estación E02.", ok:false},
          {t:"La escalera 1 de la Estación E07.", ok:false},
          {t:"Ninguna: las fallas están repartidas al azar.", ok:false}],
     fb:"La PDAP 3 de E04 aparece en 6 de los 20 registros. Ningún otro equipo se repite tanto."},
    {texto:"¿Qué tienen en común esos eventos?",
     ops:[{t:"Todos ocurren en hora punta de la mañana y la puerta no cierra en el primer ciclo.", ok:true},
          {t:"Todos ocurren en la noche, después del cierre.", ok:false},
          {t:"Todos ocurren después de una prueba de mantenimiento.", ok:false},
          {t:"Todos los reportó la misma persona.", ok:false}],
     fb:"Todos los eventos de la PDAP 3 ocurren entre las 07:29 y las 08:03, con el mismo síntoma. Varios mencionan vibración o alarma de obstáculo sin un obstáculo visible."},
    {texto:"¿Qué le pediría revisar a mantenimiento?",
     ops:[{t:"Analizar la PDAP 3 de E04 en hora punta: sensor de obstáculo, alineación y fijación del soporte con la vibración del paso del tren.", ok:true},
          {t:"Cambiar todas las PDAP de la línea.", ok:false},
          {t:"Nada: la puerta siempre vuelve a funcionar.", ok:false},
          {t:"Dejarla aislada de forma permanente sin avisar.", ok:false}],
     fb:"El patrón apunta a una causa en esa puerta y en esa condición. Una falla que vuelve a funcionar sola sigue siendo una falla, y aislarla sin reportar es un cambio sin control."},
    {texto:"¿Por qué en la ronda 1 no se veía el patrón?",
     ops:[{t:"Porque a los reportes les faltaban el equipo, la estación, la ubicación y la hora.", ok:true},
          {t:"Porque había muy pocos reportes.", ok:false},
          {t:"Porque los reportes eran falsos.", ok:false},
          {t:"Porque el patrón no existía en la ronda 1.", ok:false}],
     fb:"Eran los mismos 20 eventos. La diferencia fue la calidad de los reportes."}
  ],

  leccion: "Los mismos eventos, con datos o sin datos, cuentan historias distintas. Un reporte con equipo, ubicación, hora y lo que se observó permite encontrar la falla que se repite antes de que se vuelva grave."
};
