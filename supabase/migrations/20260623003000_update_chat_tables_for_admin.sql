-- Add fields to chat_rooms for admin management
ALTER TABLE public.chat_rooms
ADD COLUMN IF NOT EXISTS created_by UUID,
ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'direct',
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Open',
ADD COLUMN IF NOT EXISTS user_name TEXT,
ADD COLUMN IF NOT EXISTS user_email TEXT;

-- Add fields to chat_messages for read tracking
ALTER TABLE public.chat_messages
ADD COLUMN IF NOT EXISTS client_seen_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS admin_seen_at TIMESTAMP WITH TIME ZONE;

-- Create index on created_by for faster admin queries
CREATE INDEX IF NOT EXISTS idx_chat_rooms_created_by ON public.chat_rooms(created_by);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_status ON public.chat_rooms(status);
