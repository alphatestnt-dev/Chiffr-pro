(()=>{
  'use strict';
  const $=id=>document.getElementById(id);
  const primary=[['accueil','Accueil'],['pro','Professionnel'],['particulier','Particulier'],['eco','🌱 Écologie'],['aides','Aides / Informations'],['param','Compte / Paramètres']];
  function style(){
    if($('ce-navigation-v2'))return;
    const s=document.createElement('style');s.id='ce-navigation-v2';s.textContent=`
      nav[aria-label="Navigation principale"]{flex-wrap:nowrap!important;overflow-x:auto!important;overflow-y:hidden!important;white-space:nowrap!important;-webkit-overflow-scrolling:touch;scrollbar-width:thin;justify-content:flex-start!important;gap:8px!important;padding:9px max(4%,14px)!important;box-shadow:0 2px 10px #17352a0a}
      nav[aria-label="Navigation principale"] button{flex:0 0 auto!important;white-space:nowrap!important;min-height:42px;padding:10px 14px!important;border:1px solid transparent;border-radius:11px!important;color:var(--d,#103c2c);font-size:14px;transition:background .15s ease,border-color .15s ease,transform .15s ease}
      nav[aria-label="Navigation principale"] button:hover{background:var(--soft,#e8f4ed)!important;border-color:var(--line,#d8e3dd);transform:translateY(-1px)}
      nav[aria-label="Navigation principale"] button.active{box-shadow:0 3px 10px #146b4a26}
      main{max-width:1180px!important;margin:24px auto 36px!important;padding:0 18px!important}
      .page> .card:first-of-type{margin-top:2px}
      h1,h2,h3{color:var(--d,#103c2c);line-height:1.2;letter-spacing:-.01em;margin-top:0}
      h1{font-size:30px;margin-bottom:8px}
      h2{font-size:21px;margin-bottom:10px}
      h3{font-size:17px;margin-bottom:8px}
      p{line-height:1.55}
      .card{border-radius:17px!important;padding:20px!important;margin-bottom:18px!important;box-shadow:0 5px 18px #17352a10!important}
      .grid,.grid3{gap:14px!important}
      label{font-size:14px;margin:2px 0 7px!important;color:#25342d}
      input,select,textarea{min-height:44px!important;padding:10px 12px!important;border-radius:10px!important;border:1px solid #c9d7d0!important;box-shadow:inset 0 1px 2px #17352a08;font-size:15px!important}
      input:focus,select:focus,textarea:focus{outline:3px solid #146b4a22;outline-offset:1px;border-color:var(--g,#146b4a)!important}
      .actions{gap:9px!important;margin-top:14px!important}
      .actions button,.ce-tools-nav button{min-height:42px;padding:10px 14px!important;border-radius:10px!important;font-size:14px;transition:transform .15s ease,box-shadow .15s ease,background .15s ease}
      .actions button:hover,.ce-tools-nav button:hover{transform:translateY(-1px);box-shadow:0 4px 10px #17352a12}
      .primary{box-shadow:0 4px 10px #146b4a20!important}
      .box{padding:15px!important;border-radius:13px!important}
      .results{gap:10px!important}
      .results .box{min-height:88px;display:flex;flex-direction:column;justify-content:center}
      .big{font-size:22px!important;line-height:1.2}
      .item{border-radius:12px!important;padding:12px!important;margin:8px 0!important;background:#fff;min-height:46px}
      .pill{font-size:12px;padding:6px 9px}
      .notice{border-radius:11px!important;padding:12px!important;line-height:1.45}
      .quote{border-radius:14px!important;box-shadow:0 5px 18px #17352a10}
      .ce-page-nav{display:flex;gap:8px;overflow-x:auto;overflow-y:hidden;flex-wrap:nowrap;white-space:nowrap;-webkit-overflow-scrolling:touch;margin:0 0 18px;padding:2px 1px 8px;scrollbar-width:thin}
      .ce-page-nav button{flex:0 0 auto;border:1px solid var(--line,#d8e3dd);background:#fff;color:var(--d,#103c2c);border-radius:999px;padding:9px 14px;font-weight:800;cursor:pointer;font-size:14px;min-height:40px;transition:background .15s ease,border-color .15s ease,transform .15s ease}
      .ce-page-nav button:hover,.ce-page-nav button:focus-visible{background:var(--soft,#e8f4ed);border-color:#a9c6b7;outline:none;transform:translateY(-1px)}
      .ce-tools-nav{display:flex;gap:9px;flex-wrap:wrap;margin-top:14px}
      .ce-tools-nav button{border:1px solid var(--line,#d8e3dd);background:#fff;border-radius:10px;padding:10px 14px;font-weight:800;cursor:pointer;color:var(--d,#103c2c)}
      #devis,#historique,#eco-lever,#partnersPage,#factures-pro,#factures-particulier,#demande-particulier{scroll-margin-top:92px}
      .home{border-radius:20px!important;box-shadow:0 7px 24px #17352a14!important}
      .home-links button{opacity:.01!important}
      section.page .muted{font-size:14px}
      @media(max-width:800px){main{padding:0 14px!important}.card{padding:17px!important}.results{grid-template-columns:1fr 1fr!important}}
      @media(max-width:560px){
        nav[aria-label="Navigation principale"]{padding:8px 10px!important}
        nav[aria-label="Navigation principale"] button{font-size:13px;min-height:40px;padding:9px 12px!important}
        main{margin:18px auto 28px!important;padding:0 11px!important}
        h1{font-size:25px}.card{padding:15px!important;border-radius:15px!important;margin-bottom:14px!important}
        h2{font-size:19px}.grid,.grid3,.results{grid-template-columns:1fr!important;gap:11px!important}
        .actions{display:grid!important;grid-template-columns:1fr;gap:8px!important}
        .actions button{width:100%}
        .ce-page-nav{margin-bottom:14px;padding-bottom:7px}
        .ce-page-nav button{padding:8px 12px;font-size:13px;min-height:38px}
        .ce-tools-nav{display:grid;grid-template-columns:1fr 1fr}
        .ce-tools-nav button{width:100%}
        .home{border-radius:15px!important}
      }
      @media(min-width:1100px){main{padding-left:22px!important;padding-right:22px!important}.page>.card{padding:22px!important}}
    `;document.head.appendChild(s);
  }
  function hideExtraNav(){
    document.querySelectorAll('nav[aria-label="Navigation principale"] button').forEach(b=>{b.style.display=primary.some(x=>x[0]===b.dataset.p)?'':'none'});
    const nav=document.querySelector('nav[aria-label="Navigation principale"]');if(!nav)return;primary.forEach(([id,label])=>{const b=nav.querySelector(`button[data-p="${id}"]`);if(b)b.textContent=label});
  }
  function makeSubnav(pageId,items){
    const page=$(pageId);if(!page||page.querySelector('.ce-page-nav'))return;const first=page.firstElementChild;if(!first)return;
    const bar=document.createElement('div');bar.className='ce-page-nav';bar.setAttribute('aria-label',`Navigation ${pageId}`);
    items.forEach(([id,label])=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.dataset.ceNav=id;b.onclick=()=>{if(['devis','historique','partnersPage','eco-lever','pro','particulier','factures-pro','factures-particulier','demande-particulier'].includes(id)){window.go?.(id);return}const target=$(id)||page.querySelector(`[data-ce-anchor="${id}"]`);if(target)target.scrollIntoView({behavior:'smooth',block:'start'})};bar.appendChild(b)});
    page.insertBefore(bar,first);
  }
  function markCards(){
    const pro=$('pro');if(pro)[...pro.querySelectorAll(':scope > .card')].forEach((c,i)=>c.dataset.ceAnchor=['pro-chiffrage','pro-materiaux','pro-machines','pro-dechets','pro-actions','pro-resultat'][i]||'');
    const part=$('particulier');if(part)[...part.querySelectorAll(':scope > .card')].forEach((c,i)=>c.dataset.ceAnchor=['part-estimation','part-dechets','part-comparaison'][i]||'');
  }
  function addTools(){
    const eco=$('eco');if(eco&&!eco.querySelector('.ce-tools-nav')){const wrap=document.createElement('div');wrap.className='ce-tools-nav';const mk=(label,id)=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.onclick=()=>window.go?.(id);return b};wrap.append(mk('🤝 Partenaires','partnersPage'),mk('📈 Éco-Levier','eco-lever'));const card=eco.querySelector('.card');if(card)card.appendChild(wrap)}
    const oldPartner=$('partnerNav');if(oldPartner)oldPartner.style.display='none';
  }
  function install(){
    if(!document.querySelector('nav[aria-label="Navigation principale"]'))return;style();hideExtraNav();markCards();
    makeSubnav('pro',[['pro-chiffrage','Chiffrage'],['pro-materiaux','Matériaux'],['pro-machines','Machines / outils'],['pro-dechets','Déchets / évacuation'],['pro-resultat','Résultat'],['devis','Devis'],['factures-pro','Factures'],['historique','Historique']]);
    makeSubnav('particulier',[['part-estimation','Estimation'],['part-dechets','Déchets'],['part-comparaison','Comparaison'],['demande-particulier','Demande de devis'],['factures-particulier','Factures']]);
    makeSubnav('devis',[['pro','Chiffrage'],['devis','Devis'],['factures-pro','Factures'],['historique','Historique']]);
    makeSubnav('historique',[['pro','Chiffrage'],['devis','Devis'],['factures-pro','Factures'],['historique','Historique']]);
    addTools();
    const home=$('accueil')?.querySelector('.home img');if(home){home.src='./file_00000000cef88246bb6203174d2ac629.png';home.removeAttribute('srcset');home.style.imageRendering='auto'}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(install,0),{once:true});else setTimeout(install,0);
})();
