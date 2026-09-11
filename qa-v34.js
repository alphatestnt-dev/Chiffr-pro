/* Chiffr’EcoPro V34 — diagnostic de test manuel intégré */
(function(){
  'use strict';
  const checks=[
    ['Accueil',()=>!!document.getElementById('accueil')],
    ['Espace PRO',()=>!!document.getElementById('pro')],
    ['Espace Particulier',()=>!!document.getElementById('particulier')],
    ['Écologie',()=>!!document.getElementById('eco')],
    ['Devis',()=>!!document.getElementById('devis')],
    ['Historique',()=>!!document.getElementById('historique')],
    ['Aides',()=>!!document.getElementById('aides')],
    ['Paramètres',()=>!!document.getElementById('param')],
    ['Calcul PRO',()=>typeof window.calc==='function'],
    ['Estimation particulier',()=>typeof window.estimate==='function'],
    ['Volume évacuation',()=>typeof window.previewWaste==='function'],
    ['Ajout évacuation',()=>typeof window.addWaste==='function'],
    ['Sauvegarde',()=>typeof window.save==='function'],
    ['Devis PDF',()=>typeof window.makeQuote==='function'],
    ['Dimensions évacuation',()=>!!document.getElementById('wl')&&!!document.getElementById('ww')&&!!document.getElementById('wh')],
    ['Pas de distance évacuation',()=>{const card=[...document.querySelectorAll('#pro .card')].find(x=>/Évacuation et déchets/i.test(x.textContent));return !!card&&!/€/\s*km|distance.*km|km.*€|distance de transport/i.test(card.textContent)}]
  ];
  function run(){
    const results=checks.map(([name,fn])=>{try{return{name,ok:!!fn()}}catch(e){return{name,ok:false,error:e.message}}});
    const ok=results.filter(x=>x.ok).length, total=results.length;
    let box=document.getElementById('cepro-v34-test');
    if(!box){box=document.createElement('div');box.id='cepro-v34-test';document.body.appendChild(box)}
    box.innerHTML='<div class="cepro-test-panel"><div class="cepro-test-head"><b>🧪 Diagnostic Chiffr’EcoPro</b><button id="cepro-test-close">×</button></div><div class="cepro-test-score">'+ok+' / '+total+' contrôles OK</div><div class="cepro-test-list">'+results.map(x=>'<div class="cepro-test-row '+(x.ok?'ok':'ko')+'"><span>'+(x.ok?'✓':'✕')+'</span><span>'+x.name+(x.error?' — '+x.error:'')+'</span></div>').join('')+'</div><p class="cepro-test-note">Diagnostic de présence et de cohérence de l’interface. Il ne remplace pas un essai métier réel.</p></div>';
    document.getElementById('cepro-test-close').onclick=()=>box.remove();
  }
  function install(){
    if(document.getElementById('cepro-v34-btn'))return;
    const param=document.getElementById('param');
    const target=param?.querySelector('.card')||document.getElementById('accueil');
    if(!target)return;
    const wrap=document.createElement('div');wrap.className='card';wrap.id='cepro-v34-btn';
    wrap.innerHTML='<h2>🧪 Test de fonctionnement</h2><p class="muted">Vérifie rapidement que les écrans et fonctions principales sont présents.</p><button class="primary" type="button">Lancer le diagnostic</button>';
    wrap.querySelector('button').onclick=run;
    if(param) param.appendChild(wrap); else target.appendChild(wrap);
    const s=document.createElement('style');s.textContent=`#cepro-v34-test{position:fixed;inset:0;z-index:9999;background:#0008;padding:16px;display:flex;align-items:center;justify-content:center}.cepro-test-panel{background:#fff;color:#17231d;max-width:520px;width:100%;max-height:85vh;overflow:auto;border-radius:18px;padding:18px;box-shadow:0 15px 50px #0005}.cepro-test-head{display:flex;justify-content:space-between;align-items:center;font-size:18px}.cepro-test-head button{border:0;background:transparent;font-size:26px}.cepro-test-score{font-size:30px;font-weight:900;margin:14px 0}.cepro-test-row{padding:8px 10px;border-radius:9px;margin:5px 0;display:flex;gap:8px}.cepro-test-row.ok{background:#e7f6ec}.cepro-test-row.ko{background:#fdeaea;color:#a12626}.cepro-test-note{font-size:12px;color:#64736b;margin-bottom:0}`;document.head.appendChild(s);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
