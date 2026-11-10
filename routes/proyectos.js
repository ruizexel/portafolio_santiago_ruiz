/* ============================================================================
   Rutas de proyectos.
   - /proyectos vuelve a la sección del index.
   - /proyectos/:slug solo renderiza slugs de la allowlist de data/proyectos.js.
   ============================================================================ */

"use strict";

const express = require("express");
const { proyectos, getProyecto } = require("../data/proyectos");
const { renderProyecto } = require("../views/proyecto");

const router = express.Router();

router.get("/", (req, res) => {
  res.redirect(301, "/#proyectos");
});

router.get("/:slug", (req, res, next) => {
  const proyecto = getProyecto(req.params.slug);
  if (!proyecto) return next();

  res.setHeader("Cache-Control", "no-cache");
  res.type("html").send(renderProyecto(proyecto, proyectos));
});

module.exports = router;
