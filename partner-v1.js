(()=>{
  const partners=[
    {name:'Veolia',type:'Recyclage, valorisation et déchets',contact:'https://www.veolia.fr/nous-contacter',kind:'commercial'},
    {name:'SUEZ',type:'Déchets, recyclage et valorisation',contact:'https://www.suez.com/fr/contact/',kind:'commercial'},
    {name:'Citeo',type:'Tri, réemploi et recyclage',contact:'https://www.citeo.com/contacts/',kind:'commercial'},
    {name:'ADEME',type:'Aides et transition écologique',contact:'https://www.ademe.fr/contact/',kind:'public'}
  ];
  const esc=x=>String(x).replace(/[&<>\"']/g,a=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[a]));
  const baseMessage=p=>`Objet : Demande d’autorisation de partenariat – Chifr’EcoPro / ${p.name}\n\nBonjour,\n\nNous développons Chifr’EcoPro, une application française de chiffrage destinée aux professionnels et aux particuliers. Elle intègre une démarche de projet responsable : tri, réemploi, valorisation, gestion des déchets et orientation vers les dispositifs adaptés.\n\nNous souhaiterions savoir si ${p.name} accepte d’étudier une collaboration ou une affiliation avec Chifr’EcoPro afin de pouvoir, uniquement après votre accord, présenter votre organisme/entreprise et éventuellement orienter les utilisateurs vers vos services.\n\nNous sollicitons donc votre autorisation préalable et écrite. Aucun logo, tarif, remise, avantage, offre, statut de partenaire ou affirmation d’affiliation ne sera présenté comme officiel avant votre validation.\n\nSi un programme partenaire ou d’affiliation existe, pourriez-vous nous indiquer les conditions, le bon interlocuteur et les modalités d’utilisation de votre marque et de vos offres ?\n\nMerci par avance pour votre retour.\n\nCordialement,\nL’équipe Chifr’EcoPro`;
  const key=p=>'chifrecopro_partner_'+p.name.toLowerCase().replace(/[^a-z0-9]+/g,'_');
  const getStatus=p=>localStorage.getItem(key(p))||'À contacter';
  const setStatus=(p,s)=>{localStorage.setItem(key(p),s);render();};
  const copy=async text=>{try{await navigator.clipboard.writeText(text);alert('Message d’autorisation copié.');}catch(e){const ta=document.createElement('textarea');ta.value=text;document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();alert('Message copié.');}};
  function render(){
    const page=document.getElementById('partnersPage'); if(!page)return;
    page.innerHTML=`<div class="card eco">
      <span class="pill">PARTENARIATS ÉCOLOGIQUES</span>
      <h1>🤝 Partenaires écologiques</h1>
      <p>Chifr’EcoPro ne s’affilie à aucun organisme automatiquement. <b>Une autorisation écrite est demandée avant toute affiliation, utilisation de logo, annonce de remise ou présentation d’une offre partenaire.</b></p>
      <div class="notice">🔒 Tant que le partenaire n’a pas validé la collaboration, son statut reste « En attente d’autorisation » et aucune offre n’est considérée comme officielle.</div>
    </div>
    <div class="card"><h2>📋 Organismes à contacter</h2>${partners.map(p=>{
      const st=getStatus(p); const msg=baseMessage(p).replace(/`/g,'\\`');
      return `<div class="item" style="display:block">
        <div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start;flex-wrap:wrap">
          <div><h3 style="margin:0 0 4px">${esc(p.name)}</h3><small>${esc(p.type)}</small></div>
          <span class="pill">${esc(st)}</span>
        </div>
        <p class="muted">${p.kind==='public'?'Organisme public : demande de collaboration/information, pas une affiliation commerciale présumée.':'Partenaire potentiel : aucune affiliation commerciale présumée sans accord.'}</p>
        <div class="actions">
          <button class="primary" data-copy="${esc(p.name)}">📨 Préparer la demande d’autorisation</button>
          <a href="${esc(p.contact)}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;padding:10px 13px;border:1px solid #cbd8d1;border-radius:9px;font-weight:800;text-decoration:none;color:inherit">Contacter officiellement</a>
          <button data-pending="${esc(p.name)}">⏳ Marquer en attente</button>
          <button data-approved="${esc(p.name)}">✅ Autorisation obtenue</button>
        </div>
      </div>`;
    }).join('')}</div>
    <div class="card"><h2>🛡️ Règle d’affiliation Chifr’EcoPro</h2>
      <ul><li>Demande officielle envoyée au partenaire.</li><li>Attente de sa réponse et de ses conditions.</li><li>Validation écrite conservée par Chifr’EcoPro.</li><li>Seulement après validation : affichage du partenaire, lien affilié, offre ou avantage réellement accordé.</li><li>Si l’accord expire ou est retiré, le partenaire est désactivé.</li></ul>
    </div>`;
    page.querySelectorAll('[data-copy]').forEach(b=>b.onclick=()=>{const p=partners.find(x=>x.name===b.dataset.copy);if(p)copy(baseMessage(p));});
    page.querySelectorAll('[data-pending]').forEach(b=>b.onclick=()=>{const p=partners.find(x=>x.name===b.dataset.pending);if(p)setStatus(p,'En attente d’autorisation');});
    page.querySelectorAll('[data-approved]').forEach(b=>b.onclick=()=>{const p=partners.find(x=>x.name===b.dataset.approved);if(p){if(confirm('Confirmez-vous que l’autorisation écrite de '+p.name+' a bien été obtenue ?'))setStatus(p,'Autorisation obtenue');}});
  }
  function init(){
    const nav=document.querySelector('nav'),main=document.querySelector('main');
    if(!nav||!main)return;
    let b=document.getElementById('partnerNav');
    if(!b){b=document.createElement('button');b.id='partnerNav';b.textContent='🤝 Partenaires';b.onclick=()=>{document.querySelectorAll('.page').forEach(x=>x.classList.remove('active'));const p=document.getElementById('partnersPage');if(p)p.classList.add('active');document.querySelectorAll('nav button').forEach(x=>x.classList.remove('active'));b.classList.add('active');render();};nav.appendChild(b);}
    let page=document.getElementById('partnersPage');
    if(!page){page=document.createElement('section');page.id='partnersPage';page.className='page';main.appendChild(page);}
    render();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
