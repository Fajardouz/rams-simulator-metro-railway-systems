# Simulador RAMS · Sistemas metro-ferroviarios

Simulador general de práctica RAMS para personal de operación y mantenimiento de sistemas metro-ferroviarios.
Los casos y referencias son ilustrativos; adáptelos al reglamento de cada sistema.
Web publicada: https://fajardouz.github.io/rams-simulator-metro-railway-systems/

## Estructura

```
index.html                  Portal: muestra las ramas
assets/
  ramas.js                  Lista de ramas del portal (agregar o quitar ramas aquí)
  config.js                 URL de Google Sheets donde llegan los resultados
  estilos.css               Diseño común
  comun.js                  Utilidades comunes (envío de resultados, nombre)
  actividades.js            Motor de ejercicios (arrastrar y preguntas). No hace falta tocarlo.
  portal.js                 Dibuja el portal
  logo.js                   Logo (ícono de tren)
ramas/
  teoria/                   Ejercicios teóricos RAMS (ciclo en V, letras RAMS, indicadores, conceptos)
    contenido.js            ← SE ALIMENTA AQUÍ
  casos-seguridad/          Casos aplicados de seguridad (simulador de decisiones)
    contenido.js            ← SE ALIMENTA AQUÍ (roles y casos)
    motor.js                Lógica del simulador
  fracas/                   Reportes de falla (FRACAS)
    contenido.js            ← SE ALIMENTA AQUÍ
```

## Cómo alimentar una rama

Solo se edita el archivo `contenido.js` de la rama. Al inicio de cada uno está explicado el formato.

En **teoria** y **fracas** hay dos tipos de ejercicio:

- `tipo: "colocar"`: arrastrar fichas a casillas. `forma: "v"` (ciclo en V), `"lista"` (emparejar) o `"secuencia"` (ordenar pasos).
- `tipo: "preguntas"`: selección múltiple. Puede llevar `contexto` y un `reporte` que se muestra como tabla.

Para agregar un ejercicio, copie un bloque `{ ... }` existente dentro de `ejercicios: [ ... ]`, péguelo a continuación (con una coma entre bloques) y cambie los textos. Cada `id` debe ser único.

## Cómo agregar una rama nueva

1. Copie la carpeta `ramas/teoria` con otro nombre, por ejemplo `ramas/mantenimiento`.
2. Cambie su `contenido.js`.
3. Agréguela a la lista en `assets/ramas.js`.

## Resultados

Al terminar cada ejercicio, el resultado se envía a la hoja de Google "Resultados Simulador RAMS", con una pestaña por rama.
La URL está en `assets/config.js`.

## Probar antes de publicar

Descargue el repositorio y abra `index.html` con doble clic: funciona sin internet, salvo el envío de resultados.
Cada cambio en la rama `main` se publica solo en la web en uno o dos minutos.
Recomendación: revisar los cambios con un compañero antes de publicarlos; una coma faltante en `contenido.js` deja la rama en blanco.
