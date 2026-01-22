import React from "react";
import { ShieldCheck, Info, AlertCircle, X } from "lucide-react";
import { Card, CardContent } from "./ui/Card";
import { Button } from "./ui/Button";

export default function FundingSummaryModal({ isOpen, onClose, onConfirm, amount, title }) {
  if (!isOpen) return null;

  const platformFee = amount * 0.10;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white border-none shadow-2xl overflow-hidden">
        <div className="bg-emerald-600 p-4 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} />
            <h3 className="font-bold uppercase tracking-tight text-sm">Escrow Secure Funding</h3>
          </div>
          <button onClick={onClose} className="hover:rotate-90 transition-transform">
            <X size={20} />
          </button>
        </div>

        <CardContent className="p-6">
          <div className="text-center mb-6">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Deposit Amount</p>
            <h2 className="text-4xl font-black text-slate-900">₦{Number(amount).toLocaleString()}</h2>
            <p className="text-emerald-600 text-xs font-bold mt-1">Milestone: {title}</p>
          </div>

          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-6 text-slate-900">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Escrow Service Fee</span>
              <span className="font-bold">₦0.00 (Standard)</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Freelancer Payout (Net)</span>
              <span className="font-bold">₦{(amount - platformFee).toLocaleString()}</span>
            </div>
            <div className="h-px bg-slate-200 w-full" />
            <div className="flex justify-between text-base font-black">
              <span>Total Charge</span>
              <span>₦{Number(amount).toLocaleString()}</span>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex gap-3">
              <div className="mt-1 flex-shrink-0"><AlertCircle size={16} className="text-blue-500" /></div>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>Escrow Policy:</strong> NaijaTrust will hold these funds in a secure account. Money is only released to the freelancer once you click <strong>"Approve"</strong>.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="mt-1 flex-shrink-0"><Info size={16} className="text-blue-500" /></div>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>Refunds:</strong> If the work is not completed, you can open a dispute to request a refund.
              </p>
            </div>
          </div>

          <Button 
            onClick={onConfirm}
            className="w-full h-14 bg-slate-900 hover:bg-black text-white font-black uppercase tracking-widest text-sm rounded-xl shadow-lg"
          >
            Confirm & Pay via Paystack
          </Button>
          
          <p className="text-[10px] text-center text-slate-400 mt-4 uppercase font-bold tracking-tighter">
            Secured by AES-256 Encryption & Paystack
          </p>
        </CardContent>
      </Card>
    </div>
  );
}