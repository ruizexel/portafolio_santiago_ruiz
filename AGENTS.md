# AGENTS.md

Portfolio personal estático (HTML + CSS + JS vanilla, sin frameworks, sin build).
No hay `package.json`, ni tests, ni linter: no inventes comandos npm/pnpm.

## Estado actual / gotchas verificados

- **El JS no carga.** `index.html:605` apunta a `script.js`, pero el archivo es `scripts.js`. Mientras no se corrija, nada de JS se ejecuta (toggle de tema, menú móvil, copiar email, año del footer).
- **`scripts.js:127` rompe el script.** Usa `list.addEventListener(...)` con `list` indefinida, a nivel top-level. Si se corrige el `src`, esto lanza `ReferenceError` y detiene la ejecución del resto del archivo.
- **Bootstrap incompleto.** `initCopyEmail()` y `initFooterYear()` están definidas pero nunca se llaman en el listener de `DOMContentLoaded` (`scripts.js:133`).
- **Falta el módulo de reveal.** El CSS oculta `.reveal { opacity: 0 }` y espera `.reveal.is-visible` (`styles/styless.css:1230`), pero no existe ningún `IntersectionObserver` en el JS que añada la clase. Sin JS, gran parte del contenido queda invisible.
- **IDs duplicados.** Las secciones `#sobre-mi`, `#stack`, `#proyectos`, `#experiencia` y `#contacto` existen dos veces en `index.html`: una versión placeholder simple (~líneas 198-280) y la versión con marcado real (~líneas 285-581). El sitio renderiza ambas.
- **Restos de plantilla.** Contenido mezcla identidad: el email de contacto es `mariana.luna@ejemplo.com`, los socials apuntan a `github.com/marianaluna`, el `lang="en"` con texto en español, y la clave de `localStorage` es `"ml-theme"`. El footer ya apunta a `github.com/ruizexel`.
- **Imágenes.** `img/` está vacío; los proyectos usan URLs de Unsplash. El retrato está comentado en `index.html:326-333`.
- **CSS con bloques duplicados.** La sección "4. LAYOUT", `.nav__inner` y `.nav__logo*` se repiten textualmente (`styles/styless.css:267` y siguientes). Es un solo archivo largo; edita la última ocurrencia válida con cuidado.
- El archivo se llama `styless.css` (doble s). No lo renombres sin actualizar `index.html:50`, `index.html:605` y la referencia en este archivo.

## Cómo previsualizar

Abre `index.html` en el navegador, o sirve el directorio:

```
python3 -m http.server 8000
```

No hay paso de compilación ni transpilación. Los cambios en HTML/CSS/JS se ven con recargar.

## Estructura

- `index.html` — página única; nav, hero y secciones ancladas (`#sobre-mi`, `#stack`, `#proyectos`, `#experiencia`, `#contacto`) + footer.
- `styles/styless.css` — todo el CSS, organizado por secciones numeradas en comentarios (tokens → reset → componentes → responsive). Tema oscuro por defecto vía `data-theme="dark"`; tema claro con `[data-theme="light"]`.
- `scripts.js` — módulos de una función (`initThemeToggle`, `initNavScrollState`, `initMobileMenu`, `initCopyEmail`, `initFooterYear`). El JS depende de hooks `data-*` (`data-theme-toggle`, `data-nav`, `data-menu-toggle`, `data-mobile-menu`, `data-copy-email`, `data-toast`, `data-year`, `data-reveal`); si agregas comportamiento, reutiliza ese patrón en lugar de clases acopladas.

## Convenciones

- Contenido, comentarios y texto de UI en español (es-CO); `lang` del documento está mal en `"en"`.
- Sin comentarios explicativos nuevos en el código salvo que se pida.
- JS en `"use strict"`, ES2022+, cero dependencias.
