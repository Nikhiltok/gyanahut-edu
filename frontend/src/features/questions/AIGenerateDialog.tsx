"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAIJob, startAIGeneration, stopAIGeneration } from "@/services/ai-question.service";
import { getApiErrorMessage } from "@/utils/api-error";
import type { AIGenerationStatus } from "@/types/ai-question";
import type { Topic } from "@/types/exam";

const STATUS_LABEL: Record<AIGenerationStatus, string> = {
  PENDING: "Queued",
  RUNNING: "Generating...",
  COMPLETED: "Completed",
  FAILED: "Failed",
  STOPPED: "Stopped",
};

const STATUS_BADGE: Record<AIGenerationStatus, "default" | "secondary" | "destructive"> = {
  PENDING: "secondary",
  RUNNING: "secondary",
  COMPLETED: "default",
  FAILED: "destructive",
  STOPPED: "secondary",
};

const IN_PROGRESS: AIGenerationStatus[] = ["PENDING", "RUNNING"];

interface AIGenerateDialogProps {
  topic: Topic | null;
  onOpenChange: (open: boolean) => void;
}

export function AIGenerateDialog({ topic, onOpenChange }: AIGenerateDialogProps) {
  const queryClient = useQueryClient();
  const [count, setCount] = useState(10);
  const [difficulty, setDifficulty] = useState("MEDIUM");
  const [jobId, setJobId] = useState<string | null>(null);

  const { data: job } = useQuery({
    queryKey: ["ai-job", jobId],
    queryFn: () => getAIJob(jobId!),
    enabled: !!jobId,
    refetchInterval: (query) =>
      query.state.data && IN_PROGRESS.includes(query.state.data.status) ? 1500 : false,
  });

  const startMutation = useMutation({
    mutationFn: () => startAIGeneration({ topic_id: topic!.id, count, difficulty }),
    onSuccess: (data) => {
      setJobId(data.id);
      toast.success("AI question generation started");
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const stopMutation = useMutation({
    mutationFn: () => stopAIGeneration(jobId!),
    onSuccess: () => toast.success("Stop requested"),
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  function handleClose(open: boolean) {
    if (!open) {
      if (jobId) {
        queryClient.invalidateQueries({ queryKey: ["admin-questions"] });
      }
      setJobId(null);
      setCount(10);
      setDifficulty("MEDIUM");
    }
    onOpenChange(open);
  }

  const isRunning = job ? IN_PROGRESS.includes(job.status) : false;
  const progress = job ? Math.min(100, Math.round((job.generated_count / job.target_count) * 100)) : 0;

  return (
    <Dialog open={!!topic} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Questions with AI</DialogTitle>
          <DialogDescription>
            {topic ? `Topic: ${topic.name}. ` : ""}
            AI will generate unique MCQs and skip anything that duplicates an existing question for this
            topic.
          </DialogDescription>
        </DialogHeader>

        {!job ? (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="ai-count">How many questions?</Label>
              <Input
                id="ai-count"
                type="number"
                min={1}
                max={50}
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Difficulty</Label>
              <Select
                items={[
                  { value: "EASY", label: "Easy" },
                  { value: "MEDIUM", label: "Medium" },
                  { value: "HARD", label: "Hard" },
                ]}
                value={difficulty}
                onValueChange={(v) => setDifficulty(v ?? "MEDIUM")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EASY">Easy</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HARD">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant={STATUS_BADGE[job.status]}>{STATUS_LABEL[job.status]}</Badge>
              <span className="text-sm text-muted-foreground">
                {job.generated_count} / {job.target_count} generated
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
            {job.duplicate_count > 0 && (
              <p className="text-xs text-muted-foreground">
                {job.duplicate_count} duplicate{job.duplicate_count === 1 ? "" : "s"} skipped
              </p>
            )}
            {job.status === "FAILED" && job.error_message && (
              <p className="text-sm text-destructive">{job.error_message}</p>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)}>
            Close
          </Button>
          {!job && (
            <Button onClick={() => startMutation.mutate()} disabled={startMutation.isPending || !count}>
              {startMutation.isPending ? "Starting..." : "Start"}
            </Button>
          )}
          {job && isRunning && (
            <Button variant="destructive" onClick={() => stopMutation.mutate()} disabled={stopMutation.isPending}>
              Stop
            </Button>
          )}
          {job && !isRunning && (
            <Button onClick={() => setJobId(null)}>Generate More</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
