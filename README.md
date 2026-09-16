# Lake View Park Islamabad — Astro site

Urdu (RTL) single-page attraction website for Lake View Park / Rawal Lake, Islamabad.

## Stack

- Astro 7.3.2
- Tailwind CSS 4.3.3
- TypeScript 6.0.3
- pnpm 12.4.1
- Node.js 24.21.0 LTS
- Cloudflare Workers Static Assets

## Domain configuration

The domain is configured in **one place only** via `SITE_URL` in `astro.config.mjs`.

```bash
SITE_URL=https://your-real-domain.tld pnpm build
```

If `SITE_URL` is absent, the project remains buildable; canonical/absolute OG URLs are omitted and `@astrojs/sitemap` is disabled instead of generating a placeholder domain.

## Development

```bash
corepack enable
pnpm install
pnpm check
pnpm build
pnpm dev
```

## Cloudflare Workers

`wrangler.jsonc` serves the generated `dist/` folder as Workers Static Assets.

```bash
pnpm build
npx wrangler deploy
```

## GA4

Measurement ID: `G-HXM22WWPKP`

## Image note

Real Lake View Park / Rawal Lake photos are referenced from Wikimedia Commons. See `PHOTO-CREDITS.md`. Replace the remote URLs with files under `public/images/` if you want a fully offline image bundle.
