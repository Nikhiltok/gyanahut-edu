import type {
  ApiSuccess,
  ChangePasswordPayload,
  LoginPayload,
  LoginResponseData,
  Profile,
  ProfileUpdatePayload,
  RegisterPayload,
} from "@/types/auth";
import { clearTokens, getRefreshToken, storeTokens } from "@/utils/token-storage";

import { api } from "./api";
import { queryClient } from "./query-client";

export { clearTokens, storeTokens };

export async function register(payload: RegisterPayload) {
  const { data } = await api.post<ApiSuccess<{ user_id: string; email: string }>>(
    "/auth/register/",
    payload,
  );
  return data.data;
}

export async function sendPhoneOtp(phone: string) {
  const { data } = await api.post<ApiSuccess<{ phone: string; debug_otp?: string }>>("/auth/otp/send/", {
    phone,
  });
  return data.data;
}

export async function login(payload: LoginPayload) {
  const { data } = await api.post<ApiSuccess<LoginResponseData>>("/auth/login/", payload);
  storeTokens(data.data.access_token, data.data.refresh_token);
  await queryClient.resetQueries();
  return data.data;
}

export async function logout() {
  const refresh = getRefreshToken();
  try {
    if (refresh) {
      await api.post("/auth/logout/", { refresh });
    }
  } finally {
    clearTokens();
    await queryClient.resetQueries();
  }
}

export async function forgotPassword(email: string) {
  const { data } = await api.post<ApiSuccess<Record<string, never>>>("/auth/password/forgot/", {
    email,
  });
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

export async function updateProfileAvatar(file: File) {
  const formData = new FormData();
  formData.append("profile_image", file);
  const { data } = await api.patch<ApiSuccess<Profile>>("/users/profile/", formData, {
    headers: { "Content-Type": undefined },
  });
  return data.data;
}

export async function changePassword(payload: ChangePasswordPayload) {
  const { data } = await api.post<ApiSuccess<Record<string, never>>>("/auth/password/change/", payload);
  return data;
}
