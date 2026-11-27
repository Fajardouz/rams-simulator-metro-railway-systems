"use strict";
/* ============================================================
   MOTOR DEL TALLER DE REPORTE
   Lee window.TALLER (definido en contenido.js). Para cambiar o agregar relatos
   solo se edita contenido.js.
   Flujo: inicio (nombre y especialidad) → relato → reporte → resultado
          (se envía a Google Sheets, pestaña "Taller de reporte").
   ============================================================ */
(function(){
  var T = window.TALLER, h = Comun.h, app = document.getElementById("app");
  var S = {nombre: Comun.getNombre(), rol: null, R: null, hechos: [], acciones: [], intentos: [], ultimo: null, enviados: 0};
  var ENC = ["Fecha","Nombre","Especialidad","Relato","Puntaje (0-100)","Cuándo: fecha","Cuándo: hora","Dónde","Qué equipo",
             "Qué pasó: hechos marcados","Qué pasó: suposiciones marcadas","Qué se hizo","Cuánto afectó","¿Se repite?","Desenlace","Intento"];

  var PESOS = {fecha:10, hora:10, ubicacion:15, equipo:15, hechos:20, acciones:10, efecto:10, repeticion:10};
  var CONSEC = {
    fecha:"Sin la fecha completa no se puede ubicar el evento en el historial ni cruzarlo con otros reportes.",
    hora:"Con la hora exacta mantenimiento revisa los registros del sistema en ese minuto. Una hora equivocada lo manda a buscar donde no hay nada.",
    ubicacion:"Sin la ubicación precisa el técnico tiene que buscar el equipo y puede revisar el equivocado.",
    equipo:"Sin la identificación exacta la falla no queda asociada al historial de ese equipo, y nadie ve que se repite.",
    hechos:"Mantenimiento necesita lo que se vio, se oyó o alguien dijo, no un diagnóstico. Las suposiciones y las culpas mandan el análisis por el camino equivocado.",
    acciones:"Saber qué se hizo, y qué no, explica en qué estado quedó el equipo y evita repetir pruebas.",
    efecto:"El efecto en el servicio define la prioridad de la reparación y cuenta para los indicadores del contrato.",
    repeticion:"Una falla que «se arregla sola» y no se reporta como repetida se cierra como «no se encontró falla» y vuelve."
  };
  var NOMBRES = {fecha:"Cuándo · fecha", hora:"Cuándo · hora de inicio", ubicacion:"Dónde", equipo:"Qué equipo",
                 hechos:"Qué pasó", acciones:"Qué se hizo", efecto:"Cuánto afectó al servicio", repeticion:"¿Se repite?"};

  document.title = T.titulo + " · Simulador RAMS";
  function arriba(){ try { window.scrollTo({top:0, behavior:"smooth"}); } catch(e){ window.scrollTo(0, 0); } }
  function consec(campo){ return (S.R.consecuencias && S.R.consecuencias[campo]) || CONSEC[campo]; }

  /* ---------- Normalización de fecha y hora ---------- */
  function normFecha(txt){
    var n = (txt || "").match(/\d+/g); if(!n || n.length < 3) return "";
    var y, m, d;
    if(n[0].length === 4){ y = n[0]; m = n[1]; d = n[2]; } else { d = n[0]; m = n[1]; y = n[2]; }
    if(y.length === 2) y = "20" + y;
    return y + "/" + ("0" + Number(m)).slice(-2) + "/" + ("0" + Number(d)).slice(-2);
  }
  function minutos(hhmm){ var p = (hhmm || "").split(":"); return p.length < 2 ? NaN : Number(p[0]) * 60 + Number(p[1]); }

  /* ---------- Inicio ---------- */
  function inicio(){
    app.innerHTML = ""; arriba();
    var inp = h("input", {type:"text", id:"nombre", placeholder:"Nombre y apellido", autocomplete:"name"});
    inp.value = S.nombre;
    inp.addEventListener("input", function(){ S.nombre = inp.value; });
    var roles = h("div", {class:"grid3", role:"radiogroup", "aria-label":"Especialidad"});
    Object.keys(T.ROLES).forEach(function(k){
      var b = h("button", {type:"button", class:"choice" + (S.rol === k ? " sel" : ""), "aria-pressed": String(S.rol === k)}, [
        h("span", {class:"t", text:T.ROLES[k].nombre}), h("span", {class:"d", text:T.ROLES[k].desc})]);
      b.addEventListener("click", function(){ S.rol = k; inicio(); });
      roles.appendChild(b);
    });
    var aviso = h("p", {class:"muted", "aria-live":"polite"});
    var lista = h("div", {class:"stack"});
    if(S.rol){
      T.RELATOS.filter(function(r){ return r.rol === S.rol; }).forEach(function(r){
        var b = h("button", {type:"button", class:"case"}, [h("span", {class:"tag", text:T.ROLES[r.rol].nombre}), h("strong", {text:r.titulo}), h("span", {class:"muted", text:r.resumen})]);
        b.addEventListener("click", function(){
          var n = inp.value.trim();
          if(n.length < 3){ aviso.textContent = "Escriba su nombre antes de empezar."; inp.focus(); return; }
          S.nombre = n; Comun.setNombre(n); empezar(r);
        });
        lista.appendChild(b);
      });
    }
    app.appendChild(h("section", {class:"stack"}, [
      h("div", {class:"eyebrow", text:"Rama · Sesión 5"}),
      h("h1", {text:T.titulo}),
      h("p", {text:T.descripcion}),
      h("div", {class:"situ"}, [h("p", {text:"Va a leer lo que pasó en un turno y luego diligenciar el reporte de la falla. Al final verá su reporte junto a un reporte modelo y qué pasó con la falla según lo que usted escribió."}),
        h("p", {class:"muted", text:"Relatos hipotéticos con fines de formación. Los pasos operativos siempre siguen el procedimiento vigente."})]),
      h("div", {class:"card stack"}, [
        h("div", null, [h("label", {class:"f", for:"nombre", text:"1. Su nombre"}), inp]),
        h("div", null, [h("span", {class:"f", text:"2. Su especialidad"}), roles]),
        S.rol ? h("div", {class:"stack"}, [h("span", {class:"f", text:"3. Elija el relato"}), lista]) : null,
        aviso
      ])
    ]));
  }

  function empezar(r){
    S.R = r; S.intentos = []; S.ultimo = null; S.enviados = 0;
    S.hechos = Comun.mezclar(r.hechos); S.acciones = Comun.mezclar(r.acciones);
    relato();
  }

  /* ---------- Relato ---------- */
  function lineaTiempo(){
    var tb = h("tbody");
    S.R.relato.forEach(function(p){ tb.appendChild(h("tr", null, [h("td", {text:p.hora}), h("td", {text:p.texto})])); });
    return h("div", {class:"tablewrap"}, [h("table", null, [h("thead", null, [h("tr", null, [h("th", {text:"Hora"}), h("th", {text:"Lo que pasa"})])]), tb])]);
  }
  function relato(){
    app.innerHTML = ""; arriba();
    var b = h("button", {type:"button", class:"btn", text:"Diligenciar el reporte"});
    b.addEventListener("click", formulario);
    app.appendChild(h("section", {class:"stack"}, [
      h("div", {class:"row"}, [h("div", {class:"eyebrow", text:"Paso 1 de 3 · Lo que pasó en su turno"}), h("button", {type:"button", class:"btn ghost", text:"← Inicio", onclick:inicio})]),
      h("h2", {text:S.R.titulo}),
      h("div", {class:"situ"}, [h("p", {text:"Fecha: " + S.R.fecha + ". Usted es " + T.ROLES[S.R.rol].nombre.toLowerCase() + "."})]),
      lineaTiempo(),
      h("p", {class:"muted", text:"Lea con atención: en el reporte le pediremos estos datos. Podrá volver a ver el relato mientras lo diligencia."}),
      h("div", {class:"row"}, [h("span"), b])
    ]));
  }

  /* ---------- Formulario ---------- */
  function selectCampo(id, campo){
    var s = h("select", {id:id}); s.appendChild(h("option", {value:"", text:"Seleccione…"}));
    S.R[campo].ops.forEach(function(o){ s.appendChild(h("option", {value:o, text:o})); });
    return s;
  }
  function checks(nombre, items){
    var box = h("div", {class:"stack"});
    items.forEach(function(it, i){
      var id = nombre + "_" + i;
      box.appendChild(h("label", {class:"opt", for:id}, [h("input", {type:"checkbox", id:id, value:String(i)}), h("span", {text:it.t})]));
    });
    return box;
  }
  function grupo(titulo, ayuda, cuerpo){
    return h("div", {class:"full stack"}, [h("span", {class:"f", text:titulo}), ayuda ? h("p", {class:"muted", text:ayuda}) : null].concat(cuerpo));
  }
  function formulario(){
    app.innerHTML = ""; arriba();
    var ver = h("details", null, [h("summary", {text:"Ver otra vez lo que pasó"}), lineaTiempo()]);
    var fFecha = h("input", {type:"text", id:"r_fecha", placeholder:"aaaa/mm/dd"});
    var fHora = h("input", {type:"time", id:"r_hora"});
    var aviso = h("p", {class:"muted", "aria-live":"polite"});
    var b = h("button", {type:"button", class:"btn", text:"Enviar el reporte"});
    b.addEventListener("click", function(){
      var falta = [];
      if(!fFecha.value.trim()) falta.push("la fecha");
      if(!fHora.value) falta.push("la hora");
      ["ubicacion","equipo","efecto","repeticion"].forEach(function(c){ if(!document.getElementById("r_" + c).value) falta.push(NOMBRES[c].toLowerCase()); });
      if(!app.querySelector("#hechos input:checked")) falta.push("qué pasó");
      if(falta.length){ aviso.textContent = "Complete: " + falta.join(", ") + "."; return; }
      resultado(leer());
    });
    app.appendChild(h("section", {class:"stack"}, [
      h("div", {class:"row"}, [h("div", {class:"eyebrow", text:"Paso 2 de 3 · Su reporte"}), h("button", {type:"button", class:"btn ghost", text:"← Volver al relato", onclick:relato})]),
      h("h2", {text:"Reporte de falla · " + S.R.titulo}),
      ver,
      h("div", {class:"card"}, [h("div", {class:"formgrid"}, [
        h("div", null, [h("label", {class:"f", for:"r_fecha", text:"Cuándo · fecha"}), fFecha]),
        h("div", null, [h("label", {class:"f", for:"r_hora", text:"Cuándo · hora en que empezó"}), fHora]),
        h("div", null, [h("label", {class:"f", for:"r_ubicacion", text:"Dónde"}), selectCampo("r_ubicacion", "ubicacion")]),
        h("div", null, [h("label", {class:"f", for:"r_equipo", text:"Qué equipo (lo más exacto posible)"}), selectCampo("r_equipo", "equipo")]),
        h("div", {class:"full", id:"hechos"}, [grupo("Qué pasó", "Marque lo que pondría en el reporte. Solo lo que se vio, se oyó o alguien dijo.", [checks("h", S.hechos)])]),
        h("div", {class:"full", id:"acciones"}, [grupo("Qué se hizo", "Marque solo lo que realmente se hizo.", [checks("a", S.acciones)])]),
        h("div", null, [h("label", {class:"f", for:"r_efecto", text:"Cuánto afectó al servicio"}), selectCampo("r_efecto", "efecto")]),
        h("div", null, [h("label", {class:"f", for:"r_repeticion", text:"¿Se repite?"}), selectCampo("r_repeticion", "repeticion")])
      ])]),
      aviso,
      h("div", {class:"row"}, [h("span"), b])
    ]));
    if(S.ultimo) rellenar(S.ultimo);
  }
  /* Segundo intento: el formulario vuelve con lo que el participante escribió antes */
  function rellenar(r){
    document.getElementById("r_fecha").value = r.fecha; document.getElementById("r_hora").value = r.hora;
    ["ubicacion","equipo","efecto","repeticion"].forEach(function(c){ document.getElementById("r_" + c).value = r[c]; });
    r.hechos.forEach(function(x){ var i = S.hechos.indexOf(x); if(i >= 0) document.getElementById("h_" + i).checked = true; });
    r.acciones.forEach(function(x){ var i = S.acciones.indexOf(x); if(i >= 0) document.getElementById("a_" + i).checked = true; });
  }
  function marcados(sel, items){
    var r = []; Array.prototype.forEach.call(app.querySelectorAll(sel + " input:checked"), function(i){ r.push(items[Number(i.value)]); });
    return r;
  }
  function leer(){
    return {fecha: fFechaVal(), hora: document.getElementById("r_hora").value,
      ubicacion: document.getElementById("r_ubicacion").value, equipo: document.getElementById("r_equipo").value,
      efecto: document.getElementById("r_efecto").value, repeticion: document.getElementById("r_repeticion").value,
      hechos: marcados("#hechos", S.hechos), acciones: marcados("#acciones", S.acciones)};
  }
  function fFechaVal(){ return document.getElementById("r_fecha").value.trim(); }

  /* ---------- Calificación ---------- */
  function calificar(r){
    var R = S.R, c = {};
    c.fecha = normFecha(r.fecha) === R.fecha ? 1 : 0;
    var dm = Math.abs(minutos(r.hora) - minutos(R.hora));
    c.hora = dm <= 2 ? 1 : 0;
    ["ubicacion","equipo","efecto","repeticion"].forEach(function(k){ c[k] = r[k] === R[k].ok ? 1 : 0; });
    var nHechos = R.hechos.filter(function(x){ return x.tipo === "hecho"; }).length;
    var hOk = r.hechos.filter(function(x){ return x.tipo === "hecho"; }).length;
    var sup = r.hechos.filter(function(x){ return x.tipo === "suposicion"; }).length;
    var irr = r.hechos.filter(function(x){ return x.tipo === "irrelevante"; }).length;
    c.hechos = Math.max(0, hOk / nHechos - 0.35 * sup - 0.15 * irr);
    var nAcc = R.acciones.filter(function(x){ return x.ok; }).length;
    var aOk = r.acciones.filter(function(x){ return x.ok; }).length;
    var aMal = r.acciones.filter(function(x){ return !x.ok; }).length;
    c.acciones = Math.max(0, aOk / nAcc - 0.5 * aMal);
    var pts = 0; Object.keys(PESOS).forEach(function(k){ pts += PESOS[k] * c[k]; });
    return {c:c, pts:Math.round(pts), hOk:hOk, nHechos:nHechos, sup:sup, irr:irr, aMal:aMal};
  }

  /* ---------- Resultado ---------- */
  function resultado(r){
    app.innerHTML = ""; arriba();
    var R = S.R, k = calificar(r), c = k.c;
    var bueno = k.pts >= 80 && c.equipo === 1 && c.repeticion === 1 && k.sup === 0;

    function fila(campo, suyo, modelo){
      var ok = c[campo] >= 0.999, parcial = !ok && c[campo] > 0;
      return h("tr", null, [
        h("td", null, [h("strong", {text:NOMBRES[campo]}), h("div", null, [h("span", {class:"tag " + (ok ? "best" : parcial ? "ok" : "bad"), text: ok ? "Completo" : parcial ? "Incompleto" : "Falta o no coincide"})])]),
        h("td", {text:suyo || "—"}), h("td", {text:modelo}),
        h("td", {class:"muted", text: ok ? "" : consec(campo)})
      ]);
    }
    var lista = function(arr){ return arr.map(function(x){ return "• " + x.t; }).join("\n"); };
    var tb = h("tbody", null, [
      fila("fecha", r.fecha, R.fecha), fila("hora", r.hora, R.hora),
      fila("ubicacion", r.ubicacion, R.ubicacion.ok), fila("equipo", r.equipo, R.equipo.ok),
      fila("hechos", lista(r.hechos), lista(R.hechos.filter(function(x){ return x.tipo === "hecho"; }))),
      fila("acciones", lista(r.acciones), lista(R.acciones.filter(function(x){ return x.ok; }))),
      fila("efecto", r.efecto, R.efecto.ok), fila("repeticion", r.repeticion, R.repeticion.ok)
    ]);

    /* retroalimentación de cada afirmación marcada o faltante */
    var notas = h("div", {class:"stack"});
    R.hechos.forEach(function(x){
      var marcado = r.hechos.indexOf(x) >= 0;
      if(x.tipo === "hecho" && marcado) return;
      if(x.tipo !== "hecho" && !marcado) return;
      var cls = x.tipo === "hecho" ? "ok" : "bad";
      var titulo = x.tipo === "hecho" ? "Le faltó: " : x.tipo === "suposicion" ? "Suposición, no va como hecho: " : "No aporta al análisis: ";
      notas.appendChild(h("div", {class:"fb " + cls}, [h("span", {class:"h", text:titulo + x.t}), h("span", {text:x.fb})]));
    });

    var msg = h("p", {class:"muted", "aria-live":"polite"});
    S.ultimo = r; S.intentos.push(k.pts);
    var bCorr = h("button", {type:"button", class:"btn", text:"Corregir mi reporte"}); bCorr.addEventListener("click", formulario);
    var bRep = h("button", {type:"button", class:"btn ghost", text:"Empezar de nuevo"}); bRep.addEventListener("click", function(){ empezar(R); });
    var bIni = h("button", {type:"button", class:"btn ghost", text:"Elegir otro relato"}); bIni.addEventListener("click", inicio);
    app.appendChild(h("section", {class:"stack"}, [
      h("div", {class:"eyebrow", text:"Paso 3 de 3 · Resultado · " + R.titulo}),
      h("div", {class:"card stack"}, [
        h("h2", {text:S.nombre + " · " + T.ROLES[R.rol].nombre}),
        h("div", {class:"score", text:k.pts + " / 100"}),
        h("p", {text:"Hechos reportados: " + k.hOk + " de " + k.nHechos + ". Suposiciones marcadas como hecho: " + k.sup + "."})
      ]),
      h("div", {class:"card stack"}, [
        h("h3", {text:"Qué pasó con la falla"}),
        h("div", {class:"fb " + (bueno ? "best" : "bad")}, [h("span", {class:"h", text: bueno ? "Con su reporte, mantenimiento pudo encontrar la causa" : "Con este reporte, la falla volvió"}), h("span", {text: bueno ? R.desenlaceBueno : R.desenlaceMalo})]),
        bueno ? null : h("p", {class:"muted", text:"Para un buen desenlace el reporte debe identificar el equipo exacto, decir que la falla se repite y no presentar suposiciones como hechos."})
      ]),
      h("h3", {text:"Su reporte frente al reporte modelo"}),
      h("div", {class:"tablewrap"}, [h("table", {class:"comparar"}, [h("thead", null, [h("tr", null, ["Dato","Su reporte","Reporte modelo","Por qué importa"].map(function(x){ return h("th", {text:x}); }))]), tb])]),
      notas.childNodes.length ? h("h3", {text:"Revise estas afirmaciones"}) : null,
      notas,
      h("div", {class:"lesson"}, [h("strong", {text:"Para llevarse: "}), document.createTextNode(T.leccion)]),
      S.intentos.length > 1 ? h("p", {class:"muted", text:"Sus intentos: " + S.intentos.map(function(p, i){ return "intento " + (i + 1) + ": " + p + "/100"; }).join(" → ") + "."}) : h("p", {class:"muted", text:"Revise la retroalimentación y corrija su reporte: verá cómo cambia lo que mantenimiento puede hacer con él."}),
      h("div", {class:"row"}, [h("div", {class:"row"}, [bRep, bIni]), h("div", {class:"row"}, [bCorr, h("a", {class:"btn ghost", href:"../../index.html", text:"Volver al inicio"})])]),
      msg
    ]));

    if(S.enviados >= S.intentos.length){ msg.textContent = "✔ Resultado ya registrado."; return; }
    S.enviados = S.intentos.length;
    var si = function(v){ return v >= 0.999 ? "Sí" : v > 0 ? "Parcial" : "No"; };
    var fila2 = [Comun.fecha(), S.nombre, T.ROLES[R.rol].nombre, R.titulo, k.pts,
      si(c.fecha) + " (" + (r.fecha || "") + ")", si(c.hora) + " (" + r.hora + ")", si(c.ubicacion), si(c.equipo),
      k.hOk + " de " + k.nHechos, k.sup, si(c.acciones), si(c.efecto), si(c.repeticion), bueno ? "Bueno" : "La falla volvió", S.intentos.length];
    Comun.enviar(T.actividad, T.titulo, ENC, fila2, msg);
  }

  inicio();
})();
