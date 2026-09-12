/* Chifr’EcoPro V47 — correctif page Aides */
(()=>{
  const render=()=>{
    const host=document.getElementById('aid');
    if(!host)return;
    const data=[
      ['Études d’écoconception — ADEME','Écoconception','https://agirpourlatransition.ademe.fr/entreprises/aides-financieres/catalogue/2026/etudes-decoconception-des-produits-et-des-services'],
      ['Investissements d’écoconception — ADEME','Écoconception','https://agirpourlatransition.ademe.fr/entreprises/aides-financieres/catalogue/2026/investissements-decoconception-pour-ameliorer-la-performance-environnementale'],
      ['Réemploi, réutilisation et réparation — ADEME','Réemploi','https://agirpourlatransition.ademe.fr/entreprises/aides-financieres/catalogue/2026/soutien-aux-investissements-pour-le-reemploi-reutilisation-et-la-reparation-hors-emballages'],
      ['Catalogue des aides ADEME','Déchets / économie circulaire','https://agirpourlatransition.ademe.fr/entreprises/aides-financieres/catalogue']
    ];
    const esc=s=>String(s).replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[m]));
    host.innerHTML=data.map(a=>`<div class="item"><div><b>${esc(a[0])}</b><p class="muted">${esc(a[1])}</p><a href="${a[2]}" target="_blank" rel="noopener">Source officielle</a></div></div>`).join('');
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render,{once:true});else render();
})();
