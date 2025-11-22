import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setSuccess("");

    const res = await api.post("/auth/signup", form);
    if (!res.ok) return setErr(res.data.error || "Signup failed");

    setSuccess("Account created! Redirecting to login...");
    setTimeout(() => navigate("/login"), 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={onSubmit} className="bg-white p-6 rounded shadow w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Sign up</h2>
        {err && <div className="text-red-600 mb-2">{err}</div>}
        {success && <div className="text-green-600 mb-2">{success}</div>}
        <input
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full mb-2 border rounded px-3 py-2"
        />
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
        <button className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600">
          Sign up
        </button>
      </form>
    </div>
  );
}
