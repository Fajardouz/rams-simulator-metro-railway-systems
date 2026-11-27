"use strict";
/* ============================================================
   MOTOR DE ¿ESTO SE REPORTA?
   Lee window.REPORTAR (definido en contenido.js). Para cambiar situaciones solo se edita contenido.js.
   Flujo: inicio (nombre y especialidad) → una situación a la vez (qué es, a quién se reporta,
          explicación y otro intento si se equivocó) → resultado (se envía a Google Sheets).
   ============================================================ */
(function(){
  var D = window.REPORTAR, h = Comun.h, app = document.getElementById("app");
  var S = {nombre: Comun.getNombre(), rol: null, lista: [], i: 0, res: [], enviado: false};

  document.title = D.titulo + " · Simulador RAMS";
  function arriba(){ try { window.scrollTo({top:0, behavior:"smooth"}); } catch(e){ window.scrollTo(0, 0); } }

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
    var tipos = h("div", {class:"stack"});
    Object.keys(D.TIPOS).forEach(function(k){ tipos.appendChild(h("p", null, [h("strong", {text:D.TIPOS[k].n + ": "}), document.createTextNode(D.TIPOS[k].d)])); });
    var aviso = h("p", {class:"muted", "aria-live":"polite"});
    var b = h("button", {type:"button", class:"btn", text:"Empezar"});
    b.addEventListener("click", function(){
      var n = inp.value.trim();
      if(n.length < 3){ aviso.textContent = "Escriba su nombre antes de empezar."; inp.focus(); return; }
      if(!S.rol){ aviso.textContent = "Elija su especialidad."; return; }
      S.nombre = n; Comun.setNombre(n);
      S.lista = D.SITUACIONES[S.rol]; S.i = 0; S.res = []; S.enviado = false;
      situacion();
    });
    app.appendChild(h("section", {class:"stack"}, [
      h("div", {class:"eyebrow", text:"Rama · Sesión 5"}),
      h("h1", {text:D.titulo}),
      h("p", {text:D.descripcion}),
      h("div", {class:"situ"}, [h("p", {text:"En cada situación decida qué es y a quién se reporta. Si se equivoca, verá la explicación y podrá intentarlo otra vez."}), tipos,
        h("p", {class:"muted", text:"Situaciones hipotéticas con fines de formación. Siempre prima el procedimiento vigente."})]),
      h("div", {class:"card stack"}, [
        h("div", null, [h("label", {class:"f", for:"nombre", text:"1. Su nombre"}), inp]),
        h("div", null, [h("span", {class:"f", text:"2. Su especialidad"}), roles]),
        aviso, h("div", {class:"row"}, [h("span"), b])
      ])
    ]));
  }

  function grupoOpciones(nombre, opciones){
    var box = h("div", {class:"opts", role:"radiogroup"});
    opciones.forEach(function(o, i){
      var id = nombre + "_" + i;
      box.appendChild(h("label", {class:"opt", for:id}, [h("input", {type:"radio", name:nombre, id:id, value:o.v}), h("span", {text:o.t})]));
    });
    return box;
  }
  function elegido(nombre){ var x = app.querySelector("input[name='" + nombre + "']:checked"); return x ? x.value : ""; }

  function situacion(){
    var s = S.lista[S.i], R = D.ROLES[S.rol], intento = 0; app.innerHTML = ""; arriba();
    var qTipo = grupoOpciones("tipo", Object.keys(D.TIPOS).map(function(k){ return {v:k, t:D.TIPOS[k].n}; }));
    var qA = grupoOpciones("a", R.receptores.map(function(r){ return {v:r, t:r}; }));
    var bloqueA = h("div", {class:"stack"}, [h("h3", {text:"2. ¿A quién se reporta?"}), qA]);
    qTipo.addEventListener("change", function(){ bloqueA.hidden = elegido("tipo") === "nada"; });
    var fb = h("div", {"aria-live":"polite"}), aviso = h("p", {class:"muted", "aria-live":"polite"});
    var bRev = h("button", {type:"button", class:"btn", text:"Revisar"});
    var bOtra = h("button", {type:"button", class:"btn ghost", text:"Intentarlo otra vez", hidden:"hidden"});
    var bSig = h("button", {type:"button", class:"btn", text: S.i + 1 < S.lista.length ? "Siguiente situación" : "Ver mi resultado", hidden:"hidden"});
    function bloquear(si){ Array.prototype.forEach.call(app.querySelectorAll("input[type=radio]"), function(x){ x.disabled = si; }); }
    bRev.addEventListener("click", function(){
      var t = elegido("tipo"), a = elegido("a");
      if(!t){ aviso.textContent = "Elija qué es."; return; }
      if(t !== "nada" && !a){ aviso.textContent = "Elija a quién se reporta."; return; }
      aviso.textContent = ""; intento++;
      var okT = t === s.tipo, okA = s.tipo === "nada" ? true : a === s.a, ok = okT && okA;
      if(intento === 1) S.res.push({okT:okT, okA:okA, propio:!!s.propio});
      bloquear(true); bRev.hidden = true;
      fb.innerHTML = "";
      var lineas = [h("span", {class:"h", text: ok ? "Correcto" : "Revise"})];
      if(!okT) lineas.push(h("span", {text:"Qué es: no es «" + D.TIPOS[t].n + "»."}));
      if(okT && !okA) lineas.push(h("span", {text:"Qué es: correcto. A quién: no es la persona indicada."}));
      if(ok || intento > 1){
        lineas.push(h("span", {text:"Respuesta: " + D.TIPOS[s.tipo].n + (s.tipo === "nada" ? "." : ", se reporta a: " + s.a + ".")}));
        lineas.push(h("span", {text:s.fb}));
        if(s.propio) lineas.push(h("span", {class:"muted", text:"Este fue un error propio. Reportarlo es lo correcto: así se corrige el sistema y no le pasa a otra persona."}));
        bSig.hidden = false; bOtra.hidden = true; bSig.focus();
      } else {
        lineas.push(h("span", {text:"Piense en esto: ¿alguien salió afectado?, ¿pudo pasar algo?, ¿falló un equipo? Vuelva a intentarlo."}));
        bOtra.hidden = false; bSig.hidden = false;
      }
      fb.appendChild(h("div", {class:"fb " + (ok ? "best" : "bad")}, lineas));
    });
    bOtra.addEventListener("click", function(){ bloquear(false); bRev.hidden = false; bOtra.hidden = true; bSig.hidden = true; fb.innerHTML = ""; });
    bSig.addEventListener("click", function(){ S.i++; if(S.i < S.lista.length) situacion(); else resultado(); });
    app.appendChild(h("section", {class:"stack"}, [
      h("div", {class:"row"}, [h("div", {class:"eyebrow", text:"Situación " + (S.i + 1) + " de " + S.lista.length + " · " + R.nombre}), h("button", {type:"button", class:"btn ghost", text:"← Inicio", onclick:inicio})]),
      h("div", {class:"situ"}, [h("p", {text:s.texto})]),
      h("div", {class:"card stack"}, [h("h3", {text:"1. ¿Qué es?"}), qTipo, bloqueA, aviso, fb,
        h("div", {class:"row"}, [bOtra, h("div", {class:"row"}, [bRev, bSig])])])
    ]));
  }

  function resultado(){
    app.innerHTML = ""; arriba();
    var okT = 0, okA = 0, okAmbos = 0, propios = 0, propiosOk = 0;
    S.res.forEach(function(r){ if(r.okT) okT++; if(r.okA) okA++; if(r.okT && r.okA) okAmbos++; if(r.propio){ propios++; if(r.okT && r.okA) propiosOk++; } });
    var n = S.res.length, pts = Math.round(okAmbos * 100 / n);
    var tb = h("tbody");
    S.lista.forEach(function(s, i){
      var r = S.res[i];
      tb.appendChild(h("tr", null, [h("td", {text:String(i + 1)}), h("td", {text:s.texto}),
        h("td", {text:D.TIPOS[s.tipo].n + (s.tipo === "nada" ? "" : " · " + s.a)}),
        h("td", null, [h("span", {class:"tag " + (r.okT && r.okA ? "best" : "bad"), text: r.okT && r.okA ? "Al primer intento" : "Con ayuda"})])]));
    });
    var msg = h("p", {class:"muted", "aria-live":"polite"});
    var bRep = h("button", {type:"button", class:"btn ghost", text:"Repetir"}); bRep.addEventListener("click", inicio);
    app.appendChild(h("section", {class:"stack"}, [
      h("div", {class:"card stack"}, [
        h("div", {class:"eyebrow", text:"Resultado · " + D.titulo}),
        h("h2", {text:S.nombre + " · " + D.ROLES[S.rol].nombre}),
        h("div", {class:"score", text:pts + " / 100"}),
        h("p", {text:"Al primer intento: " + okAmbos + " de " + n + " situaciones. Qué es: " + okT + " de " + n + ". A quién: " + okA + " de " + n + "."})
      ]),
      h("div", {class:"tablewrap"}, [h("table", null, [h("thead", null, [h("tr", null, ["#","Situación","Respuesta","Usted"].map(function(x){ return h("th", {text:x}); }))]), tb])]),
      h("div", {class:"lesson"}, [h("strong", {text:"Para llevarse: "}), document.createTextNode(D.leccion)]),
      h("div", {class:"row"}, [bRep, h("a", {class:"btn", href:"../../index.html", text:"Volver al inicio"})]),
      msg
    ]));
    if(S.enviado){ msg.textContent = "✔ Resultado ya registrado."; return; }
    S.enviado = true;
    var ENC = ["Fecha","Nombre","Especialidad","Puntaje (0-100)","Correctas al primer intento","Total","Qué es (aciertos)","A quién (aciertos)","Errores propios bien clasificados"];
    var fila = [Comun.fecha(), S.nombre, D.ROLES[S.rol].nombre, pts, okAmbos, n, okT, okA, propiosOk + " de " + propios];
    S.lista.forEach(function(s, i){ ENC.push("Situación " + (i + 1)); fila.push(S.res[i].okT && S.res[i].okA ? "Bien" : "Con ayuda"); });
    Comun.enviar(D.actividad, D.titulo, ENC, fila, msg);
  }

  inicio();
})();
