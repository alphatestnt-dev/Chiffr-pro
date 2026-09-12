/* Chiffr’EcoPro V41 — identité d’accueil + finition mobile */
(function(){
'use strict';
const $=id=>document.getElementById(id);
function install(){
 if($('ce-v41-marker'))return;
 const marker=document.createElement('meta');marker.id='ce-v41-marker';document.head.appendChild(marker);
 const title=document.querySelector('title');if(title)title.textContent='Chiffr’EcoPro — V41';
 const logo=document.querySelector('header .logo');if(logo)logo.textContent='Chiffr’EcoPro';
 const tag=document.querySelector('header .tag');if(tag)tag.textContent='Chiffrer juste • économiser • valoriser • choisir';
 const home=$('accueil');if(!home)return;
 home.classList.add('ce-v41-home');
 const first=home.querySelector('.card');
 if(first){
   const pill=first.querySelector('.pill');if(pill)pill.textContent='Chiffr’EcoPro';
   const hero=first.querySelector('.hero');if(hero)hero.innerHTML='Construisons aujourd’hui<br><span>le monde plus propre de demain</span>';
   const intro=first.querySelector('.muted');if(intro)intro.textContent='Un outil unique pour professionnels et particuliers : prix, main-d’œuvre, matériaux, machines, évacuation, comparaison et démarche écologique.';
 }
 if(!$('ce-v41-slogan')){
   const s=document.createElement('div');s.id='ce-v41-slogan';s.textContent='Pensez ECO Logique';home.appendChild(s);
 }
 const style=document.createElement('style');style.id='ce-v41-style';style.textContent=`
.ce-v41-home .card:first-child{border:0;border-radius:24px;padding:28px 22px;background:linear-gradient(145deg,#ffffff 0%,#f1f8f4 58%,#e6f3eb 100%);box-shadow:0 8px 30px rgba(20,107,74,.10);overflow:hidden;position:relative}
.ce-v41-home .card:first-child:before{content:"";position:absolute;right:-80px;top:-90px;width:240px;height:240px;border-radius:50%;background:radial-gradient(circle,#dff1e6 0%,rgba(223,241,230,0) 70%);pointer-events:none}
.ce-v41-home .card:first-child .pill{background:#e3f2e9;color:#146b4a;font-size:11px;letter-spacing:.08em}
.ce-v41-home .hero{font-size:clamp(30px,5vw,52px);line-height:1.02;letter-spacing:-.035em;position:relative}
.ce-v41-home .hero span{color:#146b4a}
.ce-v41-home .card:first-child>p{max-width:760px;font-size:15px;line-height:1.55}
.ce-v41-home .grid{position:relative}
.ce-v41-home .grid .box{border:1px solid #d7e8de;background:rgba(255,255,255,.84);box-shadow:0 4px 16px rgba(16,60,44,.06)}
#ce-v41-slogan{text-align:center;color:#146b4a;font-size:clamp(15px,2.5vw,20px);font-weight:500;letter-spacing:.04em;margin:8px 0 22px}
@media(max-width:560px){.ce-v41-home .card:first-child{padding:22px 16px;border-radius:18px}.ce-v41-home .hero{font-size:30px}.ce-v41-home .card:first-child>p{font-size:14px}#ce-v41-slogan{margin:5px 0 16px;font-size:15px}}
`;
 document.head.appendChild(style);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
