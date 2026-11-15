"use strict";

const { getProyecto } = require("../data/proyectos");

function validarProyecto(req, res, next) {
  const proyecto = getProyecto(req.params.proyecto);
  /* Fuera de la allowlist: se corrige la URL llevando al index de presentación. */
  if (!proyecto) return res.redirect(302, "/");

  req.proyecto = proyecto;
  next();
}

module.exports = validarProyecto;
