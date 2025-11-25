// src/lib/api.js
const raw = import.meta.env.VITE_BACKEND_URL || "https://vf-backend-1.onrender.com";
export const API_URL = raw.replace(/\/$/, ""); // remove trailing slash

export async function apiFetch(endpoint, options = {}) {
  const accessToken = localStorage.getItem("accessToken");

  const noAuthEndpoints = [
    "/auth/login/",
    "/auth/signup/",
    "/auth/refresh/",
    "/auth/password-reset/"
  ];

  const isNoAuth = noAuthEndpoints.some(p => endpoint.startsWith(p));

  const headers = {
    "Content-Type": "application/json",
    ...(accessToken && !isNoAuth ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...(options.headers || {})
  };

  const url = `${API_URL}${endpoint.endsWith("/") ? endpoint : endpoint + "/"}`;

  let res;
  try {
    res = await fetch(url, { ...options, headers });
  } catch (networkErr) {
    throw new Error("Network error: " + networkErr.message);
  }

  const contentType = res.headers.get("content-type");
  let data = null;

  try {
    if (res.status !== 204 && contentType?.includes("application/json")) {
      data = await res.json();
    } else if (res.status !== 204) {
      data = await res.text();
    }
  } catch {
    data = null;
  }

  if (!res.ok) {
    const errMsg = data?.detail || data?.error || data?.message || res.statusText || "API request failed";
    throw new Error(errMsg);
  }

  return data;
}
