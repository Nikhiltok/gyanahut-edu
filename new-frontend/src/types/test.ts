export interface QuestionOption {
  id: string;
  option_text: string;
  order: number;
}

export interface QuestionOptionWithAnswer extends QuestionOption {
  is_correct: boolean;
}

export interface RevisionQuestion {
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
  options: QuestionOptionWithAnswer[];
  created_at: string;
}

export interface PublicQuestion {
  id: string;
  topic: string;
  topic_name: string;
  question_text: string;
  question_type: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  marks: number;
  negative_marks: number;
  image: string | null;
  language: string;
  options: QuestionOption[];
}

export interface Test {
  id: string;
  exam: string;
  exam_name: string;
  subject: string | null;
  subject_name: string | null;
  chapter: string | null;
  chapter_name: string | null;
  topic: string | null;
  topic_name: string | null;
  title: string;
  test_type: string;
  duration: number;
  total_questions: number;
  total_marks: number;
  negative_marking: boolean;
  negative_marks: number;
  start_time: string | null;
  end_time: string | null;
  max_attempts: number;
  status: string;
  is_paid: boolean;
  credit_cost: number | null;
  question_count: number;
  attempts_used: number;
  total_attempts_count: number;
  created_at: string;
}

export interface GeneratePracticePayload {
  exam: string;
  subject?: string;
  chapter?: string;
  topic?: string;
  question_count: number;
  duration: number;
}

export interface StartTestResponse {
  attempt_id: string;
  resumed: boolean;
  expired?: boolean;
  current_question_index: number;
  remaining_seconds: number;
  answers: Record<string, string>;
  questions: PublicQuestion[];
}

export interface SubmitTestResponse {
  attempt_id: string;
  score: number;
  correct: number;
  wrong: number;
  skipped: number;
  accuracy: number;
}

export interface PracticeQuota {
  free_attempts_per_month: number;
  free_used_this_month: number;
  free_remaining_this_month: number;
  free_max_questions: number;
}

export interface ResultAnswer {
  id: string;
  question: string;
  question_text: string;
  subject_name: string;
  question_type_display: string;
  explanation: string;
  marks: string;
  negative_marks: string;
  selected_option: string | null;
  selected_option_text: string | null;
  correct_option_text: string | null;
  is_correct: boolean;
  time_taken: number | null;
}

export interface SubjectBreakdown {
  subject: string;
  correct: number;
  wrong: number;
  total: number;
}

export interface TestResult {
  id: string;
  test: string;
  test_title: string;
  exam_name: string;
  score: number;
  total_marks: string;
  correct_answers: number;
  wrong_answers: number;
  skipped_answers: number;
  accuracy: number;
  time_taken: number;
  started_at: string;
  submitted_at: string;
  rank: number | null;
  total_candidates: number;
  avg_time_taken: number | null;
  subject_breakdown: SubjectBreakdown[];
  answers: ResultAnswer[];
}
