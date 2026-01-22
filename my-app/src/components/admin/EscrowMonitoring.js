import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EscrowMonitoring = () => {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchEscrow = async () => {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/admin/transactions', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTransactions(res.data);
        };
        fetchEscrow();
    }, []);

    const handleRelease = async (id) => {
        if (!window.confirm("Are you sure you want to manually release these funds? This action cannot be undone.")) return;
        
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`/api/admin/transactions/${id}/release`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Refresh local state
            setTransactions(transactions.map(tx => 
                tx.id === id ? { ...tx, status: 'released' } : tx
            ));
        } catch (error) {
            alert("Error releasing funds");
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md mt-6 border border-gray-100">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Financial Oversight</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                        <tr>
                            <th className="px-4 py-3 text-left">Ref / Date</th>
                            <th className="px-4 py-3 text-left">Type</th>
                            <th className="px-4 py-3 text-left">Amount (₦)</th>
                            <th className="px-4 py-3 text-left">Status</th>
                            <th className="px-4 py-3 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {transactions.map(tx => (
                            <tr key={tx.id} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-3">
                                    <div className="font-mono text-xs text-blue-600">{tx.reference}</div>
                                    <div className="text-[10px] text-gray-400">{new Date(tx.created_at).toLocaleDateString()}</div>
                                </td>
                                <td className="px-4 py-3 capitalize">{tx.type}</td>
                                <td className="px-4 py-3 font-bold">₦{parseFloat(tx.amount).toLocaleString()}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                        tx.status === 'success' || tx.status === 'released' 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                        {tx.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    {tx.type === 'escrow' && tx.status !== 'released' && (
                                        <button 
                                            onClick={() => handleRelease(tx.id)}
                                            className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition"
                                        >
                                            Release
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EscrowMonitoring;