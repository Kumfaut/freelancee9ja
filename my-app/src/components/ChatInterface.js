"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import API from "../api/api";
import { io } from "socket.io-client";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { ScrollArea } from "./ui/ScrollArea";
import { Send, Paperclip, ArrowLeft, Loader2, Languages } from "lucide-react"; // Added Languages
import { useTranslation } from "react-i18next"; // Added for translation
import { translateDynamicContent } from "../utils/translateUtil"; // Added utility

const socket = io("http://localhost:5000", {
  transports: ["websocket"],
  withCredentials: true
});

export default function ChatInterface({ 
  conversationId, 
  currentUser, 
  otherUser, 
  onBack 
}) {
  const { i18n } = useTranslation(); // Translation hook
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // --- NEW TRANSLATION STATES ---
  const [translatedMessages, setTranslatedMessages] = useState({}); // Stores { messageId: "Translated Text" }
  const [translatingId, setTranslatingId] = useState(null); // Tracking which message is currently loading

  const fetchMessages = useCallback(async () => {
    if (!conversationId) return;
    try {
      setLoading(true);
      const res = await API.get(`/messages/chat/${conversationId}`);
      if (res.data.success) {
        setMessages(res.data.messages);
      }
    } catch (err) {
      console.error("❌ Error loading messages:", err);
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    fetchMessages();
    socket.emit("join_conversation", conversationId);

    const handleNewMessage = (data) => {
      if (String(data.conversation_id) === String(conversationId)) {
        setMessages((prev) => {
          const isDuplicate = prev.some(m => m.id === data.id);
          return isDuplicate ? prev : [...prev, data];
        });
      }
    };

    socket.on("new_message", handleNewMessage);
    return () => socket.off("new_message", handleNewMessage);
  }, [conversationId, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- NEW TRANSLATION HANDLER ---
  const handleTranslateMessage = async (msgId, originalText) => {
    // Toggle back to original if already translated
    if (translatedMessages[msgId]) {
      const updated = { ...translatedMessages };
      delete updated[msgId];
      setTranslatedMessages(updated);
      return;
    }

    setTranslatingId(msgId);
    try {
      const targetLang = i18n.language || 'en';
      const result = await translateDynamicContent(originalText, targetLang);
      setTranslatedMessages(prev => ({ ...prev, [msgId]: result }));
    } catch (err) {
      console.error("❌ Translation error:", err);
    } finally {
      setTranslatingId(null);
    }
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    const messageContent = newMessage.trim();
    if (!messageContent || !currentUser?.id) return;
    setNewMessage(""); 
  
    try {
      await API.post("/messages/send", {
        conversation_id: conversationId,
        receiver_id: otherUser.id,
        message_text: messageContent
      });
    } catch (err) {
      console.error("❌ Failed to send message:", err);
      setNewMessage(messageContent); 
      alert("Message failed to send. Please try again.");
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "Just now";
    return new Date(dateStr).toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] overflow-hidden">
      <header className="bg-white border-b border-slate-100 p-4 shrink-0 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="md:hidden">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-100 overflow-hidden uppercase">
               {otherUser.avatar?.length > 1 ? (
                 <img src={otherUser.avatar} alt="" className="object-cover w-full h-full" />
               ) : (otherUser.avatar || otherUser.name?.charAt(0))}
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-sm leading-tight">{otherUser.name}</h3>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Live Discussion</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 min-h-0 relative">
        <ScrollArea className="h-full w-full">
          <div className="p-6 space-y-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center p-10 space-y-3 opacity-50">
                <Loader2 className="animate-spin text-emerald-500 w-6 h-6" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Connecting...</p>
              </div>
            ) : (
              <>
                {messages.map((msg, index) => {
                  const isMe = String(msg.sender_id) === String(currentUser?.id);
                  const isTranslated = !!translatedMessages[msg.id];

                  return (
                    <div key={msg.id || index} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`flex flex-col gap-1 max-w-[80%] group ${isMe ? "items-end" : "items-start"}`}>
                        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm transition-all ${
                          isMe 
                          ? "bg-emerald-600 text-white rounded-tr-none font-medium" 
                          : "bg-white text-slate-700 border border-slate-100 rounded-tl-none font-medium"
                        }`}>
                          {/* Display translated text if exists, else original */}
                          {translatedMessages[msg.id] || msg.message_text}

                          {isTranslated && (
                            <div className="mt-2 pt-1 border-t border-emerald-500/10 flex items-center gap-1 text-[8px] font-black uppercase text-emerald-500 tracking-tighter">
                                <Languages size={8} /> Translated
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-3 px-1">
                          <span className="text-[9px] font-black text-slate-400 uppercase">
                            {formatTime(msg.created_at)}
                          </span>

                          {/* TRANSLATE TOGGLE: Only for others' messages and if NOT English */}
                          {!isMe && i18n.language !== 'en' && (
                            <button 
                              onClick={() => handleTranslateMessage(msg.id, msg.message_text)}
                              disabled={translatingId === msg.id}
                              className="text-[9px] font-black uppercase text-emerald-600 hover:text-emerald-800 transition-colors opacity-0 group-hover:opacity-100 flex items-center gap-1"
                            >
                              {translatingId === msg.id ? (
                                <Loader2 size={10} className="animate-spin" />
                              ) : (
                                <>
                                  <Languages size={10} />
                                  {isTranslated ? "Show Original" : "Translate"}
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        </ScrollArea>
      </div>

      <footer className="p-6 bg-white border-t border-slate-100 shrink-0">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <Button type="button" variant="ghost" size="icon" className="text-slate-400 hover:text-emerald-600">
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 bg-slate-50 border-none rounded-2xl h-12 px-5 focus-visible:ring-emerald-500 font-medium text-slate-700"
          />
          <Button 
            type="submit" 
            disabled={!newMessage.trim()}
            className="bg-emerald-600 hover:bg-emerald-700 rounded-2xl h-12 w-12 p-0 shadow-lg shadow-emerald-100 active:scale-95 transition-all"
          >
            <Send className="h-5 w-5 text-white" />
          </Button>
        </form>
      </footer>
    </div>
  );
}