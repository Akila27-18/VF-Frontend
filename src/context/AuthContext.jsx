import React, { createContext, useState, useEffect } from "react";

// Create context
export const AuthContext = createContext();

// Provider component
export default function AuthProvider({ children }) {
  const [token, setToken] = useState(null);

  // Load token from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (stored) setToken(stored);
  }, []);

  // Login: store token in state and localStorage
  const login = (jwtToken) => {
    localStorage.setItem("token", jwtToken);
    setToken(jwtToken);
  };

  // Logout: clear token
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  // Check if authenticated
  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
