"use strict";
/* Portal: muestra las ramas definidas en assets/ramas.js */
(function(){
  var h = Comun.h, app = document.getElementById("app");
  var grid = h("div", {class:"ramas"});
  RAMAS.forEach(function(r, i){
    grid.appendChild(h("a", {class:"rama", href:r.carpeta + "/index.html"}, [
      h("div", {class:"eyebrow", text:"Rama " + (i + 1)}),
      h("div", {class:"t", text:r.titulo}),
      h("div", {class:"d", text:r.descripcion}),
      h("div", {class:"n", text:"Entrar →"})
    ]));
  });
  app.appendChild(h("section", {class:"stack"}, [
    h("div", {class:"eyebrow", text:"Práctica RAMS"}),
    h("h1", {text:"Elija la rama que quiere practicar"}),
    h("p", {text:"Cada rama tiene sus propios ejercicios. Sus resultados se envían al instructor al terminar cada ejercicio."}),
    grid
  ]));
})();
