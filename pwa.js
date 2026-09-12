(()=>{
  'use strict';
  if(!('serviceWorker' in navigator)) return;
  const start=async()=>{
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
