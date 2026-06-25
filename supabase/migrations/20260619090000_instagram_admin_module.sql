begin;

create table if not exists public.social_accounts (
  id uuid primary key default gen_random_uuid(),
  provider text not null check (provider in ('instagram')),
  ig_user_id text,
  username text,
  account_name text,
  account_type text,
  scopes jsonb not null default '[]'::jsonb,
  token_ciphertext text,
  refresh_token_ciphertext text,
  token_expires_at timestamptz,
  status text not null default 'disconnected'
    check (status in ('connected', 'disconnected', 'expired', 'error', 'pending_review')),
  last_test_at timestamptz,
  last_error text,
  connected_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  disconnected_at timestamptz
);

create unique index if not exists social_accounts_provider_ig_user_active_idx
  on public.social_accounts (provider, ig_user_id)
  where ig_user_id is not null and disconnected_at is null;

create index if not exists social_accounts_provider_status_idx
  on public.social_accounts (provider, status);

create table if not exists public.instagram_posts (
  id uuid primary key default gen_random_uuid(),
  social_account_id uuid references public.social_accounts(id) on delete set null,
  type text not null check (type in ('feed', 'carousel', 'reel', 'story')),
  title text not null check (char_length(title) between 3 and 180),
  caption text,
  hashtags text[] not null default '{}'::text[],
  media jsonb not null default '[]'::jsonb,
  preview jsonb not null default '{}'::jsonb,
  scheduled_at timestamptz,
  status text not null default 'draft'
    check (status in ('draft', 'review', 'scheduled', 'publishing', 'published', 'failed', 'cancelled')),
  review_required boolean not null default true,
  publish_lock text,
  publish_locked_at timestamptz,
  publish_attempts integer not null default 0 check (publish_attempts >= 0),
  instagram_container_id text,
  instagram_media_id text,
  permalink text,
  last_error text,
  created_by uuid references auth.users(id) on delete set null,
  approved_by uuid references auth.users(id) on delete set null,
  published_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz,
  constraint instagram_posts_scheduled_requires_date
    check (status <> 'scheduled' or scheduled_at is not null)
);

create index if not exists instagram_posts_status_scheduled_idx
  on public.instagram_posts (status, scheduled_at);

create index if not exists instagram_posts_created_by_idx
  on public.instagram_posts (created_by);

create index if not exists instagram_posts_social_account_idx
  on public.instagram_posts (social_account_id);

create table if not exists public.instagram_publish_logs (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.instagram_posts(id) on delete cascade,
  social_account_id uuid references public.social_accounts(id) on delete set null,
  action text not null,
  status text not null check (status in ('success', 'failed', 'blocked', 'info')),
  request_payload_safe jsonb,
  response_payload_safe jsonb,
  error_code text,
  error_message text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists instagram_publish_logs_post_created_idx
  on public.instagram_publish_logs (post_id, created_at desc);

create index if not exists instagram_publish_logs_status_created_idx
  on public.instagram_publish_logs (status, created_at desc);

create or replace function public.instagram_touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists social_accounts_touch_updated_at on public.social_accounts;
create trigger social_accounts_touch_updated_at
before update on public.social_accounts
for each row execute function public.instagram_touch_updated_at();

drop trigger if exists instagram_posts_touch_updated_at on public.instagram_posts;
create trigger instagram_posts_touch_updated_at
before update on public.instagram_posts
for each row execute function public.instagram_touch_updated_at();

alter table public.social_accounts enable row level security;
alter table public.instagram_posts enable row level security;
alter table public.instagram_publish_logs enable row level security;

drop policy if exists "Instagram accounts require Admin MFA" on public.social_accounts;
create policy "Instagram accounts require Admin MFA"
on public.social_accounts
for all
to authenticated
using ((select private.has_admin_mfa()))
with check ((select private.has_admin_mfa()));

drop policy if exists "Instagram posts require Admin MFA" on public.instagram_posts;
create policy "Instagram posts require Admin MFA"
on public.instagram_posts
for all
to authenticated
using ((select private.has_admin_mfa()))
with check ((select private.has_admin_mfa()));

drop policy if exists "Instagram logs require Admin MFA" on public.instagram_publish_logs;
create policy "Instagram logs require Admin MFA"
on public.instagram_publish_logs
for all
to authenticated
using ((select private.has_admin_mfa()))
with check ((select private.has_admin_mfa()));

grant select, insert, update, delete on public.social_accounts to authenticated;
grant select, insert, update, delete on public.instagram_posts to authenticated;
grant select, insert, update, delete on public.instagram_publish_logs to authenticated;

comment on table public.social_accounts is 'Server-side social account connections. Tokens must be encrypted and never exposed to client code.';
comment on table public.instagram_posts is 'Instagram editorial drafts, scheduled posts, publish state and safe references.';
comment on table public.instagram_publish_logs is 'Safe Instagram publish/test logs. Never store access tokens or raw secrets here.';

commit;
