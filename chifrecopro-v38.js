/* Chiffr’EcoPro V38 — écologie intégrée et menus allégés */
(()=>{
'use strict';
const euro=v=>new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR'}).format(Math.max(0,Number(v)||0));
function install(){
 if(document.getElementById('cepro-v38'))return;
 const eco=document.getElementById('eco'); if(!eco)return;
 const style=document.createElement('style');style.textContent='.ce38{border:1px solid #cfe2d6;border-radius:14px;padding:15px;margin-top:14px;background:#fff}.ce38grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.ce38range{width:100%;accent-color:#146b4a}.ce38value{font-size:25px;font-weight:900}.ce38sub{color:#64736b;font-size:13px}@media(max-width:600px){.ce38grid{grid-template-columns:1fr}}';document.head.appendChild(style);
 const card=document.createElement('div');card.className='ce38';card.id='cepro-v38';card.innerHTML='<h2>🌱 Réglage écologique</h2><p class="ce38sub">Choisissez le niveau souhaité. Le montant évolue automatiquement avec la surface.</p><div class="ce38grid"><div><label>Surface (m²)</label><input id="ce38m2" type="number" min="0" step="0.01" placeholder="Ex. 500"></div><div><label>Niveau écologique</label><input id="ce38eco" class="ce38range" type="range" min="0" max="100" value="50"><div><span id="ce38level" class="ce38value">Responsable</span></div></div><div><label>Tarif de base écologique (€/m²)</label><input id="ce38base" type="number" min="0" step="0.01" value="1.50"></div><div><label>Prix écologique calculé</label><div id="ce38total" class="ce38value">0,00 €</div></div></div><p id="ce38detail" class="ce38sub"></p>';
 eco.appendChild(card);
 const update=()=>{const m=Math.max(0,Number(document.getElementById('ce38m2').value)||0),b=Math.max(0,Number(document.getElementById('ce38base').value)||0),x=Number(document.getElementById('ce38eco').value)||0;const factor=.8+x/100*.7,total=m*b*factor;const level=x<25?'Économique':x<50?'Éco léger':x<75?'Responsable':'Très écologique';document.getElementById('ce38level').textContent=level;document.getElementById('ce38total').textContent=euro(total);document.getElementById('ce38detail').textContent=m?`${m.toLocaleString('fr-FR')} m² × ${euro(b)}/m² × coefficient ${factor.toFixed(2)} = ${euro(total)}. Le réglage reste modifiable.`:'Renseignez la surface pour obtenir le montant automatiquement.'};
 ['ce38m2','ce38eco','ce38base'].forEach(id=>{document.getElementById(id).addEventListener('input',update)});update();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
