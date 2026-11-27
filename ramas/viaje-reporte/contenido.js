"use strict";
/* ============================================================
   RAMA: EL VIAJE DEL REPORTE (Sesión 5 · Después del reporte)
   Este es el único archivo que hay que editar para alimentar esta rama.

   Parte 1: el participante ordena las ETAPAS del circuito del reporte.
   Parte 2: sigue un mismo evento de su especialidad por cada PARADA del circuito,
            con un reporte bueno y uno malo. En cada parada responde qué hace posible
            esa etapa y luego ve qué pasó con cada reporte (EVENTOS[rol].paradas[id]).

   ETAPAS: en el orden correcto. PARADAS: {id, etapa, pregunta, ops:[{t, ok}], fb}.
   EVENTOS[rol]: {titulo, intro, bueno, malo, paradas:{id:{bueno:"...", malo:"..."}}}
   Los eventos son HIPOTÉTICOS (los mismos del Taller de reporte), con fines de formación.
   ============================================================ */
var VIAJE = {
  titulo: "El viaje del reporte",
  actividad: "Viaje del reporte",
  descripcion: "Siga un reporte desde que usted lo escribe hasta que cambia algo en el sistema, y vea la diferencia entre un buen reporte y uno malo en cada etapa.",
  leccion: "Su reporte no termina en un cajón: es el primer paso de un circuito que repara el equipo, encuentra la causa, la corrige y cambia un mantenimiento, un procedimiento o una capacitación. Cada dato que falta corta el circuito en alguna parte.",

  ETAPAS: [
    "Reporte del personal operativo",
    "Registro en el MMS y orden de trabajo",
    "Diagnóstico del técnico de mantenimiento",
    "Análisis FRACAS: búsqueda de la causa",
    "Acción correctiva",
    "Verificación de la corrección",
    "Cierre de la falla",
    "Mejora: cambia un mantenimiento, un procedimiento o una capacitación"
  ],

  ROLES: {
    cco: {nombre:"Controlador CCO", desc:"Alarma de una puerta de andén que se borra sola."},
    cot: {nombre:"Conductor a bordo", desc:"Puerta del tren que no cierra al primer intento."},
    aux: {nombre:"Auxiliar de estación", desc:"Escalera eléctrica que se detiene sola."}
  },

  PARADAS: [
    {id:"mms", etapa:"Registro en el MMS y orden de trabajo",
     pregunta:"El reporte entra al MMS, el sistema de gestión de mantenimiento, y se crea una orden de trabajo. ¿Qué dato necesita el MMS para asignar la orden al equipo correcto?",
     ops:[{t:"El equipo exacto y su ubicación.", ok:true},{t:"El nombre de quien reportó.", ok:false},{t:"La opinión de quien reportó sobre qué pieza está dañada.", ok:false}],
     fb:"En el MMS cada equipo tiene su ficha e historial. Sin el equipo exacto, la orden queda a nombre de «una puerta» o «una escalera» y no se suma al historial correcto."},
    {id:"diag", etapa:"Diagnóstico del técnico de mantenimiento",
     pregunta:"El técnico llega al equipo. ¿Qué le ayuda más a encontrar la falla?",
     ops:[{t:"Lo que se vio, se oyó o se olió, y en qué condiciones pasó (hora, carga, si se repitió).", ok:true},{t:"La suposición de quien reportó sobre la causa.", ok:false},{t:"Saber que ese equipo «siempre falla».", ok:false}],
     fb:"Una falla intermitente casi nunca aparece cuando llega el técnico. El síntoma y las condiciones le dicen qué probar y cómo reproducirla."},
    {id:"fracas", etapa:"Análisis FRACAS: búsqueda de la causa",
     pregunta:"El analista FRACAS revisa si la falla se repite para encontrar su causa. ¿Qué necesita de los reportes?",
     ops:[{t:"Fecha, hora y equipo exacto de cada evento, para poder agruparlos.", ok:true},{t:"Que solo se reporten las fallas graves.", ok:false},{t:"Un resumen semanal sin fechas.", ok:false}],
     fb:"Una falla que se repite solo se ve juntando eventos. Sin fecha, hora y equipo, los eventos no se pueden juntar y cada uno parece el primero."},
    {id:"corr", etapa:"Acción correctiva",
     pregunta:"Con la causa identificada, se define la acción correctiva. ¿Quién la decide?",
     ops:[{t:"Mantenimiento e ingeniería, con el análisis; si cambia algo del sistema, pasa por gestión de cambios.", ok:true},{t:"El personal operativo, con un ajuste rápido en sitio.", ok:false},{t:"Nadie: si la falla se recupera sola, no hace falta corregir nada.", ok:false}],
     fb:"Al personal operativo le corresponde reportar bien. La corrección la deciden quienes analizan, y todo cambio queda controlado."},
    {id:"verif", etapa:"Verificación de la corrección",
     pregunta:"¿Cómo se verifica que la corrección funcionó?",
     ops:[{t:"Probando en las condiciones en que fallaba y vigilando que no se repita, para lo cual se siguen necesitando los reportes.", ok:true},{t:"Si el técnico lo prueba una vez y funciona, queda verificado.", ok:false},{t:"No hace falta verificar si el repuesto es nuevo.", ok:false}],
     fb:"Una falla que aparecía en hora punta no se verifica a las 2 de la mañana. Y si vuelve, solo un reporte avisará que la corrección no funcionó."},
    {id:"interv", etapa:"Revisión mensual con la Interventoría",
     pregunta:"Cada mes se revisa con la Interventoría qué eventos cuentan para los indicadores del contrato. ¿Qué pasa con un evento mal registrado?",
     ops:[{t:"No se puede demostrar qué pasó, cuánto duró ni por qué.", ok:true},{t:"No importa: nadie revisa los registros.", ok:false},{t:"Se borra automáticamente de los indicadores.", ok:false}],
     fb:"El registro es la evidencia. Sin él no hay forma de demostrar la hora de inicio, la duración o la causa de un evento cuando se discute si cuenta."},
    {id:"mejora", etapa:"Mejora: cambia un mantenimiento, un procedimiento o una capacitación",
     pregunta:"Circuito cerrado: ¿qué puede cambiar gracias a un buen reporte?",
     ops:[{t:"Un plan de mantenimiento, un procedimiento o una capacitación, para que la falla no vuelva en ningún equipo.", ok:true},{t:"Nada más: el reporte solo sirve para reparar ese equipo.", ok:false},{t:"Solo se archiva para la estadística.", ok:false}],
     fb:"Un reporte de hoy puede cambiar el mantenimiento de todos los equipos del mismo tipo mañana. Así se cierra el circuito."}
  ],

  EVENTOS: {
    cco: {titulo:"Alarma de PDAP que se borra sola",
      intro:"Dos alarmas de la PDAP 4 de E07 en la misma mañana, las dos se normalizaron solas. Estos son dos reportes posibles del mismo evento.",
      bueno:"13/04/2027, 07:46 y 08:12 · E07, andén vía 2 · PDAP 4 · Alarma de puerta abierta con los trenes 115 y 121 en el andén; se borró sola en menos de 1 minuto las dos veces. El auxiliar confirmó la puerta cerrada y dijo que suena raro al cerrar desde ayer. · Se consultó a la estación; los trenes continuaron. · 2 trenes retenidos 1 minuto cada uno.",
      malo:"Alarma de PDAP en E07. Se normalizó sola.",
      paradas:{
        mms:{bueno:"Orden de trabajo para la PDAP 4 de E07, andén vía 2. Se suma a su historial.", malo:"Orden para «PDAP de E07». La estación tiene varias PDAP en cada andén: el técnico no sabe cuál revisar."},
        diag:{bueno:"El técnico prueba la PDAP 4 varias veces, escucha el ruido al cerrar y encuentra el componente desgastado.", malo:"El técnico prueba algunas puertas de noche, todas funcionan. Registra «no se encontró falla»."},
        fracas:{bueno:"El analista ve dos alarmas en una mañana más el ruido del día anterior: es una falla que empieza a aparecer.", malo:"Para el análisis es un evento suelto, sin repetición. No se investiga la causa."},
        corr:{bueno:"Mantenimiento cambia el componente y revisa si el plan preventivo lo inspecciona.", malo:"No hay causa identificada, no hay acción correctiva."},
        verif:{bueno:"Se prueba en hora punta y se vigila una semana: no hay más alarmas.", malo:"No hay nada que verificar. Cuatro días después, la PDAP 4 falla en hora punta."},
        interv:{bueno:"Los registros muestran las horas, los 2 minutos de retención y la atención inmediata.", malo:"No hay horas ni efecto en el servicio: no se puede demostrar cómo se manejó."},
        mejora:{bueno:"Se agrega la revisión de ese componente al mantenimiento preventivo de todas las PDAP del mismo tipo.", malo:"Nada cambia. La falla se repetirá en otras puertas."}
      }},
    cot: {titulo:"Puerta del tren que no cierra al primer intento",
      intro:"La misma puerta del Tren 108 no cerró al primer intento en dos estaciones. Estos son dos reportes posibles del mismo evento.",
      bueno:"13/04/2027, 06:58 en E03 y 07:31 en E08, vía 1 · Tren 108, coche 3, puerta 2 lado derecho · No cerró al primer intento: cerró a medias y volvió a abrir; la cabina no confirmó hasta el segundo intento; sin obstrucción visible. · Segundo intento de cierre; se informó al CCO las dos veces. · Retrasos de 1 minuto y de 40 segundos.",
      malo:"Tren 108, problema de puertas.",
      paradas:{
        mms:{bueno:"Orden de trabajo para la puerta 2 del lado derecho del coche 3 del Tren 108. Se suma a su historial.", malo:"Orden para «Tren 108, puertas». El tren tiene 24 puertas."},
        diag:{bueno:"El técnico va directo a esa puerta, reproduce el cierre a medias y encuentra el ajuste que se estaba perdiendo.", malo:"En el taller revisan todas las puertas del tren: todas cierran bien. Se cierra sin hallazgos."},
        fracas:{bueno:"El analista ve que la misma puerta tuvo un reporte parecido el mes anterior: la falla se repite.", malo:"Sin la puerta exacta, el evento no se puede unir con el reporte del mes anterior."},
        corr:{bueno:"Mantenimiento corrige el ajuste y revisa si hace falta cambiar la frecuencia de esa inspección.", malo:"Sin causa no hay corrección."},
        verif:{bueno:"Se vigilan los recorridos del tren: la puerta cierra al primer intento.", malo:"Una semana después, la puerta no cierra en hora punta y hay que aislarla en línea."},
        interv:{bueno:"Los registros muestran las dos horas, los retrasos y que se informó al CCO.", malo:"No se puede reconstruir cuándo pasó ni cuánto afectó."},
        mejora:{bueno:"Se ajusta la frecuencia de esa inspección en todos los trenes de la flota.", malo:"Nada cambia en el resto de la flota."}
      }},
    aux: {titulo:"Escalera eléctrica que se detiene sola",
      intro:"La escalera 2 de E05 se detuvo con pasajeros en hora punta. Un pasajero habló de un golpe y olor a quemado, y un compañero dijo que el día anterior también se había detenido. Estos son dos reportes posibles del mismo evento.",
      bueno:"13/04/2027, 17:40 · E05, escalera 2 (andén vía 1 → vestíbulo, en subida) · Se detuvo sola con pasajeros, sin caídas. Un pasajero dijo que sintió un golpe y olió a quemado antes de que se detuviera; yo no percibí olor. Según el aseador, también se detuvo ayer en la tarde y arrancó sola. · Se señalizó fuera de servicio y se informó al JET. · Fuera de servicio desde las 17:40; seguía así a las 18:30.",
      malo:"Escalera de E05 parada.",
      paradas:{
        mms:{bueno:"Orden de trabajo para la escalera 2 de E05. Se suma a su historial.", malo:"Orden para «escalera de E05». El técnico tiene que averiguar cuál es."},
        diag:{bueno:"Por el golpe y el olor, el técnico no la pone en marcha sin revisar y encuentra un componente dañado.", malo:"El técnico la rearma, funciona y cierra la orden."},
        fracas:{bueno:"El analista une el evento con la parada del día anterior: no es un evento aislado.", malo:"El evento queda suelto: la parada del día anterior nunca se reportó."},
        corr:{bueno:"Mantenimiento cambia el componente y revisa por qué no se detectó en el preventivo.", malo:"Sin causa no hay corrección."},
        verif:{bueno:"Se prueba con carga y se vigila en hora punta: no vuelve a detenerse.", malo:"Al día siguiente vuelve a detenerse en hora punta."},
        interv:{bueno:"Los registros muestran la hora de inicio, la duración y que no hubo lesionados.", malo:"No hay hora de inicio ni duración: no se puede demostrar cuánto tiempo estuvo fuera de servicio."},
        mejora:{bueno:"Se agrega la revisión de ese componente al preventivo de todas las escaleras del mismo modelo.", malo:"Nada cambia en las demás escaleras."}
      }}
  }
};
