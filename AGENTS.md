# AGENTS.md

Portafolio personal de Santiago Ruiz: Express + HTML semántico + Tailwind CSS v4 + JavaScript vanilla.
Sin frameworks de UI, sin bundler y sin tests. El CSS propio vive en carpetas con atomic design.
Las páginas de proyecto se renderizan en el servidor con Express.

## Comandos

- Instalar dependencias: `npm install`
- Compilar CSS en modo watch: `npm run dev`
- Compilar CSS para publicar: `npm run build`
- Levantar el sitio: `npm start` → http://localhost:3000
- Servidor con recarga: `npm run dev:server`
- Verificación: abrir la página y revisar la consola del navegador. No hay test, lint ni typecheck.

`npm run build` genera `styles/build.css`. Ese archivo **se commitea**: el host sirve el CSS ya compilado.

## Estructura

```
index.html                  landing; secciones #inicio, #sobre-mi, #stack, #proyectos, #contacto
index.js                    módulos init*() del cliente, llamados desde DOMContentLoaded
server.js                   Express: cabeceras, assets allowlisted, /img y fallback al index
routes/proyectos.js         router de /proyectos y /proyectos/:slug (allowlist de data/)
data/proyectos.js           datos allowlisted de los proyectos (contenido, stack, galería, enlaces)
views/proyecto.js           plantilla SSR de /proyectos/:slug; escapa todos los valores
package.json                scripts dev/build/start y dependencias
styles/
  main.css                  entrada: @import "tailwindcss" + todos los parciales
  build.css                 salida compilada y minificada (se commitea)
  tokens/theme.css          @theme: colores, fuentes y radios + reglas de paleta
  base/                     reset.css, typography.css
  layouts/                  container, header, section, footer
  components/atoms/         button, badge, tag, status-dot, icon, field
  components/molecules/     brand, nav-link, stack-card, project-card, contact-item,
                            spec-list, form-field
  components/organisms/     hero, about, contact, mobile-menu, project-detail
  utilities/                animations.css, helpers.css
AGENTS.md                   este archivo
```

## Reglas de HTML

- Usa etiquetas semánticas: `header`, `nav`, `main`, `section`, `article`, `footer`,
  `figure`, `figcaption`, `dl`, `dt`, `dd`, `address`, `ul`, `li`.
- `div` solo cuando no exista una etiqueta especializada para el bloque.
- Los `id` son **solo** para anclas (`#inicio`, `#stack`…) y destinos de ARIA.
  Nunca para estilar.
- El estilo va por clases; el JS se comunica por hooks `data-*`, no por clases.
- Cada sección se referencia con `aria-labelledby` y su título lleva `id`.
- Iconos: SVG inline con `aria-hidden="true"` y `focusable="false"`. No uses Material Symbols ni CDNs de iconos.

## Reglas de CSS

- **Atomic design por carpetas**: átomo → molécula → organismo. Un componente nuevo entra en la carpeta que le corresponde y se importa desde `styles/main.css`.
- **Tailwind para layout puntual** (flex, grid, gap, spacing, breakpoints) dentro del HTML; **CSS propio para patrones repetidos** (botones, cards, badges, campos) dentro de `@layer components`. Ejemplo: las grillas de stack/proyectos y la fila del header usan utilidades; las tarjetas conservan su CSS.
- Los tokens de marca van en `styles/tokens/theme.css` con `@theme`. No crees `tailwind.config.js`: Tailwind v4 se configura en CSS.
- Paleta anti-“loop AI”, documentada en `tokens/theme.css`:
  - Un solo acento jade (`--color-accent`) para interacción, foco, estado activo y fondo de botón en `:hover`.
  - Los botones parten de negro sólido (`--color-button`); el acento nunca es su color base.
  - Un color señal ámbar (`--color-signal`) solo para metadatos (versiones, avisos).
  - Prohibido: gradientes, sombras, `backdrop-blur`, glassmorphism, glow.
  - Radios permitidos: 2, 4, 6 y 8 px. Nada de píldoras (`999px`).
  - Jerarquía por escala tipográfica y espacio, no por color.
- Después de tocar cualquier CSS: `npm run build` y subir el `?v=N` de `index.html` y `ASSET_VERSION` de `views/proyecto.js`.

## Gotchas

- El host sirve `styles/build.css` e `index.js` con cache largo. Al cambiarlos, sube el `?v=N` de `index.html` y `ASSET_VERSION` de `views/proyecto.js`.
- `.reveal--armed` la agrega `index.js` solo si existe `IntersectionObserver` y el usuario no pidió movimiento reducido. Sin JS el contenido queda visible; mantén ese patrón.
- Hooks `data-*` en uso: `data-nav`, `data-menu-toggle`, `data-mobile-menu`, `data-nav-link`, `data-reveal`, `data-contact-form`, `data-form-status`, `data-form-message`, `data-year`. Cada `init*()` sale temprano si su hook no existe.
- El menú móvil se controla con `aria-expanded`, `aria-controls="mobile-menu"` y la clase `is-open`; el breakpoint es `48rem`.
- Cada proyecto tiene su ruta `/proyectos/:slug`. `data/proyectos.js` es la allowlist: un slug inexistente cae al index. El index enlaza con anclas `.project-card__more` (diseño de botón) y `views/proyecto.js` escapa todos los valores antes de renderizar. `/proyectos` sin slug redirige 301 a `/#proyectos`.
- Las capturas se sirven por `/img` solo si su ruta está declarada en `gallery` de `data/proyectos.js`; cualquier otra cae al fallback. Para agregar imágenes, decláralas primero en la galería del proyecto.
- Campos opcionales de proyecto: `gallery` (`src`, `alt`, `caption`), `highlights` (`title`, `description`), `stackGroups` (`label`, `items`) y `extraLinks` (`label`, `href`, `todo`). `views/proyecto.js` solo los renderiza si existen; `data-todo` se emite únicamente cuando la clave no está vacía.
- `index.html` tiene placeholders marcados con `data-todo` (CV, correo, GitHub, LinkedIn, GPG, demos y repos de proyectos). Santiago los completa personalmente antes de publicar.
- El formulario solo valida y muestra un mensaje local; no envía datos. Para producción hay que conectarlo a Formspree, Netlify Forms o un endpoint propio.
- El sitio se sirve con Express (`npm start`) en un host Node (Render, Railway, VPS). El dominio apunta al host. GitHub Pages ya no cubre `/proyectos/*`; para volver a estático habría que generar esas páginas.
- Seguridad base en `server.js`: `x-powered-by` desactivado, CSP, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, assets con allowlist explícita, `/img` limitado a las galerías y fallback al index. No se sirve el resto del repositorio (`server.js`, `data/`, `views/`).
- Commits en español, siguiendo el estilo de los mensajes existentes.

## Convenciones

- Contenido y textos en español (es-CO); `lang="es"`.
- JavaScript del cliente en `"use strict"`, ES2022+, cero dependencias. Express se usa solo en el servidor.
- No agregues frameworks de UI, bundlers ni CDNs sin pedirlo. Las dependencias actuales son Tailwind (build), Express (servidor) y Google Fonts (Inter + JetBrains Mono).
