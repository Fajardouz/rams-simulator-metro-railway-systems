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
    }

  ]
};
