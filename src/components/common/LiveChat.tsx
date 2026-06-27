'use client';
import { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface Message {
  id: string;
  room_id: string;
  sender_id: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

interface User {
  id: string;
  full_name: string;
  email: string;
}

export default function LiveChat() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Get current user from JWT session
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch('/api/auth/session');
        const data = await res.json();
        if (data.user) setCurrentUser(data.user);
      } catch (err) {
        console.error('Session error:', err);
      }
    };
    getUser();
  }, []);

  // Initialize chat room via API route (bypasses RLS using service role)
  useEffect(() => {
    if (!currentUser || !open) return;

    const initRoom = async () => {
      setLoading(true);
      try {
        // ✅ Use API route instead of Supabase client directly
        const res = await fetch('/api/chat/init-room', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: currentUser.id,
            fullName: currentUser.full_name,
          }),
        });

        const result = await res.json();
        if (result.error) throw new Error(result.error);

        setRoomId(result.roomId);

        // Load existing messages via API to bypass RLS
        const msgsRes = await fetch(`/api/chat/messages?roomId=${result.roomId}`);
        const msgsData = await msgsRes.json();
        setMessages(msgsData.messages || []);
      } catch (err) {
        console.error('Chat init error:', err);
      } finally {
        setLoading(false);
      }
    };

    initRoom();
  }, [currentUser, open]);

  // Subscribe to real-time messages
  useEffect(() => {
    if (!roomId) return;

    const channel = supabase
      .channel(`chat-room-${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          setMessages((prev) => {
            // Remove any temp message with same content, then add real one
            const filtered = prev.filter((m) =>
              !(m.id.startsWith('temp-') && m.message === payload.new.message && m.sender_id === payload.new.sender_id)
            );
            if (filtered.find((m) => m.id === payload.new.id)) return filtered;
            return [...filtered, payload.new as Message];
          });
        }
      )
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'chat_messages',
        filter: `room_id=eq.${roomId}`,
      }, (payload) => {
        setMessages((prev) => prev.map(m =>
          m.id === payload.new.id ? { ...m, is_read: payload.new.is_read } : m
        ));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim() || !currentUser || !roomId || sending) return;

    const messageText = text.trim();
    setText('');
    setSending(true);

    // Optimistically add message to UI
    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      room_id: roomId,
      sender_id: currentUser.id,
      message: messageText,
      created_at: new Date().toISOString(),
      is_read: false,
    };
    setMessages((prev) => [...prev, tempMessage]);

    try {
      const res = await fetch('/api/chat/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId,
          senderId: currentUser.id,
          message: messageText,
        }),
      });

      const result = await res.json();
      if (result.error) {
        console.error('Send error:', result.error);
        // Remove the optimistic message on error
        setMessages((prev) => prev.filter((m) => m.id !== tempMessage.id));
        setText(messageText);
      } else {
        // Replace temp message with real saved message from API response
        setMessages((prev) => prev.map((m) =>
          m.id === tempMessage.id
            ? { ...tempMessage, id: result.message?.id || tempMessage.id }
            : m
        ));
      }
    } catch (err) {
      console.error('Send message error:', err);
      // Remove the optimistic message on error
      setMessages((prev) => prev.filter((m) => m.id !== tempMessage.id));
      setText(messageText);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!currentUser) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="mb-4 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden" style={{ height: '480px' }}>
          <div className="bg-blue-600 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">AUTOHub Support</p>
                <p className="text-blue-100 text-xs">We typically reply instantly</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white hover:text-blue-200 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MessageCircle className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">No messages yet.</p>
                  <p className="text-gray-400 text-xs">Send a message to start the conversation!</p>
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender_id === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
                    msg.sender_id === currentUser.id
                      ? 'bg-blue-600 text-white rounded-br-sm'
                      : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-sm'
                  }`}>
                    <p>{msg.message}</p>
                    <p className={`text-xs mt-1 ${msg.sender_id === currentUser.id ? 'text-blue-100' : 'text-gray-400'}`}>
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>

          <div className="px-4 py-3 bg-white border-t border-gray-100 flex items-center gap-2">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
            <button
              onClick={sendMessage}
              disabled={!text.trim() || sending}
              className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              {sending ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <Send className="w-4 h-4 text-white" />}
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 bg-blue-600 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-all hover:scale-110"
      >
        {open ? <X className="w-6 h-6 text-white" /> : <MessageCircle className="w-6 h-6 text-white" />}
      </button>
    </div>
  );
}