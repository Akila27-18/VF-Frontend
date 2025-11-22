import React, { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../lib/api";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/landing";

  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      const res = await api.post("/auth/login", form);

      if (!res.ok) return setErr(res.data.error || "Login failed");
      if (!res.data.token) return setErr("Invalid server response");

      // Save token in context + localStorage
      login(res.data.token);

      // Navigate to previous page or landing
      navigate(from, { replace: true });
    } catch (error) {
      setErr("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={onSubmit}
        className="bg-white p-6 rounded shadow w-full max-w-md"
      >
        <h2 className="text-xl font-semibold mb-4">Login</h2>
        {err && <div className="text-red-600 mb-2">{err}</div>}
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full mb-2 border rounded px-3 py-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full mb-2 border rounded px-3 py-2"
        />
        <button className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 mb-2">
          Login
        </button>
        <p className="text-sm text-gray-600 text-center">
          Don't have an account?{" "}
          <Link to="/signup" className="text-orange-500 hover:underline">
            Sign up
          </Link>
        </p>
        <p className="text-sm text-gray-600 text-center mt-1">
          <Link to="/forgot-password" className="text-orange-500 hover:underline">
            Forgot password?
          </Link>
        </p>
      </form>
    </div>
  );
}
