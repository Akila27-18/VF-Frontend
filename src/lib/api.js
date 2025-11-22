const BASE_URL = "https://vf-backend-1.onrender.com";

// Get token from localStorage
const getToken = () => localStorage.getItem("token");

// Core fetch function
const request = async (path, options = {}) => {
  try {
    // Merge headers: default + token + any passed headers
    const headers = {
      "Content-Type": "application/json",
      ...(getToken() && { Authorization: `Bearer ${getToken()}` }),
      ...options.headers,
    };

    // Fetch with merged options
    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers,
    });

    // Parse JSON response safely
    const data = await res.json().catch(() => null);

    return { ok: res.ok, status: res.status, data };
  } catch (err) {
    return { ok: false, status: 0, data: { error: err.message } };
  }
};

// API wrapper
const api = {
  get: (path) => request(path, { method: "GET" }),
  post: (path, body) =>
    request(path, { method: "POST", body: JSON.stringify(body) }),
  put: (path, body) =>
    request(path, { method: "PUT", body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: "DELETE" }),
};

export default api;
