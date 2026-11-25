"use strict";
/* Portal: muestra las sesiones (SESIONES en assets/ramas.js) y, al entrar a una,
   sus actividades. #s2 abre la sesión 2; #todas muestra todas las ramas. */
(function(){
  var h = Comun.h, app = document.getElementById("app");

  function conSesion(href, n){ return href + (href.indexOf("?") >= 0 ? "&" : "?") + "s=" + n; }
  function tarjeta(eyebrow, titulo, desc, href, pie){
    return h("a", {class:"rama", href:href}, [
      h("div", {class:"eyebrow", text:eyebrow}), h("div", {class:"t", text:titulo}),
      h("div", {class:"d", text:desc}), h("div", {class:"n", text:pie || "Entrar →"})]);
  }

  function inicio(){
    var grid = h("div", {class:"ramas"});
    SESIONES.forEach(function(s){
      var n = s.actividades.length;
      grid.appendChild(tarjeta("Sesión " + s.n, s.titulo, s.tema, "#s" + s.n,
        n ? n + (n === 1 ? " actividad →" : " actividades →") : "En preparación"));
    });
    var comp = h("div", {class:"ramas"});
    (window.COMPLEMENTARIO || []).forEach(function(c){ comp.appendChild(tarjeta("Complementario", c.titulo, c.descripcion, c.href)); });
    return [
      h("div", {class:"eyebrow", text:"Curso RAMS · Personal operativo"}),
      h("h1", {text:"Elija su sesión"}),
      h("p", {text:"Cada sesión tiene sus actividades. Sus resultados se envían al instructor al terminar cada ejercicio."}),
      grid,
      comp.childNodes.length ? h("h2", {text:"Material complementario"}) : null,
      comp.childNodes.length ? comp : null,
      h("p", null, [h("a", {href:"#todas", text:"Ver todas las ramas del simulador"})])
    ];
  }

  function sesion(s){
    var grid = h("div", {class:"ramas"});
    s.actividades.forEach(function(a, i){ grid.appendChild(tarjeta("Actividad " + (i + 1), a.titulo, a.descripcion, conSesion(a.href, s.n))); });
    return [
      h("div", {class:"row"}, [h("div", {class:"eyebrow", text:"Sesión " + s.n}), h("a", {class:"btn ghost", href:"#", text:"← Todas las sesiones"})]),
      h("h1", {text:s.titulo}),
      h("p", {class:"muted", text:s.tema}),
      s.actividades.length ? grid : h("div", {class:"situ"}, [h("p", {text:"Las actividades de esta sesión están en preparación."})])
    ];
  }

  function todas(){
    var grid = h("div", {class:"ramas"});
    RAMAS.forEach(function(r, i){ grid.appendChild(tarjeta("Rama " + (i + 1), r.titulo, r.descripcion, r.carpeta + "/index.html")); });
    return [
      h("div", {class:"row"}, [h("div", {class:"eyebrow", text:"Todas las ramas"}), h("a", {class:"btn ghost", href:"#", text:"← Todas las sesiones"})]),
      h("h1", {text:"Todas las ramas del simulador"}),
      h("p", {text:"Cada rama con todos sus ejercicios, sin filtrar por sesión."}),
      grid
    ];
  }

  function pintar(){
    var m = /^#s(\d+)$/.exec(location.hash), partes;
    if(m){ var s = SESIONES.filter(function(x){ return String(x.n) === m[1]; })[0]; partes = s ? sesion(s) : inicio(); }
    else if(location.hash === "#todas") partes = todas();
    else partes = inicio();
    app.innerHTML = "";
    app.appendChild(h("section", {class:"stack"}, partes));
    try { window.scrollTo(0, 0); } catch(e){}
  }
  window.addEventListener("hashchange", pintar);
  pintar();
})();
