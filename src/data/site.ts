export const site = {
  name: 'Alfredo Mejía Rosales',
  handle: 'alfredo',
  role: 'Full-Stack Engineer & autor de framework',
  location: 'Morelia, Michoacán, MX',
  remote: true,
  available: true,
  email: 'mejia_alfredo@outlook.com',
  github: 'https://github.com/ExcessHawk',
  linkedin: 'https://www.linkedin.com/in/excesshawk',
  npm: 'https://www.npmjs.com/package/veloce-ts',
  tagline: 'Construyo el backend y el frontend, y también el framework que los sostiene.',
  summary:
    'Ingeniero en Sistemas Computacionales por el ITSH. Full-Stack en CustomsCity. Escribo TypeScript sobre Bun y PostgreSQL, y publico Veloce-TS en npm.',
} as const

export const sections = [
  { id: 'playground', num: '01', label: 'Playground' },
  { id: 'proyectos', num: '02', label: 'Proyectos' },
  { id: 'stack', num: '03', label: 'Stack' },
  { id: 'trayectoria', num: '04', label: 'Trayectoria' },
  { id: 'contacto', num: '05', label: 'Contacto' },
] as const

export const experience = [
  {
    date: 'Sep 2025 — Actualidad',
    title: 'Desarrollador Full-Stack',
    company: 'CustomsCity',
    points: [
      'Desarrollo y mantenimiento de aplicaciones web completas, de la base de datos a la interfaz.',
      'Diseño e implementación de funcionalidades en frontend y backend, con foco en código mantenible.',
      'Optimización de consultas e integración de APIs entre sistemas.',
    ],
  },
  {
    date: 'Ene 2025 — Ago 2025',
    title: 'Soporte técnico',
    company: 'Facturación Móvil',
    points: [
      'Asistencia a clientes en la implementación de facturación electrónica (CFDI).',
      'Diagnóstico de problemas técnicos y capacitación de usuarios.',
      'Cumplimiento de normativa fiscal del SAT en los procesos internos.',
    ],
  },
  {
    date: 'Feb 2022 — Jul 2022',
    title: 'Desarrollador web',
    company: 'EpoxyMax',
    points: [
      'Sitio web en WordPress para una empresa de diseño de interiores.',
      'Gestión de contenido y promoción de cursos; 200 seguidores en 3 meses, 30% convertido a cliente.',
    ],
  },
] as const

export const achievements = [
  { icon: '01', title: 'Primer lugar', detail: 'Concurso de programación, Día del Programador 2020' },
  { icon: '02', title: 'veloce-ts en npm', detail: 'Framework TypeScript multi-runtime, open source, MIT' },
  { icon: '03', title: 'INNOVATEC · HACKATEC · CODING CUP', detail: 'Participante TecNM 2022' },
] as const
