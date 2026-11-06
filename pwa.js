(()=>{
'use strict';
const loadScript=(src,attr)=>new Promise(resolve=>{
 if(document.querySelector('script[src="'+src+'"]'))return resolve();
 const s=document.createElement('script');s.src=src;if(attr)Object.assign(s,attr);s.defer=true;s.onload=resolve;s.onerror=resolve;document.head.appendChild(s);
});
const start=async()=>{
 await loadScript('./runtime-stability.js',{'data-ce-runtime':'1'});
 await loadScript('./navigation-v2.js?v=homefix1',{'data-ce-navigation':'1'});
 await loadScript('./documents-v2.js',{'data-ce-documents':'1'});
 await loadScript('./barometre-pro-v1.js',{'data-ce-barometre':'1'});
 await loadScript('./workflow-particulier-v1.js',{'data-ce-part-workflow':'1'});
 await loadScript('./navigation-bridge-v1.js',{'data-ce-navigation-bridge':'1'});
 await loadScript('./document-access-v1.js',{'data-ce-document-access':'1'});
 await loadScript('./document-workflow-access-v2.js',{'data-ce-doc-access-v2':'1'});
 window.__ceNavigationRefresh?.();
 if(!('serviceWorker'in navigator))return;
 try{const reg=await navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'});await reg.update();}
 catch(error){console.warn('Chiffr’EcoPro PWA indisponible :',error);}
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();