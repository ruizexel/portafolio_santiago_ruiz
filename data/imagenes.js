/* ============================================================================
   Allowlist de imágenes servidas por /img.
   Cada ruta debe corresponder a un archivo real dentro de img/.
   Al agregar una captura nueva, declárala aquí antes de usarla en una página.
   ============================================================================ */

"use strict";

const imagenesPermitidas = [
  "/img/planificador_eventos/hoy.png",
  "/img/planificador_eventos/progreso.png",
  "/img/planificador_eventos/crearEvento.png",
  "/img/planificador_eventos/configuracion.png",
  "/img/planificador_eventos/login.png",
];

module.exports = { imagenesPermitidas };
