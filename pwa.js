(()=>{
  'use strict';

  // Accueil : reprendre fidèlement la maquette de référence.
  const fixHomeLayout=()=>{
    if(document.getElementById('ce-home-layout-fix')) return;
    const style=document.createElement('style');
    style.id='ce-home-layout-fix';
    style.textContent=`
      .home{position:relative!important;overflow:hidden!important;background:#fff!important;border-radius:20px!important}
      .home img{display:block!important;width:100%!important;height:auto!important;object-fit:cover!important;object-position:center center!important}
      .home-copy{position:absolute!important;inset:0!important;max-width:none!important;padding:0!important;background:transparent!important;color:#fff!important;text-shadow:0 2px 10px rgba(0,0,0,.45)!important;text-align:left!important;pointer-events:none!important}
      .home-copy .avenir{position:absolute!important;left:5%!important;right:5%!important;top:4%!important;font-family:Georgia,serif!important;font-size:clamp(23px,5vw,38px)!important;line-height:1.12!important;font-weight:700!important;color:#fff!important}
      .home-copy .eco-title{position:absolute!important;left:5%!important;bottom:5%!important;margin:0!important;padding:7px 14px!important;border-radius:999px!important;background:rgba(255,255,255,.94)!important;color:var(--g)!important;font-weight:900!important;text-shadow:none!important}
      .home-links{position:absolute!important;left:3%!important;right:3%!important;bottom:8%!important;padding:0!important;background:transparent!important;display:grid!important;grid-template-columns:1fr 1fr!important;gap:3%!important}
      .home-links button{min-height:62px!important;border:0!important;border-radius:16px!important;background:rgba(255,255,255,.94)!important;color:var(--d)!important;font-size:17px!important;font-weight:900!important;line-height:1.15!important;cursor:pointer!important;box-shadow:0 4px 18px rgba(0,0,0,.14)!important}
      /* La carte écologique séparée ne fait pas partie de la maquette d'accueil. */
      #accueil>.home+.card.eco{display:none!important}
      @media(max-width:560px){
        .home-copy .avenir{top:4%!important;left:5%!important;right:5%!important;font-size:clamp(21px,6vw,29px)!important}
        .home-copy .eco-title{left:5%!important;bottom:5%!important;font-size:13px!important;padding:6px 11px!important}
        .home-links{left:4%!important;right:4%!important;bottom:8%!important;grid-template-columns:1fr 1fr!important;gap:3%!important}
        .home-links button{min-height:54px!important;font-size:14px!important;border-radius:12px!important}
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
