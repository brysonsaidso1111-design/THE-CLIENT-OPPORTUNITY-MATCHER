-- Stage 3 + Stage 17 foundation: profiles, entitlements, owner audit.
-- Manual purchase approval flow: PENDING -> ACTIVE | REVOKED | BLOCKED.
-- RLS enabled; policies require authenticated role and ownership checks.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  product_code text not null default 'CLIENT_OPPORTUNITY_MATCHER',
  state text not null check (state in ('PENDING', 'ACTIVE', 'REVOKED', 'BLOCKED')),
  purchase_reference text,
  purchase_provider text check (purchase_provider is null or purchase_provider in ('GUMROAD', 'SELAR', 'MANUAL', 'OTHER')),
  requested_at timestamptz not null default now(),
  decided_at timestamptz,
  decided_by uuid references public.profiles (id),
  decision_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, product_code)
);

create table if not exists public.entitlement_audit (
  id uuid primary key default gen_random_uuid(),
  entitlement_id uuid not null references public.entitlements (id) on delete cascade,
  actor_id uuid references public.profiles (id),
  action text not null check (action in ('REQUEST', 'APPROVE', 'REJECT', 'REVOKE', 'BLOCK', 'UNBLOCK')),
  from_state text,
  to_state text,
  note text,
  created_at timestamptz not null default now()
);

create index if not exists entitlements_user_id_idx on public.entitlements (user_id);
create index if not exists entitlement_audit_entitlement_id_idx on public.entitlement_audit (entitlement_id);

alter table public.profiles enable row level security;
alter table public.entitlements enable row level security;
alter table public.entitlement_audit enable row level security;

create policy profiles_select_own on public.profiles
  for select to authenticated
  using (id = auth.uid());

create policy profiles_update_own on public.profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy profiles_insert_own on public.profiles
  for insert to authenticated
  with check (id = auth.uid());

create policy entitlements_select_own on public.entitlements
  for select to authenticated
  using (user_id = auth.uid());

create policy entitlements_insert_request on public.entitlements
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and state = 'PENDING'
    and decided_by is null
  );

-- Owner approve/revoke/block uses service-role server path; clients cannot escalate state.
create policy entitlements_no_client_update on public.entitlements
  for update to authenticated
  using (false);

create policy entitlement_audit_select_own on public.entitlement_audit
  for select to authenticated
  using (
    exists (
      select 1 from public.entitlements e
      where e.id = entitlement_id and e.user_id = auth.uid()
    )
  );
