// src/pages/Signup.jsx
import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiFetch } from "../lib/api";
import { AuthContext } from "../context/AuthContext";

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const data = await apiFetch("/auth/signup/", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      // backend returns { access, refresh, email }
      login(data.access, data.refresh, { email: data.email || email });
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">Create Account</h1>
      {error && <div className="text-red-500 mb-3">{error}</div>}
      <form className="space-y-3" onSubmit={handleSubmit}>
        <input className="w-full border p-2 rounded" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="w-full border p-2 rounded" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <input className="w-full border p-2 rounded" type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        <button className="w-full bg-orange-500 text-white py-2 rounded" type="submit" disabled={loading}>
          {loading ? "Creating..." : "Sign Up"}
        </button>
      </form>
      <div className="mt-4 text-center">
        <Link to="/login" className="text-orange-500 hover:underline">Already have an account? Log in</Link>
      </div>
    </div>
  );
}
