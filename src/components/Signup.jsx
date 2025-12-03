import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../lib/api";

export default function Signup() {
const navigate = useNavigate();
const [formData, setFormData] = useState({ name: "", email: "", password: "" });
const [errors, setErrors] = useState({});
const [loading, setLoading] = useState(false);

// Handle input changes
const handleChange = (e) => {
setFormData({ ...formData, [e.target.name]: e.target.value });
setErrors({ ...errors, [e.target.name]: "" });
};

// Basic frontend validation
const validate = () => {
const newErrors = {};
if (!formData.name.trim()) newErrors.name = "Name is required";
if (!formData.email.trim()) newErrors.email = "Email is required";
else if (!/\S+@\S+.\S+/.test(formData.email)) newErrors.email = "Invalid email address";
if (!formData.password.trim()) newErrors.password = "Password is required";
return newErrors;
};

// Handle form submission
const handleSubmit = async (e) => {
e.preventDefault();
const validationErrors = validate();
if (Object.keys(validationErrors).length > 0) {
setErrors(validationErrors);
return;
}


try {
  setLoading(true);
  const response = await API.post("/auth/signup", formData);

  if (response.data?.token) {
    // Save token
    localStorage.setItem("token", response.data.token);
    // Redirect to dashboard
    navigate("/dashboard");
  } else {
    setErrors({ general: "Signup failed: token missing from response" });
  }
} catch (err) {
  console.error(err);
  setErrors({
    general: err.response?.data?.message || err.response?.data?.detail || "Signup failed",
  });
} finally {
  setLoading(false);
}


};

return ( <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4"> <h1 className="text-3xl font-bold mb-4">Sign Up</h1> <p className="text-gray-600 mb-6 text-center max-w-md">
Create your Vetri Finance account to start managing money together. </p>

```
  <form
    className="bg-white p-6 rounded-xl shadow-md w-full max-w-md flex flex-col gap-4"
    onSubmit={handleSubmit}
  >
    {errors.general && (
      <div className="bg-red-100 text-red-700 p-2 rounded text-center">
        {errors.general}
      </div>
    )}

    <input
      type="text"
      name="name"
      placeholder="Full Name"
      value={formData.name}
      onChange={handleChange}
      className={`border rounded-lg px-3 py-2 ${errors.name ? "border-red-500" : ""}`}
    />
    {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}

    <input
      type="email"
      name="email"
      placeholder="Email"
      value={formData.email}
      onChange={handleChange}
      className={`border rounded-lg px-3 py-2 ${errors.email ? "border-red-500" : ""}`}
    />
    {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}

    <input
      type="password"
      name="password"
      placeholder="Password"
      value={formData.password}
      onChange={handleChange}
      className={`border rounded-lg px-3 py-2 ${errors.password ? "border-red-500" : ""}`}
    />
    {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}

    <button
      type="submit"
      disabled={loading}
      className="px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition"
    >
      {loading ? "Signing up..." : "Sign Up"}
    </button>
  </form>
</div>


);
}
