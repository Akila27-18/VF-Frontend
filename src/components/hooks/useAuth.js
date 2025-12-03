import { useState, useEffect } from "react";
import API from "./api";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // On mount, check for token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      API.get("/auth/me")
        .then((res) => setUser(res.data.user))
        .catch(() => localStorage.removeItem("token"));
    }
  }, []);

  const signup = async (email, password) => {
    setLoading(true);
    try {
      const res = await API.post("/auth/signup", { email, password });
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      setError(null);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      setError(null);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return { user, error, loading, signup, login, logout };
}
