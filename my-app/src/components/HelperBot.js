"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { MessageSquare, X, Send, Bot, Trash2, Copy, Check, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import API from "../api/api";

// A safe, custom renderer that handles basic formatting without crashing
const TextRenderer = ({ content }) => {
  const text = String(content || "");
  // Simple regex to bold text between ** ** and handle new lines
  const parts = text.split(/(\*\*.*?\*\*|\n)/g);

  return (
    <div className="whitespace-pre-wrap wrap-break-word leading-relaxed">
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
        }
        return part;
      })}
    </div>
  );
};

export default function HelperBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Kedu! I am your AI assistant. Ask me about **freelancing**, **safe payments**, or **verifying clients**.' }
  ]);
  const [loading, setLoading] = useState(false);
  
  const { i18n } = useTranslation();
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, loading]);

  const handleAsk = useCallback(async (e, customInput = null) => {
    if (e) e.preventDefault();
    const messageText = customInput || input;
    if (!messageText.trim() || loading) return;

    setMessages(prev => [...prev, { role: 'user', text: messageText }]);
    setInput("");
    setLoading(true);

    try {
      const res = await API.post("/chatbot/ask", { 
        prompt: messageText,
        language: i18n.language 
      });
      const answer = typeof res.data.answer === 'string' ? res.data.answer : JSON.stringify(res.data.answer);
      setMessages(prev => [...prev, { role: 'bot', text: answer }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: "Opps! My network de trip. Please try again in a bit." }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, i18n.language]);

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed bottom-6 left-6 z-9999 flex flex-col items-start font-sans">
      
      {isOpen && (
        <div className="mb-4 w-80 md:w-100 bg-white rounded-4xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in slide-in-from-left-4 duration-300">
          
          {/* Header */}
          <div className="bg-slate-900 p-5 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500 p-2 rounded-xl shadow-lg shadow-emerald-500/20 text-white">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm leading-none">Naija Assistant</h3>
                <span className="text-emerald-400 text-[10px] uppercase tracking-widest font-bold">AI Powered</span>
              </div>
            </div>
            <div className="flex gap-1">
              <button 
                onClick={() => setMessages([{ role: 'bot', text: 'Chat reset. Wetin you wan check?' }])}
                className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                title="Clear Chat"
              >
                <Trash2 size={16} />
              </button>
              <button onClick={() => setIsOpen(false)} className="p-2 text-white hover:opacity-70 transition-opacity">
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div ref={scrollRef} className="h-100 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`relative group max-w-[90%] p-3 rounded-2xl text-[13px] shadow-sm ${
                  m.role === 'user' 
                    ? 'bg-emerald-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 rounded-tl-none border border-slate-200'
                }`}>
                  <TextRenderer content={m.text} />
                  
                  {m.role === 'bot' && (
                    <button 
                      onClick={() => copyToClipboard(m.text, i)}
                      className="absolute -right-8 top-0 p-1.5 bg-white border border-slate-200 rounded-md opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-emerald-600"
                    >
                      {copiedIndex === i ? <Check size={12} /> : <Copy size={12} />}
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start gap-2 items-center text-slate-400 text-[11px] animate-pulse">
                <Sparkles size={12} className="text-emerald-500" />
                Assistant is thinking...
              </div>
            )}
          </div>

          {/* Quick Action Buttons */}
          {!loading && (
            <div className="px-4 py-2 flex flex-wrap gap-2 bg-white border-t border-slate-50">
              <button onClick={() => handleAsk(null, "How to verify a foreign client?")} className="text-[10px] font-semibold text-slate-600 bg-slate-100 hover:bg-emerald-500 hover:text-white px-3 py-1.5 rounded-full transition-all border border-slate-200">🔍 Verify Client</button>
              <button onClick={() => handleAsk(null, "Best payout methods in Nigeria?")} className="text-[10px] font-semibold text-slate-600 bg-slate-100 hover:bg-emerald-500 hover:text-white px-3 py-1.5 rounded-full transition-all border border-slate-200">💰 Payouts</button>
              <button onClick={() => handleAsk(null, "Common freelance scams to avoid")} className="text-[10px] font-semibold text-slate-600 bg-slate-100 hover:bg-emerald-500 hover:text-white px-3 py-1.5 rounded-full transition-all border border-slate-200">🛡️ Avoid Scams</button>
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleAsk} className="p-4 bg-white border-t border-slate-100 flex gap-2">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-emerald-500 outline-none transition-shadow"
            />
            <button 
              type="submit" 
              disabled={loading || !input.trim()}
              className="bg-slate-900 text-white p-3 rounded-xl hover:bg-emerald-600 disabled:opacity-30 disabled:hover:bg-slate-900 transition-all shadow-lg"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      {/* Main Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-emerald-600 rounded-full shadow-xl shadow-emerald-500/30 flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-white/10 group-hover:bg-transparent"></div>
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </button>
    </div>
  );
}