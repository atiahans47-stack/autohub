import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function useChatInit(user: { id: string; full_name: string; email: string } | null) {
  useEffect(() => {
    if (!user) return;

    const initChat = async () => {
      // Check if user already has a chat room
      const { data: existing } = await supabase
        .from('chat_rooms')
        .select('id')
        .eq('created_by', user.id)
        .single();

      if (existing) return; // already has a chat room

      // Create a chat room for the user
      await (supabase.from('chat_rooms') as any).insert({
        created_by: user.id,
        name: `${user.full_name} - Support`,
        type: 'direct',
      });
    };

    initChat();
  }, [user]);
}
