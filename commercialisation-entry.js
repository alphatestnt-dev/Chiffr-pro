(function(){
  'use strict';
  function init(){
    if(!window.ccCommercialisation||!document.querySelector('nav')) return;
    if(!document.getElementById('ccNavOffers')){
      const b=document.createElement('button');b.id='ccNavOffers';b.type='button';b.textContent='Nos offres';
      b.addEventListener('click',()=>window.ccCommercialisation.open('offers'));document.querySelector('nav').appendChild(b);
    }
    if(!document.getElementById('ccNavSubscription')){
      const b=document.createElement('button');b.id='ccNavSubscription';b.type='button';b.textContent='Mon abonnement';
      b.addEventListener('click',()=>window.ccCommercialisation.open('subscription'));document.querySelector('nav').appendChild(b);
    }
    installEvaluationGate();
    const p=new URLSearchParams(location.search);
    if(p.get('cc_payment')==='success') window.ccCommercialisation.open('success');
  }
  async function consume(){
    try{return {allowed:true,data:await window.ccCommercialisation.api('/consume-evaluation',{method:'POST',body:'{}'})};}
    catch(e){window.ccCommercialisation.open('offers');return {allowed:false,error:e};}
  }
  function installEvaluationGate(){
    document.addEventListener('click',async e=>{
      const b=e.target.closest('button');
      if(!b||b.dataset.ccGate==='1')return;
      if(!b.closest('#particulier'))return;
      const action=b.getAttribute('onclick')||'';
      if(!/\bestimate\s*\(\)/.test(action))return;
      b.dataset.ccGate='1';e.preventDefault();e.stopImmediatePropagation();
      const r=await consume();b.dataset.ccGate='0';
      if(!r.allowed)return;
      try{new Function(action).call(b);}catch(err){console.error(err);}
    },true);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();