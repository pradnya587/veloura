import axios from "axios";

// Point this at your deployed backend URL in production (e.g. via a .env file
// with VITE_API_URL=https://your-api.onrender.com/api)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
});

export default api;
