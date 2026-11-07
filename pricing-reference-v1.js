/* ChiffrecoPro — références tarifaires minimales et traçables.
   Valeurs indicatives tirées de bordereaux publics; pas des prix imposés.
   Les prestations annexes (évacuation, broyage, transport) ne sont pas incluses ici.
*/
(()=>{
  const refs={
    "Espaces verts":{
      "Tonte":{
        unit:"m²",price:0.09,condition:"Surface inférieure à 1 hectare, par intervention",
        source:"Bordereau de prix unitaire — Cergy-Pontoise, entretien des espaces verts, 2025",
        url:"https://delib.cergypontoise.fr/webdelibplus/jsp/showFile.jsp?datePub=04%2F02%2F2025&dateRetLega=04%2F02%2F2025&pdf=VcSLaHqA9K%2F2cUe79OY8sIytIJzTDkdsomFlz7vAY%2BJSjWH%2BmYxdg4iBhOQ6%2BWqBW%2FjzTrWK1oLkdYkEaMNf15uUje4B1vl2MSt1y34h%2FnMbgtUwQbopTtgjbiOH9woWuvNuX0Gw8waNDllu7POr3qX7D8L0MTWhfFTWas64wY6zTSA%3D%3D",
        note:"Prix de marché public par intervention; à adapter à la région, au terrain et à la prestation réellement demandée."
      },
      "Débroussaillage":{
        unit:"m²",price:0.25,condition:"Débroussaillage simple, par intervention",
        source:"Bordereau de prix unitaire — Cergy-Pontoise, entretien des espaces verts, 2025",
        url:"https://delib.cergypontoise.fr/webdelibplus/jsp/showFile.jsp?datePub=04%2F02%2F2025&dateRetLega=04%2F02%2F2025&pdf=VcSLaHqA9K%2F2cUe79OY8sIytIJzTDkdsomFlz7vAY%2BJSjWH%2BmYxdg4iBhOQ6%2BWqBW%2FjzTrWK1oLkdYkEaMNf15uUje4B1vl2MSt1y34h%2FnMbgtUwQbopTtgjbiOH9woWuvNuX0Gw8waNDllu7POr3qX7D8L0MTWhfFTWas64wY6zTSA%3D%3D",
        note:"Référence de marché public. Herbes hautes, ronces, forte densité ou terrain difficile peuvent justifier un tarif supérieur, à régler par l'artisan."
      },
      "Taille de haie":{
        unit:"mètre",price:1.80,condition:"Une face, haie de moins de 2 m, par intervention",
        source:"Bordereau de prix unitaire — Cergy-Pontoise, entretien des espaces verts, 2025",
        url:"https://delib.cergypontoise.fr/webdelibplus/jsp/showFile.jsp?datePub=04%2F02%2F2025&dateRetLega=04%2F02%2F2025&pdf=VcSLaHqA9K%2F2cUe79OY8sIytIJzTDkdsomFlz7vAY%2BJSjWH%2BmYxdg4iBhOQ6%2BWqBW%2FjzTrWK1oLkdYkEaMNf15uUje4B1vl2MSt1y34h%2FnMbgtUwQbopTtgjbiOH9woWuvNuX0Gw8waNDllu7POr3qX7D8L0MTWhfFTWas64wY6zTSA%3D%3D",
        note:"Base pour une face seulement. Le nombre de faces et la hauteur changent le prix; le bordereau publie 1,85 €/m pour deux faces et 1,88 €/m pour trois faces, sous 2 m."
      }
    }
  };
  const $=id=>document.getElementById(id);
  const norm=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim();
  function current(){return refs[$("metier")?.value]?.[$("prest")?.value]||null}
  function render(){
    const box=$("priceReferenceInfo"),btn=$("priceReferenceApply");
    if(!box||!btn)return;
    const r=current();
    if(!r){box.textContent="Pas encore de référence tarifaire suffisamment comparable pour cette prestation. Le prix reste libre à renseigner.";btn.disabled=true;return}
    box.innerHTML="Référence indicative : <b>"+r.price.toLocaleString("fr-FR",{minimumFractionDigits:2,maximumFractionDigits:2})+" € / "+r.unit+"</b> — "+r.condition+". "+r.note+' <a href="'+r.url+'" target="_blank" rel="noopener">Source</a>';
    btn.disabled=false;
  }
  window.ceApplyPriceReference=()=>{
    const r=current();if(!r)return;
    if($("unit"))$("unit").value=r.unit;
    if($("unitPrice"))$("unitPrice").value=String(r.price);
    const box=$("priceReferenceInfo");
    if(box)box.insertAdjacentHTML("beforeend"," <b>Référence appliquée — modifiable librement.</b>");
  };
  window.cePricingReferences=refs;
  document.addEventListener("DOMContentLoaded",()=>{
    $("metier")?.addEventListener("change",render);
    $("prest")?.addEventListener("change",render);
    render();
  });
})();
