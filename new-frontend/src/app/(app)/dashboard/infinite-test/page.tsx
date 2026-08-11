"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { getProfile } from "@/services/auth.service";
import { getChapters, getExams, getSubjects, getTopics } from "@/services/exam.service";
import { getPracticeQuota } from "@/services/payments.service";
import { generatePracticeTest } from "@/services/tests.service";
import { getErrorMessage } from "@/lib/api-error";
import { cn } from "@/lib/utils";

const QUESTION_COUNTS = [10, 20, 50, 100];

const INFO_CARDS = [
  { title: "AI smart selection", body: "Adaptive picks based on your weak spots." },
  { title: "Instant performance", body: "Results and accuracy the moment you submit." },
  { title: "Updated bank", body: "10,000+ fresh questions added regularly." },
];

export default function InfiniteTestPage() {
  const router = useRouter();
  const [examId, setExamId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [chapterId, setChapterId] = useState("");
  const [topicId, setTopicId] = useState("");
  const [questionCount, setQuestionCount] = useState(20);
  const [duration, setDuration] = useState(60);

  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: getProfile });
  const { data: allExams } = useQuery({ queryKey: ["exams"], queryFn: () => getExams() });

  const targetExamIds = new Set((profile?.target_exams ?? []).map((exam) => exam.id));
  const exams =
    targetExamIds.size > 0 ? (allExams ?? []).filter((exam) => targetExamIds.has(exam.id)) : allExams;
  const { data: subjects } = useQuery({
    queryKey: ["subjects", examId],
    queryFn: () => getSubjects(examId),
    enabled: !!examId,
  });
  const { data: chapters } = useQuery({
    queryKey: ["chapters", subjectId],
    queryFn: () => getChapters(subjectId),
    enabled: !!subjectId,
  });
  const { data: topics } = useQuery({
    queryKey: ["topics", chapterId],
    queryFn: () => getTopics(chapterId),
    enabled: !!chapterId,
  });
  const { data: quota } = useQuery({ queryKey: ["practice-quota"], queryFn: getPracticeQuota });

  const generateMutation = useMutation({
    mutationFn: generatePracticeTest,
    onSuccess: (test) => {
      toast.success("Practice test generated");
      router.push(`/exam-taking/${test.id}`);
    },
    onError: (error) => toast.error(getErrorMessage(error, "Could not generate practice test.")),
  });

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!examId) {
      toast.error("Pick an exam to continue.");
      return;
    }
    generateMutation.mutate({
      exam: examId,
      subject: subjectId || undefined,
      chapter: chapterId || undefined,
      topic: topicId || undefined,
      question_count: questionCount,
      duration,
    });
  }

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <Card className="p-6">
        <h2 className="font-heading text-base font-semibold text-fg">Generate a practice set</h2>

        <form className="mt-5 space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-4">
            <Select
              value={examId}
              onChange={(e) => {
                setExamId(e.target.value);
                setSubjectId("");
                setChapterId("");
                setTopicId("");
              }}
              required
            >
              <option value="">Exam type</option>
              {(exams ?? []).map((exam) => (
                <option key={exam.id} value={exam.id}>
                  {exam.name}
                </option>
              ))}
            </Select>

            <Select
              value={subjectId}
              onChange={(e) => {
                setSubjectId(e.target.value);
                setChapterId("");
                setTopicId("");
              }}
              disabled={!examId}
            >
              <option value="">Subject (or full exam)</option>
              {(subjects ?? []).map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </Select>

            <Select
              value={chapterId}
              onChange={(e) => {
                setChapterId(e.target.value);
                setTopicId("");
              }}
              disabled={!subjectId}
            >
              <option value="">Chapter (or full subject)</option>
              {(chapters ?? []).map((chapter) => (
                <option key={chapter.id} value={chapter.id}>
                  {chapter.name}
                </option>
              ))}
            </Select>

            <Select value={topicId} onChange={(e) => setTopicId(e.target.value)} disabled={!chapterId}>
              <option value="">Topic (or full chapter)</option>
              {(topics ?? []).map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium text-label-fg">Number of questions</p>
            <div className="flex gap-2.5">
              {QUESTION_COUNTS.map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setQuestionCount(count)}
                  className={cn(
                    "h-[34px] w-[60px] rounded-md border text-[12.5px] font-medium transition-colors",
                    questionCount === count
                      ? "border-gold bg-gold text-gold-ink"
                      : "border-input-border bg-input-bg text-fg",
                  )}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium text-label-fg">Duration (minutes)</p>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                min={1}
                max={300}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-[140px]"
              />
              <span className="text-[11px] text-muted-fg">Suggested: 3 minutes per question.</span>
            </div>
          </div>

          {quota && (
            <p className="text-[11.5px] text-muted-fg">
              {quota.free_remaining_this_month > 0
                ? `Free (${quota.free_remaining_this_month} of ${quota.free_attempts_per_month} remaining this month, up to ${quota.free_max_questions} questions)`
                : "Free quota used up this month — this will use wallet credits."}
            </p>
          )}

          <Button type="submit" size="lg" disabled={generateMutation.isPending}>
            {generateMutation.isPending ? "Generating..." : "Generate infinite test"}
          </Button>
        </form>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {INFO_CARDS.map((card) => (
          <Card key={card.title} className="p-5">
            <h3 className="text-[12.5px] font-semibold text-fg">{card.title}</h3>
            <p className="mt-1.5 text-[10.5px] text-muted-fg">{card.body}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
