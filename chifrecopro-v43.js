/* Chiffr’EcoPro V43 — nettoyage forcé du bandeau mobile + accueil stable */
(function(){
'use strict';
const BAD='Chifr’EcoPro est prêt pour une utilisation mobile.';
function removeMobileBanner(){
 document.querySelectorAll('body *').forEach(el=>{
  const t=(el.textContent||'').trim();
  if(t===BAD || t.includes(BAD)){
   let target=el;
   for(let i=0;i<3&&target.parentElement;i++){
    const p=target.parentElement;
    const cs=getComputedStyle(p);
    if(cs.position==='fixed'||cs.position==='sticky'||p.classList.contains('notice')||p.classList.contains('ceInstall')){target=p;break}
    target=target.parentElement;
   }
   if(target&&target!==document.body)target.remove();
  }
 });
 document.querySelectorAll('#ceInstall,.ceInstall').forEach(x=>x.remove());
}
function install(){
 if(document.getElementById('ce-v43-marker'))return;
 const m=document.createElement('meta');m.id='ce-v43-marker';document.head.appendChild(m);
 const title=document.querySelector('title');if(title)title.textContent='Chiffr’EcoPro';
 removeMobileBanner();
 const home=document.getElementById('accueil');
 if(home){
  const main=home.querySelector('.ce42-main');
  if(main)main.innerHTML='Parce que le Monde a Besoin<br>d’un Avenir';
 }
 const style=document.createElement('style');style.id='ce-v43-style';style.textContent=`
/* V43 : aucun bandeau d’information mobile ne doit masquer le contenu */
.ceInstall,#ceInstall,[data-mobile-ready],.mobile-ready-banner{display:none!important}
.ce42-message{max-width:920px;margin:0 auto}
.ce42-main{font-size:clamp(28px,5.4vw,50px);line-height:1.06;letter-spacing:-.045em}
.ce42-eco{font-size:clamp(19px,3vw,25px);font-weight:750}
.ce42-brand{font-size:clamp(32px,5.4vw,50px)}
@media(max-width:650px){
 .ce42-main{font-size:28px;line-height:1.08;white-space:nowrap}
 .ce42-eco{font-size:20px;margin-top:12px}
 .ce42-avec{margin-top:18px}
 .ce42-brand{font-size:34px}
 .ce42-intro{max-width:330px}
}
`;
 document.head.appendChild(style);
 const observer=new MutationObserver(()=>removeMobileBanner());
 observer.observe(document.body,{childList:true,subtree:true});
 setTimeout(removeMobileBanner,50);setTimeout(removeMobileBanner,300);setTimeout(removeMobileBanner,1000);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
