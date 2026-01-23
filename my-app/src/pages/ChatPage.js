"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import API from "../api/api";
import { io } from "socket.io-client";
import { Input } from "../components/ui/Input";
import { ScrollArea } from "../components/ui/ScrollArea";
import ChatInterface from "../components/ChatInterface"; 
import { Search, MessageSquare, Loader2, Globe  } from "lucide-react";
import { useAuth } from "../context/AuthContext";

// Replace with your actual backend URL from environment variables
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:5000";

const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  withCredentials: true
});

export default function ChatPage() {
  const { t, i18n } = useTranslation();
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  
  const [selectedChat, setSelectedChat] = useState(conversationId || null);
  const [searchTerm, setSearchTerm] = useState("");
  const [chatThreads, setChatThreads] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInbox = useCallback(async () => {
    try {
      const res = await API.get("/messages/inbox");
      if (res.data.success) {
        const mappedThreads = res.data.conversations.map(conv => ({
          id: conv.conversation_id.toString(),
          otherUser: {
            id: conv.other_user_id,
            name: conv.other_user_name,
            avatar: conv.other_user_image || conv.other_user_name.charAt(0),
          },
          lastMessage: {
            content: conv.last_message || t('no_messages_yet'),
            timestamp: new Date(conv.updated_at),
          },
          unreadCount: conv.unread_count || 0
        }));
        setChatThreads(mappedThreads);
      }
    } catch (err) {
      console.error("❌ Inbox Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchInbox();
    if (currentUser?.id) {
      socket.emit("join_personal_room", currentUser.id);
    }

    const handleUpdate = () => fetchInbox();
    socket.on("new_message", handleUpdate);
    socket.on("inbox_update", handleUpdate);

    return () => {
      socket.off("new_message", handleUpdate);
      socket.off("inbox_update", handleUpdate);
    };
  }, [currentUser, fetchInbox]);

  useEffect(() => {
    if (conversationId) setSelectedChat(conversationId);
  }, [conversationId]);

  const handleSelectChat = (id) => {
    setSelectedChat(id);
    navigate(`/messages/${id}`);
  };

  const filteredChats = chatThreads.filter(chat =>
    chat.otherUser.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (date) => {
    const now = new Date();
    const isToday = now.toDateString() === date.toDateString();
    return isToday 
      ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const selectedChatData = chatThreads.find(chat => chat.id === selectedChat);

  return (
    <div className="h-[calc(100vh-64px)] bg-white overflow-hidden flex flex-col">
      <div className="max-w-400 w-full mx-auto h-full grid grid-cols-12 overflow-hidden">
        
        {/* SIDEBAR */}
        <div className={`${selectedChat ? 'hidden md:flex' : 'col-span-12 flex'} md:col-span-4 lg:col-span-3 border-r border-slate-100 flex-col bg-white h-full overflow-hidden`}>
          <div className="p-6 shrink-0 space-y-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">{t('messages_title')}</h1>
              {/* Inline Language Toggle for Quick Access */}
              <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                <Globe className="w-3 h-3 text-slate-400" />
                <select 
                  className="text-[9px] font-black uppercase outline-none bg-transparent cursor-pointer"
                  value={i18n.language}
                  onChange={(e) => i18n.changeLanguage(e.target.value)}
                >
                  <option value="en">EN</option>
                  <option value="pcm">PCM</option>
                  <option value="yo">YO</option>
                  <option value="ha">HA</option>
                  <option value="ig">IG</option>
                </select>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder={t('search_convos')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 bg-slate-50 border-none rounded-2xl focus-visible:ring-emerald-500 font-medium"
              />
            </div>
          </div>

          <ScrollArea className="flex-1 px-3 pb-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="animate-spin text-emerald-500 w-8 h-8" />
              </div>
            ) : (
              <div className="space-y-1">
                {filteredChats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => handleSelectChat(chat.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 ${
                      selectedChat === chat.id ? 'bg-emerald-50 ring-1 ring-emerald-100 shadow-sm' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="relative">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-black shrink-0 overflow-hidden uppercase text-lg shadow-inner">
                        {chat.otherUser.avatar.length > 1 ? (
                            <img src={chat.otherUser.avatar} alt="" className="object-cover w-full h-full" />
                        ) : chat.otherUser.avatar}
                      </div>
                      {chat.unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 h-5 min-w-5 bg-emerald-600 border-2 border-white rounded-full flex items-center justify-center px-1">
                          <span className="text-[10px] text-white font-black">{chat.unreadCount}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <span className={`truncate text-sm tracking-tight ${chat.unreadCount > 0 ? 'font-black text-slate-900' : 'font-bold text-slate-700'}`}>
                          {chat.otherUser.name}
                        </span>
                        <span className="text-[9px] font-black text-slate-400 uppercase ml-2">{formatTime(chat.lastMessage.timestamp)}</span>
                      </div>
                      <p className={`text-xs truncate ${chat.unreadCount > 0 ? 'text-slate-900 font-black' : 'text-slate-500 font-medium'}`}>
                        {chat.lastMessage.content}
                      </p>
                    </div>
                  </button>
                ))}
                {filteredChats.length === 0 && (
                  <div className="text-center py-20 px-6">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{t('no_convos')}</p>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* MAIN CHAT AREA */}
        <div className={`${!selectedChat ? 'hidden md:flex' : 'col-span-12 flex'} md:col-span-8 lg:col-span-9 bg-[#F8FAFC] relative h-full flex-col overflow-hidden`}>
          {selectedChatData ? (
            <ChatInterface
              conversationId={selectedChat}
              currentUser={currentUser}
              otherUser={selectedChatData.otherUser}
              onBack={() => {
                  setSelectedChat(null);
                  navigate('/messages');
              }}
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 bg-white/50 backdrop-blur-sm">
              <div className="w-24 h-24 bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 flex items-center justify-center mb-8 ring-1 ring-slate-100">
                <MessageSquare className="w-10 h-10 text-emerald-500" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight uppercase">{t('select_convo_title')}</h2>
              <p className="text-slate-500 max-w-xs text-center text-sm font-medium leading-relaxed">
                {t('select_convo_desc')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}