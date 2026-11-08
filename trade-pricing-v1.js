/* ChiffrecoPro — profils métier / prestation / matériel.
   Principe de prudence : aucune productivité ni aucun prix n'est inventé.
   Une référence tarifaire n'est applicable que si le triplet exact est documenté.
*/
(()=>{'use strict';
 const $=id=>document.getElementById(id);
 const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
 const profiles={
  'Espaces verts':{
   'Tonte':{unit:'m²',equipment:['Tondeuse','Tondeuse autoportée','Tracteur tondeuse']},
   'Débroussaillage':{unit:'m²',equipment:['Débroussailleuse','Débroussailleuse batterie','Débroussailleuse à bras / épareuse']},
   'Taille de haie':{unit:'mètre',equipment:['Taille-haie','Taille-haie électrique','Taille-haie sur perche']},
   'Désherbage':{unit:'m²',equipment:['Désherbeur thermique','Désherbeur mécanique','Outillage spécialisé']},
   'Plantation':{unit:'unité',equipment:['Tarière','Mini-pelle','Outillage spécialisé']},
   'Création de massif':{unit:'m²',equipment:['Mini-pelle','Motoculteur','Outillage spécialisé']},
   'Arrosage':{unit:'forfait',equipment:['Outillage spécialisé']},
   'Broyage végétaux':{unit:'m³',equipment:['Broyeur de végétaux']},
   'Remise en état':{unit:'forfait',equipment:['Débroussailleuse','Tondeuse','Broyeur de végétaux','Outillage spécialisé']}
  },
  'Élagage / abattage':{
   'Élagage':{unit:'unité',equipment:['Tronçonneuse','Tronçonneuse batterie','Nacelle']},
   'Abattage':{unit:'unité',equipment:['Tronçonneuse','Tronçonneuse batterie','Nacelle']},
   'Dessouchage':{unit:'unité',equipment:['Rogneuse de souche','Mini-pelle']},
   'Évacuation bois':{unit:'m³',equipment:['Camionnette','Camion benne','Remorque']},
   'Broyage':{unit:'m³',equipment:['Broyeur de végétaux']}
  },
  'Maçonnerie / gros œuvre':{
   'Dalle béton':{unit:'m²',equipment:['Bétonnière','Malaxeur à mortier','Laser chantier','Plaque vibrante']},
   'Mur / parpaing':{unit:'m²',equipment:['Bétonnière','Malaxeur à mortier','Laser chantier']},
   'Fondations':{unit:'m³',equipment:['Mini-pelle','Pelle mécanique','Bétonnière']},
   'Dépose / démolition':{unit:'m²',equipment:['Marteau-piqueur','Perforateur','Mini-pelle']}
  },
  'Terrassement':{
   'Décaissement':{unit:'m³',equipment:['Mini-pelle','Pelle mécanique','Bobcat / chargeuse compacte']},
   'Tranchée':{unit:'mètre',equipment:['Mini-pelle','Pelle mécanique','Tractopelle']},
   'Nivellement':{unit:'m²',equipment:['Mini-pelle','Chargeuse','Laser chantier']},
   'Fondations':{unit:'m³',equipment:['Mini-pelle','Pelle mécanique','Tractopelle']},
   'Évacuation terre':{unit:'m³',equipment:['Camion benne','Chargeuse','Mini-pelle']}
  },
  'Nettoyage':{
   'Nettoyage courant':{unit:'m²',equipment:['Aspirateur chantier','Autolaveuse','Outillage spécialisé']},
   'Fin de chantier':{unit:'m²',equipment:['Aspirateur chantier','Nettoyeur haute pression','Autolaveuse']},
   'Vitres':{unit:'m²',equipment:['Outillage spécialisé','Nacelle']},
   'Façades':{unit:'m²',equipment:['Nettoyeur haute pression','Nacelle']},
   'Nettoyage lourd':{unit:'m²',equipment:['Nettoyeur haute pression','Aspirateur chantier','Machine vapeur']}
  },
  'Peinture':{
   'Murs':{unit:'m²',equipment:['Pistolet à peinture','Pompe à peinture','Outillage spécialisé']},
   'Plafonds':{unit:'m²',equipment:['Pistolet à peinture','Pompe à peinture','Échafaudage léger']},
   'Façade':{unit:'m²',equipment:['Pistolet à peinture','Pompe à peinture','Nacelle']},
   'Boiseries':{unit:'m²',equipment:['Ponceuse','Pistolet à peinture','Outillage spécialisé']}
  },
  'Plomberie':{
   'Canalisation':{unit:'mètre',equipment:['Perforateur','Rainureuse','Outillage spécialisé']},
   'Salle de bain':{unit:'forfait',equipment:['Perforateur','Scie circulaire','Outillage spécialisé']},
   'Installation sanitaire':{unit:'unité',equipment:['Perforateur','Outillage spécialisé']}
  },
  'Électricité':{
   'Prises / éclairage':{unit:'unité',equipment:['Perforateur','Rainureuse','Outillage spécialisé']},
   'Tableau électrique':{unit:'unité',equipment:['Outillage spécialisé']},
   'Installation complète':{unit:'forfait',equipment:['Outillage spécialisé']}
  },
  'Couverture / toiture':{
   'Pose couverture':{unit:'m²',equipment:['Échafaudage léger','Nacelle','Outillage spécialisé']},
   'Réparation toiture':{unit:'forfait',equipment:['Échelle','Échafaudage léger','Nacelle']}
  },
  'Menuiserie':{
   'Pose porte':{unit:'unité',equipment:['Perceuse','Visseuse','Scie circulaire']},
   'Pose fenêtre':{unit:'unité',equipment:['Perceuse','Visseuse','Scie sabre']},
   'Agencement':{unit:'forfait',equipment:['Scie circulaire','Ponceuse','Visseuse']}
  },
  'Plâtrerie / placo':{
   'Cloison':{unit:'m²',equipment:['Visseuse','Laser chantier','Outillage spécialisé']},
   'Doublage':{unit:'m²',equipment:['Visseuse','Laser chantier','Outillage spécialisé']},
   'Faux plafond':{unit:'m²',equipment:['Visseuse','Laser chantier','Échafaudage léger']}
  },
  'Carrelage / faïence':{
   'Sol':{unit:'m²',equipment:['Scie à béton','Meuleuse','Outillage spécialisé']},
   'Mur':{unit:'m²',equipment:['Meuleuse','Outillage spécialisé']},
   'Terrasse':{unit:'m²',equipment:['Scie à béton','Plaque vibrante','Outillage spécialisé']}
  },
  'Sols / parquet':{
   'Parquet':{unit:'m²',equipment:['Scie circulaire','Scie sabre','Ponceuse']},
   'Ponçage':{unit:'m²',equipment:['Ponceuse','Aspirateur chantier']}
  },
  'Isolation':{
   'Murs':{unit:'m²',equipment:['Scie circulaire','Outillage spécialisé']},
   'Combles':{unit:'m²',equipment:['Outillage spécialisé']},
   'Plancher':{unit:'m²',equipment:['Scie circulaire','Outillage spécialisé']}
  },
  'Clôture / portail':{
   'Clôture':{unit:'mètre',equipment:['Mini-pelle','Perforateur','Bétonnière']},
   'Grillage':{unit:'mètre',equipment:['Mini-pelle','Perforateur','Outillage spécialisé']},
   'Portail':{unit:'unité',equipment:['Perforateur','Poste à souder','Meuleuse']}
  },
  'Voirie / réseaux':{
   'Tranchée':{unit:'mètre',equipment:['Mini-pelle','Pelle mécanique','Tractopelle']},
   'Pavage':{unit:'m²',equipment:['Plaque vibrante','Scie à béton']},
   'Enrobé':{unit:'m²',equipment:['Rouleau compacteur','Plaque vibrante']}
  },
  'Assainissement':{
   'Canalisation':{unit:'mètre',equipment:['Mini-pelle','Pelle mécanique','Laser chantier']},
   'Drainage':{unit:'mètre',equipment:['Mini-pelle','Plaque vibrante']},
   'Pompage':{unit:'forfait',equipment:['Pompe à eau','Pompe de relevage']}
  }
 };
 const machineTasks=new Set(['tonte','debroussaillage','taille de haie','desherbage','plantation','creation de massif','broyage vegetaux','elagage','abattage','dessouchage','decaissement','tranchee','nivellement','fondations','evacuation terre','dalle beton','mur / parpaing','pose couverture','fin de chantier','facade','cloture','grillage','pavage','enrobe','drainage']);
 function render(){
  const profession=$('metier')?.value||'',task=$('prest')?.value||'',sel=$('taskEquipment'),info=$('taskEquipmentInfo'),unit=$('unit'),price=$('unitPrice'),apply=$('priceReferenceApply'),refInfo=$('priceReferenceInfo');
  if(!sel)return;
  const p=profiles[profession]?.[task]||null;
  const choices=p?.equipment||[];
  const previous=sel.value;
  sel.innerHTML='<option value="">Non précisé / matériel manuel</option>'+choices.map(x=>'<option value="'+x.replace(/&/g,'&amp;').replace(/"/g,'&quot;')+'">'+x+'</option>').join('');
  if(choices.includes(previous))sel.value=previous;
  if(p&&unit&&p.unit)unit.value=p.unit;
  const exactKey=norm(profession)+'|'+norm(task)+'|'+norm(sel.value);
  const reference=window.ceTradeToolReferences?.[exactKey]||null;
  const requiresTool=machineTasks.has(norm(task));
  if(requiresTool&&!sel.value){
    info.textContent='Matériel non précisé : aucun rendement automatique. Le prix reste à 0 € tant que l’artisan ne le renseigne pas.';
  }else if(sel.value&&!reference){
    info.textContent='Aucune référence vérifiée pour cette combinaison métier / prestation / matériel. Pas de tarif ni de rendement inventé : saisie libre par l’artisan.';
  }else if(reference){
    info.textContent='Référence vérifiée disponible pour cette combinaison précise. Application facultative et modifiable.';
  }else{
    info.textContent='Aucune machine imposée pour cette prestation. Le tarif reste libre ou basé sur une référence de prestation documentée.';
  }
  if(requiresTool){
    if(apply)apply.disabled=!reference;
    if(refInfo&&!reference)refInfo.textContent='Pas de référence comparable pour le matériel choisi. Le chiffrage reste minimal : saisissez votre propre prix unitaire si nécessaire.';
    if(price&&price.dataset.ceAutoReference==='1'&&!reference){price.value='0';delete price.dataset.ceAutoReference;}
  }
  if(reference&&refInfo)refInfo.textContent='Référence indicative : '+reference.price+' € / '+reference.unit+' HT — source : '+reference.source+'.';
 }
 window.ceTradeToolReferences={};
 window.ceApplyTradeToolReference=()=>{
  const sel=$('taskEquipment'),key=norm($('metier')?.value)+'|'+norm($('prest')?.value)+'|'+norm(sel?.value),r=window.ceTradeToolReferences[key];
  if(!r)return;
  if($('unit'))$('unit').value=r.unit;
  if($('unitPrice')){$('unitPrice').value=String(r.price);$('unitPrice').dataset.ceAutoReference='1';}
 };
 document.addEventListener('DOMContentLoaded',()=>{
  ['metier','prest'].forEach(id=>$(id)?.addEventListener('change',render));
  $('taskEquipment')?.addEventListener('change',render);
  $('unitPrice')?.addEventListener('input',()=>{if($('unitPrice'))delete $('unitPrice').dataset.ceAutoReference;});
  const old=window.ceApplyPriceReference;
  window.ceApplyPriceReference=()=>{
   const task=norm($('prest')?.value),requires=machineTasks.has(task);
   if(requires){window.ceApplyTradeToolReference();return;}
   old?.();
  };
  render();
 });
})();