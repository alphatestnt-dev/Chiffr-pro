import Stripe from "npm:stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_ROLE_KEY =
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ??
  (() => {
    try {
      const keys = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") ?? "{}");
      return keys.default ?? "";
    } catch { return ""; }
  })();
const PUBLISHABLE_KEY =
  Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ??
  (() => {
    try {
      const keys = JSON.parse(Deno.env.get("SUPABASE_PUBLISHABLE_KEYS") ?? "{}");
      return keys.default ?? "";
    } catch { return ""; }
  })();

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "");
const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
const PRICE_PARTICULIER = Deno.env.get("STRIPE_PRICE_PARTICULIER") ?? "price_1UHPodGuAGwIKOwu9VA8u1ZA";
const PRICE_PROFESSIONNEL = Deno.env.get("STRIPE_PRICE_PROFESSIONNEL") ?? "price_1UHPuOGuAGwIKOwuy2U6SwQh";
const PUBLIC_APP_URL = (Deno.env.get("PUBLIC_APP_URL") ?? "").replace(/\/$/, "");

const headers = {
  "Content-Type":"application/json; charset=utf-8",
  "Access-Control-Allow-Origin":"*",
  "Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods":"GET,POST,OPTIONS"
};
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers});
const err=(message:string,status=400,extra:Record<string,unknown>={})=>json({error:message,...extra},status);

async function userFromAuth(req:Request){
  const token=(req.headers.get("Authorization")??"").replace(/^Bearer\s+/i,"").trim();
  if(!token)return null;
  const {data,error}=await supabaseAdmin.auth.getUser(token);
  if(error||!data.user)return null;
  return {user:data.user,token};
}
function userClient(token:string){
  return createClient(SUPABASE_URL,PUBLISHABLE_KEY,{global:{headers:{Authorization:"Bearer "+token}}});
}
async function hasOwnerAccess(userId:string){
  const {data,error}=await supabaseAdmin.from("cc_owner_access").select("user_id").eq("user_id",userId).maybeSingle();
  if(error)throw error;
  return Boolean(data);
}
async function ensureAccount(userId:string,accountType:string|null=null){
  const now=new Date();
  const started=now.toISOString();
  const ends=new Date(now.getTime()+15*24*60*60*1000).toISOString();
  const {data:existing,error:readError}=await supabaseAdmin.from("cc_accounts").select("*").eq("user_id",userId).maybeSingle();
  if(readError)throw readError;
  let account=existing;
  if(!account){
    const {error:insertError}=await supabaseAdmin.from("cc_accounts").upsert({
      user_id:userId,account_type:accountType??"particulier",
      trial_started_at:started,trial_ends_at:ends,updated_at:started
    },{onConflict:"user_id",ignoreDuplicates:true});
    if(insertError)throw insertError;
    const {data:created,error:createdError}=await supabaseAdmin.from("cc_accounts").select("*").eq("user_id",userId).single();
    if(createdError)throw createdError;
    account=created;
  }
  if(accountType && account.account_type!==accountType){
    const {data:updated,error:updateError}=await supabaseAdmin.from("cc_accounts")
      .update({account_type:accountType,updated_at:new Date().toISOString()})
      .eq("user_id",userId).select("*").single();
    if(updateError)throw updateError;
    account=updated;
  }
  return account;
}
async function validatePrice(priceId:string,expectedAmount:number){
  const price=await stripe.prices.retrieve(priceId);
  if(!price||price.id!==priceId)throw new Error(`Stripe Price introuvable: ${priceId}`);
  if(!price.active)throw new Error(`Stripe Price inactif: ${priceId}`);
  if(price.unit_amount!==expectedAmount)throw new Error(`Montant Stripe inattendu pour ${priceId}`);
  if(price.currency!=="eur")throw new Error(`Devise Stripe inattendue pour ${priceId}`);
  if(!price.recurring||price.recurring.interval!=="month")throw new Error(`Le Price ${priceId} n'est pas mensuel`);
  return price;
}

Deno.serve(async(req)=>{
  if(req.method==="OPTIONS")return new Response("ok",{headers});
  const urlObj=new URL(req.url);
  const marker="/commercialisation-api";
  const markerIndex=urlObj.pathname.indexOf(marker);
  const rawPath=markerIndex>=0?urlObj.pathname.slice(markerIndex+marker.length):urlObj.pathname;
  const path=(rawPath.replace(/\/+$/,"")||"/");
    const isHealth=urlObj.pathname.endsWith("/health")||urlObj.pathname.endsWith("/health/");
  
  try{
    if(isHealth || path==="/health" || (path==="/" && req.method!=="POST")){
      if(req.method==="HEAD")return new Response(null,{status:200,headers});
      const [part,pro]=await Promise.all([validatePrice(PRICE_PARTICULIER,299),validatePrice(PRICE_PROFESSIONNEL,999)]);
      return json({ok:true,stripe_mode:part.livemode?"live":"test",particulier:{price_id:part.id,amount:part.unit_amount,currency:part.currency,interval:part.recurring?.interval??null},professionnel:{price_id:pro.id,amount:pro.unit_amount,currency:pro.currency,interval:pro.recurring?.interval??null},public_app_url_configured:Boolean(PUBLIC_APP_URL),secrets_configured:{stripe_secret:Boolean(Deno.env.get("STRIPE_SECRET_KEY")),webhook_secret:Boolean(Deno.env.get("STRIPE_WEBHOOK_SECRET")),supabase_service_role:Boolean(SERVICE_ROLE_KEY)}});
    }
    if(req.method!=="POST")return err("Méthode non autorisée",405);
    const auth=await userFromAuth(req);
    if(!auth)return err("Authentification requise",401);
    const {user,token}=auth;
    const owner=await hasOwnerAccess(user.id);

    if(path==="/subscription-state"){
      const account=await ensureAccount(user.id);
      const {data:subs}=await supabaseAdmin.from("cc_subscriptions").select("*").eq("user_id",user.id).order("created_at",{ascending:false}).limit(5);
      const sub=(subs??[]).find(s=>["active","trialing","past_due","unpaid","incomplete"].includes(s.status))??subs?.[0]??null;
      const subscriptionActive=Boolean(sub&&["active","trialing"].includes(sub.status)&&(!sub.current_period_end||new Date(sub.current_period_end).getTime()>Date.now()));
      const trialActive=Boolean(account.trial_ends_at&&new Date(account.trial_ends_at).getTime()>Date.now());
      const trialDaysRemaining=trialActive?Math.max(0,Math.ceil((new Date(account.trial_ends_at).getTime()-Date.now())/86400000)):0;
      const accessAllowed=owner||subscriptionActive||trialActive;
      return json({is_owner:owner,access_allowed:accessAllowed,trial_active:trialActive,trial_started_at:account.trial_started_at??null,trial_ends_at:account.trial_ends_at??null,trial_days_remaining:trialDaysRemaining,evaluations_used:account.evaluations_used??0,evaluations_remaining:null,account_type:account.account_type??"particulier",professional_verification_status:account.professional_verification_status??"not_started",plan:sub?.plan??null,subscription_status:sub?.status??"none",started_at:sub?.started_at??null,current_period_end:sub?.current_period_end??null,cancel_at_period_end:sub?.cancel_at_period_end??false});
    }

    if(path==="/consume-evaluation"){
      if(owner){
        const {data:account}=await supabaseAdmin.from("cc_accounts").select("evaluations_used").eq("user_id",user.id).maybeSingle();
        return json({allowed:true,evaluations_used:account?.evaluations_used??0,evaluations_remaining:null,reason:"owner_unlimited",is_owner:true});
      }
      const scoped=userClient(token);
      const {data,error:rpcError}=await scoped.rpc("cc_consume_evaluation",{p_user_id:user.id});
      if(rpcError)return err(rpcError.message,500);
      const row=data?.[0];
      const {data:account}=await supabaseAdmin.from("cc_accounts").select("trial_started_at,trial_ends_at").eq("user_id",user.id).maybeSingle();
      if(!row?.allowed)return err("Votre période d’essai de 15 jours est terminée. Choisissez une offre pour continuer.",402,{code:"TRIAL_EXPIRED",trial_ends_at:account?.trial_ends_at??null});
      const trialActive=Boolean(account?.trial_ends_at&&new Date(account.trial_ends_at).getTime()>Date.now());
      return json({...row,trial_active:trialActive,trial_started_at:account?.trial_started_at??null,trial_ends_at:account?.trial_ends_at??null,evaluations_remaining:null});
    }

    if(path==="/create-checkout-session" || path==="/"){
      const body=await req.json().catch(()=>({}));const plan=body?.plan;
      if(!["particulier","professionnel"].includes(plan))return err("Offre invalide",400);
      const account=await ensureAccount(user.id,plan);
      if(plan==="professionnel"&&account.professional_verification_status!=="verified")return err("Vérification professionnelle requise",403);
      const priceId=plan==="professionnel"?PRICE_PROFESSIONNEL:PRICE_PARTICULIER;
      await validatePrice(priceId,plan==="professionnel"?999:299);
      const session=await stripe.checkout.sessions.create({mode:"subscription",line_items:[{price:priceId,quantity:1}],customer_email:user.email??undefined,client_reference_id:user.id,success_url:`${PUBLIC_APP_URL}/?cc_payment=success&session_id={CHECKOUT_SESSION_ID}`,cancel_url:`${PUBLIC_APP_URL}/?cc_payment=cancelled`,metadata:{user_id:user.id,plan},subscription_data:{metadata:{user_id:user.id,plan}}});
      return json({checkout_url:session.url,session_id:session.id});
    }

    if(path==="/cancel-subscription"){      const {data:sub}=await supabaseAdmin.from("cc_subscriptions").select("*").eq("user_id",user.id).in("status",["active","trialing","past_due","unpaid"]).order("created_at",{ascending:false}).limit(1).maybeSingle();      if(!sub?.provider_subscription_id)return err("Abonnement introuvable",404);      if(sub.cancel_at_period_end)return json({ok:true,cancel_at_period_end:true,current_period_end:sub.current_period_end,message:"Votre abonnement est déjà programmé pour résiliation à la fin de la période payée."});      const updated=await stripe.subscriptions.update(sub.provider_subscription_id,{cancel_at_period_end:true});      const periodEnd=(updated as any).current_period_end?new Date((updated as any).current_period_end*1000).toISOString():sub.current_period_end;      const {error:updateError}=await supabaseAdmin.from("cc_subscriptions").update({cancel_at_period_end:true,current_period_end:periodEnd,updated_at:new Date().toISOString()}).eq("id",sub.id).eq("user_id",user.id);      if(updateError)return err(updateError.message,500);      return json({ok:true,cancel_at_period_end:true,current_period_end:periodEnd,message:"Résiliation confirmée. L'accès reste actif jusqu'à la fin de la période payée."});    }    if(path==="/customer-portal"){
      const {data:sub}=await supabaseAdmin.from("cc_subscriptions").select("provider_customer_id").eq("user_id",user.id).not("provider_customer_id","is",null).order("created_at",{ascending:false}).limit(1).maybeSingle();
      if(!sub?.provider_customer_id)return err("Client de paiement introuvable",404);
      const portal=await stripe.billingPortal.sessions.create({customer:sub.provider_customer_id,return_url:PUBLIC_APP_URL});
      return json({portal_url:portal.url});
    }

    if(path==="/professional-verification/upload-url"){
      const body=await req.json().catch(()=>({}));const type=String(body?.type??"").trim();const reference=String(body?.reference??"").trim()||null;const fileName=String(body?.file_name??"").trim();
      if(!type||!fileName)return err("Justificatif incomplet",400);
      const safeName=fileName.replace(/[^a-zA-Z0-9._-]/g,"_").slice(-120);const storagePath=`${user.id}/${crypto.randomUUID()}-${safeName}`;
      const {data:signed,error:storageError}=await supabaseAdmin.storage.from("cc-professional-docs").createSignedUploadUrl(storagePath);
      if(storageError)return err(storageError.message,500);
      const {data:verification,error:verificationError}=await supabaseAdmin.from("cc_professional_verifications").insert({user_id:user.id,document_type:type,document_reference:reference,storage_path:storagePath,status:"pending"}).select("id").single();
      if(verificationError)return err(verificationError.message,500);
      const {error:accountError}=await supabaseAdmin.from("cc_accounts").upsert({user_id:user.id,account_type:"professionnel",professional_verification_status:"pending",updated_at:new Date().toISOString()},{onConflict:"user_id"});
      if(accountError)return err(accountError.message,500);
      return json({verification_id:verification.id,storage_path:storagePath,upload_url:signed?.signedUrl??null,token:signed?.token??null});
    }

    return err("Route introuvable",404);
  }catch(e){console.error(e);return err(e instanceof Error?e.message:String(e),500);}
});