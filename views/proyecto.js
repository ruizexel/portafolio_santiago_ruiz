/* ============================================================================
   Vista de detalle de proyecto.
   Renderiza una página completa a partir de los datos allowlisted de
   data/proyectos.js. Todo valor se escapa antes de entrar al HTML.
   ============================================================================ */

"use strict";

const ASSET_VERSION = "4";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/* Solo permite enlaces http(s) o el placeholder "#"; evita javascript: y data:. */
function safeUrl(value) {
  const url = String(value);
  if (url === "#" || /^https?:\/\//i.test(url)) return escapeHtml(url);
  return "#";
}

/* Solo permite imágenes locales dentro de /img con extensión conocida. */
function safeImageSrc(value) {
  const src = String(value);
  if (!src.startsWith("/img/") || src.includes("..")) return "";
  if (!/\.(png|jpe?g|webp|avif)$/i.test(src)) return "";
  return escapeHtml(src);
}

/* data-todo solo se renderiza cuando hay una clave pendiente. */
function todoAttribute(key) {
  const value = String(key ?? "");
  return value ? ` data-todo="${escapeHtml(value)}"` : "";
}

function renderTags(tags) {
  return tags
    .map((tag, index) => `<li class="tag${index === 0 ? " tag--accent" : ""}">${escapeHtml(tag)}</li>`)
    .join("");
}

function renderGallery(gallery) {
  if (!Array.isArray(gallery) || !gallery.length) return "";

  const items = gallery
    .map((imagen) => {
      const src = safeImageSrc(imagen.src);
      if (!src) return "";
      const alt = escapeHtml(imagen.alt ?? "");
      const caption = imagen.caption
        ? `<figcaption>${escapeHtml(imagen.caption)}</figcaption>`
        : "";
      return `<figure class="project-detail__shot">
        <img src="${src}" alt="${alt}" loading="lazy" decoding="async">
        ${caption}
      </figure>`;
    })
    .join("");

  if (!items) return "";

  return `<section class="project-detail__gallery" aria-labelledby="capturas-title">
    <h2 id="capturas-title">Capturas</h2>
    <div class="project-detail__gallery-grid">${items}</div>
  </section>`;
}

function renderHighlights(highlights) {
  if (!Array.isArray(highlights) || !highlights.length) return "";

  const items = highlights
    .map(
      (item) => `<li class="project-detail__highlight">
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.description)}</p>
      </li>`
    )
    .join("");

  return `<section class="project-detail__section" aria-labelledby="aspectos-title">
    <h2 id="aspectos-title">Aspectos clave</h2>
    <ul class="project-detail__highlights" role="list">${items}</ul>
  </section>`;
}

function renderStackGroups(stackGroups) {
  if (!Array.isArray(stackGroups) || !stackGroups.length) return "";

  return stackGroups
    .map(
      (group) => `<div>
        <dt>${escapeHtml(group.label)}</dt>
        <dd>${group.items.map((item) => escapeHtml(item)).join(" · ")}</dd>
      </div>`
    )
    .join("");
}

function renderExtraLinks(extraLinks) {
  if (!Array.isArray(extraLinks) || !extraLinks.length) return "";

  return extraLinks
    .map((link) => {
      const href = safeUrl(link.href);
      return `<li><a class="project-detail__aside-link" href="${href}"${todoAttribute(link.todo)}>${escapeHtml(link.label)}</a></li>`;
    })
    .join("");
}

function renderProyecto(proyecto, proyectos) {
  const index = proyectos.findIndex((item) => item.slug === proyecto.slug);
  const previous = proyectos[(index - 1 + proyectos.length) % proyectos.length];
  const next = proyectos[(index + 1) % proyectos.length];

  const title = escapeHtml(proyecto.title);
  const version = escapeHtml(proyecto.version);
  const period = escapeHtml(proyecto.period);
  const status = escapeHtml(proyecto.status);
  const summary = escapeHtml(proyecto.summary);
  const context = escapeHtml(proyecto.context);
  const role = escapeHtml(proyecto.role);
  const challenge = escapeHtml(proyecto.challenge);
  const solution = escapeHtml(proyecto.solution);
  const result = escapeHtml(proyecto.result);
  const stack = escapeHtml(proyecto.stack.join(", "));
  const demo = safeUrl(proyecto.demo);
  const repo = safeUrl(proyecto.repo);
  const tags = renderTags(proyecto.tags);
  const gallery = renderGallery(proyecto.gallery);
  const highlights = renderHighlights(proyecto.highlights);
  const stackGroups = renderStackGroups(proyecto.stackGroups);
  const extraLinks = renderExtraLinks(proyecto.extraLinks);
  const stackBlock =
    stackGroups ||
    `<div>
      <dt>Stack</dt>
      <dd>${stack}</dd>
    </div>`;

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title} | Santiago Ruiz</title>
  <meta name="description" content="${summary}">
  <meta name="theme-color" content="#0d0f10">
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='4' fill='%230d0f10'/%3E%3Cpath d='M9 11h14M9 16h14M9 21h9' stroke='%234ac7a0' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="/styles/build.css?v=${ASSET_VERSION}">
</head>
<body>
  <a class="skip-link" href="#contenido">Saltar al contenido</a>

  <header class="site-header" data-nav>
    <div class="container site-header__inner flex items-center gap-4 min-h-16">
      <a class="brand" href="/#inicio">
        Santiago Ruiz
        <span class="badge">Fullstack · Backend</span>
      </a>

      <nav class="site-nav hidden md:block mx-auto" aria-label="Navegación principal">
        <ul class="flex items-center gap-4 lg:gap-8" role="list">
          <li><a class="nav-link" href="/#inicio">Inicio</a></li>
          <li><a class="nav-link" href="/#sobre-mi">Sobre mí</a></li>
          <li><a class="nav-link" href="/#stack">Stack</a></li>
          <li><a class="nav-link" href="/#proyectos">Proyectos</a></li>
          <li><a class="nav-link" href="/#contacto">Contacto</a></li>
        </ul>
      </nav>

      <div class="site-header__actions flex items-center gap-2 ms-auto md:ms-0">
        <a class="btn btn--outline site-header__cv hidden md:inline-flex" href="https://docs.google.com/document/d/13W79GPKaEl94FsCbUBVxR3oUgOZBWl1GejITNmlsciw/edit?usp=sharing" data-todo="cv">
          Ver CV
          <svg class="icon icon--sm" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M7 17 17 7"/><path d="M7 7h10v10"/>
          </svg>
        </a>

        <button class="nav-toggle" type="button" data-menu-toggle aria-expanded="false" aria-controls="mobile-menu" aria-label="Abrir menú">
          <svg class="icon nav-toggle__open" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
          <svg class="icon nav-toggle__close" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>

    <nav class="mobile-menu" id="mobile-menu" data-mobile-menu aria-label="Navegación móvil">
      <ul role="list">
        <li><a href="/#inicio">Inicio</a></li>
        <li><a href="/#sobre-mi">Sobre mí</a></li>
        <li><a href="/#stack">Stack</a></li>
        <li><a href="/#proyectos">Proyectos</a></li>
        <li><a href="/#contacto">Contacto</a></li>
        <li>
          <a class="btn btn--outline btn--block" href="https://docs.google.com/document/d/13W79GPKaEl94FsCbUBVxR3oUgOZBWl1GejITNmlsciw/edit?usp=sharing" data-todo="cv">Ver CV</a>
        </li>
      </ul>
    </nav>
  </header>

  <main id="contenido" class="pt-16" tabindex="-1">
    <article class="project-detail" aria-labelledby="proyecto-title">
      <div class="container">
        <nav class="breadcrumb" aria-label="Ruta de navegación">
          <a href="/">Inicio</a>
          <span aria-hidden="true">/</span>
          <a href="/#proyectos">Proyectos</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">${title}</span>
        </nav>

        <header class="project-detail__hero">
          <p class="project-detail__eyebrow">
            <span class="badge badge--signal">${version}</span>
            <span>${period}</span>
          </p>

          <h1 class="project-detail__title" id="proyecto-title">${title}</h1>
          <p class="project-detail__summary">${summary}</p>

          <ul class="tag-list" role="list">
            ${tags}
          </ul>

          <div class="project-detail__actions">
            <a class="btn btn--primary" href="${demo}"${todoAttribute(proyecto.demoKey)}>
              Ver demo
              <svg class="icon icon--sm" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </a>
            <a class="btn btn--outline" href="${repo}"${todoAttribute(proyecto.repoKey)}>
              Ver repositorio
              <svg class="icon icon--sm" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
              </svg>
            </a>
            <a class="btn btn--outline" href="/#proyectos">
              Volver a proyectos
              <svg class="icon icon--sm" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
              </svg>
            </a>
          </div>
        </header>

        ${gallery}

        <div class="project-detail__layout">
          <div class="project-detail__content">
            <section class="project-detail__section" aria-labelledby="contexto-title">
              <h2 id="contexto-title">Contexto</h2>
              <p>${context}</p>
            </section>

            <section class="project-detail__section" aria-labelledby="rol-title">
              <h2 id="rol-title">Rol</h2>
              <p>${role}</p>
            </section>

            <section class="project-detail__section" aria-labelledby="reto-title">
              <h2 id="reto-title">Reto</h2>
              <p>${challenge}</p>
            </section>

            <section class="project-detail__section" aria-labelledby="solucion-title">
              <h2 id="solucion-title">Solución</h2>
              <p>${solution}</p>
            </section>

            <section class="project-detail__section" aria-labelledby="resultado-title">
              <h2 id="resultado-title">Resultado</h2>
              <p>${result}</p>
            </section>

            ${highlights}
          </div>

          <aside class="project-detail__aside" aria-labelledby="ficha-title">
            <h2 id="ficha-title">Ficha del proyecto</h2>
            <dl class="project-detail__meta">
              <div>
                <dt>Rol</dt>
                <dd>${role}</dd>
              </div>
              <div>
                <dt>Periodo</dt>
                <dd>${period}</dd>
              </div>
              <div>
                <dt>Estado</dt>
                <dd>${status}</dd>
              </div>
              ${stackBlock}
            </dl>

            ${extraLinks ? `<div class="project-detail__aside-links">
              <h3>Enlaces</h3>
              <ul role="list">${extraLinks}</ul>
            </div>` : ""}
          </aside>
        </div>

        <nav class="project-detail__pager" aria-label="Otros proyectos">
          <a href="/${escapeHtml(previous.slug)}">
            <span>Proyecto anterior</span>
            <strong>${escapeHtml(previous.title)}</strong>
          </a>
          <a href="/${escapeHtml(next.slug)}">
            <span>Siguiente proyecto</span>
            <strong>${escapeHtml(next.title)}</strong>
          </a>
        </nav>
      </div>
    </article>
  </main>

  <footer class="site-footer">
    <div class="container site-footer__inner flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
      <div>
        <p class="site-footer__status">
          <span class="status-dot" aria-hidden="true"></span>
          Disponible para pasantías / proyectos
        </p>
        <p class="site-footer__copy">&copy; <span data-year>2026</span> Santiago Ruiz. Desarrollo fullstack con enfoque backend.</p>
      </div>

      <nav aria-label="Enlaces sociales">
        <ul class="site-footer__links flex flex-wrap gap-5" role="list">
          <li><a href="#" data-todo="github">GitHub</a></li>
          <li><a href="#" data-todo="linkedin">LinkedIn</a></li>
          <li><a href="#" data-todo="email">Email</a></li>
          <li><a href="#" data-todo="gpg">GPG</a></li>
        </ul>
      </nav>
    </div>
  </footer>

  <script src="/index.js?v=${ASSET_VERSION}" defer></script>
</body>
</html>`;
}

module.exports = { renderProyecto };
