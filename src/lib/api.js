const API_URL = import.meta.env.VITE_BACKEND_URL || "https://vf-backend-1.onrender.com";

// Get token from localStorage
const getToken = () => localStorage.getItem("token");

// Core fetch wrapper
const request = async (path, options = {}) => {
  try {
    const headers = {
      "Content-Type": "application/json",
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      ...options.headers,
    };

    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
    });

    let data = null;
    try {
      data = await res.json();
    } catch {
      // ignore JSON parse errors
    }

    return {
      ok: res.ok,
      status: res.status,
      data,
    };
  } catch (err) {
    console.error("API request failed:", err);
    return { ok: false, status: 500, data: null };
  }
};

// Convenient methods
const api = {
  get: (path, options) => request(path, { ...options, method: "GET" }),
  post: (path, body, options) =>
    request(path, { ...options, method: "POST", body: JSON.stringify(body) }),
  put: (path, body, options) =>
    request(path, { ...options, method: "PUT", body: JSON.stringify(body) }),
  delete: (path, options) => request(path, { ...options, method: "DELETE" }),
};

export default api;
