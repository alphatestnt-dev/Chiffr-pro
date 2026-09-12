/* Chiffr’EcoPro V45 — accueil officiel : identité + message écologique */
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
 document.body.classList.toggle('ce45-landing',home);
}
function exitHome(){setChrome(false)}
window.ceHomeExit=exitHome;
function install(){
 if(document.getElementById('ce-v45-marker'))return;
 const marker=document.createElement('meta');marker.id='ce-v45-marker';document.head.appendChild(marker);
 const title=document.querySelector('title');if(title)title.textContent='Chiffr’EcoPro';
 const home=document.getElementById('accueil');if(!home)return;
 home.classList.add('ce-v45-home');
 home.innerHTML=`<div class="ce45-hero-wrap">
  <img class="ce45-hero" src="${IMAGE}" alt="Chiffr’EcoPro — Construisons aujourd’hui le monde plus propre de demain">
  <div class="ce45-message" aria-label="Message écologique">
   <div class="ce45-avenir">Parce que le Monde a Besoin d’un Avenir</div>
   <div class="ce45-eco">Pensez Éco Logique</div>
  </div>
  <button class="ce45-hit ce45-pro" type="button" aria-label="Espace Professionnel" onclick="ceHomeExit();go('pro')"></button>
  <button class="ce45-hit ce45-part" type="button" aria-label="Espace Particulier" onclick="ceHomeExit();go('particulier')"></button>
 </div>`;
 const style=document.createElement('style');style.id='ce-v45-style';style.textContent=`
html,body{margin:0;padding:0}
body.ce45-landing{background:#fff}
body.ce45-landing #accueil{padding:0!important;margin:0!important;min-height:0!important;background:#fff!important}
.ce45-hero-wrap{position:relative;width:100%;max-width:1280px;margin:0 auto;line-height:0;overflow:hidden}
.ce45-hero{display:block;width:100%;height:auto;margin:0;padding:0;border:0}
.ce45-message{position:absolute;left:4.2%;top:4.2%;z-index:4;line-height:1.12;text-align:left;max-width:43%;text-shadow:0 2px 10px rgba(0,0,0,.28)}
.ce45-avenir{font-family:Georgia,'Times New Roman',serif;font-size:clamp(18px,2.15vw,34px);font-weight:700;letter-spacing:.01em;color:#fff}
.ce45-eco{display:inline-block;margin-top:9px;padding:7px 13px;border-radius:999px;background:rgba(255,255,255,.9);color:#146b4a;font-family:system-ui,-apple-system,'Segoe UI',Arial,sans-serif;font-size:clamp(13px,1.25vw,19px);font-weight:900;letter-spacing:.02em;text-shadow:none;box-shadow:0 4px 16px rgba(0,0,0,.12)}
.ce45-hit{position:absolute;border:0;background:transparent;padding:0;margin:0;cursor:pointer;z-index:5;line-height:normal}
.ce45-pro{left:3%;top:67.2%;width:40.5%;height:9%}
.ce45-part{left:44%;top:67.2%;width:41%;height:9%}
.ce45-hit:focus-visible{outline:3px solid #146b4a;outline-offset:-3px;border-radius:18px}
@media(max-width:650px){
 .ce45-message{left:4.5%;top:3.5%;max-width:76%}
 .ce45-avenir{font-size:clamp(16px,4.5vw,25px)}
 .ce45-eco{margin-top:6px;padding:5px 10px;font-size:clamp(11px,3.3vw,16px)}
 .ce45-pro{left:3%;top:67%;width:41%;height:9.2%}
 .ce45-part{left:44%;top:67%;width:42%;height:9.2%}
}
`;
 document.head.appendChild(style);
 cleanupNotices();
 setChrome(true);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
