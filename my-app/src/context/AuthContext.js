import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        const savedUser = localStorage.getItem("nf_user");

        if (token && savedUser) {
          const parsedUser = JSON.parse(savedUser);
          // 1. Set the initial state from local storage so UI loads fast
          setUser({ ...parsedUser, token });

          // 2. OPTIONAL BUT RECOMMENDED: Fetch latest profile from DB
          // This solves the "Email not found" issue if the local storage is incomplete
          try {
            const res = await fetch("http://localhost:5000/api/auth/me", {
              headers: { Authorization: `Bearer ${token}` }
            });
            const latestData = await res.json();
            if (latestData.success) {
               // Update state and storage with fresh DB data (email, role, etc.)
               const updatedUser = { ...latestData.user, token };
               setUser(updatedUser);
               localStorage.setItem("nf_user", JSON.stringify(latestData.user));
            }
          } catch (fetchErr) {
            console.warn("Could not sync profile, using cached data.");
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("nf_user", JSON.stringify(userData));
    setUser({ ...userData, token });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("nf_user");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser, // 👈 ADD THIS LINE
      isLoggedIn: !!user, 
      loading, 
      login, 
      logout 
    }}>
      {loading ? (
        <div className="h-screen flex items-center justify-center">
          <p className="animate-pulse text-slate-500 font-bold">Initializing Secure Session...</p>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);