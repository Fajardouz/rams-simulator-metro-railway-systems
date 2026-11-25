"use strict";
/* ============================================================
   MOTOR DE ACTIVIDADES
   Lee window.RAMA (definida en el contenido.js de cada rama) y muestra sus ejercicios.
   Tipos de ejercicio:
   - "colocar": arrastrar (o tocar y tocar) fichas a casillas. forma: "v" | "lista" | "secuencia".
   - "preguntas": selección múltiple con retroalimentación, con contexto y reporte opcionales.
   No hace falta tocar este archivo para agregar ejercicios: solo el contenido.js de la rama.
   ============================================================ */
(function(){
  var R = window.RAMA, h = Comun.h, app = document.getElementById("app");
  var nombre = Comun.getNombre();
  var ENC = ["Fecha","Nombre","Rama","Ejercicio","Tipo","Puntaje (0-100)","Aciertos","Total","Detalle"];

  document.title = R.titulo + " · Simulador RAMS";
  var bt = document.getElementById("brandtitle"); if(bt) bt.textContent = R.titulo;

  function arriba(){ try { window.scrollTo({top:0, behavior:"smooth"}); } catch(e){ window.scrollTo(0, 0); } }

  /* ---------- Pantalla de inicio de la rama ---------- */
  function inicio(){
    app.innerHTML = ""; arriba();
    var inp = h("input", {type:"text", id:"nombre", placeholder:"Nombre y apellido", autocomplete:"name"});
    inp.value = nombre;
    var aviso = h("p", {class:"muted", "aria-live":"polite"});
    var lista = h("div", {class:"caselist"});
    (window.SESION ? SESION.filtrar(R.ejercicios) : R.ejercicios).forEach(function(ej){
      var tipo = ej.tipo === "colocar" ? (ej.forma === "v" ? "Arrastrar al ciclo en V" : ej.forma === "secuencia" ? "Ordenar pasos" : "Emparejar") : "Preguntas";
      lista.appendChild(h("button", {type:"button", class:"case", onclick:function(){
        var n = inp.value.trim();
        if(n.length < 3){ aviso.textContent = "Escriba su nombre antes de empezar."; inp.focus(); return; }
        nombre = n; Comun.setNombre(n); abrir(ej);
      }}, [h("span", {class:"tag", text:tipo}), h("strong", {text:ej.titulo}), h("span", {class:"ref", text:ej.resumen || ""})]));
    });
    app.appendChild(h("section", {class:"stack"}, [
      h("div", {class:"eyebrow", text:"Rama"}),
      h("h1", {text:R.titulo}),
      h("p", {text:R.descripcion || ""}),
      h("div", {class:"card stack"}, [
        h("div", null, [h("label", {class:"f", for:"nombre", text:"1. Su nombre"}), inp, aviso]),
        h("div", {class:"f", text:"2. Elija un ejercicio"}),
        lista
      ])
    ]));
  }

  function abrir(ej){ if(ej.tipo === "colocar") colocar(ej); else preguntas(ej); }

  function cabecera(ej){
    return [
      h("div", {class:"row"}, [h("div", {class:"eyebrow", text:R.titulo}),
        h("button", {type:"button", class:"btn ghost", text:"← Ejercicios", onclick:inicio})]),
      h("h2", {text:ej.titulo}),
      ej.instrucciones ? h("p", {class:"situ", text:ej.instrucciones}) : null
    ];
  }

  /* ---------- Resultado común ---------- */
  function resultado(ej, aciertos, total, detalle, cont, yaEnviado){
    var pts = total ? Math.round(aciertos * 100 / total) : 0;
    var msg = h("p", {class:"muted", "aria-live":"polite"});
    cont.appendChild(h("div", {class:"card stack"}, [
      h("div", {class:"eyebrow", text:"Resultado"}),
      h("div", {class:"score", text:pts + " / 100"}),
      h("p", {text:aciertos + " de " + total + " correctas."}),
      ej.leccion ? h("div", {class:"lesson"}, [h("strong", {text:"Para llevarse: "}), document.createTextNode(ej.leccion)]) : null,
      h("div", {class:"row"}, [
        h("button", {type:"button", class:"btn ghost", text:"Repetir", onclick:function(){ abrir(ej); }}),
        h("button", {type:"button", class:"btn", text:"Elegir otro ejercicio", onclick:inicio})
      ]),
      msg
    ]));
    if(yaEnviado){ msg.textContent = "✔ Resultado ya registrado."; return; }
    var tipo = ej.tipo === "colocar" ? "colocar-" + (ej.forma || "lista") : "preguntas";
    Comun.enviar(R.actividad || R.titulo, R.titulo, ENC,
      [Comun.fecha(), nombre, R.titulo, ej.titulo, tipo, pts, aciertos, total, detalle], msg);
  }

  /* ---------- Tipo "colocar" ---------- */
  function colocar(ej){
    var fichas = Comun.mezclar(ej.fichas.map(function(f, i){ return {i:i, texto:f.texto, casilla:f.casilla || null}; }));
    var asig = {};            // casillaId -> índice de ficha
    var sel = null, revisado = false;
    var cont = h("section", {class:"stack"});

    function dondeEsta(fi){ for(var k in asig) if(asig[k] === fi) return k; return null; }
    function poner(fi, cid){
      if(revisado) return;
      var prev = dondeEsta(fi); if(prev) delete asig[prev];
      asig[cid] = fi; sel = null; pintar();
    }
    function quitar(cid){ if(revisado) return; delete asig[cid]; pintar(); }
    function textoFicha(fi){ for(var j = 0; j < fichas.length; j++) if(fichas[j].i === fi) return fichas[j].texto; return ""; }
    function correctaDe(cid){ for(var j = 0; j < ej.fichas.length; j++) if(ej.fichas[j].casilla === cid) return ej.fichas[j].texto; return ""; }

    function casillaEl(c, extraClass){
      var fi = asig[c.id];
      var zona = h("div", {class:"zona" + (fi == null ? " vacia" : "")}, [fi == null ? "Suelte aquí" : textoFicha(fi)]);
      var cls = "casilla" + (extraClass ? " " + extraClass : "");
      if(revisado){ cls += (fi != null && ej.fichas[fi].casilla === c.id) ? " ok" : " bad"; }
      var el = h("div", {class:cls, role:"button", tabindex:"0",
        "aria-label":(c.etiqueta || "Casilla") + (fi == null ? ": vacía" : ": " + textoFicha(fi))}, [
        c.etiqueta ? h("div", {class:"cl", text:c.etiqueta}) : null, zona,
        (revisado && !(fi != null && ej.fichas[fi].casilla === c.id) && cont.dataset.sol === "1") ? h("div", {class:"sol", text:"✔ " + correctaDe(c.id)}) : null
      ]);
      function activar(){ if(sel != null) poner(sel, c.id); else if(fi != null) quitar(c.id); }
      el.addEventListener("click", activar);
      el.addEventListener("keydown", function(e){ if(e.key === "Enter" || e.key === " "){ e.preventDefault(); activar(); } });
      el.addEventListener("dragover", function(e){ if(!revisado){ e.preventDefault(); el.classList.add("drop"); } });
      el.addEventListener("dragleave", function(){ el.classList.remove("drop"); });
      el.addEventListener("drop", function(e){ e.preventDefault(); var v = e.dataTransfer.getData("text/plain"); if(v !== "") poner(parseInt(v, 10), c.id); });
      return el;
    }

    function tablero(){
      var forma = ej.forma || "lista";
      if(forma === "v"){
        var g = h("div", {class:"vgrid"}), max = 0;
        ej.casillas.forEach(function(c){ max = Math.max(max, c.nivel || 1); });
        g.appendChild(h("div", {class:"vhead"}, [h("div", {text:ej.tituloIzq || "↓ Definición y diseño"}), h("div", {text:ej.tituloDer || "Integración y validación ↑"})]));
        for(var n = 1; n <= max; n++){
          var fila = h("div", {class:"vrow", style:"--i:" + (n - 1)});
          var izq = null, der = null, cen = null;
          ej.casillas.forEach(function(c){ if((c.nivel || 1) === n){ if(c.lado === "izq") izq = c; else if(c.lado === "der") der = c; else cen = c; } });
          if(cen) fila.appendChild(casillaEl(cen, "centro"));
          else {
            fila.appendChild(izq ? casillaEl(izq, "izq") : h("div", {class:"casilla izq vacio"}));
            fila.appendChild(der ? casillaEl(der, "der") : h("div", {class:"casilla der vacio"}));
          }
          g.appendChild(fila);
        }
        return g;
      }
      var box = h("div", {class: forma === "secuencia" ? "seq" : "stack"});
      ej.casillas.forEach(function(c, k){
        var cc = forma === "secuencia" ? {id:c.id, etiqueta:c.etiqueta || ("Paso " + (k + 1))} : c;
        box.appendChild(casillaEl(cc, forma === "lista" ? "lista" : ""));
      });
      return box;
    }

    function banco(){
      var b = h("div", {class:"banco", "aria-label":"Fichas por colocar"});
      fichas.forEach(function(f){
        if(dondeEsta(f.i)) return;
        var el = h("button", {type:"button", class:"ficha" + (sel === f.i ? " sel" : ""), draggable:"true", text:f.texto});
        el.addEventListener("click", function(){ if(revisado) return; sel = (sel === f.i) ? null : f.i; pintar(); });
        el.addEventListener("dragstart", function(e){ e.dataTransfer.setData("text/plain", String(f.i)); });
        b.appendChild(el);
      });
      if(!b.childNodes.length) b.appendChild(h("span", {class:"muted", text: revisado ? "Revisado." : "Todas las fichas están colocadas. Ya puede revisar."}));
      return b;
    }

    function pintar(){
      var y = window.scrollY;
      cont.innerHTML = "";
      cabecera(ej).forEach(function(x){ if(x) cont.appendChild(x); });
      var llenas = ej.casillas.every(function(c){ return asig[c.id] != null; });
      cont.appendChild(h("div", {class:"card stack"}, [
        h("div", {class:"progreso", text: sel != null ? "Ficha seleccionada: toque la casilla donde va." : "Arrastre una ficha a su casilla, o tóquela y luego toque la casilla. Toque una casilla llena para devolver la ficha."}),
        banco()
      ]));
      cont.appendChild(h("div", {class:"card"}, [tablero()]));
      if(!revisado){
        cont.appendChild(h("div", {class:"row"}, [
          h("button", {type:"button", class:"btn ghost", text:"Reiniciar", onclick:function(){ asig = {}; sel = null; pintar(); }}),
          h("button", {type:"button", class:"btn", text:"Revisar", disabled: !llenas, onclick:revisar})
        ]));
      } else {
        cont.appendChild(h("div", {class:"row"}, [
          h("button", {type:"button", class:"btn ghost", text: cont.dataset.sol === "1" ? "Ocultar solución" : "Ver solución", onclick:function(){ cont.dataset.sol = cont.dataset.sol === "1" ? "0" : "1"; pintar(); }})
        ]));
        if(ej.explicacion) cont.appendChild(h("div", {class:"fb best"}, [h("div", {class:"h", text:"Explicación"}), h("div", {text:ej.explicacion})]));
        resultado(ej, cont._ac, ej.casillas.length, cont._det, cont, cont._enviado);
        cont._enviado = true;
      }
      window.scrollTo(0, y);
    }

    function revisar(){
      var ac = 0, errores = [];
      ej.casillas.forEach(function(c){
        var fi = asig[c.id];
        if(fi != null && ej.fichas[fi].casilla === c.id) ac++;
        else errores.push((c.etiqueta || c.id) + " ← " + (fi != null ? ej.fichas[fi].texto : "vacía"));
      });
      revisado = true; cont._ac = ac;
      cont._det = errores.length ? "Errores: " + errores.join(" | ") : "Todo correcto";
      pintar();
    }

    app.innerHTML = ""; arriba(); app.appendChild(cont); pintar();
  }

  /* ---------- Tipo "preguntas" ---------- */
  function preguntas(ej){
    var k = 0, ac = 0, det = [];
    var cont = h("section", {class:"stack"});
    var ctx = [];
    if(ej.contexto) ctx.push(h("p", {text:ej.contexto}));
    if(ej.reporte){
      var tb = h("tbody");
      Object.keys(ej.reporte).forEach(function(campo){ tb.appendChild(h("tr", null, [h("th", {text:campo}), h("td", {text:String(ej.reporte[campo])})])); });
      ctx.push(h("div", {class:"tablewrap"}, [h("table", {class:"reporte"}, [tb])]));
    }

    function pintar(){
      cont.innerHTML = "";
      cabecera(ej).forEach(function(x){ if(x) cont.appendChild(x); });
      if(ctx.length) cont.appendChild(h("div", {class:"card stack"}, [h("div", {class:"eyebrow", text: ej.reporte ? "Reporte" : "Contexto"})].concat(ctx)));
      if(k >= ej.preguntas.length){ resultado(ej, ac, ej.preguntas.length, det.join(" | "), cont); return; }
      var q = ej.preguntas[k], fb = h("div"), opts = h("div", {class:"opts"});
      var sig = h("button", {type:"button", class:"btn", text: k + 1 < ej.preguntas.length ? "Siguiente pregunta" : "Ver resultado", hidden:true,
        onclick:function(){ k++; pintar(); arriba(); }});
      q.opciones.forEach(function(o, j){
        var b = h("button", {type:"button", class:"opt"}, [h("span", {class:"k", text:String.fromCharCode(65 + j)}), h("span", {text:o})]);
        b.addEventListener("click", function(){
          var bien = j === q.correcta;
          if(bien) ac++;
          det.push("P" + (k + 1) + ": " + (bien ? "bien" : "mal (eligió " + String.fromCharCode(65 + j) + ")"));
          Array.prototype.forEach.call(opts.children, function(x, i){
            x.disabled = true;
            if(i === q.correcta) x.classList.add("best"); else if(i === j) x.classList.add("bad"); else x.classList.add("dim");
          });
          fb.appendChild(h("div", {class:"fb " + (bien ? "best" : "bad")}, [
            h("div", {class:"h", text: bien ? "Correcto." : "No es la mejor respuesta."}),
            q.explicacion ? h("div", {text:q.explicacion}) : null,
            q.ref ? h("div", {class:"ref", text:"Referencia: " + q.ref}) : null
          ]));
          sig.hidden = false; sig.focus();
        });
        opts.appendChild(b);
      });
      cont.appendChild(h("div", {class:"card stack"}, [
        h("div", {class:"progreso", text:"Pregunta " + (k + 1) + " de " + ej.preguntas.length}),
        h("h3", {text:q.p}), opts, fb, h("div", {class:"row"}, [h("span"), sig])
      ]));
    }
    app.innerHTML = ""; arriba(); app.appendChild(cont); pintar();
  }

  inicio();
})();
