CREATE POLICY "Media public read" ON storage.objects FOR SELECT
  USING (bucket_id = 'media');
CREATE POLICY "Editors upload media" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor')));
CREATE POLICY "Editors update media" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'media' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor')));
CREATE POLICY "Editors delete media" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'media' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor')));