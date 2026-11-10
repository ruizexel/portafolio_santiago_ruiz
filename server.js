/* ============================================================================
   Servidor Express del portafolio.
   - Sirve el index y los assets compilados con una allowlist explícita.
   - Renderiza /proyectos/:slug solo si el slug existe en data/proyectos.js.
   - Cualquier ruta no reconocida cae al index (fallback tipo SPA).
   ============================================================================ */

"use strict";

const express = require("express");
const path = require("path");
const { proyectos } = require("./data/proyectos");
const proyectosRouter = require("./routes/proyectos");

const app = express();
const ROOT = __dirname;
const PORT = Number(process.env.PORT || process.argv[2]) || 3000;

app.disable("x-powered-by");

/* Cabeceras básicas: evitan sniffing, framing y ejecución de recursos externos. */
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "style-src 'self' https://fonts.googleapis.com",
      "font-src https://fonts.gstatic.com",
      "img-src 'self' data:",
      "script-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
    ].join("; ")
  );
  next();
});

const sendHtml = (res, file) => {
  res.setHeader("Cache-Control", "no-cache");
  res.sendFile(file);
};

const sendAsset = (res, file) => {
  res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  res.sendFile(file);
};

/* Assets permitidos. No se expone el resto del repositorio (server.js, data/, etc.). */
app.get("/", (req, res) => sendHtml(res, path.join(ROOT, "index.html")));
app.get("/index.html", (req, res) => sendHtml(res, path.join(ROOT, "index.html")));
app.get("/index.js", (req, res) => sendAsset(res, path.join(ROOT, "index.js")));
app.get("/styles/build.css", (req, res) =>
  sendAsset(res, path.join(ROOT, "styles", "build.css"))
);

/* Imágenes: solo se sirven las rutas declaradas en las galerías de los proyectos. */
const imagenesPermitidas = new Set(
  proyectos.flatMap((proyecto) => (proyecto.gallery ?? []).map((imagen) => imagen.src))
);

app.use("/img", (req, res, next) => {
  const src = `/img${req.path}`;
  if (!imagenesPermitidas.has(src)) return next();

  res.setHeader("Cache-Control", "public, max-age=86400");
  res.sendFile(path.join(ROOT, src));
});

/* Rutas de proyectos: /proyectos y /proyectos/:slug. */
app.use("/proyectos", proyectosRouter);

/* Fallback: rutas no reconocidas vuelven al index. */
app.use((req, res) => sendHtml(res, path.join(ROOT, "index.html")));

const server = app.listen(PORT, () => {
  console.log(`Portafolio disponible en http://localhost:${PORT}`);
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`El puerto ${PORT} está ocupado. Prueba con: PORT=${PORT + 1} npm start`);
    process.exit(1);
  }
  throw error;
});
