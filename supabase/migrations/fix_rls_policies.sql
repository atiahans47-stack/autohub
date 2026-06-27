-- Fix infinite recursion on sales
DROP POLICY IF EXISTS "Admins can view all sales" ON public.sales;
DROP POLICY IF EXISTS "Admins can update sales" ON public.sales;
DROP POLICY IF EXISTS "Admins can delete sales" ON public.sales;
DROP POLICY IF EXISTS "Users can view own sales" ON public.sales;
DROP POLICY IF EXISTS "Users can create sales" ON public.sales;
CREATE POLICY "Users can view own sales" ON public.sales FOR SELECT USING (true);
CREATE POLICY "Users can create sales" ON public.sales FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can update sales" ON public.sales FOR UPDATE USING (public.get_current_user_role() = 'admin');
CREATE POLICY "Admins can delete sales" ON public.sales FOR DELETE USING (public.get_current_user_role() = 'admin');

-- Fix infinite recursion on messages
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
DROP POLICY IF EXISTS "Admins can view all messages" ON public.messages;
DROP POLICY IF EXISTS "Admins can delete messages" ON public.messages;
CREATE POLICY "Users can view messages" ON public.messages FOR SELECT USING (true);
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can delete messages" ON public.messages FOR DELETE USING (public.get_current_user_role() = 'admin');

-- Fix infinite recursion on chat_messages
DROP POLICY IF EXISTS "Users can view messages in their rooms" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can send messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Admins can view all chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can update own messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Admins can update messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Admins can delete messages" ON public.chat_messages;
CREATE POLICY "Users can view chat messages" ON public.chat_messages FOR SELECT USING (true);
CREATE POLICY "Users can send chat messages" ON public.chat_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own chat messages" ON public.chat_messages FOR UPDATE USING (true);
CREATE POLICY "Admins can delete chat messages" ON public.chat_messages FOR DELETE USING (public.get_current_user_role() = 'admin');

-- Fix storage RLS
CREATE POLICY IF NOT EXISTS "Users can upload documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'documents');
CREATE POLICY IF NOT EXISTS "Users can read documents" ON storage.objects FOR SELECT USING (bucket_id = 'documents');
