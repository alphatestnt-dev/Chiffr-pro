/* Chiffr’EcoPro V36 — garde-fous métier additifs */
(()=>{
'use strict';
const n=id=>{const e=document.getElementById(id);return e?Math.max(0,Number(e.value)||0):0};
function install(){
 if(document.getElementById('cepro-v36'))return;
 const pro=document.getElementById('pro'); if(!pro)return;
 const card=document.createElement('div');card.className='card';card.id='cepro-v36';
 card.innerHTML='<h2>🛡️ Contrôle avant devis</h2><p class="muted">Une dernière vérification rapide avant de préparer le devis.</p><div id="cepro-v36-list"></div>';
 pro.appendChild(card);
 const ids=['hours','rate','margin','vat','qty'];ids.forEach(id=>{const e=document.getElementById(id);if(e){e.addEventListener('input',check);e.addEventListener('change',check)}});
 check();
}
function check(){
 const issues=[];
 if(n('qty')<=0)issues.push('La quantité doit être supérieure à 0.');
 if(n('hours')>0&&n('rate')<=0)issues.push('Main-d’œuvre renseignée sans taux horaire.');
 if(n('margin')>=99)issues.push('La marge doit être vérifiée avant validation.');
 if(n('vat')>100)issues.push('Le taux de TVA semble anormal.');
 const waste=[...document.querySelectorAll('#wlst .item')].length;
 const el=document.getElementById('cepro-v36-list');if(!el)return;
 el.innerHTML=issues.length?issues.map(x=>'<div class="notice">⚠️ '+x+'</div>').join(''):'<div class="eco" style="padding:11px;border-radius:9px">✅ Données principales cohérentes. '+(waste?'Évacuation renseignée.':'Aucune évacuation ajoutée — rien n’est ajouté automatiquement.')+'</div>';
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
