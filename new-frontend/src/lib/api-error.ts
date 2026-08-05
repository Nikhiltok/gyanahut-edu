import { isAxiosError } from "axios";

import type { ApiError } from "@/types/auth";

export function getErrorMessage(error: unknown, fallback = "Something went wrong. Please try again.") {
  if (isAxiosError<ApiError>(error)) {
    const data = error.response?.data;
    if (data?.errors) {
      const firstError = Object.values(data.errors)[0];
      if (firstError) {
        return Array.isArray(firstError) ? firstError[0] : firstError;
      }
    }
    if (data?.message) return data.message;
  }
  return fallback;
}
