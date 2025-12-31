import React from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, DollarSign, Clock } from "lucide-react";

export function NotificationsDropdown({ onClose }) {
  const navigate = useNavigate();

  const quickNotifs = [
    { id: 1, title: 'New message', text: 'Sarah sent a message...', time: '2m ago', icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 2, title: 'Payment', text: '₦250k milestone funded', time: '1h ago', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-50 flex justify-between items-center">
        <h3 className="font-bold text-slate-900 text-sm">Recent Activity</h3>
        <button 
          onClick={() => { navigate('/notifications'); onClose(); }}
          className="text-xs font-bold text-emerald-600 hover:underline"
        >
          View all
        </button>
      </div>
      <div className="max-h-[300px] overflow-y-auto">
        {quickNotifs.map((n) => (
          <div 
            key={n.id}
            onClick={() => { navigate('/notifications'); onClose(); }}
            className="p-4 flex gap-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0"
          >
            <div className={`w-10 h-10 rounded-lg ${n.bg} flex items-center justify-center shrink-0`}>
              <n.icon className={`w-5 h-5 ${n.color}`} />
            </div>
            <div className="min-w-0 text-left">
              <p className="text-xs font-bold text-slate-900">{n.title}</p>
              <p className="text-[11px] text-slate-500 truncate">{n.text}</p>
              <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {n.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}