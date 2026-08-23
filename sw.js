const CACHE='lgs-2027-frozen-v2.2.1-cloud-hotfix';
const ASSETS=['./','./index.html','./styles.css','./app.js','./ai.js','./cloud.js','./lesson-engine.js','./question-engine.js','./data/curriculum.js','./data/official-curriculum.js','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  const u=new URL(e.request.url);
  if(u.pathname.endsWith('/cloud-config.js')){
    e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>r).catch(()=>caches.match(e.request)));
    return;
  }
  e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy)).catch(()=>{});return r}).catch(()=>caches.match('./index.html'))));
});
