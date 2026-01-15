"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/Tabs";
import { Input } from "../components/ui/Input";
import { 
  Bell, BellOff, Briefcase, MessageSquare, 
  DollarSign, Star, Search, Loader2, 
  CheckCircle2, Trash2, Clock 
} from "lucide-react";

// Helper for time formatting (replaces moment/date-fns if you don't want extra dependencies)
const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "mo ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m ago";
  return "just now";
};

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const getIconConfig = (type) => {
    const mapping = {
      message: { icon: MessageSquare, color: "text-blue-600", bg: "bg-blue-50" },
      payment: { icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
      contract: { icon: Briefcase, color: "text-indigo-600", bg: "bg-indigo-50" },
      proposal: { icon: Star, color: "text-amber-600", bg: "bg-amber-50" },
    };
    return mapping[type?.toLowerCase()] || { icon: Bell, color: "text-slate-600", bg: "bg-slate-100" };
  };

  const fetchNotifications = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/notifications", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Matching your controller's specific response: { success: true, data: [], unreadCount: X }
      if (res.data.success) {
        setNotifications(res.data.data);
        setUnreadCount(res.data.unreadCount);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 20000); // Poll every 20s
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleMarkAllRead = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:5000/api/notifications/mark-all-read", {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Optimistic Update
      setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Error marking all read:", err);
    }
  };

  const handleNotificationClick = async (n) => {
    if (!n.is_read) {
      try {
        const token = localStorage.getItem("token");
        await axios.put(`http://localhost:5000/api/notifications/${n.id}/read`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, is_read: 1 } : item));
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (err) { console.error(err); }
    }
    if (n.link) navigate(n.link);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => prev.filter(n => n.id !== id));
      // Optionally re-fetch to get updated unreadCount
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const filtered = notifications.filter(n => 
    n.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.type?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTabContent = (tab) => {
    if (tab === "all") return filtered;
    if (tab === "unread") return filtered.filter(n => !n.is_read);
    return filtered.filter(n => n.type?.toLowerCase() === tab);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              Activity Hub
              {unreadCount > 0 && (
                <span className="bg-emerald-500 text-white text-[10px] px-2 py-1 rounded-full uppercase">
                  {unreadCount} New
                </span>
              )}
            </h1>
            <p className="text-slate-500 font-medium">Manage your project alerts and updates</p>
          </div>

          <Button 
            variant="outline" 
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
            className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl font-bold shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" />
            Clear All Unread
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search by keyword..." 
            className="pl-11 h-12 bg-white border-slate-200 rounded-2xl shadow-sm focus:ring-emerald-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="bg-slate-200/40 p-1 mb-6 rounded-2xl overflow-x-auto inline-flex shadow-inner">
            <TabsTrigger value="all" className="rounded-xl px-6 font-bold">All</TabsTrigger>
            <TabsTrigger value="unread" className="rounded-xl px-6 font-bold">Unread</TabsTrigger>
            <TabsTrigger value="contract" className="rounded-xl px-4 font-bold">Contracts</TabsTrigger>
            <TabsTrigger value="proposal" className="rounded-xl px-4 font-bold">Bids</TabsTrigger>
            <TabsTrigger value="payment" className="rounded-xl px-4 font-bold">Payments</TabsTrigger>
          </TabsList>

          {["all", "unread", "contract", "proposal", "payment"].map((tab) => (
            <TabsContent key={tab} value={tab} className="space-y-3 outline-none">
              {loading ? (
                <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-emerald-500" /></div>
              ) : getTabContent(tab).length === 0 ? (
                <Card className="border-2 border-dashed border-slate-200 bg-transparent py-20 text-center rounded-[2rem]">
                  <BellOff className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-400 font-bold italic">No {tab !== 'all' ? tab : ''} alerts found.</p>
                </Card>
              ) : (
                getTabContent(tab).map((n) => {
                  const config = getIconConfig(n.type);
                  return (
                    <Card 
                      key={n.id} 
                      onClick={() => handleNotificationClick(n)}
                      className={`group relative border-none shadow-sm transition-all hover:translate-x-1 cursor-pointer rounded-2xl ${
                        !n.is_read ? "bg-white ring-1 ring-emerald-100" : "bg-white/70"
                      }`}
                    >
                      <CardContent className="p-5 flex gap-5">
                        <div className={`w-12 h-12 rounded-2xl ${config.bg} flex items-center justify-center shrink-0`}>
                           <config.icon className={`w-6 h-6 ${config.color}`} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <span className={`text-[10px] font-black uppercase tracking-widest ${config.color}`}>
                              {n.type}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {timeAgo(n.created_at)}
                            </span>
                          </div>
                          <p className={`text-sm leading-relaxed ${!n.is_read ? "text-slate-900 font-bold" : "text-slate-600 font-medium"}`}>
                            {n.content}
                          </p>
                        </div>

                        <button 
                          onClick={(e) => handleDelete(e, n.id)}
                          className="p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}