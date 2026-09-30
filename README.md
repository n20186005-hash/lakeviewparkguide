# Lake View Park Islamabad — Astro site

English-primary (with a Urdu secondary block) single-page attraction website for **Lake View Park / Rawal Lake, Islamabad**, with a professional non-profit visitor-guide focus.

## Stack

- Astro 7.3.2
- Tailwind CSS 4.3.3
- TypeScript 6.0.3
- Cloudflare Workers (Static Assets + a small Worker for live weather)
- Node.js 24.x (build)

## Domain configuration

The domain is centralized in `astro.config.mjs`. It defaults to `https://lakeviewparkguide.com`, and can be overridden with `SITE_URL`:

```bash
SITE_URL=https://your-real-domain.tld pnpm build
```

Canonical, OG and JSON-LD absolute URLs are derived from this value.

## SEO entity binding (single-attraction template)

All SEO variables live at the top of `src/pages/index.astro`. Replace the values in the `park` object to retarget the template:

| Variable | Value used |
| --- | --- |
| `{{DOMAIN_NAME}}` | `lakeviewparkguide.com` |
| `{{ATTRACTION_FULL_NAME}}` | `Lake View Park` |
| `{{ATTRACTION_SHORT_NAME}}` | `Lake View Park` |
| `{{CITY_NAME}}` | `Islamabad` |
| `{{STATE_PROVINCE}}` | `Islamabad Capital Territory` |
| `{{COUNTRY_NAME}}` | `Pakistan` |
| `{{COUNTRY_CODE_2LETTER}}` | `PK` |
| `{{POSTAL_CODE}}` | `49510` |
| `{{LATITUDE}}` | `33.71494` |
| `{{LONGITUDE}}` | `73.13281` |
| `{{MAPS_SHARE_URL}}` | `https://maps.app.goo.gl/6Jch5oC2zebDATyq9` |
| `{{MAPS_EMBED_SRC}}` | Google Maps embed (Murree Rd) |
| `{{NEARBY_LANDMARK_1}}` | `Rawal Dam & Rawal Lake` |
| `{{NEARBY_LANDMARK_2}}` | `Shakarparian / Pakistan Monument` |
| `{{GOVT_TOURISM_URL}}` | `https://tourism.gov.pk/` (PTDC) |

Structured data emitted: `TouristAttraction` (with `@id`, `image`, `isAccessibleForFree`, `hasMap`, `sameAs`, `geo`, `address`), `BreadcrumbList`, and `FAQPage`.

### Reviews / ratings compliance

The Google Maps rating (**4.5**, **14,911** reviews, synced **2026-09**) is shown on the page only, with a visible source attribution and a link to the Google Maps listing. It is **deliberately excluded from JSON-LD** to avoid misrepresenting third-party ratings. The attribution note and the "Sources" section carry the required copyright/source text.

## Live weather (server-side, cached)

The weather module fetches **Open-Meteo** (no API key required) through a Cloudflare Worker (`worker.js`) that proxies and edge-caches the response for ~30 minutes. The browser only calls the site's own `/api/weather` endpoint, so no third-party keys are exposed and the frontend shows no implementation details.

- `worker.js` — Worker: serves static assets via the `ASSETS` binding and proxies `/api/weather`.
- The page renders current conditions + a 7-day forecast, with a simple "carry an umbrella?" hint.

## PWA

- `public/manifest.webmanifest` — install metadata + icons.
- `public/sw.js` — caches the app shell for offline viewing; never caches `/api/weather`.
- `public/icons/icon-192.png`, `icon-512.png`, `icon.svg` — generated from the logo artwork.

## Development

```bash
corepack enable
pnpm install
pnpm check
pnpm build
pnpm dev
```

## Cloudflare Workers (manual deploy)

`wrangler.jsonc` uses `assets.directory: ./dist` **and** `main: ./worker.js`. Build first, then deploy:

```bash
pnpm build
npx wrangler deploy
```

Only the built `./dist` assets are uploaded (`.wranglerignore` excludes source/config files).

## GA4

Measurement ID: `G-HXM22WWPKP`

## Image note

Real Lake View Park / Rawal Lake photos live under `public/images/` (downloaded from Wikimedia Commons). Credits are in `PHOTO-CREDITS.md`.
