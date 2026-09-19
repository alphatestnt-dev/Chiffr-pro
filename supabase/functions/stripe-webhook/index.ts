import Stripe from "npm:stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_ROLE_KEY =
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ??
  (() => {
    try {
      const keys = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") ?? "{}");
      return keys.default ?? "";
    } catch {
      return "";
    }
  })();

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "");
const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const PRICE_PARTICULIER =
  Deno.env.get("STRIPE_PRICE_PARTICULIER") ??
  "price_1UHPodGuAGwIKOwu9VA8u1ZA";
const PRICE_PROFESSIONNEL =
  Deno.env.get("STRIPE_PRICE_PROFESSIONNEL") ??
  "price_1UHPuOGuAGwIKOwuy2U6SwQh";
const WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET") ?? "";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

async function userIdForCustomer(customerId: string | null) {
  if (!customerId) return null;
  const { data } = await supabaseAdmin
    .from("cc_subscriptions")
    .select("user_id")
    .eq("provider_customer_id", customerId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data?.user_id ?? null;
}

async function syncSubscription(subscription: Stripe.Subscription, userId: string | null) {
  const resolvedUserId =
    userId ?? await userIdForCustomer(String(subscription.customer ?? ""));

  if (!resolvedUserId) {
    console.warn("Stripe subscription received without resolvable user_id", subscription.id);
    return false;
  }

  const priceId = subscription.items.data[0]?.price?.id ?? "";
  const plan =
    subscription.metadata?.plan ??
    (priceId === PRICE_PROFESSIONNEL ? "professionnel" : "particulier");

  const { error } = await supabaseAdmin
    .from("cc_subscriptions")
    .upsert({
      user_id: resolvedUserId,
      plan,
      provider: "stripe",
      provider_customer_id: String(subscription.customer ?? "") || null,
      provider_subscription_id: subscription.id,
      status: subscription.status,
      started_at: subscription.start_date
        ? new Date(subscription.start_date * 1000).toISOString()
        : null,
      current_period_end: subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000).toISOString()
        : null,
      cancel_at_period_end: Boolean(subscription.cancel_at_period_end),
      updated_at: new Date().toISOString(),
    }, { onConflict: "provider_subscription_id" });

  if (error) throw error;
  return true;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return json({ error: "Method Not Allowed" }, 405);
  }

  if (!WEBHOOK_SECRET) {
    return json({ error: "Webhook secret not configured" }, 500);
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) return json({ error: "Missing Stripe signature" }, 400);

  const body = await req.text();
  let event: Stripe.Event;

  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      WEBHOOK_SECRET,
    );
  } catch (e) {
    console.error("Invalid Stripe signature", e);
    return json({ error: "Invalid signature" }, 400);
  }

  const object = event.data?.object as Record<string, any>;

  let userId =
    object?.metadata?.user_id ??
    object?.subscription_details?.metadata?.user_id ??
    object?.client_reference_id ??
    null;

  if (!userId && object?.customer) {
    userId = await userIdForCustomer(String(object.customer));
  }

  const { data: existing } = await supabaseAdmin
    .from("cc_payment_events")
    .select("id")
    .eq("provider_event_id", event.id)
    .maybeSingle();

  if (existing) {
    return json({ received: true, duplicate: true });
  }

  const { error: eventError } = await supabaseAdmin
    .from("cc_payment_events")
    .insert({
      provider_event_id: event.id,
      event_type: event.type,
      user_id: userId,
      payload: event,
    });

  if (eventError && eventError.code !== "23505") {
    console.error(eventError);
    return json({ error: "Unable to persist Stripe event" }, 500);
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = object as Stripe.Checkout.Session;
      if (session.mode === "subscription" && session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(
          String(session.subscription),
        );
        await syncSubscription(
          subscription,
          session.metadata?.user_id ?? session.client_reference_id ?? userId,
        );
      }
    } else if (
      event.type === "customer.subscription.created" ||
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted"
    ) {
      await syncSubscription(object as Stripe.Subscription, userId);
    } else if (event.type === "invoice.paid" || event.type === "invoice.payment_failed") {
      if (object?.subscription) {
        const subscription = await stripe.subscriptions.retrieve(
          String(object.subscription),
        );
        await syncSubscription(subscription, userId);
      }
    }
  } catch (e) {
    console.error("Stripe sync error", e);
    return json({ error: "Stripe event received but synchronization failed" }, 500);
  }

  return json({ received: true });
});
