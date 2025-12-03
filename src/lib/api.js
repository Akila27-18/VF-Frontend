import axios from "axios";

const API_BASE = "https://vf-backend-2.onrender.com/api"; // Django backend

const API = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  withCredentials: true,
});

// Attach token automatically if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
