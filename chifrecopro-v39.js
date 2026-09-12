/* Chiffr’EcoPro V39 — devis final imprimable + identité d’accueil */
(()=>{
'use strict';
const $=id=>document.getElementById(id);
const euro=n=>new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR'}).format(Number(n)||0);
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
function install(){
 if($('cepro-v39'))return;
 const home=$('accueil'); if(!home)return;
 const style=document.createElement('style');style.textContent=`#cepro-v39 .v39brand{text-align:center;padding:8px 0 18px}.v39brand .line1{font-size:clamp(22px,4vw,34px);font-weight:900;line-height:1.1}.v39brand .line2{font-size:clamp(17px,3vw,23px);font-weight:800;margin-top:5px}.v39brand .with{font-size:14px;letter-spacing:.12em;text-transform:uppercase;color:#64736b;margin:9px 0 3px}.v39brand .name{font-size:clamp(24px,5vw,38px);font-weight:950;color:#146b4a}.v39quote{display:flex;gap:8px;flex-wrap:wrap;align-items:center}.v39quote button{border:1px solid #cbd8d1;border-radius:9px;background:#fff;padding:10px 13px;font-weight:800}.v39modal{position:fixed;inset:0;background:#0008;z-index:50;display:flex;align-items:flex-start;justify-content:center;padding:18px;overflow:auto}.v39sheet{background:#fff;width:min(900px,100%);border-radius:14px;padding:24px;box-shadow:0 15px 60px #0004}.v39sheet h1{text-align:center}.v39sum{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:15px 0}.v39sum>div{border:1px solid #d8e3dd;border-radius:10px;padding:12px}.v39sum b{font-size:20px}@media(max-width:600px){.v39sum{grid-template-columns:1fr}.v39modal{padding:7px}}@media print{body>*:not(.v39modal){display:none!important}.v39modal{position:static;background:#fff;padding:0}.v39sheet{box-shadow:none;border:0;width:100%}.v39close{display:none!important}}`;
 document.head.appendChild(style);
 const brand=document.createElement('div');brand.className='v39brand';brand.innerHTML='<div class="line1">Parce que le Monde a Besoin d’un Avenir</div><div class="line2">Pensez Eco Logique</div><div class="with">Avec</div><div class="name">Chifr’EcoPro</div>';
 const first=home.querySelector('.card'); if(first)first.insertBefore(brand,first.firstChild);
 const card=document.createElement('div');card.className='card';card.id='cepro-v39';card.innerHTML='<h2>📄 Devis final</h2><p class="muted">Préparez un devis propre à imprimer ou à enregistrer en PDF depuis votre navigateur.</p><div class="v39quote"><button id="v39quote" class="primary">Prévisualiser le devis</button><span class="muted">Le contenu reprend les informations et le dernier calcul saisi.</span></div>';
 home.appendChild(card);
 $('v39quote').onclick=preview;
}
function preview(){
 const ent=$('entreprise')?.value||'Entreprise';const num=$('num')?.value||'';const client=$('client')?.value||'Client';const metier=$('metier')?.value||'';const prest=$('prest')?.value||'';const qty=$('qty')?.value||0;const unit=$('unit')?.value||'';const hours=$('hours')?.value||0;const rate=$('rate')?.value||0;const mt=$('mt')?.textContent||'0 €';const tt=$('tt')?.textContent||'0 €';const wc=$('wcost')?.textContent||'0 €';const ht=$('ht')?.textContent||'—';const ttc=$('ttc')?.textContent||'—';
 const old=$('cepro-v39-modal');if(old)old.remove();const m=document.createElement('div');m.className='v39modal';m.id='cepro-v39-modal';m.innerHTML='<div class="v39sheet"><div class="v39quote"><button class="v39close" id="v39close">✕ Fermer</button><button class="primary v39close" id="v39print">🖨️ Imprimer / PDF</button></div><h1>Chifr’EcoPro</h1><p style="text-align:center">Chiffrage responsable · Devis indicatif à valider</p><hr><p><b>'+esc(ent)+'</b><br>Devis : '+esc(num)+'<br>Client : '+esc(client)+'</p><h2>Prestation</h2><p><b>'+esc(metier)+'</b> — '+esc(prest)+'<br>Quantité : '+esc(qty+' '+unit)+' · Main-d’œuvre : '+esc(hours)+' h × '+esc(rate)+' €</p><div class="v39sum"><div>Matériaux<br><b>'+esc(mt)+'</b></div><div>Machines<br><b>'+esc(tt)+'</b></div><div>Évacuation<br><b>'+esc(wc)+'</b></div><div>Prix HT<br><b>'+esc(ht)+'</b></div><div>Prix TTC<br><b>'+esc(ttc)+'</b></div><div>Statut<br><b>À valider</b></div></div><p class="muted">Les options écologiques (tri, réemploi, broyage, optimisation) restent des choix. Les prix d’évacuation et orientations de filière sont indicatifs et doivent être vérifiés selon le lieu et les conditions applicables.</p></div>';
 document.body.appendChild(m);$('v39close').onclick=()=>m.remove();$('v39print').onclick=()=>window.print();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
