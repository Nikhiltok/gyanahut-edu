import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

import { API_BASE_URL } from "./config";
import { clearTokens, getAccessToken, getRefreshToken, setAccessToken } from "./token-storage";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface RetryableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let isRefreshing = false;
let pendingQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function flushQueue(error: unknown, token: string | null) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (token) resolve(token);
    else reject(error);
  });
  pendingQueue = [];
}

// Set by AuthContext so the interceptor can force a logout/navigation reset
// when the refresh token itself is dead — the API layer has no navigator.
let onSessionExpired: (() => void) | null = null;
export function setOnSessionExpired(handler: () => void) {
  onSessionExpired = handler;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableConfig | undefined;

    if (error.response?.status !== 401 || !originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    const refreshToken = await getRefreshToken();
    if (!refreshToken) {
      return Promise.reject(error);
    }
    if (originalRequest.url?.includes("/auth/token/refresh/")) {
      await clearTokens();
      onSessionExpired?.();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({
          resolve: (token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          },
          reject,
        });
      });
    }

    isRefreshing = true;
    try {
      const { data } = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, { refresh: refreshToken });
      const newAccessToken = data.data.access_token as string;
      await setAccessToken(newAccessToken);
      flushQueue(null, newAccessToken);
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      flushQueue(refreshError, null);
      await clearTokens();
      onSessionExpired?.();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
