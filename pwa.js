(()=>{
  'use strict';
  const loadRuntime=()=>new Promise(resolve=>{
    if(document.querySelector('script[data-ce-runtime]'))return resolve();
    const s=document.createElement('script');s.src='./runtime-stability.js';s.dataset.ceRuntime='1';s.defer=true;s.onload=resolve;s.onerror=resolve;document.head.appendChild(s);
  });
  if(!('serviceWorker'in navigator)){
    loadRuntime();
    return;
  }
  const start=async()=>{
    await loadRuntime();
    try{
      const reg=await navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'});
      await reg.update();
    }catch(error){
      console.warn('Chiffr’EcoPro PWA indisponible :',error);
    }
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
