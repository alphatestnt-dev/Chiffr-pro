-- ChiffrecoPro: 15-day account trial, no card required at signup.
-- Existing accounts receive one 15-day transition period from migration time.
alter table public.cc_accounts
  add column if not exists trial_started_at timestamptz,
  add column if not exists trial_ends_at timestamptz;

update public.cc_accounts
set trial_started_at = coalesce(trial_started_at, now()),
    trial_ends_at = coalesce(trial_ends_at, coalesce(trial_started_at, now()) + interval '15 days')
where trial_started_at is null or trial_ends_at is null;

create or replace function public.cc_consume_evaluation(p_user_id uuid)
returns table(allowed boolean, evaluations_used integer, evaluations_remaining integer, reason text)
language plpgsql
security definer
set search_path = public
as $function$
declare
  v_account public.cc_accounts%rowtype;
  v_subscription_active boolean := false;
begin
  if auth.uid() is null or auth.uid() <> p_user_id then
    raise exception 'unauthorized';
  end if;

  insert into public.cc_accounts (user_id, trial_started_at, trial_ends_at)
  values (p_user_id, now(), now() + interval '15 days')
  on conflict (user_id) do nothing;

  select *
  into v_account
  from public.cc_accounts
  where user_id = p_user_id
  for update;

  select exists (
    select 1
    from public.cc_subscriptions
    where user_id = p_user_id
      and status in ('active', 'trialing')
      and (current_period_end is null or current_period_end > now())
  ) into v_subscription_active;

  if v_subscription_active then
    return query select true, v_account.evaluations_used, null::integer, 'subscription_active'::text;
    return;
  end if;

  if v_account.trial_ends_at is not null and v_account.trial_ends_at > now() then
    return query select true, v_account.evaluations_used, null::integer, 'trial_active'::text;
    return;
  end if;

  return query select false, v_account.evaluations_used, 0, 'trial_expired'::text;
end;
$function$;

revoke all on function public.cc_consume_evaluation(uuid) from public;
grant execute on function public.cc_consume_evaluation(uuid) to authenticated;
