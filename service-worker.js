const CACHE='spfm-public-v40';
const ASSETS=['./','./index.html','./manifest.webmanifest','./ux-income-label-v35.js','./future-whatif-v1.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);
  if(e.request.mode==='navigate'||u.pathname.endsWith('/index.html')||u.pathname.endsWith('/smart-personal-finance/')){
    e.respondWith(fetch('./index.html',{cache:'no-store'}).then(r=>r.text()).then(t=>new Response(t.replace('</body>','<script src="./ux-income-label-v35.js?v=40"></script><script src="./future-whatif-v1.js?v=40"></script></body>'),{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}})).catch(()=>caches.match('./index.html')));
    return;
  }
  e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{const cp=r.clone();caches.open(CACHE).then(k=>k.put(e.request,cp));return r}).catch(()=>caches.match(e.request)));
});