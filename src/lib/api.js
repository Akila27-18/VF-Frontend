// src/api.js
const API_URL = import.meta.env.VITE_BACKEND_URL || "https://vf-backend-1.onrender.com";

/**
 * Generic fetch wrapper that includes JWT token if available.
 * @param {string} endpoint - API endpoint (e.g., "/auth/login/")
 * @param {object} options - fetch options (method, body, headers)
 * @returns {Promise<object>} JSON response
 */
export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const defaultHeaders = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  });

  const contentType = res.headers.get("content-type");
  let data;
  if (contentType && contentType.includes("application/json")) {
    data = await res.json();
  } else {
    data = await res.text();
  }

  if (!res.ok) {
    const errorMsg = data?.detail || data?.error || res.statusText;
    throw new Error(errorMsg || "API request failed");
  }

  return data;
}
