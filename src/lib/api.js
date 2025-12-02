import axios from "axios";

const API = axios.create({
  baseURL: "https://vf-backend-2.onrender.com/api", 
  timeout: 10000,
  withCredentials: true,
});

export default API;
