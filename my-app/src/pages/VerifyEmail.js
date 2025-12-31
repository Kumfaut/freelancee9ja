"use client";

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { toast } from "sonner";
import { Mail, ArrowRight, RefreshCcw } from "lucide-react";

export default function VerifyEmailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Guard: If no state exists, redirect to signup
  useEffect(() => {
    if (!location.state?.email) {
      navigate("/signup");
    }
  }, [location.state, navigate]);

  const email = location.state?.email || "";
  const redirectTo = location.state?.redirectTo || "/search"; 

  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [timer, setTimer] = useState(60);

  // Resend Cooldown Timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleVerify = (e) => {
    e.preventDefault();
    if (code.length < 4) {
      toast.error("Invalid Code", { description: "Please enter the 6-digit code sent to you." });
      return;
    }

    setIsVerifying(true);

    // Simulated API Call
    setTimeout(() => {
      setIsVerifying(false);
      toast.success("Identity Verified", { description: "Redirecting to your dashboard..." });
      
      // Navigate to the role-specific page we passed from Sign Up
      navigate(redirectTo);
    }, 2000);
  };

  const handleResend = () => {
    setTimer(60);
    toast.info("Code Resent", { description: `A new code has been sent to ${email}` });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-none shadow-2xl animate-in fade-in zoom-in-95">
        <CardHeader className="text-center">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-3">
            <Mail className="w-10 h-10" />
          </div>
          <CardTitle className="text-2xl font-black text-slate-900">Verify your email</CardTitle>
          <CardDescription className="px-6">
            We've sent a 6-digit verification code to <br/>
            <span className="font-bold text-slate-900">{email}</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="space-y-2">
              <Input
                type="text"
                maxLength={6}
                placeholder="· · · · · ·"
                className="text-center text-4xl tracking-[0.5em] font-black h-20 border-2 border-slate-100 focus:border-emerald-500 focus:ring-emerald-500/10 transition-all shadow-inner"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} // Only allow numbers
              />
              <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">
                Enter Numbers Only
              </p>
            </div>
            
            <Button 
              className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg shadow-xl"
              disabled={isVerifying || code.length < 4}
            >
              {isVerifying ? (
                <span className="flex items-center gap-2">
                  <RefreshCcw className="w-5 h-5 animate-spin" /> Verifying...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Verify Account <ArrowRight className="w-5 h-5" />
                </span>
              )}
            </Button>
            
            <div className="text-center">
              {timer > 0 ? (
                <p className="text-sm text-slate-400">
                  Resend code in <span className="font-bold text-slate-600">{timer}s</span>
                </p>
              ) : (
                <button 
                  type="button" 
                  onClick={handleResend}
                  className="text-sm text-emerald-600 font-bold hover:underline"
                >
                  Resend Verification Code
                </button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}