import type { Profile } from "@/types/auth";

export interface AdminStudent extends Profile {
  is_active: boolean;
  created_at: string;
}
