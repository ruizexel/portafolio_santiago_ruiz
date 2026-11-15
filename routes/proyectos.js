/* ============================================================================
   Rutas de proyectos.
   - Toda ruta variable pasa primero por validarProyecto (allowlist de 6 slugs).
   - /proyectos vuelve a la sección del index.
   - /proyectos/:proyecto redirige a la URL canónica /:proyecto.
   - /:proyecto delega la respuesta al controlador si el slug es válido.
   - Un slug fuera de la allowlist redirige al index de presentación.
   ============================================================================ */

"use strict";

const express = require("express");
const validarProyecto = require("../middleware/validarProyecto");
const {
  mostrarProyecto,
  redirigirProyecto,
} = require("../controllers/proyectos");

const router = express.Router();

router.get("/proyectos", (req, res) => {
  res.redirect(301, "/#proyectos");
});

/* Las URLs antiguas siguen funcionando mediante redirección permanente. */
router.get("/proyectos/:proyecto", validarProyecto, redirigirProyecto);

router.get("/:proyecto", validarProyecto, mostrarProyecto);

module.exports = router;
