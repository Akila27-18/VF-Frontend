import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../lib/api";

export default function ProtectedRoute({ children }) {
  const { token } = useContext(AuthContext);
  const [checking, setChecking] = useState(true);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function verify() {
      if (!token) {
        if (mounted) { setOk(false); setChecking(false); }
        return;
      }
      try {
        const res = await fetch(`${api.API_URL}/auth/verify-token`, { headers: { Authorization: `Bearer ${token}` } });
        if (!mounted) return;
        setOk(res.ok);
      } catch {
        setOk(false);
      } finally {
        if (mounted) setChecking(false);
      }
    }
    verify();
    return () => { mounted = false; };
  }, [token]);

  if (checking) return <div className="w-full h-screen flex items-center justify-center">Checking session...</div>;
  if (!ok) return <Navigate to="/login" replace />;
  return children;
}
