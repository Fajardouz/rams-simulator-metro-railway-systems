"use strict";
/* ============================================================
   RAMA: EJERCICIOS TEÓRICOS RAMS
   Este es el único archivo que hay que editar para alimentar esta rama.

   Cada ejercicio es un bloque { ... } dentro de "ejercicios". Hay dos tipos:

   1) tipo:"colocar"  → el participante arrastra fichas a casillas.
      forma: "v"         ciclo en V. Cada casilla lleva nivel (fila, 1 = arriba) y lado ("izq", "der" o "centro").
             "lista"     emparejar: cada casilla muestra una etiqueta (definición) y recibe una ficha (término).
             "secuencia" ordenar pasos: las casillas son Paso 1, Paso 2…
      casillas: [{id:"...", etiqueta:"...", nivel:1, lado:"izq"}]
      fichas:   [{texto:"...", casilla:"id de la casilla correcta"}]
                Una ficha sin casilla (casilla:null) es un distractor: no va en ninguna parte.

   2) tipo:"preguntas" → selección múltiple.
      preguntas: [{p:"pregunta", opciones:["A","B","C"], correcta:0, explicacion:"...", ref:"..."}]
      correcta es la posición de la opción buena, empezando en 0.

   Campos comunes: id (único), titulo, resumen (texto corto de la tarjeta),
   instrucciones, explicacion (se muestra al revisar), leccion (mensaje final).
   ============================================================ */
var RAMA = {
  titulo: "Ejercicios teóricos RAMS",
  actividad: "Teoría RAMS",
  descripcion: "Repase la base del RAMS ferroviario: el ciclo de vida en V de la EN 50126, qué significa cada letra y cómo se calculan los indicadores.",
  ejercicios: [

    {
      id: "ciclo-v",
      tipo: "colocar",
      forma: "v",
      titulo: "Ciclo de vida en V (EN 50126)",
      resumen: "Ubique las 12 fases del ciclo de vida RAMS en su posición en la V.",
      instrucciones: "La rama izquierda baja desde el concepto hasta el diseño; la fabricación está en el fondo; la rama derecha sube con la integración, la validación y la aceptación, y termina en la operación y el desmantelamiento. Cada fase de la derecha se verifica contra su par de la izquierda, en la misma fila.",
      tituloIzq: "↓ Definición y diseño",
      tituloDer: "Integración, validación y operación ↑",
      casillas: [
        {id:"f1",  etiqueta:"Fase 1",  nivel:1, lado:"izq"},
        {id:"f12", etiqueta:"Fase 12", nivel:1, lado:"der"},
        {id:"f2",  etiqueta:"Fase 2",  nivel:2, lado:"izq"},
        {id:"f11", etiqueta:"Fase 11", nivel:2, lado:"der"},
        {id:"f3",  etiqueta:"Fase 3",  nivel:3, lado:"izq"},
        {id:"f10", etiqueta:"Fase 10", nivel:3, lado:"der"},
        {id:"f4",  etiqueta:"Fase 4",  nivel:4, lado:"izq"},
        {id:"f9",  etiqueta:"Fase 9",  nivel:4, lado:"der"},
        {id:"f5",  etiqueta:"Fase 5",  nivel:5, lado:"izq"},
        {id:"f8",  etiqueta:"Fase 8",  nivel:5, lado:"der"},
        {id:"f6",  etiqueta:"Fase 6",  nivel:6, lado:"izq"},
        {id:"f7",  etiqueta:"Fase 7",  nivel:7, lado:"centro"}
      ],
      fichas: [
        {texto:"Concepto", casilla:"f1"},
        {texto:"Definición del sistema y contexto operacional", casilla:"f2"},
        {texto:"Análisis y evaluación de riesgos", casilla:"f3"},
        {texto:"Especificación de requisitos del sistema", casilla:"f4"},
        {texto:"Arquitectura y asignación de requisitos", casilla:"f5"},
        {texto:"Diseño e implementación", casilla:"f6"},
        {texto:"Fabricación", casilla:"f7"},
        {texto:"Integración", casilla:"f8"},
        {texto:"Validación del sistema", casilla:"f9"},
        {texto:"Aceptación del sistema", casilla:"f10"},
        {texto:"Operación, mantenimiento y seguimiento del desempeño", casilla:"f11"},
        {texto:"Desmantelamiento", casilla:"f12"}
      ],
      explicacion: "La EN 50126-1 organiza el ciclo de vida en 12 fases. Lo que se define a la izquierda se demuestra a la derecha: la integración se contrasta con la arquitectura, la validación con los requisitos del sistema y la aceptación con el análisis de riesgos.",
      leccion: "Un cambio en operación (fase 11) obliga a volver a la fase de la V que afecta y a recorrer otra vez la verificación y la validación correspondientes."
    },

    {
      id: "letras-rams",
      tipo: "colocar",
      forma: "lista",
      titulo: "¿Qué significa cada letra de RAMS?",
      resumen: "Empareje Fiabilidad, Disponibilidad, Mantenibilidad y Seguridad con su definición.",
      instrucciones: "Lleve cada término a la definición que le corresponde. Hay una ficha que no corresponde a ninguna definición.",
      casillas: [
        {id:"r", etiqueta:"Capacidad de un elemento para cumplir una función requerida, en condiciones dadas, durante un intervalo de tiempo dado."},
        {id:"a", etiqueta:"Capacidad de estar en condiciones de cumplir una función requerida en un instante o intervalo dado, si se cuenta con los recursos externos necesarios."},
        {id:"m", etiqueta:"Capacidad de ser conservado o devuelto a un estado en el que cumple la función requerida, cuando el mantenimiento se hace en condiciones y con procedimientos y recursos establecidos."},
        {id:"s", etiqueta:"Ausencia de un riesgo inaceptable de daño a las personas."}
      ],
      fichas: [
        {texto:"Fiabilidad (Reliability)", casilla:"r"},
        {texto:"Disponibilidad (Availability)", casilla:"a"},
        {texto:"Mantenibilidad (Maintainability)", casilla:"m"},
        {texto:"Seguridad (Safety)", casilla:"s"},
        {texto:"Protección (Security)", casilla:null}
      ],
      explicacion: "Fiabilidad y mantenibilidad determinan la disponibilidad. La seguridad (safety) habla de daño a las personas; la protección (security) trata de amenazas intencionales y no es una de las letras de RAMS.",
      leccion: "La disponibilidad no se mejora sola: sube cuando el equipo falla menos (fiabilidad) o se recupera más rápido (mantenibilidad)."
    },

    {
      id: "indicadores",
      tipo: "colocar",
      forma: "lista",
      titulo: "Indicadores RAM",
      resumen: "Relacione MTBF, MTTR, tasa de fallas y disponibilidad con su definición.",
      instrucciones: "Lleve cada indicador a la descripción correcta.",
      casillas: [
        {id:"mtbf", etiqueta:"Tiempo medio de funcionamiento entre dos fallas consecutivas."},
        {id:"mttr", etiqueta:"Tiempo medio para restaurar el equipo después de una falla."},
        {id:"lam",  etiqueta:"Número de fallas por unidad de tiempo; con tasa constante es 1 / MTBF."},
        {id:"disp", etiqueta:"Proporción del tiempo en que el equipo puede cumplir su función: MTBF / (MTBF + MTTR)."}
      ],
      fichas: [
        {texto:"MTBF", casilla:"mtbf"},
        {texto:"MTTR", casilla:"mttr"},
        {texto:"Tasa de fallas (λ)", casilla:"lam"},
        {texto:"Disponibilidad inherente (Ai)", casilla:"disp"}
      ],
      explicacion: "Ejemplo: con MTBF = 990 h y MTTR = 10 h, la disponibilidad inherente es 990 / (990 + 10) = 0,99, es decir, 99 %.",
      leccion: "Reducir el MTTR (repuestos a mano, procedimientos claros, personal entrenado) mejora la disponibilidad aunque el equipo falle lo mismo."
    },

    {
      id: "conceptos",
      tipo: "preguntas",
      titulo: "Conceptos clave RAMS",
      resumen: "Cinco preguntas sobre V&V, registro de peligros, SIL y gestión de cambios.",
      preguntas: [
        {p:"¿Cuál es la diferencia entre verificación y validación?",
         opciones:["Son lo mismo; se usan como sinónimos.",
                   "Verificación: confirmar que lo producido en una fase cumple los requisitos de esa fase. Validación: confirmar que el sistema cumple los requisitos para su uso previsto.",
                   "La verificación la hace el cliente y la validación el proveedor.",
                   "La validación se hace solo en el diseño y la verificación solo en operación."],
         correcta:1,
         explicacion:"Se resume como: verificar es «¿lo construimos bien?»; validar es «¿construimos lo correcto?».",
         ref:"EN 50126-1"},
        {p:"¿Qué es el registro de peligros (Hazard Log)?",
         opciones:["Una lista de accidentes ya ocurridos.",
                   "El documento vivo donde se registran los peligros identificados, su riesgo, las medidas de control y su estado de cierre.",
                   "El libro de novedades del turno de operación.",
                   "Un informe que se hace una sola vez al inicio del proyecto."],
         correcta:1,
         explicacion:"Se mantiene durante todo el ciclo de vida y se actualiza con cada cambio, hallazgo o incidente."},
        {p:"¿Qué indica el SIL (nivel de integridad de seguridad) de una función?",
         opciones:["El costo de la función.",
                   "Cuántas personas la operan.",
                   "El nivel de rigor exigido a una función de seguridad: va de 1 a 4, y 4 es el más exigente.",
                   "La disponibilidad del equipo en porcentaje."],
         correcta:2,
         explicacion:"A mayor SIL, más exigentes son las técnicas de diseño, verificación y validación que se deben aplicar."},
        {p:"Se quiere modificar un equipo que ya está en operación. Desde RAMS, ¿qué es lo correcto?",
         opciones:["Hacer el cambio y, si funciona, no documentarlo.",
                   "Evaluar el impacto del cambio en RAMS, actualizar los análisis y el registro de peligros afectados, y repetir la verificación y validación necesarias antes de ponerlo en servicio.",
                   "Esperar a que el equipo falle para cambiarlo.",
                   "Pedir solo la aprobación del área de compras."],
         correcta:1,
         explicacion:"Todo cambio pasa por la gestión de cambios: análisis de impacto, actualización de la documentación y V&V proporcional al cambio."},
        {p:"¿Cuál de estas acciones mejora principalmente la MANTENIBILIDAD?",
         opciones:["Usar componentes con menor tasa de fallas.",
                   "Diseñar módulos de cambio rápido y tener repuestos y procedimientos de reparación claros.",
                   "Agregar más trenes a la flota.",
                   "Aumentar la velocidad de operación."],
         correcta:1,
         explicacion:"La mantenibilidad se refleja en el MTTR: cuanto más fácil y rápido sea restaurar el equipo, mejor."}
      ],
      leccion: "RAMS es un proceso que acompaña todo el ciclo de vida; no es un informe que se entrega una sola vez."
    }

  ]
};
