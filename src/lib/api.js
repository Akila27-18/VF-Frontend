// src/lib/api.js
const API_URL = import.meta.env.VITE_BACKEND_URL;

export async function apiFetch(endpoint, options = {}) {
  // Always use access token for API requests
  const accessToken = localStorage.getItem("accessToken");

  const headers = {
    "Content-Type": "application/json",
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const contentType = res.headers.get("content-type");
  let data;
  if (contentType && contentType.includes("application/json")) {
    data = await res.json();
  } else {
    data = await res.text();
  }

  if (!res.ok) {
    const err = data?.detail || data?.error || res.statusText || "API request failed";
    throw new Error(err);
  }

  return data;
}
