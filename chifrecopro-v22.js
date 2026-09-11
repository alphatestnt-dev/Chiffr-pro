(()=>{
  const $=id=>document.getElementById(id);
  const money=n=>Number(n||0).toLocaleString('fr-FR',{style:'currency',currency:'EUR'});
  function addCard(){
    const r=$('res'); if(!r||$('analysisBox')) return;
    const d=document.createElement('div'); d.id='analysisBox'; d.className='card eco'; d.innerHTML='<h3>🔎 Analyse Chiffr’EcoPro</h3><div id="analysisText" class="muted"></div><div id="safetyText" class="notice hide"></div>';
    r.appendChild(d);
  }
  function analyse(){
    addCard();
    const box=$('analysisText'), safe=$('safetyText'); if(!box)return;
    const cost=Number(($('cost')?.textContent||'').replace(/[^0-9,-]/g,'').replace(',','.'))||0;
    const ht=Number(($('ht')?.textContent||'').replace(/[^0-9,-]/g,'').replace(',','.'))||0;
    const margin=Number($('margin')?.value||0);
    const hours=Number($('hours')?.value||0), rate=Number($('rate')?.value||0);
    let notes=[];
    if(cost<=0){box.textContent='Calculez d’abord le chantier pour obtenir l’analyse.';return;}
    if(margin>50) notes.push('Marge cible élevée : vérifiez qu’elle reste cohérente avec le marché et le niveau de service.');
    else if(margin>=20) notes.push('Marge cible intermédiaire : pensez à vérifier les frais indirects et les imprévus.');
    else notes.push('Marge cible faible : vérifiez que déplacement, assurance, administratif, usure et imprévus sont bien couverts.');
    if(hours>0&&rate>0) notes.push('Main-d’œuvre : '+hours+' h × '+money(rate)+' = '+money(hours*rate)+'.');
    notes.push('L’analyse est un indicateur d’aide à la décision : elle ne remplace pas un prix de marché local ni un devis professionnel.');
    box.innerHTML=notes.map(x=>'• '+x).join('<br>');
    const tool=$('tn')?.value||'', th=Number($('th')?.value||0);
    if(tool==='Débroussailleuse'&&th>0){
      safe.classList.remove('hide');
      safe.innerHTML='<b>🦺 Prévention débroussailleuse :</b> '+th+' h saisies. La réglementation ne fixe pas un nombre de débroussaillages ; l’exposition au bruit et aux vibrations dépend notamment de la machine et du temps réel d’utilisation. Utilisez les données vibratoires du fabricant pour l’évaluation réglementaire et alternez les tâches.';
    } else safe.classList.add('hide');
  }
  const oldCalc=window.calc;
  if(oldCalc&&!oldCalc.__v22){
    const f=function(){const out=oldCalc.apply(this,arguments);analyse();return out};f.__v22=true;window.calc=f;
  }
  window.resetAll=function(){
    ['entreprise','num','client','qty','hours','rate','travel','other','margin','vat','mn','mq','mp','th','tc','wl','ww','wh','wv'].forEach(id=>{const e=$(id);if(e)e.value=id==='qty'?'1':id==='hours'?'3':id==='rate'?'16':id==='margin'?'30':id==='vat'?'20':''});
    mats=[];tools=[];wastes=[];if(window.matRender)matRender();if(window.toolRender)toolRender();if(window.wasteRender)wasteRender();if($('res'))$('res').classList.add('hide');current=null;addCard();if($('analysisText'))$('analysisText').textContent='Nouveau chiffrage prêt.';
  };
  document.addEventListener('DOMContentLoaded',()=>{addCard();setTimeout(()=>{if($('analysisText'))$('analysisText').textContent='Calculez le chantier pour obtenir une analyse automatique.'},300)});
})();