const API_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000";

const getToken = () => localStorage.getItem("token");

const api = {
  get: async (path) => {
    const res = await fetch(`${API_URL}${path}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    const data = await res.json();
    return { ok: res.ok, status: res.status, data };
  },

  post: async (path, body) => {
    const res = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return { ok: res.ok, status: res.status, data };
  },

  put: async (path, body) => {
    const res = await fetch(`${API_URL}${path}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return { ok: res.ok, status: res.status, data };
  },

  delete: async (path) => {
    const res = await fetch(`${API_URL}${path}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    const data = await res.json();
    return { ok: res.ok, status: res.status, data };
  },
};

export default api;
