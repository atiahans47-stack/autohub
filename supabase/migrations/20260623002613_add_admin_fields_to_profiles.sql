-- Add admin-specific fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS admin_created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS admin_created_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS admin_notes TEXT;