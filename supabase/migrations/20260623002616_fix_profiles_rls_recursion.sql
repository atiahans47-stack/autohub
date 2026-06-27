-- Fix infinite recursion in RLS policy for profiles relation
-- The self-referencing foreign key on admin_created_by causes RLS recursion
-- Solution: Remove the foreign key constraint and use a simple UUID field

-- Drop the self-referencing foreign key constraint
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_admin_created_by_fkey;

-- Replace with a simple UUID field without foreign key constraint
ALTER TABLE public.profiles 
ALTER COLUMN admin_created_by DROP DEFAULT,
ALTER COLUMN admin_created_by TYPE UUID USING admin_created_by::UUID;
