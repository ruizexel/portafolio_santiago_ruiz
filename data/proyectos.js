/* ============================================================================
   Datos de los proyectos.
   Fuente única de verdad para el index y para las páginas /proyectos/:slug.
   Los slugs forman una allowlist: una ruta solo existe si está en este arreglo.
   ============================================================================ */

"use strict";

const proyectos = [
  {
    slug: "planificador-eventos",
    title: "Planificador de Eventos",
    version: "MVP · Sprint 1",
    period: "2026",
    status: "MVP desplegado en Vercel + Render",
    summary:
      "MVP fullstack para organizadores independientes: crear eventos, desglosar el plan logístico en subtareas y controlar cuántas horas caben en cada día. Frontend React/Vite, API Spring Boot y PostgreSQL en Supabase.",
    context:
      "Organizar un evento implica coordinar muchas subtareas y evitar que la agenda diaria se desborde. El proyecto centraliza eventos, subtareas y capacidad diaria en una sola aplicación, con una API que aplica las reglas de negocio y un cliente que solo refleja datos persistidos.",
    role: "Fullstack: interfaz React, API REST en Spring Boot, modelo de datos en PostgreSQL (Supabase), autenticación JWT y despliegue en Vercel + Render.",
    challenge:
      "Mantener consistente el cupo diario cuando se crean, editan o reprograman subtareas, sin que frontend y backend calculen reglas distintas.",
    solution:
      "API stateless con JWT y aislamiento por propietario; validación del límite diario de 1–16 h; respuesta 409 con el excedente cuando una operación no cabe; reducción de horas siempre permitida; Swagger para documentar el contrato y frontend que solo actualiza la vista tras una respuesta persistida.",
    result:
      "MVP desplegado de punta a punta: frontend en Vercel, API en Render y PostgreSQL en Supabase. Health check, Swagger y datos reales verificados; los flujos de creación, detalle, panel del día y progreso quedan operativos.",
    tags: ["React", "Spring Boot", "PostgreSQL", "JWT", "Docker"],
    stack: [
      "React 19",
      "Vite 8",
      "React Router 7",
      "Tailwind CSS 4",
      "Java 21",
      "Spring Boot 4.1.1",
      "Spring Data JPA",
      "PostgreSQL",
      "Supabase",
      "Docker",
      "Vercel",
      "Render",
    ],
    stackGroups: [
      {
        label: "Frontend",
        items: ["React 19", "Vite 8", "React Router 7", "Tailwind CSS 4", "oxlint", "Prettier"],
      },
      {
        label: "Backend",
        items: [
          "Java 21",
          "Spring Boot 4.1.1",
          "Spring Data JPA / Hibernate",
          "Bean Validation",
          "JWT",
          "springdoc-openapi",
        ],
      },
      {
        label: "Datos e infraestructura",
        items: ["PostgreSQL (Supabase)", "Docker", "Render", "Vercel"],
      },
    ],
    highlights: [
      {
        title: "Límite diario de 1–16 h",
        description:
          "Solo las subtareas pendientes y pospuestas consumen cupo; las ejecutadas no. La regla se valida al crear, editar y reprogramar.",
      },
      {
        title: "Conflicto 409 con excedente",
        description:
          "Si una operación supera el cupo, la API no guarda nada y devuelve cuántas horas hay que liberar.",
      },
      {
        title: "Aislamiento por propietario",
        description:
          "El token define al dueño de los datos; los recursos ajenos responden 404 y los repositorios no exponen findAll ni findById.",
      },
      {
        title: "Despliegue verificable",
        description:
          "Frontend en Vercel, API en Render y PostgreSQL en Supabase, con /api/health y Swagger para validar la cadena completa.",
      },
    ],
    gallery: [
      {
        src: "/img/planificador_eventos/hoy.png",
        alt: "Panel del día con las gestiones pendientes y vencidas.",
        caption: "Panel del día",
      },
      {
        src: "/img/planificador_eventos/progreso.png",
        alt: "Vista de progreso por evento con el avance de las subtareas.",
        caption: "Progreso por evento",
      },
      {
        src: "/img/planificador_eventos/crearEvento.png",
        alt: "Formulario de creación de evento con horas estimadas.",
        caption: "Creación de evento",
      },
      {
        src: "/img/planificador_eventos/configuracion.png",
        alt: "Configuración del límite diario de horas del organizador.",
        caption: "Límite diario",
      },
      {
        src: "/img/planificador_eventos/login.png",
        alt: "Pantalla de acceso de organizadores con autenticación JWT.",
        caption: "Acceso con JWT",
      },
    ],
    demo: "https://planificador-eventos-frontend-ten.vercel.app",
    demoKey: "",
    repo: "#",
    repoKey: "repo-planificador-frontend",
    extraLinks: [
      {
        label: "API en Render",
        href: "https://planificador-eventos-backend-1.onrender.com",
      },
      {
        label: "Swagger UI",
        href: "https://planificador-eventos-backend-1.onrender.com/swagger-ui.html",
      },
      {
        label: "Repo backend",
        href: "#",
        todo: "repo-planificador-backend",
      },
    ],
  },
  {
    slug: "victus-caf",
    title: "Victus CAF",
    version: "v1.2.0",
    period: "2025",
    status: "Proyecto académico en evolución",
    summary:
      "Plataforma con arquitectura desacoplada: backend robusto en Spring Boot, autenticación delegada con Firebase Authentication, persistencia gestionada en Supabase PostgreSQL e interfaz reactiva en React con TypeScript.",
    context:
      "Victus CAF nace como una plataforma para centralizar la operación de un centro de acondicionamiento físico: usuarios, autenticación y datos de entrenamiento en un solo flujo. El objetivo era separar con claridad la lógica de negocio de la interfaz y evitar que el cliente conociera detalles de persistencia.",
    role: "Fullstack: API, autenticación e integración del cliente.",
    challenge:
      "Unificar autenticación, persistencia y UI sin acoplar las capas ni duplicar reglas de negocio entre el cliente y el servidor.",
    solution:
      "API REST en Spring Boot con validaciones y códigos de estado coherentes; Firebase Authentication para delegar identidad; Supabase PostgreSQL como persistencia gestionada; cliente React con TypeScript y contratos tipados.",
    result:
      "Base desacoplada con contratos claros entre cliente y servidor, autenticación delegada y espacio para escalar módulos sin reescribir la API.",
    tags: ["Spring Boot", "Supabase PostgreSQL", "React", "TypeScript", "Firebase Auth"],
    stack: [
      "Java",
      "Spring Boot",
      "Spring Web",
      "Supabase PostgreSQL",
      "Firebase Authentication",
      "React",
      "TypeScript",
      "Vite",
    ],
    demo: "#",
    demoKey: "demo-victus",
    repo: "#",
    repoKey: "repo-victus",
  },
  {
    slug: "notificaciones-eventos",
    title: "Microservicio de Notificaciones y Eventos",
    version: "v0.9.4",
    period: "2025",
    status: "Prototipo funcional",
    summary:
      "Módulo reactivo desacoplado para despacho asíncrono de alertas transaccionales. Empleo de RabbitMQ para amortiguar picos de carga con reintentos exponenciales, caching de plantillas en Redis y persistencia de auditoría de payloads en AWS S3.",
    context:
      "Las alertas transaccionales de un sistema crecen en ráfagas y no siempre toleran acoplarse al request principal. El microservicio se diseñó para recibir eventos, encolarlos y despacharlos sin bloquear la operación que los origina.",
    role: "Backend: diseño del flujo asíncrono y de la persistencia de auditoría.",
    challenge:
      "Absorber picos de eventos sin perder mensajes, evitar reintentos infinitos y conservar evidencia de cada payload procesado.",
    solution:
      "Cola RabbitMQ con reintentos exponenciales y dead-letter queue; caché de plantillas en Redis; auditoría de payloads en AWS S3; configuración externalizada con Spring Cloud.",
    result:
      "Despacho tolerante a fallos, con trazabilidad completa de cada evento y desacoplamiento del servicio que genera las alertas.",
    tags: ["Java", "RabbitMQ", "Redis", "AWS S3", "Spring Cloud"],
    stack: ["Java", "Spring Boot", "Spring Cloud", "RabbitMQ", "Redis", "AWS S3", "Docker"],
    demo: "#",
    demoKey: "demo-notificaciones",
    repo: "#",
    repoKey: "repo-notificaciones",
  },
  {
    slug: "reservas-academicas",
    title: "Sistema de Reservas y Disponibilidad Académica",
    version: "v2.0.1",
    period: "2025",
    status: "Proyecto académico",
    summary:
      "Motor de reserva de aulas y laboratorios universitarios. Algoritmo de validación temporal para evitar solapamientos de bloques horarios y consultas nativas SQL indexadas que redujeron el tiempo de respuesta un 60% bajo carga concurrente simulada en Postman.",
    context:
      "La reserva de aulas y laboratorios universitarios exige reglas claras sobre bloques horarios, disponibilidad y solapamientos. El sistema concentra esas reglas en el backend para que cualquier cliente obtenga la misma respuesta.",
    role: "Backend: modelo de datos, validación temporal y optimización de consultas.",
    challenge:
      "Evitar solapamientos de bloques horarios bajo solicitudes concurrentes y mantener consultas rápidas sobre un calendario compartido.",
    solution:
      "Validación transaccional de rangos horarios, restricciones a nivel de base de datos, índices SQL nativos y pruebas de carga reproducibles en Postman.",
    result:
      "Reducción del 60% en el tiempo de respuesta bajo carga concurrente simulada y una única fuente de verdad para la disponibilidad.",
    tags: ["Spring Boot", "MySQL", "REST API", "Postman", "Hibernate"],
    stack: ["Java", "Spring Boot", "MySQL", "Hibernate / JPA", "REST API", "Postman"],
    demo: "#",
    demoKey: "demo-reservas",
    repo: "#",
    repoKey: "repo-reservas",
  },
  {
    slug: "inventario-trazabilidad",
    title: "Inventario y Trazabilidad",
    version: "v1.0.3",
    period: "2026",
    status: "Prototipo funcional",
    summary:
      "Plataforma fullstack para control de inventario con movimientos auditables. API en NestJS sobre PostgreSQL, caché de consultas en Redis y panel de operación en Next.js con TypeScript; despliegue reproducible con Docker.",
    context:
      "El inventario de un negocio pequeño necesita movimientos auditables y consultas rápidas. La plataforma separa la API de inventario del panel de operación y registra cada cambio como un evento trazable.",
    role: "Fullstack con énfasis backend: API, caché y panel de operación.",
    challenge:
      "Mantener el stock consistente entre movimientos concurrentes y consultas de solo lectura, sin bloquear el panel de operación.",
    solution:
      "API NestJS con transacciones atómicas y bloqueo optimista; PostgreSQL como fuente de verdad; Redis para consultas frecuentes con invalidación por evento; panel Next.js con TypeScript; despliegue con Docker.",
    result:
      "Historial auditable de movimientos y consultas de inventario por debajo de 120 ms en pruebas locales.",
    tags: ["NestJS", "PostgreSQL", "Redis", "Next.js", "TypeScript"],
    stack: ["NestJS", "Node.js", "PostgreSQL", "Redis", "Next.js", "TypeScript", "Docker"],
    demo: "#",
    demoKey: "demo-inventario",
    repo: "#",
    repoKey: "repo-inventario",
  },
  {
    slug: "reportes-analitica",
    title: "Motor de Reportes y Analítica",
    version: "v1.4.2",
    period: "2026",
    status: "Prototipo funcional",
    summary:
      "Servicio de agregación de ventas y generación de reportes programados. Cálculo en Spring Boot sobre PostgreSQL, exportaciones asíncronas a AWS S3 y panel de consulta en React con TypeScript.",
    context:
      "Los reportes de ventas no deben competir con las transacciones del día a día. El motor calcula agregados en segundo plano, guarda exportaciones y entrega al panel solo la información necesaria.",
    role: "Fullstack con énfasis backend: agregación, exportación y panel de consulta.",
    challenge:
      "Consolidar grandes volúmenes de ventas sin bloquear la operación transaccional y permitir filtros por rango de fechas.",
    solution:
      "Consultas agregadas indexadas en PostgreSQL; jobs programados en Spring Boot; exportaciones asíncronas a AWS S3; panel React con TypeScript para consulta y descarga.",
    result:
      "Reportes reproducibles, panel con filtros por rango de fechas y separación entre cálculo, almacenamiento y presentación.",
    tags: ["Spring Boot", "PostgreSQL", "AWS S3", "React", "TypeScript"],
    stack: ["Java", "Spring Boot", "PostgreSQL", "AWS S3", "React", "TypeScript", "Docker"],
    demo: "#",
    demoKey: "demo-reportes",
    repo: "#",
    repoKey: "repo-reportes",
  },
];

const bySlug = new Map(proyectos.map((proyecto) => [proyecto.slug, proyecto]));

/**
 * Devuelve el proyecto solo si el slug está en la allowlist.
 * No se usa el slug para construir rutas de archivos ni consultas.
 */
function getProyecto(slug) {
  if (typeof slug !== "string") return null;
  return bySlug.get(slug) ?? null;
}

module.exports = { proyectos, getProyecto };
