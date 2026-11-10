/* ============================================================================
   Datos de los proyectos.
   - Alimenta las tarjetas del index, el pager y las páginas dinámicas.
   - Los slugs forman una allowlist: una ruta solo existe si está en este arreglo.
   - Un proyecto con `html` sirve su propia página desde routes/proyectos.js.
   ============================================================================ */

"use strict";

const proyectos = [
  {
    slug: "planificador-eventos",
    title: "Planificador de Eventos",
    html: "planificadorEventos.html",
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
