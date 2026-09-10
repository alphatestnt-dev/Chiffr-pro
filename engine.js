/* Chifr’Eco Pro — moteur universel métiers / matériel
   Les valeurs par défaut sont des repères indicatifs, pas des tarifs imposés.
   Le modèle sépare : amortissement + entretien + énergie + assurance/frais + location éventuelle.
*/
(()=>{
'use strict';
const E=window.euro||((n)=>Number(n||0).toLocaleString('fr-FR',{style:'currency',currency:'EUR'}));
const V=window.V||((id)=>document.getElementById(id)?.value||'');

const ENERGY={
 electric:{label:'⚡ Électrique',price:0.22},
 battery:{label:'🔋 Batterie',price:0.22},
 thermal2:{label:'🔥 Thermique — mélange 2T',price:1.75},
 thermal4:{label:'🔥 Thermique — essence 4T',price:1.85},
 diesel:{label:'🛢️ Diesel/GNR',price:1.75},
 mixed:{label:'🔄 Mixte',price:1.75},
 manual:{label:'🛠️ Sans énergie',price:0}
};

// f = achat HT, h = durée de vie indicative en heures, m = entretien/réparations €/h,
// a = assurance/frais €/h, k = énergie consommée par heure (kWh ou L), fuel = type d'énergie.
const MACHINES={
'Débroussailleuse':{f:900,h:1200,m:1.5,a:.2,k:0.8,fuel:'thermal2',tags:['Espaces verts','Nettoyage']},
'Taille-haie':{f:750,h:1200,m:1.2,a:.15,k:.5,fuel:'thermal2',tags:['Espaces verts']},
'Tronçonneuse':{f:800,h:1000,m:1.6,a:.2,k:.7,fuel:'thermal2',tags:['Élagage','Espaces verts']},
'Tondeuse':{f:1800,h:1500,m:1.7,a:.2,k:1,fuel:'thermal4',tags:['Espaces verts']},
'Tondeuse autoportée':{f:9000,h:2500,m:4,a:.8,k:4,fuel:'thermal4',tags:['Espaces verts']},
'Souffleur':{f:500,h:1000,m:1,k:.6,fuel:'thermal2',tags:['Espaces verts','Nettoyage']},
'Broyeur de végétaux':{f:6500,h:2200,m:4,a:.8,k:3.2,fuel:'thermal4',tags:['Espaces verts','Élagage']},
'Rogneuse de souche':{f:12000,h:2500,m:5,a:1,k:4,fuel:'thermal4',tags:['Élagage']},
'Fendeuse à bois':{f:3500,h:1800,m:2,a:.4,k:2.2,fuel:'electric',tags:['Élagage','Espaces verts']},
'Pulvérisateur':{f:600,h:1000,m:.8,a:.1,k:.2,fuel:'battery',tags:['Espaces verts','Nettoyage']},
'Tarière':{f:1800,h:1000,m:1.5,a:.2,k:.8,fuel:'thermal2',tags:['Espaces verts','Terrassement']},
'Rotavator / motoculteur':{f:3500,h:1800,m:2.5,a:.4,k:1.8,fuel:'thermal4',tags:['Espaces verts','Terrassement']},
'Bétonnière':{f:1200,h:1800,m:1.2,a:.15,k:1.5,fuel:'electric',tags:['Maçonnerie','Rénovation']},
'Bétonnière thermique':{f:1800,h:1800,m:1.8,a:.2,k:1.2,fuel:'thermal4',tags:['Maçonnerie']},
'Perforateur':{f:700,h:1400,m:.8,a:.1,k:1.2,fuel:'electric',tags:['Maçonnerie','Rénovation','Électricité','Plomberie']},
'Marteau-piqueur':{f:900,h:1300,m:1,a:.12,k:1.6,fuel:'electric',tags:['Maçonnerie','Démolition']},
'Scie à béton':{f:1800,h:1200,m:1.8,a:.2,k:2.5,fuel:'electric',tags:['Maçonnerie','Démolition']},
'Scie à sol':{f:2500,h:1400,m:2,a:.25,k:3,fuel:'electric',tags:['Maçonnerie','Terrassement']},
'Scie circulaire':{f:450,h:1300,m:.6,a:.08,k:1.4,fuel:'electric',tags:['Menuiserie','Rénovation']},
'Scie sauteuse':{f:250,h:1000,m:.4,a:.05,k:.7,fuel:'electric',tags:['Menuiserie','Rénovation']},
'Mélangeur électrique':{f:350,h:1200,m:.5,a:.06,k:1,fuel:'electric',tags:['Peinture','Maçonnerie','Rénovation']},
'Ponceuse':{f:500,h:1200,m:.7,a:.08,k:1,fuel:'electric',tags:['Peinture','Menuiserie','Rénovation']},
'Girafe à poncer':{f:1100,h:1200,m:1,a:.12,k:1.2,fuel:'electric',tags:['Peinture','Plâtrerie','Rénovation']},
'Airless peinture':{f:1800,h:1400,m:1.2,a:.15,k:1.8,fuel:'electric',tags:['Peinture']},
'Compresseur':{f:1200,h:1600,m:1.2,a:.15,k:2.2,fuel:'electric',tags:['Peinture','Plomberie','Rénovation']},
'Pistolet thermique':{f:100,h:900,m:.2,a:.03,k:1.8,fuel:'electric',tags:['Peinture','Rénovation']},
'Nettoyeur haute pression':{f:900,h:1400,m:.8,a:.1,k:2.5,fuel:'electric',tags:['Nettoyage','Espaces verts']},
'Aspirateur chantier':{f:700,h:1500,m:.5,a:.08,k:1.2,fuel:'electric',tags:['Nettoyage','Rénovation']},
'Injecteur-extracteur':{f:900,h:1200,m:.7,a:.08,k:1.4,fuel:'electric',tags:['Nettoyage']},
'Autolaveuse':{f:6500,h:2500,m:2,a:.5,k:2.5,fuel:'battery',tags:['Nettoyage']},
'Machine monobrosse':{f:1500,h:1800,m:1,a:.15,k:1.5,fuel:'electric',tags:['Nettoyage']},
'Pompe de relevage':{f:600,h:1300,m:.7,a:.08,k:1.5,fuel:'electric',tags:['Plomberie','Terrassement']},
'Caméra inspection canalisation':{f:3500,h:1800,m:.8,a:.3,k:.2,fuel:'battery',tags:['Plomberie']},
'Déboucheur électrique':{f:1400,h:1300,m:1,a:.15,k:1.2,fuel:'electric',tags:['Plomberie']},
'Pince à sertir électrique':{f:1800,h:1500,m:.8,a:.1,k:.8,fuel:'battery',tags:['Plomberie']},
'Pince à sertir multicouche':{f:700,h:1600,m:.4,a:.05,k:0,fuel:'manual',tags:['Plomberie']},
'Coupe-tube électrique':{f:500,h:1300,m:.3,a:.04,k:.5,fuel:'battery',tags:['Plomberie']},
'Testeur électrique':{f:500,h:1800,m:.2,a:.04,k:.1,fuel:'battery',tags:['Électricité']},
'Perceuse-visseuse':{f:400,h:1200,m:.4,a:.05,k:.8,fuel:'battery',tags:['Électricité','Menuiserie','Rénovation']},
'Visseuse à choc':{f:450,h:1200,m:.4,a:.05,k:.8,fuel:'battery',tags:['Électricité','Menuiserie','Rénovation']},
'Rainureuse':{f:900,h:1100,m:1,a:.1,k:1.8,fuel:'electric',tags:['Électricité','Plomberie']},
'Carotteuse':{f:2500,h:1200,m:1.8,a:.25,k:2.2,fuel:'electric',tags:['Électricité','Plomberie','Maçonnerie']},
'Laser de chantier':{f:650,h:1600,m:.2,a:.06,k:.1,fuel:'battery',tags:['Maçonnerie','Électricité','Rénovation']},
'Laser rotatif':{f:1200,h:1800,m:.3,a:.1,k:.1,fuel:'battery',tags:['Terrassement','Maçonnerie']},
'Mini-pelle 1–2 t':{f:30000,h:6000,m:4,a:1.5,k:3.5,fuel:'diesel',tags:['Terrassement','Démolition','Espaces verts']},
'Mini-pelle 2–3,5 t':{f:45000,h:6000,m:5,a:2,k:4.5,fuel:'diesel',tags:['Terrassement','Démolition']},
'Pelle 5 t':{f:70000,h:7000,m:7,a:2.5,k:6,fuel:'diesel',tags:['Terrassement','Démolition']},
'Chargeuse compacte':{f:55000,h:6000,m:5,a:2,k:5,fuel:'diesel',tags:['Terrassement']},
'Plaque vibrante':{f:1800,h:1800,m:1.3,a:.2,k:.7,fuel:'thermal2',tags:['Terrassement','Maçonnerie']},
'Pilonneuse':{f:2200,h:1800,m:1.5,a:.2,k:.7,fuel:'thermal2',tags:['Terrassement']},
'Rouleau compacteur':{f:12000,h:3500,m:3,a:.6,k:2.5,fuel:'diesel',tags:['Terrassement']},
'Camion-benne 3,5 t':{f:35000,h:5000,m:3,a:1.5,k:8,fuel:'diesel',tags:['Terrassement','Démolition','Nettoyage','Élagage']},
'Utilitaire':{f:30000,h:5000,m:2,a:1,k:7,fuel:'diesel',tags:['Tous métiers']},
'Remorque':{f:5000,h:2500,m:.8,a:.2,k:0,fuel:'manual',tags:['Tous métiers']},
'Benne déchets':{f:0,h:0,m:0,a:0,k:0,fuel:'manual',rental:25,tags:['Déchets','Démolition']},
'Échafaudage léger':{f:2500,h:3000,m:.3,a:.2,k:0,fuel:'manual',tags:['Peinture','Rénovation','Élagage']},
'Nacelle':{f:30000,h:5000,m:3,a:2,k:4,fuel:'diesel',tags:['Élagage','Peinture','Électricité']},
'Échelle professionnelle':{f:450,h:2500,m:.1,a:.03,k:0,fuel:'manual',tags:['Tous métiers']},
'Groupe électrogène':{f:2500,h:2000,m:1.2,a:.2,k:1.8,fuel:'thermal4',tags:['Électricité','Rénovation','Tous métiers']},
'Brouette motorisée':{f:5000,h:1800,m:2,a:.3,k:1.2,fuel:'thermal4',tags:['Terrassement','Espaces verts']}
};

const TRADE_TOOLS={
'Espaces verts':['Tondeuse','Débroussailleuse','Taille-haie','Souffleur','Broyeur de végétaux','Rotavator / motoculteur','Tarière','Utilitaire'],
'Élagage / abattage':['Tronçonneuse','Nacelle','Rogneuse de souche','Broyeur de végétaux','Échelle professionnelle','Utilitaire'],
'Maçonnerie / gros œuvre':['Bétonnière','Perforateur','Marteau-piqueur','Scie à béton','Mélangeur électrique','Laser de chantier','Plaque vibrante','Utilitaire'],
'Rénovation':['Perforateur','Ponceuse','Aspirateur chantier','Perceuse-visseuse','Laser de chantier','Échafaudage léger','Utilitaire'],
'Peinture':['Airless peinture','Girafe à poncer','Ponceuse','Compresseur','Échafaudage léger','Aspirateur chantier','Utilitaire'],
'Plomberie':['Perforateur','Caméra inspection canalisation','Déboucheur électrique','Pince à sertir électrique','Carotteuse','Pompe de relevage','Utilitaire'],
'Électricité':['Perceuse-visseuse','Rainureuse','Carotteuse','Testeur électrique','Laser de chantier','Groupe électrogène','Échelle professionnelle','Utilitaire'],
'Terrassement':['Mini-pelle 1–2 t','Mini-pelle 2–3,5 t','Plaque vibrante','Pilonneuse','Laser rotatif','Camion-benne 3,5 t','Brouette motorisée'],
'Nettoyage':['Nettoyeur haute pression','Aspirateur chantier','Injecteur-extracteur','Autolaveuse','Machine monobrosse','Utilitaire'],
'Démolition':['Marteau-piqueur','Perforateur','Scie à béton','Aspirateur chantier','Camion-benne 3,5 t','Benne déchets'],
'Menuiserie':['Scie circulaire','Scie sauteuse','Ponceuse','Perceuse-visseuse','Visseuse à choc','Aspirateur chantier','Utilitaire'],
'Carrelage':['Perforateur','Scie à sol','Mélangeur électrique','Laser de chantier','Aspirateur chantier','Utilitaire'],
'Plâtrerie / placo':['Perceuse-visseuse','Girafe à poncer','Ponceuse','Aspirateur chantier','Laser de chantier','Échafaudage léger'],
'Clôtures':['Perforateur','Perceuse-visseuse','Tarière','Laser de chantier','Bétonnière','Utilitaire'],
'Autre':['Perceuse-visseuse','Perforateur','Aspirateur chantier','Échelle professionnelle','Utilitaire']
};

function inferTrade(){
 const x=(V('metier')||V('pf')||'Autre').toLowerCase();
 if(x.includes('espace'))return'Espaces verts';
 if(x.includes('élag')||x.includes('abatt'))return'Élagage / abattage';
 if(x.includes('maçonn'))return'Maçonnerie / gros œuvre';
 if(x.includes('peint'))return'Peinture';
 if(x.includes('plomb'))return'Plomberie';
 if(x.includes('élect'))return'Électricité';
 if(x.includes('terrass'))return'Terrassement';
 if(x.includes('nettoy'))return'Nettoyage';
 if(x.includes('rénov'))return'Rénovation';
 return'Autre';
}
function annualCostPerHour(p){
 if(!p.h)return 0;
 return p.f/p.h+p.m+p.a;
}
function energyCostPerHour(p,mode){
 const e=ENERGY[mode]||ENERGY[p.fuel]||ENERGY.electric;
 if(!p.k)return 0;
 let k=p.k;
 if(mode==='battery')k*=.65;
 if(mode==='mixed')return p.k*((ENERGY[p.fuel]?.price||1.75)+ENERGY.electric.price)/2;
 return k*e.price;
}
function autoCost(name,hours,mode,quantity=1){
 const p=MACHINES[name]||MACHINES['Autre'];
 if(p.rental)return p.rental*Math.max(1,Math.ceil(hours/8))*quantity;
 return Math.max(0,(annualCostPerHour(p)+energyCostPerHour(p,mode))*Math.max(0,hours)*quantity);
}
function modeOptions(p){
 const modes=['electric','battery','thermal2','thermal4','diesel','mixed','manual'];
 return modes.filter(k=>k==='manual'||k===p.fuel||p.fuel==='manual'||(k==='battery'&&p.fuel==='electric')||k==='mixed');
}
function setToolOptions(trade){
 const sel=document.getElementById('tn');if(!sel)return;
 const list=[...(TRADE_TOOLS[trade]||TRADE_TOOLS.Autre),...Object.keys(MACHINES)];
 const unique=[...new Set(list)];
 const current=sel.value;
 sel.innerHTML=unique.map(n=>`<option>${n}</option>`).join('');
 if(unique.includes(current))sel.value=current;
 refreshToolMode();
}
function ensureUI(){
 const old=document.getElementById('tc');if(!old)return;
 old.readOnly=true;old.placeholder='Calcul automatique';
 let mode=document.getElementById('tenergy');
 if(!mode){mode=document.createElement('select');mode.id='tenergy';mode.style.marginTop='4px';old.parentNode.insertBefore(mode,old);}
 let qty=document.getElementById('tqty');
 if(!qty){qty=document.createElement('input');qty.id='tqty';qty.type='number';qty.min='1';qty.step='1';qty.value='1';qty.placeholder='Quantité';old.parentNode.insertBefore(qty,old);}
 let note=document.getElementById('toolAutoNote');
 if(!note){note=document.createElement('small');note.id='toolAutoNote';note.className='muted';old.parentNode.appendChild(note);}
 ['tn','th','tenergy','tqty'].forEach(id=>document.getElementById(id)?.addEventListener('input',refreshToolMode));
 document.getElementById('tn')?.addEventListener('change',refreshToolMode);
 document.getElementById('tenergy')?.addEventListener('change',refreshToolMode);
 const title=old.closest('.card')?.querySelector('h2');if(title)title.innerHTML='🧰 Outils, machines et engins — calcul universel';
}
function refreshToolMode(){
 const n=V('tn'),p=MACHINES[n]||MACHINES['Autre'],mode=document.getElementById('tenergy'),h=+V('th')||0,q=+V('tqty')||1;
 if(!mode)return;
 const opts=modeOptions(p);const cur=mode.value;mode.innerHTML=opts.map(k=>`<option value="${k}">${ENERGY[k].label}</option>`).join('');
 if(opts.includes(cur))mode.value=cur;
 const c=autoCost(n,h,mode.value,q);document.getElementById('tc').value=c?c.toFixed(2):'';
 const parts=[];const ah=annualCostPerHour(p);if(ah)parts.push(`amortissement+entretien+assurance ${ah.toFixed(2)} €/h`);const eh=energyCostPerHour(p,mode.value);if(eh)parts.push(`énergie ${eh.toFixed(2)} €/h`);if(p.rental)parts.push(`location ${p.rental} €/jour indicatif`);
 document.getElementById('toolAutoNote').textContent=c?`Automatique : ${E(c)} pour ${q} × ${h} h · ${parts.join(' · ')}`:'Choisissez la durée : le coût se calcule automatiquement.';
}
function replaceAddTool(){
 window.addTool=function(){const n=V('tn'),h=+V('th')||0,q=+V('tqty')||1,mode=document.getElementById('tenergy')?.value||'manual',c=autoCost(n,h,mode,q);if(h<=0||c<=0){alert('Indiquez une durée supérieure à 0 h.');return;}window.tools=window.tools||[];tools.push({n,h,c,energy:mode,quantity:q,automatic:true});document.getElementById('th').value='';document.getElementById('tqty').value='1';document.getElementById('tc').value='';window.toolRender&&toolRender();refreshToolMode();};
}
function improveParticularTool(){
 const sel=document.getElementById('pt');if(!sel)return;
 const trade=inferTrade(),list=['Aucun',...(TRADE_TOOLS[trade]||[])];sel.innerHTML=[...new Set(list)].map(x=>`<option>${x}</option>`).join('');
}
function install(){
 ensureUI();setToolOptions(inferTrade());replaceAddTool();improveParticularTool();
 const met=document.getElementById('metier');met?.addEventListener('change',()=>{setToolOptions(inferTrade());improveParticularTool();});
 const pf=document.getElementById('pf');pf?.addEventListener('change',()=>{improveParticularTool();});
 // Expose a small diagnostic API for future extensions.
 window.ChifrEcoEngine={MACHINES,TRADE_TOOLS,ENERGY,autoCost,annualCostPerHour,energyCostPerHour};
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})();
