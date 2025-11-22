import React, { useState } from "react";
import api from "../lib/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg(""); 
    setErr("");

    const res = await api.post("/auth/forgot-password", { email });
    if (!res.ok) return setErr(res.data.error || "Request failed");

    setMsg("Password reset instructions sent!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={onSubmit} className="bg-white p-6 rounded shadow w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Forgot Password</h2>
        {err && <div className="text-red-600 mb-2">{err}</div>}
        {msg && <div className="text-green-600 mb-2">{msg}</div>}
        <input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-2 border rounded px-3 py-2"
        />
        <button className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600">
          Submit
        </button>
      </form>
    </div>
  );
}
