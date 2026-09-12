/* Chiffr’EcoPro V46 — fiabilisation du parcours PRO */
(()=>{
'use strict';
const $=id=>document.getElementById(id);
const val=id=>$(id)?$(id).value:'';
const num=id=>Math.max(0,Number(val(id))||0);
const money=n=>Number(n||0).toLocaleString('fr-FR',{style:'currency',currency:'EUR'});
let last46=null;
function calc46(){
 const issues=[];
 const qty=num('qty'), hours=num('hours'), rate=num('rate'), margin=num('margin'), vat=num('vat');
 if(qty<=0)issues.push('La quantité doit être supérieure à 0.');
 if(hours>0&&rate<=0)issues.push('Le taux horaire doit être supérieur à 0 si des heures sont saisies.');
 if(margin>=99)issues.push('La marge cible doit rester inférieure à 99 %.');
 if(vat>100)issues.push('Le taux de TVA semble incorrect.');
 if(issues.length){
  const w=$('warn');if(w)w.textContent=issues.join(' ');
  return null;
 }
 const mats=Array.isArray(window.mats)?window.mats:[];
 const tools=Array.isArray(window.tools)?window.tools:[];
 const wastes=Array.isArray(window.wastes)?window.wastes:[];
 const material=mats.reduce((s,x)=>s+(Number(x.q)||0)*(Number(x.p)||0),0);
 const equipment=tools.reduce((s,x)=>s+(Number(x.c)||0),0);
 const disposal=wastes.reduce((s,x)=>s+(Number(x.c)||0),0);
 const labour=hours*rate;
 const direct=labour+material+equipment+disposal+num('travel')+num('other');
 const ht=margin>=99?direct:direct/(1-margin/100);
 const tva=ht*vat/100,ttc=ht+tva;
 last46={direct,labour,material,equipment,disposal,ht,tva,ttc,margin,vat};
 const set=(id,text)=>{if($(id))$(id).textContent=text};
 set('cost',money(direct));set('me',money(ht-direct));set('mr',(ht?((ht-direct)/ht*100):0).toFixed(1)+' %');set('ht',money(ht));set('ttc',money(ttc));
 if($('res'))$('res').classList.remove('hide');
 if($('warn'))$('warn').textContent='Calcul vérifié : coûts directs, marge cible et TVA pris en compte.';
 if(typeof window.ecoRender==='function')window.ecoRender();
 return last46;
}
function validateBeforeQuote(){
 const d=last46||calc46();
 if(!d)return false;
 if(d.direct<=0){alert('Ajoutez au moins un coût ou une main-d’œuvre avant de préparer le devis.');return false;}
 return true;
}
function install(){
 if($('cepro-v46'))return;
 const pro=$('pro');if(!pro)return;
 const card=document.createElement('div');card.id='cepro-v46';card.className='card';
 card.innerHTML='<h2>✅ Contrôle V46</h2><div id="cepro-v46-msg" class="eco" style="padding:11px;border-radius:9px">Prêt à contrôler le chiffrage.</div>';
 const actions=pro.querySelector('.actions');
 if(actions&&actions.parentElement)actions.parentElement.before(card);else pro.appendChild(card);
 const update=()=>{const d=calc46();const m=$('cepro-v46-msg');if(!m)return;m.innerHTML=d?'✅ Chiffrage cohérent. Coût direct : <b>'+money(d.direct)+'</b> · Prix HT : <b>'+money(d.ht)+'</b> · TTC : <b>'+money(d.ttc)+'</b>':'⚠️ Corrigez les données signalées avant de continuer.'};
 ['qty','hours','rate','margin','vat','travel','other'].forEach(id=>{const e=$(id);if(e){e.addEventListener('input',update);e.addEventListener('change',update)}});
 const oldCalc=window.calc;window.calc=()=>{const d=calc46();if(d&&typeof oldCalc==='function'){try{oldCalc()}catch(e){}}update();return d};
 const oldQuote=window.makeQuote;window.makeQuote=()=>{if(!validateBeforeQuote())return;try{return oldQuote()}catch(e){alert('Impossible de préparer le devis : '+e.message)}};
 update();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
