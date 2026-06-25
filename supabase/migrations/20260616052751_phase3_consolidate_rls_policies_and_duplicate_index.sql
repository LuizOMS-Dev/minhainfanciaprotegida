begin;

drop policy if exists "Admins manage profiles" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;
drop policy if exists "Profiles are private to owner" on public.profiles;
drop policy if exists "Users can update own profile name" on public.profiles;

create policy "Profiles select access"
on public.profiles
for select
to authenticated
using (
  id = (select auth.uid())
  or (select private.has_role('Admin'))
);

create policy "Profiles insert access"
on public.profiles
for insert
to authenticated
with check (
  id = (select auth.uid())
  or (select private.has_admin_mfa())
);

create policy "Profiles update access"
on public.profiles
for update
to authenticated
using (
  id = (select auth.uid())
  or (select private.has_admin_mfa())
)
with check (
  id = (select auth.uid())
  or (select private.has_admin_mfa())
);

create policy "Profiles delete requires Admin MFA"
on public.profiles
for delete
to authenticated
using ((select private.has_admin_mfa()));

drop policy if exists "User roles require Admin MFA" on public.user_roles;
drop policy if exists "Users can read own role" on public.user_roles;
drop policy if exists "Users can view own roles" on public.user_roles;

create policy "User roles select access"
on public.user_roles
for select
to authenticated
using (
  user_id = (select auth.uid())
  or (select private.has_admin_mfa())
);

create policy "User roles insert requires Admin MFA"
on public.user_roles
for insert
to authenticated
with check ((select private.has_admin_mfa()));

create policy "User roles update requires Admin MFA"
on public.user_roles
for update
to authenticated
using ((select private.has_admin_mfa()))
with check ((select private.has_admin_mfa()));

create policy "User roles delete requires Admin MFA"
on public.user_roles
for delete
to authenticated
using ((select private.has_admin_mfa()));

drop policy if exists "Users can read own recovery codes" on public.mfa_recovery_codes;

create policy "Users can read own recovery codes"
on public.mfa_recovery_codes
for select
to authenticated
using (user_id = (select auth.uid()));

drop policy if exists "Published articles are public" on public.articles;
drop policy if exists "Editors can manage articles" on public.articles;
drop policy if exists "Reviewers can update article review fields" on public.articles;
drop policy if exists "Admins can delete articles" on public.articles;

create policy "Published articles are public"
on public.articles
for select
to anon
using (
  status = 'published'
  and publish_at <= now()
);

create policy "Authenticated articles select access"
on public.articles
for select
to authenticated
using (
  (
    status = 'published'
    and publish_at <= now()
  )
  or (select private.has_role('Admin'))
  or (select private.has_role('Editor'))
  or (select private.has_role('Reviewer'))
);

create policy "Articles insert access"
on public.articles
for insert
to authenticated
with check (
  (select private.has_role('Admin'))
  or (select private.has_role('Editor'))
);

create policy "Articles update access"
on public.articles
for update
to authenticated
using (
  (select private.has_role('Admin'))
  or (select private.has_role('Editor'))
  or (select private.has_role('Reviewer'))
)
with check (
  (select private.has_role('Admin'))
  or (select private.has_role('Editor'))
  or (select private.has_role('Reviewer'))
);

create policy "Articles delete requires Admin MFA"
on public.articles
for delete
to authenticated
using ((select private.has_admin_mfa()));

drop policy if exists "Admins and editors can manage review notes" on public.article_review_notes;
drop policy if exists "Reviewers can read review notes" on public.article_review_notes;
drop policy if exists "Reviewers can create review notes" on public.article_review_notes;
drop policy if exists "Reviewers can update review notes" on public.article_review_notes;

create policy "Review notes select access"
on public.article_review_notes
for select
to authenticated
using (
  (select private.has_role('Admin'))
  or (select private.has_role('Editor'))
  or (select private.has_role('Reviewer'))
);

create policy "Review notes insert access"
on public.article_review_notes
for insert
to authenticated
with check (
  (select private.has_role('Admin'))
  or (select private.has_role('Editor'))
  or (select private.has_role('Reviewer'))
);

create policy "Review notes update access"
on public.article_review_notes
for update
to authenticated
using (
  (select private.has_role('Admin'))
  or (select private.has_role('Editor'))
  or (select private.has_role('Reviewer'))
)
with check (
  (select private.has_role('Admin'))
  or (select private.has_role('Editor'))
  or (select private.has_role('Reviewer'))
);

create policy "Review notes delete access"
on public.article_review_notes
for delete
to authenticated
using (
  (select private.has_role('Admin'))
  or (select private.has_role('Editor'))
);

drop policy if exists "Article sources are public" on public.article_sources;
drop policy if exists "Editors can manage article sources" on public.article_sources;

create policy "Article sources are public"
on public.article_sources
for select
to anon, authenticated
using (true);

create policy "Article sources insert access"
on public.article_sources
for insert
to authenticated
with check (
  (select private.has_role('Admin'))
  or (select private.has_role('Editor'))
);

create policy "Article sources update access"
on public.article_sources
for update
to authenticated
using (
  (select private.has_role('Admin'))
  or (select private.has_role('Editor'))
)
with check (
  (select private.has_role('Admin'))
  or (select private.has_role('Editor'))
);

create policy "Article sources delete access"
on public.article_sources
for delete
to authenticated
using (
  (select private.has_role('Admin'))
  or (select private.has_role('Editor'))
);

drop policy if exists "Help locations are public" on public.help_locations;
drop policy if exists "Editors can manage help locations" on public.help_locations;

create policy "Help locations are public"
on public.help_locations
for select
to anon, authenticated
using (true);

create policy "Help locations insert access"
on public.help_locations
for insert
to authenticated
with check (
  (select private.has_role('Admin'))
  or (select private.has_role('Editor'))
);

create policy "Help locations update access"
on public.help_locations
for update
to authenticated
using (
  (select private.has_role('Admin'))
  or (select private.has_role('Editor'))
)
with check (
  (select private.has_role('Admin'))
  or (select private.has_role('Editor'))
);

create policy "Help locations delete access"
on public.help_locations
for delete
to authenticated
using (
  (select private.has_role('Admin'))
  or (select private.has_role('Editor'))
);

drop policy if exists "Library items are public" on public.library_items;
drop policy if exists "Editors can manage library items" on public.library_items;

create policy "Library items are public"
on public.library_items
for select
to anon, authenticated
using (true);

create policy "Library items insert access"
on public.library_items
for insert
to authenticated
with check (
  (select private.has_role('Admin'))
  or (select private.has_role('Editor'))
);

create policy "Library items update access"
on public.library_items
for update
to authenticated
using (
  (select private.has_role('Admin'))
  or (select private.has_role('Editor'))
)
with check (
  (select private.has_role('Admin'))
  or (select private.has_role('Editor'))
);

create policy "Library items delete access"
on public.library_items
for delete
to authenticated
using (
  (select private.has_role('Admin'))
  or (select private.has_role('Editor'))
);

drop index if exists public.articles_type_status_idx;

commit;
