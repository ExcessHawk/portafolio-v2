// English content for the site profile. URLs, email, name and handle are
// language-neutral and reused from `site.ts`; only prose is translated here.

import { site as siteBase } from './site'

export const siteEn = {
  ...siteBase,
  role: 'Full-Stack Engineer & framework author',
  tagline: 'I build the backend and the frontend — and the framework that holds them up.',
  summary:
    'Computer Systems Engineer (ITSH). Full-Stack at CustomsCity. I write TypeScript on Bun and PostgreSQL, and publish Veloce-TS on npm.',
} as const

export const experienceEn = [
  {
    date: 'Sep 2025 — Present',
    title: 'Full-Stack Developer',
    company: 'CustomsCity',
    points: [
      'Build and maintain complete web applications, from the database to the interface.',
      'Design and implement features across frontend and backend, with a focus on maintainable code.',
      'Optimize queries and integrate APIs between systems.',
    ],
  },
  {
    date: 'Jan 2025 — Aug 2025',
    title: 'Technical Support',
    company: 'Facturación Móvil',
    points: [
      'Helped clients implement electronic invoicing (CFDI).',
      'Diagnosed technical issues and trained users.',
      "Kept internal processes compliant with Mexico's SAT tax regulations.",
    ],
  },
  {
    date: 'Feb 2022 — Jul 2022',
    title: 'Web Developer',
    company: 'EpoxyMax',
    points: [
      'WordPress site for an interior-design company.',
      'Content management and course promotion; 200 followers in 3 months, 30% converted to clients.',
    ],
  },
] as const

export const achievementsEn = [
  { icon: '01', title: 'First place', detail: "Programming contest, Programmer's Day 2020" },
  { icon: '02', title: 'veloce-ts on npm', detail: 'Multi-runtime TypeScript framework, open source, MIT' },
  { icon: '03', title: 'INNOVATEC · HACKATEC · CODING CUP', detail: 'Participant, TecNM 2022' },
] as const
