const CACHE='chifrecopro-v44';

const ASSETS=[
'./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./hero-home-ecopro.webp',
'./catalog-v2.js','./eco-lever-v1.js','./ux-v1.js','./barometre-pro-v1.js',
'./completion-v1.js','./chifrecopro-v15.js','./chifrecopro-v22.js','./chifrecopro-v23.js','./chifrecopro-v24.js',
'./chifrecopro-v25.js','./chifrecopro-v26.js','./chifrecopro-v27.js','./chifrecopro-v28.js','./chifrecopro-v29.js',
'./chifrecopro-v31.js','./chifrecopro-v32.js','./chifrecopro-v33.js','./qa-v34.js','./chifrecopro-v35.js',
'./chifrecopro-v36.js','./chifrecopro-v37.js','./chifrecopro-v38.js','./chifrecopro-v39.js','./chifrecopro-v40.js','./chifrecopro-v41.js','./chifrecopro-v42.js','./chifrecopro-v43.js','./chifrecopro-v44.js',
'./partner-v1.js','./tool-v1.js'
];

async function transform(r){
if(!r||!r.ok)return r;
const ct=r.headers.get('content-type')||'';
if(ct.includes('text/html')){
const t=await r.text();
if(t.includes('data-chifrecopro-injected="v44"'))return new Response(t,{status:r.status,statusText:r.statusText,headers:r.headers});
const h=new Headers(r.headers);h.delete('content-length');
const files=['partner-v1.js','tool-v1.js','catalog-v2.js','eco-lever-v1.js','ux-v1.js','barometre-pro-v1.js','completion-v1.js','chifrecopro-v15.js','chifrecopro-v22.js','chifrecopro-v23.js','chifrecopro-v24.js','chifrecopro-v25.js','chifrecopro-v26.js','chifrecopro-v27.js','chifrecopro-v28.js','chifrecopro-v29.js','chifrecopro-v31.js','chifrecopro-v32.js','chifrecopro-v33.js','qa-v34.js','chifrecopro-v35.js','chifrecopro-v36.js','chifrecopro-v37.js','chifrecopro-v38.js','chifrecopro-v39.js','chifrecopro-v40.js','chifrecopro-v41.js','chifrecopro-v42.js','chifrecopro-v43.js','chifrecopro-v44.js'];
const injected='<script data-chifrecopro-injected="v44"></script>'+files.map(x=>'<script src="./'+x+'"></script>').join('');
return new Response(t.replace('</body>',injected+'</body>'),{status:r.status,statusText:r.statusText,headers:h});
}
return r;
}
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(fetch(e.request).then(async r=>{const out=await transform(r.clone());const c=out.clone();caches.open(CACHE).then(x=>x.put(e.request,c)).catch(()=>{});return out}).catch(async()=>{const c=await caches.match(e.request);return c?transform(c):c}))});
