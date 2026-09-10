(()=>{
/* Chifr’Eco&Pro — UX V1 : simple à l'entrée, complet à la demande. */
const UX='1.3';
function installUX(){
 if(document.getElementById('uxStyle'))return;
 const st=document.createElement('style');st.id='uxStyle';st.textContent='.uxbar{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 16px}.uxbar button{border:1px solid #cbd8d1;background:#fff;border-radius:10px;padding:11px 14px;font-weight:850;cursor:pointer}.uxbar .uxprimary{background:#146b4a;color:#fff;border-color:#146b4a}.uxhint{font-size:13px;color:#64736b;margin-top:6px}.uxquick{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:14px}.uxquick button{min-height:72px;border:1px solid #d8e3dd;background:#fff;border-radius:13px;padding:12px;text-align:left;font-weight:850}.uxquick small{display:block;color:#64736b;font-weight:500;margin-top:4px}.ceBrand{line-height:.88;letter-spacing:-1px;display:flex!important;flex-direction:column;align-items:flex-start}.ceBrandTop{font-size:1em;font-weight:950}.ceBrandBottom{font-size:.72em;font-weight:950;margin-top:5px;letter-spacing:-.5px}@media(max-width:650px){.uxquick{grid-template-columns:1fr}.uxbar button{flex:1 1 45%}.ceBrandTop{font-size:.92em}.ceBrandBottom{font-size:.67em}}';
 document.head.appendChild(st);
 document.title='Chifr’Eco&Pro — V14';
 document.querySelectorAll('.pill').forEach(x=>{if(x.textContent.trim()==='VERSION 6'||x.textContent.trim()==='VERSION 13')x.textContent='VERSION 14'});
 const logo=document.querySelector('header .logo');
 if(logo&&!logo.dataset.ceBrand){
  logo.classList.add('ceBrand');logo.dataset.ceBrand='1';logo.textContent='';
  const top=document.createElement('span');top.className='ceBrandTop';top.textContent='Chifr’';
  const bottom=document.createElement('span');bottom.className='ceBrandBottom';bottom.textContent='Eco&Pro';
  logo.append(top,bottom);
 }
 const home=document.getElementById('accueil');if(home){const card=home.querySelector('.card');if(card&&!document.getElementById('uxQuick')){const q=document.createElement('div');q.id='uxQuick';q.className='uxquick';q.innerHTML='<button onclick="go(\'pro\')">👷 <b>Chiffrer un chantier</b><small>PRO · prix, marge, machines, déchets et devis</small></button><button onclick="go(\'particulier\')">🏠 <b>Estimer mes travaux</b><small>Particulier · estimation simple et comparaison</small></button><button onclick="go(\'eco\')">🌱 <b>Optimiser l’écologie</b><small>Tri, réemploi, broyage, transport et score</small></button>';card.appendChild(q)}}
 const pro=document.getElementById('pro');if(pro&&!document.getElementById('uxProIntro')){const first=pro.firstElementChild;const d=document.createElement('div');d.id='uxProIntro';d.className='uxbar';d.innerHTML='<button class="uxprimary" onclick="document.getElementById(\'metier\').focus()">1️⃣ Métier</button><button onclick="document.getElementById(\'hours\').focus()">2️⃣ Main-d’œuvre</button><button onclick="document.getElementById(\'tn\').focus()">3️⃣ Machines</button><button onclick="document.getElementById(\'wt\').focus()">4️⃣ Évacuation</button><button class="uxprimary" onclick="calc();makeQuote()">📄 Calculer le devis</button>';pro.insertBefore(d,first.nextSibling)}
 const tc=document.getElementById('tc');if(tc){tc.readOnly=true;tc.placeholder='Calcul automatique'}
 const rate=document.getElementById('rate');if(rate&&!document.getElementById('rateHint')){const h=document.createElement('div');h.id='rateHint';h.className='uxhint';h.textContent='Le taux horaire est ajustable. Les machines sont calculées automatiquement.';rate.parentNode.appendChild(h)}
 const margin=document.getElementById('margin');if(margin&&!document.getElementById('marginHint')){const h=document.createElement('div');h.id='marginHint';h.className='uxhint';h.textContent='Marge proposée automatiquement selon le métier · modifiable à tout moment.';margin.parentNode.appendChild(h)}
 const ids=['entreprise','num','client','metier','prest','etat','qty','unit','hours','rate','travel','other','margin','vat'];
 const saveDraft=()=>{try{const o={};ids.forEach(id=>{const e=document.getElementById(id);if(e)o[id]=e.value});localStorage.setItem('ce_draft',JSON.stringify(o))}catch(e){}};
 const loadDraft=()=>{try{const o=JSON.parse(localStorage.getItem('ce_draft')||'{}');if(o.entreprise||o.client||o.num){ids.forEach(id=>{const e=document.getElementById(id);if(e&&o[id]!=null)e.value=o[id]});if(typeof profession==='function')profession()}}catch(e){}};
 loadDraft();ids.forEach(id=>document.getElementById(id)?.addEventListener('input',saveDraft));
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',installUX);else installUX();
})();
