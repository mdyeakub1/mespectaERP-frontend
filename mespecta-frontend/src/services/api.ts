import axios from "axios";
import { showError } from "../utils/message";
import { refreshTokenApi } from "../features/auth/auth.api";
import { store } from "../app/store";
import { clearAuth, setMustChangePassword } from "../features/auth/auth.slice";

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

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

// ── Deduplication: suppress identical toasts fired within 500 ms ──────────────
let _lastMsg = "";
let _lastAt  = 0;

function safeShowError(msg: string) {
  const now = Date.now();
  if (msg === _lastMsg && now - _lastAt < 500) return;
  _lastMsg = msg;
  _lastAt  = now;
  showError(msg);
}

// ── Response interceptor ───────────────────────────────────────────────────────
api.interceptors.response.use(
  // ── Success path: pass through, but catch 200 responses that signal failure ──
  (response) => {
    const body = response.data;
    const isAuthEndpoint =
      response.config.url?.endsWith("/auth/login") ||
      response.config.url?.endsWith("/auth/refresh");

    // Some endpoints still return HTTP 200 with success:false
    if (body?.success === false && !isAuthEndpoint) {
      const msg = body.message || "Operation failed";
      safeShowError(msg);
      return Promise.reject(new Error(msg));
    }
    return response;
  },

  // ── Error path ────────────────────────────────────────────────────────────────
  async (error) => {
    const originalRequest = error.config;
    const url  = originalRequest?.url ?? "";
    const status = error.response?.status;

    // Endpoints whose 401 means "wrong credentials" — do NOT trigger token refresh,
    // but DO show a toast (same as any other error).
    const isCredentialEndpoint =
      url.endsWith("/auth/login") ||
      url.endsWith("/auth/change-password");

    // Endpoints that handle their own error UI — never show a toast from here.
    const isSilentEndpoint =
      url.endsWith("/auth/login") ||
      url.endsWith("/auth/refresh");

    // ── 401: attempt silent token refresh (only for real session-expiry 401s) ──
    if (status === 401 && !originalRequest._retry && !isCredentialEndpoint) {
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        store.dispatch(clearAuth());
        window.location.replace("/#/login");
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest._retry = true;
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const data = await refreshTokenApi(refreshToken);
        if (!data?.token) throw new Error("No token in refresh response");

        localStorage.setItem("token", data.token);
        localStorage.setItem("refreshToken", data.refreshToken);
        store.dispatch(setMustChangePassword(data.mustChangePassword));
        api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        originalRequest.headers.Authorization = `Bearer ${data.token}`;

        processQueue(null, data.token);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        store.dispatch(clearAuth());
        window.location.replace("/#/login");
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // ── All other errors: show ONE toast ──────────────────────────────────────
    // • Skip silent endpoints (login/refresh handle their own UI)
    // • Skip generic 401s that fell through (refresh just handled/redirected them)
    const isGeneric401 = status === 401 && !isCredentialEndpoint;
    if (!isSilentEndpoint && !isGeneric401) {
      const msg = error.response?.data?.message || "Something went wrong";
      safeShowError(msg);
    }

    return Promise.reject(error);
  }
);

export default api;
