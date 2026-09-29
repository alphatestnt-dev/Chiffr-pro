(()=>{'use strict';
const escD=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const SB_URL='https://ltehjhvxrnwatbqplmxr.supabase.co';
const SB_KEY='sb_publishable_GwgM9WAAvVGwNxUQEFf9yQ_YDWbI0xa';
const regions={
'ARA':'Auvergne-Rhône-Alpes','BFC':'Bourgogne-Franche-Comté','BRE':'Bretagne','CVL':'Centre-Val de Loire','COR':'Corse','GES':'Grand Est','HDF':'Hauts-de-France','IDF':'Île-de-France','NOR':'Normandie','NAQ':'Nouvelle-Aquitaine','OCC':'Occitanie','PDL':'Pays de la Loire','PAC':'Provence-Alpes-Côte d’Azur','GUA':'Guadeloupe','MAR':'Martinique','GUY':'Guyane','REU':'La Réunion','MAY':'Mayotte'};
const streams={verts:['🌿','Déchets verts / biodéchets'],gravats:['🧱','Gravats / béton / minéraux'],bois:['🪵','Bois'],metaux:['🔩','Métaux'],plastique:['♻️','Plastiques'],carton:['📦','Papier / carton'],platre:['◻️','Plâtre'],verre:['🪟','Verre / menuiseries vitrées'],dangereux:['⚠️','Déchets dangereux / chimiques'],mobilier:['🪑','Mobilier professionnel'],melange:['🗑️','Déchets mélangés']};
const métiers=['Espaces verts','Élagage / abattage','Maçonnerie / gros œuvre','Rénovation','Peinture','Plomberie','Électricité','Terrassement','Menuiserie','Carrelage / faïence','Nettoyage','Autre'];
const status={
free_confirmed:['🟢','Gratuit confirmé'],free_conditions:['🟡','Gratuit sous conditions'],aid_possible:['🔵','Aide possible'],price_to_check:['🟠','Tarif à vérifier'],mandatory_specialist:['🔴','Filière spécialisée obligatoire / à vérifier'],optimize:['🟣','À optimiser']};
const frDept=['01 Ain','02 Aisne','03 Allier','04 Alpes-de-Haute-Provence','05 Hautes-Alpes','06 Alpes-Maritimes','07 Ardèche','08 Ardennes','09 Ariège','10 Aube','11 Aude','12 Aveyron','13 Bouches-du-Rhône','14 Calvados','15 Cantal','16 Charente','17 Charente-Maritime','18 Cher','19 Corrèze','2A Corse-du-Sud','2B Haute-Corse','21 Côte-d’Or','22 Côtes-d’Armor','23 Creuse','24 Dordogne','25 Doubs','26 Drôme','27 Eure','28 Eure-et-Loir','29 Finistère','30 Gard','31 Haute-Garonne','32 Gers','33 Gironde','34 Hérault','35 Ille-et-Vilaine','36 Indre','37 Indre-et-Loire','38 Isère','39 Jura','40 Landes','41 Loir-et-Cher','42 Loire','43 Haute-Loire','44 Loire-Atlantique','45 Loiret','46 Lot','47 Lot-et-Garonne','48 Lozère','49 Maine-et-Loire','50 Manche','51 Marne','52 Haute-Marne','53 Mayenne','54 Meurthe-et-Moselle','55 Meuse','56 Morbihan','57 Moselle','58 Nièvre','59 Nord','60 Oise','61 Orne','62 Pas-de-Calais','63 Puy-de-Dôme','64 Pyrénées-Atlantiques','65 Hautes-Pyrénées','66 Pyrénées-Orientales','67 Bas-Rhin','68 Haut-Rhin','69 Rhône','70 Haute-Saône','71 Saône-et-Loire','72 Sarthe','73 Savoie','74 Haute-Savoie','75 Paris','76 Seine-Maritime','77 Seine-et-Marne','78 Yvelines','79 Deux-Sèvres','80 Somme','81 Tarn','82 Tarn-et-Garonne','83 Var','84 Vaucluse','85 Vendée','86 Vienne','87 Haute-Vienne','88 Vosges','89 Yonne','90 Territoire de Belfort','91 Essonne','92 Hauts-de-Seine','93 Seine-Saint-Denis','94 Val-de-Marne','95 Val-d’Oise','971 Guadeloupe','972 Martinique','973 Guyane','974 La Réunion','976 Mayotte'];
const api=async(path,params={})=>{const q=new URLSearchParams(params);const r=await fetch(SB_URL+'/rest/v1/'+path+'?'+q,{headers:{apikey:SB_KEY,Authorization:'Bearer '+SB_KEY}});if(!r.ok)throw new Error('API '+r.status);return r.json()};
function setJurisdictionDefaults(){
 const reg=document.getElementById('wAidRegion'); if(reg&&!reg.options.length)Object.entries(regions).forEach(([v,n])=>reg.add(new Option(n,v)));
 const dep=document.getElementById('wAidDept'); if(dep&&!dep.options.length){dep.add(new Option('Sélectionner le département',''));frDept.forEach(x=>dep.add(new Option(x,x.slice(0,x.indexOf(' ')))));}
 const met=document.getElementById('wAidMetier'); if(met&&!met.options.length)métiers.forEach(x=>met.add(new Option(x,x)));
 const typ=document.getElementById('wAidType'); if(typ&&!typ.options.length)Object.entries(streams).forEach(([v,x])=>typ.add(new Option(x[0]+' '+x[1],v)));
}
function escLink(url,label){return '<a href="'+escD(url)+'" target="_blank" rel="noopener">'+escD(label)+'</a>'}
async function evaluateWasteAid(){
 setJurisdictionDefaults();
 const type=document.getElementById('wAidType').value||'melange',region=document.getElementById('wAidRegion').value,dept=document.getElementById('wAidDept').value,commune=document.getElementById('wAidCommune').value.trim(),authority=document.getElementById('wAidAuthority').value.trim(),metier=document.getElementById('wAidMetier').value||'Autre',audience=document.getElementById('wAidAudience').value||'professional',vol=Math.max(0,+document.getElementById('wAidVol').value||0),res=document.getElementById('wAidResult');
 res.innerHTML='<div class="card" style="margin-top:12px"><b>Recherche en cours…</b><p class="muted">Juridiction → règle → filière → point de reprise → coût.</p></div>';
 try{
  const country=document.getElementById('wAidCountry').value||'FR';
  const isAmp=country==='FR'&&region==='PAC'&&dept==='13'&&/aix|marseille|provence/i.test(authority+' '+commune);
  const jurisdictionSlug=isAmp?'fr-amp':(country==='FR'?(dept?'fr-dept-'+String(dept).toLowerCase().replace(/^2/,'c'):region?'fr-'+region.toLowerCase():'france'):country.toLowerCase());
  const js=await api('waste_jurisdictions',{select:'id,name,level,country_code,slug',slug:'eq.'+jurisdictionSlug,active:'eq.true'});
  const jid=js[0]?.id;
  const rules=jid?await api('waste_rules',{select:'status,instruction,conditions,prohibited,priority,source_id,jurisdiction_id',jurisdiction_id:'eq.'+jid,stream_code:'eq.'+type,audience:'eq.'+audience,active:'eq.true',order:'priority.asc'}):[];
  const franceRules=country==='FR'&&jurisdictionSlug!=='france'?await api('waste_rules',{select:'status,instruction,conditions,prohibited,priority,source_id,jurisdiction_id',jurisdiction_id:'eq.'+(await api('waste_jurisdictions',{select:'id',slug:'eq.france'}))[0]?.id,stream_code:'eq.'+type,audience:'eq.'+audience,active:'eq.true'}):[];
  const sources=await api('waste_sources',{select:'id,name,url,publisher,verified_at',active:'eq.true'});
  const sourceMap=Object.fromEntries(sources.map(s=>[s.id,s]));
  const chosen=rules[0]||franceRules[0];
  const facilities=jid?await api('waste_facilities',{select:'name,operator,address,accepted_streams,audience,access_conditions,pricing_note,source_id,verified_at',jurisdiction_id:'eq.'+jid,active:'eq.true'}):[];
  const localRules=rules.filter(r=>r.jurisdiction_id);
  let title=streams[type]?.[1]||type, st=chosen?.status||'price_to_check', s=status[st]||status.price_to_check;
  let jurisdiction=(authority||commune||dept||region)?['France',region?regions[region]:'',dept?'département '+dept:'',commune,authority].filter(Boolean).join(' → '):'France — juridiction nationale';
  let html='<div class="card" style="margin-top:12px"><span class="pill">'+s[0]+' '+s[1]+'</span><h3>'+streams[type][0]+' '+escD(title)+'</h3><p><b>Juridiction analysée :</b> '+escD(jurisdiction)+'</p><p><b>Métier :</b> '+escD(metier)+' · <b>Volume :</b> '+vol.toFixed(2)+' m³</p>';
  if(chosen)html+='<div class="box"><p><b>Que faire :</b> '+escD(chosen.instruction)+'</p><p><b>Conditions :</b> '+escD(chosen.conditions||'À vérifier auprès du point de reprise.')+'</p>'+(chosen.prohibited?'<p class="danger"><b>À ne pas faire :</b> '+escD(chosen.prohibited)+'</p>':'')+'</div>';
  if(isAmp)html+='<div class="notice"><b>⚠️ Aix-Marseille-Provence :</b> les déchèteries métropolitaines ne sont plus accessibles aux professionnels depuis le 1er juillet 2025. Il faut utiliser une solution professionnelle adaptée.</div>';
  const relevant=facilities.filter(f=>Array.isArray(f.accepted_streams)&&f.accepted_streams.includes(type));
  if(relevant.length){html+='<h4>📍 Point professionnel identifié</h4>';relevant.forEach(f=>{const src=sourceMap[f.source_id];html+='<div class="box"><b>'+escD(f.name)+'</b><br>'+escD(f.address||'')+'<p>'+escD(f.access_conditions||'')+'</p><p><b>Conditions / coût :</b> '+escD(f.pricing_note||'À vérifier')+'</p>'+(src?'<p>'+escLink(src.url,'Source vérifiée')+' · '+escD(src.publisher||'')+' · vérifiée le '+escD(src.verified_at||'')+'</p>':'')+'</div>'})}
  if(!jid)html+='<div class="box"><b>🔎 Territoire encore à documenter :</b> la structure est prête, mais aucune règle locale suffisamment sourcée n’est affichée. L’application ne transforme pas une règle générale en consigne locale.</div>';if(jid&&country!=='FR'&&!rules.length)html+='<div class="box"><b>🇪🇺 Cadre européen :</b> le territoire est enregistré, mais ses règles locales de dépôt doivent être documentées avec des sources nationales/régionales avant de proposer une consigne précise.</div>'
  html+='<h4>🧭 Ordre de recherche Chiffr’EcoPro</h4><ol><li>Réemploi / don / réutilisation</li><li>Reprise gratuite ou filière REP, si confirmée</li><li>Point professionnel gratuit sous conditions</li><li>Aide ou dispositif applicable</li><li>Solution professionnelle payante la moins coûteuse compatible</li><li>Élimination en dernier recours</li></ol>';
  html+='<p class="muted">⚠️ Chiffr’EcoPro ne transforme jamais une possibilité en garantie : gratuité, aide, acceptation et prix sont liés au flux, au volume, au statut et à la juridiction en vigueur.</p></div>';
  res.innerHTML=html;
 }catch(e){res.innerHTML='<div class="card notice"><b>Recherche locale indisponible.</b><p>La règle de sécurité reste : ne pas déposer le déchet dans une filière non prévue. Réessayez ou vérifiez la source officielle du territoire.</p></div>'}
}
window.evaluateWasteAid=evaluateWasteAid;
document.addEventListener('DOMContentLoaded',setJurisdictionDefaults);
})();