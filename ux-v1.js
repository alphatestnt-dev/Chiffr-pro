(()=>{
/* Chifr’Eco Pro — UX V1 : simple à l'entrée, complet à la demande. */
const UX='1.0';
function installUX(){
 if(document.getElementById('uxStyle'))return;
 const st=document.createElement('style');st.id='uxStyle';st.textContent=`
 .uxbar{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 16px}.uxbar button{border:1px solid #cbd8d1;background:#fff;border-radius:10px;padding:11px 14px;font-weight:850;cursor:pointer}.uxbar .uxprimary{background:#146b4a;color:#fff;border-color:#146b4a}.uxhint{font-size:13px;color:#64736b;margin-top:6px}.uxstep{display:inline-flex;align-items:center;gap:7px;font-size:12px;font-weight:900;color:#146b4a;margin-bottom:8px}.uxdetails{margin-top:10px;border-top:1px solid #d8e3dd;padding-top:10px}.uxdetails summary{cursor:pointer;font-weight:850}.uxquick{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.uxquick button{min-height:72px;border:1px solid #d8e3dd;background:#fff;border-radius:13px;padding:12px;text-align:left;font-weight:850}.uxquick small{display:block;color:#64736b;font-weight:500;margin-top:4px}@media(max-width:650px){.uxquick{grid-template-columns:1fr}.uxbar button{flex:1 1 45%}}
 `;document.head.appendChild(st);
 const home=document.getElementById('accueil');if(home){const card=home.querySelector('.card');if(card&&!document.getElementById('uxQuick')){const q=document.createElement('div');q.id='uxQuick';q.className='uxquick';q.innerHTML=`<button onclick="go('pro')">👷 Chiffrer un chantier<small>PRO · coût, marge, machines, déchets, devis</small></button><button onclick="go('particulier')">🏠 Estimer mes travaux<small>Particulier · fourchette simple et comparaison</small></button><button onclick="go('eco')">🌱 Rendre le projet plus responsable<small>Tri, réemploi, broyage, transport et score</small></button>`;card.appendChild(q)}}
 const pro=document.getElementById('pro');if(pro&&!document.getElementById('uxProIntro')){const first=pro.firstElementChild;const d=document.createElement('div');d.id='uxProIntro';d.className='uxbar';d.innerHTML=`<button class="uxprimary" onclick="document.getElementById('metier').focus()">1️⃣ Choisir le métier</button><button onclick="document.getElementById('hours').focus()">2️⃣ Temps & main-d’œuvre</button><button onclick="document.getElementById('tn').focus()">3️⃣ Machines automatiques</button><button onclick="document.getElementById('wt').focus()">4️⃣ Déchets / évacuation</button><button class="uxprimary" onclick="calc();makeQuote()">📄 Calculer & préparer le devis</button>`;pro.insertBefore(d,first.nextSibling)}
 // Convert advanced blocks to collapsible areas without hiding their data.
 ['eco','aides','param'].forEach(id=>{const sec=document.getElementById(id);if(sec&&!sec.dataset.ux){sec.dataset.ux='1';}});
 // Clear labels that imply manual machine pricing: catalog calculates it.
 const tc=document.getElementById('tc');if(tc){tc.readOnly=true;tc.placeholder='Calcul automatique';}
 // Add contextual hints once.
 const rate=document.getElementById('rate');if(rate&&!document.getElementById('rateHint')){const h=document.createElement('div');h.id='rateHint';h.className='uxhint';h.textContent='Votre taux de main-d’œuvre reste modifiable : l’outil calcule le reste séparément.';rate.parentNode.appendChild(h)}
 const margin=document.getElementById('margin');if(margin&&!document.getElementById('marginHint')){const h=document.createElement('div');h.id='marginHint';h.className='uxhint';h.textContent='La marge est proposée automatiquement selon le métier, mais vous gardez la main.';margin.parentNode.appendChild(h)}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',installUX);else installUX();
})();
