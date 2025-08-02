// src/utils/api.js
import axios from "axios";

const API_BASE_URL = "https://backend-1-zqqy.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add request interceptor to include JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      delete axios.defaults.headers.common["Authorization"];
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  register: (userData) => api.post("/auth/register", userData),
  login: (userData) => api.post("/auth/login", userData),
};

// Session endpoints
export const sessionAPI = {
  getPublicSessions: () => api.get("/sessions"),
  getMySessions: () => api.get("/my-sessions"),
  getMySession: (id) => api.get(`/my-sessions/${id}`),
  saveDraft: (sessionData) => api.post("/my-sessions/save-draft", sessionData),
  publishSession: (sessionData) =>
    api.post("/my-sessions/publish", sessionData),
};

export default api;
