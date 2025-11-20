import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(""); setSuccess("");
    try {
      const res = await api.post("/auth/signup", { email: form.email, password: form.password, name: form.name });
      const data = await res.json();
      if (!res.ok) return setErr(data.error || "Signup failed");
      setSuccess("Account created — redirecting to login...");
      setTimeout(() => navigate("/login"), 1200);
    } catch {
      setErr("Network error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={onSubmit} className="bg-white p-6 rounded shadow w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Sign up</h2>
        {err && <div className="text-red-600 mb-2">{err}</div>}
        {success && <div className="text-green-600 mb-2">{success}</div>}
        <input placeholder="Full name" className="w-full mb-2 border rounded px-3 py-2" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
        <input placeholder="Email" className="w-full mb-2 border rounded px-3 py-2" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
        <input type="password" placeholder="Password" className="w-full mb-2 border rounded px-3 py-2" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/>
        <button className="w-full bg-orange-500 text-white py-2 rounded">Sign up</button>
      </form>
    </div>
  );
}
