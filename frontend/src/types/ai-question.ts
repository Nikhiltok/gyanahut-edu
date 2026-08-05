export type AIGenerationStatus = "PENDING" | "RUNNING" | "COMPLETED" | "FAILED" | "STOPPED";

export interface AIGenerationJob {
  id: string;
  topic: string;
  topic_name: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  target_count: number;
  generated_count: number;
  duplicate_count: number;
  status: AIGenerationStatus;
  error_message: string;
  created_at: string;
}
