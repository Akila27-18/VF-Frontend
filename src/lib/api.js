// src/lib/api.js
import { useState, useEffect } from "react";

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}${endpoint}`, {
    ...options,
    headers,
  });

  let data;
  const contentType = res.headers.get("content-type");
  if (contentType?.includes("application/json")) data = await res.json();
  else data = await res.text();

  if (!res.ok) throw new Error(data?.error || data?.detail || res.statusText);
  return data;
}

// Hook for React components
export function useApi(endpoint) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    apiFetch(endpoint)
      .then((d) => mounted && setData(d))
      .catch((e) => mounted && setError(e));
    return () => (mounted = false);
  }, [endpoint]);

  return { data, error };
}
