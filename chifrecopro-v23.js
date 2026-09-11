(()=>{
  const $=id=>document.getElementById(id);
  const n=id=>Number($(id)?.value)||0;
  const euro=v=>Number(v||0).toLocaleString('fr-FR',{style:'currency',currency:'EUR'});
  function notice(msg,type='notice'){
    let x=$('v23Notice');
    if(!x){x=document.createElement('div');x.id='v23Notice';x.className='notice';x.style.margin='10px 0';const p=$('pro');if(p)p.prepend(x);}
    x.textContent=msg;x.className=type==='danger'?'notice danger':'notice';
  }
  function validate(){
    if(n('qty')<=0){notice('⚠️ Quantité : indiquez une valeur supérieure à 0.','danger');$('qty')?.focus();return false;}
    if(n('hours')<0||n('rate')<0||n('travel')<0||n('other')<0){notice('⚠️ Les coûts et durées ne peuvent pas être négatifs.','danger');return false;}
    const m=n('margin'); if(m>=90){notice('⚠️ Marge cible très élevée : vérifiez le prix final avant d’établir le devis.');}
    return true;
  }
  const oldCalc=window.calc;
  if(oldCalc&&!oldCalc.__v23){
    const f=function(){if(!validate())return;const r=oldCalc.apply(this,arguments);try{localStorage.setItem('chifrecopro_last_calc',JSON.stringify({at:new Date().toISOString(),cost:$('cost')?.textContent||'',ht:$('ht')?.textContent||'',ttc:$('ttc')?.textContent||''}));}catch(e){}return r};
    f.__v23=true;window.calc=f;
  }
  function wire(){
    ['qty','hours','rate','travel','other','margin','vat'].forEach(id=>$(id)?.addEventListener('input',()=>{if($('v23Notice')&&n(id)>=0)$('v23Notice').remove();}));
    const btn=document.querySelector('button[onclick="calc()"]'); if(btn&&!btn.dataset.v23) {btn.dataset.v23='1';}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wire);else wire();
})();