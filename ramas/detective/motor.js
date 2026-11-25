"use strict";
/* ============================================================
   MOTOR DEL DETECTIVE DE FALLAS
   Lee window.DETECTIVE (definido en contenido.js). No hace falta tocar este archivo
   para cambiar los registros o las preguntas: solo contenido.js.
   Flujo: inicio → ronda 1 (reportes incompletos) → ronda 2 (datos completos, filtros y conteo)
          → preguntas → resultado (se envía a Google Sheets, pestaña "Detective de fallas").
   ============================================================ */
(function(){
  var D = window.DETECTIVE, h = Comun.h, app = document.getElementById("app");
  var S = {nombre: Comun.getNombre(), r1: null, resp: [], enviado: false};
  var ENC = ["Fecha","Nombre","Ejercicio","Puntaje (0-100)","Aciertos","Total","Ronda 1"].concat(D.preguntas.map(function(p, i){ return "Pregunta " + (i + 1); }));

  document.title = D.titulo + " · Simulador RAMS";
  function arriba(){ try { window.scrollTo({top:0, behavior:"smooth"}); } catch(e){ window.scrollTo(0, 0); } }
  function franja(hora){
    for(var i = 0; i < D.FRANJAS.length; i++){ var f = D.FRANJAS[i]; if(hora >= f.desde && hora <= f.hasta) return f.nombre; }
    return "Sin franja";
  }
  function unicos(campo){
    var v = {}; D.registros.forEach(function(r){ v[campo === "franja" ? franja(r.hora) : r[campo]] = true; });
    return Object.keys(v).sort();
  }
  function botonOpcion(texto, letra, onclick){
    var b = h("button", {type:"button", class:"opt"}, [h("span", {class:"k", text:letra + "."}), h("span", {text:texto})]);
    b.addEventListener("click", onclick); return b;
  }

  /* ---------- Inicio ---------- */
  function inicio(){
    app.innerHTML = ""; arriba();
    var inp = h("input", {type:"text", id:"nombre", placeholder:"Nombre y apellido", autocomplete:"name"});
    inp.value = S.nombre;
    var aviso = h("p", {class:"muted", "aria-live":"polite"});
    var b = h("button", {type:"button", class:"btn", text:"Empezar la ronda 1"});
    b.addEventListener("click", function(){
      var n = inp.value.trim();
      if(n.length < 3){ aviso.textContent = "Escriba su nombre antes de empezar."; inp.focus(); return; }
      S.nombre = n; Comun.setNombre(n); S.r1 = null; S.resp = []; S.enviado = false; ronda1();
    });
    app.appendChild(h("section", {class:"stack"}, [
      h("div", {class:"eyebrow", text:"Rama"}),
      h("h1", {text:D.titulo}),
      h("p", {text:D.descripcion}),
      h("div", {class:"situ"}, [h("p", {text:"Usted va a revisar los reportes de fallas de equipos de estación de dos semanas. En la ronda 1 verá los reportes tal como llegaron. En la ronda 2 verá los mismos eventos con datos completos."}),
        h("p", {class:"muted", text:"Datos ficticios con fines de formación."})]),
      h("div", {class:"card stack"}, [
        h("div", null, [h("label", {class:"f", for:"nombre", text:"Su nombre"}), inp, aviso]),
        h("div", {class:"row"}, [h("span"), b])
      ])
    ]));
  }

  /* ---------- Ronda 1 ---------- */
  function ronda1(){
    app.innerHTML = ""; arriba();
    var tb = h("tbody");
    D.registros.forEach(function(r, i){ tb.appendChild(h("tr", null, [h("td", {text:String(i + 1)}), h("td", {text:r.fecha}), h("td", {text:r.r1})])); });
    var opts = h("div", {class:"opts"}), fb = h("div", {"aria-live":"polite"});
    var sig = h("button", {type:"button", class:"btn", text:"Pasar a la ronda 2", hidden:"hidden"});
    sig.addEventListener("click", ronda2);
    D.ronda1.ops.forEach(function(o, i){
      opts.appendChild(botonOpcion(o.t, String.fromCharCode(65 + i), function(){
        S.r1 = o;
        Array.prototype.forEach.call(opts.children, function(b, k){
          b.disabled = true; var q = D.ronda1.ops[k].q;
          if(k === i) b.classList.add(o.q); else if(q === "best") b.classList.add("best"); else b.classList.add("dim");
        });
        fb.innerHTML = "";
        fb.appendChild(h("div", {class:"fb " + o.q}, [h("span", {class:"h", text:o.q === "best" ? "Correcto" : "Revise"}), h("span", {text:o.fb})]));
        sig.hidden = false; sig.focus();
      }));
    });
    app.appendChild(h("section", {class:"stack"}, [
      h("div", {class:"row"}, [h("div", {class:"eyebrow", text:"Ronda 1 de 2 · Reportes tal como llegaron"}), h("button", {type:"button", class:"btn ghost", text:"← Inicio", onclick:inicio})]),
      h("h2", {text:"Lea los 20 reportes"}),
      h("div", {class:"tablewrap"}, [h("table", null, [h("thead", null, [h("tr", null, [h("th", {text:"#"}), h("th", {text:"Fecha"}), h("th", {text:"Reporte"})])]), tb])]),
      h("div", {class:"card stack"}, [h("h3", {text:D.ronda1.pregunta}), opts, fb, h("div", {class:"row"}, [h("span"), sig])])
    ]));
  }

  /* ---------- Ronda 2 ---------- */
  function selectFiltro(id, etiqueta, valores){
    var s = h("select", {id:id}); s.appendChild(h("option", {value:"", text:"Todos"}));
    valores.forEach(function(v){ s.appendChild(h("option", {value:v, text:v})); });
    return h("div", null, [h("label", {class:"f", for:id, text:etiqueta}), s]);
  }
  function ronda2(){
    app.innerHTML = ""; arriba();
    var fE = selectFiltro("f_est", "Estación", unicos("estacion"));
    var fQ = selectFiltro("f_eq", "Equipo", unicos("equipo"));
    var fF = selectFiltro("f_fr", "Franja horaria", D.FRANJAS.map(function(f){ return f.nombre; }));
    var cuenta = h("p", {class:"muted", "aria-live":"polite"});
    var tb = h("tbody"), conteo = h("div");
    function pintar(){
      var e = document.getElementById("f_est").value, q = document.getElementById("f_eq").value, f = document.getElementById("f_fr").value;
      tb.innerHTML = ""; var n = 0;
      D.registros.forEach(function(r){
        if(e && r.estacion !== e) return; if(q && r.equipo !== q) return; if(f && franja(r.hora) !== f) return;
        n++;
        tb.appendChild(h("tr", null, [h("td", {text:r.fecha}), h("td", {text:r.hora}), h("td", {text:r.estacion}), h("td", {text:r.equipo}),
          h("td", {text:r.ubic}), h("td", {text:r.obs}), h("td", {text:r.accion}), h("td", {text:r.efecto})]));
      });
      cuenta.textContent = "Mostrando " + n + " de " + D.registros.length + " registros.";
    }
    var bCont = h("button", {type:"button", class:"btn ghost", text:"Contar eventos por equipo"});
    bCont.addEventListener("click", function(){
      var c = {}; D.registros.forEach(function(r){ var k = r.equipo + " · " + r.estacion; c[k] = (c[k] || 0) + 1; });
      var filas = Object.keys(c).sort(function(a, b){ return c[b] - c[a]; });
      var t = h("tbody"); filas.forEach(function(k){ t.appendChild(h("tr", null, [h("td", {text:k}), h("td", {text:String(c[k])})])); });
      conteo.innerHTML = "";
      conteo.appendChild(h("div", {class:"tablewrap"}, [h("table", null, [h("thead", null, [h("tr", null, [h("th", {text:"Equipo · estación"}), h("th", {text:"Eventos"})])]), t])]));
    });
    var sig = h("button", {type:"button", class:"btn", text:"Responder las preguntas"});
    sig.addEventListener("click", function(){ pregunta(0); });
    app.appendChild(h("section", {class:"stack"}, [
      h("div", {class:"row"}, [h("div", {class:"eyebrow", text:"Ronda 2 de 2 · Los mismos eventos, con datos completos"}), h("button", {type:"button", class:"btn ghost", text:"← Inicio", onclick:inicio})]),
      h("h2", {text:"Busque el patrón"}),
      h("p", {class:"muted", text:"Use los filtros para agrupar los eventos por estación, equipo u hora. También puede contar cuántas veces aparece cada equipo."}),
      h("div", {class:"card stack"}, [h("div", {class:"formgrid"}, [fE, fQ, fF]), h("div", {class:"row"}, [cuenta, bCont]), conteo]),
      h("div", {class:"tablewrap"}, [h("table", null, [h("thead", null, [h("tr", null, ["Fecha","Hora","Estación","Equipo","Ubicación","Lo que se observó","Qué se hizo","Efecto"].map(function(x){ return h("th", {text:x}); }))]), tb])]),
      h("div", {class:"row"}, [h("span"), sig])
    ]));
    ["f_est","f_eq","f_fr"].forEach(function(id){ document.getElementById(id).addEventListener("change", pintar); });
    pintar();
  }

  /* ---------- Preguntas ---------- */
  function pregunta(i){
    if(i >= D.preguntas.length){ resultado(); return; }
    var P = D.preguntas[i]; app.innerHTML = ""; arriba();
    var ops = Comun.mezclar(P.ops), opts = h("div", {class:"opts"}), fb = h("div", {"aria-live":"polite"});
    var sig = h("button", {type:"button", class:"btn", text: i + 1 < D.preguntas.length ? "Siguiente pregunta" : "Ver mi resultado", hidden:"hidden"});
    sig.addEventListener("click", function(){ pregunta(i + 1); });
    var volver = h("button", {type:"button", class:"btn ghost", text:"Ver los registros otra vez"});
    volver.addEventListener("click", function(){ verRegistros(i); });
    ops.forEach(function(o, k){
      opts.appendChild(botonOpcion(o.t, String.fromCharCode(65 + k), function(){
        S.resp[i] = o;
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
      h("div", {class:"row"}, [h("span", {class:"muted", text:"Pregunta " + (i + 1) + " de " + D.preguntas.length}), volver]),
      h("h2", {text:P.texto}), opts, fb, h("div", {class:"row"}, [h("span"), sig])
    ]));
  }
  function verRegistros(i){
    ronda2();
    var b = h("button", {type:"button", class:"btn", text:"Volver a la pregunta " + (i + 1)});
    b.addEventListener("click", function(){ pregunta(i); });
    app.appendChild(h("div", {class:"row"}, [h("span"), b]));
  }

  /* ---------- Resultado ---------- */
  function resultado(){
    app.innerHTML = ""; arriba();
    var ac = (S.r1 && S.r1.q === "best" ? 1 : 0);
    S.resp.forEach(function(o){ if(o && o.ok) ac++; });
    var total = D.preguntas.length + 1, pts = Math.round(ac * 100 / total);
    var msg = h("p", {class:"muted", "aria-live":"polite"});
    var bRep = h("button", {type:"button", class:"btn ghost", text:"Repetir"}); bRep.addEventListener("click", inicio);
    app.appendChild(h("section", {class:"card stack"}, [
      h("div", {class:"eyebrow", text:"Resultado · " + D.titulo}),
      h("h2", {text:S.nombre}),
      h("div", {class:"score", text:pts + " / 100"}),
      h("p", {text:ac + " de " + total + " correctas."}),
      h("div", {class:"lesson"}, [h("strong", {text:"Para llevarse: "}), document.createTextNode(D.leccion)]),
      h("div", {class:"row"}, [bRep, h("a", {class:"btn", href:"../../index.html", text:"Volver al inicio"})]),
      msg
    ]));
    if(S.enviado){ msg.textContent = "✔ Resultado ya registrado."; return; }
    S.enviado = true;
    var fila = [Comun.fecha(), S.nombre, D.titulo, pts, ac, total, S.r1 ? S.r1.t : ""];
    D.preguntas.forEach(function(P, i){ var o = S.resp[i]; fila.push(o ? (o.ok ? "Bien: " : "Mal: ") + o.t : ""); });
    Comun.enviar(D.actividad, D.titulo, ENC, fila, msg);
  }

  inicio();
})();
