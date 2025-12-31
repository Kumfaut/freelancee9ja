"use client";

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Alert, AlertDescription } from "../components/ui/Alert";
import { ArrowLeft, Mail, CheckCircle, Loader2, Info } from "lucide-react";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Basic validation before starting
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);

    // Simulate API call to send recovery email
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 2000);
  };

  const handleResend = () => {
    setIsSuccess(false);
    setEmail("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Logo/Header */}
        <div className="text-center">
          <Link to="/" className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-xl shadow-emerald-100">
              N
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {isSuccess ? "Check your inbox" : "Reset your password"}
          </h1>
          <p className="text-slate-500 mt-2">
            {isSuccess 
              ? `We've sent a recovery link to ${email}`
              : "Enter your email address and we'll send you a link to reset your password."
            }
          </p>
        </div>

        {isSuccess ? (
          /* SUCCESS STATE */
          <Card className="border-none shadow-sm overflow-hidden">
            <div className="h-2 bg-emerald-500 w-full" />
            <CardContent className="pt-8 text-center space-y-6">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-emerald-600" />
              </div>
              
              <div className="space-y-4">
                <Alert className="bg-slate-50 border-slate-200 text-left">
                  <Info className="h-4 w-4 text-slate-400" />
                  <AlertDescription className="text-slate-600 text-xs">
                    Can't find the email? Check your <strong>Spam</strong> or <strong>Promotions</strong> folder. It usually arrives within 60 seconds.
                  </AlertDescription>
                </Alert>

                <div className="pt-4 border-t border-slate-100">
                  <p className="text-sm text-slate-500">
                    Mistake in your email?{" "}
                    <button onClick={handleResend} className="text-emerald-600 font-semibold hover:underline">
                      Try again
                    </button>
                  </p>
                </div>

                <Button
                  variant="outline"
                  onClick={() => navigate("/login")}
                  className="w-full h-11"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Return to Sign In
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* FORM STATE */
          <Card className="border-none shadow-sm">
            <CardContent className="pt-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      className="pl-10 h-11"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive" className="py-3">
                    <AlertDescription className="text-xs">{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 h-11 text-white font-medium transition-all"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending Link...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => navigate("/login")}
                  className="w-full text-slate-500 hover:text-slate-800"
                  disabled={isLoading}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Sign In
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Footer Help */}
        <div className="text-center">
          <p className="text-sm text-slate-400">
            Need more help? Contact our{" "}
            <Link to="/support" className="text-emerald-600 hover:underline font-medium">
              Customer Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}