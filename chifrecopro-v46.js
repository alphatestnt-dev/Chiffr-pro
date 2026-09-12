/* Chiffr’EcoPro V46 — fiabilisation du parcours PRO */
(()=>{
'use strict';
const $=id=>document.getElementById(id);
const n=id=>Math.max(0,Number($(id)?.value)||0);
function check(){
 const issues=[];
 if(n('qty')<=0)issues.push('La quantité doit être supérieure à 0.');
 if(n('hours')>0&&n('rate')<=0)issues.push('Le taux horaire doit être supérieur à 0 si des heures sont saisies.');
 if(n('margin')>=99)issues.push('La marge cible doit rester inférieure à 99 %.');
 if(n('vat')>100)issues.push('Le taux de TVA semble incorrect.');
 const m=$('cepro-v46-msg');if(!m)return !issues.length;
 m.innerHTML=issues.length?issues.map(x=>'⚠️ '+x).join('<br>'):'✅ Données principales cohérentes. Le calcul peut être contrôlé avant émission du devis.';
 return !issues.length;
}
function install(){
 if($('cepro-v46'))return;
 const pro=$('pro');if(!pro)return;
 const card=document.createElement('div');card.id='cepro-v46';card.className='card';
 card.innerHTML='<h2>✅ Contrôle V46</h2><div id="cepro-v46-msg" class="eco" style="padding:11px;border-radius:9px"></div>';
 const anchor=pro.querySelector('#res');anchor?anchor.before(card):pro.appendChild(card);
 ['qty','hours','rate','margin','vat','travel','other'].forEach(id=>{const e=$(id);if(e){e.addEventListener('input',check);e.addEventListener('change',check)}});
 check();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
