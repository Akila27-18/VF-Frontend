// src/components/ProtectedRoute.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { accessToken, isAuthenticated } = useContext(AuthContext);

  // Show loader while auth state is being determined
  if (accessToken === undefined) {
    return (
      <div className="text-center mt-20 text-gray-500">
        Checking authentication...
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render protected content
  return children;
}
