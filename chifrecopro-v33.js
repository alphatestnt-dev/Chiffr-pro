/* Chiffr’EcoPro V33 — identité d’accueil
   Couche additive : ne réécrit pas V1–V31 ni les calculs existants. */
(function(){
  'use strict';
  function init(){
    const home=document.getElementById('accueil');
    if(!home || home.dataset.chiffrV33==='1') return;
    const card=home.querySelector('.card');
    if(!card) return;

    const oldHero=card.querySelector('.hero');
    if(oldHero) oldHero.remove();

    const brand=document.createElement('div');
    brand.className='cepro-home-brand';
    brand.innerHTML='<div class="cepro-home-slogan">Parceque le Monde a Besoin d’un Avenir</div>'+
      '<div class="cepro-home-eco">Pensez Eco Logique</div>'+
      '<div class="cepro-home-avec">Avec</div>'+
      '<div class="cepro-home-title"><span>chifr’</span> <b>Eco</b><span>Pro</span></div>';

    const pill=card.querySelector('.pill');
    if(pill) pill.remove();
    const intro=card.querySelector('.muted');
    card.insertBefore(brand, card.firstChild);
    if(intro){
      intro.classList.add('cepro-home-intro');
      intro.textContent='Estimer, comparer et réaliser des projets plus justes et plus responsables.';
    }

    const style=document.createElement('style');
    style.dataset.chiffrV33Style='1';
    style.textContent=`
      .cepro-home-brand{text-align:center;padding:4px 8px 18px;margin-bottom:4px}
      .cepro-home-slogan{font-size:clamp(21px,4vw,31px);font-weight:850;line-height:1.15;letter-spacing:-.3px;color:#17231d}
      .cepro-home-eco{margin-top:5px;font-size:clamp(19px,3.5vw,27px);font-weight:800;font-style:italic;color:#146b4a;letter-spacing:.2px}
      .cepro-home-avec{margin-top:9px;font-size:15px;font-weight:700;color:#64736b}
      .cepro-home-title{margin-top:1px;font-size:clamp(37px,8vw,58px);font-weight:950;line-height:1;letter-spacing:-2px;color:#17231d}
      .cepro-home-title b{color:#146b4a}
      .cepro-home-intro{text-align:center;margin:0 0 15px!important}
      @media(max-width:560px){.cepro-home-brand{padding-top:2px;padding-bottom:14px}.cepro-home-slogan{font-size:23px}.cepro-home-eco{font-size:21px}.cepro-home-title{font-size:45px}}
    `;
    if(!document.querySelector('style[data-chiffr-v33-style]')) document.head.appendChild(style);
    home.dataset.chiffrV33='1';
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
