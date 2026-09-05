const CACHE='spfm-public-v66';
const ASSETS=['./','./index.html','./manifest.webmanifest','./ux-income-label-v35.js','./future-whatif-v1.js','./financial-health-v1.js','./history-insights-v1.js','./quick-guide-fold-v1.js','./health-simple-v1.js','./position-easy-v1.js','./settings-fold-v1.js','./quick-guide-copy-v1.js','./moji-elegant-ui-v1.js','./moji-theme-fix-v2.js','./moji-ui-skin-v2.js','./commercial-rc1.js','./pwa-install-v1.js'];
const INJECT='<script src="./ux-income-label-v35.js?v=66"></script><script src="./financial-health-v1.js?v=66"></script><script src="./future-whatif-v1.js?v=66"></script><script src="./history-insights-v1.js?v=66"></script><script src="./quick-guide-fold-v1.js?v=66"></script><script src="./health-simple-v1.js?v=66"></script><script src="./position-easy-v1.js?v=66"></script><script src="./settings-fold-v1.js?v=66"></script><script src="./quick-guide-copy-v1.js?v=66"></script><script src="./moji-elegant-ui-v1.js?v=66"></script><script src="./moji-theme-fix-v2.js?v=66"></script><script src="./moji-ui-skin-v2.js?v=66"></script><script src="./commercial-rc1.js?v=rc1"></script><script src="./pwa-install-v1.js?v=1"></script>';
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);
  if(e.request.mode==='navigate'||u.pathname.endsWith('/index.html')||u.pathname.endsWith('/smart-personal-finance/')){
    e.respondWith(fetch('./index.html',{cache:'no-store'}).then(r=>r.text()).then(t=>{
      const isAndroid=u.searchParams.has('android');
      return new Response(isAndroid?t:t.replace('</body>',INJECT+'</body>'),{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}})
    }).catch(()=>caches.match('./index.html')));
    return;
  }
  e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{const cp=r.clone();caches.open(CACHE).then(k=>k.put(e.request,cp));return r}).catch(()=>caches.match(e.request)));
});