(()=>{
'use strict';
const $=id=>document.getElementById(id);
const pro=[['pro-chiffrage','Chiffrage'],['pro-materiaux','Matériaux'],['pro-machines','Machines / outils'],['pro-dechets','Déchets / évacuation'],['pro-resultat','Résultat'],['devis','Devis'],['factures-pro','Factures'],['historique','Historique']];
const part=[['part-estimation','Estimation'],['part-dechets','Déchets'],['part-comparaison','Comparaison'],['demande-particulier','Demande de devis'],['factures-particulier','Factures'],['historique','Historique']];
const docs=[['pro','Chiffrage'],['devis','Devis'],['factures-pro','Factures'],['historique','Historique']];
function button(bar,id,label,page){let b=[...bar.querySelectorAll('button')].find(x=>x.textContent.trim()===label);if(!b)b=document.createElement('button');b.type='button';b.textContent=label;b.dataset.ceBridge=id;b.onclick=()=>window.go?.(id);bar.appendChild(b)}
function repair(id,items){const page=$(id);if(!page)return;let bar=page.querySelector('.ce-page-nav');if(!bar){bar=document.createElement('div');bar.className='ce-page-nav';bar.setAttribute('aria-label','Navigation '+id);page.insertBefore(bar,page.firstElementChild)}const wanted=items.map(x=>x[1]);const current=[...bar.querySelectorAll('button')].map(b=>b.textContent.trim());if(current.join('|')===wanted.join('|'))return;bar.innerHTML='';items.forEach(([target,label])=>button(bar,target,label,page))}
function repairAll(){repair('pro',pro);repair('particulier',part);repair('devis',docs);repair('historique',docs)}
function install(){repairAll();if(!window.__ceBridgeTimer)window.__ceBridgeTimer=setInterval(()=>{try{repairAll()}catch(_){}} ,200);window.__ceNavigationBridgeReady=true}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(install,250),{once:true});else setTimeout(install,250);
})();
