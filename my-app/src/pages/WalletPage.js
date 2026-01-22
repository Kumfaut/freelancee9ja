"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import axios from "axios";
import { 
  Wallet, ArrowUpFromLine, TrendingUp, ShieldCheck, 
  History, Loader2, CheckCircle2, Info
} from "lucide-react";

import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

const NIGERIAN_BANKS = [
  { code: "011", name: "First Bank" }, { code: "058", name: "GTBank" },
  { code: "044", name: "Access Bank" }, { code: "057", name: "Zenith Bank" },
  { code: "033", name: "UBA" }, { code: "050", name: "EcoBank" },
  { code: "214", name: "FCMB" }, { code: "999", name: "Kuda Bank" },
  { code: "50515", name: "Moniepoint" }, { code: "100004", name: "Opay" },
];

export default function WalletPage() {
  const { user, loading: authLoading } = useAuth();
  
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(true); 
  const [isProcessing, setIsProcessing] = useState(false);
  const [walletStats, setWalletStats] = useState({ available: 0, escrow: 0, history: [] });

  const [selectedBank, setSelectedBank] = useState("");
  const [accNumber, setAccNumber] = useState("");
  const [verifiedName, setVerifiedName] = useState("");
  const [isVerifyingName, setIsVerifyingName] = useState(false);

  const hasVerified = useRef(false);
  const userType = user?.role || "freelancer";

  // --- NEW: PAYOUT CALCULATOR LOGIC ---
  const feeDetails = useMemo(() => {
    const val = parseFloat(amount || 0);
    const platformFee = val * 0.10; // 10% Platform Fee
    const takeHome = val - platformFee;
    return { platformFee, takeHome };
  }, [amount]);

  const fetchWalletData = useCallback(async () => {
    if (!user?.token) return;
    try {
      const response = await axios.get(
        `http://localhost:5000/api/wallet/wallet-status`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      if (response.data.success) {
        setWalletStats({
          available: parseFloat(response.data.balance || 0),
          escrow: parseFloat(response.data.escrow || 0),
          history: response.data.history || []
        });
      }
    } catch (error) {
      toast.error("Could not sync wallet balance.");
    } finally {
      setIsLoading(false);
    }
  }, [user?.token]);

  const verifyPayment = useCallback(async (reference) => {
    if (hasVerified.current || !user?.token) return;
    hasVerified.current = true; 
    setIsProcessing(true);
    try {
      const res = await axios.post(
        `http://localhost:5000/api/wallet/verify-payment`,
        { reference },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      if (res.data.success) {
        toast.success("Deposit successful!");
        window.history.replaceState({}, document.title, window.location.pathname);
        await fetchWalletData(); 
      }
    } catch (err) {
      toast.error("Payment verification failed.");
      hasVerified.current = false;
    } finally {
      setIsProcessing(false);
    }
  }, [user?.token, fetchWalletData]);

  useEffect(() => {
    if (!authLoading && user) {
      const params = new URLSearchParams(window.location.search);
      const reference = params.get("reference");
      if (reference) verifyPayment(reference);
      else fetchWalletData();
    } else if (!authLoading && !user) setIsLoading(false);
  }, [authLoading, user, fetchWalletData, verifyPayment]);

  useEffect(() => {
    let timer;
    
    // Grab token directly from storage to be 100% sure
    const storedToken = localStorage.getItem("token");
  
    if (accNumber.length === 10 && selectedBank && storedToken) {
      setIsVerifyingName(true);
      timer = setTimeout(async () => {
        try {
          const res = await axios.get(
            `http://localhost:5000/api/wallet/verify-account`,
            {
              params: { accountNumber: accNumber, bankCode: selectedBank },
              headers: { Authorization: `Bearer ${storedToken}` } // Using the direct token
            }
          );
  
          if (res.data.success) {
            setVerifiedName(res.data.accountName);
            toast.success(`Account Verified: ${res.data.accountName}`);
          }
        } catch (err) {
          console.error("Verification failed:", err.response?.data);
          setVerifiedName("");
          // Show the actual error from the backend
          toast.error(err.response?.data?.message || "Verification failed");
        } finally {
          setIsVerifyingName(false);
        }
      }, 600);
    } else {
      setVerifiedName("");
    }
    return () => clearTimeout(timer);
  }, [accNumber, selectedBank]); // Token is handled inside, no need to watch user.token

  const handleAction = async (e) => {
    e.preventDefault();
    
    // Get token directly from localStorage to ensure it's fresh
    const token = localStorage.getItem("token") || user?.token;
    
    if (!token) {
      return toast.error("You are not logged in. Please log in again.");
    }
  
    const numAmount = Number(amount);
    if (!numAmount || numAmount < 100) return toast.error("Minimum deposit is ₦100");
  
    setIsProcessing(true);
  
    try {
      if (userType === "client") {
        const response = await axios.post(
          "http://localhost:5000/api/wallet/initialize",
          { 
            email: user.email, 
            amount: numAmount 
          },
          { 
            headers: { 
              Authorization: `Bearer ${token}` // Using the confirmed token here
            } 
          }
        );
        
        if (response.data.data?.authorization_url) {
          sessionStorage.setItem("pending_deposit", numAmount.toString());
          window.location.href = response.data.data.authorization_url;
        }
      } else {
        const res = await axios.post(
          "http://localhost:5000/api/wallet/withdraw",
          { amount: Number(amount), bankCode: selectedBank, accountNumber: accNumber },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        if (res.data.success) {
          toast.success("Withdrawal initiated!");
          setAmount("");
          fetchWalletData();
        }
      }
    } catch (err) {
      console.error("Action Error:", err.response);
      const message = err.response?.status === 401 
        ? "Session expired. Please log out and log back in." 
        : err.response?.data?.message || "Action failed";
      toast.error(message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mb-2" />
        <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">NaijaTrust Secure Sync...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <header className="mb-8">
          <h1 className="text-2xl font-black flex items-center gap-2 tracking-tight uppercase">
            <Wallet className="w-8 h-8 text-emerald-600" /> Wallet
          </h1>
        </header>

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <BalanceCard 
            label={userType === "client" ? "Available Funds" : "Ready to Withdraw"} 
            amount={walletStats.available} 
            icon={Wallet} 
            color="bg-emerald-50 text-emerald-600" 
            sub="Liquid Balance" 
          />
          <BalanceCard 
            label="In Escrow" 
            amount={walletStats.escrow} 
            icon={ShieldCheck} 
            color="bg-blue-50 text-blue-600" 
            sub="Secured Funds" 
          />
          <BalanceCard 
            label="Net Value" 
            amount={walletStats.available + walletStats.escrow} 
            icon={TrendingUp} 
            color="bg-slate-100 text-slate-600" 
            sub="Total Platform Equity" 
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* WITHDRAWAL/DEPOSIT FORM */}
          <div className="lg:col-span-1">
            <Card className="border-none shadow-sm overflow-hidden sticky top-8">
              <div className="h-1.5 bg-emerald-600 w-full" />
              <CardHeader>
                <CardTitle className="text-lg font-black uppercase tracking-tight">
                  {userType === "client" ? "Add Funds" : "Withdraw Payout"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAction} className="space-y-4">
                  {userType !== "client" && (
                    <>
                      <div className="space-y-1">
                        <Label className="text-[10px] font-black uppercase text-slate-400">Bank</Label>
                        <select 
                          value={selectedBank}
                          onChange={(e) => setSelectedBank(e.target.value)}
                          className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm outline-none"
                          required
                        >
                          <option value="">Choose Bank...</option>
                          {NIGERIAN_BANKS.map(bank => (
                            <option key={bank.code} value={bank.code}>{bank.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-[10px] font-black uppercase text-slate-400">Account Number</Label>
                        <Input 
                          maxLength={10}
                          value={accNumber}
                          onChange={(e) => setAccNumber(e.target.value.replace(/\D/g, ''))}
                          placeholder="0000000000"
                          className="rounded-xl h-11"
                        />
                        {isVerifyingName && <p className="text-[10px] animate-pulse text-emerald-600 font-bold">Verifying Account...</p>}
                        {verifiedName && (
                          <div className="p-2 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center gap-2">
                            <CheckCircle2 size={12} className="text-emerald-600" />
                            <p className="text-[10px] font-black text-emerald-800 uppercase leading-none">{verifiedName}</p>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-slate-400">Amount (₦)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">₦</span>
                      <Input 
                        type="number" 
                        className="pl-8 h-11 font-black rounded-xl" 
                        value={amount} 
                        onChange={(e) => setAmount(e.target.value)} 
                        required
                      />
                    </div>
                  </div>

                  {/* --- PAYOUT CALCULATOR UI --- */}
                  {userType !== "client" && amount > 0 && (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                      <div className="flex justify-between text-[11px] font-medium text-slate-500">
                        <span>Withdrawal Amount:</span>
                        <span>₦{parseFloat(amount).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-[11px] font-medium text-red-500">
                        <span className="flex items-center gap-1">Platform Fee (10%) <Info size={10}/></span>
                        <span>- ₦{feeDetails.platformFee.toLocaleString()}</span>
                      </div>
                      <div className="h-px bg-slate-200 w-full my-1" />
                      <div className="flex justify-between text-xs font-black text-slate-900">
                        <span>Final Take Home:</span>
                        <span className="text-emerald-600">₦{feeDetails.takeHome.toLocaleString()}</span>
                      </div>
                    </div>
                  )}

                  <Button 
                    disabled={isProcessing || (userType !== 'client' && !verifiedName)} 
                    type="submit" 
                    className="w-full h-12 bg-slate-900 hover:bg-black text-white font-black uppercase tracking-widest text-xs"
                  >
                    {isProcessing ? <Loader2 className="animate-spin" size={18} /> : (userType === "client" ? "Deposit" : "Withdraw Funds")}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* HISTORY LOG */}
          <div className="lg:col-span-2">
            <Card className="border-none shadow-sm min-h-[450px]">
              <CardHeader className="border-b bg-white">
                <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <History size={16}/> Activity History
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {walletStats.history.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {walletStats.history.map((t, idx) => (
                      <div key={t.id || idx} className="flex items-center justify-between p-5 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.status === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                            <ArrowUpFromLine size={18} className={t.description?.toLowerCase().includes('withdraw') ? 'rotate-180' : ''} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">{t.description}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">
                                {new Date(t.created_at).toLocaleDateString()} • {t.status}
                            </p>
                          </div>
                        </div>
                        <p className={`font-black text-sm ${t.status === 'success' ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {t.description?.toLowerCase().includes('withdraw') ? '-' : '+'}₦{parseFloat(t.amount).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-32 text-center text-slate-300">
                    <History size={48} className="mx-auto mb-4 opacity-10" />
                    <p className="font-bold uppercase text-[10px] tracking-widest">No transactions yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function BalanceCard({ label, amount, icon: Icon, color, sub }) {
  return (
    <Card className="border-none shadow-sm bg-white">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-2 rounded-xl ${color}`}><Icon size={18} /></div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
        </div>
        <h3 className="text-3xl font-black text-slate-900 tracking-tighter">
          ₦{parseFloat(amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </h3>
        <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tight">{sub}</p>
      </CardContent>
    </Card>
  );
}