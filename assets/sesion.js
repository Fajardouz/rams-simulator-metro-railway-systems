"use strict";
/* ============================================================
   SESIÓN: permite abrir una rama desde la página de una sesión.
   Parámetros en la dirección:
     ?s=2            número de la sesión (el botón "Inicio" vuelve a esa sesión)
     &ver=id1,id2    muestra solo esos ejercicios o casos de la rama
   Sin parámetros, la rama se ve completa, como siempre.
   ============================================================ */
var SESION = (function(){
  function param(n){ var m = new RegExp("[?&]" + n + "=([^&#]*)").exec(location.search); return m ? decodeURIComponent(m[1]) : ""; }
  var ver = param("ver"), s = param("s");
  var lista = ver ? ver.split(",").map(function(x){ return x.trim(); }).filter(Boolean) : null;
  function volver(href){ return s && /^\.\.\/\.\.\/index\.html$/.test(href) ? href + "#s" + s : href; }
  if(s){
    var b = document.querySelector("a.back");
    if(b){ b.setAttribute("href", volver(b.getAttribute("href"))); b.textContent = "← Sesión " + s; }
    /* también los enlaces que se crean después (por ejemplo, "Volver al inicio" en los resultados) */
    document.addEventListener("click", function(e){
      var a = e.target && e.target.closest ? e.target.closest("a") : null;
      if(a) a.setAttribute("href", volver(a.getAttribute("href") || ""));
    }, true);
  }
  return {
    n: s,
    ver: lista,
    filtrar: function(items){ return lista ? items.filter(function(x){ return lista.indexOf(x.id) >= 0; }) : items; }
  };
})();
