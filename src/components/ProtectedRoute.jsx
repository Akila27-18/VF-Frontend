// src/components/ProtectedRoute.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { accessToken, isAuthenticated } = useContext(AuthContext);

  // while auth is undefined (not loaded yet), show loader
  if (accessToken === undefined) {
    return <div className="text-center mt-20">Checking auth...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
