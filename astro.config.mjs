import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Domain is configured in one place only. Defaults to the live domain so canonical
// URLs, sitemap and absolute OG/image links are correct even without SITE_URL.
const site = process.env.SITE_URL?.trim() || 'https://lakeviewparkguide.com';

export default defineConfig({
  site,
  output: 'static',
  integrations: site ? [sitemap()] : [],
  vite: {
    plugins: [tailwindcss()],
  },
});
