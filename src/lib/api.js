import axios from "axios";

// Use environment variable for backend API
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api", // e.g., https://vf-backend.onrender.com/api
  timeout: 10000,
  withCredentials: true, // include cookies if needed
});

export default API;
