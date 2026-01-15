"use client";

import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import { 
  Wallet, Bell, User, Settings, LogOut, 
  ChevronDown, Menu, Heart, X, Briefcase,
  PlusCircle, LayoutDashboard, MessageSquare, Search,
  FolderKanban
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "./ui/Button";
import { Avatar, AvatarFallback } from "./ui/Avatar";
import { NotificationsDropdown } from "./NotificationsDropdown";
import { useAuth } from "../context/AuthContext";
import { io } from "socket.io-client";

// Maintain a single socket instance
const socket = io("http://localhost:5000", {
  transports: ["websocket"],
  withCredentials: true
});

export function Navbar() {
  const { user, logout, isLoggedIn, setUser } = useAuth(); 
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  const userType = user?.role || "freelancer";

  // 1. SYNC USER DATA (Wallet & Profile)
  const refreshUserData = useCallback(async () => {
    if (!isLoggedIn) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setUser(res.data.user); // Updates the wallet balance globally
      }
    } catch (err) {
      console.error("❌ Failed to sync profile data:", err);
    }
  }, [isLoggedIn, setUser]);

  // 2. FETCH INITIAL UNREAD COUNT
  const fetchUnreadCount = useCallback(async () => {
    if (!isLoggedIn) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/notifications/unread-count", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setUnreadCount(res.data.unreadCount);
      }
    } catch (err) {
      console.error("❌ Error fetching unread count:", err);
    }
  }, [isLoggedIn]);

  // 3. REAL-TIME SOCKET LOGIC
  useEffect(() => {
    if (isLoggedIn && user?.id) {
      // Refresh balance and counts on mount
      refreshUserData();
      fetchUnreadCount();

      // Join personal room for targeted pings
      socket.emit("join_personal_room", user.id);

      // Listen for instant notifications
      socket.on("new_notification", (data) => {
        setUnreadCount((prev) => prev + 1);
        
        // IF PAYMENT/WALLET RELATED: Trigger a wallet refresh
        if (["payment", "deposit", "withdrawal", "milestone_released"].includes(data.type)) {
          refreshUserData();
        }
      });

      // Listen for message-specific sidebar pings
      socket.on("inbox_update", () => {
        // Optional: Could trigger a silent fetch if needed
      });
    }

    return () => {
      socket.off("new_notification");
      socket.off("inbox_update");
    };
  }, [isLoggedIn, user?.id, refreshUserData, fetchUnreadCount]);

  // 4. CLICK OUTSIDE HANDLERS
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) setIsProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(event.target)) setIsNotifOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = useMemo(() => {
    const displayName = user?.full_name || user?.name || "User";
    return displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  }, [user]);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3 shrink-0 group">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200 group-hover:rotate-3 transition-transform">
            <span className="text-white font-black text-2xl tracking-tighter">N</span>
          </div>
          <div className="flex-col justify-center -space-y-1 hidden sm:flex">
            <span className="text-lg font-black text-slate-900 tracking-tighter leading-tight">NaijaFreelance</span>
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest leading-tight">
               {userType === "client" ? "Employer Hub" : "Marketplace"}
            </span>
          </div>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-1">
          {!isLoggedIn ? (
            <div className="flex items-center gap-6">
              <NavLink to="/browse-jobs">Browse Jobs</NavLink>
              <NavLink to="/browse-freelancers">Find Talent</NavLink>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              {userType === "client" ? (
                <>
                  <NavLink to="/client-dashboard" active={isActive('/client-dashboard')} icon={<LayoutDashboard size={16}/>}>Dashboard</NavLink>
                  <NavLink to="/post-job" active={isActive('/post-job')} icon={<PlusCircle size={16}/>}>Post Job</NavLink>
                  <NavLink to="/my-projects" active={isActive('/my-projects')} icon={<FolderKanban size={16}/>}>My Projects</NavLink>
                </>
              ) : (
                <>
                  <NavLink to="/search" active={isActive('/search')} icon={<Search size={16}/>}>Find Work</NavLink>
                  <NavLink to="/proposals" active={isActive('/proposals')} icon={<MessageSquare size={16}/>}>Proposals</NavLink>
                  <NavLink to="/my-projects" active={isActive('/my-projects')} icon={<Briefcase size={16}/>}>My Projects</NavLink>
                </>
              )}
              <div className="w-px h-6 bg-slate-200 mx-2" />
              <NavLink to="/messages" active={isActive('/messages')} icon={<MessageSquare size={16}/>}>Messages</NavLink>
            </div>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
                {/* WALLET (Now auto-syncs) */}
                <Link to="/wallet" className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-all hover:bg-white">
                  <Wallet className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-black text-slate-700">
                    ₦{Number(user?.balance || 0).toLocaleString()}
                  </span>
                </Link>

              {/* NOTIFICATIONS */}
              <div className="relative" ref={notifRef}>
                <button 
                  onClick={() => { setIsNotifOpen(!isNotifOpen); setIsProfileOpen(false); }}
                  className={`p-2 rounded-xl transition-all relative ${isNotifOpen ? "bg-emerald-50 text-emerald-600 shadow-inner" : "text-slate-400 hover:bg-slate-50"}`}
                >
                  <Bell size={22} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-5 h-5 bg-orange-600 text-white text-[10px] font-black flex items-center justify-center rounded-full ring-2 ring-white">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
                {isNotifOpen && (
                  <div className="absolute right-0 mt-3 w-80 z-[60] shadow-2xl animate-in fade-in zoom-in-95 origin-top-right">
                    <NotificationsDropdown onClose={() => { setIsNotifOpen(false); fetchUnreadCount(); }} />
                  </div>
                )}
              </div>

              {/* PROFILE */}
              <div className="relative" ref={profileRef}>
                <button 
                  onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotifOpen(false); }}
                  className="flex items-center gap-2 p-1 pr-2 hover:bg-slate-50 rounded-full transition-all border border-transparent hover:border-slate-100"
                >
                  <Avatar className="h-9 w-9 rounded-full ring-2 ring-white shadow-sm">
                    {user?.profile_image ? (
                        <img src={user.profile_image} alt="" className="h-full w-full object-cover rounded-full" />
                    ) : (
                        <AvatarFallback className="bg-emerald-600 text-white text-xs font-black">{getInitials}</AvatarFallback>
                    )}
                  </Avatar>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileOpen && (
                    <div className="absolute right-0 mt-3 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl py-2 z-[60] animate-in fade-in slide-in-from-top-2">
                        <div className="px-5 py-3 border-b border-slate-50">
                            <p className="text-sm font-black text-slate-900 truncate">{user?.full_name}</p>
                            <Badge className="mt-1 bg-emerald-50 text-emerald-700 border-emerald-100 uppercase">{userType}</Badge>
                        </div>
                        <div className="p-2 space-y-0.5">
                            <MenuLink icon={<User />} label="My Profile" onClick={() => { setIsProfileOpen(false); navigate("/profile"); }} />
                            {userType === "freelancer" && (
                                <MenuLink icon={<Heart className="text-red-500 fill-red-500" />} label="Saved Jobs" onClick={() => navigate("/saved-jobs")} />
                            )}
                            <MenuLink icon={<Settings />} label="Settings" onClick={() => navigate("/settings")} />
                            <div className="h-px bg-slate-100 my-2 mx-2" />
                            <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl font-bold transition-colors">
                                <LogOut size={16} /> Log Out
                            </button>
                        </div>
                    </div>
                )}
              </div>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Button variant="ghost" onClick={() => navigate("/login")}>Login</Button>
              <Button className="bg-emerald-600" onClick={() => navigate("/signup")}>Join</Button>
            </div>
          )}

          <button className="md:hidden p-2 text-slate-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE NAV */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 p-4 space-y-2 shadow-xl animate-in slide-in-from-top">
           {isLoggedIn ? (
             <div className="flex flex-col gap-1">
                <MobileNavLink to={userType === 'client' ? '/client-dashboard' : '/search'}>Dashboard</MobileNavLink>
                <MobileNavLink to="/messages">Messages</MobileNavLink>
                <MobileNavLink to="/notifications">Notifications ({unreadCount})</MobileNavLink>
                <button onClick={logout} className="w-full text-left p-4 text-red-500 font-bold border-t border-slate-50 mt-2">Log Out</button>
             </div>
           ) : (
             <div className="grid grid-cols-1 gap-3">
                <Button variant="outline" onClick={() => navigate("/login")}>Login</Button>
                <Button className="bg-emerald-600" onClick={() => navigate("/signup")}>Get Started</Button>
             </div>
           )}
        </div>
      )}
    </nav>
  );
}

// --- Helper Components (Keep these below main component) ---
function NavLink({ to, children, active, icon }) {
  return (
    <Link to={to} className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl transition-all ${active ? "text-emerald-600 bg-emerald-50" : "text-slate-500 hover:text-emerald-600 hover:bg-slate-50"}`}>
      {icon} {children}
    </Link>
  );
}

function MobileNavLink({ to, children }) {
  return (
    <Link to={to} className="block w-full p-4 rounded-2xl font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-600">
      {children}
    </Link>
  );
}

function MenuLink({ icon, label, onClick }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-emerald-600 rounded-xl transition-all text-left">
      {React.cloneElement(icon, { size: 16, className: "opacity-70" })} {label}
    </button>
  );
}

function Badge({ children, className }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-black tracking-wider ring-1 ring-inset ${className}`}>
      {children}
    </span>
  );
}