/* Chiffr’EcoPro V44 — accueil visuel officiel fourni par l’utilisateur */
(function(){
'use strict';
const IMAGE='./hero-home-ecopro.webp';
function cleanupNotices(){
 const bad=/Chiffr.?EcoPro est prêt pour une utilisation mobile\.?/i;
 document.querySelectorAll('body *').forEach(el=>{
  if(el.children.length===0 && bad.test((el.textContent||'').trim())){
   const p=el.parentElement;
   if(p && p!==document.body) p.remove(); else el.remove();
  }
 });
 document.querySelectorAll('#ceInstall,.ceInstall,[data-mobile-ready],.mobile-ready-banner').forEach(x=>x.remove());
}
function setChrome(home){
 const header=document.querySelector('header');
 const nav=document.querySelector('nav');
 if(header) header.style.display=home?'none':'';
 if(nav) nav.style.display=home?'none':'';
 document.body.classList.toggle('ce44-landing',home);
}
function exitHome(){ setChrome(false); }
window.ceHomeExit=exitHome;
function install(){
 if(document.getElementById('ce-v44-marker'))return;
 const marker=document.createElement('meta');marker.id='ce-v44-marker';document.head.appendChild(marker);
 const title=document.querySelector('title');if(title)title.textContent='Chiffr’EcoPro';
 const home=document.getElementById('accueil');
 if(!home)return;
 home.classList.add('ce-v44-home');
 home.innerHTML=`<div class="ce44-hero-wrap">
  <img class="ce44-hero" src="${IMAGE}" alt="Chiffr’EcoPro — Construisons aujourd’hui le monde plus propre de demain">
  <button class="ce44-hit ce44-pro" type="button" aria-label="Espace Professionnel" onclick="ceHomeExit();go('pro')"></button>
  <button class="ce44-hit ce44-part" type="button" aria-label="Espace Particulier" onclick="ceHomeExit();go('particulier')"></button>
 </div>`;
 const style=document.createElement('style');style.id='ce-v44-style';style.textContent=`
html,body{margin:0;padding:0}
body.ce44-landing{background:#fff}
body.ce44-landing #accueil{padding:0!important;margin:0!important;min-height:0!important;background:#fff!important}
.ce44-hero-wrap{position:relative;width:100%;max-width:1280px;margin:0 auto;line-height:0;overflow:hidden}
.ce44-hero{display:block;width:100%;height:auto;margin:0;padding:0;border:0}
.ce44-hit{position:absolute;border:0;background:transparent;padding:0;margin:0;cursor:pointer;z-index:5;line-height:normal}
.ce44-pro{left:3.0%;top:67.2%;width:40.5%;height:9.0%}
.ce44-part{left:44.0%;top:67.2%;width:41.0%;height:9.0%}
.ce44-hit:focus-visible{outline:3px solid #146b4a;outline-offset:-3px;border-radius:18px}
@media(max-width:650px){
 .ce44-pro{left:3%;top:67.0%;width:41%;height:9.2%}
 .ce44-part{left:44%;top:67.0%;width:42%;height:9.2%}
}
`;
 document.head.appendChild(style);
 cleanupNotices();
 setChrome(true);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
