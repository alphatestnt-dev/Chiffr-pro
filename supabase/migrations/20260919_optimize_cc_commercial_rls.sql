-- ChiffreCo-Pro Commercialisation V3 — staging
-- Performance hardening for existing commercial RLS policies.
-- Does not touch application tables outside the cc_* commercial module.

drop policy if exists "cc_accounts_select_own" on public.cc_accounts;
create policy "cc_accounts_select_own"
on public.cc_accounts
for select to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "cc_subscriptions_select_own" on public.cc_subscriptions;
create policy "cc_subscriptions_select_own"
on public.cc_subscriptions
for select to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "cc_professional_verifications_select_own"
on public.cc_professional_verifications;
create policy "cc_professional_verifications_select_own"
on public.cc_professional_verifications
for select to authenticated
using ((select auth.uid()) = user_id);
