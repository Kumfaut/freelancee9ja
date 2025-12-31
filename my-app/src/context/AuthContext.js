import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // 1. Initialize from localStorage immediately
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("nf_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      return null;
    }
  });

  // 2. Sync state with localStorage whenever the user object changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("nf_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("nf_user");
    }
  }, [user]);

  // 3. Robust Login function
  const login = (userData) => {
    // userData should be: { name: "...", role: "client/freelancer" }
    setUser(userData);
  };

  // 4. Clean Logout function
  const logout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      setUser(null);
      // Optional: Redirect to login page
      // window.location.href = "/login";
    }
  };

  // 5. Developer Helper: Quickly switch roles to test UI
  const toggleRole = () => {
    if (!user) return;
    const newRole = user.role === "client" ? "freelancer" : "client";
    setUser({ ...user, role: newRole });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoggedIn: !!user, // Helper boolean
      login, 
      logout, 
      toggleRole 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for easy access
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};