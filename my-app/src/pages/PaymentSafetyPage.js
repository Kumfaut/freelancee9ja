import React from "react";
import { Card, CardContent } from "../components/ui/Card";
import { ShieldCheck, Lock, Landmark, RefreshCw } from "lucide-react";
import { Badge } from "../components/ui/Badge";

export default function PaymentSafetyPage() {
  const safetyFeatures = [
    {
      icon: <Lock className="w-8 h-8 text-emerald-600" />,
      title: "Secure Escrow",
      desc: "Funds are held by NaijaFreelance and only released when you approve the work."
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-blue-600" />,
      title: "Verified Partners",
      desc: "We use Paystack and Flutterwave, the most secure payment gateways in Nigeria."
    },
    {
      icon: <RefreshCw className="w-8 h-8 text-orange-600" />,
      title: "Dispute Resolution",
      desc: "If something goes wrong, our local team steps in to mediate fairly."
    }
  ];

  return (
    <div className="min-h-screen bg-white py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Safe & Secure</Badge>
          <h1 className="text-4xl font-bold mb-4">Payment Protection</h1>
          <p className="text-xl text-slate-600">How we keep your money safe from start to finish.</p>
        </div>

        <div className="grid gap-8 mb-16">
          {safetyFeatures.map((f, i) => (
            <Card key={i} className="border-none shadow-none bg-slate-50">
              <CardContent className="flex items-start gap-6 p-8">
                <div className="p-3 bg-white rounded-xl shadow-sm">{f.icon}</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{f.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-emerald-900 rounded-2xl p-8 text-center text-white">
          <Landmark className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <h2 className="text-2xl font-bold mb-2">Withdraw to Any Nigerian Bank</h2>
          <p className="opacity-80 mb-6">Process withdrawals directly to your local Naira account within 24 hours.</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Badge variant="outline" className="text-white border-white/20">GTBank</Badge>
            <Badge variant="outline" className="text-white border-white/20">Zenith</Badge>
            <Badge variant="outline" className="text-white border-white/20">Access</Badge>
            <Badge variant="outline" className="text-white border-white/20">Kuda</Badge>
            <Badge variant="outline" className="text-white border-white/20">OPay</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}