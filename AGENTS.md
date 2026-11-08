# AGENTS.md

Portafolio personal estático de Santiago Ruiz: HTML + CSS + JavaScript vanilla.
Sin `package.json`, sin build, sin dependencias, sin tests ni linter. No inventes comandos npm/pnpm.

## Comandos

- Previsualizar: `python3 -m http.server 8000` → http://localhost:8000
- Verificación: abrir la página y revisar la consola del navegador. No hay build, test, lint ni typecheck.

## Estructura

- `index.html` — página única. Secciones ancladas: `#inicio`, `#sobre-mi`, `#stack`, `#proyectos`, `#experiencia`, `#contacto`.
- `styles/styless.css` — todo el CSS, ordenado por secciones numeradas (tokens → reset → componentes → responsive). Tema oscuro único; los tokens están listos para añadir `[data-theme="light"]` después.
- `scripts.js` — módulos `init*()` llamados desde `DOMContentLoaded`. Se comunican con el DOM por hooks `data-*`, no por clases.
- `AGENTS.md` — este archivo.

## Gotchas

- El CSS se llama `styless.css` (doble “s”). Si lo renombras, actualiza `index.html` y este archivo.
- GitHub Pages cachea agresivamente: al cambiar CSS o JS, sube el `?v=N` del `<link>`/`<script>` en `index.html`.
- El JS depende de hooks `data-*`: `data-nav`, `data-menu-toggle`, `data-mobile-menu`, `data-reveal`, `data-copy-email`, `data-toast`, `data-year`. Cada `init*()` sale temprano si su hook no existe; mantén ese patrón.
- `.reveal` empieza invisible en CSS. Hay `<noscript>` y fallback para navegadores sin `IntersectionObserver`; si `scripts.js` falla al cargar, el contenido queda oculto. Mantén el script accesible y el patrón de fallback.
- El email `hola@santiagoruiz.dev` y los proyectos son placeholders. Reemplázalos con datos reales antes de publicar.
- El sitio se publica desde `main` vía GitHub Pages. No hay rama de staging ni pipeline de CI.
- Commits en español, siguiendo el estilo de los mensajes existentes.

## Convenciones

- Contenido y textos en español (es-CO); `lang="es"`.
- JavaScript en `"use strict"`, ES2022+, cero dependencias.
- No agregues frameworks, bundlers ni CDNs sin pedirlo.
