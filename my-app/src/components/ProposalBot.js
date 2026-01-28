"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { X, Briefcase, Copy, Check} from "lucide-react";
import { useTranslation } from "react-i18next";
import API from "../api/api";
import { useAuth } from "../context/AuthContext";

const TextRenderer = ({ content }) => {
  const text = String(content || "");
  const parts = text.split(/(\*\*.*?\*\*|\n)/g);
  return (
    <div className="whitespace-pre-wrap wrap-break-word leading-relaxed text-[13px]">
      {parts.map((part, i) => (
        part.startsWith('**') && part.endsWith('**') 
          ? <strong key={i} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>
          : part
      ))}
    </div>
  );
};

export default function ProposalBot() {
  const { user, loading: authLoading } = useAuth();
  const { i18n } = useTranslation();
  const scrollRef = useRef(null);
  
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Oya, paste the **Job Description** here. I go help you draft a proposal that client no go fit ignore!" }
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, loading]);

  const handleGenerate = useCallback(async (e, customInput = null) => {
    if (e) e.preventDefault();
    const jobDescription = customInput || input;
    if (!jobDescription.trim() || loading) return;

    setMessages(prev => [...prev, { role: 'user', text: `Draft a proposal for: ${jobDescription.substring(0, 40)}...` }]);
    setInput("");
    setLoading(true);

    try {
      // PRO TIP: If /chatbot/proposal 404s, try the full URL to debug:
      // const res = await axios.post("http://localhost:5000/api/chatbot/proposal", ...)
      const res = await API.post("/chatbot/proposal", { 
        jobDescription,
        language: i18n.language 
      });
      
      const proposal = res.data.proposal;
      setMessages(prev => [...prev, { role: 'bot', text: proposal }]);
    } catch (err) {
      console.error("Proposal Error:", err);
      setMessages(prev => [...prev, { role: 'bot', text: "Opps! My pen don dry. Check your connection or login again." }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, i18n.language]);

  if (authLoading || !user || user.role !== "freelancer") return null;

  return (
    <div className="fixed bottom-24 right-6 z-9999 flex flex-col items-end font-sans">
      {isOpen && (
        <div className="mb-4 w-80 md:w-112.5 bg-white rounded-4xl shadow-2xl border border-blue-100 overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-blue-600 p-5 flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
              <Briefcase size={20} />
              <h3 className="font-bold text-sm leading-none">Proposal Writer</h3>
            </div>
            <button onClick={() => setIsOpen(false)}><X size={20} /></button>
          </div>

          <div ref={scrollRef} className="h-100 overflow-y-auto p-4 space-y-4 bg-blue-50/30">
            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className="relative group max-w-[90%] p-4 rounded-2xl bg-white border border-blue-100 shadow-sm text-slate-700">
                  <TextRenderer content={m.text} />
                  {m.role === 'bot' && i !== 0 && (
                    <button 
                      onClick={() => { navigator.clipboard.writeText(m.text); setCopiedIndex(i); setTimeout(() => setCopiedIndex(null), 2000); }}
                      className="absolute -top-3 -right-3 p-2 bg-blue-600 text-white rounded-full scale-0 group-hover:scale-100 transition-transform"
                    >
                      {copiedIndex === i ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  )}
                </div>
              </div>
            ))}
            {loading && <div className="text-blue-500 text-[11px] animate-pulse">Cooking proposal...</div>}
          </div>

          <form onSubmit={handleGenerate} className="p-4 bg-white border-t flex flex-col gap-2">
            <textarea 
              value={input} onChange={(e) => setInput(e.target.value)}
              placeholder="Paste job description..."
              className="w-full bg-slate-50 rounded-xl px-4 py-3 text-xs outline-none h-20"
            />
            <button type="submit" disabled={loading || !input.trim()} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">
              Generate Proposal
            </button>
          </form>
        </div>
      )}
      <button onClick={() => setIsOpen(!isOpen)} className="w-16 h-16 bg-blue-600 rounded-full shadow-xl flex items-center justify-center text-white">
        {isOpen ? <X size={28} /> : <Briefcase size={28} />}
      </button>
    </div>
  );
}