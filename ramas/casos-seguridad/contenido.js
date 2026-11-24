"use strict";
/* ============================================================
   CONTENIDO DE LOS CASOS
   Cada caso: rol, título, contexto, minutos base, pasos (decisiones) y reporte esperado.
   Cada opción: t (texto), q ("best" | "ok" | "bad"), min (minutos que suma), barrera (true si quita una barrera),
   fb (por qué), rams (idea RAMS), ref (referencia).
   ============================================================ */
var FECHA_CASO = "2027/03/09";
var REG = "Reglamento de operación";

var ROLES = {
  cco: {nombre:"Controlador CCO", desc:"Controlador de circulación de trenes en el Centro de Control de Operaciones (CCO)."},
  cot: {nombre:"Conductor a bordo", desc:"Conductor a bordo (COT): atiende fallas, conduce en modo manual con autorización del CCO y asiste a los pasajeros."},
  aux: {nombre:"Auxiliar de estación", desc:"Auxiliar de estación (AUX): atiende la plataforma, las PDAP y a los pasajeros bajo la coordinación del JET y el CCO."}
};

var CATEGORIAS = ["Orden de control","Incidente – alarma de fallo","Incidente – alarma de incendio","Labor diaria","Novedad operativa","Otros"];
var RECEPTORES = ["CCO","Jefe de Estación de Turno (JET)","Capitán de Trenes (CAP)","Controlador de Mantenimiento","Estación (personal de plataforma)"];
var CANALES = ["Radio TETRA","Teléfono","Presencial","Mensaje de texto"];

var CASOS = [
 {id:"cco-puerta", rol:"cco", titulo:"Puerta del tren que no cierra en estación",
  resumen:"Hora punta. Una puerta del Tren 105 no cierra en la Estación E08 y el tren no puede salir.",
  ref:REG,
  contexto:"Hora punta de la mañana. Usted es el controlador de circulación de turno en el CCO. El Tren uno-cero-cinco (105) circula en UTO con un conductor a bordo (COT).",
  minBase:1,
  pasos:[
   {hora:"07:38", alarma:"ALARMA: la puerta 3 del coche 2 del Tren 105 no cierra en la Estación E08, vía 1.",
    texto:"¿Qué hace primero?",
    ops:[
     {t:"Revisar la cámara CCTV asociada para descartar una persona u objeto atrapado, y aplicar retención manual al tren.", q:"best", min:1,
      fb:"Primero descarta que haya alguien atrapado y asegura que el tren no salga con una puerta abierta.", rams:"Seguridad primero: entender antes de actuar, sin quitar ninguna protección.", ref:REG},
     {t:"Enviar el comando de cierre remoto de puertas sin revisar la cámara.", q:"bad", min:0, barrera:true,
      fb:"Si hay una persona u objeto atrapado, cerrar a ciegas puede lesionar a alguien. El reglamento prevé confirmar la remoción de la obstrucción antes del cierre remoto.", rams:"Una acción remota sin verificación quita una barrera.", ref:REG},
     {t:"Autorizar la salida del tren para no afectar el intervalo.", q:"bad", min:0, barrera:true,
      fb:"Un tren no sale con una puerta abierta. La puntualidad nunca prevalece sobre la seguridad.", rams:"La seguridad operacional prevalece sobre la puntualidad (principio general del reglamento).", ref:REG}
    ]},
   {hora:"07:39", situ:"La cámara muestra que no hay obstrucción: la puerta tiene una falla.",
    texto:"¿Cómo le da la instrucción al conductor a bordo?",
    ops:[
     {t:"\"Control a tren uno-cero-cinco, responda.\" Luego: \"Tren uno-cero-cinco, cierre y aísle manualmente la puerta tres del coche dos, estación cero-ocho, vía uno. Confirme colación.\" Espera la repetición completa y cierra con \"Correcto, tren uno-cero-cinco\".", q:"best", min:1,
      fb:"Estructura completa, números cifra por cifra, colación obligatoria y cierre con \"Correcto\" más el identificador.", rams:"La comunicación clara es una barrera humana: evita que se actúe sobre la puerta o el tren equivocado.", ref:REG},
     {t:"\"Ciento cinco, cierre la puerta dañada, ¿me copia?\" y acepta \"OK\" como respuesta.", q:"bad", min:0, barrera:true,
      fb:"Está prohibido cerrar con \"OK\", \"recibido\" o \"copiado\" sin colación, y los números se dicen cifra por cifra. Además, la orden no dice qué puerta ni en qué coche.", rams:"Una orden ambigua es una barrera rota.", ref:REG},
     {t:"Pedir al Jefe de Estación que cierre la puerta del tren desde el andén.", q:"ok", min:2,
      fb:"La estación puede apoyar, pero el reglamento asigna esta acción al conductor a bordo, que está en el tren. Se pierde tiempo coordinando.", rams:"Cada barrera tiene un responsable definido.", ref:REG}
    ]},
   {hora:"07:41", radio:"\"Control, aquí tren uno-cero-cinco: puerta tres del coche dos cerrada y aislada.\"",
    texto:"¿Cuándo cancela la retención?",
    ops:[
     {t:"Verificar en la consola que la puerta aparece aislada y entonces cancelar la retención. El tren sigue en UTO con la puerta aislada.", q:"best", min:1,
      fb:"El reglamento indica cancelar la retención una vez confirmado el estado de aislamiento.", rams:"Doble confirmación: lo que se dice por radio se verifica en el sistema.", ref:REG},
     {t:"Cancelar la retención de inmediato con el reporte verbal.", q:"ok", min:0,
      fb:"Probablemente esté bien, pero no verificó en el sistema. Si el aislamiento no quedó registrado, el tren puede volver a fallar en la siguiente estación.", rams:"Confirmar en el sistema cuesta segundos.", ref:REG},
     {t:"Retirar el tren del servicio y evacuar a todos los pasajeros.", q:"ok", min:12,
      fb:"Es una medida desproporcionada: con la puerta aislada, el reglamento permite que el tren continúe en UTO. Se pierden muchos minutos de servicio.", rams:"Disponibilidad: la respuesta debe ser proporcional al riesgo.", ref:REG}
    ]},
   {hora:"07:44", texto:"El tren ya salió. ¿Qué hace con la información de la falla?",
    ops:[
     {t:"Registrarla en el Registro Diario (fecha y hora, ubicación, emisor, contenido, receptor y canal) e informar al Controlador de Mantenimiento para su reparación.", q:"best", min:0,
      fb:"La puerta quedó aislada, no reparada: el controlador de circulación debe informar al controlador de mantenimiento. Y todo evento se registra a tiempo.", rams:"El registro alimenta el FRACAS: sin él, la falla no se analiza ni se corrige.", ref:REG},
     {t:"No registrarla, porque el tren siguió en servicio.", q:"bad", min:0,
      fb:"Una falla resuelta en el momento sigue siendo una falla. Si no queda registrada, nadie la repara y puede repetirse.", rams:"Si no está registrado, no existe para el análisis.", ref:REG},
     {t:"Registrarla al final del turno con lo que recuerde.", q:"bad", min:0,
      fb:"El reglamento prohíbe reportar tarde u omitir información. Al final del turno se pierden detalles como la hora exacta.", rams:"Un reporte tardío es un reporte incorrecto.", ref:REG}
    ]}
  ],
  reporte:{titulo:"Registro de la falla en el Registro Diario", emisor:"Controlador de circulación (CCO)", hora:"07:38",
   ubicaciones:["Estación E07 – vía 1","Estación E08 – vía 1","Estación E08 – vía 2","Entre E08 y E09 – vía 1"], ubicacion:"Estación E08 – vía 1",
   categorias:["Incidente – alarma de fallo"], receptores:["Controlador de Mantenimiento"], canales:["Radio TETRA","Teléfono"],
   claves:["puerta","105","coche","aisl","retenc"], },
  leccion:"Ante una puerta que no cierra: primero descartar a una persona atrapada, luego una orden clara con colación, verificar el aislamiento en el sistema y pasar la falla a mantenimiento. Así la perturbación se queda en pocos minutos y nadie corre riesgo."
 },

 {id:"cco-pei", rol:"cco", titulo:"Interfono de emergencia activado en un tren",
  resumen:"Un pasajero activa el interfono de emergencia del Tren 112 entre las estaciones E05 y E06.",
  ref:REG,
  contexto:"Hora punta de la tarde. Usted es el controlador de circulación de turno en el CCO. El Tren uno-uno-dos (112) circula en UTO por el viaducto.",
  minBase:0,
  pasos:[
   {hora:"18:12", alarma:"ALARMA CRÍTICA: interfono de emergencia (PEI) activado en el coche 4 del Tren 112, entre E05 y E06, vía 2. El sistema muestra la cámara del coche.",
    texto:"¿Qué hace?",
    ops:[
     {t:"Atender la llamada del interfono de inmediato (máximo 60 segundos) mientras observa la cámara del coche.", q:"best", min:0,
      fb:"El reglamento fija un máximo de 60 segundos para atender el interfono. La cámara le da contexto mientras habla.", rams:"El tiempo de respuesta es parte de la barrera.", ref:REG},
     {t:"Terminar la tarea que estaba haciendo y luego atender la llamada.", q:"bad", min:2, barrera:true,
      fb:"Un interfono de emergencia puede ser una persona en riesgo. Superar los 60 segundos incumple el reglamento.", rams:"Prioridad 1 y 2 antes que la rutina.", ref:REG},
     {t:"Detener toda la línea con el botón RCE de línea principal.", q:"bad", min:15,
      fb:"Es desproporcionado: corta la tracción de toda la línea y deja trenes detenidos en el viaducto, que es una zona de difícil acceso.", rams:"La respuesta debe ser proporcional; el RCE es para riesgo inminente.", ref:REG}
    ]},
   {hora:"18:13", radio:"Pasajera por el interfono: \"Un señor se desmayó en el coche cuatro.\"",
    texto:"¿Qué hace con el tren?",
    ops:[
     {t:"Dejar que el tren continúe en UTO hasta la siguiente estación (E06), donde quedará retenido con puertas y PDAP abiertas para la atención.", q:"best", min:3,
      fb:"Correcto: en interestación el tren no se detiene en el viaducto; sigue hasta la siguiente estación, donde la ayuda puede llegar.", rams:"El lugar seguro para atender a alguien es la estación, no el viaducto.", ref:REG},
     {t:"Detener el tren en el viaducto para que la ayuda llegue más rápido.", q:"bad", min:8, barrera:true,
      fb:"En el viaducto la ayuda llega más lento, no más rápido, y se crea un riesgo de evacuación no autorizada.", rams:"Detener donde no hay acceso aumenta el peligro.", ref:REG},
     {t:"Ordenar que el tren salte E06 y siga hasta la terminal, donde hay más personal.", q:"bad", min:6,
      fb:"Se retrasa la atención de una persona inconsciente varios minutos sin razón.", rams:"La vida está primero que la comodidad operativa.", ref:REG}
    ]},
   {hora:"18:14", texto:"El tren va hacia E06. ¿Cómo coordina con la estación?",
    ops:[
     {t:"\"Control a estación cero-seis, responda.\" Le informa que el Tren uno-uno-dos llega a vía dos con una persona indispuesta en el coche cuatro, que se prepare para atenderla en la plataforma, y pide colación.", q:"best", min:0,
      fb:"La estación se prepara antes de que llegue el tren y sabe exactamente dónde actuar.", rams:"Anticiparse acorta el tiempo de atención.", ref:REG},
     {t:"Avisar a la estación cuando el tren ya esté en el andén.", q:"ok", min:3,
      fb:"La estación pierde minutos organizándose cuando el tren ya llegó.", rams:"Disponibilidad: lo que no se prepara se paga en minutos.", ref:REG},
     {t:"Anunciar por megafonía en toda la línea que hay una emergencia médica.", q:"ok", min:1,
      fb:"Genera alarma innecesaria en toda la línea y no le dice a la estación qué hacer.", rams:"La información debe ir a quien la necesita.", ref:REG}
    ]},
   {hora:"18:22", situ:"El personal de estación atendió al pasajero y ya salió del tren con los servicios de emergencia.",
    texto:"¿Cómo cierra el evento?",
    ops:[
     {t:"Confirmar con la estación que la atención terminó, rearmar el interfono, liberar la retención y registrar el evento en el Registro Diario.", q:"best", min:1,
      fb:"El interfono vuelve a estar disponible para la siguiente emergencia y el evento queda trazado.", rams:"Restablecer la barrera y registrar cierra el ciclo.", ref:REG},
     {t:"Liberar el tren apenas baje el pasajero, sin rearmar el interfono.", q:"bad", min:0, barrera:true,
      fb:"El interfono queda fuera de servicio: si otra persona lo necesita, no funcionará.", rams:"Un dispositivo de emergencia sin restablecer es una barrera perdida.", ref:REG},
     {t:"Rearmar y liberar, pero no registrarlo porque no fue una falla técnica.", q:"bad", min:0,
      fb:"Los eventos con pasajeros también se registran. Está prohibido omitir información.", rams:"Lo que no se registra no se aprende.", ref:REG}
    ]}
  ],
  reporte:{titulo:"Registro del evento en el Registro Diario", emisor:"Controlador de circulación (CCO)", hora:"18:12",
   ubicaciones:["Estación E05 – vía 2","Entre E05 y E06 – vía 2","Estación E06 – vía 2","Entre E05 y E06 – vía 1"], ubicacion:"Entre E05 y E06 – vía 2",
   categorias:["Novedad operativa"], receptores:["Estación (personal de plataforma)","Jefe de Estación de Turno (JET)"], canales:["Radio TETRA"],
   claves:["interfono","112","coche","desmay","indispuest","pasajer"]},
  leccion:"Un interfono de emergencia se atiende en menos de 60 segundos. En el viaducto, el tren sigue hasta la estación; la estación se prepara antes de que llegue; y al final se restablece el dispositivo y se registra."
 },

 {id:"cot-estado-puerta", rol:"cot", titulo:"Pérdida de estado de una puerta del tren",
  resumen:"El Tren 105 frena de emergencia entre E03 y E04 porque perdió el estado de una puerta.",
  ref:REG,
  contexto:"Hora punta de la mañana. Usted es el conductor a bordo (COT) del Tren uno-cero-cinco (105), que circula en UTO con pasajeros.",
  minBase:1,
  pasos:[
   {hora:"07:55", alarma:"El tren aplica frenado de emergencia entre E03 y E04, vía 1. La consola indica: pérdida de estado de la puerta 2 del coche 3.",
    texto:"¿Qué hace primero?",
    ops:[
     {t:"Ir a la puerta afectada, mantener a los pasajeros alejados y verificar que no exista riesgo de caída; luego reportar al CCO lo que encuentra.", q:"best", min:2,
      fb:"El reglamento indica actuar tras verificar que no existe riesgo de caída de pasajeros.", rams:"Primero las personas, después el tren.", ref:REG},
     {t:"Accionar de una vez el bypass de puertas para que el tren pueda moverse.", q:"bad", min:0, barrera:true,
      fb:"No sabe si la puerta está abierta. Moverse con un bypass sin verificar puede hacer que alguien caiga del tren.", rams:"Nunca se puentea una protección sin verificar.", ref:REG},
     {t:"Quedarse en la cabina esperando que el CCO lo resuelva de forma remota.", q:"ok", min:4,
      fb:"Esta falla requiere que alguien verifique la puerta en sitio, y usted es quien está a bordo.", rams:"La barrera humana a bordo es usted.", ref:REG}
    ]},
   {hora:"07:58", situ:"La puerta está cerrada físicamente, pero el sistema no detecta su estado.",
    texto:"¿Cómo continúa?",
    ops:[
     {t:"Reportar al CCO \"puerta cerrada con falla en la detección\" y solicitar autorización para accionar el bypass y conducir en modo MCS o EM hasta la estación más cercana.", q:"best", min:1,
      fb:"El reglamento prevé el bypass y la conducción manual hasta la estación más cercana, pero cambiar de modo requiere autorización previa del CCO.", rams:"Degradar el modo es decisión del CCO, no del conductor.", ref:REG},
     {t:"Accionar el bypass y pasar a modo EM por iniciativa propia, porque la puerta está cerrada.", q:"bad", min:0, barrera:true,
      fb:"El conductor no puede degradar el modo por iniciativa propia, salvo riesgo inminente para la vida. El CCO debe saber que el tren se moverá sin protección.", rams:"La autorización es la barrera que protege a los demás trenes.", ref:REG},
     {t:"Pedir al CCO que active el RCE de línea para detener todos los trenes mientras revisa.", q:"ok", min:8,
      fb:"No hay un riesgo inminente que lo justifique; el sistema ya protegió la zona. Se detiene toda la línea sin necesidad.", rams:"Proporcionalidad.", ref:REG}
    ]},
   {hora:"08:00", radio:"CCO: \"Tren uno-cero-cinco, accione el bypass de puertas y circule en modo EM hasta estación cero-cuatro, vía uno. Confirme colación.\"",
    texto:"Después de colacionar, ¿cómo conduce?",
    ops:[
     {t:"En modo EM a máximo 25 km/h, bajo supervisión continua del CCO, y entrando a la estación E04 a no más de 25 km/h.", q:"best", min:3,
      fb:"En modo EM no hay protección ATP: el límite es 25 km/h en línea principal y en la entrada a estación.", rams:"Modo degradado: menos velocidad, más atención.", ref:REG},
     {t:"A 40 km/h, para recuperar el tiempo perdido.", q:"bad", min:2, barrera:true,
      fb:"Supera el límite del modo EM. Sin ATP, su velocidad es la única protección.", rams:"La velocidad límite es una barrera.", ref:REG},
     {t:"A 25 km/h, pero sin comunicarse con el CCO hasta llegar.", q:"bad", min:3, barrera:true,
      fb:"En modo EM el reglamento exige la supervisión continua del CCO.", rams:"Sin comunicación no hay supervisión.", ref:REG}
    ]},
   {hora:"08:05", situ:"El tren se detuvo en la Estación E04, vía 1.",
    texto:"¿Qué hace ahora?",
    ops:[
     {t:"Coordinar con el personal de estación la evacuación de todos los pasajeros, informarles con mensajes claros y reportar la novedad al CCO y al Capitán de Trenes antes de retirar el tren.", q:"best", min:3,
      fb:"El reglamento indica evacuar y retirar el tren del servicio. El Capitán de Trenes consolida las novedades de conducción.", rams:"Un reporte completo es el inicio del análisis FRACAS.", ref:REG},
     {t:"Seguir con los pasajeros hasta la terminal, porque el tren todavía se mueve.", q:"bad", min:0, barrera:true,
      fb:"Con la detección de puerta en falla, el tren debe evacuarse y salir de servicio.", rams:"No se presta servicio con una protección anulada.", ref:REG},
     {t:"Evacuar y retirar el tren sin reportar nada; mantenimiento verá la alarma.", q:"bad", min:3,
      fb:"La alarma no dice lo que usted vio: si la puerta estaba cerrada, qué hizo y a qué hora. Sin eso, el diagnóstico empieza de cero.", rams:"Mantenibilidad: su reporte acorta la reparación.", ref:REG}
    ]}
  ],
  reporte:{titulo:"Reporte de la novedad al CCO", emisor:"COT – Tren 105", hora:"07:55",
   ubicaciones:["Estación E03 – vía 1","Entre E03 y E04 – vía 1","Estación E04 – vía 1","Entre E03 y E04 – vía 2"], ubicacion:"Entre E03 y E04 – vía 1",
   categorias:["Incidente – alarma de fallo"], receptores:["CCO"], canales:["Radio TETRA"],
   claves:["puerta","105","coche","bypass","deteccion","detección","evacu"]},
  leccion:"Con una falla de puerta: verificar que nadie pueda caer, reportar con precisión, cambiar de modo solo con autorización, respetar los 25 km/h del modo EM y evacuar en la estación más cercana."
 },

 {id:"cot-no-comunicante", rol:"cot", titulo:"Tren no comunicante",
  resumen:"El Tren 108 pierde la comunicación con el sistema de señalización entre E10 y E11.",
  ref:REG,
  contexto:"Mediodía. Usted es el conductor a bordo (COT) del Tren uno-cero-ocho (108), que circula en UTO con pasajeros.",
  minBase:1,
  pasos:[
   {hora:"13:20", alarma:"El tren aplica frenado de emergencia entre E10 y E11, vía 2. La consola indica pérdida de comunicación con la señalización (tren no comunicante).",
    texto:"¿Qué hace primero?",
    ops:[
     {t:"Llamar al CCO (\"Tren uno-cero-ocho a control, responda\"), reportar la situación y esperar instrucciones.", q:"best", min:1,
      fb:"Reporta de inmediato con la estructura correcta y no actúa sin la autorización del CCO.", rams:"El CCO es quien ve toda la línea.", ref:REG},
     {t:"Pasar a modo EM de inmediato, porque el procedimiento dice que el conductor conmuta a EM.", q:"bad", min:0, barrera:true,
      fb:"El reglamento sí prevé el modo EM para esta falla, pero la degradación de modo requiere autorización previa del CCO. Sin ella, el CCO no sabe que hay un tren moviéndose sin protección.", rams:"Hacer lo correcto en el orden equivocado también es un riesgo.", ref:REG},
     {t:"Esperar en silencio a que el sistema se recupere.", q:"ok", min:5,
      fb:"El CCO ya ve la alarma, pero necesita su confirmación desde el tren. Esperar en silencio solo suma minutos.", rams:"El tiempo de reacción es parte de la duración de la falla.", ref:REG}
    ]},
   {hora:"13:22", radio:"CCO: \"Tren uno-cero-ocho, conmute a modo EM y circule hasta estación uno-uno, vía dos. Confirme colación.\"",
    texto:"¿Cómo responde?",
    ops:[
     {t:"\"Tren uno-cero-ocho: conmuto a modo EM y circulo hasta estación uno-uno, vía dos.\" Espera el \"Correcto, tren uno-cero-ocho\" antes de moverse.", q:"best", min:1,
      fb:"Colación completa y cierre del ciclo antes de actuar.", rams:"La colación asegura que usted y el CCO entendieron lo mismo.", ref:REG},
     {t:"\"Recibido, control\", y arranca.", q:"bad", min:0, barrera:true,
      fb:"\"Recibido\" sin repetir la orden está prohibido, y arrancó sin que el CCO cerrara la comunicación.", rams:"Sin colación no hay confirmación.", ref:REG},
     {t:"\"Entendido, ciento ocho, voy para la once.\"", q:"bad", min:0,
      fb:"Expresión informal, números sin decir cifra por cifra y sin el modo de conducción. Así se generan malentendidos.", rams:"La forma de hablar por radio también es una barrera.", ref:REG}
    ]},
   {hora:"13:24", texto:"Ya está en modo EM. ¿Cómo conduce hasta E11?",
    ops:[
     {t:"A máximo 25 km/h, atento a la vía y a los indicadores de posición de cambiavías, y deteniéndose para pedir confirmación al CCO ante cualquier duda.", q:"best", min:4,
      fb:"En modo EM no hay ATP: la autorización la da el CCO, que confirma que la ruta está despejada, y la velocidad máxima es 25 km/h.", rams:"Sin protección automática, la barrera es usted.", ref:REG},
     {t:"A 50 km/h, porque la vía estaba despejada hace un minuto.", q:"bad", min:2, barrera:true,
      fb:"Duplica el límite del modo EM. Lo que estaba despejado hace un minuto no tiene por qué estarlo ahora.", rams:"La velocidad límite es una barrera.", ref:REG},
     {t:"A 25 km/h, pero con el radio en volumen bajo para concentrarse.", q:"bad", min:4, barrera:true,
      fb:"En modo EM la supervisión del CCO es continua: debe poder escuchar cualquier orden de detención.", rams:"Comunicación permanente con el CCO.", ref:REG}
    ]},
   {hora:"13:30", situ:"El tren llegó a la Estación E11, vía 2. Mientras se detiene, la consola indica que el tren vuelve a comunicar.",
    texto:"¿Qué hace?",
    ops:[
     {t:"Evacuar a los pasajeros con apoyo de la estación, informarles con claridad, pedir instrucciones al CCO para retirar el tren y reportar la novedad al Capitán de Trenes.", q:"best", min:4,
      fb:"El reglamento indica retirar el tren de la línea. Que vuelva a comunicar no significa que la falla esté resuelta.", rams:"Una falla que aparece y desaparece se reporta y se analiza.", ref:REG},
     {t:"Volver a modo UTO por su cuenta, porque el tren ya comunica.", q:"bad", min:0, barrera:true,
      fb:"Restablecer el modo también requiere autorización previa del CCO.", rams:"Ni degradar ni restablecer el modo por iniciativa propia.", ref:REG},
     {t:"Dejar el tren con pasajeros en la estación mientras revisa los equipos.", q:"bad", min:6,
      fb:"Los pasajeros quedan sin información y el tren ocupa la plataforma. Primero se evacua y se coordina con el CCO.", rams:"Primero las personas.", ref:REG}
    ]}
  ],
  reporte:{titulo:"Reporte de la novedad al CCO", emisor:"COT – Tren 108", hora:"13:20",
   ubicaciones:["Estación E10 – vía 2","Entre E10 y E11 – vía 2","Estación E11 – vía 2","Entre E10 y E11 – vía 1"], ubicacion:"Entre E10 y E11 – vía 2",
   categorias:["Incidente – alarma de fallo"], receptores:["CCO"], canales:["Radio TETRA"],
   claves:["108","comunic","EM","frenado","evacu"]},
  leccion:"En un tren no comunicante: reportar primero, cambiar de modo solo con autorización, colacionar la orden, conducir a 25 km/h con atención total y no restablecer el modo por cuenta propia aunque el tren vuelva a comunicar."
 },

 {id:"aux-pdap", rol:"aux", titulo:"Falla de puerta de andén en hora punta",
  resumen:"Una puerta de andén (PDAP) no abre cuando llega el tren a la Estación E08.",
  ref:REG,
  contexto:"Hora punta de la mañana. Usted es Auxiliar de Estación (AUX) en la Estación E08. El andén de la vía 1 está lleno.",
  minBase:1,
  pasos:[
   {hora:"08:05", alarma:"Llega un tren a la vía 1 y la puerta de andén del módulo 12 no abre. Los pasajeros se agolpan frente a ella.",
    texto:"¿Qué hace primero?",
    ops:[
     {t:"Acudir de inmediato al módulo, asegurar y segregar la zona, e informar al JET.", q:"best", min:0,
      fb:"Es exactamente lo que asigna el reglamento al AUX ante una falla de PDAP.", rams:"Primero garantizar la operación segura, luego gestionar la reparación.", ref:REG},
     {t:"Llamar a mantenimiento y esperar a que llegue.", q:"ok", min:4,
      fb:"Mientras espera, la zona queda sin control y los pasajeros siguen agolpados frente a una puerta en falla.", rams:"La atención inicial le corresponde a la estación.", ref:REG},
     {t:"Intentar abrir la puerta a la fuerza para que los pasajeros pasen.", q:"bad", min:0, barrera:true,
      fb:"Forzar una PDAP puede dejarla abierta frente a la vía cuando el tren se vaya.", rams:"No se fuerza una barrera física.", ref:REG}
    ]},
   {hora:"08:06", texto:"Los pasajeros siguen esperando frente a la puerta dañada. ¿Qué hace?",
    ops:[
     {t:"Hacer anuncios y guiar a los pasajeros para subir y bajar por los módulos habilitados.", q:"best", min:0,
      fb:"Es parte de las actividades del AUX ante una falla de PDAP.", rams:"Gestionar el flujo evita aglomeraciones y retrasos.", ref:REG},
     {t:"Dejar que los pasajeros se organicen solos.", q:"ok", min:2,
      fb:"Sin orientación, la gente se acumula y el tren tarda más en salir.", rams:"Disponibilidad: cada segundo de parada suma.", ref:REG},
     {t:"Pedir a los pasajeros que esperen el siguiente tren frente a esa misma puerta.", q:"ok", min:3,
      fb:"La puerta seguirá en falla con el siguiente tren. Se crea una aglomeración frente a un módulo inhabilitado.", rams:"Prevenir el riesgo de aglomeración.", ref:REG}
    ]},
   {hora:"08:08", texto:"Mantenimiento tardará en llegar. ¿Qué hace con la puerta?",
    ops:[
     {t:"Notificar al CCO y pedir autorización. Solo con ella, aislar la puerta, señalizar el módulo y verificar el espacio entre la PDAP y el tren.", q:"best", min:1,
      fb:"El aislamiento de una PDAP requiere autorización del CCO.", rams:"Un cambio en la configuración de la estación se autoriza antes de hacerse.", ref:REG},
     {t:"Aislar la puerta de inmediato para ganar tiempo y avisar después.", q:"bad", min:0, barrera:true,
      fb:"Aislar sin autorización cambia el estado de la estación sin que el CCO lo sepa.", rams:"Nada se cambia por cuenta propia.", ref:REG},
     {t:"Usar el Panel de Control Local (PCL) para forzar el estado de las puertas y dejar salir el tren.", q:"bad", min:0, barrera:true,
      fb:"El PCL solo se opera por instrucción expresa del CCO. Su apertura genera alerta en el CCO.", rams:"Los mandos de seguridad tienen dueño.", ref:REG}
    ]},
   {hora:"08:15", texto:"La puerta quedó aislada y señalizada. ¿Qué hace con la información?",
    ops:[
     {t:"Reportar al JET la falla y el aislamiento (hora, módulo, vía y acciones tomadas) para que quede en el Registro Diario, y mantener vigilado el módulo aislado.", q:"best", min:0,
      fb:"La falla, el aislamiento y el uso de puertas son eventos de reporte obligatorio al JET.", rams:"FRACAS empieza con su reporte.", ref:REG},
     {t:"No reportarlo, porque mantenimiento ya sabe.", q:"bad", min:0,
      fb:"El reporte es obligatorio aunque otros lo sepan. Sin registro no hay trazabilidad.", rams:"Si no está registrado, no existe para el análisis.", ref:REG},
     {t:"Reportarlo solo si la puerta vuelve a fallar.", q:"bad", min:0,
      fb:"La primera falla ya es información. Si se repite, el reporte anterior ayuda a encontrar la causa.", rams:"Si se repite, no es mala suerte: es una señal.", ref:REG}
    ]}
  ],
  reporte:{titulo:"Reporte al Jefe de Estación de Turno", emisor:"AUX – Estación E08", hora:"08:05",
   ubicaciones:["Estación E08 – vía 1","Estación E08 – vía 2","Estación E07 – vía 1","Estación E09 – vía 1"], ubicacion:"Estación E08 – vía 1",
   categorias:["Incidente – alarma de fallo"], receptores:["Jefe de Estación de Turno (JET)"], canales:["Radio TETRA","Presencial"],
   claves:["puerta","pdap","modulo","módulo","12","aisl"]},
  leccion:"Ante una falla de PDAP: asegurar la zona, guiar a los pasajeros, aislar solo con autorización del CCO y reportar al JET. Primero la operación segura, luego la reparación."
 },

 {id:"aux-via", rol:"aux", titulo:"Objeto y persona en la vía",
  resumen:"A una usuaria se le cae el celular a la vía en la Estación E12 y su acompañante intenta bajar.",
  ref:REG,
  contexto:"Hora punta de la tarde. Usted es Auxiliar de Estación (AUX) en la Estación E12, plataforma de la vía 2.",
  minBase:0,
  pasos:[
   {hora:"17:40", situ:"Una usuaria le dice que se le cayó el celular a la vía. El próximo tren llega en tres minutos.",
    texto:"¿Qué hace?",
    ops:[
     {t:"No bajar ni dejar que nadie baje; mantener a la usuaria detrás de la franja de seguridad e informar al JET y al CCO para recuperar el objeto de forma segura más tarde.", q:"best", min:0,
      fb:"Un objeto que no afecta la circulación no justifica detener trenes, y el ingreso a la vía solo se hace por instrucción expresa del CCO.", rams:"Proporcionalidad y control del acceso a la vía.", ref:REG},
     {t:"Presionar el RCE de plataforma para detener los trenes y bajar a recoger el celular.", q:"bad", min:6, barrera:true,
      fb:"El reglamento prohíbe usar el RCE para recuperar un objeto que no afecta la circulación, y nadie baja a la vía sin instrucción expresa y corte de energía.", rams:"Los dispositivos de emergencia son para emergencias.", ref:REG},
     {t:"Bajar rápido a recogerlo antes de que llegue el tren.", q:"bad", min:0, barrera:true,
      fb:"Riesgo de atropello y de electrocución con el tercer riel. Ningún objeto vale ese riesgo.", rams:"La vida primero.", ref:REG}
    ]},
   {hora:"17:42", alarma:"El acompañante de la usuaria salta a la vía para buscar el celular. El tren se aproxima a la estación.",
    texto:"¿Qué hace?",
    ops:[
     {t:"Accionar de inmediato el RCE de plataforma más cercano y notificar al CCO enseguida.", q:"best", min:5,
      fb:"Intrusión en la vía con riesgo inminente: el personal de estación está habilitado para accionar el RCE sin esperar autorización, notificando de inmediato.", rams:"Ante riesgo inminente, actuar primero y notificar después.", ref:REG},
     {t:"Llamar primero al CCO para pedir autorización de accionar el RCE.", q:"bad", min:5, barrera:true,
      fb:"Con una persona en la vía y un tren llegando, no hay tiempo para pedir autorización. El reglamento lo faculta para accionar el RCE de inmediato.", rams:"Hay decisiones que no se delegan cuando hay una vida en riesgo.", ref:REG},
     {t:"Gritarle a la persona que suba y esperar a ver si lo logra.", q:"bad", min:0, barrera:true,
      fb:"Si no alcanza a subir, el tren no habrá recibido ninguna orden de frenado.", rams:"Las barreras se activan antes del accidente, no después.", ref:REG}
    ]},
   {hora:"17:45", situ:"La persona ya subió a la plataforma, sin lesiones. El tren está detenido antes de la estación.",
    texto:"¿Cómo se restablece el RCE?",
    ops:[
     {t:"Verificar con el JET que la plataforma y la zona de vía están despejadas y pedir autorización al CCO para restablecer el dispositivo.", q:"best", min:2,
      fb:"El restablecimiento de un dispositivo de emergencia requiere autorización del CCO, después de verificar que la zona está segura.", rams:"Restablecer también es una decisión de seguridad.", ref:REG},
     {t:"Restablecerlo usted mismo apenas la persona sube.", q:"bad", min:0, barrera:true,
      fb:"Sin verificar la vía ni avisar al CCO, el tren podría avanzar con algo o alguien más en la zona.", rams:"Quien restablece debe estar seguro de que el peligro terminó.", ref:REG},
     {t:"Dejarlo activado hasta que llegue la policía.", q:"ok", min:12,
      fb:"El peligro ya pasó y la línea sigue detenida sin necesidad. El reglamento busca restablecer los RCE en menos de 5 minutos una vez se cumplen las condiciones.", rams:"Disponibilidad: no prolongar una detención innecesaria.", ref:REG}
    ]},
   {hora:"17:50", texto:"La operación se normalizó. ¿Qué reporta?",
    ops:[
     {t:"Reportar al JET la activación del RCE, la persona en la vía y el objeto (horas, vía y acciones), para el Registro Diario.", q:"best", min:0,
      fb:"Toda activación de RCE, la presencia de personas u objetos en vía y el restablecimiento son eventos de reporte obligatorio.", rams:"El reporte permite revisar si la barrera funcionó como debía.", ref:REG},
     {t:"No reportar la activación, porque estuvo justificada.", q:"bad", min:0,
      fb:"Se reporta toda activación: justificada, por falsa alarma o accidental.", rams:"Lo que no se registra no se aprende.", ref:REG},
     {t:"Reportar solo el celular perdido.", q:"bad", min:0,
      fb:"Lo más importante del evento fue la intrusión en la vía y la activación del RCE.", rams:"Un reporte incompleto es un reporte incorrecto.", ref:REG}
    ]}
  ],
  reporte:{titulo:"Reporte al Jefe de Estación de Turno", emisor:"AUX – Estación E12", hora:"17:42",
   ubicaciones:["Estación E12 – vía 1","Estación E12 – vía 2","Estación E11 – vía 2","Estación E13 – vía 2"], ubicacion:"Estación E12 – vía 2",
   categorias:["Novedad operativa","Otros"], receptores:["Jefe de Estación de Turno (JET)"], canales:["Radio TETRA","Presencial"],
   claves:["rce","via","vía","persona","celular","objeto"]},
  leccion:"Un objeto en la vía no justifica detener trenes ni bajar. Una persona en la vía sí: RCE de inmediato y aviso al CCO. Restablecer solo con autorización y reportar todo, aunque haya salido bien."
 }
];

