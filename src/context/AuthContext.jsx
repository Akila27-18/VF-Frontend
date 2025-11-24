// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(undefined); // undefined until loaded
  const [refreshToken, setRefreshToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const a = localStorage.getItem("accessToken");
    const r = localStorage.getItem("refreshToken");
    const u = localStorage.getItem("user");
    setAccessToken(a ?? null);
    setRefreshToken(r ?? null);
    setUser(u ? JSON.parse(u) : null);
  }, []);

  const login = (access, refresh, userObj = null) => {
    if (access) {
      localStorage.setItem("accessToken", access);
      setAccessToken(access);
    }
    if (refresh) {
      localStorage.setItem("refreshToken", refresh);
      setRefreshToken(refresh);
    }
    if (userObj) {
      localStorage.setItem("user", JSON.stringify(userObj));
      setUser(userObj);
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
  };

  const isAuthenticated = !!accessToken;

  return (
    <AuthContext.Provider value={{ accessToken, refreshToken, user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
