import React, { useState } from 'react';
import API from '../api/api';
import { ShieldCheck, Loader2 } from 'lucide-react';

export default function NINVerification() {
  const [nin, setNin] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("idle"); // idle, success, error

  const handleVerify = async () => {
    setLoading(true);
    try {
      // Calling the mock route we discussed earlier
      await API.post("/users/verify-nin", { nin_number: nin });
      setStatus("success");
    } catch (err) {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <ShieldCheck className="text-blue-600" />
        <h3 className="font-bold text-slate-900">Verify Identity (NIMC)</h3>
      </div>
      
      {status === "success" ? (
        <p className="text-emerald-600 font-bold text-sm">✓ Identity Verified!</p>
      ) : (
        <div className="flex flex-col gap-3">
          <input 
            type="text" 
            placeholder="Enter 11-digit NIN" 
            className="bg-slate-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500"
            value={nin}
            onChange={(e) => setNin(e.target.value)}
          />
          <button 
            onClick={handleVerify}
            disabled={loading || nin.length < 11}
            className="bg-blue-600 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-widest disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin mx-auto" size={16} /> : "Verify with NIMC"}
          </button>
        </div>
      )}
    </div>
  );
}