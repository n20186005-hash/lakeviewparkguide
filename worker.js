// Static Astro pages plus a same-origin Open-Meteo forecast. ASSETS is bound in Wrangler.
const LAT='33.71494',LON='73.13281';
const WEATHER_API='https://api.open-meteo.com/v1/forecast?latitude='+LAT+'&longitude='+LON+
 '&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_gusts_10m,wind_direction_10m,is_day'+
 '&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,uv_index_max,sunrise,sunset&timezone=Asia%2FKarachi&forecast_days=7';
const TTL=30*60*1000;
function validate(data,now){
 const c=['temperature_2m','relative_humidity_2m','apparent_temperature','precipitation','weather_code','wind_speed_10m','wind_gusts_10m'];
 const d=['weather_code','temperature_2m_max','temperature_2m_min','precipitation_sum','precipitation_probability_max','wind_speed_10m_max','wind_gusts_10m_max','uv_index_max'];
 if(!data?.current||data.timezone!=='Asia/Karachi'||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2})?$/.test(data.current.time))throw Error('Invalid model time');
 const model=Date.parse(data.current.time+'+05:00');if(!Number.isFinite(model)||now-model>2*3600000||model-now>3600000)throw Error('Old model');
 if(!c.every(k=>typeof data.current[k]==='number'&&Number.isFinite(data.current[k])))throw Error('Invalid current');
 const dates=data.daily?.time;if(!Array.isArray(dates)||!dates.length||dates.length>7||!dates.every(x=>typeof x==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(x)))throw Error('Invalid dates');
 if(!d.every(k=>Array.isArray(data.daily[k])&&data.daily[k].length===dates.length&&data.daily[k].every(x=>typeof x==='number'&&Number.isFinite(x))))throw Error('Invalid forecast');
 if(!['sunrise','sunset'].every(k=>Array.isArray(data.daily[k])&&data.daily[k].length===dates.length&&data.daily[k].every(x=>typeof x==='string'&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(x))))throw Error('Invalid sun times');
 return data;
}
function json(data,status=200){return new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':status===200?'public, max-age=300, s-maxage=1800':'no-store'}});}
export async function handleWeather(ctx,fetcher=fetch,clock=Date.now){
 const cache=globalThis.caches?.default,cacheKey=new Request('https://lakeviewparkguide.com/api/weather?format=2');
 try{
  const saved=await cache?.match(cacheKey);
  if(saved){const data=await saved.json();const now=clock(),ts=Date.parse(data.guide?.fetchedAt);if(now-ts>=0&&now-ts<TTL){validate(data,now);return json({...data,guide:{...data.guide,ageSeconds:Math.floor((now-ts)/1000)}});}}
 }catch{/* Cache failures must not stop a fresh upstream request. */}
 try{
  const res=await fetcher(WEATHER_API,{signal:AbortSignal.timeout(10000),headers:{'User-Agent':'lakeviewparkguide/1.0 (+https://lakeviewparkguide.com)'}});
  if(!res.ok)throw Error('Upstream unavailable');const now=clock(),raw=validate(await res.json(),now);
  const response=json({...raw,guide:{source:'Open-Meteo',fetchedAt:new Date(now).toISOString(),ageSeconds:0,timezone:'Asia/Karachi'}});
  if(cache)ctx.waitUntil(cache.put(cacheKey,response.clone()).catch(()=>{}));return response;
 }catch{return json({error:'weather_unavailable'},502);}
}
export default {
 async fetch(request,env,ctx){
  const url=new URL(request.url),head=request.method==='HEAD';
  if(url.hostname==='www.lakeviewparkguide.com'||(url.hostname==='lakeviewparkguide.com'&&url.protocol==='http:')){url.hostname='lakeviewparkguide.com';url.protocol='https:';return new Response(null,{status:308,headers:{Location:url.href}});}
  if(url.pathname==='/api/weather'){if(request.method!=='GET')return new Response(null,{status:405,headers:{Allow:'GET'}});return handleWeather(ctx);}
  if(['GET','HEAD'].includes(request.method)&&['/index','/index.html'].includes(url.pathname)){url.pathname='/';return new Response(null,{status:308,headers:{Location:url.href}});}
  const alias=/^\/404(?:\/|\.html)?$/.test(url.pathname);
  const response=await env.ASSETS.fetch(alias?new Request(new URL('/404.html',url),{method:'GET'}):request);
  if(alias||response.status===404){const error=alias?response:await env.ASSETS.fetch(new Request(new URL('/404.html',url),{method:'GET'}));const headers=new Headers(error.headers);headers.delete('Location');headers.set('X-Robots-Tag','noindex');headers.set('Cache-Control','no-store');return new Response(head?null:error.body,{status:404,headers});}
  return head?new Response(null,{status:response.status,headers:response.headers}):response;
 }
};
