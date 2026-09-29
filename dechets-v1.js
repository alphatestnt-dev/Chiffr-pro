(()=>{'use strict';
const escD=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const rules={
verts:['Déchets verts','Broyage, réemploi du broyat ou filière végétale locale.','Sous conditions'],
gravats:['Gravats / béton / minéraux','PMCB : reprise sans frais possible lorsque les conditions de collecte séparée et de reprise sont remplies.','Sous conditions'],
bois:['Bois','Tri séparé et filières de reprise/valorisation bois.','Sous conditions'],
metaux:['Métaux','Séparer les métaux pour favoriser la valorisation matière et éviter le mélange.','Sous conditions'],
plastique:['Plastiques','Identifier la filière correspondant au produit ; la gratuité n’est pas automatique.','À vérifier'],
carton:['Papier / carton','Tri à la source et comparaison des solutions professionnelles locales.','À vérifier'],
platre:['Plâtre','PMCB : privilégier le tri séparé et un point de reprise adapté.','Sous conditions'],
verre:['Verre / menuiseries vitrées','Certains flux relèvent de la filière PMCB et peuvent être repris selon conditions.','Sous conditions'],
dangereux:['Déchets chimiques / dangereux','Ne pas mélanger ; identifier la filière spécialisée avant transport.','À vérifier'],
mobilier:['Mobilier professionnel','Des solutions REP existent ; Ecomaison propose notamment une Carte Pro sous conditions.','Sous conditions'],
melange:['Déchets mélangés','Le mélange réduit les possibilités de reprise gratuite et peut augmenter le coût.','À optimiser']};
const notes={'Espaces verts':['Broyage sur place','Réemploi du broyat en paillage','Filière déchets verts'],'Élagage / abattage':['Broyage du bois','Réemploi/valorisation du bois','Filière bois'],'Maçonnerie / gros œuvre':['Tri des minéraux','Reprise PMCB','Réemploi des matériaux'],'Rénovation':['Séparer bois, métaux, plâtre et inertes','Identifier les filières REP','Réemploi avant élimination'],'Peinture':['Séparer les déchets chimiques','Identifier la filière dédiée','Ne pas mélanger les produits'],'Plomberie':['Séparer métaux, plastiques et déchets dangereux','Valoriser les métaux'],'Électricité':['Séparer métaux et DEEE','Identifier la filière électrique','Assurer la traçabilité si nécessaire'],'Terrassement':['Réemploi/valorisation des terres lorsque possible','Séparer les minéraux'],'Menuiserie':['Séparer bois, métal et verre','Réemploi des éléments','Filière PMCB'],'Carrelage / faïence':['Séparer les inertes','Reprise PMCB à vérifier','Réemploi'],'Nettoyage':['Séparer emballages et produits dangereux','Identifier les filières adaptées'],'Autre':['Identifier le flux exact','Chercher une filière REP éventuelle','Comparer les solutions locales']};
function evaluateWasteAid(){
const type=document.getElementById('wAidType').value,zone=document.getElementById('wAidZone').value,metier=document.getElementById('wAidMetier').value,vol=Math.max(0,+document.getElementById('wAidVol').value||0),r=rules[type]||rules.melange,n=notes[metier]||notes.Autre;
let orient=zone==='amp'?'À Aix-Marseille-Provence, rechercher une solution professionnelle adaptée au flux.':'Rechercher un point de reprise ou prestataire professionnel adapté au flux et au territoire.';
if(type==='bois'&&zone==='amp')orient='Veolia Aygalades indique des apports gratuits pour le bois ; vérifier les conditions et le flux accepté.';
if(type==='metaux'&&zone==='amp')orient='Veolia Aygalades indique des apports gratuits pour métaux/ferrailles ; vérifier les conditions d’accès.';
if(type==='verre'&&zone==='amp')orient='Veolia Aygalades indique des apports gratuits pour les menuiseries vitrées ; vérifier les conditions.';
let links='';
if(['gravats','bois','platre','verre'].includes(type))links+='<a href="https://www.ecologie.gouv.fr/politiques-publiques/produits-materiaux-construction-du-secteur-batiment-pmcb" target="_blank" rel="noopener">Règles officielles PMCB</a> · ';
if(zone==='amp')links+='<a href="https://dechets.ampmetropole.fr/pro/votre-mode-de-collecte/je-trouve-ma-decheterie-professionnelle/" target="_blank" rel="noopener">Solutions professionnelles Aix-Marseille</a> · ';
if(['bois','metaux','verre'].includes(type))links+='<a href="https://www.recyclage.veolia.fr/nous-trouver/centre-tri-aygalades-marseille" target="_blank" rel="noopener">Veolia Aygalades</a> · ';
if(type==='mobilier')links+='<a href="https://ecomaison.com/professionnels/services-de-collecte-et-reprise/nos-solutions-decollecte-et-reprise/decouvrez-la-carte-pro/" target="_blank" rel="noopener">Ecomaison Carte Pro</a> · ';
if(type==='dangereux')links+='<a href="https://www.ecodds.com/" target="_blank" rel="noopener">EcoDDS</a> · ';
document.getElementById('wAidResult').innerHTML='<div class="card" style="margin-top:12px"><span class="pill">'+escD(r[2])+'</span><h3>'+escD(r[0])+'</h3><p><b>Règle :</b> '+escD(r[1])+'</p><p><b>Pour '+escD(metier)+' :</b> '+n.map(escD).join(' · ')+'</p><p><b>Volume :</b> '+vol.toFixed(2)+' m³</p><p><b>Orientation :</b> '+escD(orient)+'</p>'+(zone==='amp'?'<div class="notice">Les déchèteries métropolitaines ne sont pas ouvertes aux professionnels depuis le 1er juillet 2025.</div>':'')+'<div class="box"><b>Objectif Chiffr’EcoPro :</b> chercher d’abord réemploi, tri, reprise sans frais ou valorisation, puis calculer le coût payant restant.</div><p class="muted">La gratuité ou une aide n’est jamais garantie : elle dépend du déchet, du tri, du point de reprise, du volume, du territoire et des conditions en vigueur.</p><p>'+links+'</p></div>';}
window.evaluateWasteAid=evaluateWasteAid;
})();