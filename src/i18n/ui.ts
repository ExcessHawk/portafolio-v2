// Central UI dictionary for the two locales. Content that belongs to the
// data layer (projects, experience, playground copy) lives in the parallel
// `*.en.ts` data files; this file holds the page chrome and section copy.

export type Lang = 'es' | 'en'

export const LANGS: Lang[] = ['es', 'en']

type Section = { id: string; num: string; title: string; lead?: string; heading: string }

type Dict = {
  htmlLang: string
  ogLocale: string
  dir: 'EN' | 'ES'
  meta: { title: string; description: string }
  skip: string
  nav: { write: string; toggleLabel: string; toggleAria: string }
  sections: { id: string; num: string; label: string }[]
  footer: { made: string; code: string; email: string }
  hero: {
    badge: string
    introPre: string
    introPost: string
    ctaTry: string
    ctaProjects: string
    ctaCv: string
    codeComment: string
    codeCaption: string
    facts: { label: string; value: string }[]
  }
  copy: {
    playground: Section
    proyectos: Section
    stack: Section
    trayectoria: Section
    contacto: Omit<Section, 'lead'>
  }
  trayectoria: { formacion: string; reconocimientos: string; degree: string; school: string }
  contacto: {
    pitch: string
    locationLine: string
    cv: string
    labelGithub: string
    labelNpm: string
    labelLinkedin: string
    labelAvailability: string
    availabilityValue: string
  }
  card: {
    status: { activo: string; terminado: string; 'en-progreso': string }
    tryAbove: string
    privateCode: string
  }
}

export const ui: Record<Lang, Dict> = {
  es: {
    htmlLang: 'es',
    ogLocale: 'es_MX',
    dir: 'EN',
    meta: {
      title: 'Alfredo Mejía Rosales — Full-Stack Engineer',
      description:
        'Ingeniero en Sistemas Computacionales. Full-Stack en CustomsCity. Escribo TypeScript sobre Bun y PostgreSQL, y publico Veloce-TS en npm.',
    },
    skip: 'Saltar al contenido',
    nav: { write: 'Escríbeme', toggleLabel: 'EN', toggleAria: 'View in English' },
    sections: [
      { id: 'playground', num: '01', label: 'Playground' },
      { id: 'proyectos', num: '02', label: 'Proyectos' },
      { id: 'stack', num: '03', label: 'Stack' },
      { id: 'trayectoria', num: '04', label: 'Trayectoria' },
      { id: 'contacto', num: '05', label: 'Contacto' },
    ],
    footer: {
      made: 'Hecho con Astro y Tailwind. El playground corre la aplicación de verdad.',
      code: 'El código de esta página ↗',
      email: 'Email',
    },
    hero: {
      badge: 'Abierto a oportunidades',
      introPre:
        'Ingeniero en Sistemas Computacionales. Escribo TypeScript sobre Bun y PostgreSQL. Publiqué ',
      introPost: ' en npm y lo uso para construir lo que ves más abajo.',
      ctaTry: 'Probar un proyecto',
      ctaProjects: 'Ver proyectos',
      ctaCv: 'Descargar CV',
      codeComment: '// el stock no se vende dos veces',
      codeCaption: '355 pruebas end-to-end en verde',
      facts: [
        { label: 'ubicación', value: 'Morelia, MX · remoto' },
        { label: 'ahora', value: 'Full-Stack en CustomsCity' },
        { label: 'publicado', value: 'veloce-ts@3.5.1 en npm' },
      ],
    },
    copy: {
      playground: {
        id: 'playground',
        num: '01',
        title: 'Playground',
        lead: 'Casi todos los portafolios enseñan capturas de pantalla. Aquí puedes usar la aplicación, y además ver el tráfico que genera contra la API.',
        heading: 'Úsalo tú mismo, sin registrarte',
      },
      proyectos: {
        id: 'proyectos',
        num: '02',
        title: 'Proyectos',
        lead: 'Nueve cosas que construí de punta a punta. La primera es el framework sobre el que corren casi todas las demás.',
        heading: 'Lo que he construido',
      },
      stack: {
        id: 'stack',
        num: '03',
        title: 'Stack',
        lead: 'Herramientas que uso a diario, no una lista de todo lo que he tocado una vez.',
        heading: 'Con qué trabajo',
      },
      trayectoria: {
        id: 'trayectoria',
        num: '04',
        title: 'Trayectoria',
        lead: 'De soporte técnico a construir plataformas completas, y a publicar las herramientas que uso para hacerlo.',
        heading: 'Por dónde he pasado',
      },
      contacto: { id: 'contacto', num: '05', title: 'Contacto', heading: 'Hablemos' },
    },
    trayectoria: {
      formacion: 'Formación',
      reconocimientos: 'Reconocimientos',
      degree: 'Ingeniería en Sistemas Computacionales',
      school: 'Instituto Tecnológico Superior de Huetamo · titulado',
    },
    contacto: {
      pitch:
        'Estoy abierto a oportunidades como desarrollador full-stack, de preferencia donde el backend pese tanto como la interfaz.',
      locationLine: ' · trabajo remoto sin problema. Español nativo, inglés técnico.',
      cv: 'Descargar CV',
      labelGithub: 'GitHub',
      labelNpm: 'npm',
      labelLinkedin: 'LinkedIn',
      labelAvailability: 'Disponibilidad',
      availabilityValue: 'abierto a propuestas',
    },
    card: {
      status: { activo: 'en desarrollo activo', terminado: 'terminado', 'en-progreso': 'en progreso' },
      tryAbove: 'pruébalo arriba',
      privateCode: 'código privado',
    },
  },

  en: {
    htmlLang: 'en',
    ogLocale: 'en_US',
    dir: 'ES',
    meta: {
      title: 'Alfredo Mejía Rosales — Full-Stack Engineer',
      description:
        'Computer Systems Engineer. Full-Stack at CustomsCity. I write TypeScript on Bun and PostgreSQL, and publish Veloce-TS on npm.',
    },
    skip: 'Skip to content',
    nav: { write: 'Get in touch', toggleLabel: 'ES', toggleAria: 'Ver en español' },
    sections: [
      { id: 'playground', num: '01', label: 'Playground' },
      { id: 'proyectos', num: '02', label: 'Projects' },
      { id: 'stack', num: '03', label: 'Stack' },
      { id: 'trayectoria', num: '04', label: 'Experience' },
      { id: 'contacto', num: '05', label: 'Contact' },
    ],
    footer: {
      made: 'Built with Astro and Tailwind. The playground runs the real app.',
      code: "This page's code ↗",
      email: 'Email',
    },
    hero: {
      badge: 'Open to opportunities',
      introPre:
        'Computer Systems Engineer. I write TypeScript on Bun and PostgreSQL. I published ',
      introPost: ' on npm and use it to build what you see below.',
      ctaTry: 'Try a project',
      ctaProjects: 'See projects',
      ctaCv: 'Download CV',
      codeComment: '// stock is never sold twice',
      codeCaption: '355 end-to-end tests passing',
      facts: [
        { label: 'location', value: 'Morelia, MX · remote' },
        { label: 'now', value: 'Full-Stack at CustomsCity' },
        { label: 'published', value: 'veloce-ts@3.5.1 on npm' },
      ],
    },
    copy: {
      playground: {
        id: 'playground',
        num: '01',
        title: 'Playground',
        lead: 'Almost every portfolio shows screenshots. Here you can use the app itself, and watch the traffic it generates against the API.',
        heading: 'Use it yourself, no sign-up',
      },
      proyectos: {
        id: 'proyectos',
        num: '02',
        title: 'Projects',
        lead: 'Nine things I built end to end. The first is the framework that almost all the others run on.',
        heading: "What I've built",
      },
      stack: {
        id: 'stack',
        num: '03',
        title: 'Stack',
        lead: 'Tools I use every day, not a list of everything I touched once.',
        heading: 'What I work with',
      },
      trayectoria: {
        id: 'trayectoria',
        num: '04',
        title: 'Experience',
        lead: 'From tech support to building whole platforms, and to publishing the tools I use to do it.',
        heading: "Where I've been",
      },
      contacto: { id: 'contacto', num: '05', title: 'Contact', heading: "Let's talk" },
    },
    trayectoria: {
      formacion: 'Education',
      reconocimientos: 'Recognition',
      degree: 'B.Sc. in Computer Systems Engineering',
      school: 'Instituto Tecnológico Superior de Huetamo · graduated',
    },
    contacto: {
      pitch:
        'I’m open to full-stack roles, ideally where the backend carries as much weight as the interface.',
      locationLine: ' · happy to work remote. Native Spanish, technical English.',
      cv: 'Download CV',
      labelGithub: 'GitHub',
      labelNpm: 'npm',
      labelLinkedin: 'LinkedIn',
      labelAvailability: 'Availability',
      availabilityValue: 'open to offers',
    },
    card: {
      status: { activo: 'in active development', terminado: 'completed', 'en-progreso': 'in progress' },
      tryAbove: 'try it above',
      privateCode: 'private code',
    },
  },
}

/** The path of the page in the other locale, for the language toggle. */
export function altPath(lang: Lang): string {
  return lang === 'es' ? '/en/' : '/'
}
