begin;

create schema if not exists private;

revoke all on schema private from public;
revoke all on schema private from anon;
revoke all on schema private from authenticated;
grant usage on schema private to authenticated;
grant usage on schema private to service_role;

create or replace function private.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  );
$$;

create or replace function private.has_admin_mfa()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select private.has_role((select auth.uid()), 'admin'::public.app_role)
     and ((select auth.jwt())->>'aal' = 'aal2');
$$;

revoke all on function private.has_role(uuid, public.app_role) from public;
revoke all on function private.has_role(uuid, public.app_role) from anon;
revoke all on function private.has_role(uuid, public.app_role) from authenticated;
revoke all on function private.has_admin_mfa() from public;
revoke all on function private.has_admin_mfa() from anon;
revoke all on function private.has_admin_mfa() from authenticated;
grant execute on function private.has_role(uuid, public.app_role) to authenticated;
grant execute on function private.has_role(uuid, public.app_role) to service_role;
grant execute on function private.has_admin_mfa() to authenticated;
grant execute on function private.has_admin_mfa() to service_role;

create or replace function public.protect_reviewer_updates()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if private.has_role((select auth.uid()), 'admin'::public.app_role)
     or private.has_role((select auth.uid()), 'editor'::public.app_role) then
    return new;
  end if;

  if private.has_role((select auth.uid()), 'reviewer'::public.app_role) then
    if old.status::text in ('published', 'archived', 'scheduled') then
       raise exception 'Access denied: reviewers cannot modify published, archived, or scheduled articles.';
    end if;

    if not (
      (old.reviewer_id is null and new.reviewer_id = (select auth.uid())) or
      (old.reviewer_id = (select auth.uid()) and new.reviewer_id = (select auth.uid()))
    ) then
       raise exception 'Access denied: reviewers can only claim orphan articles or update articles assigned to themselves.';
    end if;

    if new.status::text not in ('draft', 'review') then
       raise exception 'Access denied: reviewers can only set status to draft or review.';
    end if;

    if (to_jsonb(new) - 'status' - 'reviewer_id' - 'updated_at') is distinct from (to_jsonb(old) - 'status' - 'reviewer_id' - 'updated_at') then
       raise exception 'Access denied: reviewers can only change status and assignment fields.';
    end if;
  end if;

  return new;
end;
$$;

drop policy if exists "Lockouts require Admin MFA" on public.account_lockouts;
create policy "Lockouts require Admin MFA"
on public.account_lockouts
for all
to authenticated
using ((select private.has_admin_mfa()))
with check ((select private.has_admin_mfa()));

drop policy if exists "Admin sessions require MFA" on public.admin_sessions;
create policy "Admin sessions require MFA"
on public.admin_sessions
for all
to authenticated
using ((select private.has_admin_mfa()))
with check ((select private.has_admin_mfa()));

drop policy if exists "Audit logs require Admin MFA" on public.audit_log;
create policy "Audit logs require Admin MFA"
on public.audit_log
for all
to authenticated
using ((select private.has_admin_mfa()))
with check ((select private.has_admin_mfa()));

drop policy if exists "Login attempts require Admin MFA" on public.login_attempts;
create policy "Login attempts require Admin MFA"
on public.login_attempts
for all
to authenticated
using ((select private.has_admin_mfa()))
with check ((select private.has_admin_mfa()));

drop policy if exists "Admins manage profiles" on public.profiles;
create policy "Admins manage profiles"
on public.profiles
for all
to authenticated
using ((select private.has_admin_mfa()))
with check ((select private.has_admin_mfa()));

drop policy if exists "User roles require Admin MFA" on public.user_roles;
create policy "User roles require Admin MFA"
on public.user_roles
for all
to authenticated
using ((select private.has_admin_mfa()))
with check ((select private.has_admin_mfa()));

drop policy if exists "Editors and Reviewers can view all articles" on public.articles;
create policy "Editors and Reviewers can view all articles"
on public.articles
for select
to authenticated
using (
  (select private.has_role(auth.uid(), 'admin'::public.app_role))
  or (select private.has_role(auth.uid(), 'editor'::public.app_role))
  or (select private.has_role(auth.uid(), 'reviewer'::public.app_role))
);

drop policy if exists "Editors and Admins insert articles" on public.articles;
create policy "Editors and Admins insert articles"
on public.articles
for insert
to authenticated
with check (
  (select private.has_role(auth.uid(), 'admin'::public.app_role))
  or (select private.has_role(auth.uid(), 'editor'::public.app_role))
);

drop policy if exists "Editors and Admins update articles" on public.articles;
create policy "Editors and Admins update articles"
on public.articles
for update
to authenticated
using (
  (select private.has_role(auth.uid(), 'admin'::public.app_role))
  or (select private.has_role(auth.uid(), 'editor'::public.app_role))
)
with check (
  (select private.has_role(auth.uid(), 'admin'::public.app_role))
  or (select private.has_role(auth.uid(), 'editor'::public.app_role))
);

drop policy if exists "Reviewers can only update articles" on public.articles;
create policy "Reviewers can only update articles"
on public.articles
for update
to authenticated
using ((select private.has_role(auth.uid(), 'reviewer'::public.app_role)))
with check ((select private.has_role(auth.uid(), 'reviewer'::public.app_role)));

drop policy if exists "Admins can delete articles with MFA" on public.articles;
create policy "Admins can delete articles with MFA"
on public.articles
for delete
to authenticated
using ((select private.has_admin_mfa()));

drop policy if exists "Editors manage sources" on public.article_sources;
create policy "Editors manage sources"
on public.article_sources
for all
to authenticated
using (
  (select private.has_role(auth.uid(), 'admin'::public.app_role))
  or (select private.has_role(auth.uid(), 'editor'::public.app_role))
)
with check (
  (select private.has_role(auth.uid(), 'admin'::public.app_role))
  or (select private.has_role(auth.uid(), 'editor'::public.app_role))
);

drop policy if exists "Editors manage help locations" on public.help_locations;
create policy "Editors manage help locations"
on public.help_locations
for all
to authenticated
using (
  (select private.has_role(auth.uid(), 'admin'::public.app_role))
  or (select private.has_role(auth.uid(), 'editor'::public.app_role))
)
with check (
  (select private.has_role(auth.uid(), 'admin'::public.app_role))
  or (select private.has_role(auth.uid(), 'editor'::public.app_role))
);

drop policy if exists "Editors manage library" on public.library_items;
create policy "Editors manage library"
on public.library_items
for all
to authenticated
using (
  (select private.has_role(auth.uid(), 'admin'::public.app_role))
  or (select private.has_role(auth.uid(), 'editor'::public.app_role))
)
with check (
  (select private.has_role(auth.uid(), 'admin'::public.app_role))
  or (select private.has_role(auth.uid(), 'editor'::public.app_role))
);

drop policy if exists "Admins and Editors have full access to review notes" on public.article_review_notes;
create policy "Admins and Editors have full access to review notes"
on public.article_review_notes
for all
to authenticated
using (
  (select private.has_role(auth.uid(), 'admin'::public.app_role))
  or (select private.has_role(auth.uid(), 'editor'::public.app_role))
)
with check (
  (select private.has_role(auth.uid(), 'admin'::public.app_role))
  or (select private.has_role(auth.uid(), 'editor'::public.app_role))
);

drop policy if exists "Reviewers can view review notes" on public.article_review_notes;
create policy "Reviewers can view review notes"
on public.article_review_notes
for select
to authenticated
using (
  (select private.has_role(auth.uid(), 'reviewer'::public.app_role))
  and (
    reviewer_id = (select auth.uid())
    or exists (
      select 1
      from public.articles a
      where a.id = article_review_notes.article_id
        and a.reviewer_id = (select auth.uid())
    )
  )
);

drop policy if exists "Reviewers can insert their own notes" on public.article_review_notes;
create policy "Reviewers can insert their own notes"
on public.article_review_notes
for insert
to authenticated
with check (
  (select private.has_role(auth.uid(), 'reviewer'::public.app_role))
  and reviewer_id = (select auth.uid())
  and exists (
    select 1
    from public.articles a
    where a.id = article_review_notes.article_id
      and a.reviewer_id = (select auth.uid())
  )
);

drop policy if exists "Reviewers can update their own notes" on public.article_review_notes;
create policy "Reviewers can update their own notes"
on public.article_review_notes
for update
to authenticated
using (
  (select private.has_role(auth.uid(), 'reviewer'::public.app_role))
  and reviewer_id = (select auth.uid())
  and exists (
    select 1
    from public.articles a
    where a.id = article_review_notes.article_id
      and a.reviewer_id = (select auth.uid())
  )
)
with check (
  (select private.has_role(auth.uid(), 'reviewer'::public.app_role))
  and reviewer_id = (select auth.uid())
  and exists (
    select 1
    from public.articles a
    where a.id = article_review_notes.article_id
      and a.reviewer_id = (select auth.uid())
  )
);

drop policy if exists "Editors upload media" on storage.objects;
create policy "Editors upload media"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'media'
  and (
    (select private.has_role(auth.uid(), 'admin'::public.app_role))
    or (select private.has_role(auth.uid(), 'editor'::public.app_role))
  )
);

drop policy if exists "Editors update media" on storage.objects;
create policy "Editors update media"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'media'
  and (
    (select private.has_role(auth.uid(), 'admin'::public.app_role))
    or (select private.has_role(auth.uid(), 'editor'::public.app_role))
  )
);

drop policy if exists "Editors delete media" on storage.objects;
create policy "Editors delete media"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'media'
  and (
    (select private.has_role(auth.uid(), 'admin'::public.app_role))
    or (select private.has_role(auth.uid(), 'editor'::public.app_role))
  )
);

revoke execute on function public.has_admin_mfa() from public;
revoke execute on function public.has_admin_mfa() from anon;
revoke execute on function public.has_admin_mfa() from authenticated;
revoke execute on function public.has_role(uuid, public.app_role) from public;
revoke execute on function public.has_role(uuid, public.app_role) from anon;
revoke execute on function public.has_role(uuid, public.app_role) from authenticated;
grant execute on function public.has_admin_mfa() to service_role;
grant execute on function public.has_role(uuid, public.app_role) to service_role;

commit;
