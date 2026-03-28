import axios from "axios";
import { message } from "antd";
import { refreshTokenApi } from "../features/auth/auth.api";

const BASE_URL = "https://localhost:7261/api";

const api = axios.create({ baseURL: BASE_URL });

// ── Request: attach access token ──────────────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Token refresh queue ────────────────────────────────────────────────────────
let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: any) => void }> = [];

const processQueue = (error: any, token: string | null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token!);
  });
  failedQueue = [];
};

// ── Response interceptor ───────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => {
    const isAuthEndpoint =
      response.config.url?.includes("/users/login") ||
      response.config.url?.includes("/users/refresh");

    // Backend may return PascalCase (error middleware) or camelCase (controllers)
    const isFailure =
      response.data?.Success === false || response.data?.success === false;

    if (isFailure) {
      const msg = response.data.Message || response.data.message || "Operation failed";
      if (!isAuthEndpoint) {
        message.error(msg);
      }
      return Promise.reject(new Error(msg));
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 — attempt token refresh (skip for auth endpoints)
    const isAuthEndpoint =
      originalRequest.url?.includes("/users/login") ||
      originalRequest.url?.includes("/users/refresh");

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Queue this request until refresh completes
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const data = await refreshTokenApi(refreshToken);

        localStorage.setItem("token", data.token);
        localStorage.setItem("refreshToken", data.refreshToken);

        api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        originalRequest.headers.Authorization = `Bearer ${data.token}`;

        processQueue(null, data.token);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Other errors — skip global toast for auth endpoints (login handles its own errors)
    if (!isAuthEndpoint) {
      const msg = error.response?.data?.Message || error.response?.data?.message;
      if (msg) {
        message.error(msg);
      } else if (error.response?.status !== 401) {
        message.error("Something went wrong");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
