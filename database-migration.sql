-- =====================================================
-- Database Migration for Global Categories
-- =====================================================
-- This migration adds global categories and updates RLS policies
-- Run this in your Supabase SQL Editor

-- =====================================================
-- 1. UPDATE TASKS TABLE FIRST
-- =====================================================

-- First, we need to handle any existing tasks that reference categories
-- Since we're making categories global, we'll set all existing task categories to NULL
-- so users can reassign them to the new global categories
UPDATE public.tasks 
SET category_id = NULL 
WHERE category_id IS NOT NULL;

-- =====================================================
-- 2. REMOVE USER_ID COLUMN FROM CATEGORIES
-- =====================================================

-- Drop the user_id column to make categories truly global
ALTER TABLE public.categories DROP COLUMN IF EXISTS user_id;

-- =====================================================
-- 3. INSERT DEFAULT CATEGORIES
-- =====================================================

-- Insert default categories only if they don't exist

INSERT INTO public.categories (id, name, created_at, updated_at) 
SELECT gen_random_uuid(), 'کار', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = 'کار');

INSERT INTO public.categories (id, name, created_at, updated_at) 
SELECT gen_random_uuid(), 'شخصی', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = 'شخصی');

INSERT INTO public.categories (id, name, created_at, updated_at) 
SELECT gen_random_uuid(), 'تفریح', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = 'تفریح');

INSERT INTO public.categories (id, name, created_at, updated_at) 
SELECT gen_random_uuid(), 'تحصیل', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = 'تحصیل');

INSERT INTO public.categories (id, name, created_at, updated_at) 
SELECT gen_random_uuid(), 'سلامت', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = 'سلامت');

INSERT INTO public.categories (id, name, created_at, updated_at) 
SELECT gen_random_uuid(), 'خرید', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE name = 'خرید');

-- =====================================================
-- 4. UPDATE RLS POLICIES TO ALLOW GLOBAL ACCESS
-- =====================================================

-- Drop existing user-specific policies
DROP POLICY IF EXISTS "Users can view own categories" ON public.categories;
DROP POLICY IF EXISTS "Users can insert own categories" ON public.categories;
DROP POLICY IF EXISTS "Users can update own categories" ON public.categories;
DROP POLICY IF EXISTS "Users can delete own categories" ON public.categories;

-- Create new policies that allow global access (drop existing ones first)
DROP POLICY IF EXISTS "Anyone can view categories" ON public.categories;
DROP POLICY IF EXISTS "Authenticated users can insert categories" ON public.categories;
DROP POLICY IF EXISTS "Authenticated users can update categories" ON public.categories;
DROP POLICY IF EXISTS "Authenticated users can delete categories" ON public.categories;

CREATE POLICY "Anyone can view categories" ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert categories" ON public.categories
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update categories" ON public.categories
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete categories" ON public.categories
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- =====================================================
-- 5. VERIFICATION
-- =====================================================

-- Check the results
SELECT 'Categories after migration:' as info;
SELECT id, name, created_at FROM public.categories ORDER BY name;

-- Check tasks with categories
SELECT 'Tasks with categories:' as info;
SELECT t.id, t.title, c.name as category_name 
FROM public.tasks t 
LEFT JOIN public.categories c ON t.category_id = c.id 
ORDER BY t.created_at DESC 
LIMIT 10;

-- Check policies
SELECT 'RLS Policies:' as info;
SELECT policyname, cmd, qual FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'categories';

-- =====================================================
-- END OF MIGRATION
-- =====================================================
