-- Create chat_rooms table
CREATE TABLE IF NOT EXISTS public.chat_rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to read chat rooms
CREATE POLICY "Authenticated can read chat rooms"
  ON public.chat_rooms
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Allow authenticated users to insert chat rooms
CREATE POLICY "Authenticated can insert chat rooms"
  ON public.chat_rooms
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Allow authenticated users to update chat rooms
CREATE POLICY "Authenticated can update chat rooms"
  ON public.chat_rooms
  FOR UPDATE
  TO authenticated
  USING (true);

-- Policy: Allow authenticated users to read chat messages
CREATE POLICY "Authenticated can read chat messages"
  ON public.chat_messages
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Allow authenticated users to insert chat messages
CREATE POLICY "Authenticated can insert chat messages"
  ON public.chat_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Allow authenticated users to update chat messages
CREATE POLICY "Authenticated can update chat messages"
  ON public.chat_messages
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_chat_messages_room_id ON public.chat_messages(room_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_sender_id ON public.chat_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON public.chat_messages(created_at);

-- Create trigger for updated_at on chat_rooms
CREATE OR REPLACE FUNCTION update_chat_rooms_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER chat_rooms_updated_at
  BEFORE UPDATE ON public.chat_rooms
  FOR EACH ROW
  EXECUTE FUNCTION update_chat_rooms_updated_at();
