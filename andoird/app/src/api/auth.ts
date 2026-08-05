import type { ApiSuccess, LoginPayload, LoginResponseData, Profile, ProfileUpdatePayload, RegisterPayload } from "../types/auth";
import { clearTokens, getRefreshToken, storeTokens } from "./token-storage";

import { api } from "./client";
import { queryClient } from "./query-client";

export { clearTokens, storeTokens };

export async function register(payload: RegisterPayload) {
  const { data } = await api.post<ApiSuccess<{ user_id: string; email: string }>>("/auth/register/", payload);
  return data.data;
}

export async function sendPhoneOtp(phone: string) {
  const { data } = await api.post<ApiSuccess<{ phone: string; debug_otp?: string }>>("/auth/otp/send/", { phone });
  return data.data;
}

export async function login(payload: LoginPayload) {
  const { data } = await api.post<ApiSuccess<LoginResponseData>>("/auth/login/", payload);
  await storeTokens(data.data.access_token, data.data.refresh_token);
  await queryClient.resetQueries();
  return data.data;
}

export async function logout() {
  const refresh = await getRefreshToken();
  try {
    if (refresh) {
      await api.post("/auth/logout/", { refresh });
    }
  } finally {
    await clearTokens();
    await queryClient.resetQueries();
  }
}

export async function forgotPassword(email: string) {
  const { data } = await api.post<ApiSuccess<Record<string, never>>>("/auth/password/forgot/", { email });
  return data;
}

export async function resetPassword(uid: string, token: string, newPassword: string) {
  const { data } = await api.post<ApiSuccess<Record<string, never>>>("/auth/password/reset/", {
    uid,
    token,
    new_password: newPassword,
  });
  return data;
}

export async function getProfile() {
  const { data } = await api.get<ApiSuccess<Profile>>("/users/profile/");
  return data.data;
}

export async function updateProfile(payload: ProfileUpdatePayload) {
  const { data } = await api.patch<ApiSuccess<Profile>>("/users/profile/", payload);
  return data.data;
}

export async function changePassword(payload: { old_password: string; new_password: string }) {
  const { data } = await api.post<ApiSuccess<Record<string, never>>>("/auth/password/change/", payload);
  return data;
}
