"use strict";
/* ============================================================
   MOTOR DEL DETECTIVE DE FALLAS
   Lee window.DETECTIVE (definido en contenido.js). Para cambiar casos, registros,
   preguntas o el reporte solo se edita contenido.js.
   Flujo: inicio (nombre y especialidad)
          → caso 1 (común): ronda 1 → ronda 2 → preguntas
          → caso 2 (de la especialidad): explorar → preguntas → reporte para mantenimiento
          → resultado (se envía a Google Sheets, pestaña "Detective de fallas").
   ============================================================ */
(function(){
  var D = window.DETECTIVE, h = Comun.h, app = document.getElementById("app");
  var S = {nombre: Comun.getNombre(), rol: null, ruta: [], i: 0, r1: null, resp: {}, rep: {}, enviado: false};

  document.title = D.titulo + " · Simulador RAMS";
  function arriba(){ try { window.scrollTo({top:0, behavior:"smooth"}); } catch(e){ window.scrollTo(0, 0); } }
  function caso(){ return S.ruta[S.i]; }
  function franja(hora){
    for(var i = 0; i < D.FRANJAS.length; i++){ var f = D.FRANJAS[i]; if(hora >= f.desde && hora <= f.hasta) return f.nombre; }
    return "Sin franja";
  }
  function valor(r, k){ return k === "franja" ? franja(r.hora) : r[k]; }
  function nombreCampo(C, k){
    if(k === "franja") return "Franja horaria";
    for(var i = 0; i < C.columnas.length; i++) if(C.columnas[i].k === k) return C.columnas[i].n;
    return k;
  }
  function ordenados(C){ return C.registros.slice().sort(function(a, b){ return (a.fecha + a.hora) < (b.fecha + b.hora) ? -1 : 1; }); }
  function botonOpcion(texto, letra, onclick){
    var b = h("button", {type:"button", class:"opt"}, [h("span", {class:"k", text:letra + "."}), h("span", {text:texto})]);
    b.addEventListener("click", onclick); return b;
  }
  function cabecera(etiqueta){
    return h("div", {class:"row"}, [h("div", {class:"eyebrow", text:etiqueta}), h("button", {type:"button", class:"btn ghost", text:"← Inicio", onclick:inicio})]);
  }
  function etapa(){ return caso().titulo + " (" + (S.i + 1) + " de " + S.ruta.length + ")"; }

  /* ---------- Inicio ---------- */
  function inicio(){
    app.innerHTML = ""; arriba();
    var inp = h("input", {type:"text", id:"nombre", placeholder:"Nombre y apellido", autocomplete:"name"});
    inp.value = S.nombre;
    inp.addEventListener("input", function(){ S.nombre = inp.value; });
    var roles = h("div", {class:"grid3", role:"radiogroup", "aria-label":"Especialidad"});
    Object.keys(D.ROLES).forEach(function(k){
      var b = h("button", {type:"button", class:"choice" + (S.rol === k ? " sel" : ""), "aria-pressed": String(S.rol === k)}, [
        h("span", {class:"t", text:D.ROLES[k].nombre}), h("span", {class:"d", text:D.ROLES[k].desc})]);
      b.addEventListener("click", function(){ S.rol = k; inicio(); });
      roles.appendChild(b);
    });
    var aviso = h("p", {class:"muted", "aria-live":"polite"});
    var b = h("button", {type:"button", class:"btn", text:"Empezar"});
    b.addEventListener("click", function(){
      var n = inp.value.trim();
      if(n.length < 3){ aviso.textContent = "Escriba su nombre antes de empezar."; inp.focus(); return; }
      if(!S.rol){ aviso.textContent = "Elija su especialidad."; return; }
      S.nombre = n; Comun.setNombre(n);
      S.ruta = D.CASOS.filter(function(c){ return !c.rol || c.rol === S.rol; });
      S.i = 0; S.r1 = null; S.resp = {}; S.rep = {}; S.enviado = false;
      empezarCaso();
    });
    app.appendChild(h("section", {class:"stack"}, [
      h("div", {class:"eyebrow", text:"Rama · Sesión 2"}),
      h("h1", {text:D.titulo}),
      h("p", {text:D.descripcion}),
      h("div", {class:"situ"}, [
        h("p", {text:"Son dos casos. El primero es igual para todos. El segundo es de su especialidad y es más difícil: lo que más se repite no siempre es lo más importante. Al final escribirá el reporte para mantenimiento."}),
        h("p", {class:"muted", text:"Datos ficticios con fines de formación."})]),
      h("div", {class:"card stack"}, [
        h("div", null, [h("label", {class:"f", for:"nombre", text:"1. Su nombre"}), inp]),
        h("div", null, [h("span", {class:"f", text:"2. Su especialidad"}), roles]),
        aviso,
        h("div", {class:"row"}, [h("span"), b])
      ])
    ]));
  }

  function empezarCaso(){ if(caso().ronda1) ronda1(); else explorar(); }
  function siguienteDespuesDePreguntas(){
    if(caso().reporte) reporte();
    else if(S.i + 1 < S.ruta.length){ S.i++; empezarCaso(); }
    else resultado();
  }

  /* ---------- Ronda 1 (reportes incompletos) ---------- */
  function ronda1(){
    var C = caso(); app.innerHTML = ""; arriba();
    var tb = h("tbody");
    ordenados(C).forEach(function(r, i){ tb.appendChild(h("tr", null, [h("td", {text:String(i + 1)}), h("td", {text:r.fecha}), h("td", {text:r.r1})])); });
    var opts = h("div", {class:"opts"}), fb = h("div", {"aria-live":"polite"});
    var sig = h("button", {type:"button", class:"btn", text:"Pasar a la ronda 2", hidden:"hidden"});
    sig.addEventListener("click", explorar);
    C.ronda1.ops.forEach(function(o, i){
      opts.appendChild(botonOpcion(o.t, String.fromCharCode(65 + i), function(){
        S.r1 = o;
        Array.prototype.forEach.call(opts.children, function(b, k){
          b.disabled = true; var q = C.ronda1.ops[k].q;
          if(k === i) b.classList.add(o.q); else if(q === "best") b.classList.add("best"); else b.classList.add("dim");
        });
        fb.innerHTML = "";
        fb.appendChild(h("div", {class:"fb " + o.q}, [h("span", {class:"h", text:o.q === "best" ? "Correcto" : "Revise"}), h("span", {text:o.fb})]));
        sig.hidden = false; sig.focus();
      }));
    });
    app.appendChild(h("section", {class:"stack"}, [
      cabecera(etapa() + " · Ronda 1: reportes tal como llegaron"),
      h("h2", {text:C.titulo}),
      h("div", {class:"situ"}, [h("p", {text:C.intro})]),
      h("div", {class:"tablewrap"}, [h("table", null, [h("thead", null, [h("tr", null, [h("th", {text:"#"}), h("th", {text:"Fecha"}), h("th", {text:"Reporte"})])]), tb])]),
      h("div", {class:"card stack"}, [h("h3", {text:C.ronda1.pregunta}), opts, fb, h("div", {class:"row"}, [h("span"), sig])])
    ]));
  }

  /* ---------- Explorar (datos completos, filtros y conteos) ---------- */
  function tablaExplorar(C, extra){
    var filtros = C.filtros.map(function(k){
      var vals = {}; C.registros.forEach(function(r){ vals[valor(r, k)] = true; });
      var s = h("select", {id:"f_" + k}); s.appendChild(h("option", {value:"", text:"Todos"}));
      Object.keys(vals).sort().forEach(function(v){ s.appendChild(h("option", {value:v, text:v})); });
      return h("div", null, [h("label", {class:"f", for:"f_" + k, text:nombreCampo(C, k)}), s]);
    });
    var cuenta = h("p", {class:"muted", "aria-live":"polite"});
    var tb = h("tbody"), conteo = h("div");
    function pintar(){
      tb.innerHTML = ""; var n = 0;
      ordenados(C).forEach(function(r){
        for(var i = 0; i < C.filtros.length; i++){ var v = document.getElementById("f_" + C.filtros[i]).value; if(v && valor(r, C.filtros[i]) !== v) return; }
        n++;
        tb.appendChild(h("tr", null, C.columnas.map(function(c){ return h("td", {text:r[c.k]}); })));
      });
      cuenta.textContent = "Mostrando " + n + " de " + C.registros.length + " registros.";
    }
    var botones = C.contar.map(function(cn){
      var b = h("button", {type:"button", class:"btn ghost", text:cn.n});
      b.addEventListener("click", function(){
        var c = {}; C.registros.forEach(function(r){ var k = cn.ks.map(function(x){ return valor(r, x); }).join(" · "); c[k] = (c[k] || 0) + 1; });
        var filas = Object.keys(c).sort(function(a, b){ return c[b] - c[a] || (a < b ? -1 : 1); });
        var t = h("tbody"); filas.forEach(function(k){ t.appendChild(h("tr", null, [h("td", {text:k}), h("td", {text:String(c[k])})])); });
        conteo.innerHTML = "";
        conteo.appendChild(h("div", {class:"tablewrap"}, [h("table", null, [h("thead", null, [h("tr", null, [h("th", {text:cn.ks.map(function(x){ return nombreCampo(C, x); }).join(" · ")}), h("th", {text:"Eventos"})])]), t])]));
      });
      return b;
    });
    var nodo = h("div", {class:"stack"}, [
      h("div", {class:"card stack"}, [
        h("div", {class:"formgrid"}, filtros),
        h("div", {class:"row"}, [cuenta, h("div", {class:"row"}, botones)]),
        conteo
      ]),
      h("div", {class:"tablewrap"}, [h("table", null, [h("thead", null, [h("tr", null, C.columnas.map(function(c){ return h("th", {text:c.n}); }))]), tb])]),
      extra || null
    ]);
    return {nodo:nodo, iniciar:function(){
      C.filtros.forEach(function(k){ document.getElementById("f_" + k).addEventListener("change", pintar); }); pintar();
    }};
  }
  function explorar(){
    var C = caso(); app.innerHTML = ""; arriba();
    var sig = h("button", {type:"button", class:"btn", text:"Responder las preguntas"});
    sig.addEventListener("click", function(){ pregunta(0); });
    var t = tablaExplorar(C, h("div", {class:"row"}, [h("span"), sig]));
    app.appendChild(h("section", {class:"stack"}, [
      cabecera(etapa() + (C.ronda1 ? " · Ronda 2: los mismos eventos, con datos completos" : " · Busque el patrón")),
      h("h2", {text:C.titulo}),
      C.ronda1 ? null : h("div", {class:"situ"}, [h("p", {text:C.intro})]),
      h("p", {class:"muted", text:"Use los filtros para agrupar los eventos y los botones para contar. Pruebe varias formas de contar: no todas muestran el patrón."}),
      t.nodo
    ]));
    t.iniciar();
  }

  /* ---------- Preguntas ---------- */
  function pregunta(i){
    var C = caso();
    if(i >= C.preguntas.length){ siguienteDespuesDePreguntas(); return; }
    var P = C.preguntas[i]; app.innerHTML = ""; arriba();
    var ops = Comun.mezclar(P.ops), opts = h("div", {class:"opts"}), fb = h("div", {"aria-live":"polite"});
    var ultimo = i + 1 >= C.preguntas.length;
    var sig = h("button", {type:"button", class:"btn", hidden:"hidden",
      text: !ultimo ? "Siguiente pregunta" : C.reporte ? "Escribir el reporte" : (S.i + 1 < S.ruta.length ? "Pasar al caso " + (S.i + 2) : "Ver mi resultado")});
    sig.addEventListener("click", function(){ pregunta(i + 1); });
    var volver = h("button", {type:"button", class:"btn ghost", text:"Ver los registros otra vez"});
    volver.addEventListener("click", function(){ verRegistros(function(){ pregunta(i); }, "Volver a la pregunta " + (i + 1)); });
    ops.forEach(function(o, k){
      opts.appendChild(botonOpcion(o.t, String.fromCharCode(65 + k), function(){
        S.resp[C.id + "#" + i] = o;
        Array.prototype.forEach.call(opts.children, function(b, j){
          b.disabled = true;
          if(j === k) b.classList.add(o.ok ? "best" : "bad"); else if(ops[j].ok) b.classList.add("best"); else b.classList.add("dim");
        });
        fb.innerHTML = "";
        fb.appendChild(h("div", {class:"fb " + (o.ok ? "best" : "bad")}, [h("span", {class:"h", text:o.ok ? "Correcto" : "No es la mejor respuesta"}), h("span", {text:P.fb})]));
        sig.hidden = false; sig.focus();
      }));
    });
    app.appendChild(h("section", {class:"card stack"}, [
      h("div", {class:"row"}, [h("span", {class:"muted", text:etapa() + " · Pregunta " + (i + 1) + " de " + C.preguntas.length}), volver]),
      h("h2", {text:P.texto}), opts, fb, h("div", {class:"row"}, [h("span"), sig])
    ]));
  }
  function verRegistros(volverA, texto){
    var C = caso(); app.innerHTML = ""; arriba();
    var b = h("button", {type:"button", class:"btn", text:texto}); b.addEventListener("click", volverA);
    var t = tablaExplorar(C, h("div", {class:"row"}, [h("span"), b]));
    app.appendChild(h("section", {class:"stack"}, [cabecera(etapa() + " · Registros"), h("h2", {text:C.titulo}), t.nodo]));
    t.iniciar();
  }

  /* ---------- Reporte para mantenimiento ---------- */
  function reporte(){
    var C = caso(), R = C.reporte; app.innerHTML = ""; arriba();
    var aviso = h("p", {class:"muted", "aria-live":"polite"});
    var campos = R.campos.map(function(f, i){
      var s = h("select", {id:"rep_" + i}); s.appendChild(h("option", {value:"", text:"Seleccione…"}));
      Comun.mezclar(f.ops).forEach(function(o){ s.appendChild(h("option", {value:o, text:o})); });
      if(S.rep[i]) s.value = S.rep[i];
      return h("div", {class:"full"}, [h("label", {class:"f", for:"rep_" + i, text:f.n}), s]);
    });
    var volver = h("button", {type:"button", class:"btn ghost", text:"Ver los registros otra vez"});
    volver.addEventListener("click", function(){ guardar(); verRegistros(reporte, "Volver al reporte"); });
    function guardar(){ R.campos.forEach(function(f, i){ S.rep[i] = document.getElementById("rep_" + i).value; }); }
    var b = h("button", {type:"button", class:"btn", text:"Enviar el reporte"});
    b.addEventListener("click", function(){
      guardar();
      if(R.campos.some(function(f, i){ return !S.rep[i]; })){ aviso.textContent = "Complete todos los datos del reporte."; return; }
      if(S.i + 1 < S.ruta.length){ S.i++; empezarCaso(); } else resultado();
    });
    app.appendChild(h("section", {class:"stack"}, [
      h("div", {class:"row"}, [h("div", {class:"eyebrow", text:etapa() + " · Reporte para mantenimiento"}), volver]),
      h("h2", {text:"Reporte para mantenimiento"}),
      h("div", {class:"situ"}, [h("p", {text:R.intro})]),
      h("div", {class:"card"}, [h("div", {class:"formgrid"}, campos)]),
      aviso,
      h("div", {class:"row"}, [h("span"), b])
    ]));
  }

  /* ---------- Resultado ---------- */
  function resultado(){
    app.innerHTML = ""; arriba();
    var ac = 0, total = 0, filasCasos = [], detalle = [];
    S.ruta.forEach(function(C){
      var a = 0, t = 0;
      if(C.ronda1){ t++; if(S.r1 && S.r1.q === "best") a++; detalle.push(S.r1 ? S.r1.t : ""); }
      C.preguntas.forEach(function(P, i){ var o = S.resp[C.id + "#" + i]; t++; if(o && o.ok) a++; detalle.push(o ? (o.ok ? "Bien: " : "Mal: ") + o.t : ""); });
      var aR = 0;
      if(C.reporte){ C.reporte.campos.forEach(function(f, i){ t++; if(S.rep[i] === f.ok){ a++; aR++; } }); }
      ac += a; total += t;
      filasCasos.push({C:C, a:a, t:t, aR:aR});
    });
    var pts = Math.round(ac * 100 / total);
    var tb = h("tbody");
    filasCasos.forEach(function(x){ tb.appendChild(h("tr", null, [h("td", {text:x.C.titulo}), h("td", {text:x.a + " de " + x.t})])); });

    var rep = null, R2 = null;
    S.ruta.forEach(function(C){ if(C.reporte) R2 = C.reporte; });
    if(R2){
      var tr = h("tbody");
      R2.campos.forEach(function(f, i){
        var ok = S.rep[i] === f.ok;
        tr.appendChild(h("tr", null, [
          h("td", null, [h("strong", {text:f.n}), h("div", null, [h("span", {class:"tag " + (ok ? "best" : "bad"), text: ok ? "Correcto" : "Revise"})])]),
          h("td", {text:S.rep[i] || "—"}), h("td", {text:f.ok}), h("td", {class:"muted", text: ok ? "" : f.fb})]));
      });
      rep = h("div", {class:"stack"}, [h("h3", {text:"Su reporte frente al reporte modelo"}),
        h("div", {class:"tablewrap"}, [h("table", null, [h("thead", null, [h("tr", null, ["Dato","Su reporte","Reporte modelo","Por qué importa"].map(function(x){ return h("th", {text:x}); }))]), tr])])]);
    }

    var msg = h("p", {class:"muted", "aria-live":"polite"});
    var bRep = h("button", {type:"button", class:"btn ghost", text:"Repetir"}); bRep.addEventListener("click", inicio);
    app.appendChild(h("section", {class:"stack"}, [
      h("div", {class:"card stack"}, [
        h("div", {class:"eyebrow", text:"Resultado · " + D.titulo}),
        h("h2", {text:S.nombre + " · " + D.ROLES[S.rol].nombre}),
        h("div", {class:"score", text:pts + " / 100"}),
        h("div", {class:"tablewrap"}, [h("table", null, [h("thead", null, [h("tr", null, [h("th", {text:"Parte"}), h("th", {text:"Aciertos"})])]), tb])])
      ]),
      rep,
      h("div", {class:"lesson"}, [h("strong", {text:"Para llevarse: "}), document.createTextNode(D.leccion)]),
      h("div", {class:"row"}, [bRep, h("a", {class:"btn", href:"../../index.html", text:"Volver al inicio"})]),
      msg
    ]));

    if(S.enviado){ msg.textContent = "✔ Resultado ya registrado."; return; }
    S.enviado = true;
    var reporteOk = filasCasos.reduce(function(s, x){ return s + x.aR; }, 0);
    var ENC = ["Fecha","Nombre","Especialidad","Puntaje (0-100)","Aciertos","Total"]
      .concat(filasCasos.map(function(x){ return x.C.titulo; }))
      .concat(["Reporte para mantenimiento (datos correctos)"]);
    var fila = [Comun.fecha(), S.nombre, D.ROLES[S.rol].nombre, pts, ac, total]
      .concat(filasCasos.map(function(x){ return x.a + " de " + x.t; }))
      .concat([R2 ? reporteOk + " de " + R2.campos.length : ""]);
    Comun.enviar(D.actividad, D.titulo, ENC, fila, msg);
  }

  inicio();
})();
