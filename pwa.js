(()=>{
  'use strict';

  // Accueil : afficher la maquette entière, nette et sans déformation.
  const fixHomeLayout=()=>{
    if(document.getElementById('ce-home-layout-fix')) return;
    const style=document.createElement('style');
    style.id='ce-home-layout-fix';
    style.textContent=`
      html,body{max-width:100%;overflow-x:hidden!important}
      .home{position:relative!important;width:100%!important;max-width:100%!important;overflow:hidden!important;background:#fff!important;border-radius:20px!important}
      .home img{display:block!important;width:100%!important;max-width:100%!important;height:auto!important;min-width:0!important;object-fit:contain!important;object-position:center top!important}

      /* Le texte et les boutons sont déjà dessinés dans l'image de référence. */
      .home-copy{display:none!important}

      /* Les boutons HTML sont uniquement des zones cliquables transparentes. */
      .home-links{position:absolute!important;left:3%!important;right:3%!important;bottom:8%!important;width:auto!important;height:10%!important;padding:0!important;margin:0!important;background:transparent!important;display:grid!important;grid-template-columns:1fr 1fr!important;gap:3%!important;z-index:3!important}
      .home-links button{width:100%!important;height:100%!important;min-height:0!important;border:0!important;border-radius:16px!important;background:transparent!important;color:transparent!important;font-size:0!important;line-height:0!important;box-shadow:none!important;cursor:pointer!important;padding:0!important;opacity:.01!important}
      .home-links button:active{transform:none!important}

      @media(max-width:560px){
        .home img{width:100%!important;max-width:100%!important;height:auto!important}
        .home-links{left:3%!important;right:3%!important;bottom:8%!important;height:10%!important;grid-template-columns:1fr 1fr!important;gap:3%!important}
      }
    `;
    document.head.appendChild(style);
  };

  const loadRuntime=()=>new Promise(resolve=>{
    if(document.querySelector('script[data-ce-runtime]'))return resolve();
    const s=document.createElement('script');
    s.src='./runtime-stability.js';
    s.dataset.ceRuntime='1';
    s.defer=true;
    s.onload=resolve;
    s.onerror=resolve;
    document.head.appendChild(s);
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
