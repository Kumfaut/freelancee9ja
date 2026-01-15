"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { 
  Wallet, ArrowUpFromLine, TrendingUp, ShieldCheck, 
  History, Loader2, CheckCircle2 
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
  
  // States
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(true); 
  const [isProcessing, setIsProcessing] = useState(false);
  const [balance, setBalance] = useState({ available: 0, escrow: 0, totalLifeTime: 0 });
  const [transactions, setTransactions] = useState([]);

  // Withdrawal States
  const [selectedBank, setSelectedBank] = useState("");
  const [accNumber, setAccNumber] = useState("");
  const [verifiedName, setVerifiedName] = useState("");
  const [isVerifyingName, setIsVerifyingName] = useState(false);

  // Prevention Ref
  const hasVerified = useRef(false);

  const userType = user?.role || "freelancer";

  // --- 1. DATA FETCHING ---
  const fetchWalletData = useCallback(async () => {
    if (!user?.id || !user?.token) return;
    
    try {
      const response = await axios.get(
        `http://localhost:5000/api/wallet/status/${user.id}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      
      if (response.data.success) {
        console.log("DATA RECEIVED FROM BACKEND:", response.data);
        setBalance({
          available: parseFloat(response.data.balance || 0),
          escrow: parseFloat(response.data.escrow || 0),
          totalLifeTime: balance.totalLifeTime // Keep existing or update if API provides it
        });
        setTransactions(response.data.history || []);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, user?.token, balance.totalLifeTime]);

  // --- 2. PAYMENT VERIFICATION LOGIC ---
  const verifyPayment = useCallback(async (reference) => {
    if (hasVerified.current || !user?.token) return;
    hasVerified.current = true; 
    setIsProcessing(true);

    try {
      const res = await axios.post(
        `http://localhost:5000/api/wallet/verify-payment`,
        { reference, amount: Number(sessionStorage.getItem("pending_deposit")) },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      if (res.data.success) {
        toast.success("Deposit successful!");
        window.history.replaceState({}, document.title, window.location.pathname);
        sessionStorage.removeItem("pending_deposit");
        await fetchWalletData(); 
      }
    } catch (err) {
      console.error("Verification error:", err);
      toast.error(err.response?.data?.message || "Payment verification failed.");
      hasVerified.current = false;
    } finally {
      setIsProcessing(false);
      setIsLoading(false);
    }
  }, [user?.token, fetchWalletData]);

  // --- 3. EFFECTS ---
  
  // Initial Data Load & Payment Check
  useEffect(() => {
    if (!authLoading && user?.id) {
      const params = new URLSearchParams(window.location.search);
      const reference = params.get("reference");
  
      if (reference && !hasVerified.current) {
        verifyPayment(reference);
      } else {
        fetchWalletData();
      }
    } else if (!authLoading && !user) {
      setIsLoading(false);
    }
  }, [authLoading, user, fetchWalletData, verifyPayment]); 

  // Bank Account Verification
  useEffect(() => {
    let timer;
    const checkAccount = async () => {
      if (selectedBank && accNumber.length === 10) {
        setIsVerifyingName(true);
        try {
          const res = await axios.get(
            `http://localhost:5000/api/wallet/verify-account?accountNumber=${accNumber}&bankCode=${selectedBank}`,
            { headers: { Authorization: `Bearer ${user.token}` } }
          );
          if (res.data.success) setVerifiedName(res.data.accountName);
        } catch (err) {
          setVerifiedName("");
        } finally {
          setIsVerifyingName(false);
        }
      }
    };

    if (accNumber.length === 10 && user?.token) {
      timer = setTimeout(checkAccount, 500);
    } else {
      setVerifiedName("");
    }
    return () => clearTimeout(timer);
  }, [accNumber, selectedBank, user?.token]);

  // --- 4. HANDLERS ---
  const handleAction = async (e) => {
    e.preventDefault();
    if (isProcessing) return;
    if (!user?.token) return toast.error("Session expired.");

    const numAmount = Number(amount);
    if (!numAmount || numAmount < 100) return toast.error("Minimum amount is ₦100");

    setIsProcessing(true);

    try {
      if (userType === "client") {
        const response = await axios.post(
          "http://localhost:5000/api/wallet/initialize",
          { email: user.email, amount: numAmount },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        sessionStorage.setItem("pending_deposit", numAmount.toString());
        window.location.href = response.data.data.authorization_url;
      } else {
        if (!verifiedName) throw new Error("Please verify account details first");
        
        const res = await axios.post(
          "http://localhost:5000/api/wallet/withdraw",
          { amount: numAmount, bankCode: selectedBank, accountNumber: accNumber },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        if (res.data.success) {
          toast.success("Withdrawal successful!");
          setAmount("");
          setAccNumber("");
          fetchWalletData(); 
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Action failed");
    } finally {
      setIsProcessing(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mb-4" />
        <p className="text-slate-500 font-medium">Syncing Wallet...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 text-slate-900 font-sans">
      <div className="container mx-auto px-4 max-w-6xl">
        <header className="mb-8">
          <h1 className="text-2xl font-black flex items-center gap-2 uppercase tracking-tight">
            <Wallet className="w-8 h-8 text-emerald-600" />
            NaijaTrust Wallet
          </h1>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <BalanceCard 
            label={userType === "client" ? "Available Balance" : "Ready for Payout"} 
            amount={balance.available} 
            icon={Wallet} 
            color="bg-emerald-50 text-emerald-600" 
            sub="Withdrawable Funds" 
          />
          <BalanceCard 
            label="Escrow (Locked)" 
            amount={balance.escrow} 
            icon={ShieldCheck} 
            color="bg-blue-50 text-blue-600" 
            sub="Milestone Security" 
          />
          <BalanceCard 
            label="Lifetime Volume" 
            amount={balance.totalLifeTime} 
            icon={TrendingUp} 
            color="bg-slate-100 text-slate-600" 
            sub="Account History" 
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card className="border-none shadow-sm sticky top-8 overflow-hidden">
              <div className="h-1 bg-emerald-600 w-full" />
              <CardHeader>
                <CardTitle className="text-lg font-bold">
                  {userType === "client" ? "Add Funds" : "Withdraw Funds"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAction} className="space-y-4">
                  {userType !== "client" && (
                    <>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-slate-400">Bank</Label>
                        <select 
                          value={selectedBank}
                          onChange={(e) => setSelectedBank(e.target.value)}
                          className="w-full h-11 px-4 rounded-md border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500"
                          required
                        >
                          <option value="">Select Bank</option>
                          {NIGERIAN_BANKS.map(bank => (
                            <option key={bank.code} value={bank.code}>{bank.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-slate-400">Account Number</Label>
                        <Input 
                          type="text" 
                          maxLength={10}
                          value={accNumber}
                          onChange={(e) => setAccNumber(e.target.value.replace(/\D/g, ''))}
                          placeholder="10 Digits"
                          required
                        />
                        {isVerifyingName && <p className="text-[10px] animate-pulse text-emerald-600 font-bold">Verifying...</p>}
                        {verifiedName && (
                          <div className="mt-2 p-2 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center gap-2">
                            <CheckCircle2 size={14} className="text-emerald-600" />
                            <p className="text-[11px] font-black text-emerald-800 uppercase">{verifiedName}</p>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400">Amount (₦)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">₦</span>
                      <Input 
                        type="number" 
                        disabled={isProcessing}
                        className="pl-8 h-11 font-bold" 
                        value={amount} 
                        onChange={(e) => setAmount(e.target.value)} 
                        required
                      />
                    </div>
                  </div>

                  <Button 
                    disabled={isProcessing || (userType !== 'client' && !verifiedName)} 
                    type="submit" 
                    className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase"
                  >
                    {isProcessing ? <Loader2 className="animate-spin mr-2" size={18} /> : (userType === "client" ? "Deposit" : "Withdraw")}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="border-none shadow-sm min-h-[450px]">
              <CardHeader className="border-b">
                <CardTitle className="text-lg flex items-center gap-2 font-bold">
                    <History size={18}/> Activity History
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {transactions.length > 0 ? (
                  <div className="divide-y">
                    {transactions.map((t, idx) => (
                      <div key={t.id || idx} className="flex items-center justify-between p-5 hover:bg-slate-50">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.status === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                            <ArrowUpFromLine size={18} className={t.description?.toLowerCase().includes('withdraw') ? 'rotate-180' : ''} />
                          </div>
                          <div>
                            <p className="text-sm font-bold">{t.description || "Transaction"}</p>
                            <p className="text-[10px] text-slate-400 font-black uppercase">
                                {new Date(t.created_at).toLocaleDateString()} • {t.status}
                            </p>
                          </div>
                        </div>
                        <p className={`font-black ${t.status === 'success' ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {t.description?.toLowerCase().includes('withdraw') ? '-' : '+'}₦{parseFloat(t.amount).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-24 text-center text-slate-300">
                    <History size={48} className="mx-auto mb-4 opacity-20" />
                    <p className="font-bold uppercase text-xs tracking-widest">No transactions yet</p>
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
  // Convert to number and fallback to 0 if data is missing or invalid
  const displayAmount = parseFloat(amount || 0);

  return (
    <Card className="border-none shadow-sm relative overflow-hidden group">
      <CardContent className="p-6">
        <div className="flex justify-between mb-4">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
          <div className={`p-2 rounded-lg ${color}`}><Icon size={16} /></div>
        </div>
        <h3 className="text-2xl font-black text-slate-800">
          {/* toLocaleString ensures commas appear (e.g., 1,600.00) */}
          ₦{displayAmount.toLocaleString(undefined, { 
              minimumFractionDigits: 2,
              maximumFractionDigits: 2 
          })}
        </h3>
        <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">{sub}</p>
      </CardContent>
    </Card>
  );
}