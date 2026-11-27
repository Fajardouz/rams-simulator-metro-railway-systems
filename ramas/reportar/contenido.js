"use strict";
/* ============================================================
   RAMA: ¿ESTO SE REPORTA? (Sesión 5 · Después del reporte)
   Este es el único archivo que hay que editar para alimentar esta rama.

   El participante elige su especialidad y recorre situaciones cortas de su puesto.
   En cada una responde dos preguntas:
     1. ¿Qué es?        (uno de los TIPOS)
     2. ¿A quién se reporta? (uno de los receptores de su especialidad; no aplica si tipo = "nada")
   Recibe la explicación de inmediato y, si se equivocó, puede intentarlo otra vez.
   El puntaje cuenta solo el primer intento.

   Formato de cada situación (en SITUACIONES[rol]):
     {texto:"...", tipo:"falla" | "incidente" | "cuasi" | "nada", a:"receptor correcto",
      propio:true (opcional: el error es del propio participante), fb:"explicación"}
   Las situaciones son HIPOTÉTICAS, con fines de formación. A quién se reporta cada
   evento debe validarse con el procedimiento vigente de cada área.
   ============================================================ */
var REPORTAR = {
  titulo: "¿Esto se reporta?",
  actividad: "Esto se reporta",
  descripcion: "Situaciones de todos los días en su puesto: decida qué son y a quién se reportan. Incluye errores propios.",
  leccion: "Se reporta la falla, se reporta lo que afectó el servicio y se reporta lo que pudo pasar y no pasó. El error propio también se reporta: el objetivo es corregir el sistema para que no le pase a nadie más, no buscar culpables.",

  TIPOS: {
    falla:     {n:"Falla de un equipo", d:"Un equipo no funcionó como debía, aunque se haya recuperado solo."},
    incidente: {n:"Incidente", d:"Hubo una consecuencia: afectó el servicio, causó un daño o lesionó a alguien."},
    cuasi:     {n:"Cuasi-incidente", d:"No pasó nada, pero pudo pasar. Nadie salió herido y nada se dañó."},
    nada:      {n:"No es un evento para reportar", d:"Es parte normal del trabajo y no hay nada que corregir."}
  },

  ROLES: {
    cco: {nombre:"Controlador CCO", desc:"Situaciones del Centro de Control.", receptores:["Jefe de turno del CCO","Controlador de Mantenimiento"]},
    cot: {nombre:"Conductor a bordo", desc:"Situaciones a bordo del tren.", receptores:["CCO","Capitán de Trenes (CAP)"]},
    aux: {nombre:"Auxiliar de estación", desc:"Situaciones en la estación.", receptores:["Jefe de Estación de Turno (JET)","CCO"]}
  },

  SITUACIONES: {
    cco: [
      {texto:"Al dar una orden por radio, usted dijo «vía uno» cuando quería decir «vía dos». El conductor colacionó «vía uno», usted notó el error y lo corrigió antes de que el tren se moviera.", tipo:"cuasi", a:"Jefe de turno del CCO", propio:true,
       fb:"No pasó nada, pero pudo pasar: un tren autorizado hacia la vía equivocada. La colación funcionó como barrera. Reportarlo ayuda a revisar si algo en la consola o en la carga de trabajo facilita ese error."},
      {texto:"El BCA 2 de la Estación E07 queda bloqueado. La estación lo reinicia según el procedimiento y vuelve a funcionar.", tipo:"falla", a:"Controlador de Mantenimiento",
       fb:"El equipo falló, aunque se haya recuperado al reiniciarlo. Si no se reporta, nadie sabrá si se repite."},
      {texto:"Un tren queda retenido 4 minutos en E05 por una falla de puertas.", tipo:"incidente", a:"Controlador de Mantenimiento",
       fb:"Hubo afectación al servicio: es un incidente. Se registra en el Registro Diario y mantenimiento recibe la falla de la puerta."},
      {texto:"Un pasajero llama por el interfono de la estación para preguntar el horario del último tren.", tipo:"nada",
       fb:"Se atiende y listo. Es parte normal del servicio: no hay ningún equipo ni procedimiento que corregir."},
      {texto:"Por cámara ve a un técnico entrar a un cuarto técnico de la Estación E09. En el CCO no hay ningún permiso de trabajo registrado para esa zona.", tipo:"cuasi", a:"Jefe de turno del CCO",
       fb:"No pasó nada, pero un trabajo sin permiso registrado puede terminar en un accidente o en un equipo desactivado sin que nadie lo sepa."},
      {texto:"El detector de humo del andén de la Estación E02 da una falsa alarma por tercera vez en la semana, siempre durante la limpieza.", tipo:"falla", a:"Controlador de Mantenimiento",
       fb:"Una falsa alarma repetida es una falla: del detector o de cómo se limpia cerca de él. Reportar la repetición es lo que permite corregirla."},
      {texto:"En la Estación E05 un pasajero metió el brazo entre las puertas del tren cuando se cerraban. Las puertas se reabrieron y el pasajero no se lastimó.", tipo:"cuasi", a:"Jefe de turno del CCO",
       fb:"La detección de obstáculos funcionó y no hubo lesión, pero pudo haberla. Si se repite en una estación, puede indicar que hace falta más información al pasajero o más personal en hora punta."},
      {texto:"Al revisar el Registro Diario se da cuenta de que ayer olvidó registrar una novedad de su turno: una alarma de PDAP que se normalizó sola.", tipo:"falla", a:"Controlador de Mantenimiento", propio:true,
       fb:"La alarma fue una falla del equipo y debe quedar registrada. Registrarla tarde es mejor que no registrarla nunca: se anota indicando que se registra al día siguiente y por qué."}
    ],
    cot: [
      {texto:"Conduciendo en modo EM, se pasó unos metros del punto de parada en E08. Detuvo el tren antes de abrir las puertas y lo corrigió con autorización del CCO.", tipo:"cuasi", a:"CCO", propio:true,
       fb:"No pasó nada porque no abrió las puertas, pero pudo pasar. Reportarlo ayuda a revisar si la señalización del punto de parada o la práctica en modo EM se pueden mejorar."},
      {texto:"Al pasar entre E07 y E08 por la vía 1 siente un golpe fuerte bajo el tren. El tren sigue normal.", tipo:"falla", a:"CCO",
       fb:"Puede ser una falla de la vía o del tren. El tren siguió normal, pero si otros conductores sienten lo mismo, su reporte es el que permite ver el patrón."},
      {texto:"Una pasajera se desmaya dentro del tren. La atiende el personal de la Estación E04 y el tren queda retenido 3 minutos.", tipo:"incidente", a:"CCO",
       fb:"Hubo una persona afectada y retraso en el servicio: es un incidente. Se reporta al CCO de inmediato."},
      {texto:"En el patio, durante la prueba de frenos antes de salir, aparece un aviso de freno que se borra solo a los pocos segundos.", tipo:"falla", a:"Capitán de Trenes (CAP)",
       fb:"Aunque se haya borrado, el equipo dio un aviso. Se reporta antes de salir a la línea, para que se decida si el tren puede prestar servicio."},
      {texto:"Un pasajero le pregunta por el interfono en qué estación debe bajarse para llegar a un hospital.", tipo:"nada",
       fb:"Se atiende y listo. Es parte normal del servicio."},
      {texto:"El CCO le da una orden y usted colaciona un número de estación equivocado. El CCO lo corrige y usted repite bien la orden.", tipo:"cuasi", a:"CCO", propio:true,
       fb:"La colación detectó el error a tiempo: la barrera funcionó. Reportarlo sirve para ver si hay órdenes o nombres que se prestan a confusión."},
      {texto:"Una puerta del tren se reabre por una mochila atrapada en E03. Se resuelve en un minuto y el tren sale con ese retraso.", tipo:"incidente", a:"CCO",
       fb:"Hubo un pequeño retraso en el servicio: es un incidente menor. Queda registrado, y si se repite en una estación ayuda a decidir medidas de información."},
      {texto:"En el relevo, el compañero que le entrega el tren le comenta que «frena raro» al llegar a las estaciones, pero no lo reportó.", tipo:"falla", a:"Capitán de Trenes (CAP)",
       fb:"Ahora usted sabe de una posible falla. Si no la reporta, nadie más lo hará. Se reporta con lo que le dijeron y con lo que usted observe."}
    ],
    aux: [
      {texto:"Un pasajero se resbala en el piso mojado del vestíbulo. No había aviso de piso mojado. No se lastima.", tipo:"cuasi", a:"Jefe de Estación de Turno (JET)",
       fb:"No pasó nada, pero pudo haber una lesión. Reportarlo permite revisar cómo y cuándo se señaliza el piso mojado."},
      {texto:"Una hora después de una ronda se da cuenta de que dejó abierta la puerta de un cuarto técnico. Nadie entró.", tipo:"cuasi", a:"Jefe de Estación de Turno (JET)", propio:true,
       fb:"No pasó nada, pero alguien sin autorización pudo entrar a un cuarto técnico. Reportar el error propio sirve para revisar cómo evitarlo, no para castigar."},
      {texto:"El BCA 1 se bloquea. Usted lo reinicia según el procedimiento y vuelve a funcionar.", tipo:"falla", a:"Jefe de Estación de Turno (JET)",
       fb:"El equipo falló, aunque se haya recuperado. Si no se reporta, nadie sabrá si se bloquea todos los días."},
      {texto:"Una pasajera se cae en la escalera 1 y se lastima la rodilla. Recibe atención en la estación.", tipo:"incidente", a:"CCO",
       fb:"Hubo una persona lesionada: es un incidente. Se informa de inmediato al CCO y al JET, según el procedimiento."},
      {texto:"Un pasajero pregunta cómo recargar su tarjeta.", tipo:"nada",
       fb:"Se atiende y listo. Es parte normal del servicio."},
      {texto:"La escalera 2 se detiene sola y a los pocos minutos arranca sola otra vez.", tipo:"falla", a:"Jefe de Estación de Turno (JET)",
       fb:"Una falla que «se arregla sola» se reporta igual: es una falla intermitente, y son las más difíciles de diagnosticar sin reportes."},
      {texto:"En la ronda, al probar el interfono del andén de la vía 2, no hay respuesta.", tipo:"falla", a:"Jefe de Estación de Turno (JET)",
       fb:"Un interfono que no funciona deja a los pasajeros sin una forma de pedir ayuda. Se reporta de inmediato."},
      {texto:"Un compañero le cuenta que ayer dejó un carro de limpieza delante de la salida de emergencia durante dos horas y se le olvidó.", tipo:"cuasi", a:"Jefe de Estación de Turno (JET)",
       fb:"No pasó nada, pero la salida de emergencia estuvo bloqueada. Se reporta aunque el error no haya sido suyo: lo importante es que no vuelva a pasar."}
    ]
  }
};
