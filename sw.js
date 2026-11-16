const CACHE='chiffrecopro-offline-v17';
const APP_SHELL=[
  './','./index.html','./manifest.webmanifest',
  './icon-192.png','./icon-512.png','./25885_proper.png','./hero-home-selected.webp',
  './app-v13.js','./dechets-v1.js','./partner-v1.js','./pwa.js','./auth-v1.js',
  './runtime-stability.js','./navigation-v2.js','./navigation-bridge-v1.js',
  './document-access-v1.js','./document-workflow-access-v2.js','./documents-v2.js',
  './barometre-pro-v1.js','./workflow-particulier-v1.js','./offline-mode.js'
];
const PREFIX='chiffrecopro-';
self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE);
    await Promise.allSettled(APP_SHELL.map(async url=>{
      try{const response=await fetch(url,{cache:'reload'});if(response.ok)await cache.put(url,response)}catch(_){}
    }));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(key=>key.startsWith(PREFIX)&&key!==CACHE).map(key=>caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return;
  if(request.mode==='navigate'){
    event.respondWith((async()=>{
      try{
        const response=await fetch(request);
        if(response.ok){const cache=await caches.open(CACHE);cache.put('./index.html',response.clone()).catch(()=>{});}
        return response;
      }catch(_){
        const cache=await caches.open(CACHE);
        return (await cache.match(request))||(await cache.match('./index.html'))||Response.error();
      }
    })());
    return;
  }
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE);
    const cached=await cache.match(request,{ignoreSearch:true});
    if(cached){
      fetch(request).then(response=>{if(response.ok)cache.put(request,response.clone())}).catch(()=>{});
      return cached;
    }
    try{
      const response=await fetch(request);
      if(response.ok)cache.put(request,response.clone()).catch(()=>{});
      return response;
    }catch(_){return Response.error();}
  })());
});