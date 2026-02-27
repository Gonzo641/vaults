-- Migration SQL: Création du bucket 'component-previews'
-- Ce bucket permet aux utilisateurs de stocker leurs images de prévisualisation de composants

INSERT INTO storage.buckets (id, name, public) 
VALUES ('component-previews', 'component-previews', true)
ON CONFLICT (id) DO NOTHING;

-- Les images sont publiques (tout le monde peut les voir)
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'component-previews');

-- Seuls les utilisateurs authentifiés peuvent uploader dans ce bucket
CREATE POLICY "Auth Users can upload" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'component-previews' AND auth.role() = 'authenticated');

-- Les utilisateurs ne peuvent mettre à jour que leurs propres images
CREATE POLICY "Users can update their own images" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'component-previews' AND auth.uid() = owner);

-- Les utilisateurs ne peuvent supprimer que leurs propres images
CREATE POLICY "Users can delete their own images" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'component-previews' AND auth.uid() = owner);
