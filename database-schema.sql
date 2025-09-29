-- =====================================================
-- Supabase Database Schema for Todo List Application
-- =====================================================
-- Run these commands in your Supabase SQL Editor
-- Make sure to run them in the correct order

-- =====================================================
-- 1. USERS TABLE
-- =====================================================
-- Create users table (extends auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- =====================================================
-- 2. CATEGORIES TABLE
-- =====================================================
-- Create categories table
CREATE TABLE public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Create policies for categories
CREATE POLICY "Users can view own categories" ON public.categories
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own categories" ON public.categories
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own categories" ON public.categories
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own categories" ON public.categories
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- 3. TASKS TABLE
-- =====================================================
-- Create tasks table
CREATE TABLE public.tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  status TEXT CHECK (status IN ('notStarted', 'inProgress', 'done')) DEFAULT 'notStarted',
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for tasks
CREATE POLICY "Users can view own tasks" ON public.tasks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks" ON public.tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks" ON public.tasks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks" ON public.tasks
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- 4. UTILITY FUNCTIONS
-- =====================================================
-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 5. TRIGGERS
-- =====================================================
-- Create triggers for updated_at columns
CREATE TRIGGER handle_updated_at_users
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_categories
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_tasks
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- 6. SAMPLE DATA (OPTIONAL)
-- =====================================================
-- Uncomment the following lines to insert sample data
-- Note: This will only work after a user is created through authentication

/*
-- Insert sample categories (replace 'user-uuid-here' with actual user ID)
INSERT INTO public.categories (id, name, user_id) VALUES
  (gen_random_uuid(), 'کار', 'user-uuid-here'),
  (gen_random_uuid(), 'شخصی', 'user-uuid-here'),
  (gen_random_uuid(), 'تفریح', 'user-uuid-here');

-- Insert sample tasks (replace 'user-uuid-here' with actual user ID)
INSERT INTO public.tasks (id, title, description, due_date, priority, status, category_id, user_id) VALUES
  (gen_random_uuid(), 'یادگیری React', 'مبانی React را درک کنید.', NOW() + INTERVAL '30 days', 'high', 'inProgress', 
   (SELECT id FROM public.categories WHERE name = 'کار' AND user_id = 'user-uuid-here' LIMIT 1), 'user-uuid-here'),
  (gen_random_uuid(), 'ساخت یک اپلیکیشن Todo', 'ایجاد یک اپلیکیشن Todo ساده با استفاده از React.', NOW() + INTERVAL '45 days', 'medium', 'notStarted',
   (SELECT id FROM public.categories WHERE name = 'کار' AND user_id = 'user-uuid-here' LIMIT 1), 'user-uuid-here'),
  (gen_random_uuid(), 'نوشتن تست‌ها', 'نوشتن تست‌های واحد برای اپلیکیشن Todo.', NOW() + INTERVAL '50 days', 'low', 'notStarted',
   (SELECT id FROM public.categories WHERE name = 'کار' AND user_id = 'user-uuid-here' LIMIT 1), 'user-uuid-here');
*/

-- =====================================================
-- 7. VERIFICATION QUERIES
-- =====================================================
-- Run these queries to verify your setup:

-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'categories', 'tasks');

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public';

-- Check triggers
SELECT trigger_name, event_manipulation, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public';

-- =====================================================
-- END OF SCHEMA SETUP
-- =====================================================
