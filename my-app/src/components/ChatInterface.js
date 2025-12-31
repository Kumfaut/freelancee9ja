"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Badge } from "./ui/Badge";
import { ScrollArea } from "./ui/ScrollArea";
import { 
  Send, Paperclip, 
  Phone, Video, FileText,  X 
} from "lucide-react";

export default function ChatInterface({ 
  currentUser, 
  otherUser, 
  projectTitle, 
  projectBudget, 
  onClose 
}) {
  const [messages, setMessages] = useState([
    {
      id: "1",
      senderId: otherUser.id,
      senderAvatar: otherUser.avatar,
      content: "Hello! I'm interested in your project. I have 5+ years of experience in React development.",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      type: "text",
      status: "read",
      isCurrentUser: false
    },
    {
      id: "2",
      senderId: currentUser.id,
      senderAvatar: currentUser.avatar,
      content: "Hi! Could you share some examples of your previous e-commerce work?",
      timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
      type: "text",
      status: "read",
      isCurrentUser: true
    },
    {
      id: "3",
      senderId: otherUser.id,
      senderAvatar: otherUser.avatar,
      content: "Absolutely! I've attached my portfolio with recent projects.",
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      type: "file",
      fileName: "Portfolio_ECommerce.pdf",
      fileUrl: "#",
      status: "read",
      isCurrentUser: false
    }
  ]);

  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-scroll logic
  useEffect(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages, isTyping]);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' });
  };

  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      senderAvatar: currentUser.avatar,
      content: newMessage.trim(),
      timestamp: new Date(),
      type: "text",
      status: "sent",
      isCurrentUser: true
    };

    setMessages(prev => [...prev, message]);
    setNewMessage("");

    // Mock: Simulate client typing and replying
    setTimeout(() => setIsTyping(true), 1000);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => prev.map(msg => msg.id === message.id ? { ...msg, status: "read" } : msg));
    }, 3000);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      senderAvatar: currentUser.avatar,
      content: `Shared: ${file.name}`,
      timestamp: new Date(),
      type: "file",
      fileName: file.name,
      fileUrl: URL.createObjectURL(file),
      status: "sent",
      isCurrentUser: true
    };

    setMessages(prev => [...prev, message]);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* HEADER */}
      <div className="bg-white border-b border-slate-200 p-4 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold border-2 border-white shadow-sm">
                {otherUser.avatar}
              </div>
              {otherUser.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">{otherUser.name}</h3>
              <p className="text-[11px] text-slate-500 font-medium">
                {otherUser.isOnline ? "Online Now" : "Away"}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-emerald-600"><Phone className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-emerald-600"><Video className="h-4 w-4" /></Button>
            {onClose && (
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-500" onClick={onClose}><X className="h-4 w-4" /></Button>
            )}
          </div>
        </div>

        {/* PROJECT INFO CARD */}
        <div className="mt-4 p-3 bg-white border border-emerald-100 rounded-xl flex items-center justify-between shadow-sm">
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-tight">Active Project</h4>
            <p className="text-sm font-semibold text-emerald-700">{projectTitle}</p>
          </div>
          {projectBudget && <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">{projectBudget}</Badge>}
        </div>
      </div>

      {/* MESSAGES AREA */}
      
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-6">
          {messages.map((msg) => {
            const isMe = msg.isCurrentUser;
            return (
              <div key={msg.id} className={`flex gap-3 ${isMe ? "flex-row-reverse" : ""}`}>
                <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-[10px] font-bold">
                  {msg.senderAvatar}
                </div>
                
                <div className={`flex flex-col gap-1 max-w-[75%] ${isMe ? "items-end" : "items-start"}`}>
                  <div className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                    isMe ? "bg-emerald-600 text-white rounded-tr-none" : "bg-white text-slate-700 border border-slate-100 rounded-tl-none"
                  }`}>
                    {msg.type === "file" ? (
                      <div className="flex items-center gap-3 py-1">
                        <div className={`p-2 rounded-lg ${isMe ? "bg-emerald-500" : "bg-emerald-50"}`}>
                          <FileText className={`h-5 w-5 ${isMe ? "text-white" : "text-emerald-600"}`} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-xs truncate max-w-[120px]">{msg.fileName}</p>
                          <button className={`text-[10px] font-bold underline ${isMe ? "text-emerald-100" : "text-emerald-600"}`}>Download</button>
                        </div>
                      </div>
                    ) : (
                      <p className="leading-relaxed">{msg.content}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                    <span>{formatTime(msg.timestamp)}</span>
                    {isMe && (
                      <span className={msg.status === "read" ? "text-emerald-500" : ""}>
                        {msg.status === "sent" ? "•" : msg.status === "delivered" ? "✓" : "✓✓"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          
          {isTyping && (
            <div className="flex gap-2 items-center text-slate-400 italic text-[11px] animate-pulse">
              <div className="flex gap-1">
                <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" />
                <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
              {otherUser.name} is typing...
            </div>
          )}
        </div>
      </ScrollArea>

      {/* INPUT AREA */}
      <div className="p-4 bg-white border-t border-slate-200">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input 
            ref={fileInputRef} 
            type="file" 
            className="hidden" 
            onChange={handleFileUpload}
            accept=".pdf,.doc,.docx,.jpg,.png" 
          />
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            className="rounded-full text-slate-400 shrink-0"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          
          <Input
            placeholder="Write a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 bg-slate-50 border-none rounded-xl focus-visible:ring-emerald-500 h-11"
          />

          <Button 
            type="submit" 
            disabled={!newMessage.trim()}
            className="bg-emerald-600 hover:bg-emerald-700 rounded-xl h-11 w-11 p-0 shrink-0"
          >
            <Send className="h-5 w-5 text-white" />
          </Button>
        </form>
        <p className="text-[10px] text-center text-slate-400 mt-3 font-medium">
          Always communicate here to protect your 🇳🇬 payments.
        </p>
      </div>
    </div>
  );
}