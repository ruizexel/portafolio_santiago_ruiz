/* ============================================================================
   Santiago Ruiz — Portfolio script
   Vanilla JavaScript (ES2022+), cero dependencias.
   Cada módulo es una función chica llamada desde el bootstrap al final.
   ============================================================================ */

"use strict";

/* ---------------------------------------------------------- 1. NAV SCROLL STATE */
/* Agrega `.is-scrolled` al `.nav` después de que el usuario scrolleó más de 12px. */
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

  window.matchMedia("(min-width: 961px)").addEventListener("change", (event) => {
    if (event.matches) setOpen(false);
  });
}

/* ---------------------------------------------------------- 3. REVEAL ON SCROLL */
/* Añade `.is-visible` a los elementos `[data-reveal]` cuando entran al viewport. */
function initReveal() {
  const elements = document.querySelectorAll("[data-reveal]");
  if (!elements.length) return;

  if (!("IntersectionObserver" in window)) {
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
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  elements.forEach((element) => observer.observe(element));
}

/* ---------------------------------------------------------- 4. COPY EMAIL */
/* Copia el email del botón `[data-copy-email]` y muestra el toast `[data-toast]`. */
function initCopyEmail() {
  const button = document.querySelector("[data-copy-email]");
  const toast = document.querySelector("[data-toast]");
  if (!button) return;

  let timeoutId;

  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 2200);
  };

  button.addEventListener("click", async () => {
    const email = button.getAttribute("data-copy-email");
    if (!email) return;

    try {
      await navigator.clipboard.writeText(email);
      showToast("Email copiado al portapapeles");
    } catch {
      showToast(`Escríbeme a ${email}`);
    }
  });
}

/* ---------------------------------------------------------- 5. FOOTER YEAR */
/* Rellena todos los `[data-year]` con el año actual. */
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
  initReveal();
  initCopyEmail();
  initFooterYear();
});
