/* Chiffr’EcoPro V40 — parcours particulier → demande de devis → import PRO */
(function(){
'use strict';
const KEY='ce_quote_request';
const $=id=>document.getElementById(id);
const val=id=>($(id)?.value||'').trim();
function saveRequest(){
 const r={branch:val('pf'),sub:val('ps'),state:val('pe'),qty:val('pq'),unit:val('pu'),difficulty:val('pd'),tool:val('pt'),range:val('range'),detail:val('detail'),createdAt:new Date().toISOString()};
 localStorage.setItem(KEY,JSON.stringify(r)); return r;
}
function loadRequest(){try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){return null}}
function banner(){
 const page=$('particulier'); if(!page||$('ce-v40-request'))return;
 const box=document.createElement('div');box.id='ce-v40-request';box.className='card eco hide';
 box.innerHTML='<h2>📨 Demande de devis professionnel</h2><p>Après votre estimation, vous pouvez transmettre les informations de votre projet au professionnel. L’estimation reste indicative et ne vaut pas devis.</p><div class="actions"><button class="primary" id="ce-v40-send">Demander un devis</button></div>';
 page.appendChild(box);
 const r=loadRequest(); if(r){box.classList.remove('hide')}
 $('ce-v40-send').onclick=()=>{saveRequest();go('devis');setTimeout(renderDevis,80)};
}
function patchEstimate(){
 if(typeof window.estimate!=='function'||window.estimate.__v40)return;
 const original=window.estimate;
 function wrapped(){const out=original.apply(this,arguments);setTimeout(()=>{saveRequest();const b=$('ce-v40-request');if(b)b.classList.remove('hide')},50);return out}
 wrapped.__v40=true;window.estimate=wrapped;
}
function renderDevis(){
 const page=$('devis');if(!page)return;
 let card=$('ce-v40-devis');if(!card){card=document.createElement('div');card.id='ce-v40-devis';card.className='card';page.prepend(card)}
 const r=loadRequest();
 if(!r){card.innerHTML='<h1>Demande de devis</h1><p class="muted">Aucune demande particulière enregistrée.</p>';return}
 card.innerHTML='<h1>📨 Demande de devis</h1><div class="box"><p><b>Projet :</b> '+esc(r.branch)+' → '+esc(r.sub)+'</p><p><b>État :</b> '+esc(r.state)+' · <b>Quantité :</b> '+esc(r.qty)+' '+esc(r.unit)+'</p><p><b>Difficulté :</b> '+esc(r.difficulty)+' · <b>Équipement :</b> '+esc(r.tool)+'</p><p><b>Fourchette indicative :</b> '+esc(r.range)+'</p><p class="muted">'+esc(r.detail)+'</p></div><div class="actions"><button class="primary" id="ce-v40-import">👷 Importer dans le chiffrage PRO</button><button id="ce-v40-clear">Effacer la demande</button></div>';
 $('ce-v40-import').onclick=()=>importPro(r);$('ce-v40-clear').onclick=()=>{localStorage.removeItem(KEY);renderDevis()};
}
function importPro(r){
 go('pro');setTimeout(()=>{
  set('client','Demande particulier');set('metier',mapMetier(r.branch));
  if(typeof profession==='function')profession();set('prest',r.sub);set('etat',r.state);set('qty',r.qty);set('unit',r.unit);
  const note='Demande particulier — difficulté: '+r.difficulty+(r.tool&&r.tool!=='Aucun'?' — équipement: '+r.tool:'');
  let w=$('warn');if(w)w.textContent=note;
 },100);
}
function mapMetier(b){const m={'Maçonnerie / ciment':'Maçonnerie / gros œuvre','Terrassement / extérieur':'Terrassement / extérieur'};return m[b]||b||'Autre'}
function set(id,v){const e=$(id);if(e&&v!=null)e.value=v}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function patchQuote(){
 if(typeof window.makeQuote!=='function'||window.makeQuote.__v40)return;
 const original=window.makeQuote;function wrapped(){
  const result=original.apply(this,arguments);setTimeout(()=>{const ht=val('ht'),ttc=val('ttc');if((!ht||!ttc)&&typeof window.calc==='function')window.calc()},30);return result}
 wrapped.__v40=true;window.makeQuote=wrapped;
}
function init(){
 banner();patchEstimate();patchQuote();
 if(location.hash==='#devis')renderDevis();
 const oldGo=window.go;if(typeof oldGo==='function'&&!oldGo.__v40){function g(p){const r=oldGo.apply(this,arguments);if(p==='devis')setTimeout(renderDevis,60);return r}g.__v40=true;window.go=g}
 const title=document.querySelector('title');if(title)title.textContent='Chiffr’EcoPro — V40';
 document.querySelectorAll('#accueil .pill').forEach(x=>x.textContent='VERSION 40');
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
