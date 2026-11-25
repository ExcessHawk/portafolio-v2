import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL ?? 'https://alfredomejia.com.mx',
  // Spanish stays at the root (no prefix); English lives under /en/.
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [react(), sitemap()],
  vite: { plugins: [tailwindcss()] },
})
