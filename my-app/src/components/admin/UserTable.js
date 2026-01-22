import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserTable = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRole, setFilterRole] = useState("all");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                // Change this:
                const res = await axios.get('http://localhost:5000/api/admin/users', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUsers(res.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
    }, []);

    const handleStatusChange = async (id, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`/api/admin/users/${id}/status`, 
                { newStatus }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUsers(users.map(user => 
                user.user_id === id ? { ...user, account_status: newStatus } : user
            ));
        } catch (error) {
            alert("Error updating user status");
        }
    };

    // Logic for Filtering and Searching
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === "all" || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
                
                <div className="flex gap-2 w-full md:w-auto">
                    {/* Search Input */}
                    <input 
                        type="text" 
                        placeholder="Search name or email..." 
                        className="border p-2 rounded-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    
                    {/* Role Filter */}
                    <select 
                        className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setFilterRole(e.target.value)}
                    >
                        <option value="all">All Roles</option>
                        <option value="client">Clients</option>
                        <option value="freelancer">Freelancers</option>
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                    <thead className="bg-gray-100">
                        <tr className="text-gray-600 text-sm uppercase">
                            <th className="px-4 py-3 text-left">Name</th>
                            <th className="px-4 py-3 text-left">Email</th>
                            <th className="px-4 py-3 text-left">Role</th>
                            <th className="px-4 py-3 text-left">Status</th>
                            <th className="px-4 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map(user => (
                                <tr key={user.id} className="border-b hover:bg-gray-50 transition">
                                    <td className="px-4 py-4 font-medium">{user.full_name}</td>
                                    <td className="px-4 py-4">{user.email}</td>
                                    <td className="px-4 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                            user.role === 'client' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                                        }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                            user.account_status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                            {user.account_status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <button 
                                            onClick={() => handleStatusChange(user.user_id, user.account_status)}
                                            className={`px-4 py-1 rounded text-sm font-semibold border ${
                                                user.account_status === 'active' 
                                                ? 'text-red-600 border-red-600 hover:bg-red-50' 
                                                : 'text-green-600 border-green-600 hover:bg-green-50'
                                            }`}
                                        >
                                            {user.account_status === 'active' ? 'Suspend' : 'Activate'}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center py-10 text-gray-500">No users found matching your criteria.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserTable;