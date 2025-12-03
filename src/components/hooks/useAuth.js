import { useState } from "react";
import API from "./api";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const signup = async (username, password) => {
    try {
      const res = await API.post("/signup/", { username, password });
      localStorage.setItem("token", res.data.token);
      setUser({ username: res.data.username });
      setError(null);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed");
      return null;
    }
  };

  const login = async (username, password) => {
    try {
      const res = await API.post("/login/", { username, password });
      localStorage.setItem("token", res.data.token);
      setUser({ username: res.data.username });
      setError(null);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
      return null;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return { user, error, signup, login, logout };
}
