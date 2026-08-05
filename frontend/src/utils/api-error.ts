import { isAxiosError } from "axios";

import type { ApiError } from "@/types/auth";

export function getApiErrorMessage(error: unknown, fallback = "Something went wrong. Please try again."): string {
  if (isAxiosError<ApiError>(error)) {
    const data = error.response?.data;
    if (data?.message) {
      const firstFieldError = data.errors ? Object.values(data.errors)[0] : undefined;
      const detail = Array.isArray(firstFieldError) ? firstFieldError[0] : firstFieldError;
      return detail ? `${data.message}: ${detail}` : data.message;
    }
  }
  return fallback;
}
