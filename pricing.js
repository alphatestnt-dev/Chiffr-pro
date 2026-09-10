(()=>{
/* Chifr’Eco Pro — catalogue métiers/outils et coût de revient indicatif.
   Méthode : amortissement horaire + entretien + énergie. Les valeurs sont des bases indicatives,
   modifiables ultérieurement selon l’entreprise, le matériel, le contrat d’énergie et le carburant. */
const energy={electric:0.20, petrol:2.15, diesel:2.30, e85:0.88};
const tools={
 'Débroussailleuse':{p:900,h:700,m:1.1,k:0.9,f:'petrol',fuel:0.65},'Taille-haie':{p:700,h:700,m:0.9,k:0.6,f:'petrol',fuel:0.45},'Tronçonneuse':{p:850,h:600,m:1.1,k:0.9,f:'petrol',fuel:0.55},'Tondeuse':{p:1800,h:900,m:1.3,k:0.7,f:'petrol',fuel:0.7},'Souffleur':{p:600,h:650,m:0.8,k:0.5,f:'petrol',fuel:0.45},'Taille-haie électrique':{p:450,h:800,m:0.6,k:0.7,f:'electric'},'Débroussailleuse batterie':{p:750,h:700,m:0.8,k:0.8,f:'electric'},'Tronçonneuse batterie':{p:650,h:600,m:0.8,k:0.9,f:'electric'},
 'Bétonnière':{p:1800,h:1200,m:0.9,k:1.0,f:'electric'},'Perforateur':{p:650,h:900,m:0.5,k:0.6,f:'electric'},'Marteau-piqueur':{p:1100,h:700,m:0.9,k:0.8,f:'electric'},'Scie à béton':{p:1600,h:650,m:1.1,k:1.2,f:'electric'},'Scie circulaire':{p:500,h:700,m:0.5,k:1.2,f:'electric'},'Scie sabre':{p:450,h:700,m:0.5,k:0.8,f:'electric'},'Scie à onglet':{p:900,h:800,m:0.6,k:1.3,f:'electric'},'Ponceuse':{p:500,h:800,m:0.5,k:1.0,f:'electric'},'Raboteuse':{p:1200,h:900,m:0.8,k:1.5,f:'electric'},'Fraiseuse':{p:1800,h:900,m:1.0,k:1.6,f:'electric'},'Mélangeur':{p:500,h:800,m:0.5,k:0.8,f:'electric'},'Malaxeur à mortier':{p:1200,h:900,m:0.7,k:1.2,f:'electric'},
 'Mini-pelle':{p:30000,h:5000,m:7,k:0,f:'diesel',fuel:6},'Pelle mécanique':{p:110000,h:7000,m:15,k:0,f:'diesel',fuel:12},'Chargeuse':{p:70000,h:6000,m:10,k:0,f:'diesel',fuel:8},'Bobcat / chargeuse compacte':{p:45000,h:5000,m:8,k:0,f:'diesel',fuel:6},'Tractopelle':{p:85000,h:6500,m:12,k:0,f:'diesel',fuel:9},'Plaque vibrante':{p:1800,h:1200,m:0.9,k:0,f:'petrol',fuel:0.7},'Pilonneuse':{p:2200,h:1200,m:1.0,k:0,f:'petrol',fuel:0.8},'Rouleau compacteur':{p:25000,h:3500,m:5,k:0,f:'diesel',fuel:5},'Laser chantier':{p:900,h:1000,m:0.2,k:0.05,f:'electric'},'Niveau laser':{p:500,h:900,m:0.15,k:0.03,f:'electric'},
 'Nettoyeur haute pression':{p:1200,h:800,m:0.7,k:2.5,f:'electric'},'Aspirateur chantier':{p:700,h:900,m:0.5,k:1.3,f:'electric'},'Monobrosse':{p:1800,h:1200,m:0.8,k:1.8,f:'electric'},'Autolaveuse':{p:7000,h:1800,m:2.5,k:3.0,f:'electric'},'Injecteur-extracteur':{p:1500,h:900,m:0.7,k:1.5,f:'electric'},'Machine vapeur':{p:1200,h:800,m:0.6,k:2.2,f:'electric'},'Shampouineuse':{p:700,h:700,m:0.5,k:1.2,f:'electric'},
 'Pistolet à peinture':{p:600,h:700,m:0.5,k:0.8,f:'electric'},'Compresseur':{p:1200,h:900,m:0.7,k:2.0,f:'electric'},'Pompe à peinture':{p:1800,h:900,m:0.8,k:1.5,f:'electric'},'Décapeur thermique':{p:180,h:600,m:0.2,k:1.8,f:'electric'},'Décolleuse papier peint':{p:250,h:500,m:0.2,k:1.5,f:'electric'},
 'Rainureuse':{p:900,h:700,m:0.7,k:1.8,f:'electric'},'Carotteuse':{p:2500,h:700,m:1.4,k:2.0,f:'electric'},'Aiguille vibrante':{p:700,h:800,m:0.5,k:1.0,f:'electric'},'Règle vibrante':{p:1400,h:900,m:0.6,k:1.2,f:'electric'},'Talocheuse mécanique':{p:3500,h:1200,m:1.5,k:0,f:'petrol',fuel:1.2},
 'Échafaudage léger':{p:2500,h:1500,m:0.6,k:0,f:'none'},'Échelle':{p:500,h:1200,m:0.2,k:0,f:'none'},'Nacelle':{p:35000,h:4000,m:5,k:0,f:'diesel',fuel:5},'Élévateur':{p:22000,h:3500,m:3.5,k:0,f:'diesel',fuel:3.5},
 'Camionnette':{p:30000,h:5000,m:3.5,k:0,f:'diesel',fuel:7},'Camion benne':{p:70000,h:6000,m:7,k:0,f:'diesel',fuel:12},'Remorque':{p:6000,h:2500,m:0.7,k:0,f:'none'},'Benne chantier':{p:5000,h:1500,m:0.8,k:0,f:'none'},'Broyeur de végétaux':{p:7000,h:1800,m:2.5,k:0,f:'petrol',fuel:2.2},'Rogneuse de souche':{p:18000,h:2500,m:4,k:0,f:'petrol',fuel:4},
 'Détecteur de fuite':{p:2500,h:800,m:0.5,k:0.2,f:'electric'},'Caméra thermique':{p:2500,h:800,m:0.5,k:0.1,f:'electric'},'Caméra inspection canalisation':{p:2500,h:800,m:0.5,k:0.2,f:'electric'},'Détecteur électrique':{p:700,h:900,m:0.2,k:0.05,f:'electric'},'Pompe de relevage':{p:900,h:900,m:0.4,k:1.0,f:'electric'},'Pompe à eau':{p:900,h:900,m:0.5,k:0,f:'petrol',fuel:0.8},'Déshumidificateur chantier':{p:1200,h:1000,m:0.5,k:1.0,f:'electric'},'Ventilateur chantier':{p:400,h:1000,m:0.2,k:0.4,f:'electric'},
 'Poste à souder':{p:1200,h:800,m:0.7,k:3.0,f:'electric'},'Meuleuse':{p:250,h:700,m:0.3,k:0.9,f:'electric'},'Plasma':{p:2500,h:700,m:1.0,k:4.0,f:'electric'},'Perceuse':{p:250,h:800,m:0.3,k:0.7,f:'electric'},'Visseuse':{p:300,h:900,m:0.3,k:0.5,f:'electric'},'Cloueur':{p:500,h:800,m:0.4,k:0.4,f:'electric'},'Ponceuse à bande':{p:600,h:800,m:0.5,k:1.2,f:'electric'},'Découpeuse thermique':{p:1000,h:600,m:0.9,k:0,f:'petrol',fuel:0.8},
 'Autre outil électrique':{p:600,h:800,m:0.5,k:0.8,f:'electric'},'Autre outil batterie':{p:700,h:800,m:0.5,k:0.5,f:'electric'},'Autre outil thermique 2T':{p:900,h:700,m:0.8,k:0,f:'petrol',fuel:0.6},'Autre outil thermique 4T':{p:1400,h:900,m:1.0,k:0,f:'petrol',fuel:0.9},'Outillage spécialisé':{p:1500,h:900,m:0.8,k:0.8,f:'electric'}
};
const extra={
'Couverture / toiture':['Recherche fuite','Réparation toiture','Pose couverture','Étanchéité','Zinguerie'],
'Charpente':['Réparation charpente','Pose charpente','Traitement bois','Renforcement'],
'Menuiserie':['Pose porte','Pose fenêtre','Agencement','Réparation bois','Escalier'],
'Plâtrerie / placo':['Cloison','Doublage','Faux plafond','Bandes / joints','Isolation intérieure'],
'Carrelage / faïence':['Sol','Mur','Douche','Terrasse','Dépose'],
'Sols / parquet':['Parquet','Stratifié','PVC / vinyle','Ponçage','Ragréage'],
'Isolation':['Murs','Combles','Plancher','Isolation extérieure','Dépose isolation'],
'Chauffage / climatisation':['Dépannage','Pose chauffage','Climatisation','Pompe à chaleur','Entretien'],
'Ventilation':['VMC','Ventilation simple flux','Ventilation double flux','Nettoyage réseau'],
'Étanchéité':['Toiture','Terrasse','Salle de bain','Fondations'],
'Démolition / dépose':['Dépose intérieure','Démolition mur','Démolition dalle','Évacuation'],
'Verdure / arboriculture':['Entretien','Taille','Abattage','Dessouchage','Broyage'],
'Débarras / évacuation':['Débarras maison','Cave / garage','Encombrants','Évacuation chantier'],
'Nettoyage spécialisé':['Fin de chantier','Vitres','Façades','Graffiti','Syndrome Diogène'],
'Métallerie / serrurerie':['Serrurerie','Garde-corps','Portail','Soudure','Réparation'],
'Piscine':['Entretien','Réparation','Terrasse piscine','Local technique'],
'Clôture / portail':['Clôture','Portail','Grillage','Brise-vue'],
'Voirie / réseaux':['Tranchée','Réseaux','Pavage','Enrobé','Réfection'],
'Assainissement':['Canalisation','Fosse','Drainage','Pompage','Recherche fuite'],
'Peinture / décoration':['Murs','Plafonds','Façade','Boiseries','Décoration']
};
const baseMargins={'Espaces verts':35,'Élagage / abattage':40,'Maçonnerie / gros œuvre':35,'Rénovation':35,'Peinture':35,'Plomberie':38,'Électricité':38,'Terrassement':40,'Nettoyage':32,'Couverture / toiture':40,'Charpente':40,'Menuiserie':38,'Plâtrerie / placo':35,'Carrelage / faïence':38,'Sols / parquet':35,'Isolation':35,'Chauffage / climatisation':40,'Ventilation':38,'Étanchéité':40,'Démolition / dépose':40,'Métallerie / serrurerie':40,'Piscine':38,'Clôture / portail':35,'Voirie / réseaux':40,'Assainissement':40,'Débarras / évacuation':35,'Nettoyage spécialisé':38,'Autre':35};
function addOpt(sel,name){if(sel&&!Array.from(sel.options).some(o=>o.value===name||o.textContent===name)){const o=document.createElement('option');o.textContent=name;o.value=name;sel.appendChild(o)}}
function expandCatalog(){
 const professions=Object.keys(extra); const pro=document.getElementById('metier'),part=document.getElementById('pf'); professions.forEach(x=>{addOpt(pro,x);addOpt(part,x)});
 professions.forEach(x=>{if(typeof pdata!=='undefined'&&!pdata[x])pdata[x]={s:extra[x],e:['État courant','Bon état','Dégradé','Très dégradé','Accès difficile','Très difficile'],b:60}});
 const tn=document.getElementById('tn'); if(tn){const keep=Array.from(tn.options).map(o=>o.textContent);Object.keys(tools).forEach(x=>{if(!keep.includes(x))addOpt(tn,x)})}
 if(typeof profession==='function')profession();if(typeof pSub==='function')pSub();
 setMargin(true);
}
let marginManual=false;
function setMargin(force){const el=document.getElementById('margin');if(!el)return;const m=baseMargins[document.getElementById('metier')?.value]||35;if(force||!marginManual){el.value=m;el.title='Marge cible recommandée selon le métier. Vous pouvez la modifier.'}}
function calcToolCost(){const n=V('tn'),h=+V('th')||0,p=tools[n]||tools['Outillage spécialisé'],mode=document.getElementById('tenergy')?.value||'auto';if(!p||!h)return 0;let energy=0;if(p.f==='electric'){energy=p.k*energyPrice('electric')}else if(p.f==='petrol'){const fuel=mode==='thermal4'?Math.max(.01,p.fuel):mode==='thermal2'?p.fuel:mode==='mixed'?p.fuel*.5:p.fuel;energy=fuel*energyPrice('petrol')}else if(p.f==='diesel')energy=p.fuel*energyPrice('diesel');const depreciation=p.p/p.h;return h*(depreciation+p.m+energy)}
function energyPrice(k){return energy[k]||0}
function installPricing(){const margin=document.getElementById('margin');if(margin){margin.addEventListener('input',()=>marginManual=true);const met=document.getElementById('metier');met?.addEventListener('change',()=>setMargin(false));setMargin(true)}
 const tc=document.getElementById('tc'),tn=document.getElementById('tn'),th=document.getElementById('th');if(tc&&tn&&th){tc.readOnly=true;tc.placeholder='Calcul automatique';let mode=document.getElementById('tenergy');if(!mode){mode=document.createElement('select');mode.id='tenergy';mode.innerHTML='<option value="auto">Calcul automatique</option><option value="electric">⚡ Électrique</option><option value="battery">🔋 Batterie</option><option value="thermal2">🔥 Thermique 2T — mélange</option><option value="thermal4">🔥 Thermique 4T — essence</option>';tc.parentNode.insertBefore(mode,tc)}const note=document.createElement('small');note.className='muted';note.id='pricingNote';tc.parentNode.appendChild(note);const refresh=()=>{let c=calcToolCost();if(mode.value==='battery'&&tools[V('tn')]?.f==='electric')c*=.9;tc.value=c?c.toFixed(2):'';note.textContent=c?'Coût indicatif calculé sur durée + amortissement + entretien + énergie.':'Saisissez une durée.'};tn.addEventListener('change',refresh);th.addEventListener('input',refresh);mode.addEventListener('change',refresh);refresh();}
}
window.ChifrEcoPricing={tools,energy,baseMargins,refresh:installPricing};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{expandCatalog();installPricing()});else{expandCatalog();installPricing()}
})();