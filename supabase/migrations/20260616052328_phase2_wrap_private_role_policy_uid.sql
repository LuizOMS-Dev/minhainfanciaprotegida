begin;

drop policy if exists "Editors and Reviewers can view all articles" on public.articles;
create policy "Editors and Reviewers can view all articles"
on public.articles
for select
to authenticated
using (
  (select private.has_role((select auth.uid()), 'admin'::public.app_role))
  or (select private.has_role((select auth.uid()), 'editor'::public.app_role))
  or (select private.has_role((select auth.uid()), 'reviewer'::public.app_role))
);

drop policy if exists "Editors and Admins insert articles" on public.articles;
create policy "Editors and Admins insert articles"
on public.articles
for insert
to authenticated
with check (
  (select private.has_role((select auth.uid()), 'admin'::public.app_role))
  or (select private.has_role((select auth.uid()), 'editor'::public.app_role))
);

drop policy if exists "Editors and Admins update articles" on public.articles;
create policy "Editors and Admins update articles"
on public.articles
for update
to authenticated
using (
  (select private.has_role((select auth.uid()), 'admin'::public.app_role))
  or (select private.has_role((select auth.uid()), 'editor'::public.app_role))
)
with check (
  (select private.has_role((select auth.uid()), 'admin'::public.app_role))
  or (select private.has_role((select auth.uid()), 'editor'::public.app_role))
);

drop policy if exists "Reviewers can only update articles" on public.articles;
create policy "Reviewers can only update articles"
on public.articles
for update
to authenticated
using ((select private.has_role((select auth.uid()), 'reviewer'::public.app_role)))
with check ((select private.has_role((select auth.uid()), 'reviewer'::public.app_role)));

drop policy if exists "Editors manage sources" on public.article_sources;
create policy "Editors manage sources"
on public.article_sources
for all
to authenticated
using (
  (select private.has_role((select auth.uid()), 'admin'::public.app_role))
  or (select private.has_role((select auth.uid()), 'editor'::public.app_role))
)
with check (
  (select private.has_role((select auth.uid()), 'admin'::public.app_role))
  or (select private.has_role((select auth.uid()), 'editor'::public.app_role))
);

drop policy if exists "Editors manage help locations" on public.help_locations;
create policy "Editors manage help locations"
on public.help_locations
for all
to authenticated
using (
  (select private.has_role((select auth.uid()), 'admin'::public.app_role))
  or (select private.has_role((select auth.uid()), 'editor'::public.app_role))
)
with check (
  (select private.has_role((select auth.uid()), 'admin'::public.app_role))
  or (select private.has_role((select auth.uid()), 'editor'::public.app_role))
);

drop policy if exists "Editors manage library" on public.library_items;
create policy "Editors manage library"
on public.library_items
for all
to authenticated
using (
  (select private.has_role((select auth.uid()), 'admin'::public.app_role))
  or (select private.has_role((select auth.uid()), 'editor'::public.app_role))
)
with check (
  (select private.has_role((select auth.uid()), 'admin'::public.app_role))
  or (select private.has_role((select auth.uid()), 'editor'::public.app_role))
);

drop policy if exists "Admins and Editors have full access to review notes" on public.article_review_notes;
create policy "Admins and Editors have full access to review notes"
on public.article_review_notes
for all
to authenticated
using (
  (select private.has_role((select auth.uid()), 'admin'::public.app_role))
  or (select private.has_role((select auth.uid()), 'editor'::public.app_role))
)
with check (
  (select private.has_role((select auth.uid()), 'admin'::public.app_role))
  or (select private.has_role((select auth.uid()), 'editor'::public.app_role))
);

drop policy if exists "Reviewers can view review notes" on public.article_review_notes;
create policy "Reviewers can view review notes"
on public.article_review_notes
for select
to authenticated
using (
  (select private.has_role((select auth.uid()), 'reviewer'::public.app_role))
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
  (select private.has_role((select auth.uid()), 'reviewer'::public.app_role))
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
  (select private.has_role((select auth.uid()), 'reviewer'::public.app_role))
  and reviewer_id = (select auth.uid())
  and exists (
    select 1
    from public.articles a
    where a.id = article_review_notes.article_id
      and a.reviewer_id = (select auth.uid())
  )
)
with check (
  (select private.has_role((select auth.uid()), 'reviewer'::public.app_role))
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
    (select private.has_role((select auth.uid()), 'admin'::public.app_role))
    or (select private.has_role((select auth.uid()), 'editor'::public.app_role))
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
    (select private.has_role((select auth.uid()), 'admin'::public.app_role))
    or (select private.has_role((select auth.uid()), 'editor'::public.app_role))
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
    (select private.has_role((select auth.uid()), 'admin'::public.app_role))
    or (select private.has_role((select auth.uid()), 'editor'::public.app_role))
  )
);

commit;
