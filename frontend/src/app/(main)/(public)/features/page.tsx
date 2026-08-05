import {
  BarChart3,
  BookmarkCheck,
  Clock,
  ListChecks,
  ShieldCheck,
  Trophy,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FEATURES = [
  {
    icon: ListChecks,
    title: "Topic-wise Practice",
    description:
      "Drill down from Exam → Subject → Chapter → Topic and practice as many questions as you need, with instant right/wrong feedback and explanations.",
  },
  {
    icon: Clock,
    title: "Full-length Mock Tests",
    description:
      "Simulate the real exam with a countdown timer, question palette, mark-for-review, and auto-submit on timeout — just like the actual exam day.",
  },
  {
    icon: ShieldCheck,
    title: "Accurate Negative Marking",
    description:
      "Every mock test respects the exam's real marking scheme, including negative marking, so your practice score reflects your real exam score.",
  },
  {
    icon: BarChart3,
    title: "Detailed Analytics",
    description:
      "After every attempt, see your subject-wise accuracy, weak and strong topics, and a performance graph tracking your progress over time.",
  },
  {
    icon: Trophy,
    title: "All-India Ranking",
    description:
      "Compare your score nationally, exam-wise, weekly, or monthly — and see exactly where you stand against other aspirants.",
  },
  {
    icon: BookmarkCheck,
    title: "Bookmarks & Revision",
    description:
      "Bookmark tricky questions while practicing, and revisit every wrong or difficult question later from one place before your exam.",
  },
];

export default function FeaturesPage() {
  return (
    <div className="flex-1">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#f97316] via-[#f97316] to-[#7f1d1d] px-6 py-16 text-center text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_15%_20%,white,transparent_35%),radial-gradient(circle_at_85%_70%,white,transparent_30%)]"
        />
        <div className="relative">
          <h1 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to crack your exam
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-white/85">
            Gyanahut Edu brings practice, mock tests, analytics, and ranking together in one platform built
            for SSC, UPSC, Banking, Railway, and other government exam aspirants.
          </p>
          <div className="mt-8">
            <Button size="lg" variant="secondary" render={<Link href="/register" />}>
              Start Practicing Free
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <Card
              key={feature.title}
              className="group border-transparent shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10"
            >
              <CardHeader>
                <span className="mb-1 flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="size-5" />
                </span>
                <CardTitle className="pt-1 text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t bg-muted/30 px-6 py-16 text-center">
        <h2 className="text-2xl font-semibold">Ready to start your preparation?</h2>
        <p className="mx-auto mt-2 max-w-md text-muted-foreground">
          Create a free account and start practicing topic-wise questions in minutes.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button size="lg" render={<Link href="/register" />}>
            Create Free Account
          </Button>
          <Button size="lg" variant="outline" render={<Link href="/categories" />}>
            Browse Exams
          </Button>
        </div>
      </section>
    </div>
  );
}
