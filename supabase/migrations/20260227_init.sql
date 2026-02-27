-- 1. Activer l'extension pgcrypto pour générer des UUIDs (généralement activé par défaut)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Création de la table 'components'
CREATE TABLE public.components (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    code_snippet TEXT NOT NULL,
    preview_image_1_url TEXT,
    preview_image_2_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Création de la table 'tags'
CREATE TABLE public.tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Contrainte: un utilisateur ne peut pas avoir deux tags avec le même nom
    UNIQUE (user_id, name)
);

-- 4. Création de la table de jonction 'component_tags'
CREATE TABLE public.component_tags (
    component_id UUID NOT NULL REFERENCES public.components(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (component_id, tag_id)
);

-- ==========================================
-- SÉCURITÉ : ROW LEVEL SECURITY (RLS)
-- ==========================================

ALTER TABLE public.components ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.component_tags ENABLE ROW LEVEL SECURITY;

-- Politiques pour la table 'components' (CRUD uniquement pour le propriétaire)
CREATE POLICY "Users can view their own components" ON public.components FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own components" ON public.components FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own components" ON public.components FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own components" ON public.components FOR DELETE USING (auth.uid() = user_id);

-- Politiques pour la table 'tags'
CREATE POLICY "Users can view their own tags" ON public.tags FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own tags" ON public.tags FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own tags" ON public.tags FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own tags" ON public.tags FOR DELETE USING (auth.uid() = user_id);

-- Politiques pour la table de jonction 'component_tags'
CREATE POLICY "Users can view component_tags for their components" ON public.component_tags
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.components WHERE components.id = component_id AND components.user_id = auth.uid())
  );

CREATE POLICY "Users can insert component_tags for their components" ON public.component_tags
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.components WHERE components.id = component_id AND components.user_id = auth.uid())
  );

CREATE POLICY "Users can delete component_tags for their components" ON public.component_tags
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.components WHERE components.id = component_id AND components.user_id = auth.uid())
  );
