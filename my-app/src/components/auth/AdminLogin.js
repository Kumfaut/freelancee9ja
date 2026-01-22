import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/auth/login', { email, password });
            
            // Check if user is actually an admin
            if (res.data.user.role !== 'admin') {
                alert("Access Denied: You are not an administrator.");
                return;
            }

            localStorage.setItem('token', res.data.token);
            navigate('/admin/dashboard');
        } catch (error) {
            alert("Login failed. Please check your credentials.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900">
            <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center text-slate-800">Admin Control Portal</h1>
                <div className="space-y-4">
                    <input 
                        type="email" placeholder="Admin Email" required
                        className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input 
                        type="password" placeholder="Password" required
                        className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700">
                        Authorize Access
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminLogin;