(()=>{
  const euro=n=>new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR'}).format(Number(n)||0);
  const num=id=>{const e=document.getElementById(id);return e?Math.max(0,Number(e.value)||0):0};
  const arr=n=>Array.isArray(window[n])?window[n]:[];
  function totals(){
    const labor=num('hours')*num('rate');
    const materials=arr('mats').reduce((s,x)=>s+(Number(x.q)||0)*(Number(x.p)||0),0);
    const tools=arr('tools').reduce((s,x)=>s+(Number(x.c)||0),0);
    const waste=arr('wastes').reduce((s,x)=>s+(Number(x.c ?? x.cost)||0),0);
    const travel=num('travel'),other=num('other');
    const cost=labor+materials+tools+waste+travel+other;
    const margin=Math.min(99,Math.max(0,num('margin')));
    const ht=margin>=100?cost:cost/(1-margin/100);
    const vat=num('vat');
    const ttc=ht*(1+vat/100);
    const volume=arr('wastes').reduce((s,x)=>s+(Number(x.v ?? x.volume)||0),0);
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

  function invoiceModule(){
    if(!document.querySelector('nav')||document.getElementById('factures'))return;
    const nav=document.querySelector('nav');
    const btn=document.createElement('button');
    btn.type='button'; btn.dataset.p='factures'; btn.textContent='🧾 Factures';
    nav.appendChild(btn);
    const section=document.createElement('section'); section.id='factures'; section.className='page';
    section.innerHTML=`<div class="card"><span class="pill">ESPACE PROFESSIONNEL</span><h1>🧾 Factures</h1><p class="muted">Créez, suivez, imprimez et partagez vos factures professionnelles. Les données sont conservées localement sur cet appareil.</p>
      <div class="grid"><div><label>Entreprise</label><input id="invCompany" placeholder="Nom de l'entreprise"></div><div><label>N° de facture</label><input id="invNumber"></div><div><label>Client</label><input id="invClient" placeholder="Nom du client"></div><div><label>Date d'émission</label><input id="invDate" type="date"></div><div><label>Date d'échéance</label><input id="invDue" type="date"></div><div><label>TVA (%)</label><input id="invVat" type="number" min="0" step="0.1" value="20"></div><div><label>Statut</label><select id="invStatus"><option>Brouillon</option><option>Envoyée</option><option>Payée</option><option>En retard</option></select></div><div><label>Mode de paiement</label><select id="invPayment"><option>Virement</option><option>Carte bancaire</option><option>Chèque</option><option>Espèces</option><option>Autre</option></select></div></div></div>
      <div class="card"><h2>Prestations</h2><div class="grid3"><input id="invDesc" placeholder="Prestation / fourniture"><input id="invQty" type="number" min="0" step="0.01" value="1" placeholder="Quantité"><input id="invPrice" type="number" min="0" step="0.01" placeholder="Prix unitaire HT €"></div><div class="actions"><button class="primary" id="invAdd">Ajouter la ligne</button><button id="invFromQuote">↗ Reprendre le chiffrage actuel</button></div><div id="invLines"></div></div>
      <div class="card"><h2>Récapitulatif</h2><div class="line"><span>Total HT</span><b id="invHT">0,00 €</b></div><div class="line"><span>TVA</span><b id="invTVA">0,00 €</b></div><div class="line"><span>Total TTC</span><b id="invTTC">0,00 €</b></div><div class="actions"><button class="primary" id="invSave">💾 Enregistrer</button><button id="invPrint">🖨️ Imprimer / PDF</button><button id="invReset">Nouvelle facture</button></div></div>
      <div class="card"><h2>Historique des factures</h2><div id="invHistory"></div></div></section>`;
    hostAppend(section); bindNav(btn); initInvoice();
  }
  function hostAppend(section){document.querySelector('main').appendChild(section)}
  function bindNav(btn){
    btn.addEventListener('click',()=>{if(typeof window.go==='function')window.go('factures');else{document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));document.getElementById('factures').classList.add('active');document.querySelectorAll('nav button').forEach(b=>b.classList.remove('active'));btn.classList.add('active');window.scrollTo({top:0,behavior:'smooth'})}});
  }
  function initInvoice(){
    const q=id=>document.getElementById(id);
    const today=new Date().toISOString().slice(0,10);
    q('invDate').value=today;
    q('invNumber').value=nextInvoiceNumber();
    let lines=[];
    const money=n=>new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR'}).format(n||0);
    function renderLines(){
      q('invLines').innerHTML=lines.length?lines.map((x,i)=>`<div class="item"><span><b>${escapeHtml(x.desc)}</b> — ${x.qty} × ${money(x.price)}</span><b>${money(x.qty*x.price)} <button type="button" onclick="window.__removeInvoiceLine(${i})">×</button></b></div>`).join(''):'<p class="muted">Aucune ligne de prestation.</p>';
      const ht=lines.reduce((s,x)=>s+x.qty*x.price,0), vat=Math.max(0,Number(q('invVat').value)||0), tva=ht*vat/100;
      q('invHT').textContent=money(ht);q('invTVA').textContent=money(tva);q('invTTC').textContent=money(ht+tva);return {ht,tva,ttc:ht+tva};
    }
    window.__removeInvoiceLine=i=>{lines.splice(i,1);renderLines()};
    q('invAdd').onclick=()=>{const desc=q('invDesc').value.trim(),qty=Math.max(0,Number(q('invQty').value)||0),price=Math.max(0,Number(q('invPrice').value)||0);if(!desc||qty<=0)return;lines.push({desc,qty,price});q('invDesc').value='';q('invQty').value='1';q('invPrice').value='';renderLines()};
    q('invVat').oninput=renderLines;
    q('invFromQuote').onclick=()=>{const desc=q('prest')?.selectedOptions?.[0]?.textContent||'Prestation';const qty=Math.max(1,Number(q('qty')?.value)||1);const price=Math.max(0,Number(q('ht')?.textContent?.replace(/[^0-9,-]/g,'').replace(',','.')||0));if(price>0)lines.push({desc,qty,price:price/qty});else{const t=totals();if(t.ht>0)lines.push({desc,qty:1,price:t.ht});}if(q('client')?.value)q('invClient').value=q('client').value;if(q('entreprise')?.value)q('invCompany').value=q('entreprise').value;renderLines()};
    q('invSave').onclick=()=>{const totalsNow=renderLines();if(!q('invClient').value.trim()){alert('Indiquez le client avant d’enregistrer la facture.');return}const inv={id:Date.now(),number:q('invNumber').value.trim()||nextInvoiceNumber(),company:q('invCompany').value.trim(),client:q('invClient').value.trim(),date:q('invDate').value,due:q('invDue').value,vat:Number(q('invVat').value)||0,status:q('invStatus').value,payment:q('invPayment').value,lines:[...lines],...totalsNow};const all=readInvoices().filter(x=>x.number!==inv.number);all.unshift(inv);localStorage.setItem('ce_invoices',JSON.stringify(all));renderHistory();alert('Facture enregistrée.');};
    q('invPrint').onclick=()=>printInvoice(lines);
    q('invReset').onclick=()=>{lines=[];q('invNumber').value=nextInvoiceNumber();q('invClient').value='';q('invDue').value='';q('invStatus').value='Brouillon';q('invDesc').value='';q('invPrice').value='';renderLines()};
    renderLines();renderHistory();
    function renderHistory(){const all=readInvoices();q('invHistory').innerHTML=all.length?all.map((x,i)=>`<div class="item"><span><b>${escapeHtml(x.number)}</b> — ${escapeHtml(x.client)}<br><small>${escapeHtml(x.status)} · ${money(x.ttc)}</small></span><span><button type="button" onclick="window.__loadInvoice(${i})">Ouvrir</button> <button type="button" onclick="window.__deleteInvoice(${i})">×</button></span></div>`).join(''):'<p class="muted">Aucune facture enregistrée.</p>'}
    window.__loadInvoice=i=>{const x=readInvoices()[i];if(!x)return;q('invNumber').value=x.number;q('invCompany').value=x.company||'';q('invClient').value=x.client||'';q('invDate').value=x.date||today;q('invDue').value=x.due||'';q('invVat').value=x.vat??20;q('invStatus').value=x.status||'Brouillon';q('invPayment').value=x.payment||'Virement';lines=[...(x.lines||[])];renderLines();window.go&&window.go('factures')};
    window.__deleteInvoice=i=>{const all=readInvoices();all.splice(i,1);localStorage.setItem('ce_invoices',JSON.stringify(all));renderHistory()};
  }
  function readInvoices(){try{return JSON.parse(localStorage.getItem('ce_invoices')||'[]')||[]}catch{return[]}}
  function nextInvoiceNumber(){const y=new Date().getFullYear();const n=readInvoices().length+1;return `FAC-${y}-${String(n).padStart(3,'0')}`}
  function escapeHtml(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
  function printInvoice(lines){const q=id=>document.getElementById(id),money=n=>new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR'}).format(n||0),vat=Math.max(0,Number(q('invVat').value)||0),ht=lines.reduce((s,x)=>s+x.qty*x.price,0),tva=ht*vat/100,ttc=ht+tva,w=window.open('','_blank');if(!w)return;w.document.write(`<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>${escapeHtml(q('invNumber').value)}</title><style>body{font-family:Arial,sans-serif;margin:40px;color:#17231d}h1{color:#146b4a}.top{display:flex;justify-content:space-between}.line{display:flex;justify-content:space-between;border-bottom:1px solid #ddd;padding:9px 0}table{width:100%;border-collapse:collapse;margin-top:30px}th,td{padding:10px;border-bottom:1px solid #ddd;text-align:left}td:last-child,th:last-child{text-align:right}.total{max-width:360px;margin-left:auto;margin-top:20px}@media print{button{display:none}}</style></head><body><div class="top"><div><h1>Chiffr’EcoPro</h1><p>${escapeHtml(q('invCompany').value)}</p></div><div><h2>FACTURE</h2><p>N° ${escapeHtml(q('invNumber').value)}<br>${escapeHtml(q('invDate').value)}</p></div></div><hr><p><b>Client :</b> ${escapeHtml(q('invClient').value)}</p><table><thead><tr><th>Prestation</th><th>Qté</th><th>Prix unitaire HT</th><th>Total HT</th></tr></thead><tbody>${lines.map(x=>`<tr><td>${escapeHtml(x.desc)}</td><td>${x.qty}</td><td>${money(x.price)}</td><td>${money(x.qty*x.price)}</td></tr>`).join('')}</tbody></table><div class="total"><div class="line"><span>Total HT</span><b>${money(ht)}</b></div><div class="line"><span>TVA ${vat}%</span><b>${money(tva)}</b></div><div class="line"><span>Total TTC</span><b>${money(ttc)}</b></div></div><p>Échéance : ${escapeHtml(q('invDue').value||'À définir')} · Paiement : ${escapeHtml(q('invPayment').value)}</p><script>window.onload=()=>window.print()<\/script></body></html>`);w.document.close()}
  }
  function brand(){document.title='Chiffr’EcoPro — V31';document.querySelectorAll('.logo').forEach(x=>x.textContent='Chiffr’EcoPro');document.querySelectorAll('.pill').forEach(x=>{if(/^VERSION\s+\d+/i.test(x.textContent))x.textContent='VERSION 31'})}
  function hook(){brand();
    const old=window.calc;
    if(typeof old==='function'&&!old.__ecoV31){
      const wrapped=function(){const r=old.apply(this,arguments);setTimeout(render,0);return r};
      wrapped.__ecoV31=true;window.calc=wrapped;
    }
    ['hours','rate','travel','other','margin','vat','qty'].forEach(id=>{const e=document.getElementById(id);if(e){e.addEventListener('input',render);e.addEventListener('change',render)}});
    render();
    invoiceModule();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',hook);else hook();
})();
