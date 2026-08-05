import { API_BASE_URL } from "@/constants/config";

// Django returns media URLs relative to its own origin (e.g. "/media/...") —
// resolve those against the API's origin, not the frontend's, or the asset 404s.
const API_ORIGIN = API_BASE_URL.replace(/\/api\/v1\/?$/, "");

export function resolveMediaUrl(url: string | null | undefined) {
  if (!url) return null;
  return /^https?:\/\//.test(url) ? url : `${API_ORIGIN}${url}`;
}
