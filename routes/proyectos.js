/* ============================================================================
   Rutas de proyectos.
   - /proyectos vuelve a la sección del index.
   - /proyectos/:slug redirige a la URL canónica /:proyecto.
   - /:proyecto sirve el HTML propio si está permitido o el template dinámico.
   ============================================================================ */

"use strict";

const express = require("express");
const path = require("path");
const { proyectos, getProyecto } = require("../data/proyectos");
const { renderProyecto } = require("../views/proyecto");

const router = express.Router();
const ROOT = path.join(__dirname, "..");

router.get("/proyectos", (req, res) => {
  res.redirect(301, "/#proyectos");
});

/* Las URLs antiguas siguen funcionando mediante redirección permanente. */
router.get("/proyectos/:slug", (req, res, next) => {
  const proyecto = getProyecto(req.params.slug);
  if (!proyecto) return next();

  res.redirect(301, `/${proyecto.slug}`);
});

/* Ruta única variable: el campo `html` decide si hay página descentralizada. */
router.get("/:proyecto", (req, res, next) => {
  const proyecto = getProyecto(req.params.proyecto);
  if (!proyecto) return next();

  res.setHeader("Cache-Control", "no-cache");

  if (proyecto.html) {
    return res.sendFile(path.join(ROOT, proyecto.html));
  }

  res.type("html").send(renderProyecto(proyecto, proyectos));
});

module.exports = router;
