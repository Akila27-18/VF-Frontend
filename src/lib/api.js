// src/lib/api.js
const raw = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
export const API_URL = raw.replace(/\/$/, ""); // remove trailing slash

export async function apiFetch(endpoint, options = {}) {
  const accessToken = localStorage.getItem("accessToken");

  // endpoints that do not require Authorization
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

  // Ensure endpoint ends with slash
  const url = `${API_URL}${endpoint.endsWith("/") ? endpoint : endpoint + "/"}`;

  const res = await fetch(url, {
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
    const errMsg =
      data?.detail ||
      data?.error ||
      data?.message ||
      res.statusText ||
      "API request failed";
    throw new Error(errMsg);
  }

  return data;
}
