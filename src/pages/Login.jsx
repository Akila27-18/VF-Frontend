import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../lib/api";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const res = await api.post("/auth/login", form);
      const data = await res.json();
      if (!res.ok) return setErr(data.error || "Login failed");
      login(data.token);
      navigate("/dashboard");
    } catch {
      setErr("Network error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={onSubmit} className="bg-white p-6 rounded shadow w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Login</h2>
        {err && <div className="text-red-600 mb-2">{err}</div>}
        <input name="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="w-full mb-2 border rounded px-3 py-2" placeholder="Email"/>
        <input type="password" name="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} className="w-full mb-2 border rounded px-3 py-2" placeholder="Password"/>
        <button className="w-full bg-orange-500 text-white py-2 rounded">Login</button>
      </form>
    </div>
  );
}
