import axios from "axios";

// Monolith: the backend serves this frontend, so in production build the API
// lives on the same origin at /api. In dev (npm run dev) it falls back to the
// backend on localhost:5000. Override with VITE_API_URL if needed.
const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? "/api" : "http://localhost:5000/api");

const api = axios.create({
  baseURL: API_URL,
});

export default api;
