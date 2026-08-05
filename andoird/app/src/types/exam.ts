export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ExamCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  status: boolean;
  created_at: string;
}

export interface Exam {
  id: string;
  category: string;
  category_name: string;
  name: string;
  slug: string;
  description: string;
  exam_type: string;
  status: boolean;
  subjects: string[];
  created_at: string;
}

export interface Subject {
  id: string;
  exam: string;
  name: string;
  description: string;
  order: number;
  created_at: string;
}

export interface Chapter {
  id: string;
  subject: string;
  name: string;
  order: number;
  created_at: string;
}

export interface Topic {
  id: string;
  chapter: string;
  name: string;
  description: string;
  order: number;
  created_at: string;
}
