/* ChiffreCo-Pro commercialisation V3 — staging only */
(function(){
  'use strict';
  const CC={};
  let overlay=null, supabaseClient=null;
  const apiBase=window.CC_API_BASE||'https://ltehjhvxrnwatbqplmxr.supabase.co/functions/v1/commercialisation-api';
  const supabaseUrl='https://ltehjhvxrnwatbqplmxr.supabase.co';
  const publishableKey='sb_publishable_GwgM9WAAvVGwNxUQEFf9yQ_YDWbI0xa';

  async function client(){
    if(supabaseClient) return supabaseClient;
    const mod=await import('https://esm.sh/@supabase/supabase-js@2');
    supabaseClient=mod.createClient(supabaseUrl,publishableKey);
    return supabaseClient;
  }
  async function session(){
    const c=await client();
    const {data}=await c.auth.getSession();
    return data.session||null;
  }
  async function api(path,opts={}){
    const s=await session();
    const headers={'Content-Type':'application/json',...(opts.headers||{})};
    if(s?.access_token) headers.Authorization='Bearer '+s.access_token;
    const res=await fetch(apiBase+path,{credentials:'omit',...opts,headers});
    const data=await res.json().catch(()=>({}));
    if(!res.ok){
      if(res.status===401) throw Object.assign(new Error('Connexion requise pour continuer.'),{code:'AUTH_REQUIRED'});
      throw new Error(data.error||'Erreur serveur');
    }
    return data;
  }
  CC.api=api;

  function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
  function close(){if(overlay){overlay.remove();overlay=null;}}
  function shell(title,body){
    close();
    overlay=document.createElement('div');overlay.className='cc-overlay';
    overlay.innerHTML='<section class="cc-modal" role="dialog" aria-modal="true"><div class="cc-head"><h2>'+esc(title)+'</h2><button class="cc-close" aria-label="Fermer">×</button></div><div class="cc-body">'+body+'</div></section>';
    overlay.querySelector('.cc-close').onclick=close;
    overlay.addEventListener('click',e=>{if(e.target===overlay)close()});
    document.body.appendChild(overlay);
  }
  async function showAuth(next){
    shell('Connexion Chiffr’EcoPro',`
      <p class="cc-muted">Un compte est nécessaire pour sécuriser les évaluations et les abonnements.</p>
      <div class="cc-field"><label>E-mail</label><input id="cc-auth-email" type="email" autocomplete="email"></div>
      <div class="cc-field"><label>Mot de passe</label><input id="cc-auth-password" type="password" autocomplete="current-password"></div>
      <div class="cc-actions"><button class="cc-btn cc-btn-primary" id="cc-login">Se connecter</button><button class="cc-btn" id="cc-signup">Créer mon compte</button></div>
      <p id="cc-auth-msg" class="cc-note"></p>`);
    const msg=overlay.querySelector('#cc-auth-msg');
    const email=()=>overlay.querySelector('#cc-auth-email').value.trim();
    const password=()=>overlay.querySelector('#cc-auth-password').value;
    overlay.querySelector('#cc-login').onclick=async()=>{
      msg.textContent='Connexion…';
      try{const c=await client();const {error}=await c.auth.signInWithPassword({email:email(),password:password()});if(error)throw error;msg.textContent='Connecté.';await new Promise(r=>setTimeout(r,250));if(next)next();else showOffers();}catch(e){msg.className='cc-note cc-error';msg.textContent=e.message;}}
    overlay.querySelector('#cc-signup').onclick=async()=>{
      msg.textContent='Création du compte…';
      try{const c=await client();const {data,error}=await c.auth.signUp({email:email(),password:password()});if(error)throw error;if(data.session){msg.textContent='Compte créé.';if(next)next();else showOffers();}else msg.textContent='Compte créé. Vérifiez votre e-mail puis connectez-vous.';}catch(e){msg.className='cc-note cc-error';msg.textContent=e.message;}}
  }
  async function requireAuth(next){
    const s=await session().catch(()=>null);
    if(s) return next();
    return showAuth(next);
  }

  CC.close=close;
  CC.open=async page=>{
    if(page==='offers') return showOffers();
    if(page==='choose') return requireAuth(()=>showChoose());
    if(page==='payment') return requireAuth(()=>showPayment());
    if(page==='success') return requireAuth(()=>showSuccess());
    if(page==='subscription') return requireAuth(()=>showSubscription());
    if(page==='pro') return requireAuth(()=>showPro());
    return showOffers();
  };

  async function showOffers(){
    let s={evaluations_remaining:3,account_type:'particulier',subscription_status:'none'};
    try{s=await api('/subscription-state',{method:'POST',body:'{}'});}catch(e){}
    shell('Nos offres',`
      <div class="cc-grid">
        <article class="cc-card"><span class="cc-badge">PARTICULIER</span><h3>3 évaluations gratuites</h3><div class="cc-counter">Il vous reste ${esc(s.evaluations_remaining??3)} évaluations gratuites</div><div class="cc-price">2,99 € / mois</div><p class="cc-muted">Après les 3 évaluations gratuites.</p><div class="cc-actions"><button class="cc-btn cc-btn-primary" data-cc="choose-part">Choisir Particulier</button></div></article>
        <article class="cc-card"><span class="cc-badge">PROFESSIONNEL</span><h3>Offre Professionnel</h3><div class="cc-price">9,99 € / mois</div><p class="cc-muted">Justificatif professionnel requis avant activation.</p><div class="cc-actions"><button class="cc-btn cc-btn-primary" data-cc="choose-pro">Choisir Professionnel</button></div></article>
      </div><p class="cc-note">Les compteurs, droits et paiements sont contrôlés côté serveur.</p>`);
    overlay.querySelector('[data-cc="choose-part"]').onclick=()=>requireAuth(()=>showPayment('particulier'));
    overlay.querySelector('[data-cc="choose-pro"]').onclick=()=>requireAuth(()=>showPro());
  }

  function showChoose(pref){
    shell('Choisir mon offre',`<div class="cc-grid"><article class="cc-card"><h3>Particulier</h3><div class="cc-price">2,99 € / mois</div><p>Après les 3 évaluations gratuites.</p><button class="cc-btn cc-btn-primary" data-plan="particulier">Continuer</button></article><article class="cc-card"><h3>Professionnel</h3><div class="cc-price">9,99 € / mois</div><p>Vérification professionnelle requise.</p><button class="cc-btn cc-btn-primary" data-plan="professionnel">Continuer</button></article></div>`);
    overlay.querySelectorAll('[data-plan]').forEach(b=>b.onclick=()=>b.dataset.plan==='professionnel'?showPro():showPayment('particulier'));
    if(pref) overlay.querySelector('[data-plan="'+pref+'"]')?.click();
  }

  function showPro(){
    shell('Vérification professionnelle',`<p>Le justificatif est déposé dans un bucket privé et reste inaccessible publiquement.</p>
      <div class="cc-field"><label>Type de justificatif</label><select id="cc-pro-type"><option>SIRET / extrait Kbis</option><option>Attestation d'activité</option><option>Autre justificatif professionnel</option></select></div>
      <div class="cc-field"><label>Référence professionnelle</label><input id="cc-pro-ref" placeholder="SIRET ou référence"></div>
      <div class="cc-field"><label>Justificatif</label><input id="cc-pro-file" type="file" accept="application/pdf,image/*"></div>
      <div class="cc-actions"><button class="cc-btn cc-btn-primary" id="cc-pro-submit">Envoyer pour vérification</button></div><p id="cc-pro-msg" class="cc-note"></p>`);
    overlay.querySelector('#cc-pro-submit').onclick=async()=>{
      const msg=overlay.querySelector('#cc-pro-msg');msg.textContent='Envoi sécurisé…';
      try{
        const f=overlay.querySelector('#cc-pro-file').files[0];if(!f)throw new Error('Sélectionnez un justificatif.');
        const d=await api('/professional-verification/upload-url',{method:'POST',body:JSON.stringify({type:overlay.querySelector('#cc-pro-type').value,reference:overlay.querySelector('#cc-pro-ref').value,file_name:f.name})});
        const upload=await fetch(d.upload_url+'?token='+encodeURIComponent(d.token),{method:'PUT',headers:{'Content-Type':f.type||'application/octet-stream'},body:f});
        if(!upload.ok)throw new Error('Le dépôt sécurisé du justificatif a échoué.');
        msg.className='cc-note cc-success';msg.textContent='Justificatif envoyé. Validation professionnelle en attente.';
      }catch(e){msg.className='cc-note cc-error';msg.textContent=e.message;}
    };
  }

  function showPayment(plan='particulier'){
    shell('Paiement',`<div class="cc-status"><b>Offre :</b> ${esc(plan==='professionnel'?'Professionnel — 9,99 € / mois':'Particulier — 2,99 € / mois')}</div><p class="cc-muted">Le paiement est effectué sur Stripe Checkout. ChiffreCo-Pro ne stocke aucune donnée bancaire.</p><div class="cc-actions"><button class="cc-btn cc-btn-primary" id="cc-pay">Continuer vers le paiement sécurisé</button><button class="cc-btn" id="cc-cancel">Annuler</button></div><p id="cc-pay-msg" class="cc-note"></p>`);
    overlay.querySelector('#cc-pay').onclick=async()=>{
      const msg=overlay.querySelector('#cc-pay-msg');msg.textContent='Préparation du paiement…';
      try{const d=await api('/create-checkout-session',{method:'POST',body:JSON.stringify({plan})});if(!d.checkout_url)throw new Error('URL de paiement non configurée.');location.href=d.checkout_url;}
      catch(e){msg.className='cc-note cc-error';msg.textContent=e.message;}
    };
    overlay.querySelector('#cc-cancel').onclick=close;
  }

  async function showSuccess(){
    let s;try{s=await api('/subscription-state',{method:'POST',body:'{}'});}catch(e){s={subscription_status:'pending'};}
    shell('Confirmation',`<div class="cc-status"><p class="cc-success">Retour du paiement reçu. Le statut affiché provient du serveur.</p><p><b>Offre :</b> ${esc(s.plan||'—')}</p><p><b>Statut :</b> ${esc(s.subscription_status||'—')}</p><p><b>Échéance :</b> ${esc(s.current_period_end||'—')}</p></div><button class="cc-btn cc-btn-primary" id="cc-sub">Mon abonnement</button>`);
    overlay.querySelector('#cc-sub').onclick=()=>showSubscription();
  }

  async function showSubscription(){
    let s;try{s=await api('/subscription-state',{method:'POST',body:'{}');}catch(e){s={plan:'—',subscription_status:'indisponible'};}
    shell('Mon abonnement',`<div class="cc-status"><p><b>Offre :</b> ${esc(s.plan||'Aucune')}</p><p><b>Statut :</b> ${esc(s.subscription_status||'—')}</p><p><b>Début :</b> ${esc(s.started_at||'—')}</p><p><b>Échéance :</b> ${esc(s.current_period_end||'—')}</p><p><b>Annulation en fin de période :</b> ${s.cancel_at_period_end?'Oui':'Non'}</p></div><div class="cc-actions"><button class="cc-btn cc-btn-primary" id="cc-portal">Gérer mon abonnement</button></div><p class="cc-note">La résiliation est effectuée dans le portail Stripe ; le webhook synchronise ensuite le statut.</p>`);
    overlay.querySelector('#cc-portal').onclick=async()=>{try{const d=await api('/customer-portal',{method:'POST',body:'{}'});if(d.portal_url)location.href=d.portal_url;}catch(e){alert(e.message);}};
  }

  window.ccCommercialisation=CC;
})();