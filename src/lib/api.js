// src/lib/api.js

const raw = import.meta.env.VITE_BACKEND_URL || "https://vf-backend-1.onrender.com";
export const API_URL = raw.replace(/\/$/, ""); // remove trailing slash

export async function apiFetch(endpoint, options = {}) {
  const accessToken = localStorage.getItem("accessToken");

  // Endpoints that don’t require authentication
  const noAuthEndpoints = [
    "/auth/login/",
    "/auth/signup/",
    "/auth/refresh/",
    "/auth/password-reset/"
  ];

  const isNoAuth = noAuthEndpoints.some((p) => endpoint.startsWith(p));

  // Combine headers
  const headers = {
    "Content-Type": "application/json",
    ...(accessToken && !isNoAuth ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...(options.headers || {}),
  };

  // Normalize URL: ensure leading slash, remove trailing slash
  const normalizedEndpoint = `${endpoint.startsWith("/") ? "" : "/"}${endpoint.replace(/\/$/, "")}`;
  const url = `${API_URL}${normalizedEndpoint}/`;

  let res;
  try {
    res = await fetch(url, { ...options, headers });
  } catch (err) {
    throw new Error("Network error: " + err.message);
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
    const msg =
      data?.detail ||
      data?.error ||
      data?.message ||
      res.statusText ||
      "API request failed";
    throw new Error(msg);
  }

  return data;
}
