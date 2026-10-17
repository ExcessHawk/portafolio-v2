import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL ?? 'https://alfredomejia.com.mx',
  integrations: [react(), sitemap()],
  vite: { plugins: [tailwindcss()] },
})
