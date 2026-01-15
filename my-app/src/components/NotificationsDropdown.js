import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MessageSquare, DollarSign, Clock, Briefcase, Bell } from "lucide-react";

export function NotificationsDropdown({ onClose }) {
  const navigate = useNavigate();
  const [recentNotifs, setRecentNotifs] = useState([]);

  const getIconConfig = (type) => {
    switch (type?.toLowerCase()) {
      case 'message': return { icon: MessageSquare, color: "text-blue-600", bg: "bg-blue-50" };
      case 'payment': return { icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" };
      case 'job': return { icon: Briefcase, color: "text-purple-600", bg: "bg-purple-50" };
      default: return { icon: Bell, color: "text-slate-600", bg: "bg-slate-50" };
    }
  };

  useEffect(() => {
    const fetchQuick = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/notifications", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRecentNotifs(res.data.data?.slice(0, 5) || res.data.notifications?.slice(0, 5) || []);
      } catch (err) {
        console.error("Dropdown fetch error", err);
      }
    };
    fetchQuick();
  }, []);

  const handleItemClick = async (n) => {
    if (!n.is_read) {
      try {
        const token = localStorage.getItem("token");
        await axios.put(`http://localhost:5000/api/notifications/${n.id}/read`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (e) { console.error(e); }
    }
    if (n.link) navigate(n.link);
    onClose();
  };

  return (
    <div className="w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
        <h3 className="font-bold text-slate-900 text-sm">Recent Activity</h3>
        <button 
          onClick={() => { navigate('/notifications'); onClose(); }}
          className="text-xs font-bold text-emerald-600 hover:underline"
        >
          View all
        </button>
      </div>
      <div className="max-h-[350px] overflow-y-auto">
        {recentNotifs.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">No notifications yet</div>
        ) : (
          recentNotifs.map((n) => {
            const config = getIconConfig(n.type);
            return (
              <div 
                key={n.id}
                onClick={() => handleItemClick(n)}
                className={`p-4 flex gap-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 ${!n.is_read ? 'bg-emerald-50/20' : ''}`}
              >
                <div className={`w-10 h-10 rounded-lg ${config.bg} flex items-center justify-center shrink-0`}>
                  <config.icon className={`w-5 h-5 ${config.color}`} />
                </div>
                <div className="min-w-0 text-left">
                  <p className={`text-xs capitalize ${!n.is_read ? 'font-bold' : 'font-medium'} text-slate-900`}>
                    {n.type} Alert
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">{n.content}</p>
                  <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}