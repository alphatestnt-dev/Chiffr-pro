(()=>{
'use strict';
function init(){
 const pro=document.getElementById('pro'); if(!pro||document.getElementById('mode32')) return;
 const firstCard=pro.querySelector('.card'); if(!firstCard) return;
 const box=document.createElement('div'); box.id='mode32'; box.className='card'; box.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap"><div><b>Mode de chiffrage</b><div class="muted">Simple par défaut. Les détails restent disponibles à tout moment.</div></div><button id="detail32" class="primary" type="button">Voir les détails</button></div>';
 firstCard.parentNode.insertBefore(box,firstCard);
 const headings=['🧱 Matériaux / fournitures','🧰 Outils, machines et engins','🗑️ Évacuation et déchets'];
 const advanced=[];
 pro.querySelectorAll('.card').forEach(c=>{const h=c.querySelector('h2');if(h&&headings.some(x=>h.textContent.includes(x.replace(/^\S+\s/,'')))) advanced.push(c)});
 const btn=document.getElementById('detail32'); let open=false;
 const set=()=>{advanced.forEach(c=>c.style.display=open?'':'none');btn.textContent=open?'Masquer les détails':'Voir les détails';};
 btn.addEventListener('click',()=>{open=!open;set();}); set();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
setTimeout(init,500);setTimeout(init,1500);
})();
