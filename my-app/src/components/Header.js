"use client";

import React, { useState } from "react";
import { Wallet, Bell, User, Settings, LogOut, ChevronDown, Menu, X, Heart } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "./ui/Button";
import { Avatar, AvatarFallback } from "./ui/Avatar";
import { NotificationsDropdown } from "./NotificationsDropdown";
import { useAuth } from "../context/AuthContext"; // 1. Ensure this path is correct

export function Navbar() {
  // 2. Grab auth state and logout from context
  const { user, logout, isLoggedIn } = useAuth(); 
  
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  
  // 3. Dynamic role and login status
  const userType = user?.role || "freelancer"; 
  const unreadCount = 3; 

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">N</span>
          </div>
          <span className="text-xl font-bold bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent hidden sm:block">
            NaijaFreelance
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {!isLoggedIn ? (
            /* GUEST LINKS */
            <>
              <Link to="/browse-jobs" className={`text-sm font-medium transition-colors hover:text-emerald-600 ${isActive('/browse-jobs') ? 'text-emerald-600' : 'text-slate-600'}`}>
                Browse Jobs
              </Link>
              <Link to="/browse-freelancers" className={`text-sm font-medium transition-colors hover:text-emerald-600 ${isActive('/browse-freelancers') ? 'text-emerald-600' : 'text-slate-600'}`}>
                Find Talent
              </Link>
            </>
          ) : userType === "freelancer" ? (
            /* FREELANCER LINKS */
            <>
              <Link to="/search" className={`text-sm font-medium transition-colors hover:text-emerald-600 ${isActive('/search') ? 'text-emerald-600' : 'text-slate-600'}`}>
                Find Work
              </Link>
              <Link to="/proposals" className={`text-sm font-medium transition-colors hover:text-emerald-600 ${isActive('/proposals') ? 'text-emerald-600' : 'text-slate-600'}`}>
                My Proposals
              </Link>
            </>
          ) : (
            /* CLIENT LINKS */
            <>
              <Link to="/post-job" className={`text-sm font-medium transition-colors hover:text-emerald-600 ${isActive('/post-job') ? 'text-emerald-600' : 'text-slate-600'}`}>
                Post a Job
              </Link>
              <Link to="/client-dashboard" className={`text-sm font-medium transition-colors hover:text-emerald-600 ${isActive('/client-dashboard') ? 'text-emerald-600' : 'text-slate-600'}`}>
                My Job Posts
              </Link>
              <Link to="/hired-freelancers" className={`text-sm font-medium transition-colors hover:text-emerald-600 ${isActive('/hired-freelancers') ? 'text-emerald-600' : 'text-slate-600'}`}>
                Manage Team
              </Link>
            </>
          )}

          {/* COMMON LINK (Visible to anyone logged in) */}
          {isLoggedIn && (
            <Link to="/messages" className={`text-sm font-medium transition-colors hover:text-emerald-600 ${isActive('/messages') ? 'text-emerald-600' : 'text-slate-600'}`}>
              Messages
            </Link>
          )}
        </div>
        {/* Right Side Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {isLoggedIn ? (
            <>
              {/* WALLET LINK - Only for Freelancers */}
              {userType === "freelancer" && (
                <Link 
                  to="/wallet" 
                  className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full transition-all border ${
                    isActive('/wallet') 
                    ? 'bg-emerald-50 border-emerald-200 shadow-sm' 
                    : 'bg-slate-50 border-transparent hover:bg-slate-100'
                  }`}
                >
                  <Wallet className={`w-4 h-4 ${isActive('/wallet') ? 'text-emerald-600' : 'text-slate-500'}`} />
                  <span className="text-sm font-bold text-slate-700 font-mono">₦856k</span>
                </Link>
              )}

              {/* NOTIFICATION BELL */}
              <div className="relative">
                <button 
                  onClick={() => {
                    setIsNotifOpen(!isNotifOpen);
                    setIsProfileOpen(false);
                  }}
                  className={`p-2 rounded-full transition-colors relative ${
                    isNotifOpen ? "bg-emerald-50 text-emerald-600" : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {isNotifOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsNotifOpen(false)} />
                    <div className="absolute right-0 mt-2 z-20 shadow-2xl animate-in fade-in slide-in-from-top-2">
                      <NotificationsDropdown onClose={() => setIsNotifOpen(false)} />
                    </div>
                  </>
                )}
              </div>

              {/* PROFILE DROPDOWN */}
              <div className="relative">
                <button 
                  onClick={() => {
                    setIsProfileOpen(!isProfileOpen);
                    setIsNotifOpen(false);
                  }}
                  className="flex items-center gap-1 sm:gap-2 p-1 hover:bg-slate-50 rounded-lg transition-all"
                >
                  <Avatar className="h-8 w-8 border border-slate-200">
                    <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs font-bold">
                      {user?.name?.substring(0, 2).toUpperCase() || "NB"}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform hidden sm:block ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-20 animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-2 border-b border-slate-50 mb-1">
                        <p className="text-sm font-bold text-slate-900">{user?.name || "User"}</p>
                        <p className="text-xs text-slate-500 font-medium capitalize">{userType}</p>
                      </div>

                      <button onClick={() => { navigate("/profile"); setIsProfileOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-emerald-50 transition-colors">
                        <User className="w-4 h-4" /> My Profile
                      </button>

                      {userType === "freelancer" && (
                        <button onClick={() => { navigate("/saved-jobs"); setIsProfileOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-emerald-50 transition-colors">
                          <Heart className="w-4 h-4" /> Saved Jobs
                        </button>
                      )}

                      <button onClick={() => { navigate("/settings"); setIsProfileOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-emerald-50 transition-colors">
                        <Settings className="w-4 h-4" /> Settings
                      </button>

                      <div className="border-t border-slate-100 mt-2 pt-1">
                        <button 
                          onClick={() => {
                            logout();
                            setIsProfileOpen(false);
                          }} 
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" /> Log Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Button variant="ghost" onClick={() => navigate("/login")}>Login</Button>
              <Button className="bg-emerald-600" onClick={() => navigate("/signup")}>Join</Button>
            </div>
          )}

          <button className="md:hidden p-2 text-slate-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 p-4 space-y-2">
          {userType === "freelancer" ? (
            <>
              <Link to="/search" className={`block p-2 rounded-lg font-medium ${isActive('/search') ? 'bg-emerald-50 text-emerald-600' : 'text-slate-600'}`} onClick={() => setIsMenuOpen(false)}>Find Work</Link>
              <Link to="/proposals" className={`block p-2 rounded-lg font-medium ${isActive('/proposals') ? 'bg-emerald-50 text-emerald-600' : 'text-slate-600'}`} onClick={() => setIsMenuOpen(false)}>My Proposals</Link>
              <Link to="/wallet" className={`block p-2 rounded-lg font-medium ${isActive('/wallet') ? 'bg-emerald-50 text-emerald-600' : 'text-slate-600'}`} onClick={() => setIsMenuOpen(false)}>My Wallet</Link>
            </>
          ) : (
            <>
              <Link to="/post-job" className={`block p-2 rounded-lg font-medium ${isActive('/post-job') ? 'bg-emerald-50 text-emerald-600' : 'text-slate-600'}`} onClick={() => setIsMenuOpen(false)}>Post a Job</Link>
              <Link to="/client-dashboard" className={`block p-2 rounded-lg font-medium ${isActive('/client-dashboard') ? 'bg-emerald-50 text-emerald-600' : 'text-slate-600'}`} onClick={() => setIsMenuOpen(false)}>My Job Posts</Link>
            </>
          )}
          <Link to="/messages" className={`block p-2 rounded-lg font-medium ${isActive('/messages') ? 'bg-emerald-50 text-emerald-600' : 'text-slate-600'}`} onClick={() => setIsMenuOpen(false)}>Messages</Link>
          <Link to="/notifications" className="block p-2 rounded-lg font-medium text-slate-600" onClick={() => setIsMenuOpen(false)}>Notifications ({unreadCount})</Link>
          
          {!isLoggedIn && (
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <Button variant="outline" className="w-full" onClick={() => navigate("/login")}>Login</Button>
              <Button className="w-full bg-emerald-600" onClick={() => navigate("/signup")}>Join</Button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}