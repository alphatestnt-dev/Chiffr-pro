(()=>{
'use strict';
/* Chiffr’EcoPro V32 — couche UX uniquement. Ne remplace aucun module V1→V31. */
function init(){
  if(document.getElementById('v32Style'))return;
  const st=document.createElement('style');st.id='v32Style';st.textContent=`
    .v32-toggle{display:flex;align-items:center;justify-content:space-between;gap:12px;background:#e8f4ed;border:1px solid #bddfc8;border-radius:12px;padding:12px 14px;margin-bottom:12px}
    .v32-toggle button{border:1px solid #146b4a;background:#fff;color:#146b4a;border-radius:9px;padding:9px 12px;font-weight:800;cursor:pointer}
    .v32-detail{display:none}
    .v32-detail.v32-open{display:block}
    .v32-summary{font-size:13px;color:#64736b;margin:4px 0 0}
    @media(max-width:560px){.v32-toggle{align-items:flex-start;flex-direction:column}.v32-toggle button{width:100%}}
  `;document.head.appendChild(st);

  const pro=document.getElementById('pro');
  if(pro&&!document.getElementById('v32ProToggle')){
    const cards=[...pro.querySelectorAll(':scope > .card')];
    const targets=cards.filter(c=>/Matériaux|Outils, machines|Évacuation et déchets/i.test(c.textContent));
    if(targets.length){
      const bar=document.createElement('div');bar.id='v32ProToggle';bar.className='v32-toggle';
      bar.innerHTML='<div><b>Mode simple</b><div class="v32-summary">Les informations essentielles restent visibles. Affichez les détails seulement si nécessaire.</div></div><button type="button" aria-expanded="false">Voir les détails</button>';
      const btn=bar.querySelector('button');
      targets.forEach(c=>{c.classList.add('v32-detail');});
      targets[0].parentNode.insertBefore(bar,targets[0]);
      btn.onclick=()=>{const open=targets[0].classList.toggle('v32-open');targets.slice(1).forEach(c=>c.classList.toggle('v32-open',open));btn.textContent=open?'Masquer les détails':'Voir les détails';btn.setAttribute('aria-expanded',String(open));};
    }
  }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
