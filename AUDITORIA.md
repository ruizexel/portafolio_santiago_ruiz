# Auditoría de seguridad — `auditoria-1`

- **Fecha:** 2026-11-14
- **Rama:** `auditoria-1`
- **Alcance:** `server.js`, rutas, middleware, controladores, plantilla SSR, datos, cliente JS, cabeceras/CSP, dependencias, build y preparación para Vercel.

## Resumen ejecutivo

El sitio es una aplicación Express que sirve HTML estático y una plantilla SSR. La superficie de ataque es pequeña: no hay backend de formularios, base de datos, autenticación ni subida de archivos. Los riesgos estaban concentrados en cabeceras, manejo de `/img`, fallback y preparación para serverless. `npm audit` reporta **0 vulnerabilidades**.

## Hallazgos y estado

| # | Riesgo | Severidad | Estado |
|---|--------|-----------|--------|
| 1 | Faltaban `Permissions-Policy`, COOP/CORP, HSTS y `object-src 'none'` | Media | Corregido |
| 2 | `/img` con ruta no permitida caía al index (HTML 200) | Baja/Media | Corregido: 404 |
| 3 | El fallback respondía el index a métodos no GET/HEAD | Baja | Corregido: 404 |
| 4 | Sin manejador de errores: posible fuga de stack | Baja | Corregido |
| 5 | `server.js` hacía `listen` al importarse; incompatible con serverless | Media (Vercel) | Corregido: export + guard |
| 6 | El build usaba `npx` (red y posible deriva de versión) | Baja | Corregido: binario local |
| 7 | `safeUrl` permitía `http://` (downgrade en HTTPS) | Baja | Corregido: solo `https://` |
| 8 | Faltaban `.env*` y `.vercel/` en `.gitignore` | Baja | Corregido |
| 9 | Sin `engines.node` para el host | Baja | Corregido |
| 10 | `/img` servía la imagen con cualquier método (POST/DELETE) | Baja | Corregido: solo GET/HEAD |
| 11 | Formulario sin backend; si se conecta, faltan CSRF/rate limit | Media (futuro) | Pendiente |
| 12 | Enlaces `data-todo` y capturas pendientes | Baja | Pendiente (datos del autor) |
| 13 | `login_white.png` existe pero no está en la allowlist | Baja | Pendiente (decisión) |
| 14 | Google Fonts como dependencia externa | Baja / privacidad | Recomendación |
| 15 | Sin `robots.txt` ni `sitemap.xml` | Info | Recomendación |

## Revisión de inyección

- **XSS en SSR:** `views/proyectos/detalle.js` escapa texto con `escapeHtml`, URLs con `safeUrl` y rutas de imagen con `safeImageSrc`. Verificado con payloads `<script>` y `" onmouseover=`.
- **Path traversal:** `/img` compara contra una allowlist exacta; `..`, `%2e%2e` y variantes no coinciden. `sendFile` solo recibe rutas de `data/proyectos.js`.
- **Open redirect:** los destinos salen de la allowlist (`req.proyecto.slug`) o son fijos (`/`, `/#proyectos`). Slug inválido → `/`.
- **Comandos / SQL / NoSQL:** no hay ejecución de comandos, SQL ni body parsing.
- **Prototype pollution:** los slugs se resuelven con `Map`; no hay merges de objetos.
- **ReDoS:** no hay regex sobre entrada de usuario.

## Cambios aplicados

- `server.js`: cabeceras nuevas, `/img` solo GET/HEAD y 404 fuera de allowlist, fallback por método, error handler, export para Vercel.
- `views/proyectos/detalle.js`: `safeUrl` solo permite `https://` o `#`.
- `package.json`: scripts con el binario local `tailwindcss` y `engines.node`.
- `.gitignore`: `.env*` y `.vercel/`.
- `api/index.js` + `vercel.json`: adaptador serverless y archivos incluidos en el bundle.
- `AUDITORIA.md`: este documento.

## Verificación

```bash
npm audit          # 0 vulnerabilidades
npm run build      # tailwindcss v4.3.5; styles/build.css sin cambios
npm start
```

Resultados reales (servidor en `:3112`, peticiones HTTP crudas para evitar que el cliente normalice `..`):

| Petición | Resultado |
|---|---|
| `GET /` | 200 |
| `GET /planificador-eventos` | 200 |
| `GET /victus-caf` | 200 |
| `GET /loquesea` | 302 `/` |
| `GET /proyectos/loquesea` | 302 `/` |
| `GET /proyectos/planificador-eventos` | 301 `/planificador-eventos` |
| `GET /proyectos` | 301 `/#proyectos` |
| `GET /img/planificador_eventos/login.png` | 200 |
| `HEAD /img/planificador_eventos/login.png` | 200 |
| `GET /img/planificador_eventos/login_white.png` | 404 |
| `POST|DELETE /img/...` | 404 |
| `GET /img/../server.js`, `/img/..%2fserver.js`, `/img/%2e%2e/server.js` | 404 |
| `POST /`, `PUT /planificador-eventos` | 404 |
| `POST /styles/build.css` | 404 |
| `GET /server.js` | 302 `/` (no sirve el archivo) |
| `GET /data/proyectos.js`, `/views/...`, `/api/index.js` | 200 con el index, sin filtrar código |

Cabeceras presentes en `/`: CSP, HSTS, `Permissions-Policy`, COOP, CORP, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`. `x-powered-by` ausente.

SSR con payloads hostiles (`<script>`, `" onmouseover=`, `javascript:`, `data:`, rutas `../`):

- Sin atributos `href`/`src` con `javascript:`, `vbscript:` ni `data:text/html`.
- `demo` y `repo` inválidos degradan a `#`.
- Imágenes con traversal se descartan.
- Solo se emite el `<script src="/index.js?v=4" defer>` legítimo.

`styles/build.css` no cambió tras el build, así que **no** se subió `?v=N` ni `ASSET_VERSION`.

## Despliegue en Vercel

`vercel.json` enruta todo a `api/index.js` e `includeFiles` incluye los archivos que se leen con `sendFile`. **Validar en un preview**:

1. Importar el repo en Vercel o ejecutar `vercel`.
2. Confirmar `/`, `/:proyecto`, assets y cabeceras.
3. Si Vercel sirve algún asset por CDN sin pasar por Express, mover las cabeceras a `vercel.json` (`headers`).

## Recomendaciones pendientes

- Conectar el formulario a un endpoint propio con CSRF/rate limit, o a Formspree ajustando `form-action`/`connect-src`.
- Completar enlaces reales y capturas (`data-todo`).
- Decidir si se usa o elimina `login_white.png`.
- Self-host de fuentes si se quiere eliminar la dependencia de Google.
- Añadir `robots.txt`, `sitemap.xml` y metadatos Open Graph.
