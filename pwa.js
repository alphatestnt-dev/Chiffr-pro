(()=>{
  'use strict';

  // Mise en page de l'accueil : conserver le slogan en haut et "Pensez Éco Logique" en bas.
  const fixHomeLayout=()=>{
    if(document.getElementById('ce-home-layout-fix')) return;
    const style=document.createElement('style');
    style.id='ce-home-layout-fix';
    style.textContent=`
      .home{position:relative!important;overflow:hidden!important;background:#fff!important;border-radius:20px!important}
      .home img{display:block!important;width:100%!important;height:auto!important;min-height:360px!important;object-fit:cover!important;object-position:center center!important}
      .home-copy{position:absolute!important;inset:0!important;max-width:none!important;padding:0!important;background:transparent!important;color:#fff!important;text-shadow:0 2px 10px rgba(0,0,0,.45)!important;text-align:left!important;pointer-events:none!important}
      .home-copy .avenir{position:absolute!important;left:5%!important;right:5%!important;top:4%!important;font-family:Georgia,serif!important;font-size:clamp(23px,5vw,38px)!important;line-height:1.12!important;font-weight:700!important;color:#fff!important}
      .home-copy .eco-title{position:absolute!important;left:5%!important;bottom:18%!important;margin:0!important;padding:7px 14px!important;border-radius:999px!important;background:rgba(255,255,255,.94)!important;color:var(--g)!important;font-weight:900!important;text-shadow:none!important}
      .home-links{position:static!important;left:auto!important;right:auto!important;bottom:auto!important;padding:14px 18px 22px!important;background:#fff!important;display:grid!important;grid-template-columns:1fr 1fr!important;gap:12px!important}
      .home-links button{min-height:62px!important;border:0!important;border-radius:16px!important;background:var(--g)!important;color:#fff!important;font-size:17px!important;font-weight:900!important;line-height:1.15!important;cursor:pointer!important;box-shadow:0 5px 16px rgba(16,60,44,.16)!important}
      .home-links button:active{transform:translateY(1px)}
      @media(max-width:560px){
        .home img{min-height:0!important;height:auto!important;object-fit:cover!important}
        .home-copy .avenir{top:4%!important;left:5%!important;right:5%!important;font-size:clamp(21px,6vw,29px)!important}
        .home-copy .eco-title{left:5%!important;bottom:17%!important;font-size:13px!important;padding:6px 11px!important}
        .home-links{grid-template-columns:1fr!important;padding:10px 14px 18px!important;gap:10px!important}
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
