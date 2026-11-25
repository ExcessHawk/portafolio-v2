// Picks the right content set (Spanish or English) for the Astro side.
// The React islands pick their own data via getPlaygrounds(lang).

import type { Lang } from './ui'
import { site as siteEs, experience as experienceEs, achievements as achievementsEs } from '../data/site'
import { siteEn, experienceEn, achievementsEn } from '../data/site.en'
import { projects as projectsEs, stack as stackEs } from '../data/projects'
import { projectsEn, stackEn } from '../data/projects.en'

export function content(lang: Lang) {
  return lang === 'en'
    ? { site: siteEn, experience: experienceEn, achievements: achievementsEn, projects: projectsEn, stack: stackEn }
    : { site: siteEs, experience: experienceEs, achievements: achievementsEs, projects: projectsEs, stack: stackEs }
}
