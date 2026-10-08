/* PuttClub Gym service worker: precached app shell + cache-first 3D player. Never touches API calls (other origins). */
const V='pcgym-22f464694d';
const SHELL=['./','index.html','manifest.webmanifest','fonts/vazirmatn-arabic-wght-normal.woff2','fonts/vazirmatn-latin-wght-normal.woff2',
 'assets/login.webp','assets/emblem.webp','icons/icon-192.png',
 ...['m','f','g','t'].flatMap(k=>[`assets/hero_${k}.webp`,`assets/fig_${k}.webp`,`assets/mus_${k}.webp`])];
const PLAY='pcgym-play-6fb26fa640';
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V&&k!==PLAY).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==location.origin)return;
  if(u.pathname.includes('/play/')){  // big 3D build: cache-first (ignore ?embed&p), refreshed when the cache version changes
    e.respondWith(caches.open(PLAY).then(async c=>{const key=u.origin+u.pathname;const hit=await c.match(key);if(hit)return hit;
      const r=await fetch(key);if(r.ok)c.put(key,r.clone());return r;}));return;}
  if(e.request.mode==='navigate'){  // network-first for the shell so updates arrive; offline → cached shell
    e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(V).then(c=>c.put('index.html',cp));return r;}).catch(()=>caches.match('index.html')));return;}
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(h=>h||fetch(e.request).then(r=>{if(r.ok){const cp=r.clone();caches.open(V).then(c=>c.put(e.request,cp));}return r;})));
});
