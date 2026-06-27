'use client';
import { useEffect, useRef, useState } from 'react';
import { Send, Loader2, MessageCircle, Search, MoreVertical, Check, CheckCheck, ArrowLeft, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { apiFetch } from '@/lib/adminPanelApi';

interface Message {
  id: string;
  room_id: string;
  sender_id: string;
  message: string;
  created_at: string;
  is_read: boolean;
  client_seen_at?: string | null;
  admin_seen_at?: string | null;
}

interface Room {
  id: string;
  name: string;
  created_by: string;
  updated_at: string;
  status: string;
  user_name: string;
  user_email: string;
  last_message?: string;
  unread_count?: number;
}

export default function AdminChatPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [adminId, setAdminId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showChatOnMobile, setShowChatOnMobile] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const roomsSubscriptionRef = useRef<any>(null);
  const messagesSubscriptionRef = useRef<any>(null);

  // Get admin ID from session
  useEffect(() => {
    const adminSession = localStorage.getItem('adminSession');
    if (adminSession) {
      setAdminId(adminSession);
    }
  }, []);

  // Load all chat rooms with real-time subscription
  useEffect(() => {
    const loadRooms = async () => {
      setLoading(true);
      try {
        const data = await apiFetch<any[]>('/admin/chat');
        
        const roomsData: Room[] = data.map((s: any) => ({
          id: s.id,
          name: s.userName,
          created_by: s.id,
          updated_at: s.lastActivity,
          status: s.status,
          user_name: s.userName || s.name || s.userEmail?.split('@')[0] || 'Unknown User',
          user_email: s.userEmail || 'No email provided',
          last_message: s.messages[s.messages.length - 1]?.message || '',
          unread_count: s.messages.filter((m: any) => !m.adminSeenAt && m.sender === 'client').length,
        }));
        
        setRooms(roomsData);
      } catch (err) {
        console.error('Error loading rooms:', err);
      } finally {
        setLoading(false);
      }
    };

    loadRooms();

    // Set up real-time subscription for chat rooms
    const subscription = supabase
      .channel('chat_rooms_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_rooms' }, () => {
        loadRooms();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_messages' }, () => {
        loadRooms();
      })
      .subscribe();

    roomsSubscriptionRef.current = subscription;

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Load messages when room is selected with real-time subscription
  useEffect(() => {
    if (!selectedRoom) return;

    // Clear messages from previous room immediately on room switch
    setMessages([]);

    // Load messages for this specific room only
    const loadMessages = async () => {
      try {
        const data = await apiFetch<any[]>('/admin/chat');
        const session = data.find((s: any) => s.id === selectedRoom.id);
        
        if (session) {
          const messagesData: Message[] = session.messages.map((m: any) => ({
            id: m.id,
            room_id: selectedRoom.id, // always use selectedRoom.id
            sender_id: m.sender === 'admin' ? adminId : selectedRoom.created_by,
            message: m.message,
            created_at: m.createdAt,
            is_read: !!m.adminSeenAt,
            client_seen_at: m.clientSeenAt,
            admin_seen_at: m.adminSeenAt,
          }));
          setMessages(messagesData);
        }

        // Mark messages as seen
        await apiFetch(`/admin/chat/${selectedRoom.id}/messages/seen`, { method: 'POST' });
      } catch (err) {
        console.error('Error loading messages:', err);
      }
    };

    loadMessages();
    const interval = setInterval(loadMessages, 2000);

    // Set up real-time subscription for messages in this room
    const subscription = supabase
      .channel(`messages_${selectedRoom.id}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'chat_messages',
        filter: `room_id=eq.${selectedRoom.id}`
      }, () => {
        loadMessages();
      })
      .subscribe();

    messagesSubscriptionRef.current = subscription;

    // Cleanup: clear messages and stop polling when room changes
    return () => {
      clearInterval(interval);
      subscription.unsubscribe();
      setMessages([]); // clear messages on room switch
    };
  }, [selectedRoom?.id, adminId]); // depend on selectedRoom.id not the whole object

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim() || !selectedRoom || !adminId || sending) return;

    const messageText = text.trim();
    setText('');
    setSending(true);

    try {
      await apiFetch(`/admin/chat/${selectedRoom.id}/messages`, {
        method: 'POST',
        body: JSON.stringify({ sender: 'admin', message: messageText }),
      });
    } catch (err) {
      console.error('Send error:', err);
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

  const handleRoomSelect = (room: Room) => {
    setSelectedRoom(room);
    setShowChatOnMobile(true);
  };

  const handleBackToRooms = () => {
    setShowChatOnMobile(false);
    setSelectedRoom(null);
  };

  const filteredRooms = rooms.filter(room =>
    room.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.user_email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#efeae2] overflow-hidden">
      
      {/* Rooms sidebar - WhatsApp style */}
      <div className={`bg-white flex flex-col border-r border-gray-200 transition-all duration-300 ${
        showChatOnMobile ? 'hidden md:flex w-96' : 'flex w-full md:w-96'
      }`}>
        {/* Header */}
        <div className="px-4 py-3 bg-[#f0f2f5] flex items-center justify-between border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Support Chats</h2>
            <p className="text-xs text-gray-500">{rooms.length} conversations</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="pl-9 pr-4 py-2 bg-white rounded-lg text-sm outline-none border border-gray-200 focus:border-gray-300 w-32 md:w-48"
            />
          </div>
        </div>

        {/* Rooms list */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-400 text-sm">Loading...</div>
          ) : filteredRooms.length === 0 ? (
            <div className="p-4 text-center text-gray-400 text-sm">No chats found</div>
          ) : (
            filteredRooms.map((room) => (
              <button
                key={room.id}
                onClick={() => handleRoomSelect(room)}
                className={`w-full p-3 text-left hover:bg-[#f5f6f6] border-b border-gray-100 transition-colors ${
                  selectedRoom?.id === room.id ? 'bg-[#f0f2f5]' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-white font-semibold text-lg">
                      {(room.user_name || room.user_email || 'U').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-gray-900 text-sm truncate">{room.user_name || room.name || 'Unknown User'}</p>
                      <span className="text-xs text-gray-500 shrink-0 ml-2">
                        {new Date(room.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500 truncate w-32 md:w-40">
                        {room.last_message || 'No messages yet'}
                      </p>
                      {room.unread_count && room.unread_count > 0 ? (
                        <span className="bg-green-500 text-white text-xs rounded-full px-2 py-0.5 font-medium shrink-0 ml-2">
                          {room.unread_count}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat area - WhatsApp style */}
      <div className={`flex-1 flex flex-col bg-[#efeae2] transition-all duration-300 ${
        showChatOnMobile ? 'flex' : 'hidden md:flex'
      }`}>
        {selectedRoom ? (
          <>
            {/* Chat header */}
            <div className="px-4 py-3 bg-[#f0f2f5] flex items-center gap-3 border-b border-gray-200">
              <button
                onClick={handleBackToRooms}
                className="md:hidden p-2 hover:bg-gray-200 rounded-full"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shrink-0">
                <span className="text-white font-semibold">
                  {(selectedRoom.user_name || selectedRoom.user_email || 'U').charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm truncate">{selectedRoom.user_name || selectedRoom.name || 'Unknown User'}</p>
                <p className="text-xs text-gray-500 truncate">{selectedRoom.user_email || ''}</p>
              </div>
              <button className="p-2 hover:bg-gray-200 rounded-full shrink-0">
                <MoreVertical className="w-6 h-6 text-blue-600" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-[#efeae2]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23d4cfc4\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}>
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center bg-white p-6 rounded-lg shadow-sm">
                    <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No messages yet. Start the conversation!</p>
                  </div>
                </div>
              ) : (
                messages.map((msg) => {
                  const isAdmin = msg.sender_id === adminId;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[85%] md:max-w-md px-3 py-2 rounded-lg text-sm shadow-sm ${
                        isAdmin
                          ? 'bg-[#d9fdd3] text-gray-800 rounded-tr-sm'
                          : 'bg-white text-gray-800 rounded-tl-sm'
                      }`}>
                        <p className="leading-relaxed break-words">{msg.message}</p>
                        <div className={`flex items-center justify-end gap-1 mt-1 ${isAdmin ? 'text-gray-500' : 'text-gray-400'}`}>
                          <span className="text-[10px] shrink-0">
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {isAdmin && (
                            msg.client_seen_at ? (
                              <CheckCheck className="w-3 h-3 text-blue-500 shrink-0" />
                            ) : (
                              <Check className="w-3 h-3 text-gray-400 shrink-0" />
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 bg-[#f0f2f5] flex items-center gap-3">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="flex-1 bg-white rounded-lg px-4 py-3 text-sm outline-none border border-gray-200 focus:border-gray-300"
              />
              <button
                onClick={sendMessage}
                disabled={!text.trim() || sending}
                className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                {sending ? (
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                ) : (
                  <Send className="w-5 h-5 text-white" />
                )}
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-[#f0f2f5]">
            <div className="text-center px-4">
              <MessageCircle className="w-24 h-24 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">AUTOHub Support Chat</p>
              <p className="text-gray-400 text-sm mt-2">Select a conversation to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
