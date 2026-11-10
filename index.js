/* ============================================================================
   Santiago Ruiz — Portafolio
   JavaScript vanilla (ES2022+), cero dependencias.
   Cada módulo es una función pequeña llamada desde el bootstrap final.
   Se comunican con el DOM por hooks data-*, nunca por clases de estilo.
   ============================================================================ */

"use strict";

/* ---------------------------------------------------------- 1. NAV SCROLL STATE */
/* Agrega `.is-scrolled` a [data-nav] cuando la página deja de estar arriba. */
function initNavScrollState() {
  const nav = document.querySelector("[data-nav]");
  if (!nav) return;

  const update = () => {
    nav.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
}

/* ---------------------------------------------------------- 2. MOBILE MENU */
/* Abre/cierra el menú móvil y mantiene sincronizados los atributos ARIA. */
function initMobileMenu() {
  const toggle = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-mobile-menu]");
  if (!toggle || !menu) return;

  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    menu.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);

    if (open) {
      const firstLink = menu.querySelector("a");
      if (firstLink) firstLink.focus();
    }
  };

  toggle.addEventListener("click", () => {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      toggle.focus();
    }
  });

  const desktop = window.matchMedia("(min-width: 48rem)");
  desktop.addEventListener("change", (event) => {
    if (event.matches) setOpen(false);
  });
}

/* ---------------------------------------------------------- 3. NAV ACTIVE LINK */
/* Marca con aria-current el enlace de la sección visible. */
function initNavActiveLink() {
  const links = Array.from(document.querySelectorAll("[data-nav-link]"));
  if (!links.length || !("IntersectionObserver" in window)) return;

  const sections = links
    .map((link) => link.getAttribute("href"))
    .filter((href) => href && href.startsWith("#"))
    .map((href) => document.querySelector(href))
    .filter(Boolean);

  if (!sections.length) return;

  const setActive = (id) => {
    links.forEach((link) => {
      if (link.getAttribute("href") === `#${id}`) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible) setActive(visible.target.id);
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ---------------------------------------------------------- 4. REVEAL ON SCROLL */
/* Arma la animación solo si hay IntersectionObserver y no hay movimiento reducido. */
function initReveal() {
  const elements = document.querySelectorAll("[data-reveal]");
  if (!elements.length) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!("IntersectionObserver" in window) || reduceMotion.matches) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  elements.forEach((element) => {
    element.classList.add("reveal--armed");
    observer.observe(element);
  });
}

/* ---------------------------------------------------------- 5. CONTACT FORM */
/* Validación local y mensaje de confirmación. No envía datos a ningún servidor. */
function initContactForm() {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;

  const status = form.querySelector("[data-form-status]");
  const message = form.querySelector("[data-form-message]");

  const showStatus = (text, isError) => {
    if (!status) return;
    status.classList.toggle("form-status--error", Boolean(isError));
    status.classList.add("is-visible");
    if (message) message.textContent = text;
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // TODO: conectar con Formspree, Netlify Forms o un endpoint propio.
    showStatus("Mensaje registrado. Nos pondremos en contacto prontamente.", false);
    form.reset();
  });

  form.addEventListener("input", () => {
    if (status) status.classList.remove("is-visible");
  });
}

/* ---------------------------------------------------------- 6. FOOTER YEAR */
/* Rellena todos los [data-year] con el año actual. */
function initFooterYear() {
  const year = String(new Date().getFullYear());
  document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = year;
  });
}

/* ---------------------------------------------------------- BOOTSTRAP */
document.addEventListener("DOMContentLoaded", () => {
  initNavScrollState();
  initMobileMenu();
  initNavActiveLink();
  initReveal();
  initContactForm();
  initFooterYear();
});
