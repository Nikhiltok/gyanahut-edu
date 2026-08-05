import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/constants/config";

const SESSION_COOKIE = "gh_auth";

export function storeTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  document.cookie = `${SESSION_COOKIE}=1; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0`;
}

export function getAccessToken() {
  return typeof window !== "undefined" ? localStorage.getItem(ACCESS_TOKEN_KEY) : null;
}

export function getRefreshToken() {
  return typeof window !== "undefined" ? localStorage.getItem(REFRESH_TOKEN_KEY) : null;
}

export function setAccessToken(accessToken: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
}
