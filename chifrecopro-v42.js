/* Chiffr’EcoPro V42 — nettoyage accueil + identité finale mobile */
(function(){
'use strict';
const $=id=>document.getElementById(id);
function install(){
 if($('ce-v42-marker'))return;
 const marker=document.createElement('meta');marker.id='ce-v42-marker';document.head.appendChild(marker);
 const title=document.querySelector('title');if(title)title.textContent='Chiffr’EcoPro';
 const logo=document.querySelector('header .logo');
 if(logo){logo.className='logo';logo.dataset.ceBrand='';logo.textContent='Chiffr’EcoPro'}
 const tag=document.querySelector('header .tag');if(tag)tag.textContent='Chiffrer juste • économiser • valoriser • choisir';
 const oldSlogan=$('ce-v41-slogan');if(oldSlogan)oldSlogan.remove();
 const home=$('accueil');
 if(home){
   home.classList.add('ce-v42-home');
   const first=home.querySelector('.card');
   if(first){
     first.innerHTML='<div class="ce42-message"><div class="ce42-main">Parce que le Monde a Besoin<br>d’un Avenir</div><div class="ce42-eco">Pensez Eco Logique</div><div class="ce42-avec">Avec</div><div class="ce42-brand">Chiffr’EcoPro</div><p class="muted ce42-intro">Un outil unique pour professionnels et particuliers : prix, main-d’œuvre, matériaux, machines, évacuation, comparaison et démarche écologique.</p><div class="grid"><div class="box"><h2>👷 Professionnel</h2><p>Construisez un prix détaillé avec marge et devis imprimable.</p><button class="primary" onclick="go(\'pro\')">Nouveau chiffrage</button></div><div class="box"><h2>🏠 Particulier</h2><p>Estimez vos travaux simplement et préparez une demande de devis.</p><button class="primary" onclick="go(\'particulier\')">Estimer mes travaux</button></div></div></div>';
   }
 }
 // Retire uniquement l’ancien message mobile s’il a été injecté par une version précédente.
 document.querySelectorAll('body *').forEach(el=>{
   if(el.children.length===0 && (el.textContent||'').trim()==='Chiffr’EcoPro est prêt pour une utilisation mobile.'){
     const parent=el.parentElement;
     if(parent && parent.children.length<=3)parent.remove(); else el.remove();
   }
 });
 const style=document.createElement('style');style.id='ce-v42-style';style.textContent=`
header{padding:20px 5%;align-items:center;min-height:96px}
header .logo{font-size:clamp(27px,5vw,38px);font-weight:900;letter-spacing:-.04em;line-height:1}
header .tag{font-size:14px;margin-top:6px;line-height:1.25}
#count{font-size:14px;text-align:right;line-height:1.25}
nav{padding:10px 4%;gap:6px;align-items:center}
nav button{font-size:15px;min-height:42px;cursor:pointer}
.ce-v42-home .card:first-child{border:0;border-radius:26px;padding:30px 24px 26px;background:linear-gradient(145deg,#fff 0%,#f5faf7 65%,#e9f5ee 100%);box-shadow:0 8px 30px rgba(20,107,74,.10);overflow:hidden;position:relative}
.ce-v42-home .card:first-child:before{content:"";position:absolute;right:-90px;top:-110px;width:280px;height:280px;border-radius:50%;background:radial-gradient(circle,#dff1e6 0%,rgba(223,241,230,0) 70%);pointer-events:none}
.ce42-message{position:relative;text-align:center}
.ce42-main{font-size:clamp(30px,6vw,54px);font-weight:900;line-height:1.04;letter-spacing:-.045em;color:#17231d}
.ce42-eco{margin-top:12px;font-size:clamp(19px,3.4vw,27px);font-weight:750;color:#146b4a;letter-spacing:-.02em}
.ce42-avec{margin-top:22px;font-size:15px;text-transform:uppercase;letter-spacing:.22em;color:#64736b;font-weight:700}
.ce42-brand{margin-top:3px;font-size:clamp(31px,6vw,52px);font-weight:950;letter-spacing:-.05em;color:#146b4a;line-height:1.05}
.ce42-intro{max-width:780px;margin:18px auto 22px;font-size:15px;line-height:1.55;text-align:center}
.ce-v42-home .grid{position:relative;text-align:left}
.ce-v42-home .grid .box{border:1px solid #d7e8de;background:rgba(255,255,255,.88);box-shadow:0 4px 16px rgba(16,60,44,.06)}
.ce-v42-home .grid .box h2{margin-top:0}
@media(max-width:650px){
 header{padding:16px 16px;min-height:84px}
 header .logo{font-size:28px}
 header .tag{font-size:12px;max-width:290px}
 #count{font-size:12px}
 nav{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));padding:9px 12px;gap:6px}
 nav button{width:100%;padding:9px 5px;font-size:14px;min-height:44px;border-radius:10px}
 .ce-v42-home .card:first-child{padding:24px 15px 20px;border-radius:20px}
 .ce42-main{font-size:30px}
 .ce42-eco{font-size:20px;margin-top:10px}
 .ce42-avec{margin-top:18px;font-size:13px}
 .ce42-brand{font-size:34px}
 .ce42-intro{font-size:14px;margin:16px auto 20px}
}
`;
 document.head.appendChild(style);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
