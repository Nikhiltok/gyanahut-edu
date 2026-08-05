export interface AdminStudent {
  id: string;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: "STUDENT";
  profile_image: string | null;
  state: string;
  city: string;
  target_exams: { id: string; name: string }[];
  is_active: boolean;
  created_at: string;
}
