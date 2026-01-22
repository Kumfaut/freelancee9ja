"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/Tabs";
import { Input } from "../components/ui/Input";
import { 
  Bell, BellOff, Briefcase, MessageSquare, 
  DollarSign, Star, Search, Loader2, 
  CheckCircle2, Clock, Globe 
} from "lucide-react";

export default function NotificationsPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Helper for time formatting
  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y " + t('ago');
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo " + t('ago');
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d " + t('ago');
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h " + t('ago');
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m " + t('ago');
    return t('just_now');
  };

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
    const interval = setInterval(fetchNotifications, 30000); 
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleMarkAllRead = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:5000/api/notifications/mark-all-read", {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
      setUnreadCount(0);
    } catch (err) { console.error(err); }
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

  const filtered = notifications.filter(n => 
    n.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.type?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
                {t('activity_hub')}
                </h1>
                {unreadCount > 0 && (
                    <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-widest animate-pulse">
                    {unreadCount} {t('new_alerts')}
                    </span>
                )}
            </div>
            <p className="text-slate-500 font-medium">{t('manage_alerts')}</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl shadow-sm ring-1 ring-slate-200">
                <Globe className="w-4 h-4 text-slate-400" />
                <select 
                className="text-[10px] font-black uppercase tracking-widest outline-none bg-transparent cursor-pointer"
                value={i18n.language}
                onChange={(e) => i18n.changeLanguage(e.target.value)}
                >
                <option value="en">EN</option>
                <option value="pcm">PCM</option>
                <option value="ig">IG</option>
                <option value="yo">YO</option>
                <option value="ha">HA</option>
                </select>
            </div>
            <Button 
                variant="outline" 
                onClick={handleMarkAllRead}
                disabled={unreadCount === 0}
                className="bg-slate-900 text-white hover:bg-emerald-600 rounded-xl font-black text-[10px] uppercase tracking-widest h-11 border-none transition-all shadow-lg"
            >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                {t('clear_all_read')}
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder={t('search_keyword')} 
            className="pl-11 h-14 bg-white border-none rounded-2xl shadow-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-emerald-500 font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="bg-white p-1 mb-8 rounded-2xl inline-flex shadow-sm ring-1 ring-slate-100 overflow-x-auto max-w-full">
            <TabsTrigger value="all" className="rounded-xl px-8 font-black text-[10px] uppercase tracking-widest transition-all data-[state=active]:bg-slate-900 data-[state=active]:text-white">{t('tab_all')}</TabsTrigger>
            <TabsTrigger value="unread" className="rounded-xl px-8 font-black text-[10px] uppercase tracking-widest transition-all data-[state=active]:bg-slate-900 data-[state=active]:text-white">{t('tab_unread')}</TabsTrigger>
            <TabsTrigger value="contract" className="rounded-xl px-6 font-black text-[10px] uppercase tracking-widest transition-all data-[state=active]:bg-slate-900 data-[state=active]:text-white">{t('tab_contracts')}</TabsTrigger>
            <TabsTrigger value="proposal" className="rounded-xl px-6 font-black text-[10px] uppercase tracking-widest transition-all data-[state=active]:bg-slate-900 data-[state=active]:text-white">{t('tab_bids')}</TabsTrigger>
            <TabsTrigger value="payment" className="rounded-xl px-6 font-black text-[10px] uppercase tracking-widest transition-all data-[state=active]:bg-slate-900 data-[state=active]:text-white">{t('tab_payments')}</TabsTrigger>
          </TabsList>

          {["all", "unread", "contract", "proposal", "payment"].map((tab) => (
            <TabsContent key={tab} value={tab} className="space-y-4 outline-none">
              {loading ? (
                <div className="py-24 text-center"><Loader2 className="animate-spin mx-auto text-emerald-500 w-10 h-10" /></div>
              ) : filtered.length === 0 ? (
                <Card className="border-2 border-dashed border-slate-200 bg-white/50 py-24 text-center rounded-[3rem]">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <BellOff className="w-10 h-10 text-slate-300" />
                  </div>
                  <p className="text-slate-400 font-black uppercase tracking-widest text-xs">{t('no_alerts')}</p>
                </Card>
              ) : (
                filtered.filter(n => tab === 'all' ? true : tab === 'unread' ? !n.is_read : n.type?.toLowerCase() === tab).map((n) => {
                  const config = getIconConfig(n.type);
                  return (
                    <Card 
                      key={n.id} 
                      onClick={() => handleNotificationClick(n)}
                      className={`group border-none shadow-sm transition-all hover:shadow-md cursor-pointer rounded-[1.5rem] overflow-hidden ${
                        !n.is_read ? "bg-white ring-2 ring-emerald-500/20" : "bg-white/70 opacity-80"
                      }`}
                    >
                      <CardContent className="p-0 flex">
                        <div className={`w-1.5 ${!n.is_read ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                        <div className="p-6 flex gap-6 flex-1 items-center">
                            <div className={`w-14 h-14 rounded-2xl ${config.bg} flex items-center justify-center shrink-0 shadow-inner`}>
                            <config.icon className={`w-7 h-7 ${config.color}`} />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-2">
                                <span className={`text-[10px] font-black uppercase tracking-tighter ${config.color}`}>
                                {n.type}
                                </span>
                                <span className="text-[10px] font-black text-slate-400 flex items-center gap-1 uppercase">
                                <Clock className="w-3 h-3" />
                                {timeAgo(n.created_at)}
                                </span>
                            </div>
                            <p className={`text-base leading-tight tracking-tight ${!n.is_read ? "text-slate-900 font-black" : "text-slate-600 font-bold"}`}>
                                {n.content}
                            </p>
                            </div>
                        </div>
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