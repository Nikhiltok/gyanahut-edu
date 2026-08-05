import type { Question, QuestionOption } from "./question";

export type TestType = "PRACTICE" | "MOCK" | "LIVE" | "PREVIOUS_YEAR";
export type TestStatus = "DRAFT" | "SCHEDULED" | "LIVE" | "COMPLETED" | "ARCHIVED";

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
  test_type: TestType;
  duration: number;
  total_questions: number;
  total_marks: string;
  negative_marking: boolean;
  negative_marks: string;
  start_time: string | null;
  end_time: string | null;
  max_attempts: number;
  status: TestStatus;
  is_paid: boolean;
  credit_cost: number | null;
  question_count: number;
  attempts_used: number;
  total_attempts_count: number;
  created_at: string;
}

export interface TestQuestion {
  id: string;
  question: string;
  question_text: string;
  explanation: string;
  options: QuestionOption[];
  order: number;
}

export interface StartTestResponse {
  attempt_id: string;
  questions: Question[];
  resumed: boolean;
  current_question_index: number;
  remaining_seconds: number;
  answers: Record<string, string | null>;
}

export interface ExpiredAttemptResponse {
  attempt_id: string;
  expired: true;
  score: number;
  correct: number;
  wrong: number;
  skipped: number;
  accuracy: number;
}

export interface SubmitTestResponse {
  score: number;
  correct: number;
  wrong: number;
  skipped: number;
  accuracy: number;
  attempt_id: string;
}

export interface AnswerPayload {
  question: string;
  option?: string | null;
}

export interface TestAttemptAdmin {
  id: string;
  student: string;
  student_name: string;
  student_email: string;
  score: string;
  correct_answers: number;
  wrong_answers: number;
  skipped_answers: number;
  accuracy: string;
  time_taken: number;
  started_at: string;
  submitted_at: string;
}
