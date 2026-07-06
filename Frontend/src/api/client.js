import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export const api = axios.create({
  baseURL: API_URL,
});

export const TOKEN_KEY = "url_shortener_token";

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function getShortLink(shortCode) {
  return `${API_URL}/${shortCode}`;
}

export function extractErrorMessage(error, fallback = "Something went wrong") {
  const data = error?.response?.data;
  if (!data) return fallback;
  if (typeof data.error === "string") return data.error;
  if (data.error?._errors?.length) return data.error._errors[0];
  if (data.error && typeof data.error === "object") {
    const firstField = Object.values(data.error).find(
      (v) => v && typeof v === "object" && Array.isArray(v._errors) && v._errors.length,
    );
    if (firstField) return firstField._errors[0];
  }
  return fallback;
}
