import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../lib/api";

export default function Login() {
const navigate = useNavigate();
const [formData, setFormData] = useState({ email: "", password: "" });
const [errors, setErrors] = useState({});
const [loading, setLoading] = useState(false);

const handleChange = (e) => {
setFormData({ ...formData, [e.target.name]: e.target.value });
setErrors({ ...errors, [e.target.name]: "" });
};

const validate = () => {
const newErrors = {};
if (!formData.email.trim()) newErrors.email = "Email is required";
else if (!/\S+@\S+.\S+/.test(formData.email)) newErrors.email = "Invalid email address";
if (!formData.password.trim()) newErrors.password = "Password is required";
return newErrors;
};

const handleSubmit = async (e) => {
e.preventDefault();
const validationErrors = validate();
if (Object.keys(validationErrors).length > 0) {
setErrors(validationErrors);
return;
}


try {
  setLoading(true);
  const response = await API.post("/auth/login", formData);

  if (response.data?.token) {
    localStorage.setItem("token", response.data.token);
    navigate("/dashboard");
  } else {
    setErrors({ general: "Login failed: token missing from response" });
  }
} catch (err) {
  console.error(err);
  setErrors({
    general: err.response?.data?.message || err.response?.data?.detail || "Login failed",
  });
} finally {
  setLoading(false);
}


};

return ( <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4"> <h1 className="text-3xl font-bold mb-4">Welcome Back</h1> <p className="text-gray-600 mb-6 text-center max-w-md">
Log in to access your Vetri Finance dashboard. </p>

```
  <form
    onSubmit={handleSubmit}
    className="bg-white p-6 rounded-xl shadow-md w-full max-w-md flex flex-col gap-4"
  >
    {errors.general && (
      <div className="bg-red-100 text-red-700 p-2 rounded text-center">
        {errors.general}
      </div>
    )}

    <input
      type="email"
      name="email"
      placeholder="Email address"
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
      {loading ? "Logging in..." : "Login"}
    </button>

    <div className="flex justify-between text-sm mt-1">
      <Link to="/signup" className="text-orange-500 hover:underline">
        Not registered? Sign up
      </Link>
      <Link to="/forgot-password" className="text-gray-600 hover:underline">
        Forgot password?
      </Link>
    </div>
  </form>
</div>


);
}
