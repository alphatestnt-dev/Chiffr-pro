(()=>{
  'use strict';

  // Accueil : le visuel hero contient déjà le slogan, le logo, les messages
  // et les boutons PRO/Particulier. On ne doit donc rien superposer dessus.
  // Les boutons HTML restent présents uniquement comme zones cliquables.
  const fixHomeLayout=()=>{
    if(document.getElementById('ce-home-layout-fix')) return;
    const style=document.createElement('style');
    style.id='ce-home-layout-fix';
    style.textContent=`
      .home{position:relative!important;overflow:hidden!important;background:#fff!important;border-radius:20px!important;box-shadow:0 3px 18px #17352a14!important}
      .home img{display:block!important;width:100%!important;height:auto!important;min-height:0!important;object-fit:contain!important;object-position:center!important}

      /* Le texte est déjà intégré dans l'image de référence : aucune copie par-dessus. */
      .home-copy{display:none!important}

      /* Zones invisibles exactement au-dessus des deux boutons du visuel. */
      .home-links{position:absolute!important;left:4%!important;right:4%!important;top:67.5%!important;height:10%!important;bottom:auto!important;padding:0!important;margin:0!important;background:transparent!important;display:grid!important;grid-template-columns:1fr 1fr!important;gap:2%!important;z-index:3!important}
      .home-links button{width:100%!important;height:100%!important;min-height:0!important;border:0!important;border-radius:16px!important;background:transparent!important;color:transparent!important;font-size:0!important;line-height:0!important;box-shadow:none!important;cursor:pointer!important;padding:0!important;opacity:.01!important}
      .home-links button:active{transform:none!important}

      @media(max-width:560px){
        .home-links{left:4%!important;right:4%!important;top:67.5%!important;height:10%!important;gap:2%!important}
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
