export interface SubjectBreakdown {
  subject: string;
  correct: number;
  wrong: number;
  total: number;
}

export interface AnswerDetail {
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
  time_taken: number;
}

export interface TestResult {
  id: string;
  test: string;
  test_title: string;
  exam_name: string;
  score: string;
  total_marks: string;
  correct_answers: number;
  wrong_answers: number;
  skipped_answers: number;
  accuracy: string;
  time_taken: number;
  started_at: string;
  submitted_at: string;
  rank: number | null;
  total_candidates: number;
  avg_time_taken: number | null;
  subject_breakdown: SubjectBreakdown[];
  answers: AnswerDetail[];
}

export interface AttemptSummary {
  id: string;
  test: string;
  test_title: string;
  exam_name: string;
  score: string;
  correct_answers: number;
  wrong_answers: number;
  skipped_answers: number;
  accuracy: string;
  time_taken: number;
  started_at: string;
  submitted_at: string;
}

export interface LeaderboardEntry {
  student: string;
  name: string;
  rank: number;
  total_score: number;
  total_attempt: number;
  accuracy: number;
}
