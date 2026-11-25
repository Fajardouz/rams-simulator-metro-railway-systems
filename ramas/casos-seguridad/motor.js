"use strict";
/* ============================================================
   ESTADO Y UTILIDADES
   ============================================================ */
var S = {temporada:[], nombre:"", rol:null, caso:null, paso:0, minutos:0, minContrato:0, barreras:3, respuestas:[], reporte:null, export:null};
var app = document.getElementById("app");

function h(tag, attrs, children){
  var e = document.createElement(tag);
  if(attrs){ for(var k in attrs){ if(k === "class") e.className = attrs[k]; else if(k === "text") e.textContent = attrs[k]; else e.setAttribute(k, attrs[k]); } }
  (children || []).forEach(function(c){ if(c == null) return; e.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
  return e;
}
function norm(s){ return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }
function casoActual(){ return CASOS.filter(function(c){ return c.id === S.caso; })[0]; }
function categoriaAT11(min){
  if(min <= 5) return "Perturbación menor (hasta 5 min)";
  if(min <= 30) return "Perturbación mayor (más de 5 y hasta 30 min)";
  return "Situación de emergencia (más de 30 min)";
}
function irArriba(){ window.scrollTo({top:0, behavior:"auto"}); }

/* ============================================================
   PANTALLA 1: INICIO
   ============================================================ */
function pantallaInicio(){
  app.innerHTML = "";
  var nombre = h("input", {type:"text", id:"nombre", autocomplete:"off", placeholder:"Nombre y apellido"});
  nombre.value = S.nombre;
  var roles = h("div", {class:"grid3", role:"radiogroup", "aria-label":"Especialidad"});
  var listaWrap = h("div", {class:"stack", id:"lista"});
  Object.keys(ROLES).forEach(function(k){
    var b = h("button", {type:"button", class:"choice" + (S.rol === k ? " sel" : ""), "aria-pressed": String(S.rol === k)}, [
      h("span", {class:"t", text:ROLES[k].nombre}), h("span", {class:"d", text:ROLES[k].desc})]);
    b.addEventListener("click", function(){ S.rol = k; pantallaInicio(); });
    roles.appendChild(b);
  });
  nombre.addEventListener("input", function(){ S.nombre = nombre.value; });

  app.appendChild(h("section", {class:"stack"}, [
    h("div", {class:"stack"}, [
      h("p", {class:"eyebrow", text:"Práctica de decisiones y reporte"}),
      h("h1", {text:"Usted toma las decisiones. El sistema le muestra las consecuencias."}),
      h("p", {class:"muted", text:"Cada caso es una situación de la operación de un sistema metro-ferroviario. En cada paso elige qué hacer y ve su efecto en tres medidores: minutos de servicio perdidos, barreras de seguridad activas y calidad del registro. Al final diligencia el registro de la novedad."})
    ]),
    h("div", {class:"card stack"}, [
      h("div", null, [h("label", {class:"f", for:"nombre", text:"1. Su nombre"}), nombre]),
      h("div", null, [h("span", {class:"f", text:"2. Su especialidad"}), roles])
    ]),
    listaWrap
  ]));
  if(S.rol) renderLista(listaWrap, nombre);
}
function tarjetaCaso(c, nombreInput){
  var b = h("button", {type:"button", class:"case"}, [
    h("span", {class:"tag", text:ROLES[c.rol].nombre}),
    h("h3", {text:c.titulo}),
    h("span", {class:"muted", text:c.resumen}),
    h("span", {class:"ref", text:c.ref})]);
  b.addEventListener("click", function(){
    S.nombre = nombreInput.value.trim();
    if(S.nombre.length < 3){ nombreInput.focus(); document.getElementById("aviso").textContent = "Escriba su nombre antes de empezar."; return; }
    iniciarCaso(c.id);
  });
  return b;
}
function renderLista(wrap, nombreInput){
  var base = window.SESION ? SESION.filtrar(CASOS) : CASOS; /* ?ver= limita los casos a los de la sesión */
  var propios = base.filter(function(c){ return c.rol === S.rol; });
  var otros = base.filter(function(c){ return c.rol !== S.rol; });
  var grid = h("div", {class:"caselist"}); propios.forEach(function(c){ grid.appendChild(tarjetaCaso(c, nombreInput)); });
  var grid2 = h("div", {class:"caselist"}); otros.forEach(function(c){ grid2.appendChild(tarjetaCaso(c, nombreInput)); });
  wrap.appendChild(h("h2", {text:"3. Elija un caso"}));
  var enTemporada = window.SESION && SESION.ver && propios.length > 1;
  wrap.appendChild(h("p", {class:"muted", id:"aviso", "aria-live":"polite", text: enTemporada ? "Temporada de fallas: resuelva los casos en orden, de la perturbación menor a la más larga. Al final de cada caso verá su resumen." : "Casos de su especialidad:"}));
  wrap.appendChild(grid);
  var det = h("details", {class:"other"}, [h("summary", {text:"Ver casos desde otro rol (para entender lo que ve su contraparte)"}), h("div", {style:"margin-top:12px"}, [grid2])]);
  wrap.appendChild(det);
}

/* ============================================================
   PANTALLA 2: CASO
   ============================================================ */
function iniciarCaso(id){
  S.caso = id; S.paso = 0; S.barreras = 3; S.respuestas = []; S.reporte = null; S.export = null;
  S.minutos = casoActual().minBase;
  S.minContrato = casoActual().minBase; /* reloj del contrato (AT11): desde el reporte o la alarma */
  var c = casoActual(); app.innerHTML = ""; irArriba();
  app.appendChild(h("section", {class:"stack"}, [
    h("p", {class:"eyebrow", text:ROLES[c.rol].nombre + " · " + c.ref}),
    h("h1", {text:c.titulo}),
    h("div", {class:"situ"}, [h("p", {text:c.contexto}), h("p", {class:"muted", text:"Fecha del caso: " + FECHA_CASO})]),
    h("p", {class:"muted", text:"No hay trampas: elija lo que haría de verdad en su puesto."}),
    h("div", {class:"row"}, [h("button", {type:"button", class:"btn ghost", id:"volver", text:"Volver"}), h("button", {type:"button", class:"btn", id:"empezar", text:"Empezar el caso"})])
  ]));
  document.getElementById("volver").onclick = pantallaInicio;
  document.getElementById("empezar").onclick = pantallaPaso;
}

function franja(estadoRegistro){
  var sh = h("div", {class:"shields", "aria-label": S.barreras + " de 3 barreras activas"});
  for(var i = 0; i < 3; i++) sh.appendChild(h("span", {class: i < S.barreras ? "" : "off"}));
  return h("div", {class:"status"}, [h("div", {class:"meters"}, [
    h("div", {class:"meter"}, [h("div", {class:"ml", text:"Servicio perdido"}), h("div", {class:"mv", text:S.minutos + " min"})]),
    h("div", {class:"meter"}, [h("div", {class:"ml", text:"Barreras"}), sh]),
    h("div", {class:"meter"}, [h("div", {class:"ml", text:"Registro"}), h("div", {class:"mv", style:"font-size:18px", text:estadoRegistro || "Pendiente"})])
  ])]);
}

function pantallaPaso(){
  var c = casoActual(), p = c.pasos[S.paso]; app.innerHTML = ""; irArriba();
  app.appendChild(franja());
  var opts = h("div", {class:"opts", id:"opts"});
  p.ops.forEach(function(o, i){
    var b = h("button", {type:"button", class:"opt"}, [h("span", {class:"k", text:String.fromCharCode(65 + i) + "."}), h("span", {text:o.t})]);
    b.addEventListener("click", function(){ elegir(i); });
    opts.appendChild(b);
  });
  var cuerpo = [
    h("div", {class:"row"}, [h("span", {class:"muted", text:"Decisión " + (S.paso + 1) + " de " + c.pasos.length + " · " + ROLES[c.rol].nombre}), h("span", {class:"clock", text:p.hora})])
  ];
  if(p.alarma) cuerpo.push(h("div", {class:"alarm", text:p.alarma}));
  if(p.radio) cuerpo.push(h("div", {class:"radio", text:"Radio · " + p.radio}));
  if(p.situ) cuerpo.push(h("div", {class:"situ", text:p.situ}));
  cuerpo.push(h("h2", {text:p.texto}), opts, h("div", {id:"fb", "aria-live":"polite"}),
    h("div", {class:"row"}, [h("span"), h("button", {type:"button", class:"btn", id:"sig", hidden:"hidden"})]));
  app.appendChild(h("section", {class:"card stack"}, cuerpo));
}

function elegir(i){
  var c = casoActual(), p = c.pasos[S.paso], o = p.ops[i];
  var bi = p.ops.map(function(x){ return x.q; }).indexOf("best");
  S.minutos += o.min; if(o.barrera && S.barreras > 0) S.barreras--;
  /* reloj:false = minutos que pasan antes de que alguien reporte: los sufre el pasajero, pero el contrato aún no los cuenta */
  if(o.reloj !== false) S.minContrato += o.min;
  S.respuestas.push({hora:p.hora, pregunta:p.texto, elegida:o.t, calidad:o.q, mejor:p.ops[bi].t, ref:o.ref});
  Array.prototype.forEach.call(document.getElementById("opts").children, function(b, idx){
    b.disabled = true;
    if(idx === i) b.classList.add(o.q); else if(idx === bi) b.classList.add("best"); else b.classList.add("dim");
  });
  var titulo = o.q === "best" ? "Buena decisión" : (o.q === "ok" ? "Se puede hacer mejor" : "Decisión de riesgo");
  var efectos = [];
  if(o.barrera) efectos.push("Se perdió una barrera de seguridad.");
  if(o.min) efectos.push("Sumó " + o.min + " min de servicio perdido.");
  if(o.min && o.reloj === false) efectos.push("El contrato aún no cuenta estos minutos porque nadie había reportado, pero el pasajero sí los sufrió.");
  var fb = document.getElementById("fb"); fb.innerHTML = "";
  fb.appendChild(h("div", {class:"fb " + o.q}, [
    h("span", {class:"h", text:titulo}), h("span", {text:o.fb + (efectos.length ? " " + efectos.join(" ") : "")}),
    h("span", {class:"rams", text:"Idea RAMS: " + o.rams}), h("span", {class:"ref", text:"Referencia: " + o.ref})]));
  var old = document.querySelector(".status"); old.parentNode.replaceChild(franja(), old);
  var sig = document.getElementById("sig"); sig.hidden = false;
  sig.textContent = S.paso + 1 < c.pasos.length ? "Siguiente decisión" : "Diligenciar el registro";
  sig.onclick = function(){ S.paso++; if(S.paso < c.pasos.length) pantallaPaso(); else pantallaRegistro(); };
  sig.focus();
}

/* ============================================================
   PANTALLA 3: REGISTRO (Registro Diario, Anexo 07)
   ============================================================ */
function selectCon(id, opciones){
  var s = h("select", {id:id}); s.appendChild(h("option", {value:"", text:"Seleccione…"}));
  opciones.forEach(function(o){ s.appendChild(h("option", {value:o, text:o})); });
  return s;
}
function campo(labelText, control, full){
  return h("div", {class: full ? "full" : ""}, [h("label", {class:"f", for:control.id, text:labelText}), control]);
}
function pantallaRegistro(){
  var c = casoActual(), r = c.reporte; app.innerHTML = ""; irArriba();
  app.appendChild(franja("En curso"));
  var fecha = h("input", {type:"text", id:"r_fecha", placeholder:"AAAA/MM/DD", inputmode:"numeric"});
  var hora = h("input", {type:"time", id:"r_hora"});
  var ubi = selectCon("r_ubi", r.ubicaciones);
  var cat = selectCon("r_cat", CATEGORIAS);
  var cont = h("textarea", {id:"r_cont", placeholder:"Qué pasó, dónde, qué equipo o tren, qué se hizo y quién lo autorizó. Sin abreviaturas ni códigos no oficiales."});
  var rec = selectCon("r_rec", RECEPTORES);
  var can = selectCon("r_can", CANALES);
  var form = h("form", {class:"formgrid", id:"form"}, [
    campo("Fecha (AAAA/MM/DD)", fecha), campo("Hora del evento", hora),
    campo("Ubicación", ubi), h("div", null, [h("span", {class:"f", text:"Emisor"}), h("div", {class:"fixed", text:r.emisor})]),
    campo("Categoría", cat, true), campo("Contenido", cont, true), campo("Receptor", rec), campo("Canal", can),
    h("div", {class:"full row"}, [h("span", {class:"muted", text:"Revise antes de guardar: el registro se califica."}), h("button", {type:"submit", class:"btn", text:"Guardar registro"})])
  ]);
  form.addEventListener("submit", function(ev){ ev.preventDefault(); calificar(); });
  app.appendChild(h("section", {class:"card stack"}, [
    h("p", {class:"eyebrow", text:"Registro Diario · Novedades e incidentes"}),
    h("h2", {text:r.titulo}),
    h("p", {class:"muted", text:"La norma pide registrar en este orden: fecha y hora, ubicación, emisor, contenido, receptor y canal. Reportar tarde, omitir o reportar sin verificar se considera un reporte incorrecto."}),
    form]));
}
function calificar(){
  var c = casoActual(), r = c.reporte;
  var v = {fecha:document.getElementById("r_fecha").value.trim(), hora:document.getElementById("r_hora").value, ubicacion:document.getElementById("r_ubi").value,
    categoria:document.getElementById("r_cat").value, contenido:document.getElementById("r_cont").value.trim(), receptor:document.getElementById("r_rec").value, canal:document.getElementById("r_can").value};
  var nc = norm(v.contenido);
  var claves = r.claves.filter(function(k){ return nc.indexOf(norm(k)) >= 0; }).length;
  var checks = [
    {n:"Fecha en formato AAAA/MM/DD", ok:v.fecha === FECHA_CASO, tip:"Debía ser " + FECHA_CASO + ", con año, mes y día separados por barras."},
    {n:"Hora del evento", ok:v.hora === r.hora, tip:"El evento empezó a las " + r.hora + ". La hora exacta permite cruzar el registro con los sistemas."},
    {n:"Ubicación", ok:v.ubicacion === r.ubicacion, tip:"Correcta: " + r.ubicacion + "."},
    {n:"Categoría", ok:r.categorias.indexOf(v.categoria) >= 0, tip:"Correcta: " + r.categorias.join(" u ") + "."},
    {n:"Contenido completo", ok:v.contenido.length >= 60 && claves >= 2, tip:"Describa qué pasó, con el tren, equipo o lugar y lo que se hizo (al menos dos datos clave y unas dos frases)."},
    {n:"Receptor", ok:r.receptores.indexOf(v.receptor) >= 0, tip:"Debía ir a: " + r.receptores.join(" o ") + "."},
    {n:"Canal", ok:r.canales.indexOf(v.canal) >= 0, tip:"Canal esperado: " + r.canales.join(" o ") + "."}
  ];
  S.reporte = {valores:v, checks:checks};
  pantallaResultado();
}

/* ============================================================
   PANTALLA 4: RESULTADO Y EXPORTACIÓN
   ============================================================ */
function puntajes(){
  var bruto = 0; S.respuestas.forEach(function(x){ bruto += x.calidad === "best" ? 10 : (x.calidad === "ok" ? 5 : 0); });
  var dec = S.respuestas.length ? Math.round(40 * bruto / (10 * S.respuestas.length)) : 0; /* siempre sobre 40, sin importar cuántas decisiones tenga el caso */
  var bar = S.barreras * 10;
  var okR = S.reporte.checks.filter(function(k){ return k.ok; }).length;
  var rep = Math.round(30 * okR / S.reporte.checks.length);
  return {dec:dec, bar:bar, rep:rep, okR:okR, total:dec + bar + rep};
}
/* Temporada: casos de la misma especialidad abiertos desde una sesión (?ver=...), en orden */
function casosTemporada(rol){ return (window.SESION && SESION.ver ? SESION.filtrar(CASOS) : []).filter(function(x){ return x.rol === rol; }); }
function siguienteDeTemporada(c){
  var lista = casosTemporada(c.rol);
  for(var i = 0; i < lista.length - 1; i++) if(lista[i].id === c.id) return lista[i + 1];
  return null;
}
function resumenTemporada(c){
  var lista = casosTemporada(c.rol); if(lista.length < 2) return null;
  var tb = h("tbody"), totMin = 0;
  lista.forEach(function(x, i){
    var r = null; S.temporada.forEach(function(t){ if(t.id === x.id) r = t; });
    if(r) totMin += r.min;
    tb.appendChild(h("tr", null, [h("td", {text:"Ronda " + (i + 1) + " · " + x.titulo}),
      h("td", {text: r ? r.min + " min" : "—"}), h("td", {text: r ? r.cat : "—"}), h("td", {text: r ? r.pts + " / 100" : "Pendiente"})]));
  });
  return h("div", {class:"stack"}, [h("h3", {text:"Su temporada de fallas"}),
    h("div", {class:"tablewrap"}, [h("table", null, [h("thead", null, [h("tr", null, [h("th", {text:"Caso"}), h("th", {text:"Servicio perdido"}), h("th", {text:"Categoría AT11"}), h("th", {text:"Puntaje"})])]), tb])]),
    h("p", {class:"muted", text:"Minutos de servicio perdidos en toda la temporada: " + totMin + " min."})]);
}
function pantallaResultado(){
  var c = casoActual(), P = puntajes(); app.innerHTML = ""; irArriba();
  S.temporada = S.temporada.filter(function(t){ return t.id !== c.id; });
  S.temporada.push({id:c.id, min:S.minutos, cat:categoriaAT11(S.minContrato), pts:P.total});
  var sigT = siguienteDeTemporada(c), bSig = null;
  if(sigT){ bSig = h("button", {type:"button", class:"btn", text:"Siguiente caso de la temporada →"}); bSig.addEventListener("click", function(){ iniciarCaso(sigT.id); }); }
  app.appendChild(franja(P.okR + " de " + S.reporte.checks.length));
  var tb = h("tbody");
  S.respuestas.forEach(function(x, i){
    var et = x.calidad === "best" ? "Buena" : (x.calidad === "ok" ? "Mejorable" : "De riesgo");
    tb.appendChild(h("tr", null, [h("td", {text:String(i + 1)}), h("td", null, [h("div", {text:x.elegida}), h("span", {class:"tag " + x.calidad, text:et})]), h("td", {text: x.calidad === "best" ? "—" : x.mejor})]));
  });
  var tb2 = h("tbody");
  S.reporte.checks.forEach(function(k){
    tb2.appendChild(h("tr", null, [h("td", null, [h("span", {class:"tag " + (k.ok ? "best" : "bad"), text:k.ok ? "Bien" : "Falta"})]), h("td", {text:k.n}), h("td", {text:k.ok ? "" : k.tip})]));
  });
  var msg = h("p", {class:"muted", id:"expmsg", "aria-live":"polite"});
  var msgS = h("p", {class:"muted", id:"sheetsmsg", "aria-live":"polite"});
  var bExp = h("button", {type:"button", class:"btn", text:"Descargar mi resultado (CSV)"});
  bExp.addEventListener("click", function(){ exportar(P, msg); });
  var bOtra = h("button", {type:"button", class:"btn ghost", text:"Elegir otro caso"});
  bOtra.addEventListener("click", pantallaInicio);
  app.appendChild(h("section", {class:"card stack"}, [
    h("p", {class:"eyebrow", text:"Resultado · " + c.titulo}),
    h("h2", {text:S.nombre + " · " + ROLES[c.rol].nombre}),
    h("div", {class:"score", text:P.total + " / 100"}),
    h("div", {class:"parts"}, [
      h("div", {class:"part"}, [h("div", {class:"muted", text:"Decisiones"}), h("div", {class:"pv", text:P.dec + " / 40"})]),
      h("div", {class:"part"}, [h("div", {class:"muted", text:"Barreras conservadas"}), h("div", {class:"pv", text:P.bar + " / 30"})]),
      h("div", {class:"part"}, [h("div", {class:"muted", text:"Registro"}), h("div", {class:"pv", text:P.rep + " / 30"})])]),
    h("p", null, [h("strong", {text:"Servicio perdido para el pasajero: " + S.minutos + " min. "}),
      document.createTextNode("Tiempo que mide el contrato (desde el reporte o la alarma): " + S.minContrato + " min. Según el AT11, corresponde a una " + categoriaAT11(S.minContrato).toLowerCase() + ".")]),
    S.minutos > S.minContrato ? h("p", {class:"muted", text:"Reportar tarde no acorta la perturbación: solo retrasa la respuesta. Los minutos antes del reporte los pierde igual el pasajero."}) : null,
    h("div", {class:"lesson"}, [h("strong", {text:"Lo que debe llevarse: "}), document.createTextNode(c.leccion)]),
    h("h3", {text:"Sus decisiones"}),
    h("div", {class:"tablewrap"}, [h("table", null, [h("thead", null, [h("tr", null, [h("th", {text:"#"}), h("th", {text:"Lo que eligió"}), h("th", {text:"La mejor opción"})])]), tb])]),
    h("h3", {text:"Su registro"}),
    h("div", {class:"tablewrap"}, [h("table", null, [h("thead", null, [h("tr", null, [h("th", {text:""}), h("th", {text:"Criterio"}), h("th", {text:"Qué faltó"})])]), tb2])]),
    resumenTemporada(c),
    h("div", {class:"row"}, [bOtra, h("div", {class:"row"}, [bExp, bSig])]), msg, msgS
  ]));
  enviarASheets(P, msgS);
}

// ===== Envío de resultados a Google Sheets =====
// Pegue aquí la URL de su aplicación web de Apps Script (termina en /exec).
var ACTIVIDAD = "Casos aplicados de seguridad";
function datosResultado(P){
  var c = casoActual(), d = new Date();
  var f = d.getFullYear() + "/" + String(d.getMonth() + 1).padStart(2, "0") + "/" + String(d.getDate()).padStart(2, "0") + " " + String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
  var enc = ["Fecha de la práctica","Nombre","Especialidad del caso","Caso","Puntaje total","Decisiones (40)","Barreras (30)","Registro (30)","Minutos perdidos","Categoría AT11"];
  var fila = [f, S.nombre, ROLES[c.rol].nombre, c.titulo, P.total, P.dec, P.bar, P.rep, S.minutos, categoriaAT11(S.minContrato)];
  S.respuestas.forEach(function(x, i){ enc.push("Decisión " + (i + 1)); fila.push((x.calidad === "best" ? "Buena" : (x.calidad === "ok" ? "Mejorable" : "De riesgo")) + ": " + x.elegida); });
  S.reporte.checks.forEach(function(k){ enc.push("Registro - " + k.n); fila.push(k.ok ? "Bien" : "Falta"); });
  enc.push("Registro - contenido"); fila.push(S.reporte.valores.contenido);
  enc.push("Minutos que mide el contrato (AT11)"); fila.push(S.minContrato);
  return {enc:enc, fila:fila};
}
function enviarASheets(P, msgS){
  if(!SHEETS_URL){ msgS.textContent = ""; return; }
  var D = datosResultado(P);
  var cuerpo = JSON.stringify({actividad: ACTIVIDAD, hoja: casoActual().titulo, encabezados: D.enc, fila: D.fila});
  msgS.textContent = "Enviando su resultado al instructor…";
  fetch(SHEETS_URL, {method:"POST", mode:"no-cors", headers:{"Content-Type":"text/plain;charset=utf-8"}, body:cuerpo})
    .then(function(){ msgS.textContent = "✔ Resultado enviado al instructor."; })
    .catch(function(){ msgS.textContent = "No se pudo enviar el resultado. Descargue el CSV y entrégueselo al instructor."; });
}

function csvCampo(x){ x = String(x == null ? "" : x).replace(/\r?\n/g, " "); return '"' + x.replace(/"/g, '""') + '"'; }
function construirCSV(P){
  var D = datosResultado(P);
  return "\ufeff" + D.enc.map(csvCampo).join(";") + "\r\n" + D.fila.map(csvCampo).join(";") + "\r\n";
}
function nombreArchivo(){
  var c = casoActual();
  return ("resultado_" + S.nombre + "_" + c.id).normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^A-Za-z0-9_-]+/g, "_") + ".csv";
}
function exportar(P, msg){
  var csv = construirCSV(P), name = nombreArchivo();
  var viaClaude = window.claude && typeof window.claude.use === "function";
  if(viaClaude){
    msg.textContent = "Preparando la descarga…";
    window.claude.use("downloads").then(function(dl){
      if(!dl){ msg.textContent = "La descarga no está disponible en esta vista. Muestre esta pantalla al instructor."; return; }
      return dl.save({filename:name, data:csv}).then(function(){ msg.textContent = "Archivo " + name + " guardado. Entréguelo al instructor."; },
        function(e){ msg.textContent = (e && e.code === "declined") ? "Descarga cancelada." : "No se pudo descargar el archivo. Muestre esta pantalla al instructor."; });
    }, function(){ msg.textContent = "No se pudo descargar el archivo. Muestre esta pantalla al instructor."; });
    return;
  }
  try{
    var blob = new Blob([csv], {type:"text/csv;charset=utf-8"}), a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click();
    setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); }, 500);
    msg.textContent = "Se descargó el archivo " + name + ". Entréguelo al instructor.";
  }catch(e){ msg.textContent = "No se pudo descargar el archivo en este equipo. Muestre esta pantalla al instructor."; }
}

pantallaInicio();
