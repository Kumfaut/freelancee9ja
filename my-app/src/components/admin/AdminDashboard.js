import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StatCards from './StatCards';
import UserTable from './UserTable';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ totalUsers: 0, pendingJobs: 0, escrowVolume: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/admin/stats', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(res.data);
            } catch (err) {
                console.error("Failed to fetch stats");
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="p-8 bg-slate-50 min-h-screen">
            <h1 className="text-3xl font-bold text-slate-900 mb-8">Platform Overview</h1>
            
            <StatCards stats={stats} />
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <h2 className="text-xl font-bold mb-6">Recent Users</h2>
                <UserTable />
            </div>
        </div>
    );
};

export default AdminDashboard;