-- Add additional image columns to cars table
ALTER TABLE public.cars 
ADD COLUMN IF NOT EXISTS image2 TEXT,
ADD COLUMN IF NOT EXISTS image3 TEXT;
