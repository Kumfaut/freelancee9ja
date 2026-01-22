import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // You may need to install this: npm install jwt-decode

const AdminProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/admin/login" />;
    }

    try {
        const decoded = jwtDecode(token);
        // Check if the role in the token is 'admin'
        if (decoded.role !== 'admin') {
            alert("Access denied. Admins only.");
            return <Navigate to="/" />;
        }
    } catch (error) {
        return <Navigate to="/admin/login" />;
    }

    return children;
};

export default AdminProtectedRoute;