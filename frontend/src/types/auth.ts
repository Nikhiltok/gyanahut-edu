export type UserRole = "SUPER_ADMIN" | "ADMIN" | "STUDENT";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  otp_code: string;
  target_exams?: string[];
  password: string;
}

export interface LoginResponseData {
  access_token: string;
  refresh_token: string;
  user: AuthUser;
}

export interface Profile {
  id: string;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: UserRole;
  profile_image: string | null;
  state: string;
  city: string;
  target_exams: { id: string; name: string }[];
  date_of_birth: string | null;
  gender: string | null;
  education: string | null;
  phone_verified: boolean;
  email_verified: boolean;
}

export interface ProfileUpdatePayload {
  first_name?: string;
  last_name?: string;
  phone?: string;
  state?: string;
  city?: string;
  target_exams?: string[];
  date_of_birth?: string | null;
  gender?: string;
  education?: string;
}

export interface ChangePasswordPayload {
  old_password: string;
  new_password: string;
}

export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiError {
  success: false;
  message: string;
  errors: Record<string, string[] | string>;
}
