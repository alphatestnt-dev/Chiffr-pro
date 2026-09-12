(()=>{
  'use strict';
  const $=id=>document.getElementById(id);
  const eur=v=>Number(v||0).toLocaleString('fr-FR',{style:'currency',currency:'EUR'});
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

  // Stable compatibility boundary for controls that historically lived in older builds.
  // It deliberately does not recreate another application version.
  if(typeof window.pWaste!=='function') window.pWaste=()=>{
    const v=Math.max(0,(+$('pwl')?.value||0)*(+$('pww')?.value||0)*(+$('pwh')?.value||0));
    if($('pvol')) $('pvol').textContent=v.toFixed(2)+' m³';
    const map={'Déchets verts':'verts','Déchets poubelle / résiduels':'residuels','Gravats':'gravats','Bois':'bois','Terre':'terre','Mélangés':'melange'};
    const rates={verts:35,residuels:95,bois:55,gravats:75,terre:45,metaux:25,carton:20,plastique:60,verre:45,dangereux:160,melange:120};
    const t=map[$('pwt')?.value]||'melange', c=v?v*(rates[t]||80)+35:0;
    if($('pcost')) $('pcost').textContent=eur(c)+' indicatif';
  };

  if(typeof window.compareAdd!=='function') window.compareAdd=()=>{
    const n=$('cn')?.value.trim(), p=+$('cp')?.value||0;
    if(!n||p<=0)return;
    const a=JSON.parse(localStorage.getItem('ce_cmp')||'[]');
    a.push({n,p});localStorage.setItem('ce_cmp',JSON.stringify(a));
    if($('cn')) $('cn').value=''; if($('cp')) $('cp').value='';
    window.compareRender?.();
    if(typeof window.go==='function' && $('particulier')) window.go('particulier');
  };
  if(typeof window.compareRender!=='function') window.compareRender=()=>{
    const el=$('cl');if(!el)return;
    const a=JSON.parse(localStorage.getItem('ce_cmp')||'[]');
    el.innerHTML=a.length?a.map((x,i)=>`<div class="item"><span>${esc(x.n)}</span><b>${eur(x.p)}</b><button type="button" data-cmp-del="${i}">×</button></div>`).join(''):'<p class="muted">Aucun devis.</p>';
    el.querySelectorAll('[data-cmp-del]').forEach(b=>b.onclick=()=>{const i=+b.dataset.cmpDel,a=JSON.parse(localStorage.getItem('ce_cmp')||'[]');a.splice(i,1);localStorage.setItem('ce_cmp',JSON.stringify(a));window.compareRender()});
  };

  if(typeof window.exportData!=='function') window.exportData=()=>{
    const payload={application:'Chiffr’EcoPro',version:'stable',date:new Date().toISOString(),chiffrages:JSON.parse(localStorage.getItem('ce_history')||'[]'),parametres:JSON.parse(localStorage.getItem('ce_settings')||'{}'),comparaison:JSON.parse(localStorage.getItem('ce_cmp')||'[]')};
    const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}));a.download='chiffrecopro-export.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  };

  if(typeof window.resetAll!=='function') window.resetAll=()=>{
    document.querySelectorAll('#pro input,#pro select,#pro textarea').forEach(el=>{if(el.type==='checkbox')el.checked=false;else if(el.id==='qty')el.value='1';else if(el.id==='hours')el.value='3';else if(el.id==='rate')el.value='16';else if(el.id==='margin')el.value='35';else if(el.id==='vat')el.value='20';else el.value='';});
    ['ml','tl','wlst'].forEach(id=>{if($(id))$(id).innerHTML='<p class="muted">Aucun élément.</p>'});
    ['mt','tt'].forEach(id=>{if($(id))$(id).textContent='0 €'});
    if($('res'))$('res').classList.add('hide');
    if(typeof window.profession==='function')window.profession();
    if(typeof window.previewWaste==='function')window.previewWaste();
  };

  // Never replace the application with a blank screen: surface unexpected runtime errors visibly.
  const report=(kind,error)=>{
    console.error('[Chiffr’EcoPro]',kind,error);
    if(document.body && !$('ceRuntimeError')){
      const box=document.createElement('div');box.id='ceRuntimeError';box.setAttribute('role','alert');
      box.style.cssText='position:fixed;left:12px;right:12px;bottom:12px;z-index:99999;background:#fff5d6;border:1px solid #d8a72b;color:#3b2d08;border-radius:12px;padding:12px;font:14px system-ui;box-shadow:0 8px 30px rgba(0,0,0,.18)';
      box.innerHTML='<b>Chiffr’EcoPro a rencontré une erreur.</b><br><span>La page reste accessible. Rechargez la page et, si le problème persiste, ouvrez la console pour le diagnostic.</span>';
      document.body.appendChild(box);
    }
  };
  window.addEventListener('error',e=>report('JavaScript',e.error||e.message),true);
  window.addEventListener('unhandledrejection',e=>report('Promise',e.reason),true);

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>window.compareRender?.(),{once:true});else window.compareRender?.();
})();
