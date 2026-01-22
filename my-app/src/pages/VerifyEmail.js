"use client";

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { toast } from "sonner";
import { Mail, ArrowRight, RefreshCcw } from "lucide-react";

// Reuse the LanguageToggle for consistency
function LanguageToggle() {
  const { i18n } = useTranslation();
  const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'pcm', label: 'Pidgin', flag: '🇳🇬' },
    { code: 'yo', label: 'Yorùbá', flag: '🇳🇬' },
    { code: 'ig', label: 'Ígbò', flag: '🇳🇬' },
    { code: 'ha', label: 'Hausa', flag: '🇳🇬' },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-2 mb-6">
      {languages.map((lang) => (
        <button
          key={lang.code}
          type="button"
          onClick={() => i18n.changeLanguage(lang.code)}
          className={`px-3 py-1 rounded-full text-[10px] font-black transition-all border ${
            i18n.language === lang.code
              ? "bg-emerald-600 border-emerald-600 text-white shadow-md"
              : "bg-white border-slate-200 text-slate-500 hover:border-emerald-300"
          }`}
        >
          {lang.flag} {lang.label}
        </button>
      ))}
    </div>
  );
}

export default function VerifyEmailPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  
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

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleVerify = (e) => {
    e.preventDefault();
    if (code.length < 4) {
      toast.error(t('invalid_code_title', 'Invalid Code'), { 
        description: t('invalid_code_desc', 'Please enter the code sent to you.') 
      });
      return;
    }

    setIsVerifying(true);

    // Simulated API Call
    setTimeout(() => {
      setIsVerifying(false);
      toast.success(t('identity_verified'), { description: t('redirecting') });
      navigate(redirectTo);
    }, 2000);
  };

  const handleResend = () => {
    setTimer(60);
    toast.info(t('code_resent'), { description: `${t('code_resent_desc')} ${email}` });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
      {/* Language Switcher at the top level */}
      <LanguageToggle />

      <Card className="max-w-md w-full border-none shadow-2xl rounded-[2.5rem] bg-white animate-in fade-in zoom-in-95 duration-500">
        <CardHeader className="text-center pt-10">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-3 shadow-inner shadow-emerald-100">
            <Mail className="w-10 h-10" />
          </div>
          <CardTitle className="text-2xl font-black text-slate-900 tracking-tight">
            {t('verify_email_title')}
          </CardTitle>
          <CardDescription className="px-6 mt-2 font-medium">
            {t('verify_email_subtitle')} <br/>
            <span className="font-bold text-slate-900 underline decoration-emerald-200 decoration-4">{email}</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8 space-y-6">
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="space-y-3">
              <Input
                type="text"
                maxLength={6}
                placeholder="0 0 0 0 0 0"
                className="text-center text-4xl tracking-[0.3em] font-black h-20 rounded-2xl border-2 border-slate-100 focus:border-emerald-500 focus:ring-emerald-500/10 transition-all shadow-sm"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              />
              <p className="text-[10px] text-center text-slate-400 font-black uppercase tracking-widest">
                {t('enter_numbers_only')}
              </p>
            </div>
            
            <Button 
              className="w-full h-14 bg-slate-900 hover:bg-emerald-600 text-white font-black text-lg rounded-2xl shadow-xl transition-all active:scale-95"
              disabled={isVerifying || code.length < 4}
            >
              {isVerifying ? (
                <span className="flex items-center gap-2">
                  <RefreshCcw className="w-5 h-5 animate-spin" /> {t('verifying')}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {t('verify_account_btn')} <ArrowRight className="w-5 h-5" />
                </span>
              )}
            </Button>
            
            <div className="text-center pb-4">
              {timer > 0 ? (
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                  {t('resend_in')} <span className="text-emerald-600 font-black ml-1">{timer}s</span>
                </p>
              ) : (
                <button 
                  type="button" 
                  onClick={handleResend}
                  className="text-sm text-emerald-600 font-black hover:underline underline-offset-4"
                >
                  {t('resend_btn')}
                </button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}