"use strict";
/* ============================================================
   RAMA: TALLER DE REPORTE (Sesión 5 · Después del reporte)
   Este es el único archivo que hay que editar para alimentar esta rama.

   El participante elige su especialidad, lee el relato de una falla y diligencia
   el reporte con los datos mínimos: cuándo, dónde, qué equipo, qué pasó, qué se hizo,
   cuánto afectó al servicio y si la falla se repite. Al final ve su reporte junto al
   reporte modelo y lo que pasó con la falla según la calidad de su reporte.

   Formato de cada relato (RELATOS):
   - id, rol ("cco" | "cot" | "aux"), titulo, resumen
   - relato: [{hora:"07:46", texto:"..."}]   lo que el participante vive, en orden
   - fecha: "aaaa/mm/dd" y hora: "hh:mm"     fecha y hora de inicio del reporte modelo
                                             (la hora se acepta con ±2 minutos)
   - ubicacion, equipo, efecto, repeticion: {ops:[...], ok:"texto exacto de la opción correcta"}
   - hechos: [{t:"...", tipo:"hecho" | "suposicion" | "irrelevante", fb:"..."}]
             hecho = algo que se vio, se oyó o alguien dijo; suposicion = diagnóstico o
             culpa sin evidencia; irrelevante = cierto, pero no sirve para analizar la falla
   - acciones: [{t:"...", ok:true | false}]  ok:true = se hizo según el relato
   - desenlaceMalo / desenlaceBueno: lo que pasa con la falla según el reporte
   - consecuencias (opcional): {campo:"texto"} para cambiar la retroalimentación por defecto
     de un campo (fecha, hora, ubicacion, equipo, hechos, acciones, efecto, repeticion)

   Todos los relatos son HIPOTÉTICOS, con fines de formación. Los pasos operativos
   siempre siguen el procedimiento vigente de cada área.
   ============================================================ */
var TALLER = {
  titulo: "Taller de reporte",
  actividad: "Taller de reporte",
  descripcion: "Lea lo que pasó en su turno, diligencie el reporte de la falla y vea qué puede hacer mantenimiento con lo que usted escribió.",
  leccion: "Un buen reporte dice cuándo, dónde, qué equipo, qué se vio, qué se hizo, cuánto afectó y si ya había pasado. Lo que usted no escribe, nadie lo puede analizar.",

  ROLES: {
    cco: {nombre:"Controlador CCO", desc:"Ve las alarmas y la circulación de los trenes desde el Centro de Control de Operaciones (CCO)."},
    cot: {nombre:"Conductor a bordo", desc:"Opera el tren y es el primero en notar lo que pasa a bordo."},
    aux: {nombre:"Auxiliar de estación", desc:"Atiende la estación, los equipos y a los pasajeros en plataforma y vestíbulo."}
  },

  RELATOS: [

    {id:"cco-pdap", rol:"cco", titulo:"Alarma de PDAP que se borra sola",
     resumen:"Una puerta de andén da alarma dos veces en la misma mañana y las dos veces se normaliza sola.",
     relato:[
       {hora:"07:46", texto:"En su pantalla aparece la alarma de puerta de andén (PDAP) abierta en E07, andén de la vía 2, PDAP 4. El tren 115 queda retenido en el andén."},
       {hora:"07:47", texto:"Antes de que usted llame, la alarma se borra sola. El tren 115 sale con 1 minuto de retraso."},
       {hora:"07:47", texto:"Llama por radio a la estación E07. El auxiliar confirma que la PDAP 4 está cerrada y que no hay nada atrapado."},
       {hora:"08:12", texto:"La misma alarma aparece en la misma PDAP con el tren 121. Dura unos 40 segundos y se borra sola. El tren 121 sale con 1 minuto de retraso."},
       {hora:"08:13", texto:"El auxiliar de E07 comenta por radio: «Esa puerta viene sonando raro al cerrar desde ayer»."},
       {hora:"08:15", texto:"El servicio sigue normal. Usted va a registrar la falla para que mantenimiento la atienda."}
     ],
     fecha:"2027/04/13", hora:"07:46",
     ubicacion:{ops:["E07 · andén vía 1","E07 · andén vía 2","E07 · vestíbulo","Entre E06 y E07 · vía 2"], ok:"E07 · andén vía 2"},
     equipo:{ops:["PDAP (sin número)","PDAP 4","PDAP 4 y tren 115","Sistema de señalización"], ok:"PDAP 4"},
     hechos:[
       {t:"Alarma de PDAP 4 abierta con el tren 115 en el andén a las 07:46", tipo:"hecho", fb:"Es el síntoma tal como lo vio el CCO."},
       {t:"La alarma se borró sola en menos de 1 minuto, sin intervención", tipo:"hecho", fb:"Que se borre sola es un dato clave: indica una falla intermitente."},
       {t:"Se repitió a las 08:12 con el tren 121, con unos 40 segundos de duración", tipo:"hecho", fb:"La repetición en el mismo turno es lo que permite ver el patrón."},
       {t:"El auxiliar confirmó visualmente que la puerta estaba cerrada y sin obstáculos", tipo:"hecho", fb:"Ayuda a separar una falla de detección de una puerta realmente abierta."},
       {t:"El auxiliar informa que la puerta suena raro al cerrar desde el día anterior", tipo:"hecho", fb:"Es lo que dijo una persona, y se reporta indicando quién lo dijo."},
       {t:"Seguramente es el sensor de cierre de la puerta", tipo:"suposicion", fb:"Es un diagnóstico. Le corresponde a mantenimiento después de revisar."},
       {t:"El conductor del tren 115 operó mal las puertas", tipo:"suposicion", fb:"Es una culpa sin evidencia. Además desvía el análisis hacia la persona y no hacia el equipo."},
       {t:"El tren 115 venía puntual hasta E06", tipo:"irrelevante", fb:"Es cierto, pero no ayuda a analizar la falla de la puerta."}
     ],
     acciones:[
       {t:"Se consultó a la estación E07 por radio y se confirmó la puerta cerrada", ok:true},
       {t:"Los trenes continuaron cuando la alarma se borró", ok:true},
       {t:"Se aisló la PDAP 4", ok:false},
       {t:"Se reinició el sistema de puertas de andén de la estación", ok:false}
     ],
     efecto:{ops:["Sin efecto en el servicio","Un tren retenido 1 minuto","Dos trenes retenidos 1 minuto cada uno en E07 vía 2","Interrupción de la vía 2 durante 30 minutos"], ok:"Dos trenes retenidos 1 minuto cada uno en E07 vía 2"},
     repeticion:{ops:["Es la primera vez","Se repitió en este turno","Se repitió en este turno y la estación dice que viene pasando desde ayer","No se sabe"], ok:"Se repitió en este turno y la estación dice que viene pasando desde ayer"},
     desenlaceMalo:"Mantenimiento recibe «alarma de PDAP en E07, se normalizó». En la noche el técnico prueba las puertas del andén: todas funcionan. La orden se cierra como «no se encontró falla». Cuatro días después, la PDAP 4 queda abierta en hora punta y la vía 2 se ve afectada mientras se atiende. (Desenlace hipotético.)",
     desenlaceBueno:"Con la PDAP exacta, las dos horas de la alarma y el comentario del ruido, el técnico va directo a la PDAP 4, la prueba varias veces y encuentra el componente desgastado. Lo cambia en la ventana nocturna, antes de que falle en hora punta. El análisis FRACAS revisa las demás PDAP del mismo tipo. (Desenlace hipotético.)"
    },

    {id:"cot-puerta", rol:"cot", titulo:"Puerta del tren que no cierra al primer intento",
     resumen:"La misma puerta del tren no cierra al primer intento en dos estaciones del mismo recorrido.",
     relato:[
       {hora:"06:58", texto:"Usted conduce el tren 108 por la vía 1. En E03, al cerrar puertas, la cabina no confirma «puertas cerradas»."},
       {hora:"06:58", texto:"Por el monitor ve que la puerta 2 del lado derecho del coche 3 cierra a medias y vuelve a abrir. No ve pasajeros ni objetos en la puerta."},
       {hora:"06:59", texto:"Al segundo intento la puerta cierra y la cabina confirma. Sale con 1 minuto de retraso e informa al CCO según el procedimiento."},
       {hora:"07:31", texto:"En E08, vía 1, pasa lo mismo con la misma puerta. Al segundo intento cierra. Sale con unos 40 segundos de retraso e informa al CCO."},
       {hora:"07:50", texto:"Termina el recorrido sin más novedades. Va a registrar la falla para mantenimiento."}
     ],
     fecha:"2027/04/13", hora:"06:58",
     ubicacion:{ops:["E03 · vía 1","E08 · vía 1","E03 y E08 · vía 1","Entre E03 y E08 · vía 1"], ok:"E03 y E08 · vía 1"},
     equipo:{ops:["Tren 108","Tren 108 · coche 3","Tren 108 · coche 3 · puerta 2, lado derecho","Tren 108 · coche 2 · puerta 3, lado izquierdo"], ok:"Tren 108 · coche 3 · puerta 2, lado derecho"},
     hechos:[
       {t:"La puerta no cerró al primer intento: cerró a medias y volvió a abrir", tipo:"hecho", fb:"Es el síntoma exacto, tal como se vio."},
       {t:"La cabina no confirmó «puertas cerradas» hasta el segundo intento", tipo:"hecho", fb:"Dice qué indicó el tren, y eso mantenimiento lo puede buscar en los registros."},
       {t:"No había pasajeros ni objetos obstruyendo la puerta", tipo:"hecho", fb:"Descarta una causa externa y apunta al equipo."},
       {t:"La misma puerta repitió la falla en E08 a las 07:31", tipo:"hecho", fb:"La repetición en el mismo recorrido confirma que no fue casualidad."},
       {t:"La puerta tiene el motor dañado", tipo:"suposicion", fb:"Es un diagnóstico. El conductor reporta lo que ve; la causa la encuentra mantenimiento."},
       {t:"Los pasajeros estaban bloqueando la puerta", tipo:"suposicion", fb:"Contradice lo que usted vio: no había obstrucción."},
       {t:"El aire acondicionado del coche 1 estaba muy frío", tipo:"irrelevante", fb:"Puede ser otra novedad, pero no sirve para analizar esta falla. Si importa, va en un reporte aparte."}
     ],
     acciones:[
       {t:"Se hizo un segundo intento de cierre y la puerta cerró", ok:true},
       {t:"Se informó al CCO en las dos ocasiones", ok:true},
       {t:"Se aisló la puerta", ok:false},
       {t:"Se pidió a los pasajeros cambiar de coche", ok:false}
     ],
     efecto:{ops:["Sin efecto en el servicio","Dos retrasos cortos: 1 minuto en E03 y menos de 1 minuto en E08","Tren retirado del servicio","Retraso de 10 minutos"], ok:"Dos retrasos cortos: 1 minuto en E03 y menos de 1 minuto en E08"},
     repeticion:{ops:["Es la primera vez","Se repitió en el mismo recorrido (2 veces)","Pasa todos los días","No se sabe"], ok:"Se repitió en el mismo recorrido (2 veces)"},
     desenlaceMalo:"Mantenimiento recibe «tren 108, problema de puertas». En el taller revisan las 24 puertas del tren y todas cierran bien. La orden se cierra sin hallazgos. Una semana después, la puerta 2 del coche 3 no cierra en hora punta y hay que aislarla en línea. (Desenlace hipotético.)",
     desenlaceBueno:"Con el coche, la puerta y el síntoma exactos, el técnico revisa directamente esa puerta y su historial: ya había un reporte parecido el mes anterior. Encuentra el ajuste que se estaba perdiendo y lo corrige. El análisis FRACAS revisa si otras puertas tienen el mismo problema. (Desenlace hipotético.)"
    },

    {id:"aux-escalera", rol:"aux", titulo:"Escalera eléctrica que se detiene sola",
     resumen:"Una escalera eléctrica se detiene con pasajeros en hora punta; un pasajero y un compañero dan datos importantes.",
     relato:[
       {hora:"17:40", texto:"En E05, en hora punta, la escalera eléctrica 2 (del andén de la vía 1 al vestíbulo, en subida) se detiene sola con pasajeros encima. Nadie se cae. Los pasajeros terminan de subir caminando."},
       {hora:"17:41", texto:"Usted señaliza la escalera fuera de servicio según el procedimiento e informa al Jefe de Estación de Turno (JET), que avisa al CCO."},
       {hora:"17:43", texto:"Un pasajero le dice que sintió un golpe y olió a quemado justo antes de que se detuviera. Usted se acerca y no percibe olor."},
       {hora:"17:55", texto:"El aseador de la estación comenta que esa escalera «también se paró ayer en la tarde, pero arrancó al rato»."},
       {hora:"18:30", texto:"La escalera sigue fuera de servicio. Va a registrar la falla para mantenimiento."}
     ],
     fecha:"2027/04/13", hora:"17:40",
     ubicacion:{ops:["E05","E05 · andén vía 1 → vestíbulo","E05 · vestíbulo → calle","E05 · andén vía 2 → vestíbulo"], ok:"E05 · andén vía 1 → vestíbulo"},
     equipo:{ops:["Escalera eléctrica","Escalera eléctrica 2","Escalera eléctrica 1","Ascensor 1"], ok:"Escalera eléctrica 2"},
     hechos:[
       {t:"Se detuvo sola en subida a las 17:40 con pasajeros; nadie se cayó", tipo:"hecho", fb:"Es el síntoma y dice que no hubo lesionados."},
       {t:"Un pasajero dijo que sintió un golpe y olió a quemado antes de que se detuviera", tipo:"hecho", fb:"Es lo que dijo un testigo. Se reporta indicando que lo dijo un pasajero."},
       {t:"Usted no percibió olor a quemado al acercarse", tipo:"hecho", fb:"También es un dato: ayuda a mantenimiento a valorar lo que dijo el pasajero."},
       {t:"Según el aseador, la escalera también se detuvo el día anterior en la tarde y arrancó sola", tipo:"hecho", fb:"Dice que la falla viene de antes, aunque nadie la haya reportado."},
       {t:"Un pasajero activó el botón de parada de emergencia", tipo:"suposicion", fb:"Nadie lo vio. Si se reporta como hecho, el análisis puede descartar una falla real del equipo."},
       {t:"Es un problema del motor", tipo:"suposicion", fb:"Es un diagnóstico. Le corresponde a mantenimiento."},
       {t:"La máquina de recarga 3 no tenía papel", tipo:"irrelevante", fb:"Puede ser otra novedad, pero va en su propio reporte."}
     ],
     acciones:[
       {t:"Se señalizó la escalera fuera de servicio según el procedimiento", ok:true},
       {t:"Se informó al JET, que avisó al CCO", ok:true},
       {t:"Se puso la escalera en marcha con la llave para probarla", ok:false},
       {t:"Se abrió la tapa de la escalera para revisar", ok:false}
     ],
     efecto:{ops:["Sin efecto en el servicio","Escalera 2 fuera de servicio desde las 17:40 y sigue así a las 18:30","Escalera detenida 5 minutos","Estación cerrada"], ok:"Escalera 2 fuera de servicio desde las 17:40 y sigue así a las 18:30"},
     repeticion:{ops:["Es la primera vez","Según un compañero, también se detuvo el día anterior","Pasa todas las semanas","No se sabe"], ok:"Según un compañero, también se detuvo el día anterior"},
     desenlaceMalo:"Mantenimiento recibe «escalera de E05 parada». El técnico llega, no sabe cuál de las escaleras es, ni que hubo olor a quemado ni que ya había fallado. La rearma, funciona y cierra la orden. Al día siguiente vuelve a detenerse en hora punta. (Desenlace hipotético.)",
     desenlaceBueno:"Con la escalera exacta, la hora, el golpe y el olor que reportó el pasajero, y la falla del día anterior, el técnico no la pone en marcha sin revisar. Encuentra un componente dañado, lo cambia y deja registrada la causa. La disponibilidad de la escalera se recupera sin una segunda parada en hora punta. (Desenlace hipotético.)"
    },
    {id:"cco-ascensor", rol:"cco", titulo:"Pasajera atrapada en un ascensor",
     resumen:"Un ascensor se detiene entre pisos con una pasajera adentro. Tres personas le dan datos distintos.",
     relato:[
       {hora:"14:05", texto:"Entra una llamada del interfono del ascensor 1 de la Estación E10. Una pasajera dice que el ascensor «dio un sacudón y se paró» entre el vestíbulo y el andén de la vía 2."},
       {hora:"14:06", texto:"Usted la tranquiliza, confirma que está sola y que se siente bien, e informa al JET de E10 y al Controlador de Mantenimiento."},
       {hora:"14:15", texto:"El JET de E10 le dice por radio: «Ese ascensor ya se paró la semana pasada, pero esa vez arrancó solo»."},
       {hora:"14:22", texto:"El técnico de mantenimiento llega, rescata a la pasajera según el procedimiento y deja el ascensor fuera de servicio. Dice que el ascensor está nivelado y que no ve nada raro a simple vista."},
       {hora:"14:30", texto:"La pasajera sale bien, sin lesiones. Usted va a registrar el evento."}
     ],
     fecha:"2027/04/20", hora:"14:05",
     ubicacion:{ops:["E10 · vestíbulo","E10 · entre el vestíbulo y el andén de la vía 2","E10 · andén vía 1","E09 · vestíbulo"], ok:"E10 · entre el vestíbulo y el andén de la vía 2"},
     equipo:{ops:["Ascensor","Ascensor 1","Ascensor 2","Escalera 1"], ok:"Ascensor 1"},
     hechos:[
       {t:"El ascensor se detuvo entre pisos con una pasajera adentro a las 14:05", tipo:"hecho", fb:"Es el síntoma y la hora de inicio."},
       {t:"La pasajera dijo que el ascensor dio un sacudón antes de detenerse", tipo:"hecho", fb:"Es lo que dijo la pasajera. Se reporta indicando que lo dijo ella."},
       {t:"Según el JET, el ascensor ya se había detenido la semana pasada y arrancó solo", tipo:"hecho", fb:"Dice que la falla viene de antes, aunque no se haya reportado."},
       {t:"El técnico rescató a la pasajera a las 14:22, sin lesiones", tipo:"hecho", fb:"Dice cuánto duró el evento y que no hubo lesionados."},
       {t:"El técnico no vio nada raro a simple vista", tipo:"hecho", fb:"También es un dato: indica que la falla no es evidente y hay que buscarla."},
       {t:"El ascensor tiene un problema eléctrico", tipo:"suposicion", fb:"Nadie lo comprobó. Es un diagnóstico que le corresponde a mantenimiento."},
       {t:"La pasajera seguramente se recostó en la puerta", tipo:"suposicion", fb:"Nadie lo vio. Además, culpar al pasajero sin evidencia desvía el análisis."},
       {t:"El interfono del ascensor tenía buen sonido", tipo:"irrelevante", fb:"Es cierto, pero no ayuda a analizar por qué se detuvo el ascensor."}
     ],
     acciones:[
       {t:"Se atendió a la pasajera por el interfono y se confirmó que estaba bien", ok:true},
       {t:"Se informó al JET de E10 y al Controlador de Mantenimiento", ok:true},
       {t:"Mantenimiento rescató a la pasajera y dejó el ascensor fuera de servicio", ok:true},
       {t:"Se ordenó reiniciar el ascensor a distancia para liberar a la pasajera", ok:false}
     ],
     efecto:{ops:["Sin efecto en el servicio","Pasajera atrapada 17 minutos, sin lesiones; ascensor fuera de servicio","Ascensor detenido 5 minutos","Estación cerrada"], ok:"Pasajera atrapada 17 minutos, sin lesiones; ascensor fuera de servicio"},
     repeticion:{ops:["Es la primera vez","Según el JET, ya se había detenido la semana pasada","Pasa todos los días","No se sabe"], ok:"Según el JET, ya se había detenido la semana pasada"},
     desenlaceMalo:"Mantenimiento recibe «ascensor de E10 detenido, pasajera rescatada». El técnico lo revisa, no encuentra nada y lo pone en servicio. La parada de la semana anterior nunca se une a esta. Diez días después vuelve a detenerse con dos personas adentro. (Desenlace hipotético.)",
     desenlaceBueno:"Con el sacudón, la parada de la semana anterior y la hora exacta, mantenimiento revisa los registros del ascensor en esos dos momentos y encuentra el componente que fallaba de forma intermitente. Lo cambia antes de volver a ponerlo en servicio. (Desenlace hipotético.)"
    },

    {id:"cot-olor", rol:"cot", titulo:"Olor a quemado en un coche",
     resumen:"Los pasajeros avisan de olor a quemado en un coche. Unos dicen que hay humo; usted no lo ve.",
     relato:[
       {hora:"18:05", texto:"Entre E09 y E10, vía 2, un pasajero llama por el interfono del coche 4 del Tren 111: «Huele a quemado y creo que hay humo»."},
       {hora:"18:06", texto:"Usted informa de inmediato al CCO. Por la cámara del coche 4 no ve humo. Los indicadores de la cabina están normales."},
       {hora:"18:07", texto:"Llega a E10. Por orden del CCO se desaloja el coche 4. El auxiliar de E10 entra al coche: percibe olor a quemado cerca de las puertas del lado izquierdo, pero no ve humo."},
       {hora:"18:15", texto:"Por orden del CCO el tren sale de servicio sin pasajeros hacia el patio. Los pasajeros continúan en el tren siguiente."},
       {hora:"18:40", texto:"Va a registrar la novedad."}
     ],
     fecha:"2027/04/20", hora:"18:05",
     ubicacion:{ops:["E09 · vía 2","Entre E09 y E10 · vía 2","E10 · vía 2","Entre E09 y E10 · vía 1"], ok:"Entre E09 y E10 · vía 2"},
     equipo:{ops:["Tren 111","Tren 111 · coche 4","Tren 111 · coche 4 · cerca de las puertas del lado izquierdo","Tren 112 · coche 4"], ok:"Tren 111 · coche 4 · cerca de las puertas del lado izquierdo"},
     hechos:[
       {t:"Un pasajero avisó por el interfono de olor a quemado y posible humo en el coche 4", tipo:"hecho", fb:"Es lo que dijo el pasajero. Se reporta indicando que lo dijo él."},
       {t:"Por cámara no se vio humo y los indicadores de la cabina estaban normales", tipo:"hecho", fb:"Es lo que usted observó: ayuda a valorar el aviso del pasajero."},
       {t:"El auxiliar de E10 percibió olor a quemado cerca de las puertas del lado izquierdo del coche 4, sin humo", tipo:"hecho", fb:"Confirma el olor y dice dónde. Es la pista más útil para el técnico."},
       {t:"Se quemó un motor de puerta", tipo:"suposicion", fb:"Nadie lo comprobó. Es un diagnóstico que le corresponde a mantenimiento."},
       {t:"Había humo en el coche", tipo:"suposicion", fb:"Nadie lo confirmó: el pasajero dijo «creo», la cámara no lo mostró y el auxiliar no lo vio. Reportarlo como hecho exagera el evento."},
       {t:"El tren venía lleno por la hora punta", tipo:"irrelevante", fb:"Es cierto, pero no ayuda a encontrar el origen del olor."}
     ],
     acciones:[
       {t:"Se informó al CCO de inmediato", ok:true},
       {t:"Se desalojó el coche 4 en E10 por orden del CCO", ok:true},
       {t:"El tren salió de servicio sin pasajeros hacia el patio", ok:true},
       {t:"Se abrió el panel de las puertas para buscar el origen del olor", ok:false}
     ],
     efecto:{ops:["Sin efecto en el servicio","Tren retirado del servicio en E10; los pasajeros continuaron en el tren siguiente","Retraso de 1 minuto","Línea suspendida"], ok:"Tren retirado del servicio en E10; los pasajeros continuaron en el tren siguiente"},
     repeticion:{ops:["Es la primera vez","Se repitió en el mismo recorrido","Pasa todos los días","No se sabe"], ok:"No se sabe"},
     consecuencias:{repeticion:"Cuando no hay información de eventos anteriores, lo correcto es decir «no se sabe». Inventar una repetición o asegurar que es la primera vez también desvía el análisis."},
     desenlaceMalo:"Mantenimiento recibe «humo en el Tren 111». Revisa todo el tren buscando un incendio y no encuentra nada. Nadie revisa en particular las puertas del lado izquierdo del coche 4. (Desenlace hipotético.)",
     desenlaceBueno:"Con el coche, el lado y la diferencia entre lo que dijo el pasajero y lo que se observó, el técnico va directo a las puertas del lado izquierdo del coche 4 y encuentra un componente recalentado. (Desenlace hipotético.)"
    },

    {id:"aux-caida", rol:"aux", titulo:"Pasajero que se cae en la escalera",
     resumen:"Un pasajero se cae en la escalera eléctrica. Él dice que la escalera dio un tirón; otro pasajero dice que se tropezó.",
     relato:[
       {hora:"07:20", texto:"En la Estación E03, un pasajero se cae en la escalera eléctrica 1 (vestíbulo → andén de la vía 1, en bajada). Usted lo ve ya en el suelo al final de la escalera."},
       {hora:"07:21", texto:"Detiene la escalera con el pulsador de parada según el procedimiento, informa al JET y atiende al pasajero: tiene un golpe en la rodilla, puede caminar."},
       {hora:"07:23", texto:"El pasajero dice: «La escalera dio un tirón y me caí». Otra pasajera que venía detrás le dice a usted: «Yo vi que se tropezó con su maleta»."},
       {hora:"07:35", texto:"El pasajero recibe atención según el procedimiento y decide seguir su viaje. Mantenimiento revisa la escalera y la vuelve a poner en servicio a las 08:10."},
       {hora:"08:15", texto:"Va a registrar el evento."}
     ],
     fecha:"2027/04/20", hora:"07:20",
     ubicacion:{ops:["E03","E03 · vestíbulo → andén vía 1","E03 · andén vía 1 → vestíbulo","E03 · vestíbulo → calle"], ok:"E03 · vestíbulo → andén vía 1"},
     equipo:{ops:["Escalera eléctrica","Escalera eléctrica 1","Escalera eléctrica 2","Escalera fija"], ok:"Escalera eléctrica 1"},
     hechos:[
       {t:"Un pasajero se cayó en la escalera 1, en bajada, a las 07:20", tipo:"hecho", fb:"Es el evento, con la hora y el sentido de la escalera."},
       {t:"El pasajero tiene un golpe en la rodilla y puede caminar", tipo:"hecho", fb:"Dice cuál fue la lesión."},
       {t:"El pasajero dijo que la escalera dio un tirón", tipo:"hecho", fb:"Es su versión. Se reporta diciendo que la dio él."},
       {t:"Otra pasajera dijo que vio que se tropezó con su maleta", tipo:"hecho", fb:"Es otra versión, de un testigo. Las dos se reportan: decidir cuál es cierta le corresponde a quien investiga."},
       {t:"Usted no vio el momento de la caída", tipo:"hecho", fb:"Es importante decirlo: así nadie confunde lo que le contaron con lo que usted vio."},
       {t:"La escalera dio un tirón", tipo:"suposicion", fb:"Es la versión del pasajero, no un hecho comprobado. Reportarla como hecho descarta la otra versión."},
       {t:"El pasajero se tropezó por ir distraído", tipo:"suposicion", fb:"Nadie dijo que iba distraído. Es una culpa sin evidencia."}
     ],
     acciones:[
       {t:"Se detuvo la escalera con el pulsador de parada según el procedimiento", ok:true},
       {t:"Se informó al JET y se atendió al pasajero", ok:true},
       {t:"Mantenimiento revisó la escalera y la puso en servicio a las 08:10", ok:true},
       {t:"Se tomó el nombre y el teléfono de la testigo", ok:false}
     ],
     efecto:{ops:["Sin efecto en el servicio","Un pasajero con lesión leve; escalera 1 fuera de servicio de 07:21 a 08:10","Escalera detenida 5 minutos","Estación cerrada"], ok:"Un pasajero con lesión leve; escalera 1 fuera de servicio de 07:21 a 08:10"},
     repeticion:{ops:["Es la primera vez","Se repitió en el mismo turno","Pasa todos los días","No se sabe"], ok:"No se sabe"},
     consecuencias:{repeticion:"Nadie dio información de eventos anteriores: lo correcto es «no se sabe». Mantenimiento lo revisará en el historial de la escalera.", acciones:"Marque solo lo que se hizo según el relato. Tomar los datos de la testigo podría ser útil, pero el relato no dice que se hiciera."},
     desenlaceMalo:"El reporte dice «la escalera dio un tirón y un pasajero se cayó». Mantenimiento revisa la escalera buscando una falla que tal vez no existe, y nadie revisa si hace falta mejorar la información sobre el uso de la escalera con equipaje. (Desenlace hipotético.)",
     desenlaceBueno:"Con las dos versiones bien atribuidas, mantenimiento revisa los registros de la escalera a las 07:20 y no encuentra ninguna anomalía. El análisis concluye que fue un tropiezo con equipaje, y se refuerza la señalización sobre el uso de las escaleras con maletas. (Desenlace hipotético.)"
    }

  ]
};
