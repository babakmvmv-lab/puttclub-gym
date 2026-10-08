/* PuttClub Gym service worker (https only). Heavy files live in IndexedDB (app.js «offline package»),
   so the SW never caches assets or the 3D player — it only keeps the latest page for offline start.
   Navigation is network-first with no HTTP cache, so a new release is picked up immediately. */
const V='pcgym-shell-/*V*/';
self.addEventListener('install',e=>{self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==location.origin||e.request.mode!=='navigate')return;
  e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{if(r.ok){const cp=r.clone();caches.open(V).then(c=>c.put('index.html',cp));}return r;})
    .catch(()=>caches.open(V).then(c=>c.match('index.html')).then(h=>h||Response.error())));
});
