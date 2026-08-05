export type Difficulty = "EASY" | "MEDIUM" | "HARD";
export type QuestionType = "MCQ" | "TRUE_FALSE" | "MULTIPLE_CHOICE" | "IMAGE_BASED";

export interface QuestionOption {
  id: string;
  option_text: string;
  is_correct?: boolean;
  order: number;
}

export interface Question {
  id: string;
  topic: string;
  topic_name: string;
  question_text: string;
  question_type: QuestionType;
  difficulty: Difficulty;
  explanation: string;
  marks: string;
  negative_marks: string;
  image: string | null;
  language: string;
  options: QuestionOption[];
  created_at: string;
}

export interface ImportHistoryEntry {
  id: string;
  file_name: string;
  file_format: string;
  total: number;
  success: number;
  failed: number;
  errors: { row: number; errors: string[] }[];
  status: "COMPLETED" | "FAILED";
  created_at: string;
}

export interface BulkImportResult {
  total: number;
  success: number;
  failed: number;
  errors: { row: number; errors: string[] }[];
}

export interface Bookmark {
  id: string;
  question: string;
  question_detail: Question;
  created_at: string;
}

export interface DifficultMark {
  id: string;
  question: string;
  created_at: string;
}
