(()=>{
  const $=id=>document.getElementById(id);
  function ui(){
    if($('v25Bar'))return;
    const b=document.createElement('div');b.id='v25Bar';b.className='notice';b.style.cssText='position:sticky;bottom:10px;z-index:20;margin:10px 0;display:flex;justify-content:space-between;gap:8px;align-items:center;flex-wrap:wrap';
    b.innerHTML='<span>📱 Chifr’EcoPro est prêt pour une utilisation mobile.</span><button id="v25Install" class="primary" style="display:none">Installer l’application</button><button id="v25Reload" style="display:none">Mettre à jour</button>';
    const main=document.querySelector('main'); if(main) main.appendChild(b);
    let deferred;
    window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e;const x=$('v25Install');if(x)x.style.display='inline-block';});
    $('v25Install')?.addEventListener('click',async()=>{if(!deferred)return;deferred.prompt();await deferred.userChoice;deferred=null;$('v25Install').style.display='none';});
    if('serviceWorker' in navigator){
      navigator.serviceWorker.getRegistration().then(reg=>{if(!reg)return;reg.addEventListener('updatefound',()=>{const w=reg.installing;if(!w)return;w.addEventListener('statechange',()=>{if(w.state==='installed'&&navigator.serviceWorker.controller){const x=$('v25Reload');if(x)x.style.display='inline-block';}});});});
      $('v25Reload')?.addEventListener('click',()=>location.reload());
    }
    window.addEventListener('online',()=>{b.firstChild.textContent='📱 Chifr’EcoPro · connexion rétablie';});
    window.addEventListener('offline',()=>{b.firstChild.textContent='📴 Mode hors connexion disponible';});
  }
  function quality(){
    const ids=['qty','hours','rate','margin','vat'];let bad=[];
    ids.forEach(id=>{const x=$(id);if(x&&x.value!==''&&Number(x.value)<0)bad.push(id);});
    const q=$('qty'),h=$('hours');
    if(q&&h&&Number(q.value)>0&&Number(h.value)>0){const t=Number(h.value)/Number(q.value);let n=$('v25Quality');if(!n){n=document.createElement('small');n.id='v25Quality';n.className='muted';h.parentNode.appendChild(n);}n.textContent='Temps moyen : '+t.toFixed(2)+' h / unité';}
    if(bad.length)console.warn('Chifr’EcoPro : valeurs négatives détectées',bad);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{ui();quality();});else{ui();quality();}
  document.addEventListener('input',e=>{if(['qty','hours','rate','margin','vat'].includes(e.target?.id))quality();});
})();
