export interface AdminQuestionOption {
  id?: string;
  option_text: string;
  is_correct: boolean;
  order: number;
}

export interface AdminQuestion {
  id: string;
  topic: string;
  topic_name: string;
  question_text: string;
  question_type: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  explanation: string;
  marks: number;
  negative_marks: number;
  image: string | null;
  language: string;
  options: AdminQuestionOption[];
  created_at: string;
}

export interface AdminQuestionPayload {
  topic: string;
  question_text: string;
  question_type: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  explanation: string;
  marks: number;
  negative_marks: number;
  language: string;
  options: AdminQuestionOption[];
}
