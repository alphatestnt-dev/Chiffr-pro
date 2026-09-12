(()=>{
  'use strict';

  // Stabilise et nettoie la page d'accueil sans toucher aux fonctions de chiffrage.
  const fixHomeLayout=()=>{
    if(document.getElementById('ce-home-layout-fix')) return;
    const style=document.createElement('style');
    style.id='ce-home-layout-fix';
    style.textContent=`
      /* Accueil : le visuel sert uniquement de bandeau, les actions sont de vraies cartes HTML. */
      .home{background:#fff!important;overflow:hidden;border-radius:20px!important}
      .home img{display:block!important;width:100%!important;height:190px!important;object-fit:cover!important;object-position:center top!important}
      .home-copy{position:static!important;max-width:none!important;padding:20px 18px 8px!important;background:#fff!important;color:var(--d)!important;text-align:center!important;text-shadow:none!important}
      .home-copy .avenir{font-family:Georgia,serif!important;font-size:clamp(23px,5vw,38px)!important;line-height:1.12!important;font-weight:700!important;color:var(--d)!important}
      .home-copy .eco-title{margin-top:10px!important;padding:7px 14px!important;border-radius:999px!important;background:var(--soft)!important;color:var(--g)!important;font-weight:900!important;text-shadow:none!important}
      .home-links{position:static!important;left:auto!important;right:auto!important;bottom:auto!important;padding:10px 18px 22px!important;background:#fff!important;display:grid!important;grid-template-columns:1fr 1fr!important;gap:12px!important}
      .home-links button{min-height:62px!important;border:0!important;border-radius:16px!important;background:var(--g)!important;color:#fff!important;font-size:17px!important;font-weight:900!important;line-height:1.15!important;box-shadow:0 5px 16px rgba(16,60,44,.16)!important}
      .home-links button:active{transform:translateY(1px)}
      @media(max-width:560px){
        .home img{height:150px!important}
        .home-copy{padding:17px 14px 6px!important}
        .home-copy .avenir{font-size:clamp(21px,6vw,29px)!important}
        .home-copy .eco-title{font-size:13px!important}
        .home-links{grid-template-columns:1fr!important;padding:8px 14px 18px!important;gap:10px!important}
        .home-links button{min-height:54px!important;font-size:16px!important}
      }
    `;
    document.head.appendChild(style);
  };

  const loadRuntime=()=>new Promise(resolve=>{
    if(document.querySelector('script[data-ce-runtime]'))return resolve();
    const s=document.createElement('script');s.src='./runtime-stability.js';s.dataset.ceRuntime='1';s.defer=true;s.onload=resolve;s.onerror=resolve;document.head.appendChild(s);
  });

  const start=async()=>{
    fixHomeLayout();
    await loadRuntime();
    if(!('serviceWorker'in navigator)) return;
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
