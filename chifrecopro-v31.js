(()=>{
  const euro=n=>new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR'}).format(Number(n)||0);
  const num=id=>{const e=document.getElementById(id);return e?Math.max(0,Number(e.value)||0):0};
  const arr=n=>Array.isArray(window[n])?window[n]:[];
  function totals(){
    const labor=num('hours')*num('rate');
    const materials=arr('mats').reduce((s,x)=>s+(Number(x.q)||0)*(Number(x.p)||0),0);
    const tools=arr('tools').reduce((s,x)=>s+(Number(x.c)||0),0);
    const waste=arr('wastes').reduce((s,x)=>s+(Number(x.cost)||0),0);
    const travel=num('travel'),other=num('other');
    const cost=labor+materials+tools+waste+travel+other;
    const margin=Math.min(99,Math.max(0,num('margin')));
    const ht=margin>=100?cost:cost/(1-margin/100);
    const vat=num('vat');
    const ttc=ht*(1+vat/100);
    const volume=arr('wastes').reduce((s,x)=>s+(Number(x.volume)||0),0);
    return {labor,materials,tools,waste,travel,other,cost,margin,ht,vat,ttc,volume};
  }
  function render(){
    const host=document.querySelector('main'); if(!host)return;
    let box=document.getElementById('ecoUnifiedControl');
    if(!box){box=document.createElement('section');box.id='ecoUnifiedControl';box.className='card';host.appendChild(box)}
    const t=totals();
    const issues=[];
    if(t.margin>=99)issues.push('Marge trop élevée pour un calcul standard.');
    if(t.cost===0)issues.push('Aucun coût détecté : renseignez au moins la main-d’œuvre, un matériau, une machine ou un autre coût.');
    const ok=issues.length===0;
    box.innerHTML='<span class="pill">CONTRÔLE DU CHIFFRAGE</span><h2>🧮 Synthèse fiable</h2>'+
      '<div class="grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px">'+
      [['Main-d’œuvre',t.labor],['Matériaux',t.materials],['Machines',t.tools],['Évacuation',t.waste],['Déplacement',t.travel],['Autres',t.other]].map(x=>'<div class="item"><b>'+x[0]+'</b><br>'+euro(x[1])+'</div>').join('')+'</div>'+ 
      '<p><b>Coût total :</b> '+euro(t.cost)+' · <b>Prix HT :</b> '+euro(t.ht)+' · <b>Prix TTC :</b> '+euro(t.ttc)+'</p>'+ 
      (t.volume>0?'<p>♻️ <b>Volume d’évacuation :</b> '+t.volume.toFixed(2)+' m³</p>':'')+
      '<p class="muted">Marge sélectionnée : '+t.margin+' % · TVA : '+t.vat+' %. Indicateur interne : ce contrôle ne constitue pas une référence officielle de prix de marché.</p>'+
      '<div class="pill">'+(ok?'✅ Chiffrage cohérent avec les données saisies':'⚠️ '+issues.join(' '))+'</div>';
  }
  function hook(){
    const old=window.calc;
    if(typeof old==='function'&&!old.__ecoV31){
      const wrapped=function(){const r=old.apply(this,arguments);setTimeout(render,0);return r};
      wrapped.__ecoV31=true;window.calc=wrapped;
    }
    ['hours','rate','travel','other','margin','vat','qty'].forEach(id=>{const e=document.getElementById(id);if(e){e.addEventListener('input',render);e.addEventListener('change',render)}});
    render();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',hook);else hook();
})();
