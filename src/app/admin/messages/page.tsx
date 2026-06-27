'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft,
  Send,
  Search,
  MoreVertical,
  Phone,
  Video,
  Paperclip,
  Smile,
  Check,
  CheckCheck
} from 'lucide-react';
import Link from 'next/link';
import { SearchInput, TextInput } from "@/components/ui/FormFields";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  isAdmin: boolean;
}

interface Conversation {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  avatar?: string;
  online: boolean;
}

export default function AdminMessages() {
  const router = useRouter();
  const hasLoadedData = useRef(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const loadMessages = async (conversationId?: string) => {
    try {
      const token = localStorage.getItem('adminSession');
      const url = conversationId 
        ? `/api/messages?conversationId=${conversationId}`
        : '/api/messages';
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      
      const messagesData = data.messages.map((msg: { _id: string; senderId: string; senderName: string; text: string; timestamp: string; status: string; isAdmin: boolean }) => ({
        id: msg._id,
        senderId: msg.senderId,
        senderName: msg.senderName,
        text: msg.text,
        timestamp: new Date(msg.timestamp).toLocaleString(),
        status: msg.status as 'sent' | 'delivered' | 'read',
        isAdmin: msg.isAdmin,
      }));
      
      setMessages(messagesData);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const loadConversations = async () => {
    try {
      const token = localStorage.getItem('adminSession');
      const response = await fetch('/api/messages', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      
      // Group messages by conversation ID to create conversations
      const conversationsMap = new Map<string, Conversation>();
      
      data.messages.forEach((msg: { _id: string; conversationId: string; senderName: string; senderEmail: string; senderPhone: string; text: string; timestamp: string; status: string; isAdmin: boolean }) => {
        if (!conversationsMap.has(msg.conversationId)) {
          conversationsMap.set(msg.conversationId, {
            id: msg.conversationId,
            clientName: msg.senderName,
            clientEmail: msg.senderEmail || '',
            clientPhone: msg.senderPhone || '',
            lastMessage: msg.text,
            lastMessageTime: new Date(msg.timestamp).toLocaleString(),
            unreadCount: msg.status === 'sent' && !msg.isAdmin ? 1 : 0,
            online: false,
          });
        } else {
          const conv = conversationsMap.get(msg.conversationId)!;
          if (new Date(msg.timestamp) > new Date(conv.lastMessageTime)) {
            conv.lastMessage = msg.text;
            conv.lastMessageTime = new Date(msg.timestamp).toLocaleString();
          }
          if (msg.status === 'sent' && !msg.isAdmin) {
            conv.unreadCount++;
          }
        }
      });
      
      setConversations(Array.from(conversationsMap.values()));
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  useEffect(() => {
    const adminSession = localStorage.getItem('adminSession');
    if (!adminSession) {
      router.push('/admin/login');
      return;
    }

    if (!hasLoadedData.current) {
      hasLoadedData.current = true;
      loadConversations();
    }
  }, [router]);

  const handleConversationSelect = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    loadMessages(conversation.id);
    // Mark as read
    setConversations(conversations.map(c => 
      c.id === conversation.id ? { ...c, unreadCount: 0 } : c
    ));
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const token = localStorage.getItem('adminSession');
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId: selectedConversation.id,
          senderId: 'admin',
          senderName: 'Admin',
          text: newMessage,
          isAdmin: true,
        }),
      });

      if (response.ok) {
        const message: Message = {
          id: Date.now().toString(),
          senderId: 'admin',
          senderName: 'Admin',
          text: newMessage,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'sent',
          isAdmin: true,
        };

        setMessages([...messages, message]);
        setNewMessage('');

        // Update conversation's last message
        setConversations(conversations.map(c =>
          c.id === selectedConversation.id
            ? { ...c, lastMessage: newMessage, lastMessageTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
            : c
        ));
      } else {
        alert('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.clientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
              <p className="text-sm text-gray-600">Chat with clients</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[calc(100vh-200px)] flex">
          {/* Conversations List */}
          <div className="w-1/3 border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <SearchInput
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => handleConversationSelect(conversation)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedConversation?.id === conversation.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {conversation.clientName.charAt(0)}
                      </div>
                      {conversation.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900 truncate">{conversation.clientName}</p>
                        <span className="text-xs text-gray-500">{conversation.lastMessageTime}</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                    </div>
                    {conversation.unreadCount > 0 && (
                      <div className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {conversation.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {selectedConversation.clientName.charAt(0)}
                      </div>
                      {selectedConversation.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{selectedConversation.clientName}</p>
                      <p className="text-sm text-gray-600">{selectedConversation.online ? 'Online' : 'Offline'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <Phone className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <Video className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isAdmin ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.isAdmin
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-900 border border-gray-200'
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          <span className="text-xs opacity-70">{message.timestamp}</span>
                          {message.isAdmin && (
                            message.status === 'read' ? (
                              <CheckCheck className="h-3 w-3 opacity-70" />
                            ) : (
                              <Check className="h-3 w-3 opacity-70" />
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 bg-white">
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <Paperclip className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <Smile className="h-5 w-5" />
                    </button>
                    <TextInput
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-600">Select a conversation to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
