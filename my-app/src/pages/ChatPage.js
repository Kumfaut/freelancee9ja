"use client";

import React, { useState } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { ScrollArea } from "../components/ui/ScrollArea";
import ChatInterface from "../components/ChatInterface"; // We'll build this next!
// Remove ArrowLeft, Add MessageSquare
import { Search, Plus, MessageSquare } from "lucide-react";

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const currentUser = {
    id: "user1",
    name: "Adebayo Okafor",
    avatar: "AO",
    role: "freelancer",
    isOnline: true
  };

  // Mock data converted to JS Objects
  const [chatThreads, setChatThreads] = useState([
    {
      id: "chat1",
      otherUser: {
        id: "client1",
        name: "Fashion Forward Lagos",
        avatar: "FF",
        role: "client",
        isOnline: true
      },
      projectTitle: "E-commerce Website Development",
      projectBudget: "₦250,000",
      lastMessage: {
        content: "Great portfolio! I'm particularly impressed with the fashion store project.",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        isRead: false,
        isFromCurrentUser: false
      },
      unreadCount: 1
    },
    {
      id: "chat2",
      otherUser: {
        id: "client2",
        name: "TechStart Abuja",
        avatar: "TA",
        role: "client",
        isOnline: false,
        lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      projectTitle: "Mobile App UI Design",
      projectBudget: "₦120,000",
      lastMessage: {
        content: "The wireframes look good. Can we schedule a call?",
        timestamp: new Date(Date.now() - 120 * 60 * 1000),
        isRead: true,
        isFromCurrentUser: false
      },
      unreadCount: 2
    }
  ]);

  const filteredChats = chatThreads.filter(chat =>
    chat.otherUser.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.projectTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    if (diffInMinutes < 1) return "Now";
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return date.toLocaleDateString('en-NG', { month: 'short', day: 'numeric' });
  };

  // Mark as read logic
  const handleSelectChat = (id) => {
    setSelectedChat(id);
    setChatThreads(prev => prev.map(chat => 
      chat.id === id ? { ...chat, unreadCount: 0 } : chat
    ));
  };

  const selectedChatData = chatThreads.find(chat => chat.id === selectedChat);
  const totalUnreadCount = chatThreads.reduce((sum, chat) => sum + chat.unreadCount, 0);

  return (
    <div className="h-[calc(100vh-64px)] bg-white overflow-hidden">
      <div className="max-w-[1600px] mx-auto h-full">
        <div className="grid grid-cols-12 h-full">
          
          {/* LEFT SIDEBAR: Chat List */}
          <div className={`${selectedChat ? 'hidden md:block' : 'col-span-12'} md:col-span-4 lg:col-span-3 border-r border-slate-200 flex flex-col`}>
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Messages</h1>
                  {totalUnreadCount > 0 && (
                    <p className="text-xs font-semibold text-emerald-600">
                      {totalUnreadCount} New Notifications
                    </p>
                  )}
                </div>
                <Button size="icon" variant="ghost" className="rounded-full bg-slate-50">
                  <Plus className="h-5 w-5 text-slate-600" />
                </Button>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search chats..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-50 border-none h-11 focus-visible:ring-emerald-500"
                />
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="px-2">
                {filteredChats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => handleSelectChat(chat.id)}
                    className={`w-full flex items-start gap-3 p-3 rounded-xl mb-1 transition-all ${
                      selectedChat === chat.id 
                        ? 'bg-emerald-50 shadow-sm' 
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold border-2 border-white shadow-sm">
                        {chat.otherUser.avatar}
                      </div>
                      {chat.otherUser.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="font-bold text-slate-900 truncate text-sm">
                          {chat.otherUser.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {formatTime(chat.lastMessage.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-emerald-600 truncate mb-1">
                        {chat.projectTitle}
                      </p>
                      <div className="flex justify-between items-center">
                        <p className={`text-xs truncate ${chat.unreadCount > 0 ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>
                          {chat.lastMessage.content}
                        </p>
                        {chat.unreadCount > 0 && (
                          <Badge className="h-5 min-w-5 rounded-full bg-emerald-600 flex items-center justify-center p-0 border-none text-[10px]">
                            {chat.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* RIGHT SIDE: Chat View */}
          <div className={`${!selectedChat ? 'hidden md:block' : 'col-span-12'} md:col-span-8 lg:col-span-9 bg-slate-50 relative`}>
            {selectedChatData ? (
              <ChatInterface
                currentUser={currentUser}
                otherUser={selectedChatData.otherUser}
                projectTitle={selectedChatData.projectTitle}
                onClose={() => setSelectedChat(null)}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-center p-8">
                <div className="max-w-sm">
                  <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-12">
                    <MessageSquare className="w-10 h-10 text-emerald-600 -rotate-12" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Your Inbox</h2>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Select a client to discuss projects, send milestones, and share files securely.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}