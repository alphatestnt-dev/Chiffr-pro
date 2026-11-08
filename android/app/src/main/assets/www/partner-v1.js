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
      const st=getStatus(p);
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
    renderAidsPartners();
  }

  function renderAidsPartners(){
    const aid=document.getElementById('aid'); if(!aid || aid.dataset.partnersReady==='1')return;
    aid.dataset.partnersReady='1';
    const box=document.createElement('div');
    box.className='card eco';
    box.innerHTML=`<h2>🤝 Organismes et partenaires à consulter</h2>
      <p class="muted">Ces organismes peuvent être utiles selon le projet et le territoire. Les liens sont des accès officiels ; ils ne signifient pas que Chifr’EcoPro dispose d’un partenariat ou d’une aide garantie.</p>
      <div class="grid2" style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px">
        ${partners.map(p=>`<div class="box"><h3 style="margin-top:0">${esc(p.name)}</h3><p>${esc(p.type)}</p><a href="${esc(p.contact)}" target="_blank" rel="noopener" style="font-weight:800">Contacter / consulter →</a></div>`).join('')}
      </div>`;
    aid.appendChild(box);
  }

  function addEcoSortingLinks(){
    const waste=document.getElementById('wt');
    if(!waste || document.getElementById('ecoSortingLinks')) return;
    const card=waste.closest('.card');
    if(!card) return;
    const box=document.createElement('div');
    box.id='ecoSortingLinks';
    box.className='box eco';
    box.style.marginTop='14px';
    box.innerHTML=`<h3 style="margin-top:0">🌱 Trouver une filière de tri / valorisation</h3>
      <p class="muted" style="margin-bottom:10px">Selon le type de déchet sélectionné, consultez les filières officielles et les partenaires spécialisés. Les liens n’impliquent aucune affiliation avec Chifr’EcoPro.</p>
      <div class="actions" style="margin-top:0">
        <a href="https://www.ademe.fr/" target="_blank" rel="noopener">ADEME — informations officielles</a>
        <a href="https://www.recyclage.veolia.fr/gerer-mes-dechets/entreprises/solutions-services/tri-8-flux-dechets" target="_blank" rel="noopener">Veolia — tri 6/8 flux</a>
        <a href="https://www.recyclage.veolia.fr/gerer-mes-dechets/entreprises/solutions-services/recyclinn-pro-decheteries-professionnelles" target="_blank" rel="noopener">Veolia — déchèteries pro</a>
        <a href="https://www.suez.fr/fr-fr/entreprises" target="_blank" rel="noopener">SUEZ — solutions entreprises</a>
        <a href="https://www.citeo.com/" target="_blank" rel="noopener">CITEO — tri et recyclage</a>
        <a href="https://www.valobat.fr/" target="_blank" rel="noopener">Valobat — REP bâtiment</a>
        <a href="https://www.ecomaison.com/" target="_blank" rel="noopener">Ecomaison — réemploi / recyclage</a>
      </div>`;
    card.appendChild(box);
  }

  function addEcoDedicatedPage(){
    const nav=document.querySelector('nav'),main=document.querySelector('main');
    if(!nav||!main||document.getElementById('ecoDedicatedPage'))return;
    let btn=document.getElementById('ecoDedicatedNav');
    if(!btn){
      btn=document.createElement('button');
      btn.id='ecoDedicatedNav';
      btn.textContent='♻️ Calculs écologiques';
      btn.onclick=()=>{
        document.querySelectorAll('.page').forEach(x=>x.classList.remove('active'));
        document.getElementById('ecoDedicatedPage').classList.add('active');
        document.querySelectorAll('nav button').forEach(x=>x.classList.remove('active'));
        btn.classList.add('active');
        ecoDedicatedCalc();
      };
      nav.appendChild(btn);
    }
    const page=document.createElement('section');
    page.id='ecoDedicatedPage'; page.className='page';
    page.innerHTML=`
      <div class="card eco">
        <span class="pill">ESPACE 100 % ÉCOLOGIE</span>
        <h1>♻️ Tri, volume et évacuation</h1>
        <p>Une page dédiée pour calculer simplement le volume des déchets, estimer les rotations d’évacuation et visualiser l’effet du tri. Les montants sont <b>indicatifs</b> et doivent être adaptés aux tarifs réels du prestataire et du territoire.</p>
      </div>
      <div class="card">
        <h2>📐 1. Calcul du volume à évacuer</h2>
        <div class="grid3">
          <div><label>Type de déchet</label><select id="ecoWasteType">
            <option value="verts">🌿 Déchets verts</option><option value="gravats">🧱 Gravats / béton</option><option value="terre">🌍 Terre</option><option value="bois">🪵 Bois</option><option value="carton">📦 Papier / carton</option><option value="plastique">♻️ Plastiques</option><option value="metaux">🔩 Métaux</option><option value="verre">🪟 Verre</option><option value="residuels">🗑️ Résiduels</option><option value="dangereux">⚠️ Déchets particuliers</option><option value="melange">Déchets mélangés</option>
          </select></div>
          <div><label>Longueur (m)</label><input id="ecoL" type="number" min="0" step="0.01" value="2"></div>
          <div><label>Largeur (m)</label><input id="ecoW" type="number" min="0" step="0.01" value="1"></div>
          <div><label>Hauteur (m)</label><input id="ecoH" type="number" min="0" step="0.01" value="1"></div>
          <div><label>Ou volume direct (m³)</label><input id="ecoV" type="number" min="0" step="0.01" placeholder="Facultatif"></div>
          <div><label>Mode</label><select id="ecoMode"><option value="dim">L × l × h</option><option value="vol">Volume direct</option></select></div>
        </div>
        <div class="results" style="margin-top:14px"><div class="box">Volume<div id="ecoVolume" class="big">0,00 m³</div></div><div class="box">Densité indicative<div id="ecoDensity" class="big">0 kg/m³</div></div><div class="box">Masse indicative<div id="ecoMass" class="big">0 kg</div></div><div class="box">Tri<div id="ecoSortState" class="big">À organiser</div></div><div class="box">Filière<div id="ecoChannel" class="big">—</div></div></div>
      </div>
      <div class="card">
        <h2>🚚 2. Calcul d’évacuation</h2>
        <div class="grid3">
          <div><label>Distance aller (km)</label><input id="ecoKm" type="number" min="0" step="1" value="15"></div>
          <div><label>Capacité du véhicule (m³)</label><input id="ecoCap" type="number" min="0.1" step="0.1" value="8"></div>
          <div><label>Coût transport (€/km)</label><input id="ecoTransport" type="number" min="0" step="0.1" value="1.2"></div>
          <div><label>Coût filière (€/m³)</label><input id="ecoDisposal" type="number" min="0" step="0.5" value="35"></div>
          <div><label>Coût tri / manutention (€/m³)</label><input id="ecoSorting" type="number" min="0" step="0.5" value="10"></div>
          <div><label>Majoration déchets mélangés (€/m³)</label><input id="ecoMixed" type="number" min="0" step="0.5" value="20"></div>
        </div>
        <div class="actions"><button class="primary" id="ecoCalcBtn">🧮 Calculer l’évacuation</button></div>
        <div class="results" style="margin-top:14px"><div class="box">Rotations<div id="ecoTrips" class="big">0</div></div><div class="box">Transport<div id="ecoTransportTotal" class="big">0 €</div></div><div class="box">Filière<div id="ecoDisposalTotal" class="big">0 €</div></div><div class="box">Tri<div id="ecoSortingTotal" class="big">0 €</div></div><div class="box">Total indicatif<div id="ecoTotal" class="big">0 €</div></div></div>
      </div>
      <div class="card">
        <h2>🔄 3. Comparateur trié / mélangé</h2>
        <p class="muted">Saisissez plusieurs flux pour comparer une évacuation séparée avec une évacuation mélangée. Le calcul sert à comparer des scénarios, pas à garantir un tarif.</p>
        <div class="grid3">
          <div><label>🌿 Verts (m³)</label><input class="ecoFlux" data-type="verts" type="number" min="0" step="0.1" value="0"></div>
          <div><label>🧱 Gravats (m³)</label><input class="ecoFlux" data-type="gravats" type="number" min="0" step="0.1" value="0"></div>
          <div><label>🪵 Bois (m³)</label><input class="ecoFlux" data-type="bois" type="number" min="0" step="0.1" value="0"></div>
          <div><label>📦 Carton (m³)</label><input class="ecoFlux" data-type="carton" type="number" min="0" step="0.1" value="0"></div>
          <div><label>♻️ Plastiques (m³)</label><input class="ecoFlux" data-type="plastique" type="number" min="0" step="0.1" value="0"></div>
          <div><label>🗑️ Mélangés (m³)</label><input class="ecoFlux" data-type="melange" type="number" min="0" step="0.1" value="0"></div>
        </div>
        <div class="actions"><button class="primary" id="ecoCompareBtn">⚖️ Comparer</button></div>
        <div class="grid" style="margin-top:14px"><div class="box"><h3>Tri séparé</h3><p id="ecoSeparate">—</p></div><div class="box"><h3>Mélangé</h3><p id="ecoMixedScenario">—</p></div></div>
      </div>
      <div class="card eco">
        <h2>🌱 Repères de tri</h2>
        <div class="grid3">
          <div class="box"><b>🌿 Déchets verts</b><p>Valorisation organique, broyage ou filière dédiée selon le territoire.</p></div>
          <div class="box"><b>🧱 Gravats</b><p>Filière minérale / recyclage des matériaux selon la nature des déchets.</p></div>
          <div class="box"><b>🪵 Bois</b><p>Tri séparé recommandé pour faciliter le recyclage ou la valorisation.</p></div>
          <div class="box"><b>📦 Carton</b><p>À conserver propre et séparé lorsque la filière l’accepte.</p></div>
          <div class="box"><b>♻️ Plastiques</b><p>Identifier la résine et la filière lorsque cela est possible.</p></div>
          <div class="box"><b>⚠️ Particuliers / dangereux</b><p>Ne pas mélanger avec les flux ordinaires ; vérifier la filière adaptée.</p></div>
        </div>
      </div>`;
    main.appendChild(page);
    document.getElementById('ecoCalcBtn').onclick=ecoDedicatedCalc;
    document.getElementById('ecoCompareBtn').onclick=ecoCompare;
    ['ecoWasteType','ecoL','ecoW','ecoH','ecoV','ecoMode'].forEach(id=>document.getElementById(id).addEventListener('input',ecoDedicatedCalc));
    ecoDedicatedCalc();
  }

  const ecoInfo={
    verts:{density:300,channel:'Valorisation / broyage',base:30},gravats:{density:1600,channel:'Filière minérale',base:45},terre:{density:1500,channel:'Filière terre',base:30},bois:{density:450,channel:'Valorisation bois',base:40},carton:{density:120,channel:'Recyclage papier/carton',base:35},plastique:{density:150,channel:'Recyclage plastiques',base:60},metaux:{density:500,channel:'Valorisation métaux',base:25},verre:{density:500,channel:'Recyclage verre',base:40},residuels:{density:250,channel:'Filière résiduelle',base:55},dangereux:{density:300,channel:'Filière spécifique',base:90},melange:{density:500,channel:'Tri / traitement des mélangés',base:75}
  };
  const euro=n=>Number(n||0).toLocaleString('fr-FR',{maximumFractionDigits:0})+' €';
  const num=id=>parseFloat(document.getElementById(id)?.value)||0;
  function ecoGetVolume(){
    const mode=document.getElementById('ecoMode').value;
    return Math.max(0,mode==='vol'&&num('ecoV')>0?num('ecoV'):num('ecoL')*num('ecoW')*num('ecoH'));
  }
  function ecoDedicatedCalc(){
    if(!document.getElementById('ecoDedicatedPage'))return;
    const type=document.getElementById('ecoWasteType').value, info=ecoInfo[type], v=ecoGetVolume();
    const density=info.density, mass=v*density;
    document.getElementById('ecoVolume').textContent=v.toFixed(2).replace('.',',')+' m³';
    document.getElementById('ecoDensity').textContent=density.toLocaleString('fr-FR')+' kg/m³';
    document.getElementById('ecoMass').textContent=mass.toLocaleString('fr-FR',{maximumFractionDigits:0})+' kg';
    document.getElementById('ecoChannel').textContent=info.channel;
    document.getElementById('ecoSortState').textContent=type==='melange'?'Mélangé':'Flux séparé';
    const cap=Math.max(0.1,num('ecoCap')), km=num('ecoKm'), transport=num('ecoTransport'), disposal=num('ecoDisposal')||info.base, sorting=num('ecoSorting'), mixed=num('ecoMixed');
    const trips=v?Math.ceil(v/cap):0, t=trips*km*2*transport, d=v*disposal, s=v*sorting, m=type==='melange'?v*mixed:0;
    document.getElementById('ecoTrips').textContent=trips;
    document.getElementById('ecoTransportTotal').textContent=euro(t);
    document.getElementById('ecoDisposalTotal').textContent=euro(d);
    document.getElementById('ecoSortingTotal').textContent=euro(s+m);
    document.getElementById('ecoTotal').textContent=euro(t+d+s+m);
  }
  function ecoCompare(){
    const vals=[...document.querySelectorAll('.ecoFlux')].map(x=>({type:x.dataset.type,v:parseFloat(x.value)||0})).filter(x=>x.v>0);
    const total=vals.reduce((a,x)=>a+x.v,0); if(!total){document.getElementById('ecoSeparate').textContent='Saisissez au moins un volume.';document.getElementById('ecoMixedScenario').textContent='—';return;}
    const km=num('ecoKm'), cap=Math.max(0.1,num('ecoCap')), tr=num('ecoTransport'), sort=num('ecoSorting'), mixed=num('ecoMixed');
    let separate=0; vals.forEach(x=>{const info=ecoInfo[x.type]||ecoInfo.melange;separate+=Math.ceil(x.v/cap)*km*2*tr+x.v*(num('ecoDisposal')||info.base)+x.v*sort;});
    const mixedCost=Math.ceil(total/cap)*km*2*tr+total*(num('ecoDisposal')||ecoInfo.melange.base)+total*mixed;
    document.getElementById('ecoSeparate').innerHTML='<b>'+euro(separate)+'</b><br>'+vals.length+' flux séparé(s), '+total.toFixed(2).replace('.',',')+' m³.';
    document.getElementById('ecoMixedScenario').innerHTML='<b>'+euro(mixedCost)+'</b><br>1 flux mélangé, '+total.toFixed(2).replace('.',',')+' m³.';
  }

  function init(){
    const nav=document.querySelector('nav'),main=document.querySelector('main');
    if(!nav||!main)return;
    let b=document.getElementById('partnerNav');
    if(!b){b=document.createElement('button');b.id='partnerNav';b.textContent='🤝 Partenaires';b.onclick=()=>{document.querySelectorAll('.page').forEach(x=>x.classList.remove('active'));const p=document.getElementById('partnersPage');if(p)p.classList.add('active');document.querySelectorAll('nav button').forEach(x=>x.classList.remove('active'));b.classList.add('active');render();};nav.appendChild(b);}
    let page=document.getElementById('partnersPage');
    if(!page){page=document.createElement('section');page.id='partnersPage';page.className='page';main.appendChild(page);}
    render();
    addEcoSortingLinks();
    addEcoDedicatedPage();
    setTimeout(addEcoSortingLinks,700);
    setTimeout(addEcoDedicatedPage,700);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
