"use client";

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Checkbox } from "../components/ui/Checkbox";
import { Separator } from "../components/ui/Separator";
import { Mail, Lock, Chrome, Facebook, Loader2, Languages } from "lucide-react";
import { useAuth } from "../context/AuthContext"; 
import { loginUser as apiLoginUser } from "../api/api";
import { useTranslation } from 'react-i18next';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth(); 
  const { t, i18n } = useTranslation();

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Language Change Handler
  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('pref_lang', lang);
  };

  // Login Handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(""); 
    
    try {
      const response = await apiLoginUser({ email, password });
      
      // Destructure data from the API response
      const { token, user } = response.data;

      // Persist token and update Auth Context
      localStorage.setItem("token", token);
      login(user, token);

      // Role-based redirection
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (user.role === "client") {
        navigate("/client-dashboard");
      } else {
        navigate("/freelancer-dashboard");
      }
    } catch (err) {
      // Capture and display API or Network errors
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    // Direct the browser to your backend OAuth endpoint
    window.location.href = `http://localhost:5000/api/auth/${provider}`;
  };
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center py-12 px-4">
      
      {/* 1. LANGUAGE SELECTOR PILL */}
      <div className="mb-8 flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
        <Languages className="h-4 w-4 text-emerald-600" />
        <select 
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="bg-transparent text-sm font-semibold text-slate-700 focus:outline-none cursor-pointer"
          defaultValue={i18n.language}
        >
          <option value="en">English</option>
          <option value="pcm">Pidgin (Naija)</option>
          <option value="ig">Igbo (Asụsụ Igbo)</option>
          <option value="yo">Yoruba (Èdè Yorùbá)</option>
          <option value="ha">Hausa (Harshen Hausa)</option>
        </select>
      </div>

      <div className="max-w-md w-full space-y-8">
        
        {/* 2. HEADER SECTION */}
        <div className="text-center">
          <Link to="/" className="inline-flex justify-center mb-6">
            <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-emerald-100">
              N
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">{t('welcome_back')}</h1>
          <p className="text-slate-500">{t('signin_subtitle')}</p>
        </div>

        {/* 3. LOGIN CARD */}
        <Card className="border-none shadow-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">{t('login_btn')}</CardTitle>
            <CardDescription>{t('enter_details')}</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Dynamic Error Alert */}
            {error && (
              <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">{t('email_label')}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 focus-visible:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">{t('pass_label')}</Label>
                  <Link to="/forgot-password" size="sm" className="text-xs text-emerald-600 hover:underline">
                    {t('forgot_password')}
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 focus-visible:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center space-x-2 pt-1">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked)}
                />
                <Label htmlFor="remember" className="text-sm font-normal text-slate-600 cursor-pointer">
                  {t('remember_me')}
                </Label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 h-11 mt-2 font-bold transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('signing_in')}
                  </>
                ) : (
                  t('login_btn')
                )}
              </Button>
            </form>

            {/* 4. SOCIAL LOGIN SECTION */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-slate-400">{t('or_continue')}</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button variant="outline" type="button" onClick={() => handleSocialLogin("google")} className="border-slate-200 hover:bg-slate-50">
                  <Chrome className="mr-2 h-4 w-4 text-red-500" /> Google
                </Button>
                <Button variant="outline" type="button" onClick={() => handleSocialLogin("facebook")} className="border-slate-200 hover:bg-slate-50">
                  <Facebook className="mr-2 h-4 w-4 text-blue-600" /> Facebook
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 5. FOOTER LINK */}
        <p className="text-center text-sm text-slate-500">
          {t('no_account')}{" "}
          <Link to="/signup" className="text-emerald-600 font-bold hover:underline">
            {t('signup_free')}
          </Link>
        </p>
      </div>
    </div>
  );
}