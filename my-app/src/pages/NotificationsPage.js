"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Using standard routing
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/Tabs";
import { Input } from "../components/ui/Input";
import { 
  Bell, 
  BellOff, 
  Briefcase, 
  MessageSquare, 
  DollarSign, 
  Star,
  CheckCircle2,
  Trash2,
  Search,
  MoreHorizontal
} from "lucide-react";

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "message",
      title: "New message from Sarah Johnson",
      description: "Sent you a message about the E-commerce Website project",
      time: "5 minutes ago",
      read: false,
      icon: MessageSquare,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
      path: "/messages"
    },
    {
      id: 2,
      type: "job",
      title: "New job matches your skills",
      description: "React Native App Development - ₦300,000 budget",
      time: "1 hour ago",
      read: false,
      icon: Briefcase,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50",
      path: "/jobs/2"
    },
    {
      id: 3,
      type: "payment",
      title: "Payment received",
      description: "₦250,000 has been deposited to your wallet for E-commerce Platform",
      time: "2 hours ago",
      read: false,
      icon: DollarSign,
      iconColor: "text-green-600",
      iconBg: "bg-green-50",
      path: "/wallet"
    },
    {
      id: 4,
      type: "review",
      title: "New 5-star review",
      description: "Chinedu Okonkwo left you a glowing review",
      time: "5 hours ago",
      read: true,
      icon: Star,
      iconColor: "text-yellow-600",
      iconBg: "bg-yellow-50",
      path: "/profile"
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    if(window.confirm("Are you sure you want to clear all notifications?")) {
        setNotifications([]);
    }
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    if (notification.path) {
      navigate(notification.path);
    }
  };

  const filteredNotifications = notifications.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         n.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const getCategorizedNotifications = (category) => {
    if (category === "all") return filteredNotifications;
    if (category === "unread") return filteredNotifications.filter(n => !n.read);
    return filteredNotifications.filter(n => n.type === category);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Bell className="w-6 h-6 text-slate-700" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Notifications</h1>
            </div>
            <p className="text-slate-500 font-medium">
              You have <span className="text-emerald-600">{unreadCount} unread</span> updates today.
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" className="bg-white" onClick={markAllAsRead} disabled={unreadCount === 0}>
               <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600" />
               Mark all read
            </Button>
            <Button variant="outline" className="bg-white text-red-600 hover:bg-red-50" onClick={clearAll}>
               <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Search & Tabs */}
        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search notifications..." 
              className="pl-10 bg-white border-slate-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="bg-white border border-slate-200 p-1 mb-6 overflow-x-auto justify-start">
              <TabsTrigger value="all" className="px-6">All</TabsTrigger>
              <TabsTrigger value="unread" className="px-6">Unread</TabsTrigger>
              <TabsTrigger value="message">Messages</TabsTrigger>
              <TabsTrigger value="job">Jobs</TabsTrigger>
              <TabsTrigger value="payment">Payments</TabsTrigger>
            </TabsList>

            {["all", "unread", "message", "job", "payment"].map((cat) => (
              <TabsContent key={cat} value={cat} className="space-y-3">
                {getCategorizedNotifications(cat).length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
                    <BellOff className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <h3 className="text-slate-900 font-bold">Nothing to see here</h3>
                    <p className="text-slate-400 text-sm">No notifications found in this category.</p>
                  </div>
                ) : (
                  getCategorizedNotifications(cat).map((n) => (
                    <Card 
                      key={n.id} 
                      onClick={() => handleNotificationClick(n)}
                      className={`group border-none shadow-sm transition-all hover:shadow-md cursor-pointer ${
                        !n.read ? "bg-emerald-50/40 ring-1 ring-emerald-100" : "bg-white"
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className={`w-12 h-12 rounded-xl ${n.iconBg} flex items-center justify-center shrink-0`}>
                             <n.icon className={`w-6 h-6 ${n.iconColor}`} />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                              <h4 className={`text-sm md:text-base truncate ${!n.read ? "font-bold text-slate-900" : "font-medium text-slate-700"}`}>
                                {n.title}
                              </h4>
                              <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap ml-4">
                                {n.time}
                              </span>
                            </div>
                            <p className="text-sm text-slate-500 line-clamp-2 mb-3">
                              {n.description}
                            </p>
                            
                            <div className="flex items-center gap-4">
                               <button 
                                 onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
                                 className="text-xs font-bold text-slate-400 hover:text-red-600 flex items-center gap-1"
                               >
                                 <Trash2 className="w-3 h-3" /> Remove
                               </button>
                               {!n.read && (
                                 <div className="flex items-center gap-1.5">
                                   <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                   <span className="text-xs font-bold text-emerald-600">New</span>
                                 </div>
                               )}
                            </div>
                          </div>
                          
                          <div className="hidden group-hover:flex items-center">
                             <MoreHorizontal className="w-5 h-5 text-slate-300" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
}