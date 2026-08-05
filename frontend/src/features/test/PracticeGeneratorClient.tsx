"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { BarChart3, Bell, HelpCircle, History, Rocket, Timer as TimerIcon, Wand2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { GradientBanner } from "@/components/common/GradientBanner";
import { UserAvatar } from "@/components/common/UserAvatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getProfile } from "@/services/auth.service";
import { getChapters, getSubjects, getTopics } from "@/services/exam.service";
import { getPracticeQuota } from "@/services/payments.service";
import { generatePracticeTest } from "@/services/test.service";
import { getApiErrorMessage } from "@/utils/api-error";

const HIGHLIGHTS = [
  {
    icon: Wand2,
    title: "AI Smart Selection",
    description: "Questions are selected based on your previous weak areas and common exam patterns.",
  },
  {
    icon: BarChart3,
    title: "Instant Performance",
    description: "Get deep analytical reports immediately after the test.",
  },
  {
    icon: History,
    title: "Updated Bank",
    description: "Access a growing question bank kept current with the latest syllabus.",
  },
];

// Sentinel for "no narrower scope" — Select can't carry an empty string value.
const FULL_SCOPE = "__FULL__";
const QUESTION_COUNT_OPTIONS = [10, 20, 50, 100];

export function PracticeGeneratorClient() {
  const router = useRouter();
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: getProfile });

  const [examId, setExamId] = useState("");
  const [subjectId, setSubjectId] = useState(FULL_SCOPE);
  const [chapterId, setChapterId] = useState(FULL_SCOPE);
  const [topicId, setTopicId] = useState(FULL_SCOPE);
  const [questionCount, setQuestionCount] = useState(20);
  const [duration, setDuration] = useState(30);

  const { data: quota } = useQuery({ queryKey: ["practice-quota"], queryFn: getPracticeQuota });
  const willBeFree = quota ? questionCount <= quota.free_max_questions && quota.free_remaining_this_month > 0 : undefined;

  const { data: subjects } = useQuery({
    queryKey: ["public-subjects", examId],
    queryFn: () => getSubjects(examId),
    enabled: !!examId,
  });
  const { data: chapters } = useQuery({
    queryKey: ["public-chapters", subjectId],
    queryFn: () => getChapters(subjectId),
    enabled: subjectId !== FULL_SCOPE,
  });
  const { data: topics } = useQuery({
    queryKey: ["public-topics", chapterId],
    queryFn: () => getTopics(chapterId),
    enabled: chapterId !== FULL_SCOPE,
  });

  const generateMutation = useMutation({
    mutationFn: () =>
      generatePracticeTest({
        exam: examId,
        subject: subjectId !== FULL_SCOPE ? subjectId : null,
        chapter: chapterId !== FULL_SCOPE ? chapterId : null,
        topic: topicId !== FULL_SCOPE ? topicId : null,
        question_count: questionCount,
        duration,
      }),
    onSuccess: (test) => {
      toast.success("Infinite test generated");
      router.push(`/test/${test.id}`);
    },
    onError: (error) => {
      if (isAxiosError<{ errors?: { shortfall?: number } }>(error) && error.response?.status === 402) {
        const params = new URLSearchParams({ redirect: "/practice/generate" });
        const shortfall = error.response.data?.errors?.shortfall;
        if (shortfall) params.set("shortfall", String(shortfall));
        router.push(`/payments/recharge?${params.toString()}`);
        return;
      }
      toast.error(getApiErrorMessage(error, "Could not generate an infinite test"));
    },
  });

  const examItems = (profile?.target_exams ?? []).map((e) => ({ value: e.id, label: e.name }));
  const subjectItems = [
    { value: FULL_SCOPE, label: "Full exam (all subjects)" },
    ...(subjects ?? []).map((s) => ({ value: s.id, label: s.name })),
  ];
  const chapterItems = [
    { value: FULL_SCOPE, label: "Full subject (all chapters)" },
    ...(chapters ?? []).map((c) => ({ value: c.id, label: c.name })),
  ];
  const topicItems = [
    { value: FULL_SCOPE, label: "Full chapter (all topics)" },
    ...(topics ?? []).map((t) => ({ value: t.id, label: t.name })),
  ];

  const headerActions = (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => toast.info("You're all caught up!")}
        className="flex size-10 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
        aria-label="Notifications"
      >
        <Bell className="size-5" />
      </button>
      <button
        type="button"
        onClick={() => toast.info("Need help? Reach out at support@gyanahut.edu")}
        className="flex size-10 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
        aria-label="Help"
      >
        <HelpCircle className="size-5" />
      </button>
      <UserAvatar name={profile?.name} imageUrl={profile?.profile_image} />
    </div>
  );

  if (profile && examItems.length === 0) {
    return (
      <div className="w-full">
        <GradientBanner className="rounded-none px-6 pt-10 pb-16 sm:px-10">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">Infinite Test</h1>
              <p className="mt-2 text-sm text-white/85">Create your custom practice session</p>
            </div>
            {headerActions}
          </div>
        </GradientBanner>
        <div className="p-8">
          <Card>
            <CardContent className="space-y-3 py-8 text-center">
              <p className="text-sm text-muted-foreground">
                You haven&apos;t set a target exam yet — add one to your profile to generate an Infinite Test.
              </p>
              <Button render={<Link href="/profile" />}>Go to Profile</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <GradientBanner className="rounded-none px-6 pt-10 pb-28 sm:px-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">Infinite Test</h1>
            <p className="mt-2 text-sm text-white/85">Create your custom practice session</p>
          </div>
          {headerActions}
        </div>
      </GradientBanner>

      <div className="relative z-10 -mt-20 space-y-6 px-6 pb-8 sm:px-10">
        <Card className="mx-auto max-w-4xl">
          <CardContent className="space-y-6 py-6">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Exam Type</Label>
                <Select
                  items={examItems}
                  value={examId}
                  onValueChange={(v) => {
                    setExamId(v ?? "");
                    setSubjectId(FULL_SCOPE);
                    setChapterId(FULL_SCOPE);
                    setTopicId(FULL_SCOPE);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your target exam" />
                  </SelectTrigger>
                  <SelectContent>
                    {examItems.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Subject</Label>
                <Select
                  items={subjectItems}
                  value={subjectId}
                  onValueChange={(v) => {
                    setSubjectId(v ?? FULL_SCOPE);
                    setChapterId(FULL_SCOPE);
                    setTopicId(FULL_SCOPE);
                  }}
                  disabled={!examId}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {subjectItems.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Chapter</Label>
                <Select
                  items={chapterItems}
                  value={chapterId}
                  onValueChange={(v) => {
                    setChapterId(v ?? FULL_SCOPE);
                    setTopicId(FULL_SCOPE);
                  }}
                  disabled={subjectId === FULL_SCOPE}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {chapterItems.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Topic</Label>
                <Select
                  items={topicItems}
                  value={topicId}
                  onValueChange={(v) => setTopicId(v ?? FULL_SCOPE)}
                  disabled={chapterId === FULL_SCOPE}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {topicItems.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Number of Questions</Label>
              <div className="flex flex-wrap gap-2">
                {QUESTION_COUNT_OPTIONS.map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setQuestionCount(count)}
                    className={
                      "rounded-full border-2 px-5 py-2 text-sm font-semibold transition-colors " +
                      (questionCount === count
                        ? "border-transparent bg-gradient-to-r from-primary to-[#721315] text-primary-foreground"
                        : "border-border bg-transparent text-muted-foreground hover:border-primary/30")
                    }
                  >
                    {count}
                  </button>
                ))}
              </div>
              {quota && (
                <p
                  className={
                    "text-xs " + (willBeFree ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground")
                  }
                >
                  {willBeFree
                    ? `Free — ${quota.free_remaining_this_month} of ${quota.free_attempts_per_month} free practice tests left this month (up to ${quota.free_max_questions} questions each).`
                    : `Costs ${questionCount} credits — free quota used up for this month, or over the ${quota.free_max_questions}-question free limit.`}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="practice-duration">Duration (Minutes)</Label>
              <div className="relative max-w-[200px]">
                <TimerIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="practice-duration"
                  type="number"
                  min={1}
                  max={300}
                  className="pl-9 text-base [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                />
              </div>
              <p className="text-xs text-muted-foreground italic">Suggested: 3 minutes per question.</p>
            </div>

            <Button
              size="lg"
              className="h-14 w-full bg-gradient-to-r from-primary to-[#721315] text-base font-semibold hover:opacity-90"
              disabled={!examId || generateMutation.isPending}
              onClick={() => generateMutation.mutate()}
            >
              <Rocket className="size-4" />
              {generateMutation.isPending ? "Generating..." : "Generate Infinite Test"}
            </Button>
          </CardContent>
        </Card>

        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
          {HIGHLIGHTS.map((item) => (
            <div key={item.title} className="space-y-2 rounded-xl border bg-muted/30 p-4">
              <item.icon className="size-6 text-primary" />
              <h3 className="font-heading text-sm font-semibold">{item.title}</h3>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
