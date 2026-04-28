import axios from "axios";

export const baseURL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/";

export const api = axios.create({
  baseURL,
  timeout: 90000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiFiles = axios.create({
  baseURL,
  timeout: 90000,
});
