import React from 'react';
import { Users, Briefcase, ShieldCheck } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon className="text-white w-6 h-6" />
    </div>
    <div>
      <p className="text-sm text-slate-500 font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
    </div>
  </div>
);

const StatCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatCard 
        title="Total Users" 
        value={stats.totalUsers} 
        icon={Users} 
        color="bg-blue-600" 
      />
      <StatCard 
        title="Pending Moderation" 
        value={stats.pendingJobs} 
        icon={Briefcase} 
        color="bg-orange-500" 
      />
      <StatCard 
        title="Escrow Volume" 
        value={`₦${Number(stats.escrowVolume).toLocaleString()}`} 
        icon={ShieldCheck} 
        color="bg-emerald-600" 
      />
    </div>
  );
};

export default StatCards;