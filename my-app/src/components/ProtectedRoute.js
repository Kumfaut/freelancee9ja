import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRole }) {
  const { isLoggedIn, user, isLoading } = useAuth();

  // 1. If still checking localStorage, show nothing or a spinner
  if (isLoading) return null; 

  // 2. If not logged in, go to login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // 3. If logged in but wrong role (e.g. Freelancer trying to see Client Dash)
  if (allowedRole && user?.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  // 4. Everything is fine, show the page
  return children;
}