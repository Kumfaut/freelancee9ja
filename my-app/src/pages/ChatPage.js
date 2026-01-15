"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import { io } from "socket.io-client";
import { Input } from "../components/ui/Input";
import { ScrollArea } from "../components/ui/ScrollArea";
import ChatInterface from "../components/ChatInterface"; 
import { Search, MessageSquare, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const socket = io("http://localhost:5000", {
  transports: ["websocket"],
  withCredentials: true
});

export default function ChatPage() {
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
            content: conv.last_message || "No messages yet",
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
  }, []);

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
    <div className="h-[calc(100vh-64px)] bg-white overflow-hidden">
      <div className="max-w-[1600px] mx-auto h-full">
        <div className="grid grid-cols-12 h-full">
          
          {/* SIDEBAR */}
          <div className={`${selectedChat ? 'hidden md:flex' : 'col-span-12 flex'} md:col-span-4 lg:col-span-3 border-r border-slate-100 flex-col bg-white h-full overflow-hidden`}>
            <div className="p-6 shrink-0">
              <h1 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Messages</h1>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-50 border-none rounded-xl focus-visible:ring-emerald-500"
                />
              </div>
            </div>

            <ScrollArea className="flex-1 px-3">
              {loading ? (
                <div className="flex flex-col items-center justify-center p-12 space-y-4">
                  <Loader2 className="animate-spin text-emerald-500 w-8 h-8" />
                </div>
              ) : (
                <div className="space-y-1 pb-4">
                  {filteredChats.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => handleSelectChat(chat.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 ${
                        selectedChat === chat.id ? 'bg-emerald-50 shadow-sm' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-bold shrink-0 overflow-hidden uppercase">
                        {chat.otherUser.avatar.length > 1 ? (
                            <img src={chat.otherUser.avatar} alt="" className="object-cover w-full h-full" />
                        ) : chat.otherUser.avatar}
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex justify-between items-baseline mb-0.5">
                          <span className="font-bold text-slate-900 truncate text-sm">{chat.otherUser.name}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">{formatTime(chat.lastMessage.timestamp)}</span>
                        </div>
                        <p className={`text-xs truncate ${chat.unreadCount > 0 ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>
                          {chat.lastMessage.content}
                        </p>
                      </div>
                      {chat.unreadCount > 0 && (
                        <div className="h-5 w-5 bg-emerald-600 rounded-full flex items-center justify-center shrink-0">
                            <span className="text-[10px] text-white font-bold">{chat.unreadCount}</span>
                        </div>
                      )}
                    </button>
                  ))}
                  {filteredChats.length === 0 && (
                    <div className="text-center py-20">
                      <p className="text-slate-400 text-sm italic font-medium">No conversations found.</p>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* MAIN CHAT AREA - Forced Flex Layout */}
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
              <div className="h-full flex flex-col items-center justify-center p-8">
                <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-6">
                  <MessageSquare className="w-10 h-10 text-emerald-500" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">Select a conversation</h2>
                <p className="text-slate-500 max-w-xs text-center text-sm">
                  Discuss terms, timelines, and projects with your team.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}