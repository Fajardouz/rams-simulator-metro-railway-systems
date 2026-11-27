"use strict";
/* ============================================================
   MOTOR DE EL VIAJE DEL REPORTE
   Lee window.VIAJE (definido en contenido.js). Para cambiar etapas, preguntas o eventos
   solo se edita contenido.js.
   Flujo: inicio → parte 1 (ordenar etapas) → parte 2 (dos reportes y una parada a la vez)
          → resultado (se envía a Google Sheets).
   ============================================================ */
(function(){
  var D = window.VIAJE, h = Comun.h, app = document.getElementById("app");
  var S = {nombre: Comun.getNombre(), rol: null, ordenOk: 0, intentosOrden: 0, resp: [], enviado: false};

  document.title = D.titulo + " · Simulador RAMS";
  function arriba(){ try { window.scrollTo({top:0, behavior:"smooth"}); } catch(e){ window.scrollTo(0, 0); } }
  function cab(texto){ return h("div", {class:"row"}, [h("div", {class:"eyebrow", text:texto}), h("button", {type:"button", class:"btn ghost", text:"← Inicio", onclick:inicio})]); }

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
      S.ordenOk = 0; S.intentosOrden = 0; S.resp = []; S.enviado = false;
      ordenar();
    });
    app.appendChild(h("section", {class:"stack"}, [
      h("div", {class:"eyebrow", text:"Rama · Sesión 5"}),
      h("h1", {text:D.titulo}),
      h("p", {text:D.descripcion}),
      h("div", {class:"situ"}, [h("p", {text:"Parte 1: ordene las etapas por las que pasa un reporte. Parte 2: siga un evento de su especialidad por cada etapa, con un reporte bueno y uno malo."}),
        h("p", {class:"muted", text:"Eventos hipotéticos con fines de formación."})]),
      h("div", {class:"card stack"}, [
        h("div", null, [h("label", {class:"f", for:"nombre", text:"1. Su nombre"}), inp]),
        h("div", null, [h("span", {class:"f", text:"2. Su especialidad"}), roles]),
        aviso, h("div", {class:"row"}, [h("span"), b])
      ])
    ]));
  }

  /* ---------- Parte 1: ordenar las etapas ---------- */
  function ordenar(){
    app.innerHTML = ""; arriba();
    var fichas = Comun.mezclar(D.ETAPAS.map(function(t, i){ return {t:t, i:i}; }));
    var orden = [], fijas = 0;
    var lista = h("ol", {class:"stack"}), banco = h("div", {class:"opts"});
    var fb = h("div", {"aria-live":"polite"});
    var bQuitar = h("button", {type:"button", class:"btn ghost", text:"Quitar la última"});
    var bRev = h("button", {type:"button", class:"btn", text:"Revisar el orden"});
    var bSig = h("button", {type:"button", class:"btn", text:"Pasar a la parte 2", hidden:"hidden"});
    function pintar(estado){
      lista.innerHTML = "";
      orden.forEach(function(f, k){
        var cls = estado ? (f.i === k ? "fb best" : "fb bad") : (k < fijas ? "fb best" : "situ");
        lista.appendChild(h("li", {class:cls}, [h("span", {text:(k + 1) + ". " + f.t})]));
      });
      for(var k = orden.length; k < D.ETAPAS.length; k++) lista.appendChild(h("li", {class:"muted", text:(k + 1) + ". …"}));
      banco.innerHTML = "";
      fichas.forEach(function(f){
        if(orden.indexOf(f) >= 0) return;
        var b = h("button", {type:"button", class:"opt"}, [h("span", {text:f.t})]);
        b.addEventListener("click", function(){ orden.push(f); fb.innerHTML = ""; pintar(); });
        banco.appendChild(b);
      });
      bQuitar.disabled = orden.length <= fijas;
      bRev.disabled = orden.length < D.ETAPAS.length;
    }
    bQuitar.addEventListener("click", function(){ if(orden.length > fijas){ orden.pop(); pintar(); } });
    bRev.addEventListener("click", function(){
      S.intentosOrden++;
      var bien = 0; while(bien < orden.length && orden[bien].i === bien) bien++;
      if(S.intentosOrden === 1) S.ordenOk = orden.filter(function(f, k){ return f.i === k; }).length;
      pintar(true); fb.innerHTML = "";
      if(bien === D.ETAPAS.length){
        fb.appendChild(h("div", {class:"fb best"}, [h("span", {class:"h", text:"Correcto"}), h("span", {text:"El circuito empieza con su reporte y termina cuando algo cambia en el sistema para que la falla no vuelva."})]));
        bRev.hidden = true; bQuitar.hidden = true; bSig.hidden = false; bSig.focus();
      } else if(S.intentosOrden >= 3){
        orden = D.ETAPAS.map(function(t, i){ return fichas.filter(function(f){ return f.i === i; })[0]; }); fijas = orden.length;
        pintar(true);
        fb.appendChild(h("div", {class:"fb ok"}, [h("span", {class:"h", text:"Este es el orden correcto"}), h("span", {text:"Primero se repara (diagnóstico), luego se busca por qué falló (FRACAS), se corrige, se verifica, se cierra y se mejora."})]));
        bRev.hidden = true; bQuitar.hidden = true; bSig.hidden = false;
      } else {
        fb.appendChild(h("div", {class:"fb bad"}, [h("span", {class:"h", text: bien === 0 ? "La primera etapa no está bien" : (bien === 1 ? "Solo la primera etapa está bien" : "Las primeras " + bien + " están bien")}), h("span", {text:"Se conservan las primeras " + bien + " y se ordenan otra vez las demás. Pregúntese: ¿se puede corregir algo antes de saber por qué falló?, ¿se puede cerrar algo sin verificarlo?"})]));
        fijas = bien; orden = orden.slice(0, bien);
        setTimeout(function(){ pintar(); }, 1800);
      }
    });
    bSig.addEventListener("click", reportes);
    app.appendChild(h("section", {class:"stack"}, [
      cab("Parte 1 de 2 · El circuito del reporte"),
      h("h2", {text:"¿En qué orden viaja un reporte?"}),
      h("p", {class:"muted", text:"Toque las etapas en el orden en que ocurren."}),
      h("div", {class:"card stack"}, [lista, h("div", {class:"row"}, [bQuitar, bRev])]),
      banco, fb, h("div", {class:"row"}, [h("span"), bSig])
    ]));
    pintar();
  }

  /* ---------- Parte 2: los dos reportes ---------- */
  function tarjetasReportes(E){
    return h("div", {class:"formgrid"}, [
      h("div", {class:"card stack"}, [h("span", {class:"tag best", text:"Reporte A"}), h("p", {text:E.bueno})]),
      h("div", {class:"card stack"}, [h("span", {class:"tag bad", text:"Reporte B"}), h("p", {text:E.malo})])
    ]);
  }
  function reportes(){
    var E = D.EVENTOS[S.rol]; app.innerHTML = ""; arriba();
    var b = h("button", {type:"button", class:"btn", text:"Seguir los reportes"}); b.addEventListener("click", function(){ parada(0); });
    app.appendChild(h("section", {class:"stack"}, [
      cab("Parte 2 de 2 · " + E.titulo),
      h("h2", {text:E.titulo}),
      h("div", {class:"situ"}, [h("p", {text:E.intro})]),
      tarjetasReportes(E),
      h("p", {class:"muted", text:"Ahora va a seguir los dos reportes por cada etapa del circuito."}),
      h("div", {class:"row"}, [h("span"), b])
    ]));
  }
  function parada(i){
    var E = D.EVENTOS[S.rol], P = D.PARADAS[i], R = E.paradas[P.id]; app.innerHTML = ""; arriba();
    var ops = Comun.mezclar(P.ops), opts = h("div", {class:"opts"}), fb = h("div", {"aria-live":"polite"}), comp = h("div");
    var sig = h("button", {type:"button", class:"btn", hidden:"hidden", text: i + 1 < D.PARADAS.length ? "Siguiente etapa" : "Ver mi resultado"});
    sig.addEventListener("click", function(){ if(i + 1 < D.PARADAS.length) parada(i + 1); else resultado(); });
    var primero = true;
    ops.forEach(function(o, k){
      var b = h("button", {type:"button", class:"opt"}, [h("span", {class:"k", text:String.fromCharCode(65 + k) + "."}), h("span", {text:o.t})]);
      b.addEventListener("click", function(){
        if(primero){ S.resp[i] = o.ok; primero = false; }
        fb.innerHTML = "";
        if(o.ok){
          Array.prototype.forEach.call(opts.children, function(x, j){ x.disabled = true; if(j === k) x.classList.add("best"); else x.classList.add("dim"); });
          fb.appendChild(h("div", {class:"fb best"}, [h("span", {class:"h", text:"Correcto"}), h("span", {text:P.fb})]));
          comp.appendChild(h("div", {class:"formgrid"}, [
            h("div", {class:"card stack"}, [h("span", {class:"tag best", text:"Con el reporte A"}), h("p", {text:R.bueno})]),
            h("div", {class:"card stack"}, [h("span", {class:"tag bad", text:"Con el reporte B"}), h("p", {text:R.malo})])
          ]));
          sig.hidden = false; sig.focus();
        } else {
          b.disabled = true; b.classList.add("bad");
          fb.appendChild(h("div", {class:"fb bad"}, [h("span", {class:"h", text:"No es la mejor respuesta"}), h("span", {text:"Piense en qué necesita la persona de esta etapa para hacer su trabajo. Intente otra opción."})]));
        }
      });
      opts.appendChild(b);
    });
    var ver = h("details", null, [h("summary", {text:"Ver los dos reportes"}), tarjetasReportes(E)]);
    app.appendChild(h("section", {class:"stack"}, [
      cab("Parte 2 de 2 · Etapa " + (i + 1) + " de " + D.PARADAS.length),
      h("h2", {text:P.etapa}),
      ver,
      h("div", {class:"card stack"}, [h("h3", {text:P.pregunta}), opts, fb]),
      comp,
      h("div", {class:"row"}, [h("span"), sig])
    ]));
  }

  function resultado(){
    app.innerHTML = ""; arriba();
    var okP = S.resp.filter(function(x){ return x; }).length, nP = D.PARADAS.length, nE = D.ETAPAS.length;
    var pts = Math.round((S.ordenOk + okP) * 100 / (nE + nP));
    var msg = h("p", {class:"muted", "aria-live":"polite"});
    var bRep = h("button", {type:"button", class:"btn ghost", text:"Repetir"}); bRep.addEventListener("click", inicio);
    var tb = h("tbody");
    D.PARADAS.forEach(function(P, i){ tb.appendChild(h("tr", null, [h("td", {text:P.etapa}), h("td", null, [h("span", {class:"tag " + (S.resp[i] ? "best" : "bad"), text:S.resp[i] ? "Al primer intento" : "Con ayuda"})])])); });
    app.appendChild(h("section", {class:"stack"}, [
      h("div", {class:"card stack"}, [
        h("div", {class:"eyebrow", text:"Resultado · " + D.titulo}),
        h("h2", {text:S.nombre + " · " + D.ROLES[S.rol].nombre}),
        h("div", {class:"score", text:pts + " / 100"}),
        h("p", {text:"Orden del circuito (primer intento): " + S.ordenOk + " de " + nE + " etapas en su lugar. Etapas respondidas al primer intento: " + okP + " de " + nP + "."})
      ]),
      h("div", {class:"tablewrap"}, [h("table", null, [h("thead", null, [h("tr", null, [h("th", {text:"Etapa"}), h("th", {text:"Usted"})])]), tb])]),
      h("div", {class:"lesson"}, [h("strong", {text:"Para llevarse: "}), document.createTextNode(D.leccion)]),
      h("div", {class:"row"}, [bRep, h("a", {class:"btn", href:"../../index.html", text:"Volver al inicio"})]),
      msg
    ]));
    if(S.enviado){ msg.textContent = "✔ Resultado ya registrado."; return; }
    S.enviado = true;
    var ENC = ["Fecha","Nombre","Especialidad","Puntaje (0-100)","Orden: etapas en su lugar (1er intento)","Intentos para ordenar"]
      .concat(D.PARADAS.map(function(P){ return P.etapa; }));
    var fila = [Comun.fecha(), S.nombre, D.ROLES[S.rol].nombre, pts, S.ordenOk + " de " + nE, S.intentosOrden]
      .concat(S.resp.map(function(x){ return x ? "Al primer intento" : "Con ayuda"; }));
    Comun.enviar(D.actividad, D.titulo, ENC, fila, msg);
  }

  inicio();
})();
