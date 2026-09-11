/* Chiffr’EcoPro V37 — modes Simple / Complete / Professionnel */
(()=>{
'use strict';
function install(){
 if(document.getElementById('cepro-v37'))return;
 const home=document.getElementById('home')||document.querySelector('main'); if(!home)return;
 const card=document.createElement('div'); card.className='card'; card.id='cepro-v37';
 card.innerHTML='<h2>⚙️ Niveau de chiffrage</h2><p class="muted">Même moteur, interface adaptée à votre besoin.</p><div id="cepro-v37-modes" style="display:grid;gap:9px"></div>';
 home.appendChild(card);
 const box=document.getElementById('cepro-v37-modes');
 [['simple','🟢 Simple','Rapide : quelques questions et une estimation claire.'],['complete','🔵 Complète','Tous les postes : main-d’œuvre, matériaux, machines, évacuation, frais, marge et TVA.'],['pro','🟣 Professionnelle','Réglages et informations avancées pour les professionnels.']].forEach(m=>{
  const b=document.createElement('button');b.type='button';b.className='btn';b.innerHTML='<strong>'+m[1]+'</strong><br><small>'+m[2]+'</small>';
  b.onclick=()=>{localStorage.setItem('cepro_mode',m[0]);document.body.dataset.ceproMode=m[0];document.querySelectorAll('[data-cepro-mode]').forEach(x=>x.hidden=(x.dataset.ceproMode!==m[0]));};box.appendChild(b);
 });
 const saved=localStorage.getItem('cepro_mode')||'simple';document.body.dataset.ceproMode=saved;
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
