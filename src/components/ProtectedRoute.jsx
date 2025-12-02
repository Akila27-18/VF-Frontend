import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import API from "../lib/api";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthed(false);
        setLoading(false);
        return;
      }

      try {
        // Optional: verify token with backend
        await API.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsAuthed(true);
      } catch (err) {
        console.error("Token invalid or expired", err);
        localStorage.removeItem("token");
        setIsAuthed(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  if (!isAuthed) return <Navigate to="/login" replace />;

  return children;
}
