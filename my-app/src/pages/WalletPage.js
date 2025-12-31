"use client";

import React, { useState } from "react";
import { 
  Wallet, ArrowDownToLine, ArrowUpFromLine, 
  TrendingUp, Download,  Loader2, ShieldCheck 
} from "lucide-react";

import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/Tabs";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/Select";
import { toast } from "sonner";

export default function WalletPage() {
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isAccountVerified, setIsAccountVerified] = useState(false);
  const [accountDetails, setAccountDetails] = useState({ number: "", bank: "", name: "" });

  // Mock Data
  const walletBalance = {
    available: 856000,
    pending: 450000,
    totalEarned: 12450000,
    withdrawn: 11594000
  };

  const transactions = [
    { id: 1, type: "credit", description: "UI Design - Milestone 1", amount: 250000, status: "completed", date: "Nov 20, 2024", method: "Escrow Release" },
    { id: 2, type: "debit", description: "Withdrawal to GTBank", amount: 500000, status: "completed", date: "Nov 18, 2024", method: "Bank Transfer" },
    { id: 3, type: "credit", description: "Mobile App Logo", amount: 45000, status: "pending", date: "Nov 21, 2024", method: "Escrow" },
  ];

  // Logic: Simulate Paystack Account Resolution
  const handleVerifyBank = () => {
    if (accountDetails.number.length !== 10) {
      toast.error("Please enter a valid 10-digit NUBAN");
      return;
    }
    setIsVerifying(true);
    
    // Simulate API call to Paystack Resolve Account
    setTimeout(() => {
      setIsVerifying(false);
      setIsAccountVerified(true);
      setAccountDetails(prev => ({ ...prev, name: "ADEBAYO OLUWASEUN" }));
      toast.success("Bank account verified successfully!");
    }, 2000);
  };

  const handleWithdraw = (e) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);
    
    if (!isAccountVerified) {
      toast.error("Please verify your bank account first");
      return;
    }
    if (!amount || amount < 5000) {
      toast.error("Minimum withdrawal is ₦5,000");
      return;
    }
    if (amount > walletBalance.available) {
      toast.error("Insufficient available balance");
      return;
    }

    toast.success(`₦${amount.toLocaleString()} payout initiated to ${accountDetails.name}`);
    setWithdrawAmount("");
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Wallet className="w-8 h-8 text-emerald-600" />
              NaijaTrust Wallet
            </h1>
            <p className="text-slate-500 text-sm font-medium">Manage your earnings and secure payouts</p>
          </div>
          <Button variant="outline" className="border-slate-200 bg-white shadow-sm">
            <Download className="w-4 h-4 mr-2" /> Export History
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <BalanceCard label="Available" amount={walletBalance.available} icon={Wallet} color="text-emerald-600" sub="Ready to Payout" />
          <BalanceCard label="In Escrow" amount={walletBalance.pending} icon={ShieldCheck} color="text-blue-600" sub="Active Projects" />
          <BalanceCard label="Lifetime" amount={walletBalance.totalEarned} icon={TrendingUp} color="text-slate-600" sub="Total Revenue" />
          <BalanceCard label="Withdrawn" amount={walletBalance.withdrawn} icon={ArrowDownToLine} color="text-purple-600" sub="Success Payouts" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-1 space-y-6">
            {/* Bank Verification Section */}
            <Card className="border-none shadow-sm overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-400">Payout Destination</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isAccountVerified ? (
                  <div className="space-y-3">
                    <Select onValueChange={(val) => setAccountDetails({...accountDetails, bank: val})}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select Bank" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gtb">GTBank</SelectItem>
                        <SelectItem value="zenith">Zenith Bank</SelectItem>
                        <SelectItem value="kuda">Kuda Bank</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input 
                      placeholder="Account Number (NUBAN)" 
                      maxLength={10}
                      value={accountDetails.number}
                      onChange={(e) => setAccountDetails({...accountDetails, number: e.target.value})}
                      className="h-11"
                    />
                    <Button 
                      onClick={handleVerifyBank} 
                      className="w-full bg-slate-900"
                      disabled={isVerifying}
                    >
                      {isVerifying ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Verify Account"}
                    </Button>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 relative group">
                    <p className="text-[10px] font-black text-emerald-600 uppercase">Verified Account</p>
                    <p className="font-bold text-slate-900 mt-1">{accountDetails.name}</p>
                    <p className="text-xs text-slate-500">{accountDetails.number} • {accountDetails.bank.toUpperCase()}</p>
                    <button 
                      onClick={() => setIsAccountVerified(false)}
                      className="absolute top-4 right-4 text-[10px] font-bold text-slate-400 hover:text-red-500"
                    >
                      CHANGE
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Withdrawal Form */}
            <Card className="border-none shadow-sm opacity-100 transition-opacity">
              <CardHeader>
                <CardTitle className="text-lg">Request Payout</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleWithdraw} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="font-bold text-slate-700">Amount to Withdraw</Label>
                    <div className="relative">
                       <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₦</span>
                       <Input
                        type="number"
                        className="pl-8 h-12 text-lg font-black"
                        placeholder="0"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        disabled={!isAccountVerified}
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 font-bold shadow-lg shadow-emerald-100"
                    disabled={!isAccountVerified}
                  >
                    Withdraw to Bank
                  </Button>
                  <p className="text-[10px] text-center text-slate-400">
                    Funds usually arrive within 10-30 minutes.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* History Area */}
          <div className="lg:col-span-2">
            <Card className="border-none shadow-sm min-h-[550px]">
              <CardHeader className="border-b border-slate-50 pb-0">
                <Tabs defaultValue="all" className="w-full">
                  <div className="flex items-center justify-between mb-4">
                    <CardTitle className="text-lg">Activity</CardTitle>
                    <TabsList className="bg-slate-100 h-9 p-1">
                      <TabsTrigger value="all" className="text-xs px-4">All</TabsTrigger>
                      <TabsTrigger value="credit" className="text-xs px-4">Income</TabsTrigger>
                      <TabsTrigger value="debit" className="text-xs px-4">Payouts</TabsTrigger>
                    </TabsList>
                  </div>

                  {["all", "credit", "debit"].map((tab) => (
                    <TabsContent key={tab} value={tab} className="mt-0">
                      <div className="divide-y divide-slate-50">
                        {transactions
                          .filter(t => tab === "all" || t.type === tab)
                          .map((t) => (
                            <TransactionRow key={t.id} t={t} />
                          ))}
                        {/* Empty State if no transactions */}
                        {transactions.filter(t => tab === "all" || t.type === tab).length === 0 && (
                          <div className="py-20 text-center text-slate-400 text-sm">
                            No activities found for this period.
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component for Balance Stats
function BalanceCard({ label, amount, icon: Icon, color, sub }) {
  return (
    <Card className="border-none shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
          <div className={`p-2 rounded-lg bg-slate-50 ${color}`}>
            <Icon className="w-4 h-4" />
          </div>
        </div>
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">
          ₦{amount.toLocaleString()}
        </h3>
        <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">{sub}</p>
      </CardContent>
    </Card>
  );
}

// Component for Transaction Rows
function TransactionRow({ t }) {
  const isCredit = t.type === "credit";
  return (
    <div className="flex items-center justify-between p-6 hover:bg-slate-50/50 transition-colors cursor-pointer">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          isCredit ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-600"
        }`}>
          {isCredit ? <ArrowUpFromLine className="w-5 h-5" /> : <ArrowDownToLine className="w-5 h-5" />}
        </div>
        <div>
          <p className="text-sm font-bold text-slate-800">{t.description}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-[10px] text-slate-400 font-bold uppercase">{t.method}</p>
            <span className="text-slate-200">•</span>
            <p className="text-[10px] text-slate-400 font-bold">{t.date}</p>
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-sm font-black ${isCredit ? "text-emerald-600" : "text-slate-900"}`}>
          {isCredit ? "+" : "-"} ₦{t.amount.toLocaleString()}
        </p>
        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
          t.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
        }`}>
          {t.status.toUpperCase()}
        </span>
      </div>
    </div>
  );
}