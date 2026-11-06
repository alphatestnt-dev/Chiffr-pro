(()=>{
'use strict';
const $=id=>document.getElementById(id);
function install(){
 const old=document.getElementById('ce-single-home-style');if(!old){
  const s=document.createElement('style');s.id='ce-single-home-style';
  s.textContent=`
  nav[aria-label="Navigation principale"]{display:none!important}
  main{max-width:none!important;margin:0 auto!important;padding:0!important}
  #accueil.page.active{display:block!important}
  #accueil .home{width:100%;height:auto;min-height:0;margin:0!important;border-radius:0!important;box-shadow:none!important;background:#fff}
  #accueil .home img{display:block;width:100%;height:auto;max-height:48svh;object-fit:contain}
  #accueil .home-slogan{margin:0;padding:10px 8px 14px;font-size:clamp(20px,4vw,28px)}
  .home-dashboard{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;padding:12px 16px 24px;max-width:1200px;margin:0 auto}
  .home-dashboard button{display:flex;flex-direction:column;align-items:flex-start;justify-content:center;gap:5px;min-height:112px;padding:14px;border:1px solid #c8ded1;border-radius:15px;background:#f3faf5;color:#103c2c;text-align:left;box-shadow:0 3px 10px #103c2c12;cursor:pointer}
  .home-dashboard button:active{transform:scale(.985);background:#e4f3e9}
  .home-dashboard button span{font-size:25px;line-height:1.2}
  .home-dashboard button b{font-size:15px;line-height:1.2}
  .home-dashboard button small{font-size:12px;line-height:1.3;color:#53675c}
  .ce-home-return{display:block;margin:12px 0 16px;padding:11px 15px;border:0;border-radius:11px;background:#146b4a;color:#fff;font-weight:800;font-size:14px}
  @media(max-width:700px){.home-dashboard{grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;padding:10px 11px 22px}.home-dashboard button{min-height:104px;padding:12px}.home-dashboard button b{font-size:14px}#accueil .home img{max-height:43svh}}
  @media(max-width:360px){.home-dashboard{grid-template-columns:1fr 1fr}.home-dashboard button{min-height:96px}}
  `;
  document.head.appendChild(s);
 }
 const nav=document.querySelector('nav[aria-label="Navigation principale"]');if(nav)nav.style.display='none';
 document.querySelectorAll('main > section.page').forEach(page=>{
  if(page.id==='accueil')return;
  if(!page.querySelector(':scope > .ce-home-return')){
   const b=document.createElement('button');b.type='button';b.className='ce-home-return';b.textContent='← Retour à l’accueil';b.onclick=()=>window.go('accueil');page.insertBefore(b,page.firstChild);
  }
 });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
window.addEventListener('load',install,{once:true});
})();