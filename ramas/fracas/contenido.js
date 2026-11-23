"use strict";
/* ============================================================
   RAMA: REPORTES DE FALLA (FRACAS)
   FRACAS = Failure Reporting, Analysis and Corrective Action System
   (sistema de reporte, análisis y acción correctiva de fallas).

   Este es el único archivo que hay que editar para alimentar esta rama.
   Usa los mismos tipos que la rama de teoría (vea la explicación en ramas/teoria/contenido.js):
   - tipo:"colocar"   con forma "secuencia" o "lista"
   - tipo:"preguntas" que además acepta:
       contexto: texto del caso
       reporte:  {"Campo":"Valor", ...}  se muestra como una tabla de reporte de falla
   Los datos de los reportes de ejemplo son ficticios.
   ============================================================ */
var RAMA = {
  titulo: "Reportes de falla (FRACAS)",
  actividad: "FRACAS",
  descripcion: "Practique cómo se reporta, analiza y cierra una falla para que no se repita y para que los indicadores RAM sean confiables.",
  ejercicios: [

    {
      id: "ciclo-fracas",
      tipo: "colocar",
      forma: "secuencia",
      titulo: "Los pasos del ciclo FRACAS",
      resumen: "Ordene los pasos desde que ocurre la falla hasta que se cierra.",
      instrucciones: "Ponga los pasos en el orden correcto. Sobra una ficha que no es un paso del ciclo.",
      casillas: [{id:"p1"},{id:"p2"},{id:"p3"},{id:"p4"},{id:"p5"},{id:"p6"},{id:"p7"}],
      fichas: [
        {texto:"Reportar la falla con datos completos (qué, dónde, cuándo, síntoma, efecto en el servicio)", casilla:"p1"},
        {texto:"Registrar y verificar el reporte; clasificar la falla según el Plan RAM", casilla:"p2"},
        {texto:"Analizar la falla hasta encontrar la causa raíz", casilla:"p3"},
        {texto:"Definir la acción correctiva que elimina la causa", casilla:"p4"},
        {texto:"Implementar la acción correctiva", casilla:"p5"},
        {texto:"Verificar la eficacia: la falla no se repite en el período de seguimiento", casilla:"p6"},
        {texto:"Cerrar el reporte y actualizar indicadores, análisis RAM y registro de peligros", casilla:"p7"},
        {texto:"Cerrar la orden de trabajo apenas el equipo vuelve a funcionar", casilla:null}
      ],
      explicacion: "El ciclo es cerrado: lo aprendido de cada falla vuelve a los análisis RAM, al plan de mantenimiento y, si aplica, al registro de peligros.",
      leccion: "Que el equipo vuelva a funcionar no significa que la falla esté resuelta. Un reporte FRACAS se cierra cuando se comprobó que la causa fue eliminada."
    },

    {
      id: "tipos-accion",
      tipo: "colocar",
      forma: "lista",
      titulo: "Contención, causa raíz, corrección y eficacia",
      resumen: "Clasifique cada acción tomada ante una falla de puerta.",
      instrucciones: "Caso: una puerta de tren no cierra. Lleve cada acción a la etapa del tratamiento de la falla que le corresponde.",
      casillas: [
        {id:"cont", etiqueta:"Acción inmediata (contención): mantener el servicio de forma segura."},
        {id:"raiz", etiqueta:"Análisis de causa raíz: entender por qué ocurrió."},
        {id:"corr", etiqueta:"Acción correctiva: eliminar la causa para que no se repita."},
        {id:"efic", etiqueta:"Verificación de eficacia: comprobar que la acción funcionó."}
      ],
      fichas: [
        {texto:"Aislar y condenar la puerta según el procedimiento y continuar el servicio", casilla:"cont"},
        {texto:"Aplicar los 5 porqués: el sensor de fin de carrera se desajusta por vibración", casilla:"raiz"},
        {texto:"Cambiar el soporte del sensor en la flota y ajustar el plan de mantenimiento", casilla:"corr"},
        {texto:"Hacer seguimiento por tres meses sin que la falla se repita", casilla:"efic"}
      ],
      explicacion: "La contención protege el servicio hoy; la acción correctiva evita que la falla vuelva. Sin análisis de causa raíz, la «solución» suele ser solo un reinicio.",
      leccion: "Reiniciar o resetear un equipo es una acción inmediata, no una acción correctiva."
    },

    {
      id: "reporte-puerta",
      tipo: "preguntas",
      titulo: "Corrija el reporte: puerta que no cierra",
      resumen: "Revise un reporte de falla real (ficticio) y decida qué está mal y qué sigue.",
      contexto: "El siguiente reporte llegó al equipo RAMS para su análisis. Revíselo y responda.",
      reporte: {
        "N.º de reporte": "FR-0001",
        "Fecha": "Martes",
        "Tren / coche": "Tren 05",
        "Equipo": "Puerta",
        "Síntoma": "La puerta no cierra; alarma de puerta en cabina",
        "Efecto en el servicio": "Retraso de 4 minutos",
        "Acción inmediata": "El conductor aisló la puerta",
        "Causa": "Desconocida",
        "Acción correctiva": "Reset; funcionó",
        "Estado": "Cerrado"
      },
      preguntas: [
        {p:"¿Qué datos le faltan al reporte para poder analizar la falla?",
         opciones:["El nombre del pasajero que vio la falla.",
                   "La fecha completa y la hora, la ubicación (estación o tramo), el coche y la puerta exactos, y la identificación del componente.",
                   "El color del tren.",
                   "No le falta nada; está completo."],
         correcta:1,
         explicacion:"Sin fecha y hora exactas, ubicación e identificación del equipo no se pueden cruzar datos ni detectar fallas repetitivas en la misma puerta."},
        {p:"La acción correctiva registrada es «Reset; funcionó». ¿Es suficiente para cerrar el reporte?",
         opciones:["Sí, porque el equipo volvió a funcionar.",
                   "No. El reset es una acción inmediata; falta encontrar la causa raíz y definir una acción que evite que se repita.",
                   "Sí, si el conductor está de acuerdo.",
                   "No, porque hay que cambiar todas las puertas del tren."],
         correcta:1,
         explicacion:"Si la causa queda «desconocida» y el reporte se cierra, la falla volverá y los indicadores de fiabilidad no reflejarán el problema real."},
        {p:"¿Cómo se decide si esta falla cuenta en los indicadores RAM?",
         opciones:["No cuenta porque el retraso fue corto.",
                   "Solo cuenta si hubo heridos.",
                   "Se clasifica según los criterios definidos en el Plan RAM (por ejemplo, falla relevante o no relevante y su efecto en el servicio).",
                   "Cuenta siempre el doble."],
         correcta:2,
         explicacion:"La clasificación no se hace a criterio de cada persona: sigue las definiciones acordadas en el Plan RAM, para que los indicadores sean comparables."},
        {p:"Al revisar el histórico, encuentra tres reportes iguales en la misma puerta este mes. ¿Qué hace?",
         opciones:["Nada; cada reporte ya se cerró.",
                   "Tratarla como falla repetitiva: abrir un análisis de causa raíz (5 porqués, Ishikawa), definir la acción correctiva y hacer seguimiento.",
                   "Pedir al conductor que no reporte más esa puerta.",
                   "Cambiar el tren de línea."],
         correcta:1,
         explicacion:"Las fallas repetitivas son la señal más clara de que se cerraron reportes sin eliminar la causa."},
        {p:"¿Cuándo debe quedar el reporte en estado «Cerrado»?",
         opciones:["Cuando el tren vuelve al servicio.",
                   "Cuando se implementó la acción correctiva, se verificó su eficacia y se actualizaron los registros e indicadores.",
                   "Al final del turno.",
                   "Cuando pasan 24 horas sin quejas."],
         correcta:1,
         explicacion:"El cierre es la última etapa del ciclo FRACAS y exige evidencia de que la acción funcionó."}
      ],
      leccion: "Un buen reporte responde qué, dónde, cuándo, con qué efecto y por qué; y solo se cierra con evidencia."
    }

  ]
};
