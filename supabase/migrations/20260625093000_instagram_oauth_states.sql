begin;

create table if not exists public.instagram_oauth_states (
  id uuid primary key default gen_random_uuid(),
  state_hash text not null unique,
  created_by uuid references auth.users(id) on delete cascade,
  redirect_to text not null default '/admin/instagram',
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists instagram_oauth_states_expiry_idx
  on public.instagram_oauth_states (expires_at)
  where used_at is null;

alter table public.instagram_oauth_states enable row level security;

drop policy if exists "Instagram oauth states require Admin MFA" on public.instagram_oauth_states;
create policy "Instagram oauth states require Admin MFA"
on public.instagram_oauth_states
for all
to authenticated
using ((select private.has_admin_mfa()))
with check ((select private.has_admin_mfa()));

grant select, insert, update, delete on public.instagram_oauth_states to authenticated;

comment on table public.instagram_oauth_states is 'Short-lived hashed OAuth state records for Instagram Login CSRF/replay protection.';

commit;
