// Cloudflare Worker: serves the static site (via the ASSETS binding) and proxies
// weather data server-side so the browser never talks to a third-party API directly.
// Responses are cached at the edge for ~30 minutes.

const LAT = '33.71494';
const LON = '73.13281';
const WEATHER_API =
  'https://api.open-meteo.com/v1/forecast?latitude=' + LAT + '&longitude=' + LON +
  '&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_gusts_10m,wind_direction_10m,is_day' +
  '&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,uv_index_max,sunrise,sunset' +
  '&timezone=auto&forecast_days=7';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === '/api/weather') {
      return handleWeather(ctx);
    }

    // Everything else is served from the built static assets.
    return env.ASSETS.fetch(request);
  }
};

async function handleWeather(ctx) {
  const cache = caches.default;
  const cacheKey = new Request(WEATHER_API, { method: 'GET' });

  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(WEATHER_API, {
      headers: { 'User-Agent': 'lakeviewparkguide/1.0 (+https://lakeviewparkguide.com)' }
    });
    if (!res.ok) {
      return new Response(JSON.stringify({ error: 'weather_unavailable' }), {
        status: 502,
        headers: { 'content-type': 'application/json' }
      });
    }
    const body = await res.text();
    const response = new Response(body, {
      headers: {
        'content-type': 'application/json',
        'cache-control': 'public, max-age=1800',
        'access-control-allow-origin': '*'
      }
    });
    ctx.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  } catch (e) {
    return new Response(JSON.stringify({ error: 'weather_unavailable' }), {
      status: 502,
      headers: { 'content-type': 'application/json' }
    });
  }
}
