(()=>{
/* Chifr’Eco&Pro — Baromètre PRO V1 : simple devant, calcul intelligent derrière. */
function installBarometre(){
 if(document.getElementById('ceBarometre'))return;
 const pro=document.getElementById('pro'); if(!pro)return;
 const style=document.createElement('style');style.id='baroStyle';style.textContent='.ceBaro{border:1px solid #d8e3dd;border-radius:14px;padding:14px;margin:12px 0;background:#fff}.ceBaroHead{display:flex;justify-content:space-between;gap:10px;align-items:center}.ceLevel{font-weight:900;border-radius:99px;padding:6px 10px;font-size:12px}.ceBaroGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:10px}.ceBaroGrid div{background:#f3f7f4;border-radius:9px;padding:9px;font-size:13px}.ceBaroWhy{font-size:13px;color:#64736b;margin:8px 0 0}@media(max-width:650px){.ceBaroGrid{grid-template-columns:1fr}}';document.head.appendChild(style);
 const card=document.createElement('div');card.id='ceBarometre';card.className='ceBaro';card.innerHTML='<div class="ceBaroHead"><div><b>📊 Baromètre du chantier PRO</b><div class="ceBaroWhy">Le prix s’ajuste automatiquement selon les conditions du travail, sans bloquer votre tarif.</div></div><span id="ceBaroLevel" class="ceLevel">NORMAL</span></div><div class="ceBaroGrid"><div>Coefficient<br><b id="ceBaroCoef">1,00×</b></div><div>Prix conseillé<br><b id="ceBaroRange">—</b></div><div>Temps analysé<br><b id="ceBaroHours">—</b></div></div><p id="ceBaroWhy" class="ceBaroWhy"></p>';
 const result=document.getElementById('res');pro.insertBefore(card,result||null);
 const num=id=>{const e=document.getElementById(id);return e?Math.max(0,parseFloat(e.value)||0):0};
 const text=id=>{const e=document.getElementById(id);return e?(e.value||e.textContent||'').toLowerCase():''};
 function analyse(){
  const q=num('qty'),h=num('hours'),unit=text('unit'),etat=text('etat'),prest=text('prest'),metier=text('metier');
  let c=1,why=[];
  const d=etat.includes('très')?0.22:etat.includes('mauvais')?0.15:etat.includes('difficile')?0.10:etat.includes('moyen')?0.04:0;
  c+=d;if(d)why.push('état du site');
  if(/difficile|complexe|délicat|accès|hauteur|profondeur|urgence/.test(prest)){c+=0.10;why.push('prestation technique');}
  if(/élagage|abattage|toiture|charpente|terrassement|démolition/.test(metier)){c+=0.08;why.push('métier à contraintes');}
  if(unit==='m³')c+=Math.min(.10,q/100); else if(unit==='m²')c+=Math.min(.08,q/500);
  if(q>0&&q<3)c+=0.08,why.push('petite quantité');
  if(h>8)c+=0.05,why.push('durée importante');
  const waste=document.getElementById('wlst');if(waste&&waste.children.length){c+=0.04;why.push('évacuation');}
  if(document.getElementById('reuse')?.checked||document.getElementById('grind')?.checked||document.getElementById('opt')?.checked)c-=0.03,why.push('optimisation écologique/logistique');
  c=Math.max(.85,Math.min(1.45,c));
  let level=c<.95?'VERT · ÉCONOMIQUE':c<=1.08?'JAUNE · NORMAL':c<=1.22?'ORANGE · DIFFICILE':'ROUGE · TRÈS DIFFICILE';
  const base=num('rate')*h,margin=num('margin')/100;let low=base*c, high=low*1.12;
  if(margin<.999&&h>0){low=low/(1-margin);high=high/(1-margin)}
  document.getElementById('ceBaroCoef').textContent=c.toFixed(2).replace('.',',')+'×';
  document.getElementById('ceBaroLevel').textContent=level;
  document.getElementById('ceBaroHours').textContent=h?h.toFixed(2).replace('.',',')+' h':'—';
  document.getElementById('ceBaroRange').textContent=h?low.toFixed(0)+'–'+high.toFixed(0)+' € HT':'—';
  document.getElementById('ceBaroWhy').textContent=why.length?'Facteurs : '+why.join(' · ')+'.':'Aucun facteur de majoration détecté : base conservée.';
  return c;
 }
 window.ceBarometre=analyse;
 ['metier','prest','etat','qty','unit','hours','rate','margin','wt','wl','ww','wh','wv'].forEach(id=>document.getElementById(id)?.addEventListener('input',analyse));
 ['metier','prest','etat','unit','wt','wmode','sort','reuse','grind','opt'].forEach(id=>document.getElementById(id)?.addEventListener('change',analyse));
 const oldCalc=window.calc;
 if(typeof oldCalc==='function'&&!window.__ceCalcWrapped){window.__ceCalcWrapped=true;window.calc=function(){const coef=analyse();const r=document.getElementById('rate');if(!r||!oldCalc)return;const original=r.value;const base=parseFloat(original)||0;r.value=(base*coef).toFixed(2);try{return oldCalc.apply(this,arguments)}finally{r.value=original}}}
 analyse();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',installBarometre);else installBarometre();
})();
