import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function AuthSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      // Save the token to local storage
      localStorage.setItem("token", token);
      
      // Redirect to dashboard
      navigate("/dashboard");
    } else {
      // If no token is found, send back to login
      navigate("/login");
    }
  }, [searchParams, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        <p className="font-black uppercase tracking-widest text-[10px] text-slate-500">
          Syncing with Google...
        </p>
      </div>
    </div>
  );
}