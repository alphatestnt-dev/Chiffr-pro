(()=>{
  'use strict';
  const $=id=>document.getElementById(id);
  const primary=[
    ['accueil','Accueil'],
    ['pro','Professionnel'],
    ['particulier','Particulier'],
    ['eco','🌱 Écologie'],
    ['aides','Aides / Informations'],
    ['param','Compte / Paramètres']
  ];

  function style(){
    if($('ce-navigation-v2')) return;
    const s=document.createElement('style');
    s.id='ce-navigation-v2';
    s.textContent=`
      nav[aria-label="Navigation principale"]{flex-wrap:nowrap!important;overflow-x:auto!important;overflow-y:hidden!important;white-space:nowrap!important;-webkit-overflow-scrolling:touch;scrollbar-width:thin;justify-content:flex-start!important}
      nav[aria-label="Navigation principale"] button{flex:0 0 auto!important;white-space:nowrap!important}
      .ce-page-nav{display:flex;gap:7px;overflow-x:auto;overflow-y:hidden;flex-wrap:nowrap;white-space:nowrap;-webkit-overflow-scrolling:touch;margin:0 0 16px;padding:3px 1px 7px;scrollbar-width:thin}
      .ce-page-nav button{flex:0 0 auto;border:1px solid var(--line,#d8e3dd);background:#fff;color:var(--d,#103c2c);border-radius:999px;padding:9px 13px;font-weight:800;cursor:pointer}
      .ce-page-nav button:hover,.ce-page-nav button:focus-visible{background:var(--soft,#e8f4ed);outline:none}
      .ce-tools-nav{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}
      .ce-tools-nav button{border:1px solid var(--line,#d8e3dd);background:#fff;border-radius:9px;padding:9px 12px;font-weight:800;cursor:pointer}
      @media(max-width:560px){.ce-page-nav{margin-bottom:12px}.ce-page-nav button{padding:8px 12px;font-size:14px}}
      #devis,#historique,#eco-lever,#partnersPage{scroll-margin-top:80px}
    `;
    document.head.appendChild(s);
  }

  function hideExtraNav(){
    document.querySelectorAll('nav[aria-label="Navigation principale"] button').forEach(b=>{b.style.display=primary.some(x=>x[0]===b.dataset.p)?'':'none'});
    const nav=document.querySelector('nav[aria-label="Navigation principale"]'); if(!nav)return;
    primary.forEach(([id,label])=>{const b=nav.querySelector(`button[data-p="${id}"]`);if(b)b.textContent=label});
  }

  function makeSubnav(pageId,items){
    const page=$(pageId);if(!page||page.querySelector('.ce-page-nav'))return;
    const first=page.firstElementChild;if(!first)return;
    const bar=document.createElement('div');bar.className='ce-page-nav';bar.setAttribute('aria-label',`Navigation ${pageId}`);
    items.forEach(([id,label])=>{
      const b=document.createElement('button');b.type='button';b.textContent=label;
      b.onclick=()=>{
        if(['devis','historique','partnersPage','eco-lever','pro','particulier'].includes(id)){window.go?.(id);return}
        const target=$(id)||page.querySelector(`[data-ce-anchor="${id}"]`);if(target)target.scrollIntoView({behavior:'smooth',block:'start'});
      };
      bar.appendChild(b);
    });
    page.insertBefore(bar,first);
  }

  function markCards(){
    const pro=$('pro');
    if(pro)[...pro.querySelectorAll(':scope > .card')].forEach((c,i)=>c.dataset.ceAnchor=['pro-chiffrage','pro-materiaux','pro-machines','pro-dechets','pro-actions','pro-resultat'][i]||'');
    const part=$('particulier');
    if(part)[...part.querySelectorAll(':scope > .card')].forEach((c,i)=>c.dataset.ceAnchor=['part-estimation','part-dechets','part-comparaison'][i]||'');
  }

  function addTools(){
    const eco=$('eco');
    if(eco&&!eco.querySelector('.ce-tools-nav')){
      const wrap=document.createElement('div');wrap.className='ce-tools-nav';
      const mk=(label,id)=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.onclick=()=>window.go?.(id);return b};
      wrap.append(mk('🤝 Partenaires','partnersPage'),mk('📈 Éco-Levier','eco-lever'));
      const card=eco.querySelector('.card');if(card)card.appendChild(wrap);
    }
    const oldPartner=$('partnerNav');if(oldPartner)oldPartner.style.display='none';
  }

  function install(){
    if(!document.querySelector('nav[aria-label="Navigation principale"]'))return;
    style();hideExtraNav();markCards();
    makeSubnav('pro',[
      ['pro-chiffrage','Chiffrage'],['pro-materiaux','Matériaux'],['pro-machines','Machines / outils'],['pro-dechets','Déchets / évacuation'],['pro-resultat','Résultat'],['devis','Devis'],['historique','Historique']
    ]);
    makeSubnav('particulier',[
      ['part-estimation','Estimation'],['part-dechets','Déchets'],['part-comparaison','Comparaison']
    ]);
    makeSubnav('devis',[
      ['pro','Chiffrage'],['devis','Devis'],['historique','Historique']
    ]);
    makeSubnav('historique',[
      ['pro','Chiffrage'],['devis','Devis'],['historique','Historique']
    ]);
    addTools();
    const home=$('accueil')?.querySelector('.home img');
    if(home){home.src='./hero-home-ecopro.svg';home.removeAttribute('srcset');home.style.imageRendering='auto'}
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(install,0),{once:true});else setTimeout(install,0);
})();
