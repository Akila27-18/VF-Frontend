const API_URL = import.meta.env.VITE_BACKEND_URL || "https://vf-backend-1.onrender.com";

const getToken = () => localStorage.getItem("token");

const request = async (path, options = {}) => {
  try {
    const headers = {
      "Content-Type": "application/json",
      ...(getToken() && { Authorization: `Bearer ${getToken()}` }),
      ...options.headers,
    };

    const res = await fetch(`${API_URL}${path}`, { ...options, headers });
    const data = await res.json().catch(() => null); // safely parse JSON
    return { ok: res.ok, status: res.status, data };
  } catch (error) {
    console.error("API request error:", error);
    return { ok: false, status: 0, data: { error: "Network error" } };
  }
};

const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: "POST", body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: "PUT", body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: "DELETE" }),
};

export default api;
