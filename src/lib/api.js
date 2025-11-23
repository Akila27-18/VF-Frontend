import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const BASE_URL = "https://vf-backend-1.onrender.com";

// Core fetch function using token from AuthContext
export const useApi = () => {
  const { token } = useContext(AuthContext);

  const request = async (path, options = {}) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      };

      const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers,
      });

      const data = await res.json().catch(() => null);
      return { ok: res.ok, status: res.status, data };
    } catch (err) {
      return { ok: false, status: 0, data: { error: err.message } };
    }
  };

  return {
    get: (path) => request(path, { method: "GET" }),
    post: (path, body) => request(path, { method: "POST", body: JSON.stringify(body) }),
    put: (path, body) => request(path, { method: "PUT", body: JSON.stringify(body) }),
    delete: (path) => request(path, { method: "DELETE" }),
  };
};
