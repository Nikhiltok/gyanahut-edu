export interface ImportHistory {
  id: string;
  file_name: string;
  file_format: string;
  total: number;
  success: number;
  failed: number;
  errors: Record<string, unknown> | unknown[];
  status: "COMPLETED" | "FAILED";
  created_at: string;
}

export interface AIGenerationJob {
  id: string;
  topic: string;
  topic_name: string;
  difficulty: string;
  target_count: number;
  generated_count: number;
  duplicate_count: number;
  status: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED" | "STOPPED";
  error_message: string;
  created_at: string;
}
