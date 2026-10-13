/* ============================================================================
   Santiago Ruiz — Portfolio script
   Vanilla JavaScript (ES2022+), cero dependencias.
   Cada módulo es una función chica llamada desde bootstrap() al final.
   ============================================================================ */

"use strict";

/* ---------------------------------------------------------- 1. THEME TOGGLE */
/* Persiste la preferencia del usuario en localStorage bajo "sr-theme".
   Default: usa valor guardado; si no hay, respeta el sistema operativo; fallback oscuro. */
function initThemeToggle() {
  const STORAGE_KEY = "sr-theme";
  const root = document.documentElement;
  const toggle = document.querySelector("[data-theme-toggle]");
  if (!toggle) return;

  const prefersLight = window.matchMedia("(prefers-color-scheme: light)");

  const getInitialTheme = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") return saved;
    return prefersLight.matches ? "light" : "dark";
  };

  const applyTheme = (theme) => {
    root.setAttribute("data-theme", theme);
    toggle.setAttribute(
      "aria-label",
      theme === "dark" ? "Cambiar a tema claro" : "Cambiar a tema oscuro"
    );
    // Mantener la barra del navegador mobile en sintonía
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#0b0c0e" : "#fafaf7");
  };

  applyTheme(getInitialTheme());

  toggle.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
  });

  // Seguir cambios del OS sólo si el usuario no eligió explícitamente
  prefersLight.addEventListener("change", (e) => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      applyTheme(e.matches ? "light" : "dark");
    }
  });
}

/* ---------------------------------------------------------- BOOTSTRAP */
document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
});

/* ---------------------------------------------------------- 2. NAV SCROLL STATE */
/* Agrega `.is-scrolled` al `.nav` después de que el usuario scrolleó más de 12px. */
function initNavScrollState() {
  const nav = document.querySelector("[data-nav]");
  if (!nav) return;

  const THRESHOLD = 12;
  let ticking = false;

  const update = () => {
    nav.classList.toggle("is-scrolled", window.scrollY > THRESHOLD);
    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true }
  );

  update();
}

/* ---------------------------------------------------------- 3. MOBILE MENU */
/* Toggle del hamburger. Cierra al click en un link, Escape, o viewport grande.
   Usa la clase body.menu-open para bloquear scroll. */
function initMobileMenu() {
  const toggle = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-mobile-menu]");
  if (!toggle || !menu) return;

  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    menu.hidden = !open;
    document.body.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-label", open ? "Cerrar menu" : "Abrir menu");
  };

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    setOpen(!isOpen);
  });

  // Cerrar al tocar un link del menú
  menu.addEventListener("click", (e) => {
    const target = e.target.closest("a");
    if (target) setOpen(false);
  });

  // Cerrar con Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      toggle.focus();
    }
  });

  // Si el viewport crece por encima del breakpoint, resetear
  const mq = window.matchMedia("(min-width: 961px)");
  mq.addEventListener("change", (e) => {
    if (e.matches) setOpen(false);
  });
}

/* ---------------------------------------------------------- 4. REVEAL ON SCROLL */
/* Agrega `.is-visible` a cada [data-reveal] cuando entra al viewport.
   Si el navegador no soporta IntersectionObserver, muestra todo de inmediato. */
function initReveal() {
  const items = document.querySelectorAll("[data-reveal]");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  items.forEach((el) => observer.observe(el));
}

/* ---------------------------------------------------------- BOOTSTRAP */
document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initNavScrollState();
  initMobileMenu();
  initReveal();
  initCopyEmail();
  initFooterYear();
});


/* ---------------------------------------------------------- 7. COPY EMAIL */
/* Copia al portapapeles con async/await + fallback con document.execCommand.
   Feedback visual: toast temporal + label del botón. */
function initCopyEmail() {
  const btn = document.querySelector("[data-copy-email]");
  const toast = document.querySelector("[data-toast]");
  if (!btn) return;

  const label = btn.querySelector("[data-copy-label]");
  const originalText = label ? label.textContent : "Copiar email";
  let resetTimer = null;

  const showToast = (msg) => {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("is-visible");
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(
      () => toast.classList.remove("is-visible"),
      2200
    );
  };

  const fallbackCopy = (text) => {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      return true;
    } catch {
      return false;
    } finally {
      document.body.removeChild(ta);
    }
  };

  btn.addEventListener("click", async () => {
    const email = btn.getAttribute("data-copy-email") || "";
    let ok = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(email);
        ok = true;
      } else {
        ok = fallbackCopy(email);
      }
    } catch {
      ok = fallbackCopy(email);
    }

    if (ok) {
      showToast(`Copiado: ${email}`);
      if (label) label.textContent = "Copiado";
      window.clearTimeout(resetTimer);
      resetTimer = window.setTimeout(() => {
        if (label) label.textContent = originalText;
      }, 2000);
    } else {
      showToast("No se pudo copiar. Copialo manualmente :)");
    }
  });
}


/* ---------------------------------------------------------- 8. FOOTER YEAR */
/* Actualiza el año del footer al año actual. */
function initFooterYear() {
  const el = document.querySelector("[data-year]");
  if (el) el.textContent = String(new Date().getFullYear());
}
