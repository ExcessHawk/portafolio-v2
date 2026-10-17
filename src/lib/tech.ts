import * as si from 'simple-icons'

export type TechIcon = {
  title: string
  path: string
  hex: string
}

type Custom = { title: string; path: string; hex: string }

const brand = (key: keyof typeof si, override?: Partial<Custom>): TechIcon => {
  const icon = si[key] as unknown as { title: string; path: string; hex: string }
  return {
    title: override?.title ?? icon.title,
    path: override?.path ?? icon.path,
    hex: override?.hex ?? icon.hex,
  }
}

const custom: Record<string, Custom> = {
  database: {
    title: 'SQL',
    hex: '8B97A7',
    path: 'M12 2.2c-4.4 0-8 1.3-8 3v13.6c0 1.7 3.6 3 8 3s8-1.3 8-3V5.2c0-1.7-3.6-3-8-3zm0 1.9c3.6 0 6.1 1 6.1 1.1S15.6 6.3 12 6.3 5.9 5.3 5.9 5.2 8.4 4.1 12 4.1zM18.1 9.6c-1.5.8-3.8 1.2-6.1 1.2s-4.6-.4-6.1-1.2V7.4c1.5.8 3.8 1.2 6.1 1.2s4.6-.4 6.1-1.2v2.2zm0 4.6c-1.5.8-3.8 1.2-6.1 1.2s-4.6-.4-6.1-1.2V12c1.5.8 3.8 1.2 6.1 1.2s4.6-.4 6.1-1.2v2.2zm-6.1 5.8c-3.6 0-6.1-1-6.1-1.1v-2.3c1.5.8 3.8 1.2 6.1 1.2s4.6-.4 6.1-1.2v2.3c0 .1-2.5 1.1-6.1 1.1z',
  },
  'veloce-ts': {
    title: 'Veloce-TS',
    hex: '4ADE80',
    path: 'M2.4 3.6h4.3l4.1 11.1 4.1-11.1h4.3L12.9 20.4H9.2L2.4 3.6zm15.9 11.2a2.4 2.4 0 1 1 0 4.8 2.4 2.4 0 0 1 0-4.8z',
  },
  'c-sharp': {
    title: 'C#',
    hex: '9B4F96',
    path: 'M9.6 6.2c-2.9 0-5 2.4-5 5.8s2.1 5.8 5 5.8c1.9 0 3.4-.9 4.2-2.5l-2-1.1c-.4.9-1.2 1.4-2.2 1.4-1.6 0-2.6-1.4-2.6-3.6s1-3.6 2.6-3.6c1 0 1.8.5 2.2 1.4l2-1.1c-.8-1.6-2.3-2.5-4.2-2.5zm7.1 1.1-.4 2.3h-1.6v1.9h1.3l-.3 1.7h-1v1.9h.7l-.4 2.3h1.9l.4-2.3h1.3l-.4 2.3h1.9l.4-2.3h1.6v-1.9h-1.3l.3-1.7h1v-1.9h-.7l.4-2.3h-1.9l-.4 2.3h-1.3l.4-2.3h-1.9zm1.2 4.2h1.3l-.3 1.7h-1.3l.3-1.7z',
  },
  websocket: {
    title: 'WebSocket',
    hex: '38BDF8',
    path: 'M3 7.5h10.6l-2.3-2.3L12.7 3.8l4.7 4.7-4.7 4.7-1.4-1.4 2.3-2.3H3V7.5zm18 9h-10.6l2.3 2.3-1.4 1.4-4.7-4.7 4.7-4.7 1.4 1.4-2.3 2.3H21v2z',
  },
  tests: {
    title: 'Pruebas end to end',
    hex: '4ADE80',
    path: 'M7 2.4h10a2.6 2.6 0 0 1 2.6 2.6v14a2.6 2.6 0 0 1-2.6 2.6H7A2.6 2.6 0 0 1 4.4 19V5A2.6 2.6 0 0 1 7 2.4zm9.1 6.1-1.5-1.5-4 4-1.8-1.8-1.5 1.5 3.3 3.3 5.5-5.5zM8 15.6h8v1.9H8v-1.9z',
  },
  security: {
    title: 'Código seguro',
    hex: '4ADE80',
    path: 'M12 1.8 3.6 5v6.2c0 5.2 3.6 10 8.4 11.2 4.8-1.2 8.4-6 8.4-11.2V5L12 1.8zm3.9 7.6-5.3 5.3-2.5-2.5 1.4-1.4 1.1 1.1 3.9-3.9 1.4 1.4z',
  },
  pentest: {
    title: 'Pentesting web',
    hex: 'FB923C',
    path: 'M10.6 2.6a8 8 0 1 0 4.5 14.6l4.8 4.8 1.9-1.9-4.8-4.8A8 8 0 0 0 10.6 2.6zm0 2.2a5.8 5.8 0 1 1 0 11.6 5.8 5.8 0 0 1 0-11.6zm-.9 2.1v2.4H7.3v1.8h2.4v2.4h1.8v-2.4h2.4V9.3h-2.4V6.9H9.7z',
  },
  cicd: {
    title: 'CI/CD',
    hex: '38BDF8',
    path: 'M12 3.6c2.5 0 4.7 1.2 6.1 3.1l1.6-1.6v5.3h-5.3l2.1-2.1A5.3 5.3 0 0 0 6.9 10l-2.1-.6A7.5 7.5 0 0 1 12 3.6zm0 16.8a7.5 7.5 0 0 1-7.2-5.4l2.1-.6a5.3 5.3 0 0 0 9.6 1.7l-2.1-2.1h5.3v5.3l-1.6-1.6A7.4 7.4 0 0 1 12 20.4z',
  },
  router: {
    title: 'React Router',
    hex: 'CA4245',
    path: 'M5.2 4.6a3.2 3.2 0 0 1 0 6.4h13.6a3.2 3.2 0 0 1 0 6.4H5.2v-2.2h13.6a1 1 0 0 0 0-2H5.2a5.4 5.4 0 0 1 0-10.8h4.3v2.2H5.2zm0 10.6a3.2 3.2 0 1 1 0 6.4 3.2 3.2 0 0 1 0-6.4z',
  },
}

const MAP: Record<string, () => TechIcon> = {
  TypeScript: () => brand('siTypescript'),
  JavaScript: () => brand('siJavascript'),
  Python: () => brand('siPython'),
  PHP: () => brand('siPhp'),
  Java: () => brand('siOpenjdk', { title: 'Java', hex: 'E76F00' }),
  'C#': () => custom['c-sharp']!,
  SQL: () => custom['database']!,

  Bun: () => brand('siBun', { hex: 'FBF0DF' }),
  'Node.js': () => brand('siNodedotjs'),
  'Veloce-TS': () => custom['veloce-ts']!,
  Hono: () => brand('siHono'),
  Drizzle: () => brand('siDrizzle'),
  Prisma: () => brand('siPrisma', { hex: '5A67D8' }),
  Zod: () => brand('siZod'),
  WebSocket: () => custom['websocket']!,
  'OpenAPI 3.1': () => brand('siOpenapiinitiative', { title: 'OpenAPI' }),
  OpenAPI: () => brand('siOpenapiinitiative'),
  Stripe: () => brand('siStripe'),
  'pg-boss': () => brand('siPostgresql', { title: 'pg-boss' }),

  React: () => brand('siReact'),
  'Next.js': () => brand('siNextdotjs', { hex: 'E4E9EF' }),
  Astro: () => brand('siAstro'),
  'Tailwind CSS': () => brand('siTailwindcss'),
  'React Query': () => brand('siReactquery'),
  'React Router': () => custom['router']!,
  Vite: () => brand('siVite'),

  PostgreSQL: () => brand('siPostgresql'),
  MongoDB: () => brand('siMongodb'),
  Redis: () => brand('siRedis'),
  SQLite: () => brand('siSqlite', { hex: '4C90C0' }),
  RabbitMQ: () => brand('siRabbitmq'),
  Docker: () => brand('siDocker'),
  Nginx: () => brand('siNginx'),
  Git: () => brand('siGit'),
  'Discord webhooks': () => brand('siDiscord', { title: 'Discord' }),

  'Pruebas e2e': () => custom['tests']!,
  'Código seguro': () => custom['security']!,
  'Pentesting web': () => custom['pentest']!,
  'CI/CD': () => custom['cicd']!,
}

export function techIcon(name: string): TechIcon | null {
  const make = MAP[name]
  return make ? make() : null
}

export const social = {
  github: () => brand('siGithub', { hex: 'E4E9EF' }),
  npm: () => brand('siNpm'),
  linkedin: (): TechIcon => ({
    title: 'LinkedIn',
    hex: '0A66C2',
    path: 'M4.1 3h15.8A1.1 1.1 0 0 1 21 4.1v15.8a1.1 1.1 0 0 1-1.1 1.1H4.1A1.1 1.1 0 0 1 3 19.9V4.1A1.1 1.1 0 0 1 4.1 3zM6.4 9.4v8.3h2.6V9.4H6.4zm1.3-1.2a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm3.4 1.2v8.3h2.6v-4.4c0-1.2.2-2.3 1.7-2.3s1.5 1.3 1.5 2.4v4.3h2.6v-4.8c0-2.3-.5-4-3.1-4a2.7 2.7 0 0 0-2.5 1.3h-.1V9.4h-2.7z',
  }),
  mail: (): TechIcon => ({
    title: 'Correo',
    hex: '8B97A7',
    path: 'M2.4 5.4h19.2v13.2H2.4V5.4zm1.8 2.2v.5l7.8 5.2 7.8-5.2v-.5H4.2zm15.6 3.1-7.8 5.2-7.8-5.2v5.7h15.6v-5.7z',
  }),
}
