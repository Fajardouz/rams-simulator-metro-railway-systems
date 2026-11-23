"use strict";
/* Utilidades compartidas por todas las ramas. */
var Comun = (function(){
  function h(tag, attrs, children){
    var e = document.createElement(tag);
    if(attrs) Object.keys(attrs).forEach(function(k){
      var v = attrs[k];
      if(v == null || v === false) return;
      if(k === "text") e.textContent = v;
      else if(k === "class") e.className = v;
      else if(k.slice(0, 2) === "on") e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v === true ? "" : v);
    });
    (children || []).forEach(function(c){ if(c != null) e.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return e;
  }
  function fecha(){
    var d = new Date(), p = function(n){ return String(n).padStart(2, "0"); };
    return d.getFullYear() + "/" + p(d.getMonth() + 1) + "/" + p(d.getDate()) + " " + p(d.getHours()) + ":" + p(d.getMinutes());
  }
  function getNombre(){ try { return localStorage.getItem("rams_nombre") || ""; } catch(e){ return ""; } }
  function setNombre(n){ try { localStorage.setItem("rams_nombre", n); } catch(e){} }
  function mezclar(a){
    a = a.slice();
    for(var i = a.length - 1; i > 0; i--){ var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  /* Envía una fila a Google Sheets. hoja = pestaña destino. */
  function enviar(actividad, hoja, encabezados, fila, msgEl){
    var url = window.SHEETS_URL;
    if(!url){ if(msgEl) msgEl.textContent = ""; return; }
    if(msgEl) msgEl.textContent = "Enviando su resultado al instructor…";
    fetch(url, {method:"POST", mode:"no-cors", headers:{"Content-Type":"text/plain;charset=utf-8"},
      body: JSON.stringify({actividad: actividad, hoja: hoja, encabezados: encabezados, fila: fila})})
      .then(function(){ if(msgEl) msgEl.textContent = "✔ Resultado enviado al instructor."; })
      .catch(function(){ if(msgEl) msgEl.textContent = "No se pudo enviar el resultado. Tome una captura de esta pantalla y entréguela al instructor."; });
  }
  return {h:h, fecha:fecha, getNombre:getNombre, setNombre:setNombre, mezclar:mezclar, enviar:enviar};
})();
