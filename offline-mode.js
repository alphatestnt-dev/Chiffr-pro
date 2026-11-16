(()=>{
  'use strict';
  const ID='ce-offline-status';
  const install=()=>{
    if(document.getElementById(ID))return;
    const bar=document.createElement('div');
    bar.id=ID;
    bar.setAttribute('role','status');
    bar.setAttribute('aria-live','polite');
    bar.innerHTML='<span class="ce-offline-dot" aria-hidden="true"></span><span class="ce-offline-label"></span>';
    const style=document.createElement('style');
    style.textContent=`#${ID}{position:fixed;z-index:99999;top:8px;right:10px;display:flex;align-items:center;gap:7px;padding:7px 11px;border-radius:999px;background:#e8f5ed;color:#145b37;border:1px solid #b7dfc6;box-shadow:0 2px 10px #0002;font:600 12px/1.2 system-ui,sans-serif;max-width:calc(100vw - 20px)}#${ID} .ce-offline-dot{width:8px;height:8px;flex:0 0 8px;border-radius:50%;background:#16834b}#${ID}[data-state="offline"]{top:0;left:0;right:0;justify-content:center;border-radius:0 0 12px 12px;background:#fff3df;color:#754600;border-color:#f1d39b;box-shadow:0 2px 12px #0002;padding:10px 14px}#${ID}[data-state="offline"] .ce-offline-dot{background:#d97706}body{scroll-padding-top:48px}@media print{#${ID}{display:none!important}}`;
    document.head.appendChild(style);
    document.body.appendChild(bar);
    const label=bar.querySelector('.ce-offline-label');
    const update=()=>{
      const offline=!navigator.onLine;
      bar.dataset.state=offline?'offline':'online';
      label.textContent=offline?'Hors ligne — vos saisies locales restent sur cet appareil':'En ligne';
      bar.title=offline?'Le compte et les services nécessitant Internet seront indisponibles. Les chiffrages et paramètres enregistrés localement restent accessibles.':'Connexion Internet disponible';
    };
    window.addEventListener('online',update);
    window.addEventListener('offline',update);
    update();
    if(navigator.storage?.persist)navigator.storage.persist().catch(()=>{});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();