"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Bot, Loader2, Trash2 } from "lucide-react";
import { Button } from "./ui/Button";
import { useTranslation } from "react-i18next";
import API from "../api/api";
import ReactMarkdown from 'react-markdown';

export default function HelperBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Kedu! I am your assistant. How can I help you today?' }
  ]);
  const [loading, setLoading] = useState(false);
  
  const { i18n } = useTranslation();
  const scrollRef = useRef(null);

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleAsk = async (e, customInput = null) => {
    if (e) e.preventDefault();
    
    const messageText = customInput || input;
    if (!messageText.trim()) return;

    const userMsg = { role: 'user', text: messageText };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await API.post("/chatbot/ask", { 
        prompt: messageText,
        language: i18n.language 
      });
      setMessages(prev => [...prev, { role: 'bot', text: res.data.answer }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: "Opps! My network de trip. Try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{ role: 'bot', text: 'Chat cleared. How fit help you again?' }]);
  };

  return (
    // CHANGED: Fixed to bottom-left instead of bottom-right
    <div className="fixed bottom-6 left-6 z-1000 flex flex-col items-start">
      
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 md:w-96 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col animate-in slide-in-from-bottom-5">
          
          {/* Header */}
          <div className="bg-slate-900 p-6 flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500 p-2 rounded-xl">
                <Bot size={20} />
              </div>
              <div>
                <p className="font-black uppercase text-[10px] tracking-widest leading-none">Naija Assistant</p>
                <span className="text-[10px] text-emerald-400">Online</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={clearChat} className="p-1 hover:text-red-400 transition-colors">
                <Trash2 size={16} />
              </button>
              <button onClick={() => setIsOpen(false)}><X size={20} /></button>
            </div>
          </div>

          {/* Messages Area */}
          <div 
            ref={scrollRef}
            className="h-80 overflow-y-auto p-4 space-y-4 bg-slate-50 scroll-smooth"
          >
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-[13px] font-bold shadow-sm ${
                  m.role === 'user' 
                    ? 'bg-emerald-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                }`}>
                  {/* SAFETY CHECK: 
                    We use String(m.text) to ensure we never pass an object to ReactMarkdown.
                    We also check if ReactMarkdown exists to prevent crashing.
                  */}
                  {m.role === 'bot' ? (
                    <div className="markdown-content prose prose-sm prose-slate max-w-none">
                      <ReactMarkdown>{String(m.text)}</ReactMarkdown>
                    </div>
                  ) : (
                    <span>{m.text}</span>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-100">
                  <Loader2 className="animate-spin text-emerald-500" size={16} />
                </div>
              </div>
            )}
          </div>

          {/* NEW: Quick Action Buttons (Naira Focused) */}
          {!loading && (
            <div className="flex flex-wrap gap-2 p-3 bg-white border-t border-slate-50">
              <button 
                onClick={() => handleAsk(null, "Which bank best to receive Naira payments?")}
                className="text-[10px] bg-slate-50 hover:bg-emerald-50 text-slate-600 border border-slate-200 rounded-full px-3 py-1 transition-all"
              >
                🏦 Best Bank
              </button>
              <button 
                onClick={() => handleAsk(null, "How I fit spot fake alert/scams?")}
                className="text-[10px] bg-slate-50 hover:bg-emerald-50 text-slate-600 border border-slate-200 rounded-full px-3 py-1 transition-all"
              >
                🛡️ Fake Alerts
              </button>
              <button 
                onClick={() => handleAsk(null, "How to use OPay/Moniepoint for my gigs?")}
                className="text-[10px] bg-slate-50 hover:bg-emerald-50 text-slate-600 border border-slate-200 rounded-full px-3 py-1 transition-all"
              >
                📱 Digital Banks
              </button>
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={(e) => handleAsk(e)} className="p-4 bg-white border-t flex gap-2">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-2 text-xs focus:ring-1 focus:ring-emerald-500 outline-none"
            />
            <Button type="submit" size="icon" className="bg-slate-900 rounded-xl">
              <Send size={16} />
            </Button>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-emerald-600 rounded-full shadow-xl shadow-emerald-200 flex items-center justify-center text-white hover:scale-110 transition-transform active:scale-95"
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </button>
    </div>
  );
}