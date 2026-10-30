# Lake View Park Islamabad guide

Independent noncommercial tourism and cultural information guide. One bilingual English/Urdu Astro static page, with a Cloudflare Worker serving ASSETS and the same-origin weather endpoint. It provides no bookings, ticket sales or payments.

Use the exact Node and pnpm versions in package.json and the existing frozen pnpm lock. The observed Cloudflare workflow is `pnpm install --frozen-lockfile`, `npm run build`, then `npx wrangler deploy`. Historical deployment used Wrangler 4.144.0; Wrangler is an external deployment tool here, not a newly added project dependency. Production still needs its exact successful build and domain checks.

The Worker requires the named ASSETS binding, runs before static assets for canonical/error handling, and sends explicit error aliases and unknown pages as 404/noindex. The 404 document loads neither analytics nor map. Existing HTTP/www variants consolidate to the HTTPS apex with path/query preservation.

CDA’s relevant pages are linked directly. The walk-in aviary is listed as non-functional; gate hours are unconfirmed. The 4 July 2023 entry/parking decision is dated historical evidence, not a current tariff. Google Maps rating/count is an attributed date snapshot, not this guide’s own reviews.

The existing photos remain original-byte local assets. Each display has the precise source, author, date, licence and framing notice; no venue/model clearance is claimed.

Open-Meteo supplies model weather under CC BY 4.0; free API use is limited to noncommercial purposes. Provider, model sources, timestamp and privacy information are visible. The server validates data and bounds cache/model age; failed requests show an unavailable state. Retired service-worker code clears only this guide’s cache namespace and unregisters, rather than turning unknown offline paths into the homepage.
