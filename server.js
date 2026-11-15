/* ============================================================================
   Servidor Express del portafolio.
   - Sirve el index y los assets compilados con una allowlist explícita.
   - Sirve /:proyecto desde un HTML propio o desde el template dinámico.
   - Cualquier ruta no reconocida cae al index (fallback tipo SPA).
   - Exporta la app para Vercel; solo escucha cuando se ejecuta directamente.
   ============================================================================ */

"use strict";

const express = require("express");
const path = require("path");
const { imagenesPermitidas } = require("./data/imagenes");
const indexRouter = require("./routes");
const proyectosRouter = require("./routes/proyectos");

const app = express();
const ROOT = __dirname;
const PORT = Number(process.env.PORT || process.argv[2]) || 3000;

app.disable("x-powered-by");

/* Cabeceras de seguridad: sniffing, framing, referrer, permisos y CSP. */
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-XSS-Protection", "0");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()"
  );
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  res.setHeader(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "style-src 'self' https://fonts.googleapis.com",
      "font-src https://fonts.gstatic.com",
      "img-src 'self' data:",
      "script-src 'self'",
      "object-src 'none'",
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
app.get("/index.js", (req, res) => sendAsset(res, path.join(ROOT, "index.js")));
app.get("/styles/build.css", (req, res) =>
  sendAsset(res, path.join(ROOT, "styles", "build.css"))
);

/* Imágenes: solo se sirven las rutas declaradas en data/imagenes.js. */
const imagenes = new Set(imagenesPermitidas);

app.use("/img", (req, res) => {
  /* Las imágenes solo se leen; cualquier otro método responde 404. */
  if (req.method !== "GET" && req.method !== "HEAD") return res.sendStatus(404);

  const src = `/img${req.path}`;
  if (!imagenes.has(src)) return res.sendStatus(404);

  res.setHeader("Cache-Control", "public, max-age=86400");
  res.sendFile(path.join(ROOT, src));
});

/* Rutas de presentación y proyectos. */
app.use(indexRouter);
app.use(proyectosRouter);

/* Fallback: solo GET/HEAD desconocidos vuelven al index; el resto es 404. */
app.use((req, res) => {
  if (req.method !== "GET" && req.method !== "HEAD") return res.sendStatus(404);
  sendHtml(res, path.join(ROOT, "index.html"));
});

/* Error handler: evita filtrar stack traces al cliente. */
app.use((error, req, res, next) => {
  console.error(error);
  if (res.headersSent) return next(error);
  res.status(500).type("text/plain").send("Error interno del servidor");
});

/* Solo escucha cuando se ejecuta directamente; Vercel importa el app. */
if (require.main === module) {
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
}

module.exports = app;
