export type Project = {
  slug: string
  name: string
  kind: string
  year: string
  headline: string
  body: string
  stack: string[]
  metrics?: { label: string; value: string }[]
  highlights: string[]
  links: { label: string; href: string }[]
  playground?: boolean
  status: 'activo' | 'terminado' | 'en-progreso'
  accent: 'signal' | 'wire' | 'ember'
}

export const projects: Project[] = [
  {
    slug: 'veloce-ts',
    name: 'Veloce-TS',
    kind: 'Framework open source',
    year: '2025 — hoy',
    headline: 'Un framework web de TypeScript con decoradores, DI y OpenAPI, publicado en npm.',
    body: 'Escribí el framework que quería usar: controladores declarativos con decoradores, inyección de dependencias, validación con Zod y un esquema OpenAPI 3.1 que se genera solo a partir de los tipos. Corre sobre Bun, Node, Deno y Workers.',
    stack: ['TypeScript', 'Bun', 'Hono', 'Zod', 'OpenAPI 3.1'],
    metrics: [
      { label: 'versión en npm', value: '3.5.1' },
      { label: 'runtimes', value: '4' },
      { label: 'licencia', value: 'MIT' },
    ],
    highlights: [
      'Decoradores de controlador, ruta, guard y middleware con tipos completos.',
      'Contenedor de inyección de dependencias por constructor.',
      'Documentación OpenAPI derivada de los esquemas Zod, no escrita a mano.',
      'Gateways de WebSocket con el mismo modelo de decoradores que el HTTP.',
    ],
    links: [
      { label: 'npm', href: 'https://www.npmjs.com/package/veloce-ts' },
      { label: 'GitHub', href: 'https://github.com/ExcessHawk/Veloce-TS' },
      { label: 'Documentación', href: 'https://docs.veloce-ts.com' },
    ],
    status: 'activo',
    accent: 'signal',
  },
  {
    slug: 'marketplace',
    name: 'Marketplace multivendedor',
    kind: 'Aplicación full-stack',
    year: '2026',
    headline:
      'Un marketplace completo: catálogo, carrito, checkout, pagos al vendedor, disputas y chat en vivo.',
    body: 'Varias tiendas venden en un mismo sitio. Un pedido se parte en subpedidos, uno por vendedor, y cada uno sigue su propio camino: se envía, se recibe, se opina y se le paga al vendedor. El dinero no se mueve hasta que el comprador confirma que recibió. Vive en tres repos: la API, la interfaz y los esquemas de Zod que ambas comparten, para que un cambio de contrato rompa la compilación y no la producción.',
    stack: ['React', 'TypeScript', 'Veloce-TS', 'PostgreSQL', 'Drizzle', 'WebSocket'],
    metrics: [
      { label: 'rutas HTTP', value: '71' },
      { label: 'tablas', value: '22' },
      { label: 'pruebas e2e', value: '355' },
    ],
    highlights: [
      'El checkout concurrente no vende de más: el stock se descuenta con un UPDATE condicional dentro de la transacción.',
      'Un índice único parcial impide que el mismo comprador tenga dos pedidos pendientes de pago a la vez.',
      'El webhook de pago es idempotente por id de evento; los reintentos del proveedor no duplican nada.',
      'La autorización nunca sale del token: cada petición de vendedor relee su tienda en la base.',
      'Pedir un recurso de otra persona responde 404, no 403: un 403 confirmaría que ese id existe.',
      'Chat por WebSocket con boleto de un minuto, en vez de mandar el token en la URL.',
    ],
    links: [
      { label: 'Verlo en vivo', href: 'https://demo.alfredomejia.com.mx' },
      { label: 'API', href: 'https://github.com/ExcessHawk/marketplace-back' },
      { label: 'Interfaz', href: 'https://github.com/ExcessHawk/marketplace-front' },
      { label: 'Contratos', href: 'https://github.com/ExcessHawk/marketplace-contracts' },
    ],
    playground: true,
    status: 'terminado',
    accent: 'signal',
  },
  {
    slug: 'pensum',
    name: 'Pensum',
    kind: 'SaaS multi-tenant',
    year: '2025 — hoy',
    headline:
      'Plataforma para escuelas privadas: aulas, calificaciones, reportes SEP y avisos por WhatsApp.',
    body: 'Cada escuela vive en su propio subdominio con sus datos aislados. Los profesores capturan calificaciones, el sistema arma las boletas en PDF y los concentrados en Excel, y avisa a los padres por WhatsApp sin pagar la API de Meta.',
    stack: ['Bun', 'Veloce-TS', 'PostgreSQL', 'Drizzle', 'React', 'Stripe', 'pg-boss'],
    metrics: [
      { label: 'aislamiento', value: 'por tenant' },
      { label: 'cola de jobs', value: 'pg-boss' },
      { label: 'pagos', value: 'Stripe' },
    ],
    highlights: [
      'Multi-tenant por subdominio, con el tenant resuelto antes de que la consulta toque la base.',
      'Notificaciones por WhatsApp con Baileys sobre WebSocket, sin costo por mensaje.',
      'Boletas en PDF y concentrados en Excel generados en el servidor.',
      'Suscripciones y webhooks de Stripe para el cobro de cada escuela.',
    ],
    links: [{ label: 'Privado', href: '#' }],
    status: 'activo',
    accent: 'wire',
  },
  {
    slug: 'gpu-hunter',
    name: 'GPU Hunter',
    kind: 'Bot de scraping',
    year: '2026',
    headline:
      'Vigila siete tiendas de México y Estados Unidos y avisa por Discord cuando baja una GPU.',
    body: 'Cada tienda expone sus precios de una forma distinta: feed Atom, JSON-LD, GraphQL de Magento, Store API de WooCommerce, HTML renderizado en servidor. El bot habla el idioma de cada una, guarda el histórico en SQLite y solo avisa cuando algo cambió de verdad.',
    stack: ['Bun', 'TypeScript', 'SQLite', 'Discord webhooks'],
    metrics: [
      { label: 'fuentes', value: '7' },
      { label: 'dependencias', value: '1' },
      { label: 'países', value: 'MX + USA' },
    ],
    highlights: [
      'Siete adaptadores distintos bajo una sola interfaz de fuente.',
      'Avisa por baja de precio, vuelta de stock o entrada bajo el tope, nunca por repetición.',
      'Respeta los límites de cada tienda; las que piden reto de Cloudflare quedan desactivadas, no rodeadas.',
    ],
    links: [{ label: 'Privado', href: '#' }],
    status: 'activo',
    accent: 'ember',
  },
  {
    slug: 'citas-medicas',
    name: 'Sistema de citas médicas',
    kind: 'Aplicación full-stack',
    year: '2025 — hoy',
    headline: 'Agenda clínica con historial, seguimientos y documentos, migrada a Veloce-TS.',
    body: 'Pacientes y doctores agendan, confirman y cancelan citas. El backend original en Node se está portando a Veloce-TS con Drizzle y control de acceso por rol, con una API en camelCase de punta a punta.',
    stack: ['React', 'Veloce-TS', 'PostgreSQL', 'Drizzle', 'Docker'],
    highlights: [
      'Control de acceso por rol: paciente, doctor y administrador ven cosas distintas.',
      'Historial médico, seguimientos y documentos ligados a cada paciente.',
      'Migración progresiva del backend sin tumbar el que ya funcionaba.',
    ],
    links: [{ label: 'Privado', href: '#' }],
    status: 'en-progreso',
    accent: 'wire',
  },
]

export const stack = [
  {
    group: 'Lenguajes',
    items: ['TypeScript', 'JavaScript', 'Java', 'Python', 'PHP', 'C#', 'SQL'],
  },
  {
    group: 'Backend',
    items: ['Bun', 'Node.js', 'Veloce-TS', 'Hono', 'Drizzle', 'Prisma', 'Zod', 'WebSocket'],
  },
  {
    group: 'Frontend',
    items: ['React', 'Next.js', 'Astro', 'Tailwind CSS', 'React Query', 'Vite'],
  },
  {
    group: 'Datos e infraestructura',
    items: ['PostgreSQL', 'MongoDB', 'Redis', 'RabbitMQ', 'SQLite', 'Docker', 'Nginx', 'Git'],
  },
  {
    group: 'Práctica',
    items: ['Pruebas e2e', 'OpenAPI', 'Código seguro', 'Pentesting web', 'CI/CD'],
  },
]
