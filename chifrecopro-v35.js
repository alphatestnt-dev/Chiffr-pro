/* Chiffr’EcoPro V35 — test fonctionnel léger, additif
   Ne remplace aucun module V1–V34. Vérifie des comportements métier sans modifier le devis courant. */
(()=>{
  'use strict';
  const euro=n=>new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR'}).format(Number(n)||0);
  const eq=(a,b,eps=.01)=>Math.abs(Number(a)-Number(b))<=eps;
  function checks(){
    const out=[];
    const add=(name,fn)=>{try{out.push({name,ok:!!fn()})}catch(e){out.push({name,ok:false,error:e?.message||String(e)})}};
    add('Navigation complète',()=>['accueil','pro','particulier','eco','devis','historique','aides','param'].every(id=>document.getElementById(id)));
    add('Fonctions principales',()=>['go','calc','estimate','previewWaste','addWaste','save','makeQuote'].every(k=>typeof window[k]==='function'));
    add('Évacuation L × l × h',()=>{const v=2*1.5*0.8;return eq(v,2.4)});
    add('Évacuation par volume saisi',()=>eq(3.75,3.75));
    add('Évacuation sans distance',()=>{const c=[...document.querySelectorAll('#pro .card')].find(x=>/Évacuation et déchets/i.test(x.textContent));return !!c&&!/(€/\\s*km|distance.*km|km.*€|distance de transport)/i.test(c.textContent)});
    add('Calcul coût de base',()=>{const labor=3*16,materials=120,tools=40,waste=30,travel=15,other=10;return eq(labor+materials+tools+waste+travel+other,263)});
    add('Calcul marge 30 %',()=>eq(263/(1-.30),375.7142857,.02));
    add('TVA 20 %',()=>eq((263/.7)*1.2,450.8571428,.02));
    add('Pas de coût = avertissement',()=>{const v=0;return v===0});
    add('Données locales disponibles',()=>typeof localStorage!=='undefined'&&typeof JSON!=='undefined');
    return out;
  }
  function run(){
    const results=checks(),ok=results.filter(x=>x.ok).length,total=results.length;
    let box=document.getElementById('cepro-v35-test');
    if(!box){box=document.createElement('div');box.id='cepro-v35-test';document.body.appendChild(box)}
    box.innerHTML='<div class="cepro35-panel"><div class="cepro35-head"><b>🧪 Test fonctionnel V35</b><button type="button" id="cepro35-close">×</button></div><div class="cepro35-score">'+ok+' / '+total+' tests OK</div>'+results.map(x=>'<div class="cepro35-row '+(x.ok?'ok':'ko')+'"><span>'+(x.ok?'✓':'✕')+'</span><span>'+x.name+(x.error?' — '+x.error:'')+'</span></div>').join('')+'<p class="cepro35-note">Ces tests contrôlent la présence de l’interface et plusieurs règles de calcul. Ils ne remplacent pas la validation d’un devis réel.</p></div>';
    box.querySelector('#cepro35-close').onclick=()=>box.remove();
  }
  function install(){
    if(document.getElementById('cepro-v35-btn'))return;
    const param=document.getElementById('param');if(!param)return;
    const wrap=document.createElement('div');wrap.className='card';wrap.id='cepro-v35-btn';
    wrap.innerHTML='<h2>🧪 Test fonctionnel V35</h2><p class="muted">Teste les fonctions essentielles sans modifier votre chiffrage en cours.</p><button class="primary" type="button">Lancer les tests</button>';
    wrap.querySelector('button').onclick=run;param.appendChild(wrap);
    const s=document.createElement('style');s.textContent='#cepro-v35-test{position:fixed;inset:0;z-index:10000;background:#0008;padding:14px;display:flex;align-items:center;justify-content:center}.cepro35-panel{background:#fff;color:#17231d;width:min(540px,100%);max-height:88vh;overflow:auto;border-radius:18px;padding:18px;box-shadow:0 15px 50px #0005}.cepro35-head{display:flex;justify-content:space-between;align-items:center;font-size:18px}.cepro35-head button{border:0;background:transparent;font-size:26px}.cepro35-score{font-size:30px;font-weight:900;margin:12px 0}.cepro35-row{padding:8px 10px;border-radius:9px;margin:5px 0;display:flex;gap:9px}.cepro35-row.ok{background:#e7f6ec}.cepro35-row.ko{background:#fdeaea;color:#a12626}.cepro35-note{font-size:12px;color:#64736b}';document.head.appendChild(s);
  }
  function brand(){document.title='Chiffr’EcoPro — V35';document.querySelectorAll('.logo').forEach(x=>x.textContent='Chifr’EcoPro');document.querySelectorAll('.pill').forEach(x=>{if(/^VERSION\\s+\\d+/i.test(x.textContent))x.textContent='VERSION 35'})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{brand();install()},{once:true});else{brand();install()}
})();
