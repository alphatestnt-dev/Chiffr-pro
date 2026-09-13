(()=>{
'use strict';
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const load=(k,d=[])=>{try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(d))}catch(_){return d}};
function render(){
  const host=$('historique');if(!host||$('ceDocumentHistory'))return;
  const wrap=document.createElement('div');wrap.id='ceDocumentHistory';wrap.className='ce-doc-card';
  wrap.innerHTML='<h2>Historique des documents</h2><div class="ce-doc-toolbar"><input id="ce-doc-search" placeholder="Rechercher client, numéro, prestation..."></div><div id="ce-doc-results"></div>';
  host.appendChild(wrap);
  const draw=()=>{const q=load('ce_quotes',[]),i=load('ce_invoices',[]),r=load('ce_requests',[]),t=($('ce-doc-search')?.value||'').toLowerCase();const docs=[...q.map(x=>({type:'Devis',n:x.number,c:x.data?.client,d:x.date,status:x.status,id:x.id})),...i.map(x=>({type:'Facture',n:x.number,c:x.data?.client,d:x.date,status:x.status,id:x.id})),...r.map(x=>({type:'Demande',n:'REQ-'+String(x.id).slice(-6),c:x.project,d:x.date,status:'Enregistrée',id:x.id}))].filter(x=>`${x.type} ${x.n} ${x.c} ${x.d} ${x.status}`.toLowerCase().includes(t));$('ce-doc-results').innerHTML=docs.length?docs.map(x=>`<div class="item"><span><b>${esc(x.type)}</b> · ${esc(x.n)} — ${esc(x.c||'')}<br><small>${esc(x.d)} · ${esc(x.status)}</small></span><span><button data-open-doc="${esc(x.type)}" data-doc-id="${esc(x.id)}">Ouvrir</button><button data-del-doc="${esc(x.type)}" data-doc-id="${esc(x.id)}">×</button></span></div>`).join(''):'<p class="muted">Aucun document trouvé.</p>'};
  $('ce-doc-search').oninput=draw;draw();
  wrap.addEventListener('click',e=>{const b=e.target.closest('button[data-open-doc],button[data-del-doc]');if(!b)return;const type=b.dataset.openDoc||b.dataset.delDoc,id=b.dataset.docId;if(b.dataset.delDoc){if(!confirm('Supprimer ce document ?'))return;const key=type==='Devis'?'ce_quotes':type==='Facture'?'ce_invoices':'ce_requests';save(key,load(key,[]).filter(x=>x.id!==id));draw();return}if(type==='Devis')window.go?.('devis');else if(type==='Facture')window.go?.('factures-pro');else window.go?.('demande-particulier')});
}
const save=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
function refresh(){const host=$('historique');if(!host)return;const old=$('ceDocumentHistory');if(old)old.remove();render()}
const originalGo=window.go;window.go=(id)=>{const r=originalGo?.(id);if(id==='historique')setTimeout(refresh,0);return r};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(render,250),{once:true});else setTimeout(render,250);
})();
