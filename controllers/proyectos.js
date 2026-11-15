"use strict";

const path = require("path");
const { proyectos } = require("../data/proyectos");
const { renderProyecto } = require("../views/proyectos/detalle");

const ROOT = path.join(__dirname, "..");

function mostrarProyecto(req, res) {
  const { proyecto } = req;
  res.setHeader("Cache-Control", "no-cache");

  if (proyecto.html) {
    return res.sendFile(path.join(ROOT, proyecto.html));
  }

  res.type("html").send(renderProyecto(proyecto, proyectos));
}

function redirigirProyecto(req, res) {
  res.redirect(301, `/${req.proyecto.slug}`);
}

module.exports = { mostrarProyecto, redirigirProyecto };
